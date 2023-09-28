import { createContext, useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import peer from '../services/peer'
// import { SourceProps } from 'react-player/base'

const socket = io('http://localhost:8080')

interface Contextvalue {
    // myStream: React.MutableRefObject<any | null> | MediaStream
    remoteStream: any
    LocalStream: any
    setCam: any
    cam: Boolean,
    calling: (zenNo: number | undefined) => void
    getZenList: (id: string | undefined) => void
    zenList: any | undefined
    callConnected: boolean
    reciever: boolean
    pickCall: () => void
    sendStream: () => void
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
    const [LocalStream, setLocalStream] = useState<any>();
    // const [secondStream, setSecondStream] = useState<MediaStream>();
    const [remoteStream, setRemoteStream] = useState<any>();

    function getSocketId(data: string) {
        setSocketId(data)
    }

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

    function callercalling() {        
        setReciever(true)
    }

    const pickCall = async () => {
        setReciever(false)
        socket.emit('recieved')
    }

    async function incomingcall(data: any) {
        console.log(data)
        const { sendersOffer } = data
        const answer = await peer.generateAnswer(sendersOffer)
        socket.emit('callrecieved', answer, { from: data.sender })
    }

    async function callaccepted(data: any) {
        const { answer } = data
        console.log("ac", answer);
        setPicked(data.picked)
        await peer.setRemoteDescription(answer)
        socket.emit('videocalldone')
        setCallConnected(true)
    }

    const sendStream = async () => {
        console.log("START");
        const userMediaStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
        setLocalStream(userMediaStream);
    }

    const handleNegotiation = async () =>{
        console.log("negohandle");
        const offer = await peer.generateOffer();
        socket.emit('negotiation', offer)
    }

    async function negotiationaccept (offer: RTCSessionDescription){
        console.log("negoanswer");
        const answer = await peer.generateAnswer(offer)
        socket.emit('negotiationdone', answer)
    }

    async function acceptnegotiationanswer(answer: RTCSessionDescription){
        console.log("negoremote");
        await peer.setRemoteDescription(answer)
    }
    
    useEffect(()=>{
        peer.peer.addEventListener('negotiationneeded', handleNegotiation);
        return () => {
            peer.peer.removeEventListener('negotiationneeded', handleNegotiation)
        }
    }, [])

   useEffect(()=>{
    peer.peer.addEventListener('track', async (e: any) => {
        const remoteStreams = e.streams
        setRemoteStream(remoteStreams[0])
    })
   },[])

    useEffect(() => {
        socket.on('hello', getSocketId)
        socket.on("callercalling", callercalling)
        socket.on('incomingcall', incomingcall)
        socket.on('callaccepted', callaccepted)
        socket.on('negotiationaccept', negotiationaccept)
        socket.on('acceptnegotiationanswer', acceptnegotiationanswer)

        return () => {
            socket.off('hello', getSocketId)
            socket.off("callercalling", callercalling)
            socket.off('incomingcall', incomingcall)
            socket.off('callaccepted', callaccepted)
            socket.off('negotiationaccept', negotiationaccept)
            socket.off('acceptnegotiationanswer', acceptnegotiationanswer)
        }
    }
        , [])

    const info: Contextvalue = { LocalStream, sendStream, remoteStream, setPicked, picked, pickCall, reciever, setCam, cam, calling, getZenList, zenList, callConnected }
    return (
        <Socketcontext.Provider value={info}>
            {props.children}
        </Socketcontext.Provider>
    )
}

export { Socketcontext, SocketProvider }