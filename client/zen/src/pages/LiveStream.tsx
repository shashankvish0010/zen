import React, { isValidElement, useContext, useEffect, useRef } from 'react'
import { Socketcontext } from '../context/Socketcontext'

const LiveStream: React.FC = () => {
  const livestreamContext = useContext(Socketcontext);
  var videoRef = useRef<HTMLVideoElement | any>(null);

  useEffect(() => {
    console.log(livestreamContext?.liveStream);
    const playStream = async () => {
      if (livestreamContext?.liveStream && videoRef.current) {
        try {
          // Check if liveStream is a valid MediaStream
          if (livestreamContext.liveStream instanceof MediaStream) {
            // Set the video source object
            const mediaStream = new MediaStream(livestreamContext.liveStream);

            videoRef.current.srcObject = mediaStream;

            // Play the video
            await videoRef.current.play();
          } else {
            console.error('Invalid MediaStream:', livestreamContext.liveStream);
          }
        } catch (error) {
          console.error('Error playing the video:', error);
        }
      }
    };
    playStream()
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