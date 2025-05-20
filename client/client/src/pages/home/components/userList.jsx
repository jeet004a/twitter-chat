import React,{useEffect} from 'react'
import {useSelector,useDispatch} from 'react-redux'
import toast from 'react-hot-toast'
import {showLoader,hideLoader} from '../../../redux/loderSlicer'
import {setAllChats,setSelectedChats} from '../../../redux/userSlicer'
import {createNewChat} from '../../../apiCalls/chat'
import moment from 'moment'
import store from '../../../redux/store'
// import 
const UserList = ({searchKey,socket}) => {
    const {allUsers}=useSelector(state=>state.userReducer)
    const {allChats, user:currentUser}=useSelector(state=>state.userReducer)
    const {selectedChats}=useSelector(state=>state.userReducer)
    // console.log(allUsers) 
    // allChats.map((chat)=>console.log(chat.members))
    const dispatch=useDispatch()
    const startNewChat=async(seachedUserId)=>{
        let response=null
        try {
            // console.log(currentUser._id,seachedUserId)
            dispatch(showLoader())
            // await createNewChat([currentUser._id,seachedUserId])
            response=await createNewChat([currentUser._id,seachedUserId])
            dispatch(hideLoader())
            if(response){
                toast.success(response.message)
                const newChat=response.data
                const updatedChat=[...allChats,newChat]
                dispatch(setAllChats(updatedChat))
                // dispatch(setSelectedChats())
            }
        } catch (error) {
            toast.error(response)
            dispatch(hideLoader())
            console.log(error)
        }
    }
     const openChat=(selectedUserId)=>{
        try {
            const chat=allChats.find(chat=>chat.members.map(m=>m._id).includes(currentUser._id) 
            && chat.members.map(m=>m._id).includes(selectedUserId))
            // dispatch(setSelectedChats(chat))
            if(chat){
                dispatch(setSelectedChats(chat))
            }
        } catch (error) {
            console.log(error)
        }
     }

     const isSelectedChat=(user)=>{
        if(selectedChats){
            return selectedChats.members.map(m=>m._id).includes(user._id)
        }
        // console.log(selectedChats)
        return false
     }

     const getlastMessageTimeStamp=(userId)=>{
        const chat=allChats.find(chat=>chat.members.map(m=>m._id).includes(userId))
        if(!chat ){
            return ""
        }else{
            return moment(chat?.lastMessage?.createdAt).format('hh:mm A')
        }
     }

     const getlastMessage=(userId)=>{
        // console.log(userId)
      const chat=allChats.find(chat=>chat.members.map(m=>m._id).includes(userId))
      if(!chat || !chat.lastMessage){
        return ""
      }else{
        const msgPrefix=chat?.lastMessage?.sender==currentUser._id? "You: ": ""
        return msgPrefix+chat?.lastMessage?.text?.substring(0,25)
      }
    }

    let formatName=(user)=>{
        let fname=user?.firstname?.at(0).toUpperCase()+ user?.firstname?.slice(1).toLowerCase()
        let lname=user?.lastname?.at(0).toUpperCase()+ user?.lastname?.slice(1).toLowerCase()
        return fname+ ' '+lname
    }

    const getUnreadMessageCount =(userId)=>{
        const chat=allChats.find(chat=>chat.members.map(m=>m._id).includes(userId))

        if(chat && chat.unreadMessages && chat.lastMessage.sender!==currentUser._id){
            return  <div className="unread-message-counter">{chat.unreadMessages}</div>
        }else{
            return ""
        }
    }

    function getData(){
        if(searchKey==""){
            return allChats
        }else{
             allUsers.filter(user=> {
                    return user.firstname.toLowerCase().includes(searchKey.toLowerCase()) &&
                    user.lastname.toLowerCase().includes(searchKey.toLowerCase())
                })
        }
    }

    useEffect(()=>{
        socket.on('received-message',(message)=>{
            const selectedChat=store.getState().userReducer.selectedChats
            const allChats=store.getState().userReducer.allChats
            
            if(selectedChat?._id!==message.chatId){
                const updatedchats =allChats.map(chat=>{
                    if(chat._id ===message.chatId){
                        return{
                            ...chat,
                            unreadMessages: (chat?.unreadMessages || 0)+1,
                            lastMessage: message
                        }
                    }
                    return chat
                }
                // return chat
            )
            dispatch(setAllChats(updatedchats))
        }
            
        })
    },[])
     
    return (
        // allUsers.filter(
        //     (user)=> {
        //         return (
        //             ((
        //             user.firstname.toLowerCase().includes(searchKey.toLowerCase()) ||
        //             user.lastname.toLowerCase().includes(searchKey.toLowerCase())
        //         ) && searchKey) || (allChats.some(chat=>chat.members.map(m=>m._id).includes(user._id)))
        //         ) //you can comment if you dont want to display anything initially
        //     }
        // )
        getData().map((obj)=>{
            let user=obj
            // console.log(obj)
            if(obj.members){
                user=obj.members.find(mem=>mem._id!==currentUser._id)
            }
        return (
            <div className="user-search-filter" onClick={()=>openChat(user._id)} key={user._id}>
                <div className={isSelectedChat(user) ?  "selected-user": "filtered-user"}>
                    <div className="filter-user-display">
                        <img src={user.profilePic} alt="Profile Pic" className="user-profile-image"/> 
                        {/* <div className="user-default-profile-pic">
                            MJ
                        </div> */}
                        <div className="filter-user-details"> 
                            <div className="user-display-name">{formatName(user)}</div>
                                <div className="user-display-email">{getlastMessage(user._id) || user.email}</div>
                            </div>
                            <div>
                               
                                {getUnreadMessageCount(user._id)}
                                {/* </div> */}
                                <div className="last-message-timestamp">{getlastMessageTimeStamp(user._id)}</div>
                            </div>
                            { !allChats.find(chat=> chat.members.map(m=>m._id).includes(user._id)) &&
                            <div className="user-start-chat">
                                <button className="user-start-chat-btn" onClick={()=>startNewChat(user._id)}>Start Chat</button>
                            </div>
                            }
                        </div>
                    </div>                        
            </div> 
        )
    })
    )
}

export default UserList