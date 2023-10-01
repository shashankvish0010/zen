import express from "express"
const app = express()
import http from 'http'
import dotenv from "dotenv"
import cors from "cors"
import pool from "../dbconnect"
import { Server } from 'socket.io'
const server = http.createServer(app)
const io = new Server(server, ({
    cors: {
        origin: '*',
        methods: ['GET', 'POST', 'PUT']
    }
}))
dotenv.config()
app.use(require('./routers/routes'))
app.use(cors())
app.use(express.json())
let receiver: string | string[];
let sender: string | string[];
let sendersOffer: any;
io.on('connection', (socket) => {

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
        io.to(receiver).emit('incomingcall', { sendersOffer, sender })
    })


    socket.on('callrecieved', (answer, { from }) => {
        io.to(from).emit('callaccepted', { answer, picked: true })
    })

    socket.on('negotiation', (offer) => {
        console.log("negore", receiver);
        io.to(receiver).emit('negotiationaccept', { sendersNegoOffer: offer })
    })

    socket.on('negotiationdone', (answer) => {
        console.log("negose", sender);

        console.log(answer);
        io.to(sender).emit('acceptnegotiationanswer', { receiverNegoAnswer: answer })
    })

    socket.on('done', () => io.emit('videocall'))

    socket.on('calldone', () => console.log("video call done"))
})

server.listen(process.env.PORT, () => console.log("server running"))