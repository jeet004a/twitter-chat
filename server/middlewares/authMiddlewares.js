import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

const userAuth = async(req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]



        const decode = jwt.verify(token, process.env.JWT_SECRET)
            // console.log('Decoded token', decode)
            // req.body.id = decode.userId
        req.user = decode.email
        next()
    } catch (error) {
        console.log('Error in auth middleware', error)
    }
}

export default userAuth