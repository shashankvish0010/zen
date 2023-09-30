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
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, ({
    cors: {
        origin: '*',
        methods: ['GET', 'POST', 'PUT']
    }
}));
dotenv_1.default.config();
app.use(require('./routers/routes'));
app.use((0, cors_1.default)());
app.use(express_1.default.json());
let receiver;
let sender;
let sendersOffer;
io.on('connection', (socket) => {
    socket.emit('hello', socket.id);
    console.log(socket.id);
    socket.on('call', (zenno, from, offer) => __awaiter(void 0, void 0, void 0, function* () {
        // console.log(offer, zenno, from);
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
        io.to(receiver).emit('incomingcall', { sendersOffer, sender });
    });
    socket.on('callrecieved', (answer, { from }) => {
        io.to(from).emit('callaccepted', { answer, picked: true });
    });
    socket.on('negotiationtstart', () => {
        io.to(sender).emit('negotiation');
    });
    socket.on('negotiation', (offer) => {
        console.log(offer);
        io.to(receiver).emit('negotiationaccept', offer);
    });
    socket.on('negotiationdone', (answer) => {
        io.to(sender).emit('acceptnegotiationanswer', answer);
    });
    socket.on('done', () => io.emit('videocall'));
});
server.listen(process.env.PORT, () => console.log("server running"));
