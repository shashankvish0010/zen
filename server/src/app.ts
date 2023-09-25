import express from "express"
const app = express()
import http from 'http'
import dotenv from "dotenv"
import cors from "cors"
import { Server } from 'socket.io'
const server = http.createServer(app)
const io = new Server(server, ({
    cors: {
        origin : '*',
        methods: ['GET','POST','PUT']
    }
}))
dotenv.config()
app.use(require('./routers/routes'))
app.use(cors())
app.use(express.json())

io.on('connection', (socket) => {
    socket.emit('hello', socket.id)

    socket.on('call', ({zenno, offer, from})=>{
        console.log(offer, zenno, from);
        
        io.to(zenno).emit('incommingcall', offer, from)
    })
})

server.listen(process.env.PORT, ()=> console.log("server running"))