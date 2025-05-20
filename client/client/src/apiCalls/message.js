import { axiosInstance } from './index'

const DEV_URL = `${import.meta.env.VITE_DEV_URL}`

export const createNewChat = async(message) => {
    try {
        // console.log(members)
        const response = await axiosInstance.post(DEV_URL + 'api/message/new-message', message)

        return response.data
    } catch (error) {
        console.log(error)
    }
}


export const getAllMessages = async(chatId) => {
    try {
        // console.log(members)
        const response = await axiosInstance.get(DEV_URL + `api/message/get-all-messages/${chatId}`)

        return response.data
    } catch (error) {
        console.log(error)
    }
}