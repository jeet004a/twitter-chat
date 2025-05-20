import { axiosInstance } from './index'

const DEV_URL = `${import.meta.env.VITE_DEV_URL}`

export const loggedUser = async(data) => {
    try {
        let response = await axiosInstance.get(DEV_URL + 'api/user/get-logged-user')
        return response
    } catch (error) {
        console.log(error)
    }
}

export const getAllUsers = async() => {
    try {
        let response = await axiosInstance.get(DEV_URL + 'api/user/get-all-users')
            // console.log(response)
        return response
    } catch (error) {
        console.log(error)
    }
}