import { createContext, PropsWithChildren, useCallback, useContext, useMemo, useState } from "react";

interface AuthContext {
    signed:boolean,
    login: () => void;
}

const AuthContext = createContext<AuthContext | null>(null)

export const AuthProvider = ({children}: PropsWithChildren<unknown>) => {
    const [signed, setSigned] = useState(false)

    const login = useCallback(() => {
        setSigned(true)
    },[])
    const value = useMemo(() => {
        return ({
            signed,
            login
        })
    }, [signed])

    return (
        <AuthContext.Provider value={value}>
            {
                children
            }
        </AuthContext.Provider>
    )
} 

export const useAuth = () => {
    const context = useContext(AuthContext)
    if(!context){
        throw new Error('useAuth must be used within an AuthContext')
    }
    return context
}