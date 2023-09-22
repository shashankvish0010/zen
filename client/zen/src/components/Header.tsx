import React from 'react'
import { Link } from 'react-router-dom'
import { Icon } from '@iconify/react';

const Header: React.FC = () => {
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
          <Link to='/signup'><button className='bg-purple-500 p-1 text-white rounded-sm'>Login/Signup</button></Link>
        </ul>
      </div>
    </div>
  )
}

export default Header