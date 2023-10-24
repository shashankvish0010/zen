import React, {useContext} from 'react'
import { Icon } from '@iconify/react';
import Footer from '../components/Footer';
import { UserContext } from '../context/Userauth';
import { useNavigate } from 'react-router-dom';
const Home: React.FC = () => {
  const user = useContext(UserContext)  
  const navigate = useNavigate()
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
          <span className='flex justify-center items-center gap-3 shadow-md cursor-pointer md:w-[20vw] w-[65vw] p-4 bg-orange-600 font-semibold text-2xl text-white rounded-md'> <Icon icon="ri:live-fill" /><p>ZEN Live</p></span>
        </div>
        <div>
          {/* <img src="https://img.freepik.com/premium-vector/concept-live-streaming-with-people-scene-flat-cartoon-design-presenter-conducts-live-broadcast-which-she-tells-important-information-vector-illustration_198565-2333.jpg?w=996" width='1300px' alt="" /> */}
        </div>
      </div>
      <div className='h-max w-[100%] px-10 flex md:flex-row flex-col justify-evenly items-center'>
        <div>
          {/* <img src="https://img.freepik.com/premium-vector/concept-live-streaming-with-people-scene-flat-cartoon-design-presenter-conducts-live-broadcast-which-she-tells-important-information-vector-illustration_198565-2333.jpg?w=996" width='1300px' alt="" /> */}
        </div>
        <div className='flex flex-col gap-5 items-center'>
          <span className='flex flex-col gap-5'>
            <h2 className='md:text-4xl text-3xl font-semibold'>Seamless <span className='text-blue-600'>Video Calling</span> Experience</h2>
            <p className='text-base text-gray-700 font-medium'>Effortless, high-quality video calls at your fingertips. Zen Call offers a superior video calling experience, making professional communication effortless and effective, Elevate your video communication experience today</p>
          </span>
          <span className='flex justify-center items-center gap-3 shadow-md cursor-pointer md:w-[20vw] w-[65vw] p-4 bg-blue-600 font-semibold text-2xl text-white rounded-md'> <Icon icon="icon-park-outline:phone-video-call" /><p>ZEN Call</p></span>
        </div>
      </div>
      <div className='h-max w-[100%] gap-5 flex md:flex-row flex-col p-5 items-center justify-evenly'>
        <div className='flex flex-col items-center gap-5'>
          <div className='bg-amber-500 rounded-md shadow object-fit p-3 w-max'>
          <Icon onClick={()=>navigate('/zenlist/'+user?.curruser?.id)} icon="healthicons:ui-folder-family" color='white' height='4vh'/>
          </div>
          <p className='text-center text-xl font-semibold'>Add anyone in your list with the ZEN No.</p>
        </div>
        <span className='md:h-[100%] md:w-[0.20rem]  h-[0.20rem] w-[100%] rounded bg-purple-600'></span>
        <div className='flex flex-col items-center gap-5'>
        <div className='bg-blue-600 rounded-md shadow object-fit p-3 w-max'>
          <Icon icon="icon-park-outline:phone-video-call" color='white' height='4vh'/>
          </div>
          <p className='text-center text-xl font-semibold'>Just call your friends, family in one click.</p>
        </div>
        <span className='md:h-[100%] md:w-[0.20rem]  h-[0.20rem] w-[100%] rounded bg-purple-600'></span>
        <div className='flex flex-col items-center gap-5'>
        <div className='bg-green-500 rounded-md shadow object-fit p-3 w-max'>
          <Icon icon="gg:phone" color='white' height='4vh'/>
          </div>
          <p className='text-center text-xl font-semibold'>ZEN No is just your contact number.</p>
        </div>
      </div>
      <Footer/>
    </div>
  )
}

export default Home