import { createContext } from "react";
import { Socket, io } from "socket.io-client";

interface ContextValue {
    socket: Socket
}

export const socketvalue = createContext<ContextValue | any>(null)

export const SocketValueProvider = (props: any) => {

    const socket = io('https://zen-backend-6acy.onrender.com')

    const info: ContextValue = { socket }

    return (
        <socketvalue.Provider value={info}>
            {props.children}
        </socketvalue.Provider>
    )
}