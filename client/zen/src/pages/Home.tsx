import React, { useContext, useEffect } from 'react'
import { Icon } from '@iconify/react';
import Footer from '../components/Footer';
import { UserContext } from '../context/Userauth';
import { useNavigate } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component'

import banner from '../assets/Video call.gif'
import image1 from '../assets/old-woman-communicates-with-her-son-via-video-link-through-laptop.jpg'
import image2 from '../assets/woman-with-headphones-waving.jpg'
import image3 from '../assets/man-with-headset-video-call.jpg'
import image4 from '../assets/young-happy-entrepreneur-having-video-call-computer-home.jpg'
import image5 from '../assets/medium-shot-man-waving-laptop.jpg'

const Home: React.FC = () => {
  let imageArr: any[] = []
  useEffect(() => {
    imageArr = [image1, image2, image3, image4, image5]
  }, [image1, image2, image3, image4, image5])
  const user = useContext(UserContext)
  const navigate = useNavigate()
  return (
    <div className='h-max w-screen flex flex-col items-center gap-5 overflow-hidden'>
      <div className='mt-5 bg-gradient-to-b shadow-md md:overflow-y-hidden overflow-x-hidden from-white via-purple-300 to-purple-400 rounded-b-[300%] h-max md:h-[70vh] flex flex-col items-center w-[150%] '>
        <span className='p-3 flex flex-col justify-center items-center gap-3 h-max w-[85vw]'>
          <p className='h-max  main_head font-bold md:text-3xl text-xl text-center'>Your Professional And Go To Video Calling Platform.</p>
          <p className='h-max main_head font-bold md:text-3xl text-xl text-center flex md:flex-row flex-col items-center gap-2'>
            Now In <span className='font-bold text-2xl md:text-4xl text-orange-500'>Your Browser.</span>
          </p>
          <span>
            <p className='text-base text-center md:text-gray-600 text-white font-medium'>The easiest way to video call & incoming feature of live stream on single platform</p>
          </span>
          <span className='flex flex-row items-center gap-3 p-3'>
            <button onClick={() => navigate('/signup')} className='bg-white border-2 border-gray-200 p-2 rounded-full text-purple-600 font-semibold title md:w-[20vw]'>Lets Start</button>
            <Icon className='bg-orange-500 rounded-full p-2 rotate-90' icon="ph:arrow-up-bold" color='white' height='6vh' />
          </span>
          <span className='md:flex hidden flex-row items-center md:w-[150%] justify-evenly sm:gap-5'>
            {imageArr.map((image) =>
              <LazyLoadImage
                className='hover:translate-y-[-10px] hover:shadow-2xl rounded-xl shadow-xl cursor-pointer'
                width={'250px'}
                src={image}
              />
            )}
          </span>
        </span>
      </div>
      <div className='h-max w-[90%] flex md:flex-row flex-col-reverse items-center justify-evenly'>
        <div className='md:w-[50%] w-[95vw] flex flex-col p-5 gap-5 items-center'>
          <span className='flex flex-col gap-5'>
            <h2 className='md:text-4xl text-3xl font-semibold'>Seamless <span className='text-blue-600'>Video Calling</span> Experience</h2>
            <p className='text-base font-medium'>Effortless, high-quality video calls at your fingertips. Zen Call offers a superior video calling experience, making professional communication effortless and effective, Elevate your video communication experience today</p>
          </span>
          <span onClick={() => navigate('/zenlist/' + user?.curruser?.id)} className='flex justify-center items-center gap-3 shadow-md cursor-pointer md:w-[20vw] w-[65vw] p-4 bg-blue-600 font-semibold text-2xl text-white rounded-md'> <Icon icon="icon-park-outline:phone-video-call" /><p>ZEN Call</p></span>
        </div>
        <div className='p-5 h-max md:w-[40%] w-[95vw] overflow-clip'>
          <img className='rounded-xl shadow-xl' src={banner} width={'500px'} alt="" />
        </div>
      </div>
      <div className='md:h-[30vh] h-max w-[95vw] gap-5 flex md:flex-row flex-col p-5 items-center justify-evenly'>
        <div className='flex flex-col items-center gap-5'>
          <div className='bg-amber-500 rounded-md shadow object-fit p-3 w-max'>
            <Icon className='shadow-xl' icon="healthicons:ui-folder-family" color='white' height='4vh' />
          </div>
          <p className='text-center text-xl font-semibold'>Add anyone in your list with the ZEN No.</p>
        </div>
        <span className='md:h-[100%] md:w-[0.20rem]  h-[0.20rem] w-[100%] rounded bg-purple-600'></span>
        <div className='flex flex-col items-center gap-5'>
          <div className='bg-blue-600 rounded-md shadow object-fit p-3 w-max'>
            <Icon className='shadow-xl' icon="icon-park-outline:phone-video-call" color='white' height='4vh' />
          </div>
          <p className='text-center text-xl font-semibold'>Just call your friends, family in one click.</p>
        </div>
        <span className='md:h-[100%] md:w-[0.20rem]  h-[0.20rem] w-[100%] rounded bg-purple-600'></span>
        <div className='flex flex-col items-center gap-5'>
          <div className='bg-green-500 rounded-md shadow object-fit p-3 w-max'>
            <Icon className='shadow-xl' icon="gg:phone" color='white' height='4vh' />
          </div>
          <p className='text-center text-xl font-semibold'>ZEN No is just your contact number.</p>
        </div>
      </div>
      <div className='bg-gradient-to-r from-blue-500 via-pink-600 to-purple-600 shadow-xl flex flex-col h-max w-[90vw] p-8 gap-5 rounded-xl text-white title'>
        <div className='flex md:flex-row flex-col items-center justify-between w-[100%]'>
          <p className='md:text-3xl text-xl'>Just Start Your Journey in 3 Steps.</p>
          <span className='flex flex-row items-center gap-3 p-3'>
            <button onClick={() => navigate('/signup')} className='bg-white border-2 border-gray-200 p-2 rounded-full text-purple-600 font-semibold title md:w-[20vw]'>Lets Start</button>
            <Icon className='bg-green-400 rounded-full p-2 rotate-90' icon="ph:arrow-up-bold" color='white' height='6vh' />
          </span>
        </div>
        <div className='flex flex-col md:text-2xl text-lg gap-3 w-[100%]'>
          <p>1. Register with your valid details</p>
          <p>2. Your ZEN No. is in your profile.</p>
          <p>3. Save contacts using ZEN No. from Contacts.</p>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Home