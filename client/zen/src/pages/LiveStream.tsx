import React, { useContext, useEffect } from 'react'
import ReactPlayer from 'react-player'
import { Socketcontext } from '../context/Socketcontext'

const LiveStream: React.FC = () => {
    const livestreamContext = useContext(Socketcontext);

    useEffect(() => {
        console.log("media", livestreamContext?.viewer?.track);
    }, [livestreamContext?.viewer?.track]);

    return (
        <div className='h-screen w-screen flex items-center justify-center'>
            <div>
                {livestreamContext ? (
                    <ReactPlayer
                        playing
                        url={livestreamContext?.viewer?.track}
                        height={400}
                        width={500}
                    />
                ) : null}
            </div>
            <button onClick={() => livestreamContext?.linkStream()}>Click</button>
        </div>
    );
};

export default LiveStream