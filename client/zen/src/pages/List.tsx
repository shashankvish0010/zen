import React, { useContext, useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { Socketcontext } from '../context/Socketcontext';
import { UserContext } from '../context/Userauth';

interface userType {
  id: string
  firstname: string | undefined,
  zen_no: number
}

const List: React.FC = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const socketcontext = useContext(Socketcontext)
  const usercontext = useContext(UserContext)
  const [zenNo, setZenNo] = useState<number | undefined>()
  const [message, setMessage] = useState<string | null>(null)
  const saveList = async (id: string | undefined) => {
    try {
      const response = await fetch('https://zen-backend-6acy.onrender.com' + '/add/tozenlist/' + id, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          zenNo
        })
      })
      if (response) {
        const data = await response.json();
        setMessage(data.message)
      }
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    usercontext?.login == false ? navigate('/login') : null
  }, [])
  useEffect(() => {
    socketcontext?.getZenList(id)
  }, [])
  useEffect(() => {
    console.log
      (socketcontext?.reciever)
  }, [])

  return (
    <div className='h-[100vh], w-[100vw] flex flex-col justify-center items-center gap-5'>
      {socketcontext?.reciever == true ?
        <div className='bg-purple-600 flex flex-col p-3 mt-3 md:w-[30vw] w-[80vw] gap-5 rounded shadow items-center'>
          <div>
            <Icon icon="ic:baseline-wifi-calling-3" color='white' height='5vh' />
          </div>
          <div className='h-max w-[100%] px-2 flex justify-evenly'>
            <span onClick={() => { socketcontext?.pickCall(); socketcontext?.setPicked(true); navigate('/videocall') }} className='h-max w-max px-2 rounded shadow bg-green-500 text-white font-semibold'>Answer</span>
            <span className='h-max w-max px-2 rounded shadow bg-red-500 text-white font-semibold'>Decline</span>
          </div>
        </div>
        : null
      }
      <div className='w-max h-max p-2 flex flex-col items-center gap-5'>
        <span className='text-gray-800 font-semibold text-xl'>Enter <span className='text-purple-600 font-bold'>ZEN No</span>. and save directly to your list</span>
        {message ?
          <span className='shadow p-1 font-medium bg-purple-600 text-white'>{message}</span>
          : null
        }
        <input className='px-2 h-[2.25rem] w-[65vw] md:w-[35vw] border rounded' placeholder='Enter ZEN No.' type="text" name='email' value={zenNo} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setZenNo(Number(e.target.value))} />
        <span onClick={() => saveList(id)} className='bg-blue-600 flex flex-row items-center gap-2 text-white font-medium rounded shadow p-2'><Icon icon="gridicons:add" color='white' /> Add Contact </span>
      </div>
      <div className='h-max w-max flex flex-wrap items-center justify-evenly gap-7'>
        <div className="md:block hidden overflow-hidden border rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr className='h-max w-max'>
                <th
                  scope="col"
                  className="px-6 py-3 text-xs font-bold text-center text-gray-500 uppercase "
                >
                  No.
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-xs font-bold text-center text-gray-500 uppercase "
                >
                  Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-xs font-bold text-center text-gray-500 uppercase "
                >
                  Zen No.
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-xs font-bold text-center text-gray-500 uppercase "
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-xs font-bold text-center text-gray-500 uppercase "
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {socketcontext?.zenList ? socketcontext.zenList.data.map((list: userType) =>
                <tr className='h-max w-max'>
                  <td className="px-6 py-4 text-sm font-medium text-center whitespace-nowrap">
                    <Icon icon="material-symbols:person" height='4vh' />
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-center whitespace-nowrap">
                    {list.firstname}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-center whitespace-nowrap">
                    {list.zen_no}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-center whitespace-nowrap">
                    <p className='bg-red-200 text-red-600 p-1 rounded'>In Active</p>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-center whitespace-nowrap">
                    <span onClick={() => { socketcontext?.calling(list.zen_no); navigate('/calling/' + list.zen_no) }} className='flex justify-center items-center gap-2 shadow-md cursor-pointer h-max w-max p-1 bg-blue-600 font-semibold text-base text-white rounded'> <Icon icon="ri:live-fill" /><p>Call</p></span>
                  </td>
                </tr>
              ) : null
              }
            </tbody>
          </table>
        </div>
        <div className='md:hidden w-[90vw] h-max shadow-md flex flex-col gap-1'>
          <p className='text-base font-semibold'>Contact Directory</p>
          <span className='h-[.25rem] w-[100%] bg-purple-600 rounded-md'></span>
          {
            socketcontext?.zenList ? socketcontext.zenList.data.map((list: userType) => (
              <div className='h-max w-[90vw] p-2 rounded flex bg-slate-100 border-2 border-gray-200 flex-row justify-between items-center'>
                <span>
                  <Icon icon="material-symbols:person" height='4vh' />
                </span>
                <span className='flex flex-col gap-1'>
                  <p className='font-medium text-base'>Shashank</p>
                  <p className='text-sm font-normal text-gray-500'>987654</p>
                </span>
                <span onClick={() => { socketcontext?.calling(list.zen_no); navigate('/calling/' + list.zen_no) }} className='flex justify-center items-center gap-2 shadow-md cursor-pointer h-max w-max p-1 bg-blue-600 font-semibold text-base text-white rounded'> <Icon icon="ri:live-fill" /><p>Call</p></span>
              </div>

            ))
            : null
          }
        </div>
      </div>
    </div>
  )
}

export default List