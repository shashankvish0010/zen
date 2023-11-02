import express from "express"
const app = express()
import http from 'http'
import fs from 'fs'
import dotenv from "dotenv"
import cors from "cors"
import pool from "../dbconnect"
import { Server } from 'socket.io'
import mediasoup from 'mediasoup'
const server = http.createServer(app)
app.use(cors({
    origin: "https://zen-gamma.vercel.app"
}))
const io = new Server(server, ({
    cors: {
        origin: 'https://zen-gamma.vercel.app',
        methods: ['GET', 'POST', 'PUT']
    }
}))
dotenv.config()
app.use(require('./routers/routes'))
app.use(express.json())
let mediasoupWorker: any;
let mediasoupRouter: any;
let streamerTransport: any;
let viewerTransport: any;
let receiver: string | string[];
let sender: string | string[];
let sendersOffer: any;

const mediacodecs: any = [
    {
        kind: 'audio',
        mimeType: 'audio/opus',
        clockRate: 48000,
        channels: 2
    },
    {
        kind: 'video',
        mimeType: 'video/VP8',
        clockRate: 90000,
        parameters: {
            'x-google-start-bitrate': 1000,
        }
    },
]


io.on('connection', (socket) => {
    // --------------------------------------- WebSocket connection for Zen Call || Video Call --------------------------------- 
    socket.emit('hello', socket.id)

    socket.on('call', async (zenno, from, offer) => {
        try {
            const reciverSocketId = await pool.query('SELECT socketid from Users WHERE zen_no=$1', [zenno])
            receiver = reciverSocketId.rows[0].socketid
            sender = from
            sendersOffer = offer
            io.to(receiver).emit('callercalling')
        } catch (error) {
            console.log(error);
        }
    })

    socket.on('recieved', () => {
        io.to(receiver).emit('recieverCall', { sendersOffer, sender })
    })

    socket.on('callrecieved', (answer) => {
        io.to(sender).emit('callaccepted', { answer, picked: true })
    })

    socket.on('negotiation', (offer) => {
        io.to(receiver).emit('negotiationaccept', { sendersNegoOffer: offer })
    })

    socket.on('negotiationdone', (answer) => {
        io.to(sender).emit('acceptnegotiationanswer', { receiverNegoAnswer: answer })
    })

    socket.on('done', () => { io.emit('videocall') })

    // --------------------------------------- WebSocket connection for Zen Live || Live Streaming --------------------------------- 

    socket.on('livestream', async () => {
        try {
            mediasoupWorker = await mediasoup.createWorker({
                rtcMinPort: 2000,
                rtcMaxPort: 2020,
            }).then(async () => {
                mediasoupRouter = await mediasoupWorker.createRouter({ mediacodecs })
                const RTPCapabilities = mediasoupRouter.rtpCapabilities
                socket.emit('GetRTPCapabilities', { RTPCapabilities })
                console.log("worker created");
            })
        } catch (error) {
         console.log(error);
        }
    })

    const createWebRTCTransport = async () => {
        try {
            const WebRTCOptions = {
                listenIps: [
                    {
                        ip: '127.0.0.1'
                    }
                ],
                enableUdp: true,
                enableTcp: true,
                preferUdp: true
            }
            let transport = await mediasoupRouter.createWebRTCTransport(WebRTCOptions)

            transport.on('dtlsstatechnage', (dtlsState: any) => {
                if (dtlsState === 'closed') {
                    transport.close()
                }
            })

            transport.on('close', () => {
                console.log('transport closed');
            })

            socket.emit('transportParams', {
                params:
                {
                    id: transport.id,
                    iceParameters: transport.iceParameters,
                    iceCandidates: transport.iceCandidates,
                    dtlsParameters: transport.dtlsParameters
                }
            })

            return transport

        } catch (error) {
            console.log(error);
        }
    }

    socket.on('WebRTCTransport', ({ streamer }) => {
        if (streamer) {
            streamerTransport = createWebRTCTransport()
        } else {
            viewerTransport = createWebRTCTransport()
        }
    })

    socket.on('transportConnect', async ({ dtlsParameters }) => {
        streamerTransport.connect({ dtlsParameters })
    })
})

server.listen(process.env.PORT, () => console.log("server running"))