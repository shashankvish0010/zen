import { createContext, useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import peer from '../services/peer'
// import { SourceProps } from 'react-player/base'

const socket = io('http://localhost:8080')

interface Contextvalue {
    remoteStream: any
    LocalStream: any
    setCam: any
    startStream: boolean
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

    // const remoteStream: React.MutableRefObject<any | null> = useRef(null)
    const [cam, setCam] = useState<boolean>(false)
    const [zenList, setZenList] = useState<any>()
    const [socketid, setSocketId] = useState<string>()
    const [caller, setCaller] = useState<boolean>(false)
    const [reciever, setReciever] = useState<boolean>(false)
    const [callConnected, setCallConnected] = useState<boolean>(false)
    const [picked, setPicked] = useState<boolean>(false)
    const [LocalStream, setLocalStream] = useState<any>();
    const [startStream, setStartStream] = useState<boolean>(false);
    const [remoteStream, setRemoteStream] = useState<any>();

    function getSocketId(data: string) {
        setSocketId(data)
    }

    const getZenList = async (id: string | undefined) => {

        try {
            const response = await fetch('/get/zenlist/' + id + '/' + socketid, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
            })
            if (response) {
                const data = await response.json();
                setZenList(data)
            }
        } catch (error) {
            console.log(error);
        }
    }

    const streaming = () => {
        navigator.mediaDevices.getUserMedia({ audio: true, video: true }).then((UsersStream)=>{
            setLocalStream(UsersStream)
            UsersStream.getTracks().forEach((track: any) => {
                peer.peer.addTrack(track, UsersStream)
            })
        })
    }

    function videcall() {
        setStartStream(true)
        streaming()
    }

    const calling = async (zenNo: number | undefined) => {
        const offer = await peer.generateOffer()
        setCam(!cam);
        setCaller(true)
        socket.emit('call', zenNo, socketid, offer)
    }

    function callercalling() {
        setReciever(true)
    }

    const pickCall = async () => {
        setReciever(false)
        socket.emit('recieved')
    }

    async function incomingcall(data: any) {
        const { sendersOffer } = data
        const answer = await peer.generateAnswer(sendersOffer)
        socket.emit('callrecieved', answer, { from: data.sender })
    }

    async function callaccepted(data: any) {
        const { answer } = data
        setPicked(data.picked)
        await peer.setRemoteDescription(answer)
        streaming()
        setCallConnected(true)
    }

    async function handleNegotiation() {
        if (caller == true) {
            const offer = await peer.generateOffer();
            socket.emit('negotiation', offer)
        } else console.log("not a caller")
    }

    async function negotiationaccept(data: any) {
        const answer = await peer.generateAnswer(data.sendersNegoOffer)
        socket.emit('negotiationdone', answer)
    }

    async function acceptnegotiationanswer(data: any) {
        await peer.setRemoteDescription(data.receiverNegoAnswer).then(()=>{
            socket.emit('done')
        })
    }

    useEffect(() => {
        peer.peer.addEventListener('negotiationneeded', handleNegotiation);
        return () => {
            peer.peer.removeEventListener('negotiationneeded', handleNegotiation)
        }
    }, [handleNegotiation])

    useEffect(() => {
        if(startStream == true){
            peer.peer.addEventListener('track', async (event: any) => {
                const [remoteStream] = event.streams;
                setRemoteStream(remoteStream)
            });
        }
    }, [startStream])


    useEffect(() => {
        socket.on('hello', getSocketId)
        socket.on("callercalling", callercalling)
        socket.on('incomingcall', incomingcall)
        socket.on('callaccepted', callaccepted)
        socket.on('negotiationaccept', negotiationaccept)
        socket.on('acceptnegotiationanswer', acceptnegotiationanswer)
        socket.on('videocall', videcall)

        return () => {
            socket.off('hello', getSocketId)
            socket.off("callercalling", callercalling)
            socket.off('incomingcall', incomingcall)
            socket.off('callaccepted', callaccepted)
            socket.off('negotiationaccept', negotiationaccept)
            socket.off('acceptnegotiationanswer', acceptnegotiationanswer)
            socket.off('videocall', videcall)
        }
    }
        , [socket, getSocketId, callercalling, incomingcall, callaccepted, negotiationaccept, acceptnegotiationanswer, videcall])

    const info: Contextvalue = { LocalStream, startStream, remoteStream, setPicked, picked, pickCall, reciever, setCam, cam, calling, getZenList, zenList, callConnected }
    return (
        <Socketcontext.Provider value={info}>
            {props.children}
        </Socketcontext.Provider>
    )
}

export { Socketcontext, SocketProvider }