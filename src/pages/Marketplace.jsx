import { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { AuthContext } from '../contexts/AuthContext'
import {
    Row, Col, Form, Card, Button, Modal, Image, ButtonGroup,
    Navbar, Container, Offcanvas
} from 'react-bootstrap'
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
    const [searchValue, setSearchValue] = useState('')


    const [showSidebar, setShowSidebar] = useState(false)

    const navigate = useNavigate()

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

    const handleCloseSidebar = () => setShowSidebar(false)
    const handleShowSidebar = () => setShowSidebar(true)

    const uid = userInfo?.firebase_uid

    const handleImage = async (e) => {
        let files = e.target.files[0]
        if (!files) return
        const uploadedUrl = await handleImageUpload(files)
        setImageUrl(uploadedUrl)
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
            await axios.delete(`${url}/delete/${postId}`)
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

            setAllPosts((prev) => prev.filter((p) => p.id !== postId))
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
        return allPosts.filter((post) => {
            const matchesCategory = activeCategories.length === 0 || activeCategories.includes(post.recipe_country)
            const matchesSearch = post.title?.toLowerCase().includes(searchValue.toLowerCase()) ||
                post.recipe_country?.toLowerCase().includes(searchValue.toLowerCase())

            return matchesCategory && matchesSearch
        })
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
    }, [url])

    useEffect(() => {
        if (!allPosts) return
        const countries = allPosts.map((post) => post.recipe_country).filter(Boolean)
        const noDups = [...new Set(countries)]
        setCategory(noDups)
    }, [allPosts])


    const SidebarContent = () => (
        <div className="d-flex flex-column h-100 py-3 px-3">
            <div className="text-center mb-3">
                <Image src={icon} alt="Logo" style={{ maxHeight: "60px", maxWidth: "100%" }} />
            </div>

            {userInfo && (
                <div className="text-center mb-3">
                    <p className="fw-semibold mb-2">Welcome, {userInfo.name}</p>
                    <ButtonGroup className="p-1 bg-light rounded-pill border w-100">
                        <Button onClick={() => navigate("/favourites")} style={{ color: "#000000", border: "0px" }} className="rounded-pill bg-light btn-sm w-50">
                            Favourites
                        </Button>
                        <Button onClick={() => navigate("/recipes")} style={{ color: "#000000", border: "0px" }} className="rounded-pill bg-light btn-sm w-50">
                            Recipes
                        </Button>
                    </ButtonGroup>
                    <hr className="my-3" />
                </div>
            )}

            <div className="px-2 mb-4">
                <div style={{ fontSize: "18px", fontFamily: "cursive", fontWeight: 'bold' }} className="text-center mb-2">
                    Filter:
                </div>
                <div style={{ maxHeight: "250px", overflowY: "auto" }}>
                    {category?.map((cat, idx) => (
                        <Form.Check
                            key={idx}
                            type="switch"
                            id={`cat-${idx}`}
                            checked={activeCategories.includes(cat)}
                            value={cat}
                            label={cat}
                            onChange={(e) => handleActive(e.target.value)}
                            className="mb-2"
                        />
                    ))}
                </div>
            </div>

            <div className="mt-auto text-center pt-3 border-top">
                <Button variant="danger" onClick={() => userLogout()} className="w-100 rounded-3">
                    Logout
                </Button>
            </div>
        </div>
    )

    return (
        <div className="min-vh-100" style={{ backgroundImage: `linear-gradient(rgba(244, 235, 217, 0.65), rgba(244, 235, 217, 0.6)), url(${background})`, backgroundSize: "cover", backgroundAttachment: "fixed" }}>


            <Navbar expand="md" className="d-md-none bg-white shadow-sm sticky-top px-3">
                <Container fluid className="p-0">
                    <Button variant="outline-dark" onClick={handleShowSidebar} className="border-0 p-1">
                        ☰ Filter Menu
                    </Button>
                    <Navbar.Brand onClick={() => navigate("/")} className="m-0">
                        <Image src={icon} style={{ height: "35px" }} />
                    </Navbar.Brand>
                    <div
                        style={{
                            width: "36px",
                            height: "36px",
                            borderRadius: "50%",
                            overflow: "hidden",
                            cursor: "pointer"
                        }}
                        onClick={() => navigate("/userpage")}
                    >
                        <Image
                            src={userInfo?.image_url}
                            alt="User profile"
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                    </div>
                </Container>
            </Navbar>


            <Offcanvas show={showSidebar} onHide={handleCloseSidebar} placement="start" className="d-md-none">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Menu & Filters</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body className="p-0">
                    <SidebarContent />
                </Offcanvas.Body>
            </Offcanvas>

            <Container fluid className="p-0">
                <Row className="g-0">

                    <Col md={3} lg={2} className="d-none d-md-block vh-100 position-sticky top-0 bg-white shadow-sm border-end">
                        <SidebarContent />
                    </Col>


                    <Col xs={12} md={9} lg={10} className="p-3 p-md-4">


                        <Row className="mb-4 justify-content-center">
                            <Col xs={12} sm={8} md={6} lg={5} className="d-flex align-items-center gap-2">
                                <Form.Control
                                    type="search"
                                    placeholder="Search marketplace..."
                                    value={searchValue}
                                    onChange={(e) => setSearchValue(e.target.value)}
                                    style={{
                                        boxShadow: "none",
                                        border: "2px solid #2e7d32",
                                        borderRadius: "20px",
                                        padding: "6px 15px"
                                    }}
                                />
                                <div
                                    className="d-none d-md-block flex-shrink-0"
                                    style={{
                                        width: "38px",
                                        height: "38px",
                                        borderRadius: "50%",
                                        overflow: "hidden",
                                        cursor: "pointer"
                                    }}
                                    onClick={() => navigate("/userpage")}
                                >
                                    <Image
                                        src={userInfo?.image_url}
                                        alt="User profile"
                                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                    />
                                </div>
                            </Col>
                        </Row>


                        <Row className="g-3 g-md-4">
                            {allActive().map((active) => (
                                active.purchase_state === false && (
                                    <Col key={active.id} xs={12} sm={6} md={6} lg={4} xl={3}>
                                        <Card className="h-100 border-0 rounded-4 shadow-sm overflow-hidden" style={{ backgroundColor: "#F9F8F3", fontFamily: "Comic Sans MS" }}>
                                            <div style={{ position: "relative", height: "180px" }}>
                                                <Card.Img
                                                    src={active.image_url}
                                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                                />
                                                <span
                                                    className="badge rounded-pill bg-light text-dark shadow-sm position-absolute"
                                                    style={{ top: "12px", right: "12px", fontSize: "12px", opacity: 0.9 }}
                                                >
                                                    📍 {active.recipe_country}
                                                </span>
                                            </div>

                                            <Card.Body className="d-flex flex-column justify-content-between p-3 text-center">
                                                <div>
                                                    <Card.Title className="fw-bold fs-6 mb-1 text-dark">
                                                        {active.title}
                                                    </Card.Title>
                                                    <Card.Subtitle className="text-muted fw-bold mb-3">
                                                        ${active.price}
                                                    </Card.Subtitle>
                                                </div>

                                                {active.firebase_uid === uid ? (
                                                    <div className="d-flex justify-content-center gap-2 mt-2">
                                                        <Button
                                                            variant="outline-success"
                                                            size="sm"
                                                            onClick={() => handleShow(active)}
                                                            className="rounded-3 px-3"
                                                        >
                                                            <i className="bi bi-pencil-square"></i> Edit
                                                        </Button>
                                                        <Button
                                                            variant="outline-danger"
                                                            size="sm"
                                                            onClick={() => handleShowDelete(active)}
                                                            className="rounded-3 px-3"
                                                        >
                                                            <i className="bi bi-trash3"></i> Delete
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <div className="d-flex justify-content-center mt-2">
                                                        <Button
                                                            className="rounded-pill px-4 btn-sm fw-bold text-white"
                                                            style={{ backgroundColor: "#2b6d5e", borderColor: "#2b6d5e" }}
                                                            onClick={() => handleShowBuy(active)}
                                                        >
                                                            Purchase
                                                        </Button>
                                                    </div>
                                                )}
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                )
                            ))}
                        </Row>
                    </Col>
                </Row>
            </Container>


            <Modal centered show={showDelete} onHide={handleCloseDelete}>
                <Modal.Header closeButton>
                    <Modal.Title className="fs-6">Confirm Deletion</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center py-4">
                    Are you sure you want to delete this post?
                </Modal.Body>
                <Modal.Footer className="justify-content-center">
                    <Button variant="success" onClick={handleDelete} className="px-4">Yes</Button>
                    <Button variant="danger" onClick={handleCloseDelete} className="px-4">No</Button>
                </Modal.Footer>
            </Modal>


            <Modal centered show={showBuy} onHide={handleCloseBuy}>
                <Modal.Header closeButton>
                    <Modal.Title className="fs-6">Confirm Purchase</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center py-4">
                    Are you sure you want to buy this item?
                </Modal.Body>
                <Modal.Footer className="justify-content-center">
                    <Button variant="success" onClick={handlePurchase} className="px-4">Yes</Button>
                    <Button variant="danger" onClick={handleCloseBuy} className="px-4">No</Button>
                </Modal.Footer>
            </Modal>


            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title style={{ fontFamily: "cursive" }} className="w-100 text-center">
                        Edit Post
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-3 p-md-4">
                    <Form className="d-flex flex-column gap-3" style={{ fontFamily: "cursive" }} onSubmit={handleEdit}>
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
                                onChange={handleImage}
                            />
                        </Form.Group>
                        <Button type="submit" variant="success" className="mt-2 py-2 fw-bold">
                            Save Changes
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    )
}