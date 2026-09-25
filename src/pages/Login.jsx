import { useState, useEffect } from "react";
import background from "./images/background-2.jpg"
import icon from "./images/icon.png"
import { createUserWithEmailAndPassword, getAuth, updateProfile, signInWithEmailAndPassword } from "firebase/auth";
import { AuthContext } from "../contexts/AuthContext";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Form, Image, Button } from "react-bootstrap";

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [displayName, setDisplayName] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [success, setSuccess] = useState('')
    const [error, setError] = useState('')
    const [register, setRegister] = useState(false)
    const { user } = useContext(AuthContext)
    const navigate = useNavigate()
    const auth = getAuth()

    const loginOrRegister = () => {
        setRegister((prev) => !prev)
        setSuccess('')
    }

    const handleSignUp = async (e) => {
        e.preventDefault()

        if (password !== confirmPassword) {
            setError("Password does not match")
            return
        }

        try {
            setError('')
            const res = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            )

            await updateProfile(res.user, {
                displayName: displayName
            })

            setSuccess("Register succesfully.Please proceed to login.")
            console.log(res.user)
        } catch (error) {
            console.error(error)
            setError(error.message)
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

    //  useEffect(() => {
    //       if (user) navigate('/')
    //  }, [user, navigate])


    return (
        <Container fluid className="vh-100 px-0" style={{ display: "flex", backgroundImage: `linear-gradient(rgba(244, 235, 217, 0.5), rgba(244, 235, 217, 0.7)),url(${background})`, alignItems: "center", justifyContent: "center" }}>
            <div className="row g-3" style={{ display: "flex", backgroundColor: "rgba(160, 130, 109)", borderRadius: "15px", padding: "18px" }}>
                <div style={{ display: 'flex', height: "70px", justifyContent: "center" }}>
                    <Image src={icon} />
                </div>
                <Form onSubmit={register ? handleSignUp : handleLogin} style={{ display: "flex", flexDirection: "column", justifyContent: 'center' }}>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                        {register ? <p style={{ fontWeight: "500", fontSize: "20px", color: "white" }}>Register</p> : <p style={{ fontWeight: "500", fontSize: "20px", color: "white" }}>Login</p>}
                    </div>
                    {register ?
                        <Form.Group className="d-flex align-items-center mb-2">
                            <Form.Control
                                placeholder="Display Name:"
                                type="text"
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                style={{ width: "100%", height: "100%" }}
                                required
                            />
                        </Form.Group>
                        : null
                    }
                    <Form.Group className="d-flex align-items-center mb-2">
                        <Form.Control
                            placeholder="Email:"
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{ width: "100%", height: "100%" }}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="d-flex align-items-center mb-2">
                        <Form.Control
                            placeholder="Password:"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ width: "100%", height: "100%" }}
                            required
                        />
                    </Form.Group>
                    {register ?
                        <Form.Group className="d-flex align-items-center">
                            <Form.Control
                                placeholder="Confirm Password:"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                style={{ width: "100%", height: "100%" }}
                                required
                            />
                        </Form.Group>
                        : null
                    }
                    <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
                        {register ? <Button type="submit" style={{ padding: "8px", width: "100px", backgroundColor: "white", border: "transparent", color: "black", fontWeight: "500" }}>Register</Button> : <Button type="submit" style={{ padding: "8px", width: "100px", backgroundColor: "white", border: "transparent", color: "black", fontWeight: "500" }}>Login</Button>}

                    </div>
                    {success && <div style={{ marginTop: "10px", display: "flex", justifyContent: 'center', color: "#22C55E" }}><i class="bi bi-check me-1"></i> {success}</div>}
                    {error && <div style={{ marginTop: "10px", display: "flex", justifyContent: 'center', color: "#ed6c02" }}> <i className="bi bi-exclamation-triangle me-1"></i>{error}</div>}
                    <div style={{ display: 'flex', alignItems: 'center', margin: '15px 0' }}>
                        <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.3)' }} />
                        <span style={{ padding: '0 10px', color: '#FFFDF8', fontSize: '0.9rem' }}>or</span>
                        <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.3)' }} />
                    </div>
                    <div style={{ display: "flex", justifyContent: "center", alignItems: 'center' }}>
                        <Button type="button" style={{ padding: "8px", width: "100%", backgroundColor: "white", border: "transparent", color: "black", fontWeight: "500" }} onClick={loginOrRegister}>{register ? "Login" : "Create Your Account"}</Button>
                    </div>
                </Form>
            </div>
        </Container >
    )
}