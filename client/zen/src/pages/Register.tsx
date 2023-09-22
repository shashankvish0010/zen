import React, { useState } from 'react'

interface userType {
    firstname : string | undefined;
    lastname: string| undefined;
    email: string| undefined;
    password: string| undefined;
    confirm_password: string| undefined
}
const Register: React.FC = () => {

    const [user, setUser] = useState<userType>({
        firstname : "",
        lastname: "",
        email: "",
        password: "",
        confirm_password: ""
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target
        setUser(user => ({
            ...user,
            [name] : value
        }) )
    } 

    // const handleSubmit = ()
    return (
        <div className='h-[100vh] w-[100vw] flex justify-center items-center'>
            <div className='w-max h-max flex flex-col justify-evenly gap-5 p-5 shadow'>
                <h1 className='text-2xl font-semibold'>Register</h1>
                <span className='w-[100%] h-[0.2rem] bg-purple-500 rounded'></span>
                <form method='POST' className='flex flex-col justify-arounf items-center gap-3'>
                    <span className='flex flex-col gap-1'>
                        <p className='text-sm text-gray-600'>Firstname</p>
                        <input className='px-2 h-[2.25rem] w-[65vw] md:w-[45vw] border rounded' type="text" name='firstname' value={user?.firstname} onChange={handleChange} />
                    </span>
                    <span className='flex flex-col gap-1'>
                        <p className='text-sm text-gray-600'>Lasname</p>
                        <input className='px-2 h-[2.25rem] w-[65vw] md:w-[45vw] border rounded' type="text" name='lastname' value={user?.lastname} onChange={handleChange} />
                    </span>
                    <span className='flex flex-col gap-1'>
                        <p className='text-sm text-gray-600'>Email</p>
                        <input className='px-2 h-[2.25rem] w-[65vw] md:w-[45vw] border rounded' type="text" name='email' value={user?.email} onChange={handleChange} />
                    </span>
                    <span className='flex flex-col gap-1'>
                        <p className='text-sm text-gray-600'>Password</p>
                        <input className='px-2 h-[2.25rem] w-[65vw] md:w-[45vw] border rounded' type="password" name='password' value={user?.password} onChange={handleChange} />
                    </span>
                    <span className='flex flex-col gap-1'>
                        <p className='text-sm text-gray-600'>Confirm Password</p>
                        <input className='px-2 h-[2.25rem] w-[65vw] md:w-[45vw] border rounded' type="password" name='confirm_password' value={user?.confirm_password} onChange={handleChange} />
                    </span>
                </form>
                <button className='bg-purple-500 p-2 font-medium text-white rounded'>Register</button>
            </div>
        </div>
    )
}

export default Register