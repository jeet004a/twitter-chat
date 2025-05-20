import React from 'react'
import {useSelector} from 'react-redux'
const Headers = () => {
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
  return (
    <div className="app-header">
    <div className="app-logo">
        <i className="fa fa-comments" aria-hidden="true"></i>
          Quick Chat
        </div>
    <div className="app-user-profile">
        <div className="logged-user-name">{getFullName()}</div>
        <div className="logged-user-profile-pic">{getInitials()}</div>
    </div>
</div>
  )
}

export default Headers