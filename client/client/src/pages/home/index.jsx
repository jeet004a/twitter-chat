import React,{useEffect,useState} from 'react'
import Headers from './components/headers'
import Sidebar from './components/sidebar'
import Chatarea from './components/chat'
import {useSelector} from 'react-redux'
import {io} from 'socket.io-client'
const socket=io('http://localhost:3000')

const Home = () => {
  const {selectedChats,user} =useSelector(state=>state.userReducer)
  const [onlineUser,setOnlineUser]=useState([])

  useEffect(()=>{
    if(user){
      socket.emit('join-room',user._id)
      socket.emit('user-login',user._id)
      socket.on('online-users',onlineusers=>{
        setOnlineUser(onlineusers)
      })
      socket.on('online-users-updated',onlineusers=>{
        setOnlineUser(onlineusers)
      })
    }
  },[user])

  return (
    <div className="home-page">
      <Headers socket={socket}></Headers>
    <div className="main-content">
      <Sidebar socket={socket} onlineUser={onlineUser}></Sidebar>
         {/* <!--SIDEBAR LAYOUT-->
         <!--CHAT AREA LAYOUT--> */}
         {selectedChats && <Chatarea socket={socket}></Chatarea>}
    </div>
</div>

  )
}

export default Home

