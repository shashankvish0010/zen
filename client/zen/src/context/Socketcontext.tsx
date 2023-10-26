import { createContext, useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'
// import peer from '../services/peer'
import Peer from 'simple-peer'
const socket = io('https://zen-backend-6acy.onrender.com')

interface Contextvalue {
    remoteStream: any
    LocalStream: any
    setCam: any
    // startStream: boolean
    cam: Boolean,
    calling: (zenNo: number | undefined) => void
    getZenList: (id: string | undefined) => void
    zenList: any | undefined
    // callConnected: boolean
    reciever: boolean
    pickCall: () => void
    picked: boolean
    setPicked: any

}

const Socketcontext = createContext<Contextvalue | null>(null)
const SocketProvider = (props: any) => {

    // const remoteStream: React.MutableRefObject<any | null> = useRef(null)
    const [callpeer, setCallPeer] = useState<any>()
    const [cam, setCam] = useState<boolean>(false)
    const [call, setCall] = useState<any>()
    const [zenList, setZenList] = useState<any>()
    const [socketid, setSocketId] = useState<string>()
    // const [caller, setCaller] = useState<boolean>(false)
    const [reciever, setReciever] = useState<boolean>(false)
    // const [callConnected, setCallConnected] = useState<boolean>(false)
    const [picked, setPicked] = useState<boolean>(false)
    const [LocalStream, setLocalStream] = useState<any>();
    const [stream, setStream] = useState<any>();
    // const [startStream, setStartStream] = useState<boolean>(false);
    // const [remoteStream, setRemoteStream] = useState<any>();

    const remoteStream = useRef<any>()

    function getSocketId(data: string) {
        setSocketId(data)
    }

    const getZenList = async (id: string | undefined) => {

        try {
            const response = await fetch('https://zen-backend-6acy.onrender.com/' + 'get/zenlist/' + id + '/' + socketid, {
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

    useEffect(()=>{
        navigator.mediaDevices.getUserMedia({ audio: true, video: true }).then((UsersStream)=>{
            setLocalStream(UsersStream)
            setStream(UsersStream)
        })
    },[])

    // const streaming = () => {
    //     navigator.mediaDevices.getUserMedia({ audio: true, video: true }).then((UsersStream)=>{
    //         setLocalStream(UsersStream)
    //         UsersStream.getTracks().forEach((track: any) => {
    //             peer.peer.addTrack(track, UsersStream)
    //         })
    //     })
    // }

    // function videcall() {
    //     setStartStream(true)
    //     streaming()
    // }
    

    const calling = async (zenNo: number | undefined) => {

        const peer = new Peer({
            initiator : true,
            trickle : false,
            stream
        });
        setCallPeer(peer)
        peer.on('signal', (signalData: any) => {
            console.log("enter calling signal", signalData);
            socket.emit('call', zenNo, socketid, signalData)
        })

        peer.on('stream', (currentStream: any) => {
            console.log(currentStream);

            remoteStream.current.srcObject = currentStream
        })

        setCam(!cam);
        // setCaller(true)
    }

    function callaccepted (data: any) {
        console.log("enter callacceted", data);
            setPicked(data.picked)
            callpeer.signal(data.signal)
    }

    function callercalling() {
        console.log('callercalling');
        
        setReciever(true)
    }

    const pickCall = async () => {
        console.log('pickcall');

        setReciever(false)
        socket.emit('recieved')
    }

    async function recieverCall(data: any) {
        console.log("recieverCall set the call", data);
        setCall({
            isReceivedCall: true,
            signal : data.sendersSignalData,
            from : data.sender,
        })
        socket.emit('incomingcallfromsender')
    }

    async function incomingcall() {
        console.log("enter incoming signal");

        const peer = new Peer({
            initiator : false,
            trickle: false,
            stream
        })

        peer.on('signal', (data: any) => {
            socket.emit('callrecieved', { signal : data })
        })

        peer.on('stream', (currenStream: any) => {
            console.log(currenStream);
            
            remoteStream.current.srcObject = currenStream
        })

        peer.signal(call.signal);
}

    // async function callaccepted(data: any) {
    //     const { answer } = data
    //     setPicked(data.picked)
    //     await peer.setRemoteDescription(answer)
    //     streaming()
    //     setCallConnected(true)
    // }

    // async function handleNegotiation() {
    //     if (caller == true) {
    //         const offer = await peer.generateOffer();
    //         socket.emit('negotiation', offer)
    //     } else console.log("not a caller")
    // }

    // async function negotiationaccept(data: any) {
    //     const answer = await peer.generateAnswer(data.sendersNegoOffer)
    //     socket.emit('negotiationdone', answer)
    // }

    // async function acceptnegotiationanswer(data: any) {
    //     await peer.setRemoteDescription(data.receiverNegoAnswer).then(()=>{
    //         socket.emit('done')
    //     })
    // }

    // useEffect(() => {
    //     peer.peer.addEventListener('negotiationneeded', handleNegotiation);
    //     return () => {
    //         peer.peer.removeEventListener('negotiationneeded', handleNegotiation)
    //     }
    // }, [handleNegotiation])

    // useEffect(() => {
    //     if(startStream == true){
    //         peer.peer.addEventListener('track', async (event: any) => {
    //             const [remoteStream] = event.streams;
    //             setRemoteStream(remoteStream)
    //         });
    //     }
    // }, [startStream])


    useEffect(() => {
        socket.on('hello', getSocketId)
        socket.on("callercalling", callercalling)
        socket.on('incomingcall', incomingcall)
        socket.on('recieverCall', recieverCall)
        socket.on('callaccepted', callaccepted)
        // socket.on('negotiationaccept', negotiationaccept)
        // socket.on('acceptnegotiationanswer', acceptnegotiationanswer)
        // socket.on('videocall', videcall)

        return () => {
            socket.off('hello', getSocketId)
            socket.off("callercalling", callercalling)
            socket.off('incomingcall', incomingcall)
            socket.off('recieverCall', recieverCall)
            socket.off('callaccepted', callaccepted)
            // socket.off('negotiationaccept', negotiationaccept)
            // socket.off('acceptnegotiationanswer', acceptnegotiationanswer)
            // socket.off('videocall', videcall)
        }
    }
        , [socket, getSocketId, callercalling, incomingcall, 
            callaccepted, 
            // negotiationaccept, 
            // acceptnegotiationanswer, 
            // videcall
        ])

    const info: Contextvalue = { LocalStream, remoteStream, setPicked, picked, pickCall, reciever, setCam, cam, calling, getZenList, zenList }
    return (
        <Socketcontext.Provider value={info}>
            {props.children}
        </Socketcontext.Provider>
    )
}

export { Socketcontext, SocketProvider }