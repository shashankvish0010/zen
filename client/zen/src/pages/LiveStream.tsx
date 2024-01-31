import React, { useContext, useEffect } from 'react';
import { Socketcontext } from '../context/Socketcontext';

const LiveStream: React.FC = () => {
  const livestreamContext = useContext(Socketcontext);
  useEffect(()=>{
    const playStream = async () => {
      if (livestreamContext?.liveStream) {
        try {
          // Check if liveStream is a valid MediaStreamTrack
          if (livestreamContext.liveStream instanceof MediaStreamTrack) {
            // Create a new MediaStream with the track
            var stream = new MediaStream([livestreamContext.liveStream]);
            console.log("stream",stream);
            // Set the video source object
            var videoElement = document.getElementById('video') as HTMLVideoElement;
            videoElement.srcObject=stream
            videoElement.play()
            // Play the video
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
}, [livestreamContext?.liveStream])

  return (
    <div className='h-screen w-screen flex items-center justify-center'>
      <div>
        {livestreamContext?.liveStream ? (
          <video
          id='video'
            autoPlay = {false}
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