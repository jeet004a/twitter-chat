import express from 'express'
import dotenv from 'dotenv'
import dbConnection from './config/dbConfig.js'
import cors from 'cors'
import http from 'http'
dotenv.config()
const PORT = process.env.PORT || 3000
const app = express()

import userAuthRoutes from './controllers/authController.js'
import userRoutes from './controllers/userController.js'
import chatRoutes from './controllers/chatController.js'
import messageRoutes from './controllers/messageController.js'
import { Server } from 'socket.io';



app.use(express.json())
app.use(cors())
    //All User routes
app.use('/api/auth', userAuthRoutes)
app.use('/api/user', userRoutes)
    //All Chat routes
app.use('/api/chat', chatRoutes)
    //All Message routers
app.use('/api/message', messageRoutes)

app.get('/', (req, res, next) => {
    try {
        return res.status(200).json({ message: "Server is healthy" })
    } catch (error) {
        console.log('Server error', error)
    }
})

//All Socket
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});



// Replace app.listen with server.listen
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


io.on('connection', (socket) => {
    socket.on('join-room', (userid) => {
        socket.join(userid)
    })
    socket.on('send-message', (message) => {
        // console.log(message)
        io.to(message.members[0])
            .to(message.members[1])
            .emit('received-message', message)
    })

    socket.on('clear-unread-message', data => {
        // console.log(data)
        io.to(data.members[0]).to(data.members[1]).emit('message-count-cleared', data)
    })
});


//end Socket IO



// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`)
// })