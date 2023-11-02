import React, { useContext } from 'react';
import { Socketcontext } from '../context/Socketcontext';
import ReactPlayer from 'react-player';
import { Icon } from '@iconify/react';

const VideoCall: React.FC = () => {
  const socketcontext = useContext(Socketcontext);

  // useEffect(() => {
  //   // Inside the useEffect
  //   if (socketcontext?.remoteStream) {
  //     // Attach the remote stream to the video element
  //     console.log("remote", socketcontext.remoteStream);
  //     console.log("local", socketcontext.LocalStream);
  //     // Error event listener
  //   }

  // }, [socketcontext]);

  return (
    <div className='h-screen w-screen relative flex flex-col justify-center items-center gap-5 p-3'>
      <div className='h-max w-max p-2 ml-[80%] absolute rounded-md'>
        {socketcontext?.mycamera == true ? (socketcontext?.LocalStream && (
          <ReactPlayer
            playing
            muted
            url={socketcontext.LocalStream} // Provide the actual URL here
            height={'20vh'}
            width={'20vw'}
          />
        )) : null}
      </div>
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
      <div className='flex w-screen h-[5vh] p-3 flex-row justify-around bg-black'>
        {
          socketcontext?.mycamera == true ? <Icon color='red' onclick={()=>{socketcontext?.controlCamera}} icon="pepicons-pop:camera-circle-off" height='3vh' />
            : <Icon color='blue' onclick={()=>{socketcontext?.controlCamera}} icon="pepicons-pop:camera" height='3vh' />
        }
        {
          socketcontext?.mymic == true ? <Icon color='red' onclick={()=>{socketcontext?.controlMic}} icon="bi:mic-mute-fill" height='3vh' />
            : <Icon color='green' onclick={()=>{socketcontext?.controlMic}} icon="eva:mic-fill"  height='3vh' />
        }
      </div>
    </div>
  );
};

export default VideoCall;

