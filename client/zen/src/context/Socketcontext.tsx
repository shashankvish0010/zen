import { createContext, useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import peer from '../services/peer'

const socket = io('http://localhost:8080')

interface Contextvalue {
    // myStream: React.MutableRefObject<any | null> | MediaStream
    // remoteStream: React.MutableRefObject<any | null> | MediaStream
    sharedTracks: MediaStream | MediaStreamTrack[] | undefined
    setCam: any
    cam: Boolean,
    calling: (zenNo: number | undefined) => void
    getZenList: (id: string | undefined) => void
    zenList: any | undefined
    callConnected: boolean
    reciever: boolean
    pickCall: () => void
    picked: boolean
    setPicked: any

}

const Socketcontext = createContext<Contextvalue | null>(null)
const SocketProvider = (props: any) => {

    // const myStream: React.MutableRefObject<any | null> | MediaStream = useRef(null)
    // const remoteStream: React.MutableRefObject<any | null> = useRef(null)


    const [cam, setCam] = useState<boolean>(false)
    const [zenList, setZenList] = useState<any>()
    const [socketid, setSocketId] = useState<string>()
    const [reciever, setReciever] = useState<boolean>(false)
    const [callConnected, setCallConnected] = useState<boolean>(false)
    const [picked, setPicked] = useState<boolean>(false)
    const [sharedTracks, setSharedTracks] = useState<MediaStream | MediaStreamTrack[]>();
    // const [secondStream, setSecondStream] = useState<MediaStream>();
    // const [remotestream, setRemoteStream] = useState<MediaStream>();

    socket.on('hello', async (data) => {
        console.log(data);
        setSocketId(data)        
    })

    useEffect(() => {
        const art = async () =>{
            const userMediaStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
            const tracksToShare = userMediaStream.getTracks();
            setSharedTracks(tracksToShare);
        }
art()
    }, [])

    const getZenList = async (id: string | undefined) => {
        console.log("enter");

        try {
            const response = await fetch('/get/zenlist/' + id + '/' + socketid, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
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


      
    const calling = async (zenNo: number | undefined) => {
        console.log("calling", socketid);
        const offer = await peer.generateOffer()
        setCam(!cam);
        socket.emit('call', zenNo, socketid, offer)
    }

    socket.on("callercalling", () => {
        setReciever(true)        
    })

    const pickCall = async () => {
        setReciever(false)
        // const tracksToShare = sharedTracks
        // tracksToShare?
        // tracksToShare.forEach((track: any) => {
        //   peer.peer.addTrack(track, sharedTracks);
        // }) : null
        socket.emit('recieved')
    }

    socket.on('incomingcall', async (data) => {
        console.log(data)
        try {
            const answer = await peer.genarateAnswer(data.sendersOffer)
            socket.emit('callrecieved', answer, { from: data.sender })
        } catch (error) {
            console.log(error);
        }
    })

    socket.on('callaccepted', async (data) => {
        try {
            console.log("ac", data.answer);
            setPicked(data.picked)
            await peer.setlocalDescription(data.answer)
            setCallConnected(true)
        }
         catch (error) {
            console.log(error);
        }
    })

    const info: Contextvalue = { sharedTracks, setPicked, picked, pickCall, reciever, setCam, cam, calling, getZenList, zenList, callConnected }
    return (
        <Socketcontext.Provider value={info}>
            {props.children}
        </Socketcontext.Provider>
    )
}

export { Socketcontext, SocketProvider }