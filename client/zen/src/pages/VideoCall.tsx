import React, { useContext, useEffect } from 'react'
import { Socketcontext } from '../context/Socketcontext'
import ReactPlayer from 'react-player'

const VideoCall: React.FC = () => {
  const socketcontext = useContext(Socketcontext)
  useEffect(() => {
    socketcontext?.callConnected; console.log(socketcontext?.callConnected);
  }, [])
  return (
    <div className='flex flex-col justify-center items-center gap-5 p-3'>
      <div className='h-max w-max p-2'>
        {
          <ReactPlayer playing url={socketcontext?.LocalStream} height={'30vh'} width={'40vw'} />
        }
      </div>
      <button onClick={() => socketcontext?.calling}>Stream On</button>
      <div className='h-max w-max p-2'>
        {
          <ReactPlayer playing url={socketcontext?.remoteStream} height={'30vh'} width={'40vw'} />
        }
      </div>


      <button onClick={() => socketcontext?.calling}>Stream On</button>

    </div>
  )
}

export default VideoCall