import React, {useContext, useEffect} from 'react'
import { useParams } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { Socketcontext } from '../context/Socketcontext';

interface userType{
    name: string | undefined,
    zenno: number
}

const List: React.FC = () => {
    const {id} = useParams()
    const socketcontext = useContext(Socketcontext)
    useEffect(() => {
        console.log("en");
        
        socketcontext?.getZenList(id)        
    }, [id])
    
  return (
    <div className='h-[100vh], w-[100vw] flex justify-center items-center gap-5'>
{  socketcontext?.zenList.map((list: userType)=>
            <div className='h-max w-max flex flex-col justify-center items-center'>
            <Icon icon="material-symbols:person" />
            <span className='text-base font-semibold'>{list.name}</span>
            <span className='text-md font-semibold'>{list.zenno}</span>
            <span className='flex justify-center items-center gap-3 shadow-md cursor-pointer h-max w-max p-2 bg-orange-600 font-semibold text-xl text-white rounded-md'> <Icon icon="ri:live-fill" /><p>Call</p></span>
            </div>
            )
}
    </div>
  )
}

export default List