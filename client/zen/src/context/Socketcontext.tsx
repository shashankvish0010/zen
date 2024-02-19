import { createContext, useCallback, useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import peer from '../services/peer'
import { Device } from 'mediasoup-client';
import { RtpCapabilities } from 'mediasoup-client/lib/RtpParameters'
const socket = io('https://zen-backend-6acy.onrender.com')

interface Contextvalue {
    // Context Values for Zen Call
    remoteStream: any
    LocalStream: any
    // mycamera: boolean
    // mymic: boolean
    calling: (zenNo: number | undefined) => void
    getZenList: (id: string | undefined) => void
    handleNegotiation: () => void
    endCall: () => void
    // controlMic: () => void
    zenList: any | undefined
    reciever: boolean
    pickCall: () => void
    picked: boolean
    setPicked: any
    socketid: string | undefined

    // Context Values for Zen Live
    getLocalStream: () => void
    localLiveStream: any
    liveStream: any
    viewer: any
    createViewerTransport: () => void
    linkStream: () => void
}

const Socketcontext = createContext<Contextvalue | null>(null)
const SocketProvider = (props: any) => {
    // const [mycamera, setMyCamera] = useState<boolean>(true)
    // const [mymic, setMyMic] = useState<boolean>(true)
    const [zenList, setZenList] = useState<any>()
    const [socketid, setSocketId] = useState<string>()
    const [caller, setCaller] = useState<boolean>(false)
    const [reciever, setReciever] = useState<boolean>(false)
    const [picked, setPicked] = useState<boolean>(false)
    const [LocalStream, setLocalStream] = useState<any>();
    const [startStream, setStartStream] = useState<boolean>(false);
    const [remoteStream, setRemoteStream] = useState<any>();
    const [recvZenNo, setrecvZenNo] = useState<any>()

    function getSocketId(data: string) {
        console.log("called socket", data);
        
        setSocketId(data)
    }

    // const controlCamera = () => {
    //     setMyCamera(!mycamera)
    //     console.log("cam", mycamera);
    // }

    // const controlMic = () => {
    //     setMyMic(!mymic)
    //     console.log("mic", mymic);
    // }

    const getZenList = async (id: string | undefined) => {

        try {
            const response = await fetch('https://zen-backend-6acy.onrender.com/' + 'get/zenlist/' + id, {
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
        navigator.mediaDevices.getUserMedia({ audio: true, video: true }).then((UsersStream) => {
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
        setrecvZenNo(zenNo)
        socket.emit('call', zenNo, socketid, offer)
        setCaller(true)
    }

    async function recieverCall(data: any) {
        const { sendersOffer } = data
        const answer = await peer.generateAnswer(sendersOffer)
        socket.emit('callrecieved', answer)
    }

    async function callaccepted(data: any) {
        console.log("ener fin");
        
        const { answer, picked } = data
        setPicked(picked)
        await peer.setRemoteDescription(answer).then(()=>{
            socket.emit('done')
        })
    }

    function callercalling() {
        setReciever(true)
    }

    const pickCall = () => {
        setReciever(false)
        socket.emit('recieved')
    }

    async function handleNegotiation() {
        console.log("clicked");
        if (caller == true) {
            const offer = await peer.generateOffer();
            socket.emit('call', recvZenNo, socketid, offer)
        } else {
            pickCall()
        }
    }

    const endCall = () => {
        setLocalLiveStream(null)
        setRemoteStream(null)
        peer.peer.close()
        window.location.href = '/'
    }

    // async function negotiationaccept(data: any) {
    //     console.log("clicked accept");
    //     const answer = await peer.generateAnswer(data.sendersNegoOffer)
    //     socket.emit('negotiationdone', answer)
    // }

    // async function acceptnegotiationanswer(data: any) {
    //     await peer.setRemoteDescription(data.receiverNegoAnswer).then(() => {
    //         socket.emit('done')
    //     })
    // }

    // useEffect(() => {
    //     peer.peer.addEventListener('negotiationneeded', handleNegotiation);
    //     return () => {
    //         peer.peer.removeEventListener('negotiationneeded', handleNegotiation)
    //     }
    // }, [handleNegotiation])

    useEffect(() => {
            if (startStream == true) {
                peer.peer.addEventListener('track', async (event: any) => {
                    const [remoteStream] = event.streams;
                    setRemoteStream(remoteStream)
                });
            }
    }, [startStream])


    useEffect(() => {
        socket.on('hello', getSocketId)
        socket.on("callercalling", callercalling)
        socket.on('recieverCall', recieverCall)
        socket.on('callaccepted', callaccepted)
        // socket.on('negotiationaccept', negotiationaccept)
        // socket.on('acceptnegotiationanswer', acceptnegotiationanswer)
        socket.on('videocall', videcall)

        return () => {
            socket.off('hello', getSocketId)
            socket.off("callercalling", callercalling)
            socket.off('recieverCall', recieverCall)
            socket.off('callaccepted', callaccepted)
            // socket.off('negotiationaccept', negotiationaccept)
            // socket.off('acceptnegotiationanswer', acceptnegotiationanswer)
            socket.off('videocall', videcall)
        }
    }
        , [socket, getSocketId, callercalling,
            callaccepted,
            // negotiationaccept,
            // acceptnegotiationanswer,
            videcall
        ])

    // --------------------------------------------- Live Streaming Code -----------------------------------------------------

    const [localLiveStream, setLocalLiveStream] = useState<any | MediaStream>()
    const [liveStream, setliveStream] = useState<any | MediaStream>()
    let key: boolean = false
    let device: any;
    let streamerTransport: any;
    let viewerTransport: any;
    let streamer: any;
    let viewer: any;
    let transparams: any;

    const getLocalStream = useCallback(() => {
        navigator.mediaDevices.getUserMedia({ audio: true, video: true }).then((myLocalStream) => {
            const track = myLocalStream.getVideoTracks()[0];
            console.log(track);

            key = true
            setLocalLiveStream(myLocalStream)
            transparams = {
                encoding: [
                    {
                        rid: 'r0',
                        maxBitrate: 100000,
                        scalabilityMode: 'SIT3',
                    },
                    {
                        rid: 'r1',
                        maxBitrate: 300000,
                        scalabilityMode: 'SIT3',
                    },
                    {
                        rid: 'r2',
                        maxBitrate: 900000,
                        scalabilityMode: 'SIT3',
                    },
                ],
                codecOptions: {
                    videoGoogleStartBitrate: 1000,
                },
                track
            }
            console.log("key", key);

            socket.emit('livestream', key)
        })
    }, [])

    const createDevice = useCallback((RTPCapabilities: RtpCapabilities, key: boolean) => {
        try {
            device = new Device()
            device.load({
                routerRtpCapabilities: RTPCapabilities
            }).then(() => {
                console.log("device created")
                if (key == true) {
                    createStreamerTransport()
                } else {
                    createViewerTransport()
                }
            }).catch((error: Error) => console.log(error))
        } catch (error) {
            console.log(error);
        }
    }, [])

    const getRtpCapabilities = ({ RTPCapabilities }: any, key: boolean) => {
        console.log(RTPCapabilities, key);
        createDevice(RTPCapabilities, key)
    }

    const createStreamerTransport = async () => {
        socket.emit('createWebRTCTransport', { sender: true }, async ({ params }: any) => {
            params ? streamerTransport = await device.createSendTransport(params) : console.log("Params not available");
            console.log("entered in createStreamerTransport", params.dtlsParameters);
            if (streamerTransport && params.dtlsParameters) {
                streamerTransport.on('connect', async ({ dtlsParameters }: any, callback: () => void, errback: any) => {
                    try {
                        console.log("entered in createStreamerTransport connect");

                        socket.emit('transportConnect', {
                            dtlsParameters
                        })
                        callback()
                    } catch (error) {
                        errback(error)
                    }
                })

                streamerTransport.on('produce', async (parameters: any, callback: any, errback: any) => {
                    try {
                        console.log("entered in createStreamerTransport produce", parameters)

                        socket.emit('transportProduce', {
                            kind: parameters.kind,
                            rtpParameters: parameters.rtpParameters,
                        }, ({ id }: any) => {
                            callback({ id })
                            console.log({ id });
                        })
                    } catch (error) {
                        errback(error);
                    }
                })
                connectStreamerTransport(transparams);
            }
        })
    }

    const connectStreamerTransport = async (params: any) => {
        console.log("entered connectStreamerTransport", params);

        if (!params || !params.track || params.track.length === 0) {
            console.log("Local Tracks are Missing");
        } else {
            streamer = await streamerTransport.produce({ track: params.track })
            streamer.on('trackended', () => console.log("track ended"));
            streamer.on('transportclose', () => console.log("trasport ended"));
        }
    }

    const linkStream = () => {
        key = false
        socket.emit('getRtp')
    }

    const consumerRTP = (RTPCapabilities: RtpCapabilities) => {
        createDevice(RTPCapabilities, key)
    }

    const createViewerTransport = useCallback(() => {
        socket.emit('createWebRTCTransport', { sender: false }, ({ params }: any) => {
            if (params.error) {
                console.log(params.error);
                return
            }
            console.log("createViewerTransport", params);

            if (params && params.dtlsParameters) {
                viewerTransport = device.createRecvTransport(params)
                console.log("Viewer Transport", viewerTransport);
                viewerTransport.on('connect', ({ dtlsParameters }: any, callback: any, errback: any) => {
                    try {
                        console.log("Viewer Transport dtlsParameters", dtlsParameters);

                        socket.emit('transportViewerConnect', {
                            dtlsParameters: dtlsParameters
                        })
                        callback();
                        console.log("createViewerTransport connect");
                    } catch (error) {
                        errback(error)
                    }
                })
                connectViewerTransport()
            }
        })
    }, [])

    const connectViewerTransport = useCallback(async () => {
        console.log('connectViewerTransport device', device.rtpCapabilities);

        socket.emit('consume', {
            rtpCapabilities: device.rtpCapabilities,
        }, async ({ params }: any) => {
            if (params.error) {
                console.log("Cant consume", params);
                return
            }
            console.log("params", params);
            const data = await viewerTransport.consume({
                id: params.id,
                producerId: params.producerId,
                kind: params.kind,
                rtpParameters: params.rtpParameters
            })
            if (data.track) {
                setliveStream(data.track);                
                socket.emit("consumerResume")
            }
            else {
                console.log("track is invalid")
            }
        })
    }, [])

    useEffect(() => {
        socket.on('GetRTPCapabilities', getRtpCapabilities)
        socket.on('consumerRTP', consumerRTP)

        return () => {
            socket.off('GetRTPCapabilities', getRtpCapabilities)
            socket.off('consumerRTP', consumerRTP)
        }
    }, [])

    // -------------------------------------------- Value Provider Object ----------------------------------------------------------
    const info: Contextvalue = {
        // Context Values for Video Calling || Zen Call
        socketid, LocalStream, remoteStream, handleNegotiation, endCall, setPicked, picked, pickCall, reciever, calling, getZenList, zenList,
        // Context Values for Live Stream || Zen Live
        getLocalStream, localLiveStream, liveStream, viewer, createViewerTransport,
        linkStream
    }
    return (
        <Socketcontext.Provider value={info}>
            {props.children}
        </Socketcontext.Provider>
    )
}

export { Socketcontext, SocketProvider }