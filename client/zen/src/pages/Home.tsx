import React from 'react'
import { Icon } from '@iconify/react';

const Home: React.FC = () => {
  return (
    <div className='h-[100vh] w-[100vw] flex flex-col items-center gap-5'>
      <div className='h-max w-[100%] p-5 mt-5 flex flex-col gap-5 items-center'>
        <p className='title text-3xl text-center'>
        The easiest way to <span className='text-purple-600'>live stream</span> and <span className='text-purple-600'>video call</span>
        </p>
        <p className='text-base text-gray-700 font-semibold text-center'>A professional live streaming and video calling platform in your browser.</p>
      </div>
      <div className='h-max w-[100%] px-10 flex md:flex-row flex-col-reverse justify-evenly items-center'>
        <div className='flex flex-col gap-5 items-center'>
          <span className='flex flex-col gap-5'>
          <h2 className='md:text-4xl text-3xl font-semibold'>Elevate Your <span className='text-orange-600'>Live Streaming</span> Experience</h2>
          <p className='text-base text-gray-700 font-medium'>Discover Zen Live, Our cutting-edge technology combined with a seamless user experience ensures your live broadcasts are smooth and stress-free. Share your moments, inspire your audience, and reach new heights with Zen Live</p>
          </span>
          <span className='flex justify-center items-center gap-3 shadow-md cursor-pointer md:w-[20vw] w-[65vw] p-4 bg-orange-600 font-semibold text-2xl text-white rounded-md'> <Icon icon="ri:live-fill" />ZEN Live</span>
        </div>
        <div>
          <img src="https://img.freepik.com/premium-vector/concept-live-streaming-with-people-scene-flat-cartoon-design-presenter-conducts-live-broadcast-which-she-tells-important-information-vector-illustration_198565-2333.jpg?w=996" width='1300px' alt="" />
        </div>
      </div>
    </div>
  )
}

export default Home