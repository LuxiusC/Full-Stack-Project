import { useState, useEffect } from 'react'
import axios from 'axios'
import { AuthContext } from '../contexts/AuthContext'
import { useContext } from 'react'
import { Row, Col, Form, Card, Button, Modal } from 'react-bootstrap'
export default function Marketplace() {
    const [allPosts, setAllPosts] = useState([])
    const { userInfo, url, handleImageUpload } = useContext(AuthContext)
    const [category, setCategory] = useState([])
    const [activeCategories, setActiveCategories] = useState([])
    const [title, setTitle] = useState('')
    const [price, setPrice] = useState('')
    const [image_url, setImageUrl] = useState(null)
    const [show, setShow] = useState(false)
    const [postId, setPostId] = useState('')
    const [showDelete, setShowDelete] = useState(false)


    const handleShow = (post) => {
        setPostId(post.id)
        setTitle(post.title)
        setPrice(post.price)
        setImageUrl(post.image_url)
        setShow(true)
    }
    const handleClose = () => setShow(false)

    const handleShowDelete = (post) => {
        setPostId(post.id)
        setShowDelete(true)
    }
    const handleCloseDelete = () => setShowDelete(false)


    const uid = userInfo?.firebase_uid

    const handleImage = async (e) => {
        let files = e.target.files[0]
        const url = await handleImageUpload(files)
        setImageUrl(url)
    }

    const handleEdit = async (e) => {
        e?.preventDefault()
        const data = {
            title: title,
            price: price,
            image_url: image_url
        }
        try {
            const res = await axios.put(`${url}/userRecipe/update/${postId}`, data)
            console.log(res)

            setAllPosts((prevPosts) =>
                prevPosts.map((post) =>
                    post.id === postId ? { ...post, ...data } : post
                )
            )

            handleClose()
        } catch (err) {
            console.error(err, err.message)
        }
    }

    const handleDelete = async () => {
        try {
            const res = await axios.delete(`${url}/delete/${postId}`)
            setAllPosts((prevPosts) =>
                prevPosts.filter((post) => post.id !== postId)
            )
            handleCloseDelete()
        } catch (err) {
            console.error(err, err.message)
        }
    }

    const handleActive = (country) => {
        setActiveCategories((prev) =>
            prev.includes(country)
                ? prev.filter((c) => c !== country)
                : [...prev, country]
        )
    }

    const allActive = () => {
        if (activeCategories.length === 0) return allPosts

        return allPosts.filter((post) => activeCategories.includes(post.recipe_country))
    }

    useEffect(() => {
        const handleResult = async () => {
            try {
                const res = await axios.get(`${url}/userRecipe`)
                setAllPosts(res.data)
            } catch (err) {
                console.error(err, err.message)
            }
        }
        handleResult()
    }, [])

    useEffect(() => {
        const countries = []
        allPosts?.map((post) => {
            const country = post.recipe_country
            const allCountry = countries.push(country)
        })
        const noDups = [...new Set(countries)]
        setCategory(noDups)
    }, [allPosts])

    return (
        <>
            <Row>
                <Col className="vh-100 position-sticky top-0" sm={3} md={2} lg={2} style={{ backgroundColor: "black" }}>
                    {category?.map((cat) => (
                        <Form.Check
                            type="checkbox"
                            checked={activeCategories.includes(cat)}
                            value={cat}
                            label={cat}
                            onChange={(e) => handleActive(e.target.value)}
                        />
                    ))}
                </Col>
                <Col sm={9} md={10} lg={10}>
                    {allActive().map((active) => (
                        <Col sm={3} md={4} lg={3} className="me-3 d-flex" style={{ maxHeight: '500px', objectFit: "cover" }}>
                            <Card>
                                <Card.Img variant="top" src={`${active.image_url}`} />
                                <Card.Body>
                                    <Card.Title>{active.recipe_name}</Card.Title>
                                    <Card.Subtitle>Title: {active.title}</Card.Subtitle>
                                    <Card.Subtitle>Price: {active.price}</Card.Subtitle>
                                    {active.firebase_uid === uid &&
                                        <div className="d-flex flex-row flex-wrap gap-2" style={{}}>
                                            <Button onClick={() => handleShow(active)}><i class="bi bi-pencil-square me-2"></i>Edit</Button>
                                            <Button onClick={() => handleShowDelete(active)}><i class="bi bi-trash3"></i>Delete</Button>
                                        </div>
                                    }
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Col>
            </Row>

            <Modal show={showDelete} onHide={handleCloseDelete}>
                <Modal.Header>Are you sure you want to delete this post? </Modal.Header>
                <Modal.Footer>
                    <Button onClick={() => handleDelete()}>Yes</Button>
                    <Button>No</Button>
                </Modal.Footer>
            </Modal>

            <Modal show={show} onHide={handleClose}>
                <Form onSubmit={handleEdit}>
                    <Form.Group>
                        <Form.Label>Title:</Form.Label>
                        <Form.Control
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Price:</Form.Label>
                        <Form.Control
                            type="number"
                            min="0"
                            step="0.01"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Image:</Form.Label>
                        <Form.Control
                            type="file"
                            onChange={(e) => handleImage(e)}
                        />
                    </Form.Group>
                    <Button type="submit" >Submit</Button>
                </Form>
            </Modal>
        </>
    )
}
