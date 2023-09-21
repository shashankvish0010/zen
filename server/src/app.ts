import express from "express"
const app = express()
import dotenv from "dotenv"
import cors from "cors"
dotenv.config()
app.use(require('./routers/routes'))
app.use(cors())
app.use(express.json())

app.listen(process.env.PORT, ()=> console.log("server running"))