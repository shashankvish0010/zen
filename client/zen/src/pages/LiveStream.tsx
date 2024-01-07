import React, { useContext, useEffect } from 'react'
import ReactPlayer from 'react-player'
import { Socketcontext } from '../context/Socketcontext'


const LiveStream: React.FC = () => {
    const livestreamContext = useContext(Socketcontext)
    let key: boolean = false
    useEffect(() => {
        console.log(livestreamContext?.liveStream);
        livestreamContext?.liveStream ? key=true : key = false
    }, [livestreamContext?.liveStream])
    return (
        <div className='h-screen w-screen flex items-center justify-center'>
            <div>
                {
                    key && livestreamContext ? 
                    <ReactPlayer playing url={livestreamContext.liveStream} height={400} width={500} />
                    : null
                }
            </div>
            <button onClick={() => { livestreamContext?.linkStream() }}>Click</button>
        </div>
    )
}

export default LiveStream