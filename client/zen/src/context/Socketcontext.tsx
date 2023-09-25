import { createContext, useEffect, useState } from 'react'
import { io } from 'socket.io-client'
// import peer from '../services/peer'

const socket = io('http://localhost:8080')

interface Contextvalue {
    localstream: MediaStream | undefined,
    setCam: any
    cam: Boolean,
    calling: () => void
    getZenList: (id: string | undefined) => void
    zenList: any | undefined
}

const Socketcontext = createContext<Contextvalue | null>(null)

const SocketProvider = (props: any) => {

    socket.on('hello', (data) => console.log(data))
    const [cam, setCam] = useState<boolean>(false)
    const [zenList, setZenList] = useState<any>()
    const [localstream, setLocalStream] = useState<MediaStream>();

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ audio: true, video: true }).then((currentStream) => {
            setLocalStream(currentStream)
        })
    }, [cam])

    const getZenList = async (id: string | undefined) => {
        console.log("enter");

        try {
            const response = await fetch('/get/zenlist/' + id, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            })
            if (response) {
                const data = await response.json();
                console.log(data);
                setZenList(data)
            }
        } catch (error) {
            console.log(error);
        }
    }

    const calling = () => {
        setCam(!cam);
    }

    const info: Contextvalue = { localstream, setCam, cam, calling, getZenList, zenList }
    return (
        <Socketcontext.Provider value={info}>
            {props.children}
        </Socketcontext.Provider>
    )
}

export { Socketcontext, SocketProvider }