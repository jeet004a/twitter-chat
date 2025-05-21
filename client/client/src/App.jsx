import { useState } from 'react'
import './App.css'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Home from './pages/home'
import Login from './pages/login'
import Signup from './pages/signup'
import {Toaster} from 'react-hot-toast'
import Protected from './components/protectedRoute'
import Loader from './components/loader'
import {useSelector} from 'react-redux'
import Profile from './pages/profile'

function App() {
  const [count, setCount] = useState(0)
  const {loader}=useSelector(state=>state.loaderReducer)
  return (
    <div>
      <Toaster position="top-center" reverseOrder={false}></Toaster>
      {loader && <Loader/>}
      <BrowserRouter>
        <Routes>
          <Route path='/' element={
            <Protected>
              <Home/>
              <Profile/>
            </Protected>
            }></Route>
            <Route path='/profile' element={
            <Protected>
              <Profile/>
            </Protected>
            }></Route>
          <Route path='/login' element={<Login/>}></Route>
          <Route path='/signup' element={<Signup/>}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
