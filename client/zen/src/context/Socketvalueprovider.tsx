import { createContext } from "react";
import { io } from "socket.io-client";

export const Socketproviders = createContext<any>(null)

export const SocketValueProvider = (props: any) => {

    // const socket = io('https://zen-backend-6acy.onrender.com')

    const info = io('https://zen-backend-6acy.onrender.com') 

    return (
        <Socketproviders.Provider value={info}>
            {props.children}
        </Socketproviders.Provider>
    )
}