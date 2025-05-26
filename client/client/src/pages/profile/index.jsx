import React,{useState,useEffect} from 'react'
import {useSelector} from 'react-redux'
import moment from 'moment'
import {uploadProfilePic} from '../../apiCalls/user'
const Profile = () => {
    const {user} =useSelector(state=>state.userReducer)
    const [image,setImage]=useState('')
    useEffect(()=>{
        if(user?.profilePic){
            setImage(user.profilePic)
        }
    },[user])
    // console.log('xxx',user)
    let formatName=()=>{
        let fname=user?.firstname?.at(0).toUpperCase()+ user?.firstname?.slice(1).toLowerCase()
        let lname=user?.lastname?.at(0).toUpperCase()+ user?.lastname?.slice(1).toLowerCase()
        // console.log(fname+ ' '+lname)
        return fname+ ' '+lname
    }

    let onFileSelect=async(e)=>{
        const file=e.target.files[0]
        const formData = new FormData();
        formData.append('image', file)
        await uploadProfilePic(formData)
        const reader=new FileReader(file)
        reader.readAsDataURL(file)
        // console.log('file',file)
        reader.onloadend=async()=>{
            setImage(reader.result)
        }
    }
  return (
    <div className="profile-page-container">
        <div className="profile-pic-container">
            {image && <img 
            // src="quick-chat-app-background.jpg" 
            src={image}
                 alt="Profile Pic" 
                 className="user-profile-pic-upload" 
            /> }
            {!image && <div className="user-default-profile-avatar">
                {/* MJ */}
                {formatName()}
            </div>}
        </div>

        <div className="profile-info-container">
            <div className="user-profile-name">
                <h1>{formatName()}</h1>
            </div>
            <div>
                <b>Email: </b>{user?.email}
            </div>
            <div>
                <b>Account Created: </b>{moment(user?.createdAt).format('MMM DD, YYYY')}
            </div>
            <div className="select-profile-pic-container">
                <input type="file"  onChange={onFileSelect}/>
            </div>
        </div>
    </div>
  )
}

export default Profile