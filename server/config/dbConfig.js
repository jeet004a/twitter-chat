import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

mongoose.connect(process.env.DB_URL)


const db = mongoose.connection

db.on('connected', () => {
    console.log('DB Connected sucessfully')
})

db.on('error', () => {
    console.log('db connection fail')
})

export default db