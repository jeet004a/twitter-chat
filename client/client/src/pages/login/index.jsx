import React,{useState} from 'react'
import {Link} from 'react-router-dom'
import {loginUser} from '../../apiCalls/auth'
import {toast} from 'react-hot-toast'
import {useDispatch} from 'react-redux'
import { hideLoader, showLoader } from '../../redux/loderSlicer'
const Login = () => {
    const dispatch=useDispatch()
    const [user, setUser] = useState({
        email: '',
        password: ''
    })

    let onSubmitHandeler=async(e)=>{
        e.preventDefault()
        let response=''
        try {
            dispatch(showLoader())
            response=await loginUser(user)
            dispatch(hideLoader())
            // console.log(response)
            if(response.status==200){
                toast.success(response.data.message)
                localStorage.setItem('token',response.data.token)
                window.location.href='/'
            }else{
                toast.error(response.data.message)
            }
        } catch (error) {
            dispatch(hideLoader())
            toast.error(response.data.message)
            console.log(error)
        }
    }

  return (
    <div className="container">
        <div className="container-back-img"></div>
        <div className="container-back-color"></div>
        <div className="card">
        <div className="card_title">
            <h1>Login Here</h1>
        </div>
        <div className="form">
        <form onSubmit={onSubmitHandeler}>
            <input type="email" placeholder="Email" value={user.email} onChange={(e)=>{
                setUser({...user,email:e.target.value})
            }}/>
            <input type="password" placeholder="Password" value={user.password} onChange={(e)=>{
                setUser({...user,password:e.target.value})
            }}/>
            <button>Login</button>
        </form>
        </div>
        <div className="card_terms"> 
            <span>Don't have an account yet?
                <Link to='/signup'>Signup Here</Link>
            </span>
        </div>
        </div>
    </div>
  )
}

export default Login