import express from "express"
import fs from 'fs'
const app = express()
import http from 'http'
import dotenv from "dotenv"
import cors from "cors"
import pool from "../dbconnect"
import { Server } from 'socket.io'
import { v4 as uuidv4 } from "uuid";
import * as mediasoup from "mediasoup";
import { AppData, RtpCapabilities } from "mediasoup-client/lib/types"
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
let RTPCapabilities: RtpCapabilities;
let producer: any;
let viewer: any;
let mediasoupWorker: any;
let mediasoupRouter: any;
let producerTransport: any;
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
                RTPCapabilities = mediasoupRouter.rtpCapabilities
                socket.emit('GetRTPCapabilities', { RTPCapabilities }, key)
                console.log("worker created");
            })
        } catch (error) {
            console.log(error);
        }
    })

    socket.on('createWebRTCTransport', async ({ sender }, callback: any) => {
        if (sender == true) {
            producerTransport = await createTransport(callback)
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
        await producerTransport.connect({ dtlsParameters })
        console.log("transportConnected");

    })

    // socket.on('transportViewerConnect', async ({dtlsParameters}) => {
    //     await viewerTransport.connect({dtlsParameters})
    //     console.log("transportViewerConnect called");
    // })
    // socket.on('consume', async ({ rtpCapabilities }, callback) => {
    //     try {
    //         // if (mediasoupRouter.canConsume({
    //         //     producerId: producer.id,
    //         //     rtpCapabilities
    //         // })) {
    //             console.log producer.id, rtpCapabilities);

    //             viewer = await viewerTransport.consume({
    //                 producerId: producer.id,
    //                 rtpCapabilities,
    //                 paused: true
    //             })
    //             console.log("Viewer",viewer);

    //             viewer.on('transportclose', () => {
    //                 console.log("transport close of viewer");
    //             })

    //             viewer.on('producerclose', () => {
    //                 console.log("producer close of viewer");
    //             })

    //             const params = {
    //                 id: viewer.id,
    //                 producerId: producer.id,
    //                 kind: viewer.kind,
    //                 rtpParameters: viewer.rtpParameters
    //             }
    //             console.log("Params to send", params);

    //             callback({params})
    //     // }
    //     } catch (error: any) {
    //         console.log(error.message);
    //         callback({
    //             params: {
    //                 error: error
    //             }
    //         })
    //     }
    // })
    // socket.on('consumerResume', async () => {
    //     console.log("Consumer resume");
    //     await producer.resume()
    // })

    socket.on('getRtp', () => {
        socket.emit('consumerRTP', RTPCapabilities)
    })

    socket.on('transportViewerConnect', async ({ dtlsParameters }) => {
        await viewerTransport.connect({ dtlsParameters })
        console.log("transportViewerConnect called");
    })

    socket.on('consume', async ({ rtpCapabilities }, callback) => {
        try {
            if (mediasoupRouter.canConsume({
                producerId: producer.id,
                rtpCapabilities
            })) {
            viewer = await viewerTransport.consume({
                producerId: producer.id,
                rtpCapabilities,
                paused: true
            })
            console.log("Viewer", viewer);

            viewer.on('transportclose', () => {
                console.log("transport close of viewer");
            })

            viewer.on('producerclose', () => {
                console.log("producer close of viewer");
            })

            const params = {
                id: viewer.id,
                producerId: producer.id,
                kind: viewer.kind,
                rtpParameters: viewer.rtpParameters
            }
            console.log("Params to send", params);

            callback({ params })
            }
        } catch (error: any) {
            console.log(error.message);
            callback({
                params: {
                    error: error
                }
            })
        }
    })
    socket.on('consumerResume', async () => {
        console.log("Consumer resume");
        await viewer.resume()
    })

    socket.on('transportProduce', async ({ kind, rtpParameters }, callback) => {
        producer = await producerTransport.produce({
            kind, rtpParameters
        })
        if (producer) {
            try {
                const id = uuidv4()
                const result = await pool.query('INSERT INTO Livestream( id ,title ,streamer ,producer_id) Values($1, $2, $3, $4)', [id, "Test Live Stream", "Shashank", producer.id])
                result ? console.log("Live Stream Saved") : console.log("Cant save Live Stream");
            } catch (error) {
                console.log(error);
            }
        }
        producer.on('transportclose', () => {
            console.log("transport for producer is closed");
            producer.close()
        })
        callback({
            id: producer.id
        })
    })
    // socket.on('transportViewerConnect', async ({dtlsParameters}) => {
    //     viewerTransport.connect({dtlsParameters})
    //     console.log("transportViewerConnect called");
    // })

    // socket.on('consume', async ({ rtpCapabilities }, callback) => {
    //     try {
    //         if (mediasoupRouter.canConsume({
    //             producerId: producer.id,
    //             rtpCapabilities
    //         })) {
    //             viewer = await viewerTransport.consume({
    //                 producerId: producer.id,
    //                 rtpCapabilities,
    //                 paused: true
    //             })
    //             console.log("Viewer",viewer);

    //             viewer.on('transportclose', () => {
    //                 console.log("transport close of viewer");
    //             })

    //             viewer.on('producerclose', () => {
    //                 console.log("producer close of viewer");
    //             })

    //             const params = {
    //                 id: viewer.id,
    //                 producerId: producer.id,
    //                 kind: viewer.kind,
    //                 rtpParameters: viewer.rtpParameters
    //             }
    //             console.log("Params to send", params);

    //             callback({params})
    //         }
    //     } catch (error: any) {
    //         console.log(error.message);
    //         callback({
    //             params: {
    //                 error: error
    //             }
    //         })
    //     }
    // })
    // socket.on('consumerResume', async () => {
    //     console.log("Consumer resume");
    //     await producer.resume()
    // })
    console.log("transportProduced");
})



server.listen(process.env.PORT, () => console.log("server running"))