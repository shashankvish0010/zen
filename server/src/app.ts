import express from "express"
import fs from 'fs'
const app = express()
import http from 'http'
import dotenv from "dotenv"
import cors from "cors"
import pool from "../dbconnect"
import { Server } from 'socket.io'
import * as mediasoup from "mediasoup";
import { AppData } from "mediasoup-client/lib/types"
import { RouterOptions } from "mediasoup/node/lib/types"
// const keyfile = './routers/key.pem'
// const certfile = './routers/cert.pem'
// const options: any = {
//     key: fs.readFileSync(keyfile, 'utf-8'),
//     cert: fs.readFileSync(certfile, 'utf-8')
// }
app.use(cors({
    origin: 'https://zen-gamma.vercel.app',
    methods: ['GET', 'POST', 'PUT'],
}));
const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: 'https://zen-gamma.vercel.app',
        methods: ['GET', 'POST', 'PUT'],
    }
})

dotenv.config()
app.use(require('./routers/routes'))
app.use(express.json())
let streamer: any;
let viewer: any;
let mediasoupWorker: any;
let mediasoupRouter: any;
let streamerTransport: any;
let viewerTransport: any;
let receiver: string | string[];
let sender: string | string[];
let sendersOffer: any;

const mediaCodecs: any = [
    {
        kind: "audio",
        mimeType: "audio/opus",
        clockRate: 48000,
        channels: 2
    },
    {
        kind: "video",
        mimeType: "video/VP8",
        clockRate: 90000,
        parameters: {
            'x-google-start-bitrate': 1000
        }
    }
];


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

    socket.on('livestream', async (key) => {
        try {
            mediasoup.createWorker({
                logLevel: 'debug',
                logTags: [
                    'info',
                    'ice',
                    'dtls',
                    'rtp',
                    'srtp',
                    'rtcp'
                ],
                rtcMinPort: 10000,
                rtcMaxPort: 10100,
            }).then(async (worker) => {
                mediasoupWorker = worker
                mediasoupRouter = await worker.createRouter({ mediaCodecs })
                const RTPCapabilities = mediasoupRouter.rtpCapabilities
                socket.emit('GetRTPCapabilities', { RTPCapabilities }, key)
                console.log("worker created");
            })
        } catch (error) {
            console.log(error);
        }
    })

    socket.on('createWebRTCTransport', async ({ sender }, callback: any) => {
        if (sender == true) {
            streamerTransport = await createTransport(callback)
        } else {
            viewerTransport = await createTransport(callback)
        }
    })

    const createTransport = async (callback: any) => {
        try {
            const WebRTCOptions = {
                listenIps: [
                    {
                        ip: '0.0.0.0',
                        announcedIp: '127.0.0.1'
                    }
                ],
                enableUdp: true,
                enableTcp: true,
                preferUdp: true
            }

            let transport = await mediasoupRouter.createWebRtcTransport(WebRTCOptions)
            console.log(transport)
            transport.on('dtlsstatechnage', (dtlsState: any) => {
                if (dtlsState === 'closed') {
                    transport.close()
                }
            })

            transport.on('close', () => {
                console.log('transport closed');
            })

            callback({
                params:
                {
                    id: transport.id,
                    iceParameters: transport.iceParameters,
                    iceCandidates: transport.iceCandidates,
                    dtlsParameters: transport.dtlsParameters,
                    rtpParameters: transport.rtpParameters,
                    kind: transport.kind,
                }
            })

            return transport

        } catch (error) {
            console.log(error);
        }
    }

    socket.on('transportConnect', async ({ dtlsParameters }) => {
        streamerTransport.connect({ dtlsParameters })
        console.log("transportConnected");

    })

    socket.on('consume', async ({ rtpCapabilities }, callback) => {
        try {
            if (mediasoupRouter.canConsume({
                producerId: streamer.id,
                rtpCapabilities
            })) {
                viewer = await viewerTransport.consume({
                    producerId: streamer.id,
                    rtpCapabilities,
                    paused: true
                })

                viewer.on('transportclose', () => {
                    console.log("transport close of viewer");
                })

                viewer.on('producerclose', () => {
                    console.log("producer close of viewer");
                })

                const params = {
                    id: viewer.id,
                    producerId: streamer.id,
                    kind: viewer.kind,
                    rtpParameters: viewer.rtpParameters
                }

                callback({params})
            }
        } catch (error: any) {
            console.log(error.message);
            callback({
                params: {
                    error: error
                }
            })
        }
        socket.on('consumerResume', async () => {
            console.log("Consumer resume");
            await streamer.resume()
        })
    })

    socket.on('transportProduce', async ({ kind, rtpParameters }, callback) => {
        streamer = await streamerTransport.produce({
            kind, rtpParameters
        })
        streamerTransport.on('transportclose', () => {
            console.log("transport for streamer is closed");
            streamer.close()
        })
        callback({
            id: streamer.id
        })
        socket.on('transportViewerConnect', async ({dtlsParameters}) => {
            viewerTransport.connect({dtlsParameters})
        })
        console.log("transportProduced");
    })

})

server.listen(process.env.PORT, () => console.log("server running"))