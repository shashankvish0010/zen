import {Pool} from 'pg'

const localdb = `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST_LOCAL}:${process.env.DB_PORT}/${process.env.DB_NAME}`

const proddb = `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST_LOCAL}:${process.env.DB_PORT}/${process.env.DB_NAME}`

const pool = new Pool({
   connectionString : process.env.NODE === "produection" ? proddb : localdb
})

module.exports = pool