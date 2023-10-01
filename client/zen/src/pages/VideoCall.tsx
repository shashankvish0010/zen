import React, { useContext, useEffect } from 'react';
import { Socketcontext } from '../context/Socketcontext';
import ReactPlayer from 'react-player';

const VideoCall: React.FC = () => {
  const socketcontext = useContext(Socketcontext);

  useEffect(() => {
    if (socketcontext?.remoteStream) {
      console.log("local", socketcontext.LocalStream);

      console.log("remote",socketcontext.remoteStream);
    }
  }, [socketcontext]);

  return (
    <div className='flex flex-col justify-center items-center gap-5 p-3'>
      <div className='h-max w-max p-2'>
        {
          socketcontext?.LocalStream && (
            <ReactPlayer
            playing
              url={socketcontext.LocalStream}
              height={'30vh'}
              width={'40vw'}
            />
          )
        }
      </div>
      <button onClick={() => socketcontext?.calling}>Stream On</button>
      <div className='h-max w-max p-2'>
        {
          socketcontext?.remoteStream && (
            <ReactPlayer
            playing
              url={socketcontext.remoteStream}
              height={'30vh'}
              width={'40vw'}
            />
          )
        }
      </div>
      <button onClick={() => socketcontext?.calling}>Stream On</button>

    </div>
  );
};

export default VideoCall;
