import { useState, useEffect } from 'react'
import axios from 'axios'
import { AuthContext } from '../contexts/AuthContext'
import { useContext } from 'react'
import { Row, Col, Form, Card, Button, Modal, Image } from 'react-bootstrap'
import icon from './images/icon.png'
import background from './images/background-2.jpg'
import { useNavigate } from 'react-router-dom'

export default function Marketplace() {
    const [allPosts, setAllPosts] = useState([])
    const { userInfo, url, handleImageUpload, handleLogout } = useContext(AuthContext)
    const [category, setCategory] = useState([])
    const [activeCategories, setActiveCategories] = useState([])
    const [title, setTitle] = useState('')
    const [price, setPrice] = useState('')
    const [image_url, setImageUrl] = useState(null)
    const [show, setShow] = useState(false)
    const [showDelete, setShowDelete] = useState(false)
    const [showBuy, setShowBuy] = useState(false)
    const [postId, setPostId] = useState('')
    const navigate = useNavigate()

    console.log(allPosts)
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

    const handleShowBuy = (post) => {
        setPostId(post.id)
        setShowBuy(true)
    }
    const handleCloseBuy = () => setShowBuy(false)


    const uid = userInfo?.firebase_uid

    const handleImage = async (e) => {
        let files = e.target.files[0]
        const url = await handleImageUpload(files)
        setImageUrl(url)
    }

    const userLogout = async () => {
        try {
            await handleLogout()
            navigate('/login')
        } catch (err) {
            console.error(err, err.message)
        }
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

    const handlePurchase = async () => {
        try {
            const res = await axios.post(`${url}/purchase/${postId}`, {})
            console.log(res)
            handleCloseBuy()

            setAllPosts((prev) => {
                return prev.filter((p) => p.id !== postId)
            })
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
            <Row style={{ display: "flex", backgroundImage: `linear-gradient(rgba(244, 235, 217, 0.65), rgba(244, 235, 217, 0.6)),url(${background})` }}>
                <Col xs={4} md={2} lg={2} className="d-flex flex-column vh-100 py-4 position-sticky top-0"
                    style={{
                        backgroundColor: "rgba(255, 255, 255, 0.95)",
                        borderRight: "1px solid rgba(0, 0, 0, 0.08)"
                    }}>
                    <Image src={icon} />
                    {userInfo ?
                        <div style={{ textAlign: "center" }}>
                            <p> Welcome , <a href="/userpage">{userInfo?.name}</a></p>
                            <a href="/recipes" className="me-2">Recipes</a>
                            <span><a href="/favourites">Favourites</a></span>
                            <hr />
                        </div>
                        : ""
                    }
                    <div className="px-5 py-2">
                        {category?.map((cat) => (
                            <Form.Check
                                type="checkbox"
                                checked={activeCategories.includes(cat)}
                                value={cat}
                                label={cat}
                                onChange={(e) => handleActive(e.target.value)}
                            />
                        ))}
                    </div>
                    <div className="mt-auto" style={{ display: "flex", justifyContent: "center" }}>
                        <Button variant="danger" onClick={() => userLogout()} style={{ width: "90%" }}>Logout</Button>
                    </div>
                </Col>
                <Col sm={8} md={9} lg={9} className="mt-2">
                    <Row className="row-gy-3 pe-2 g-4">
                        {allActive().map((active) => {
                            return active.purchase_state === false ?
                                <Col sm={6} md={4} lg={3} key={active.id} className="me-3" style={{ maxHeight: '500px', objectFit: "cover" }}>
                                    <Card className="d-flex flex-column gap-4" style={{ backgroundColor: "#F9F8F3", fontFamily: "cursive" }}>
                                        <Card.Img width={250} height={170} variant="top" src={`${active.image_url}`} />
                                        <Card.Body className="d-flex flex-column justify-content-between">
                                            <div className="d-flex flex-column gap-2" style={{ textAlign: "center" }}>
                                                <Card.Subtitle>Title: {active.title}</Card.Subtitle>
                                                <Card.Subtitle>Price: {active.price}</Card.Subtitle>
                                                <Card.Subtitle>Country: {active.recipe_country}</Card.Subtitle>
                                            </div>
                                            {active.firebase_uid === uid ?
                                                <div className="d-flex flex-row flex-wrap gap-2" style={{ justifyContent: "center", marginTop: "10px" }}>
                                                    <Button onClick={() => handleShow(active)}><i class="bi bi-pencil-square"></i></Button>
                                                    <Button variant="danger" onClick={() => handleShowDelete(active)}><i class="bi bi-trash3"></i></Button>
                                                </div>
                                                :
                                                <div style={{ display: "flex", justifyContent: 'center' }}>
                                                    {active.purchase_state === false ? <Button style={{ width: "90%", marginTop: "10px" }} onClick={() => handleShowBuy(active)}>Buy</Button> : <p>Sold</p>}
                                                </div>
                                            }
                                        </Card.Body>
                                    </Card>
                                </Col>
                                :
                                null
                        })}
                    </Row>
                </Col>

            </Row>

            <Modal centered show={showDelete} onHide={handleCloseDelete}>
                <Modal.Header>Are you sure you want to delete this post? </Modal.Header>
                <Modal.Footer>
                    <Button variant="success" onClick={() => handleDelete()}>Yes</Button>
                    <Button variant="danger">No</Button>
                </Modal.Footer>
            </Modal>

            <Modal centered show={showBuy} onHide={handleCloseBuy}>
                <Modal.Header>Are you sure you want to buy the food? </Modal.Header>
                <Modal.Footer>
                    <Button variant="success" onClick={() => handlePurchase()}>Yes</Button>
                    <Button variant="danger">No</Button>
                </Modal.Footer>
            </Modal>

            <Modal show={show} onHide={handleClose}>
                <Form className="d-flex flex-column gap-3" style={{ padding: "20px", fontFamily: "cursive" }} onSubmit={handleEdit}>
                    <p style={{ textAlign: 'center', fontSize: "25px" }}>Edit Post:</p>
                    <hr style={{ width: "95%", margin: "0 auto", marginBottom: "20px" }} />
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
