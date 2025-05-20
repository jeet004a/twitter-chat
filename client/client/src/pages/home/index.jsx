import React,{useEffect} from 'react'
import Headers from './components/headers'
import Sidebar from './components/sidebar'
import Chatarea from './components/chat'
import {useSelector} from 'react-redux'
import {io} from 'socket.io-client'
const socket=io('http://localhost:3000')

const Home = () => {
  const {selectedChats,user} =useSelector(state=>state.userReducer)
  

  useEffect(()=>{
    if(user){
      socket.emit('join-room',user._id)
      // socket.emit('send-message',{text: 'Hi marry', recipient:"682acafbe6e5ef6c09b3729b"})
      // socket.on('received-message',(data)=>{
      //   console.log(data)
      // })
    }
  },[user])

  return (
    <div className="home-page">
      <Headers></Headers>
    <div className="main-content">
      <Sidebar socket={socket}></Sidebar>
         {/* <!--SIDEBAR LAYOUT-->
         <!--CHAT AREA LAYOUT--> */}
         {selectedChats && <Chatarea socket={socket}></Chatarea>}
    </div>
</div>

  )
}

export default Home

