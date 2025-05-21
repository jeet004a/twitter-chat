import React,{useState} from 'react'
import Search from './search'
import UserList from './userList';


const Sidebar = ({socket,onlineUser}) => {
    const [searchKey, setSearchKey] = useState('');
  return (
    <div className="app-sidebar">
        <Search searchKey={searchKey} setSearchKey={setSearchKey}></Search>
    {/* <!--SEARCH USER-->
    <!--USER LIST--> */}
    <UserList searchKey={searchKey} socket={socket} onlineUser={onlineUser}></UserList>
</div>
  )
}

export default Sidebar