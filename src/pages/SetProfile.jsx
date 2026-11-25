import background from './images/background-2.jpg'
import { useContext, useState, useEffect } from "react"
import { AuthContext } from "../contexts/AuthContext"
import { Form, Button, Alert, Spinner } from "react-bootstrap"
import { useNavigate } from 'react-router-dom'
import axios from "axios"

export default function SetProfile() {
    const { user, handleImageUpload, url, userInfo, refreshUserInfo } = useContext(AuthContext)
    const [loading, setLoading] = useState(false)
    const [uploadingImage, setUploadingImage] = useState(false)
    const [error, setError] = useState('')
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [image_url, setImageUrl] = useState('')
    const [introduction, setIntroduction] = useState('')
    const [occupation, setOccupation] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        if (!user) return
        setName((prev) => prev || user.displayName || '')
        setEmail(user.email || '')
    }, [user])

    useEffect(() => {
        if (!userInfo) return
        if (userInfo.name) setName(userInfo.name)
        setImageUrl(userInfo.image_url || '')
        setIntroduction(userInfo.introduction || '')
        setOccupation(userInfo.occupation || '')
    }, [userInfo])

    const imageUpload = async (e) => {
        const file = e.target.files?.[0]
        if (!file) return

        setError('')
        setUploadingImage(true)
        try {
            const uploadedUrl = await handleImageUpload(file)
            if (!uploadedUrl) {
                throw new Error("Upload succeeded, but no image URL was returned.")
            }
            setImageUrl(uploadedUrl)
        } catch (err) {
            setError(err.message || "Failed to upload image.")
        } finally {
            setUploadingImage(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!user?.uid) {
            setError("You must be signed in to save your profile.")
            return
        }
        if (uploadingImage) {
            setError("Please wait for the image upload to finish before submitting.")
            return
        }

        const data = {
            firebase_uid: user.uid,
            name,
            email,
            image_url,
            introduction,
            occupation
        }

        try {
            setLoading(true)
            setError('')
            await axios.post(`${url}/profile`, data)
            await refreshUserInfo()
            navigate('/recipes')
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Failed to save profile.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div
            className="vh-100 d-flex align-items-center justify-content-center"
            style={{ backgroundImage: `linear-gradient(rgba(244, 235, 217, 0.85), rgba(244, 235, 217, 0.6)), url(${background})` }}
        >
            <Form
                style={{ borderRadius: "15px", fontFamily: "cursive", width: "400px", backgroundColor: "rgba(255, 255, 255, 0.75)", padding: "30px" }}
                onSubmit={handleSubmit}
            >
                <p style={{ textAlign: 'center', fontSize: "20px" }}>Profile</p>

                {error && <Alert variant="danger">{error}</Alert>}

                <Form.Group className="mb-3">
                    <Form.Label>Your Name:</Form.Label>
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
                        accept="image/*"
                        onChange={imageUpload}
                        disabled={uploadingImage || loading}
                    />
                    {uploadingImage && <Form.Text>Uploading image...</Form.Text>}
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Introduction:</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Tell us more about you"
                        value={introduction}
                        onChange={(e) => setIntroduction(e.target.value)}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Occupation:</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="What's your job?"
                        value={occupation}
                        onChange={(e) => setOccupation(e.target.value)}
                    />
                </Form.Group>

                <div className="d-flex justify-content-center">
                    <Button type="submit" disabled={loading || uploadingImage}>
                        {loading ? <Spinner animation="border" size="sm" /> : "Submit"}
                    </Button>
                </div>
            </Form>
        </div>
    )
}