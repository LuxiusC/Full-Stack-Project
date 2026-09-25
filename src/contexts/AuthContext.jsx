import { createContext, useEffect, useState } from 'react'
import { auth, storage } from "../firebase"
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import axios from 'axios'

export const AuthContext = createContext()

export function AuthProvider({ children }) {
    const url = "http://localhost:3000"
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [userInfo, setUserInfo] = useState(null)
    const [error, setError] = useState('')
    console.log(user)
    useEffect(() => {
        return auth.onAuthStateChanged((userNow) => {
            setUser(userNow)
            setLoading(false)
        })
    }, [])

    useEffect(() => {
        const fetchUserInfo = async () => {
            if (!user?.uid) return
            try {
                setLoading(true)
                const response = await axios.get(`${url}/profile/${user.uid}`)
                setUserInfo(response.data)
            } catch (err) {
                setError(err, "Failed to fetch data")
            } finally {
                setLoading(false)
            }
        }
        fetchUserInfo()
    }, [user])

    async function handleImageUpload(file) {
        const fileRef = ref(storage, `users/${user.uid}/${file.name}`)
        await uploadBytes(fileRef, file)
        const url = await getDownloadURL(fileRef)
        return url
    }

    const value = { url, user, handleImageUpload, userInfo, error }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}