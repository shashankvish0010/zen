import React, { useState } from 'react'

const OtpVerification: React.FC = () => {

    const [otp, setOtp] = useState<number | undefined>()

    const [message, setMessage] = useState<string | undefined>();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const response = await fetch('/user/register', {
                method: "POST",
                headers: {
                    "Content-Type" : "application/json"
                },
                body:JSON.stringify({
                    otp
                })
            })
            if(response){
                const data = await response.json();
                setMessage(data)
                console.log(data);
            }
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <div className='h-[100vh] w-[100vw] flex justify-center items-center'>
            <span>{message}</span>
            <div className='w-max h-max flex flex-col justify-evenly gap-5 p-5 shadow'>
                <h1 className='text-2xl font-semibold'>OTP Verification</h1>
                <span className='w-[100%] h-[0.2rem] bg-purple-500 rounded'></span>
                <form method='POST' className='flex flex-col justify-arounf items-center gap-3'>
                    <span className='flex flex-col gap-1'>
                        <p className='text-sm text-gray-600'>Enter OTP</p>
                        <input className='px-2 h-[2.25rem] w-[65vw] md:w-[45vw] border rounded' type="number" name='otp' value={otp} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>setOtp(Number(e.target.value))} />
                    </span>
                </form>
                <button onClick={handleSubmit} className='bg-purple-500 p-2 font-medium text-white rounded'>Submit</button>
            </div>
        </div>
    )
}

export default OtpVerification