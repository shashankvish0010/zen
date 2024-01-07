import React, { useContext, useEffect } from 'react'
import ReactPlayer from 'react-player'
import { Socketcontext } from '../context/Socketcontext'
const CreatorLiveStream: React.FC = () => {

    const livestreamcontext = useContext(Socketcontext)

    useEffect(() => {
        livestreamcontext?.getLocalStream()
    }, [])

    return (
        <div className='h-screen w-screen flex flex-col items-center gap-5'>
            <div>
                {
                    livestreamcontext?.localLiveStream &&
                    <ReactPlayer playing url={livestreamcontext?.localLiveStream} height={400} width={500} />
                }
            </div>
            <div>
                {livestreamcontext ? (
                    <ReactPlayer
                        playing
                        url={livestreamcontext.liveStream}
                        height={400}
                        width={500}
                    />
                ) : null}
            </div>
            <button onClick={() => livestreamcontext?.linkStream()}>Click</button>
        </div>
    )

}

export default CreatorLiveStream