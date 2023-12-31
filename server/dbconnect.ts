import {Pool} from 'pg'
import dotenv from 'dotenv'
dotenv.config()

const localdb = `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST_LOCAL}:${process.env.DB_PORT}/${process.env.DB_NAME}`

const pool = new Pool({
   connectionString : process.env.NODE_ENV === "production" ? process.env.proddb : localdb,
   ssl: {
      rejectUnauthorized: false,
    },
})

export default pool