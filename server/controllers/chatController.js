import express from 'express'
import Chat from '../models/chatModel.js'
import Message from '../models/messageModel.js'
import User from '../models/userModel.js'
import userAuth from '../middlewares/authMiddlewares.js'

const router = express.Router()

router.post('/create-new-chat', userAuth, async(req, res, next) => {
    try {
        const chat = new Chat(req.body)
        const savedChat = await chat.save()

        return res.status(201).json({
            message: "Chat created successfully",
            success: true,
            data: savedChat
        })
    } catch (error) {
        console.log(error)
    }
})

router.get('/get-all-chats', userAuth, async(req, res, next) => {
    try {
        const email = req.user
        const user = await User.findOne({ email: email }).select('-passowrd')

        const chats = await Chat.find({ members: { $in: user._id } })
            .populate('members').populate('lastMessage')
            .sort({ updatedAt: -1 })
            // console.log(chats)
            // const chats =await Chat

        return res.status(200).json({
            message: "Chats fetched successfully",
            success: true,
            data: chats
        })
    } catch (error) {
        console.log(error)
    }
})

router.post('/clear-unread-message', userAuth, async(req, res, next) => {
    try {
        const chatId = req.body.chatId

        const chat = await Chat.findById(chatId)
        if (!chat) {
            res.send({
                message: "No Message found with given id",
                success: false
            })
        }

        const updatedChat = await Chat.findByIdAndUpdate(chatId, { unreadMessages: 0 }, { new: true }).populate('members').populate('lastMessage')

        await Message.updateMany({ chatId: chatId, read: false }, { read: true })

        res.send({
            message: "Unread message cleared successfully",
            success: true,
            data: updatedChat
        })

    } catch (error) {
        res.send({
            message: error.message,
            success: false
        })
    }
})


export default router