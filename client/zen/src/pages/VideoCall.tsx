import React, { useContext, useEffect } from 'react';
import { Socketcontext } from '../context/Socketcontext';
import ReactPlayer from 'react-player';
import { Icon } from '@iconify/react';

const VideoCall: React.FC = () => {
  const socketcontext = useContext(Socketcontext);

  useEffect(() => {
    console.log(    socketcontext?.mycamera,  socketcontext?.mymic     );
  }, [socketcontext]);

  return (
    <div className='h-screen w-screen relative flex flex-col justify-center items-center gap-5 p-3'>
      {socketcontext?.mycamera == true ?
        (<div className='h-max w-max p-2 ml-[80%] mb-[70%] absolute border border-white rounded-md'>
          {socketcontext?.LocalStream &&
          <ReactPlayer
            playing
            muted
            url={socketcontext.LocalStream} // Provide the actual URL here
            height={'20vh'}
            width={'20vw'}
          />}
        </div>
        ) : null}
      <div className='h-max w-max p-2 rounded-md'>
        {socketcontext?.remoteStream && (
          <ReactPlayer
            playing
            muted
            url={socketcontext.remoteStream} // Provide the actual URL here
            height={'80vh'}
            width={'100vw'}
          />
        )}
      </div>
      <div className='mt-[100%] absolute flex w-screen h-[5vh] p-3 flex-row gap-5 bg-transparent'>
        {
          socketcontext?.mycamera == true ? <Icon color='red' onClick={() => { socketcontext?.controlCamera() }} icon="pepicons-pop:camera-circle-off" height='5vh' />
            : <Icon color='blue' onClick={() => { socketcontext?.controlCamera() }} icon="pepicons-pop:camera" height='5vh' />
        }
        {
          socketcontext?.mymic == true ? <Icon color='red' onClick={() => { socketcontext?.controlMic }} icon="bi:mic-mute-fill" height='5vh' />
            : <Icon color='green' onClick={() => { socketcontext?.controlMic }} icon="eva:mic-fill" height='5vh' />
        }
      </div>
    </div>
  );
};

export default VideoCall;

