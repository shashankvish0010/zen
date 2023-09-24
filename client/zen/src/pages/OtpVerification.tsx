import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom';

const OtpVerification: React.FC = () => {
    const navigate = useNavigate()
    const params = useParams()
    const [otp, setOtp] = useState<number | undefined>()

    const [message, setMessage] = useState<string | undefined>();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        console.log("enter");
        
        try {
            const response = await fetch('/otp/verification/'+params.id, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    otp
                })
            })
            if (response) {
                const data = await response.json()
                console.log(data);
                
                if(data.success == true){
                    navigate('/login')
                }else{
                setMessage(data.message)
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleResend = async () => {
        const response = await fetch('/resend/otp/'+params.id, {
            method: "GET",
            headers: {
                "Content-Type" : "application/json"
            }
        })
        if(response){
            const data = await response.json();
            if(data.success === true){
                setMessage("Check your Inbox / Spam folder")
            }else{
                console.log(data);
            }
        }else{
            console.log("Cant recieved response");
        }
    }

    return (
        <div className='h-[100vh] w-[100vw] flex flex-col gap-5 justify-center items-center'>
            {message ?
                <span className='shadow p-1 font-medium bg-purple-600 text-white'>{message}</span>
                : null
            }
            <div className='w-max h-max flex flex-col justify-evenly gap-5 p-5 shadow'>
                <h1 className='text-2xl font-semibold'>OTP Verification</h1>
                <span className='w-[100%] h-[0.2rem] bg-purple-600 rounded'></span>
                <form method='POST' className='flex flex-col justify-arounf items-center gap-3'>
                    <span className='flex flex-col gap-1'>
                        <p className='text-sm text-gray-600'>Enter OTP</p>
                        <input className='px-2 h-[2.25rem] w-[65vw] md:w-[30vw] border rounded' type="number" name='otp' value={otp} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setOtp(Number(e.target.value))} />
                    </span>
                </form>
                <span className='h-max w-[100%] flex flex-row items-center justify-between px-3'>
                <p className='font-normal'>Didn't recieved Otp </p>
                <span className='text-blue-600' onClick={handleResend}>Resend</span>
                </span>
                <button onClick={handleSubmit} className='bg-purple-600 p-2 font-medium text-white rounded'>Submit</button>
            </div>
        </div>
    )
}

export default OtpVerification