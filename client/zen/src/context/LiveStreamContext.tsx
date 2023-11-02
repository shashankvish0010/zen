import { createContext } from "react"
import { io } from "socket.io-client"
const socket = io('https://zen-backend-6acy.onrender.com/live')

interface ContextValue {

}

export const LiveStreamContext = createContext<ContextValue | null>(null)

export const LiveStreamProvider = (props: any) => {
    socket
    const info: ContextValue = {}

    return (
        <LiveStreamContext.Provider value={info}>
            {props.childrean}
        </LiveStreamContext.Provider>
    )
}

