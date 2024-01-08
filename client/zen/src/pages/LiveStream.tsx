import React, { useContext, useEffect, useRef } from 'react'
// import ReactPlayer from 'react-player'
import { Socketcontext } from '../context/Socketcontext'

// const LiveStream: React.FC = () => {
//     const livestreamContext = useContext(Socketcontext);

//     useEffect(() => {
//         console.log("media", livestreamContext?.liveStream);
//     }, [livestreamContext?.liveStream]);

//     return (
//         <div className='h-screen w-screen flex items-center justify-center'>
//             <div>
//                 {livestreamContext?.liveStream && (
//                     <ReactPlayer
//                         playing
//                         url={livestreamContext?.liveStream}
//                         height={400}
//                         width={500}
//                     />
//                 )}
//             </div>
//             <button onClick={livestreamContext?.linkStream}>Click</button>
//         </div>
//     );
// };

const LiveStream: React.FC = () => {
  const livestreamContext = useContext(Socketcontext);
  const videoRef = useRef<any | null>(null);

  useEffect(() => {
    const videoElement = videoRef.current;

    if (livestreamContext?.liveStream instanceof MediaStream && videoElement) {
      videoElement.srcObject = livestreamContext.liveStream;
      videoElement.play().catch((error: Error) => console.error('Error playing video:', error));
    }
  
    return () => {
      // Cleanup
      if (videoElement) {
        videoElement.srcObject = null;
      }
    };
  }, [livestreamContext?.liveStream]);

  return (
    <div className='h-screen w-screen flex items-center justify-center'>
      <div>
        <video ref={videoRef} height={400} width={500} autoPlay playsInline muted={false}></video>
      </div>
      <button onClick={livestreamContext?.linkStream}>Click</button>
    </div>
  );
};

export default LiveStream