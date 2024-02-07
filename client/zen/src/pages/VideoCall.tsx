import React, { useContext } from 'react';
import { Socketcontext } from '../context/Socketcontext';
import ReactPlayer from 'react-player';
import { Icon } from '@iconify/react';

const VideoCall: React.FC = () => {
  const socketcontext = useContext(Socketcontext);
  return (
    <div className='h-screen w-screen relative flex flex-col justify-center items-center gap-5 p-3'>
      <div className='h-max w-max p-2 ml-[80%] mb-[70%] absolute'>
        {socketcontext?.LocalStream &&
          <ReactPlayer className='rounded-md'
            playing
            muted
            url={socketcontext.LocalStream} // Provide the actual URL here
            height={'20vh'}
            width={'20vw'}
          />}
      </div>

      <div className='h-max w-max p-2'>
        {socketcontext?.remoteStream && (
          <ReactPlayer className='rounded-md shadow-slate-300'
            playing
            muted
            url={socketcontext.remoteStream} // Provide the actual URL here
            height={'100%'}
            width={'90vw'}
          />

        )}
      </div>
      <div className='mt-[100%] absolute flex w-screen h-[5vh] p-3 flex-row items-center justify-center gap-5 bg-transparent'>
        <button onClick={() => { socketcontext?.handleNegotiation() }} className='h-max w-max p-2 bg-gradient-r text-white from-indigo-500 to-blue-500 font-semibold text-base'>Start Call</button>
        <Icon onClick={() => { socketcontext?.endCall() }} className='bg-red-500 rounded-full p-2' icon="ic:round-call-end" color='white' height={'6vh'} />
      </div>
    </div>
  );
};

export default VideoCall;

