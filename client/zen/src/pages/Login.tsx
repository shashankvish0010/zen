import React, { useContext, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/userauth'
// interface userType {
//     email: string | undefined;
//     password: string | undefined;
// }
const Login: React.FC = () => {
    const userauth = useContext(UserContext)
    const params = useParams()
    const navigate = useNavigate()

    useEffect(()=> { 
        if(userauth?.state.success === true && userauth?.state.verified === true){
            navigate('/')
        }
     },[])
    
    return (
        <div className='h-[100vh] w-[100vw] flex flex-col gap-5 justify-center items-center'>
            { userauth?.message ?
                <span className='shadow p-1 font-medium bg-purple-600 text-white'>{userauth.message}</span>
                : null
            }
            <div className='w-max h-max flex flex-col justify-evenly gap-5 p-5 shadow'>
                <h1 className='text-2xl font-semibold'>Log In</h1>
                <span className='w-[100%] h-[0.2rem] bg-purple-500 rounded'></span>
                <form method='POST' className='flex flex-col justify-arounf items-center gap-3'>
                    <span className='flex flex-col gap-1'>
                        <p className='text-sm text-gray-600'>Email</p>
                        <input className='px-2 h-[2.25rem] w-[65vw] md:w-[45vw] border rounded' type="text" name='email' value={userauth?.user?.email} onChange={userauth?.handleChange} />
                    </span>
                    <span className='flex flex-col gap-1'>
                        <p className='text-sm text-gray-600'>Password</p>
                        <input className='px-2 h-[2.25rem] w-[65vw] md:w-[45vw] border rounded' type="password" name='password' value={userauth?.user?.password} onChange={userauth?.handleChange} />
                    </span>
                </form>
                <button onClick={()=>{userauth?.dispatch({type: "LOGIN", id: params.id})}} className='bg-purple-500 p-2 font-medium text-white rounded'>Log In</button>
            </div>
        </div>
    )
}

export default Login