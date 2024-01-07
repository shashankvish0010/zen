import React, {useContext} from 'react'
import ReactPlayer from 'react-player'
import { Socketcontext } from '../context/Socketcontext'

const LiveStream: React.FC = () => {
    const livestreamContext = useContext(Socketcontext)
    return (
        <div className='h-screen w-screen flex items-center justify-center'>
            <div>
                {
                    livestreamContext?.liveStream &&
                    <ReactPlayer playing url={livestreamContext?.liveStream} height={400} width={500} />
                }
            </div>
            <button onClick={()=>{livestreamContext?.createViewerTransport()}}>Click</button>
        </div>
    )
}

export default LiveStream