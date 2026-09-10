import { createContext, useEffect, useState } from 'react'
import { auth } from "../firebase"

export const AuthContext = createContext()

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        return auth.onAuthStateChanged((userNow) => {
            setUser(userNow)
            setLoading(false)
        })
    }, [])

    const value = { user }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}