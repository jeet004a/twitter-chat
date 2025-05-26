import express from 'express'
import User from '../models/userModel.js'
import userAuth from '../middlewares/authMiddlewares.js'
import { generateS3UrlProfile } from '../service/s3_URL_Service.js'
import axios from 'axios'
import multer from 'multer'
const router = express.Router()

const storage = multer.memoryStorage();
const upload = multer({ storage });

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

//Below code is commented because it is not used in the project and its used to generate a signed URL for uploading files to S3 bucket.
/*
router.get('/signedUrl', userAuth, async(req, res) => {
    try {
        const signedURL = await generateS3Url()

        return res.status(200).json({
            message: "Signed URL generated successfully",
            sucess: true,
            data: signedURL
        })
    } catch (error) {
        console.log(error)
    }
})
*/



router.post('/profile-image', userAuth, upload.single('image'), async(req, res) => {
    try {
        const buffer = req.file.buffer; // image is here
        const mimeType = req.file.mimetype;
        const { signedURL, ImageUrl } = await generateS3UrlProfile()

        if (!signedURL || !ImageUrl) {
            return res.status(500).json({
                message: "Error generating signed URL",
                success: false
            })
        }

        await axios.put(signedURL, buffer, {
            headers: {
                'Content-Type': mimeType, // must match ContentType used when generating the URL
            },
        })
        const userRecord = await User.findOneAndUpdate({ email: req.user }, { $set: { profilePic: ImageUrl } }, { new: true })
        return res.status(200).json({
            message: "Profile image uploaded successfully",
            sucess: true,
            imageUrl: ImageUrl,
            user: userRecord
        })
    } catch (error) {
        console.log('Error in profile image route', error)
    }
})



export default router