"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const http_1 = __importDefault(require("http"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const dbconnect_1 = __importDefault(require("../dbconnect"));
const socket_io_1 = require("socket.io");
app.use((0, cors_1.default)({
    origin: 'https://zen-gamma.vercel.app',
    methods: ['GET', 'POST', 'PUT'],
}));
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: 'https://zen-gamma.vercel.app',
        methods: ['GET', 'POST', 'PUT'],
    }
});
dotenv_1.default.config();
app.use(require('./routers/routes'));
app.use(express_1.default.json());
// let RTPCapabilities: RtpCapabilities;
let producer;
let viewer;
let mediasoupWorker;
let mediasoupRouter;
let producerTransport;
let viewerTransport;
let receiver;
let sender;
let sendersOffer;
// const mediaCodecs: any = [
//     {
//         kind: "audio",
//         mimeType: "audio/opus",
//         clockRate: 48000,
//         channels: 2
//     },
//     {
//         kind: "video",
//         mimeType: "video/VP8",
//         clockRate: 90000,
//         parameters: {
//             'x-google-start-bitrate': 1000
//         }
//     },
// ];
io.on('connection', (socket) => {
    // --------------------------------------- WebSocket connection for Zen Call || Video Call --------------------------------- 
    socket.emit('hello', socket.id);
    socket.on('call', (zenno, from, offer) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const reciverSocketId = yield dbconnect_1.default.query('SELECT socketid from Users WHERE zen_no=$1', [zenno]);
            receiver = reciverSocketId.rows[0].socketid;
            sender = from;
            sendersOffer = offer;
            io.to(receiver).emit('callercalling');
        }
        catch (error) {
            console.log(error);
        }
    }));
    socket.on('recieved', () => {
        io.to(receiver).emit('recieverCall', { sendersOffer, sender });
    });
    socket.on('callrecieved', (answer) => {
        io.to(sender).emit('callaccepted', { answer, picked: true });
    });
    socket.on('done', () => { io.emit('videocall'); });
});
//     // --------------------------------------- WebSocket connection for Zen Live || Live Streaming --------------------------------- 
//     socket.on('livestream', async (key) => {
//         try {
//             mediasoup.createWorker({
//                 logLevel: 'debug',
//                 logTags: [
//                     'info',
//                     'ice',
//                     'dtls',
//                     'rtp',
//                     'srtp',
//                     'rtcp'
//                 ],
//                 rtcMinPort: 10000,
//                 rtcMaxPort: 10100,
//             }).then(async (worker) => {
//                 mediasoupWorker = worker
//                 mediasoupRouter = await worker.createRouter({ mediaCodecs })
//                 RTPCapabilities = mediasoupRouter.rtpCapabilities
//                 socket.emit('GetRTPCapabilities', { RTPCapabilities }, key)
//                 console.log("worker created");
//             })
//         } catch (error) {
//             console.log(error);
//         }
//     })
//     socket.on('createWebRTCTransport', async ({ sender }, callback: any) => {
//         if (sender == true) {
//             producerTransport = await createTransport(callback)
//         } else {
//             viewerTransport = await createTransport(callback)
//         }
//     })
//     const createTransport = async (callback: any) => {
//         try {
//             const WebRTCOptions = {
//                     listenInfos: [
//                         {
//                             protocol: "udp",
//                             ip: '127.0.0.0', // IPv4,
//                             announcedIp: '0.0.0.0', // this is my domain.site // I assign the port to be random
//                         },
//                         {
//                             protocol: "tcp",
//                             ip: '127.0.0.0', // IPv4,
//                             announcedIp: '0.0.0.0', // this is my domain.site
//                         },
//                     ],
//                 listenIps: [
//                     {
//                         ip: '0.0.0.0',
//                         announcedIp: '127.0.0.0'
//                     }
//                 ],
//                 enableUdp: true,
//                 enableTcp: true,
//                 preferUdp: true,
//             }
//             let transport = await mediasoupRouter.createWebRtcTransport(WebRTCOptions)
//             transport.on('dtlsstatechnage', (dtlsState: any) => {
//                 if (dtlsState === 'closed') {
//                     transport.close()
//                 }
//             })
//             transport.on('close', () => {
//                 console.log('transport closed');
//             })
//             callback({
//                 params:
//                 {
//                     id: transport.id,
//                     iceParameters: transport.iceParameters,
//                     iceCandidates: transport.iceCandidates,
//                     dtlsParameters: transport.dtlsParameters,
//                     rtpParameters: transport.rtpParameters,
//                     kind: transport.kind,
//                 }
//             })
//             return transport
//         } catch (error) {
//             console.log(error);
//         }
//     }
//     socket.on('transportConnect', async ({ dtlsParameters }) => {
//         await producerTransport.connect({ dtlsParameters })
//         console.log("transportConnected");
//     })
//     socket.on('transportProduce', async ({ kind, rtpParameters }, callback) => {
//         producer = await producerTransport.produce({
//             kind, rtpParameters
//         })
//         if (producer) {
//             try {
//                 const id = uuidv4()
//                 const result = await pool.query('INSERT INTO Livestream( id ,title ,streamer ,producer_id) Values($1, $2, $3, $4)', [id, "Test Live Stream", "Shashank", producer.id])
//                 result ? console.log("Live Stream Saved") : console.log("Cant save Live Stream");
//             } catch (error) {
//                 console.log(error);
//             }
//         }
//         producer.on('transportclose', () => {
//             console.log("transport for producer is closed");
//             producer.close()
//         })
//         callback({
//             id: producer.id
//         })
//     })
//     socket.on('getRtp', () => {
//         socket.emit('consumerRTP', RTPCapabilities)
//     })
//     socket.on('transportViewerConnect', async ({ dtlsParameters }) => {
//         await viewerTransport.connect({ dtlsParameters })
//         console.log("transportViewerConnect called");
//     })
//     socket.on('consume', async ({ rtpCapabilities }, callback) => {
//         try {
//             if (mediasoupRouter.canConsume({
//                 producerId: producer.id,
//                 rtpCapabilities
//             })) {
//                 viewer = await viewerTransport.consume({
//                     producerId: producer.id,
//                     rtpCapabilities,
//                     paused: true
//                 })
//                 console.log("Viewer", viewer);
//                 viewer.on('transportclose', () => {
//                     console.log("transport close of viewer");
//                 })
//                 viewer.on('producerclose', () => {
//                     console.log("producer close of viewer");
//                 })
//                 const params = {
//                     id: viewer.id,
//                     producerId: producer.id,
//                     kind: viewer.kind,
//                     rtpParameters: viewer.rtpParameters
//                 }
//                 console.log("Params to send", params);
//                 callback({ params })
//             }
//         } catch (error: any) {
//             console.log(error.message);
//             callback({
//                 params: {
//                     error: error
//                 }
//             })
//         }
//     })
//     socket.on('consumerResume', async () => {
//         console.log("Consumer resume");
//         await viewer.resume()
//     })
// })
server.listen(process.env.PORT, () => console.log("server running"));
