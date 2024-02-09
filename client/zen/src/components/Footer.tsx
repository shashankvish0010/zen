import React from 'react'
import { Link } from 'react-router-dom'
import { Icon } from '@iconify/react'

const Footer: React.FC = () => {
  return (
    <div className='mt-[max] shadow-md border p-5 flex flex-col justify-evenly items-center h-max w-screen'>
      <div className='flex md:flex-row flex-col gap-3 items-center justify-between w-[100vw] px-8'>
        <Link to='/'>
          <div className='text-xl flex gap-1'>
            <Icon icon="simple-icons:zenn" color='#9333ea' />
            <h1 className='logo'>ZEN</h1>
          </div>
        </Link>
        <div className='h-max w-max'>
          <ul className='md:w-[35vw] w-[80vw] text-base font-semibold h-max flex flex-row items-center justify-around'>
            <Link className='hover:text-purple-600' to='/about'>About</Link>
            <Link className='hover:text-purple-600' to='/contact'>Contact</Link>
            <Link className='hover:text-purple-600' to='/register'>Sign Up</Link>
          </ul>
        </div>
      </div>
      <div className='w-max h-max flex flex-row items-center mt-5 gap-6'>
        <a href='https://github.com/shashankvish0010'><Icon className='shadow-xl cursor-pointer hover:shadow-2xl' height='3vh' icon="mdi:github" /></a>
        <a href='https://www.linkedin.com/in/shashank-vishwakarma-650555283/'><Icon className='shadow-xl cursor-pointer hover:shadow-2xl' height='3vh' icon="devicon:linkedin" /></a>
        <a href='https://twitter.com/ShashankVis001'><Icon className='shadow-xl cursor-pointer hover:shadow-2xl' height='3vh' icon="line-md:twitter-x-alt" /></a>
      </div>
      <div className='flex md:flex-row flex-col items-center w-screen h-max justify-center gap-1 mt-5'>
        <Link to='/'>
          <div className='text-base flex items-start gap-1'>
            <Icon icon="simple-icons:zenn" color='#9333ea' />
            <h1 className='logo'>ZEN</h1>
          </div>
        </Link>
        <p className='flex md:flex-row flex-col justify-center gap-1 text-center w-max font-medium'>&copy; Designed and Developed by <span className='text-purple-600  font-semibold'
        > <a href="https://www.linkedin.com/in/shashank-vishwakarma-650555283/">Shashank Vishwakarma</a></span></p>
      </div>
    </div>
  )
}

export default Footer