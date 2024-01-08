"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const uuid_1 = require("uuid");
const mediasoup = __importStar(require("mediasoup"));
// const keyfile = './routers/key.pem'
// const certfile = './routers/cert.pem'
// const options: any = {
//     key: fs.readFileSync(keyfile, 'utf-8'),
//     cert: fs.readFileSync(certfile, 'utf-8')
// }
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
let RTPCapabilities;
let producer;
let viewer;
let mediasoupWorker;
let mediasoupRouter;
let producerTransport;
let viewerTransport;
let receiver;
let sender;
let sendersOffer;
const mediaCodecs = [
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
    socket.on('negotiation', (offer) => {
        io.to(receiver).emit('negotiationaccept', { sendersNegoOffer: offer });
    });
    socket.on('negotiationdone', (answer) => {
        io.to(sender).emit('acceptnegotiationanswer', { receiverNegoAnswer: answer });
    });
    socket.on('done', () => { io.emit('videocall'); });
    // --------------------------------------- WebSocket connection for Zen Live || Live Streaming --------------------------------- 
    socket.on('livestream', (key) => __awaiter(void 0, void 0, void 0, function* () {
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
            }).then((worker) => __awaiter(void 0, void 0, void 0, function* () {
                mediasoupWorker = worker;
                mediasoupRouter = yield worker.createRouter({ mediaCodecs });
                RTPCapabilities = mediasoupRouter.rtpCapabilities;
                socket.emit('GetRTPCapabilities', { RTPCapabilities }, key);
                console.log("worker created");
            }));
        }
        catch (error) {
            console.log(error);
        }
    }));
    socket.on('createWebRTCTransport', ({ sender }, callback) => __awaiter(void 0, void 0, void 0, function* () {
        if (sender == true) {
            producerTransport = yield createTransport(callback);
        }
        else {
            viewerTransport = yield createTransport(callback);
        }
    }));
    const createTransport = (callback) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const WebRTCOptions = {
                listenIps: [
                    {
                        ip: '76.76.21.142',
                        // announcedIp: '76.76.21.142'
                    }
                ],
                enableUdp: true,
                enableTcp: true,
                preferUdp: true
            };
            let transport = yield mediasoupRouter.createWebRtcTransport(WebRTCOptions);
            transport.on('dtlsstatechnage', (dtlsState) => {
                if (dtlsState === 'closed') {
                    transport.close();
                }
            });
            transport.on('close', () => {
                console.log('transport closed');
            });
            callback({
                params: {
                    id: transport.id,
                    iceParameters: transport.iceParameters,
                    iceCandidates: transport.iceCandidates,
                    dtlsParameters: transport.dtlsParameters,
                    rtpParameters: transport.rtpParameters,
                    kind: transport.kind,
                }
            });
            return transport;
        }
        catch (error) {
            console.log(error);
        }
    });
    socket.on('transportConnect', ({ dtlsParameters }) => __awaiter(void 0, void 0, void 0, function* () {
        yield producerTransport.connect({ dtlsParameters });
        console.log("transportConnected");
    }));
    socket.on('transportProduce', ({ kind, rtpParameters }, callback) => __awaiter(void 0, void 0, void 0, function* () {
        producer = yield producerTransport.produce({
            kind, rtpParameters
        });
        if (producer) {
            try {
                const id = (0, uuid_1.v4)();
                const result = yield dbconnect_1.default.query('INSERT INTO Livestream( id ,title ,streamer ,producer_id) Values($1, $2, $3, $4)', [id, "Test Live Stream", "Shashank", producer.id]);
                result ? console.log("Live Stream Saved") : console.log("Cant save Live Stream");
            }
            catch (error) {
                console.log(error);
            }
        }
        producer.on('transportclose', () => {
            console.log("transport for producer is closed");
            producer.close();
        });
        callback({
            id: producer.id
        });
        console.log("transportProduced");
    }));
    socket.on('getRtp', () => {
        socket.emit('consumerRTP', RTPCapabilities);
    });
    socket.on('transportViewerConnect', ({ dtlsParameters }) => __awaiter(void 0, void 0, void 0, function* () {
        yield viewerTransport.connect({ dtlsParameters });
        console.log("transportViewerConnect called");
    }));
    socket.on('consume', ({ rtpCapabilities }, callback) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (mediasoupRouter.canConsume({
                producerId: producer.id,
                rtpCapabilities
            })) {
                viewer = yield viewerTransport.consume({
                    producerId: producer.id,
                    rtpCapabilities,
                    paused: true
                });
                console.log("Viewer", viewer);
                viewer.on('transportclose', () => {
                    console.log("transport close of viewer");
                });
                viewer.on('producerclose', () => {
                    console.log("producer close of viewer");
                });
                const params = {
                    id: viewer.id,
                    producerId: producer.id,
                    kind: viewer.kind,
                    rtpParameters: viewer.rtpParameters
                };
                console.log("Params to send", params);
                callback({ params });
            }
        }
        catch (error) {
            console.log(error.message);
            callback({
                params: {
                    error: error
                }
            });
        }
    }));
    socket.on('consumerResume', () => __awaiter(void 0, void 0, void 0, function* () {
        console.log("Consumer resume");
        yield viewer.resume();
    }));
});
server.listen(process.env.PORT, () => console.log("server running"));
