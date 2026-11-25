import { createContext, useEffect, useState, useCallback } from 'react'
import { auth, storage } from "../firebase.js"
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import axios from 'axios'
import { signOut } from 'firebase/auth'

export const AuthContext = createContext()

export function AuthProvider({ children }) {
    const url = "https://fullstack-backends.vercel.app"
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [userInfo, setUserInfo] = useState(null)
    const [error, setError] = useState('')

    console.log(userInfo?.image_url)

    const fetchUserInfo = useCallback(async (uidToFetch) => {
        const targetUid = uidToFetch || auth.currentUser?.uid
        if (!targetUid) return null
        try {
            const response = await axios.get(`${url}/profile/${targetUid}`)
            setUserInfo(response.data)
            setError('')
            return response.data
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Failed to fetch data")
            return null
        }
    }, [url])

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (userNow) => {
            setUser(userNow)
            if (userNow?.uid) {
                setLoading(true)
                await fetchUserInfo(userNow.uid)
            } else {
                setUserInfo(null)
            }
            setLoading(false)
        })
        return unsubscribe
    }, [fetchUserInfo])

    async function handleImageUpload(file) {
        const currentUser = auth.currentUser
        if (!currentUser) {
            throw new Error("You must be signed in to upload an image.")
        }
        const fileRef = ref(storage, `users/${currentUser.uid}/${file.name}`)
        await uploadBytes(fileRef, file)
        return await getDownloadURL(fileRef)
    }

    const handleLogout = async () => {
        try {
            await signOut(auth)
            setUserInfo(null)
        } catch (err) {
            console.error(err, err.message)
        }
    }

    const refreshUserInfo = useCallback(() => {
        return fetchUserInfo(auth.currentUser?.uid)
    }, [fetchUserInfo])

    const value = {
        url,
        user,
        handleImageUpload,
        userInfo,
        refreshUserInfo,
        error,
        handleLogout
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}