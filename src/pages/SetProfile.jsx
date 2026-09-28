import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { Form, Button } from "react-bootstrap";
import { useState, useEffect } from "react";
import axios from "axios";

export default function SetProfile() {

    const { user, handleImageUpload, urls } = useContext(AuthContext)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [image_url, setImageUrl] = useState('')
    const [introduction, setIntroduction] = useState('')
    const [occupation, setOccupation] = useState('')
    const [uid, setUid] = useState(null)
    const [userData, setUserData] = useState(null)


    console.log(image_url)
    useEffect(() => {
        if (!user?.displayName && !user?.email) return
        setName(user.displayName)
        setEmail(user.email)
        setUid(user.uid)
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
            const response = await axios.post(`${urls}/profile`, data)
            setUserData(response.data)
        } catch (err) {
            setError(err, "Fail to update")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group>
                <Form.Label>Your Name: </Form.Label>
                <Form.Control
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </Form.Group>
            <Form.Group>
                <Form.Label>Email:</Form.Label>
                <Form.Control
                    type="text"
                    value={email}
                    disabled
                />
            </Form.Group>
            <Form.Group>
                <Form.Label>Image:</Form.Label>
                <Form.Control
                    type="file"
                    onChange={imageUpload}
                />
            </Form.Group>
            <Form.Group>
                <Form.Label>Introduction: </Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Tell us more about you"
                    value={introduction}
                    onChange={(e) => setIntroduction(e.target.value)}
                />
            </Form.Group><Form.Group>
                <Form.Label>Occupation: </Form.Label>
                <Form.Control
                    type="text"
                    value={occupation}
                    onChange={(e) => setOccupation(e.target.value)}
                />
            </Form.Group>
            <Button type="submit">Submit</Button>
        </Form>
    )
}