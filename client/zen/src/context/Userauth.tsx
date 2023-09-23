import {createContext, useReducer, useState} from 'react'

interface Contextvalue{
 state : any 
 dispatch: any 
 user: userType
 message: string | undefined 
 handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
 login: accountStatus | undefined
}

interface userType {
    email: string | undefined
    password: string | undefined
}

interface accountStatus {
    id : string | undefined
    status : boolean
    verified : boolean
}

export const UserContext = createContext<Contextvalue | null>(null)

export const UserauthProvider = (props: any) => {

    const [message, setMessage] = useState<string | undefined >();

    const [login, setLogin] = useState<accountStatus>();

    const [user, setUser] = useState<userType>({
        email: "",
        password: "",
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setUser(user => ({
            ...user,
            [name]: value
        }))
    }

    const reducer = async (state: any, action: any) => {
        switch(action.type){
            case "LOGIN" : {
                const { email, password } = user
                try {
                    const response = await fetch('/user/login', {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            email, password
                        })
                    })
                    if (response) {
                        const data = await response.json();
                        if(data.success === true){
                            setMessage(data.message)
                            document.cookie = `user_access=${data.token}; path=/`      
                            setLogin(login=>({
                                ...login,
                                id: data.id,
                                status : data.success,
                                verified: data.verified
                            }))                      
                            return {...state, data}
                        }
                        else{
                            setMessage(data.message)
                            setLogin(data.success)                      
                            return {...state, data}
                        }
                    }
                } catch (error) {
                    console.log(error);
                }
                break;
            }
            case "LOGOUT" : {
                const cookie = document.cookie
                document.cookie = cookie + ";max-age=0"
                return {...state, success : false}
            }

            default : return state
        }
    }

    const [state, dispatch] = useReducer<any>(reducer, '')

    const info: Contextvalue = {
        state, dispatch, handleChange, message, user, login
    }
  return (
   <UserContext.Provider value={info}>
    {props.children}
   </UserContext.Provider>
  )
}

