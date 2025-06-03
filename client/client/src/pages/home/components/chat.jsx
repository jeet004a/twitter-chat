import React,{useState,useEffect} from 'react'
import {useSelector,useDispatch} from 'react-redux'
import { createNewChat,getAllMessages } from '../../../apiCalls/message'
import {clearUnreadMessageCount} from '../../../apiCalls/chat'
import {showLoader,hideLoader} from '../../../redux/loderSlicer'
import {setAllChats} from '../../../redux/userSlicer'
import moment from 'moment'
import store from '../../../redux/store'
import EmojiPicker from 'emoji-picker-react'


const Chatarea = ({socket}) => {
    const dispatch =useDispatch()
    const {selectedChats,user,allChats}=useSelector(state=>state.userReducer)
    const selectedUser=selectedChats.members.find(u=> u._id !==user._id)
    const [message, setMessage] = useState('')
    const [allMessage, setAllMessage] = useState([])
    const [isTyping,setIsTyping]=useState(false)
    const [showEmojiPicker, setShowEmojiPicker]=useState(false)
    const [data,setData]=useState(null)

    const sendMessage=async()=>{
      try {
        // console.log('call')
        const newMessage={
          chatId: selectedChats._id,
          sender: user._id,
          text: message
        }
        socket.emit('send-message',{
          ...newMessage,
          members: selectedChats.members.map(m=> m._id),
          read: false,
          createdAt: moment().format('DD-MM-YYYY hh:mm:ss')
        })

        // dispatch(showLoader())
        const response=await createNewChat(newMessage)
        // console.log(newMessage)
        // dispatch(hideLoader())

        if(response.success){
          setMessage('')
          setShowEmojiPicker(false)
        }
      } catch (error) {
        // dispatch(hideLoader())
        console.log(error)
      }
    }

    const getMessages=async()=>{
      try {
        dispatch(showLoader())
        const response=await getAllMessages(selectedChats._id)
        
        dispatch(hideLoader())

        if(response.success){
          // console.log(response.data.length)
          setAllMessage(response.data)
        }


      } catch (error) {
        dispatch(hideLoader())
        console.log(error)
      }
    }

    const clearUnreadMessages=async()=>{
      try {
        socket.emit('clear-unread-message',{
          chatId: selectedChats._id,
          members: selectedChats.members.map(m=>m._id)
        })
        // dispatch(showLoader())
        const response=await clearUnreadMessageCount(selectedChats._id)
        // dispatch(hideLoader())

        if(response.success){
          allChats.map(chat=> {
            if(chat._id===selectedChats._id){
              return response.data
            }
            return chat
          })
        }


      } catch (error) {
        // dispatch(hideLoader())
        console.log(error)
      }
    }

    

    useEffect(()=>{
      getMessages()
      if(selectedChats?.lastMessage?.sender!==user._id){
        clearUnreadMessages()
      }
      //Socket off is working if any event is already presnet with the same name it will close first and tooks the new raised event
      //selectedChat :- its used for add messages on selected user feed on real time
      // .off('received-message')
      socket.off('received-message').on('received-message',(message)=>{
        const selectedChat=store.getState().userReducer.selectedChats
        if(selectedChat._id===message.chatId){
          setAllMessage(prevmsg=> [...prevmsg,message])
        }
        if(selectedChat._id===message.chatId && message.sender!==user._id){
          clearUnreadMessages()
        }
      })

      socket.on('message-count-cleared',data=>{
        const selectedChat=store.getState().userReducer.selectedChats
        const allChats=store.getState().userReducer.allChats

        if(selectedChat._id===data.chatId){
          //UPDATE UNREAD MESSAGE COUNT IN CHAT OBJECT
          const updatedChats=allChats.map(chat=>{
            if(chat._id===data.chatId){
              return {...chat,unreadMessages: 0}
            }
            return chat
          })
          dispatch(setAllChats(updatedChats))
          // //UPDATE READ PROPERTY IN MESSAGE OBJECT
          setAllMessage(prevmsg=>{
            return prevmsg.map(msg=>{
              return {...msg,read: true}
            })
          })
        }

      })

      socket.on('started-typing',(data)=>{
        setData(data)
        if(selectedChats._id==data.chatId && data.sender!==user._id){
          setIsTyping(true)
          setTimeout(() => {
            setIsTyping(false)
          }, 2000);
        }
      })

    },[selectedChats])

    const formattime=(timestamp)=>{
      const now=moment();
      const diff=now.diff(moment(timestamp),'days');

      if(diff<1){
        return `Today ${moment(timestamp).format('hh:mm A')}`;
      }
      else if(diff==1){
        return `Yesterday ${moment(timestamp).format('hh:mm A')}`;
      }else{
        return "now"
         //moment(timestamp).format('MMM D, hh:mm A');
      }
    }


    let formatName=(user)=>{
        // let fname=user?.firstname.at(0).toUpperCase()+ user?.firstname.slice(1).toLowerCase()
        // let lname=user?.lastname.at(0).toUpperCase()+ user?.lastname.slice(1).toLowerCase()
        // return fname+ ' '+lname
        return user?.firstname
    }


    //Below use effect is working for scroll bar down automatically
    useEffect(()=>{
      const msgContainer=document.getElementById('main-chat-area')
      msgContainer.scrollTop=msgContainer.scrollHeight
    },[allMessage,isTyping])


  return (
    <>
        {selectedChats && 
        <div className="app-chat-area">
          <div className="app-chat-area-header">
              {/* <!--RECEIVER DATA--> */}
              {/* John Smith */}
              {formatName(selectedUser)}
          </div>
            <div className="main-chat-area" id="main-chat-area">
              {
                allMessage.map((msg)=>{
                  const isCurrentUserSender=msg.sender===user._id;  
                  return <div key={msg._id} className="message-container" style={isCurrentUserSender ? {justifyContent: 'end'}: {justifyContent: "start"}}>
                      <div>
                        <div className={isCurrentUserSender?  "send-message": "received-message"}>
                          {msg.text}</div>
                        <div className="message-timestamp" style={isCurrentUserSender ? {float: "right"}: {float: "left"}}>
                          {formattime(msg.createdAt)} {isCurrentUserSender && msg.read && 
                          <i className="fa fa-check-circle" aria-hidden="true" style={{color:"#e74c3c"}}></i>}
                          </div>
                      </div>
                  </div>
                })
              }
              {/* <div className="message-container" >
                      <div className="send-message">Hi There</div>
                  </div> */}
                <div className="typing-indicator">
                  {isTyping && selectedChats.members.map(m=>m._id).includes(data?.sender) && <i>typing ...</i>}
                </div>
            </div>
            {showEmojiPicker && <div>
              <EmojiPicker onEmojiClick={(e)=>setMessage(message+e.emoji)}></EmojiPicker>
            </div>}
          <div className="send-message-div">
              <input type="text" className="send-message-input" placeholder="Type a message"
              value={message} 
              onChange={(e)=>{
                  setMessage(e.target.value)
                  socket.emit('user-typing',{
                    chatId: selectedChats._id,
                    members: selectedChats.members.map(m=>m._id),
                    sender: user._id
                  })
                }
              }/>
              <button className="fa fa-smile-o send-emoji-btn"  onClick={()=>{setShowEmojiPicker(!showEmojiPicker)}} 
              aria-label="Send message"></button>
              <button className="fa fa-paper-plane send-message-btn"  onClick={sendMessage} aria-label="Send message"></button>
          </div>
        </div>
}
      </>
  )
}

export default Chatarea