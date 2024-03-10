import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from '@iconify/react';
import { UserContext } from '../context/Userauth';
import { motion } from 'framer-motion';

const Header: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false)
  const usercontext = useContext(UserContext)
  return (
    <>
    <div className='h-[10vh] w-[100vw] flex flex-row justify-around items-center shadow'>
      <Link to='/'>
        <div className='text-2xl flex gap-1'>
          <Icon icon="simple-icons:zenn" color='#9333ea' />
          <h1 className='logo'>ZEN</h1>
        </div>
      </Link>
      <div className='w-[30vw]'>
        <ul className='hidden md:flex justify-between gap-2 items-center font-semibold'>
          <Link to='/'>Home</Link>
          <Link to='/about'>About</Link>
          <Link to='/contact'>Contact</Link>
          {usercontext?.login == false ?
            <Link to='/signup'><button className='text-white p-1.5 bg-purple-600 rounded-sm'>Login/Signup</button></Link>
            :
            <button onClick={() => { usercontext?.dispatch({ type: "LOGOUT" }) }} className='bg-purple-600 p-1.5 text-white rounded-sm'>Logout</button>
          }
        </ul>
      </div>
      {
          open == true ?
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, rotate: 90 }} transition={{ behaviour: "smooth" }}
              onClick={() => setOpen(!open)} className='md:hidden block h-max w-max'>
              <Icon icon="oui:cross" height={'2rem'} color='indigo' />
            </motion.div>
            :
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ behaviour: "smooth" }}
              onClick={() => setOpen(!open)} className='md:hidden block h-max w-max'>
              <Icon icon="quill:hamburger" height={'2rem'} color='indigo' />
            </motion.div>
        }
    </div>
    {
            open == true ?
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ behaviour: "smooth" }}
              className='absolute md:hidden block h-max w-screen bg-purple-600 items-center p-3'>
              <ul className='h-[25vh] text-white uppercase header_list md:hidden flex flex-col justify-around text-sm'>
                <Link to='/'>Home</Link>
                <Link to='/about'>About</Link>
                <Link to='/contact'>Contact</Link>
                <Link to='/signup'>Login/Signup</Link>
              </ul>
            </motion.div>
            : null
        }
        </>
  )
}

export default Header