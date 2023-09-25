import React, {useContext} from 'react'
import { Socketcontext } from '../context/Socketcontext'
import ReactPlayer from 'react-player'

const VideoCall: React.FC = () => {
    const socketcontext = useContext(Socketcontext)
  return (
    <div className='flex justify-center items-center gap-5 p-3'>
        <div className='h-max w-max p-2'>
            {
                socketcontext?.cam == true ? 
                <ReactPlayer playing url={socketcontext.localstream} height={'60vh'} width={'80vw'}/>
              : null
            }
        </div>
        <button onClick={socketcontext?.calling}>get</button>
    </div>
  )
}

export default VideoCall