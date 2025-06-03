import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String
    },
    profilePic: {
        type: String,
        default: 'https://www.w3schools.com/howto/img_avatar.png'
    }
}, { timestamps: true })


const User = mongoose.model('User', userSchema)

export default User