import React, { useEffect, useContext } from 'react'
import { Socketcontext } from '../context/Socketcontext';
import {useParams, useNavigate} from 'react-router-dom'
import { Icon } from '@iconify/react';

const Calling : React.FC = () => {
    const socketcontext = useContext(Socketcontext)
    const navigate = useNavigate()
    const {zenno}=useParams()
    useEffect(()=>{
        console.log(socketcontext?.picked);
        socketcontext?.picked == true ? navigate('/videocall') : null
    },[socketcontext?.picked])

  return (
    <div className='bg-purple-600 h-[100vh] w-[100vw] flex flex-col items-center justify-evenly'>
        <div className='flex flex-col items-center p-3 gap-10'>
        <Icon icon="ic:baseline-wifi-calling-3" color='white' height='15vh'/>
        <Icon icon="eos-icons:three-dots-loading" color='white' height='10vh'/>
            <h1 className='text-white font-semibold text-2xl'>Calling...</h1>
            <h2 className='text-2xl text-white font-medium'>{zenno}</h2>
        </div>
    </div>
  )
}

export default Calling