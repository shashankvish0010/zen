import {createContext, useReducer, useState} from 'react'

interface Contextvalue{
 state : any 
 dispatch: any 
 user: userType
 message: string | undefined 
 handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

interface userType {
    email: string | undefined;
    password: string | undefined;
}

export const UserContext = createContext<Contextvalue | null>(null)

export const UserauthProvider = (props: any) => {

    const [message, setMessage] = useState<string | undefined >();

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
                    const response = await fetch('/user/login/'+action.id, {
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
                        if(data.success === true && data.verified === true){
                            setMessage(data.message)
                            document.cookie = `user_access=${data.token}; path=/`
                            return state(data)
                        }
                        else{
                            setMessage(data.message)
                            return state(data)
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
                return state(false)
            }
        }
    }

    const [state, dispatch] = useReducer(reducer, null)

    const info: Contextvalue = {
        state, dispatch, handleChange, message,  user
    }
  return (
   <UserContext.Provider value={info}>
    {props.children}
   </UserContext.Provider>
  )
}

