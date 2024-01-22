import React, { useContext, useEffect, useRef } from 'react';
import { Socketcontext } from '../context/Socketcontext';

const LiveStream: React.FC = () => {
  const livestreamContext = useContext(Socketcontext);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(()=>{
  setInterval(() => {
    const playStream = async () => {
      if (livestreamContext?.liveStream && videoRef.current) {
        try {
          // Check if liveStream is a valid MediaStreamTrack
          if (livestreamContext.liveStream instanceof MediaStreamTrack) {
            // Create a new MediaStream with the track
            const mediaStream = new MediaStream([livestreamContext.liveStream]);
            console.log(mediaStream);

            // Set the video source object
            videoRef.current.srcObject = mediaStream;

            // Play the video
            await videoRef.current.play();

            console.log('Video is playing');
          } else {
            console.error('Invalid MediaStreamTrack:', livestreamContext.liveStream);
          }
        } catch (error) {
          console.error('Error playing the video:', error);
        }
      }
    };

    playStream();
  }, 1000);
}, [livestreamContext?.liveStream])

  return (
    <div className='h-screen w-screen flex items-center justify-center'>
      <div>
        {livestreamContext?.liveStream ? (
          <video
            ref={videoRef}
            autoPlay
            height={400}
            width={500}
          ></video>
        ) : null}
      </div>
      <button onClick={livestreamContext?.linkStream}>Click</button>
    </div>
  );
};

export default LiveStream;