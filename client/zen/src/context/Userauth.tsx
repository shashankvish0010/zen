import {createContext, useReducer, useState, useEffect} from 'react'

interface Contextvalue{
 state : any 
 dispatch: any 
 user: userType
 message: string | undefined 
 handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
 login: boolean
 curruser : any
}

interface userType {
    email: string | undefined
    password: string | undefined
}

export const UserContext = createContext<Contextvalue | null>(null)

export const UserauthProvider = (props: any) => {

    const storedUser = localStorage.getItem("current_user");
    const initialUser = storedUser ? JSON.parse(storedUser) : null
    const [curruser, setCurrUser] = useState(initialUser || null)

    const [message, setMessage] = useState<string | undefined >();

    const [login, setLogin] = useState<boolean>(false);

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
                        if(data.success == true){
                            setMessage(data.message)
                            document.cookie = `user_access=${data.token}; path=/`      
                            setCurrUser(data.userdata)                            
                            setLogin(data.success)                      
                            return {...state, data}
                        }
                        else{
                            setLogin(data.success)                       
                            setMessage(data.message)                     
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
                console.log("en");
                setCurrUser('')
                setLogin(false)                 
                return {...state, success : false}
            }

            default : return state
        }
    }

    useEffect(() => {
        localStorage.setItem("current_user", JSON.stringify(curruser));
      },[curruser])
    
      useEffect(()=>{
        document.cookie != null ? setLogin(true) : setLogin(false)
      }, [])
    const [state, dispatch] = useReducer<any>(reducer, '')

    const info: Contextvalue = {
        state, dispatch, handleChange, message, user, login, curruser
    }
  return (
   <UserContext.Provider value={info}>
    {props.children}
   </UserContext.Provider>
  )
}

