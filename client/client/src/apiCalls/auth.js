import { axiosInstance } from "./index";


const DEV_URL = `${import.meta.env.VITE_DEV_URL}`


export const signupUser = async(user) => {
    try {
        const response = await axiosInstance.post(DEV_URL + 'api/auth/signup', user)

        return response
            // console.log(DEV_URL)
    } catch (error) {
        alert('User not created')
        console.log('error while fetching data from signup route', error)
    }
}


export const loginUser = async(user) => {
    try {
        const response = await axiosInstance.post(DEV_URL + 'api/auth/login', user)
            // console.log('abc', user)
        return response
            // console.log(DEV_URL)
    } catch (error) {
        alert('Error login user route')
        console.log('error while fetching data from signup route', error)
    }
}