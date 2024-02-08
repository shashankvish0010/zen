import React, { useContext } from 'react';
import { Socketcontext } from '../context/Socketcontext';
import ReactPlayer from 'react-player';
import { Icon } from '@iconify/react';

const VideoCall: React.FC = () => {
  const socketcontext = useContext(Socketcontext);
  return (
    <div className='relative h-screen w-screen flex flex-col items-center gap-5 p-3'>
      <div className='absolute h-max w-max ml-[100%]'>
        {socketcontext?.LocalStream &&
          <ReactPlayer className='rounded-md'
            playing
            muted
            url={socketcontext.LocalStream} // Provide the actual URL here
            height={'20vh'}
            width={'20vw'}
          />}
      </div>

      <div className='relative h-max w-max'>
        {socketcontext?.remoteStream && (
          <ReactPlayer className='rounded-md shadow-slate-300'
            playing
            muted
            url={socketcontext.remoteStream} // Provide the actual URL here
            height={'90vh'}
            width={'90vw'}
          />

        )}
        <div className='absolute flex flex-col md:flex-row w-screen h-max p-3 items-center justify-center md:gap-5'>
          <button onClick={() => { socketcontext?.handleNegotiation() }} className='h-max w-max p-2 bg-indigo-600 text-white font-semibold text-base'>Start Call</button>
          <Icon onClick={() => { socketcontext?.endCall() }} className='bg-red-500 rounded-full p-2' icon="ic:round-call-end" color='white' height={'6vh'} />
        </div>
      </div>
    </div>
  );
};

export default VideoCall;

