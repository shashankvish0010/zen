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
const mediasoup_1 = __importDefault(require("mediasoup"));
const server = http_1.default.createServer(app);
app.use((0, cors_1.default)({
    origin: "https://zen-gamma.vercel.app"
}));
const io = new socket_io_1.Server(server, ({
    cors: {
        origin: 'https://zen-gamma.vercel.app',
        methods: ['GET', 'POST', 'PUT']
    }
}));
dotenv_1.default.config();
app.use(require('./routers/routes'));
app.use(express_1.default.json());
let mediasoupWorker;
let mediasoupRouter;
let streamerTransport;
let viewerTransport;
let receiver;
let sender;
let sendersOffer;
const mediacodecs = [
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
    socket.on('livestream', () => __awaiter(void 0, void 0, void 0, function* () {
        mediasoupWorker = yield mediasoup_1.default.createWorker({
            rtcMinPort: 2000,
            rtcMaxPort: 2020,
        }).then(() => __awaiter(void 0, void 0, void 0, function* () {
            mediasoupRouter = yield mediasoupWorker.createRouter({ mediacodecs });
            const RTPCapabilities = mediasoupRouter.rtpCapabilities;
            socket.emit('GetRTPCapabilities', { RTPCapabilities });
            console.log("worker created");
        }));
    }));
    const createWebRTCTransport = () => __awaiter(void 0, void 0, void 0, function* () {
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
            };
            let transport = yield mediasoupRouter.createWebRTCTransport(WebRTCOptions);
            transport.on('dtlsstatechnage', (dtlsState) => {
                if (dtlsState === 'closed') {
                    transport.close();
                }
            });
            transport.on('close', () => {
                console.log('transport closed');
            });
            socket.emit('transportParams', {
                params: {
                    id: transport.id,
                    iceParameters: transport.iceParameters,
                    iceCandidates: transport.iceCandidates,
                    dtlsParameters: transport.dtlsParameters
                }
            });
            return transport;
        }
        catch (error) {
            console.log(error);
        }
    });
    socket.on('WebRTCTransport', ({ streamer }) => {
        if (streamer) {
            streamerTransport = createWebRTCTransport();
        }
        else {
            viewerTransport = createWebRTCTransport();
        }
    });
    socket.on('transportConnect', ({ dtlsParameters }) => __awaiter(void 0, void 0, void 0, function* () {
        streamerTransport.connect({ dtlsParameters });
    }));
});
server.listen(process.env.PORT, () => console.log("server running"));
