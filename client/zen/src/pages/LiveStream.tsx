import React, { useContext, useEffect, useRef } from 'react'
import { Socketcontext } from '../context/Socketcontext'

const LiveStream: React.FC = () => {
  const livestreamContext = useContext(Socketcontext);
  var videoRef = useRef<HTMLVideoElement | any>(null);

  useEffect(() => {
     console.log(livestreamContext?.liveStream); 
     if (livestreamContext?.liveStream && videoRef.current) {

     videoRef.current.srcObject = livestreamContext?.liveStream;

     videoRef.current.play().catch((error: any) => {
       console.error('Error playing the video:', error);
     }); }
     }, [livestreamContext?.liveStream]);

  return (
    <div className='h-screen w-screen flex items-center justify-center'>
      <div>
        {livestreamContext?.liveStream ?
          <video
          ref={videoRef}
          autoPlay
          height={400}
          width={500}
        ></video>
          : null}
      </div>
      <button onClick={livestreamContext?.linkStream}>Click</button>
    </div>
  );
};

export default LiveStream