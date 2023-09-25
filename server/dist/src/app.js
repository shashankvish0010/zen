"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const http_1 = __importDefault(require("http"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
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
io.on('connection', (socket) => {
    socket.emit('hello', socket.id);
    socket.on('call', ({ zenno, offer, from }) => {
        console.log(offer, zenno, from);
        io.to(zenno).emit('incommingcall', offer, from);
    });
});
server.listen(process.env.PORT, () => console.log("server running"));
