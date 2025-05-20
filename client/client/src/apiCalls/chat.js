import { axiosInstance } from './index'

const DEV_URL = `${import.meta.env.VITE_DEV_URL}`

export const getAllChats = async() => {
    try {
        const response = await axiosInstance.get(DEV_URL + 'api/chat/get-all-chats')
            // console.log('a', response)
        return response.data
    } catch (error) {
        console.log(error)
    }
}

export const createNewChat = async(members) => {
    try {
        // console.log(members)
        const response = await axiosInstance.post(DEV_URL + 'api/chat/create-new-chat', { members })

        return response.data
    } catch (error) {
        console.log(error)
    }
}


export const clearUnreadMessageCount = async(chatId) => {
    try {
        // console.log(members)
        const response = await axiosInstance.post(DEV_URL + 'api/chat/clear-unread-message', { chatId: chatId })

        return response.data
    } catch (error) {
        console.log(error)
    }
}