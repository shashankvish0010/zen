import { createContext } from "react"


interface ContextValue {

}

export const LiveStreamContext = createContext<ContextValue | null>(null)

export const LiveStreamProvider = (props: any) => {
    
    const info: ContextValue = {}

    return (
        <LiveStreamContext.Provider value={info}>
            {props.childrean}
        </LiveStreamContext.Provider>
    )
}

