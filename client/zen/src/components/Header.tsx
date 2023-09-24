import React, {useContext} from 'react'
import { Link } from 'react-router-dom'
import { Icon } from '@iconify/react';
import { UserContext } from '../context/Userauth';

const Header: React.FC = () => {
  const usercontext = useContext(UserContext)
  return (
    <div className='h-[10vh] w-[100vw] flex flex-row justify-around items-center shadow'>
      <Link to='/'><div className='text-2xl flex gap-1'>
      <Icon icon="simple-icons:zenn" color='#9333ea'/>
        <h1 className='logo'>ZEN</h1>
      </div>
      </Link>
      <div className='w-[30vw]'>
        <ul className='hidden md:flex justify-between gap-2 items-center font-semibold'>
          <Link to='/'>Home</Link>
          <Link to='/'>About</Link>
          <Link to='/'>Contact</Link>
          {  usercontext?.login?.status == false ?
          <Link to='/signup'><button className='bg-purple-600 p-1.5 text-white rounded-sm'>Login/Signup</button></Link>
          :
          <button onClick={()=>{usercontext?.dispatch({type: "LOGOUT"})}} className='bg-purple-600 p-1.5 text-white rounded-sm'>Logout</button>
          }
        </ul>
      </div>
    </div>
  )
}

export default Header