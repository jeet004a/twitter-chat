import express from 'express'
import User from '../models/userModel.js'
import userAuth from '../middlewares/authMiddlewares.js'
const router = express.Router()

router.get('/get-logged-user', userAuth, async(req, res, next) => {
    try {

        const user = await User.findOne({ email: req.user }).select('-password')

        // console.log(user)
        return res.status(200).json({
            message: "User fetched successfully",
            sucess: true,
            data: user
        })
    } catch (error) {
        console.log('Error in get logged user route', error)
    }
})

router.get('/get-all-users', userAuth, async(req, res, next) => {
    try {
        const email = req.user
            // console.log(typeof(email))
        const users = await User.find({ email: { $ne: email } }).select('-password')
            // if (!user) {
            //     return res.status(400).json({
            //         message: "No users found",
            //         sucess: false
            //     })
            // }

        return res.status(200).json(users)
    } catch (error) {
        console.log('Error in get all users route', error)
    }
})



export default router