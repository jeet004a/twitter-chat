import React,{useEffect,useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {loggedUser, getAllUsers} from '../apiCalls/user'
import {getAllChats} from '../apiCalls/chat'
import { showLoader,hideLoader } from '../redux/loderSlicer'
import { useDispatch,useSelector } from "react-redux";
import { setAllUser, setUser,setAllChats } from '../redux/userSlicer';
const Protected = ({children}) => {
    const Navigate=useNavigate()
    const dispatch=useDispatch()
    // const [user, setUser] = useState(null);
    const {user} =useSelector(state=> state.userReducer)
    let loggedInUser=async()=>{
      try {
        dispatch(showLoader())
        const response=await loggedUser()
        dispatch(hideLoader())
        if(response.data.sucess){
          // setUser(response.data.data)
          dispatch(setUser(response.data.data))
        }else{
          toast.error(response.message)
          Navigate('/login')
        }
      } catch (error) {
        console.log(error)
      }
    }


    const getAllUsersDB=async()=>{
      try {
        dispatch(showLoader())
        const response=await getAllUsers()
        dispatch(hideLoader())
        if(response.status==200){
          // console.log(response.data)
          dispatch(setAllUser(response.data))
        }else{
          toast.error(response.message)
          Navigate('/login')
        }
      } catch (error) {
        console.log(error)
      }
    }


    const getCurrentUserChats=async()=>{
      try {
        const response=await getAllChats()
        // console.log(response.success)
        if(response.success){
          dispatch(setAllChats(response.data))
        }
      } catch (error) {
        Navigate('/login')
        console.log(error)
      }
    }

    useEffect(()=>{
        if(localStorage.getItem('token')){
         loggedInUser()
         getAllUsersDB()
         getCurrentUserChats()
        }else{
            Navigate('/login')
        }
    },[])
  return (
    <div>
      {/* {user?.firstname} */}
        {children}
    </div>
  )
}

export default Protected