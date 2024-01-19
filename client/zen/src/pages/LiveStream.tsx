import React, { useContext, useMemo, useState } from 'react'
import ReactPlayer from 'react-player'
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
  const [key, setKey] = useState<boolean>(false)

  useMemo(()=> {
    livestreamContext?.liveStream ? setKey(true) : null
  }, [])

  return (
    <div className='h-screen w-screen flex items-center justify-center'>
      <div>
        {
          livestreamContext?.localLiveStream && key == true ?
          <ReactPlayer playing url={livestreamContext?.localLiveStream} height={400} width={500} />
          : null
        }
      </div>
      <button onClick={livestreamContext?.linkStream}>Click</button>
    </div>
  );
};

export default LiveStream