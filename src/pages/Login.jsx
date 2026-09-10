import { useState } from "react";
import background from "./images/background-2.jpg"
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { AuthContext } from "../contexts/AuthContext";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";
export default function Login() {
    const [email, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const { user } = useContext(AuthContext)
    const navigate = useNavigate()
    const auth = getAuth()

    const handleSignUp = async (e) => {
        e.preventDefault()
        try {
            const res = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            )
            console.log(res.user)
        } catch (error) {
            console.error(error)
        }
    }

    const handleLogin = async (e) => {
        e.preventDefault()
        try {
            const res = await signInWithEmailAndPassword(
                auth,
                email,
                password
            )
            console.log(res.user)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        if (user) navigate('/')
    }, [user, navigate])


    return (
        <Container>

        </Container>
    )
}