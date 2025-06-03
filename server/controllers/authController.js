import express from 'express'
import User from '../models/userModel.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import axios from 'axios'
import oauth2Client from '../utils/googleConfig.js'
const router = express.Router()


router.post('/signup', async(req, res) => {
    try {

        //Chcek user already exists or not
        // console.log('hello')
        const existingUser = await User.findOne({ email: req.body.email })

        //if existing user found
        if (existingUser) {
            return res.status(200).json({ message: "User already exists" })
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        req.body.password = hashedPassword
        const newUser = new User(req.body)

        await newUser.save()

        return res.status(201).json({ message: "User created successfully" })
    } catch (error) {
        console.log('Error in signup', error)
    }
})

router.post('/login', async(req, res) => {
    try {
        // const
        // console.log(req.body)
        const user = await User.findOne({ email: req.body.email })
            // console.log(user)
        if (!user) {
            return res.status(400).json({ message: "User not found" })
        }

        const validateUser = await bcrypt.compare(req.body.password, user.password)

        if (!validateUser) {
            return res.status(400).json({ message: "Invalid credentials" })
        }

        const token = jwt.sign({ email: req.body.email }, process.env.JWT_SECRET, { expiresIn: '50d' })
        return res.status(200).json({
            message: "Login success",
            token
        })
    } catch (error) {
        console.log('Error in login', error)

    }
})

router.get('/gauth', async(req, res, next) => {
    try {
        const code = req.query.code
        const googleRes = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(googleRes.tokes)
            // console.log('abc')
        const userRes = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`)
        const { email, name, picture } = userRes.data
            // console.log('xxx', userRes.data)
        let user = await User.findOne({ email })

        if (!user) {
            user = await User.create({
                firstname: name,
                email,
                profilePic: picture
            })
        }
        // console.log(user)
        const { _id } = user
        const token = jwt.sign({ _id, email }, process.env.JWT_SECRET, {
                expiresIn: '50d'
            })
            // console.log('user', user)
        return res.status(200).json({
            message: 'Success',
            token,
            user
        })
    } catch (error) {
        console.log('Error in google auth', error)
    }
})




export default router