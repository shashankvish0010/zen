import React from 'react'
import { Icon } from '@iconify/react/dist/iconify.js'
import AboutFeature from '../components/AboutFeature'

const About: React.FC = () => {
  return (
    <div className='title h-screen w-screen p-3 flex flex-col items-center gap-5'>
      <div className='h-max w-[90vw] flex flex-col p-8 rounded-xl shadow-md border-2 gap-5 m-5 border-gray-200'>
        <AboutFeature
          heading='Welcome to Zen'
          body='Welcome to Zen, your ultimate destination for seamless video calling and soon-to-be live streaming, all built on the robust PERN stack and WebRTC technology.'
        />
        <AboutFeature
          heading='Purpose'
          body="Zen is designed to revolutionize your communication experience. Whether you're making video calls or streaming live content, Zen ensures a secure, reliable, and user-friendly platform for all your communication needs."
        />
        <div className='h-max w-max flex flex-col gap-1'>
          <h2 className='text-purple-600 text-xl font-bold'>Features</h2>
          <p className='content flex gap-1 text-base font-normal'><h3 className='text-base title font-semibold'>Real-time Video Calls:</h3> Enjoy high-quality video calls with minimal latency, thanks to WebRTC technology.</p>
          <p className='content flex gap-1 text-base font-normal'><h3 className='text-base title font-semibold'>Secure Authentication:</h3> Your account is protected with robust authentication mechanisms, ensuring your privacy and security.</p>
          <p className='content flex gap-1 text-base font-normal'><h3 className='text-base title font-semibold'>One-Time Password Verification:</h3> Easily verify your account using one-time passwords (OTP) for added convenience and security.</p>
          <p className='content flex gap-1 text-base font-normal'><h3 className='text-base title font-semibold'>Custom Zen Numbers:</h3> Each user receives a unique Zen number for easy contact management and privacy protection.</p>
          <p className='content flex gap-1 text-base font-normal'><h3 className='text-base title font-semibold'>Call Directory Search:</h3> Quickly find and save contacts using the intuitive search box within the call directory.</p>
          <p className='content flex gap-1 text-base font-normal'><h3 className='text-base title font-semibold'>Real-time Video Calls:</h3> Enjoy high-quality video calls with minimal latency, thanks to WebRTC technology.</p>
        </div>
        <AboutFeature
          heading="Building Expertise with WebRTC"
          body="Zen is not just a project; it's a testament to my commitment to continuous learning and innovation. In creating Zen, I embarked on a journey to master the intricacies of WebRTC technology. Learning WebRTC was no small feat; it presented challenges that pushed me to expand my knowledge and skills in real-time communication."
        />
        <AboutFeature
          heading="Future-Proof with Live Streaming"
          body="Exciting news! I'm gearing up to introduce live streaming capabilities to Zen. Powered by Mediasoup technology, live streaming feature will enable you to broadcast your content to audiences worldwide in real-time, with unparalleled quality and reliability.               "
        />
        <div className='h-max w-[100%] flex flex-col gap-1'>
          <h2 className='text-xl font-bold'>Technology Stack</h2>
          <p>Zen leverages the powerful PERN stack:</p>
          <span className='h-max w-[100%] flex flex-col p-2 gap-1'><span className='flex items-center gap-2'><Icon icon="devicon:postgresql-wordmark" height='4vh'/><h3 className='text-base font-semibold'>PostgreSQL:</h3></span> <p className='content flex gap-1 text-base font-normal'> Enjoy high-quality video calls with minimal latency, thanks to WebRTC technology.</p></span> 
          <span className='h-max w-[100%] flex flex-col p-2 gap-1'><span className='flex items-center gap-2'><Icon icon="skill-icons:expressjs-dark" height='4vh'/><h3 className='text-base font-semibold'>Express.js:</h3></span> <p className='content flex gap-1 text-base font-normal'> Your account is protected with robust authentication mechanisms, ensuring your privacy and security.</p></span> 
          <span className='h-max w-[100%] flex flex-col p-2 gap-1'><span className='flex items-center gap-2'><Icon icon="skill-icons:react-dark" height='4vh'/><h3 className='text-base font-semibold'>React:</h3></span> <p className='content flex gap-1 text-base font-normal'> Easily verify your account using one-time passwords (OTP) for added convenience and security.</p></span> 
          <span className='h-max w-[100%] flex flex-col p-2 gap-1'><span className='flex items-center gap-2'><Icon icon="logos:nodejs" height='4vh'/><h3 className='text-base font-semibold'>Node.js:</h3></span> <p className='content flex gap-1 text-base font-normal'> Each user receives a unique Zen number for easy contact management and privacy protection.</p></span> 
          <span className='h-max w-[100%] flex flex-col p-2 gap-1'><span className='flex items-center gap-2'><Icon icon="devicon:socketio" height='4vh'/><h3 className='text-base font-semibold'>WebSockets:</h3></span> <p className='content flex gap-1 text-base font-normal'>Facilitating real-time, bidirectional communication between clients and servers, WebSockets enable Zen to deliver instant updates and notifications to users.</p></span> 
        </div>
        <AboutFeature
          heading="Development Journey"
          body="My journey to building Zen has been filled with challenges and triumphs. We're passionate about creating a platform that enhances your communication experience, and we're constantly pushing the boundaries to achieve this goal." />
      </div>
    </div>
  )
}

export default About