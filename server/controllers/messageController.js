import express from 'express'
import Chat from '../models/chatModel.js'
import Message from '../models/messageModel.js'
import userAuth from '../middlewares/authMiddlewares.js'

const router = express.Router()

router.post('/new-message', userAuth, async(req, res, next) => {
    try {
        // console.log(req.body)
        const lastMessage = await Message(req.body)
        let savedMessage = await lastMessage.save()

        const chat = await Chat.findOneAndUpdate({ _id: req.body.chatId }, {
            lastMessage: savedMessage._id,
            $inc: { unreadMessages: 1 }
        })


        return res.status(201).json({
            message: "Message sent successfully",
            success: true,
            data: savedMessage
        })
        return res.status(201).json("Hello sender")
    } catch (error) {
        console.log(error)
    }
})

router.get('/get-all-messages/:chatId', userAuth, async(req, res, next) => {
    try {
        const allMessages = await Message.find({ chatId: req.params.chatId }).sort({ createdAt: 1 })
            // console.log(req.params)

        return res.status(200).json({
            message: "Messages fetched sucessfully",
            success: true,
            data: allMessages
        })
    } catch (error) {
        console.log(error)
    }
})

export default router