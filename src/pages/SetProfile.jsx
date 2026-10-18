import background from './images/background-2.jpg'
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { Form, Button } from "react-bootstrap";
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";

export default function SetProfile() {

    const { user, handleImageUpload, url, userInfo } = useContext(AuthContext)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [image_url, setImageUrl] = useState('')
    const [introduction, setIntroduction] = useState('')
    const [occupation, setOccupation] = useState('')
    const [uid, setUid] = useState(null)
    const [userData, setUserData] = useState(null)
    const navigate = useNavigate()



    useEffect(() => {
        if (!user?.displayName && !user?.email) return
        setName(user.displayName)
        setEmail(user.email)
        setUid(user.uid)
        setIntroduction(userInfo?.introduction)
        setOccupation(userInfo?.occupation)
    }, [user])

    const imageUpload = async (e) => {
        const file = e.target.files[0]
        if (!file) return

        const url = await handleImageUpload(file)
        setImageUrl(url)

    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const data = {
            firebase_uid: uid,
            name: name,
            email: email,
            image_url: image_url,
            introduction: introduction,
            occupation: occupation
        }
        try {
            setLoading(true)
            const response = await axios.post(`${url}/profile`, data)
            setUserData(response.data)
            navigate('/recipes')

        } catch (err) {
            setError(err, err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="vh-100 d-flex align-items-center justify-content-center" style={{ backgroundImage: `linear-gradient(rgba(244, 235, 217, 0.85), rgba(244, 235, 217, 0.6)),url(${background})` }}>

            <Form style={{ borderRadius: "15px", fontFamily: "cursive", width: "400px", backgroundColor: "rgba(255, 255, 255, 0.75)", padding: "30px" }} onSubmit={handleSubmit}>
                <p style={{ textAlign: 'center', fontSize: "20px" }}>Profile</p>
                <Form.Group className="mb-3">
                    <Form.Label>Your Name: </Form.Label>
                    <Form.Control
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Email:</Form.Label>
                    <Form.Control
                        type="text"
                        value={email}
                        disabled
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Image:</Form.Label>
                    <Form.Control
                        type="file"
                        onChange={imageUpload}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Introduction: </Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Tell us more about you"
                        value={introduction}
                        onChange={(e) => setIntroduction(e.target.value)}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Occupation: </Form.Label>
                    <Form.Control
                        type="text"
                        placeholder='Whats your job ?'
                        value={occupation}
                        onChange={(e) => setOccupation(e.target.value)}
                    />
                </Form.Group>
                <div className="d-flex justify-content-center">
                    <Button type="submit">Submit</Button>
                </div>
            </Form>
        </div>
    )
}