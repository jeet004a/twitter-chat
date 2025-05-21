import React from 'react'
import {useSelector} from 'react-redux'
import {useNavigate} from 'react-router-dom'
const Headers = ({socket}) => {
  const navigate=useNavigate()
    const {user}=useSelector(state=> state.userReducer)
    // console.log(user)
    function getFullName(){
        let firstname=user?.firstname.slice(0,1).toUpperCase()+user?.firstname.slice(1).toLowerCase()
        let lastname=user?.lastname.slice(0,1).toUpperCase()+user?.lastname.slice(1).toLowerCase()
        return firstname+ " "+lastname
    }

    function getInitials(){
        let firstname=user?.firstname.slice(0,1).toUpperCase()
        let lastname=user?.lastname.slice(0,1).toUpperCase()
        return firstname+ " "+lastname
    }
    const logout=()=>{
      localStorage.removeItem('token')
      navigate('/login')
      socket.emit('user-offline',user._id)


    }
  return (
    <div className="app-header">
    <div className="app-logo">
        <i className="fa fa-comments" aria-hidden="true"></i>
          WhatsApp
        </div>
    <div className="app-user-profile">
      {user?.profilePic && <img src={user.profilePic} className="logged-user-profile-pic" alt="Not" onClick={()=>navigate('/profile')}/>}
        {!user?.profilePic && <div className="logged-user-profile-pic" onClick={()=>navigate('/profile')}>{getInitials()}</div>}
        <div className="logged-user-name">{getFullName()}</div>
        <button className='logout-button' onClick={logout}>
          <i className='fa fa-power-off'></i>
        </button>
    </div>
</div>
  )
}

export default Headers