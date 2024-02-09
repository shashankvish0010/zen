import React from 'react'

interface data {
    heading: string
    body: string
}

const AboutFeature: React.FC<data> = (props: data) => {
    return (
        <div className='flex flex-col gap-1'>
            <h2 className='text-2xl text-purple-600'>{props.heading}</h2>
            <p className='content text-base'>
                {props.body}
            </p>
        </div>
    )
}

export default AboutFeature