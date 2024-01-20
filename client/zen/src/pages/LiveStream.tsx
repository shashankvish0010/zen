import React, { useContext, useEffect, useState } from 'react'
import ReactPlayer from 'react-player'
import { Socketcontext } from '../context/Socketcontext'

const LiveStream: React.FC = () => {
  const livestreamContext = useContext(Socketcontext);
  const [stream, setStream] = useState()

  useEffect(() => {
     setStream(livestreamContext?.liveStream)
     console.log(stream); 
  }, [livestreamContext?.liveStream, stream]);

  return (
    <div className='h-screen w-screen flex items-center justify-center'>
      <div>
        {stream ?
          <ReactPlayer
              playing={true}
              url={stream}
              height={400}
              width={500}
          />
          : null}
      </div>
      <button onClick={livestreamContext?.linkStream}>Click</button>
    </div>
  );
};

export default LiveStream