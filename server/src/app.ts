import express from "express"
const app = express()
import http from 'http'
import dotenv from "dotenv"
import cors from "cors"
import pool from "../dbconnect"
import { Server } from 'socket.io'
import { log } from "console"
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
    console.log(socket.id);

    socket.on('call', async (zenno, from, offer) => {
        // console.log(offer, zenno, from);
        try {
            const reciverSocketId = await pool.query('SELECT socketid from Users WHERE zen_no=$1', [zenno])
            receiver = reciverSocketId.rows[0].socketid
            sender = from
            sendersOffer = offer
            console.log("re", receiver);
            io.to(receiver).emit('callercalling')
        } catch (error) {
            console.log(error);
        }
    })

    socket.on('recieved', () => {
        console.log("enter", sender)
        io.to(receiver).emit('incomingcall', { sendersOffer, sender })
    })


    socket.on('callrecieved', (answer, { from }) => {
        console.log("enter2", from)
        io.to(from).emit('callaccepted', { answer, picked: true })
    })

    // socket.on('negotiationtstart', () => {
    //     io.to(sender).emit('negotiationoffer')
    // })

    socket.on('negotiation', (offer) => {
        io.to(receiver).emit('negotiationaccept', offer)
    })

    socket.on('negotiationdone', (answer) => {
        io.to(sender).emit('acceptnegotiationanswer', answer)
    })
})

server.listen(process.env.PORT, () => console.log("server running"))