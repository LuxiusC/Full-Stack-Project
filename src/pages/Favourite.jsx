import { useEffect, useContext, useState } from "react"
import { AuthContext } from "../contexts/AuthContext"
import axios from "axios"
import {
    ButtonGroup, Card, Row, Col, Button, Modal, Form, Image,
    Navbar, Container, Offcanvas
} from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import icon from './images/icon.png'
import background from './images/background-2.jpg'

export default function Favourite() {
    const { userInfo, url, handleImageUpload, handleLogout } = useContext(AuthContext)
    const [favourites, setFavourites] = useState(null)
    const [show, setShow] = useState(false)
    const [categories, setCategories] = useState([])
    const [selectedCountries, setSelectedCountries] = useState([])
    const [title, setTitle] = useState('')
    const [price, setPrice] = useState(0.00)
    const [image_url, setImageUrl] = useState(null)
    const [recipe_id, setRecipe_id] = useState('')
    const [recipe_country, setRecipe_country] = useState('')
    const [searchValue, setSearchValue] = useState('')
    const [success, setSuccess] = useState('')
    const [uploadState, setUploadState] = useState(false)
    // State to handle mobile menu drawer
    const [showSidebar, setShowSidebar] = useState(false)

    const uid = userInfo?.firebase_uid
    const navigate = useNavigate()

    const handleClose = () => setShow(false)
    const handleCloseSidebar = () => setShowSidebar(false)
    const handleShowSidebar = () => setShowSidebar(true)

    const userLogout = async () => {
        try {
            await handleLogout()
            navigate('/login')
        } catch (err) {
            console.error(err, err.message)
        }
    }

    const handleShow = (recipeId, recipeCountry) => {
        setRecipe_id(recipeId)
        setRecipe_country(recipeCountry)
        setShow(true)
    }

    const mealDetail = (id) => {
        navigate(`/mealDetails/${id}`)
    }

    const handleCheckBox = (country) => {
        setSelectedCountries((prev) =>
            prev.includes(country)
                ? prev.filter((c) => c !== country)
                : [...prev, country]
        )
    }

    const activeCategories = () => {
        return favourites?.filter((favourite) => {
            const matchedSearch = (favourite.recipe_name || favourite.title || '')
                .toLowerCase()
                .includes(searchValue.toLowerCase())
            const matchedCountry = selectedCountries.length === 0 || selectedCountries.includes(favourite.recipe_country)

            return matchedSearch && matchedCountry
        })
    }

    const submitImageUrl = async (e) => {
        const file = e.target.files[0]
        if (!file) return
        try {
            setUploadState(true)
            const uploadUrl = await handleImageUpload(file)
            setImageUrl(uploadUrl)
        } catch (err) {
            console.error(err, err.message)
        } finally {
            setUploadState(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const data = {
            recipe_id: recipe_id,
            title: title,
            price: price ? parseFloat(price) : 0.00,
            image_url: image_url,
            recipe_country: recipe_country
        }
        try {
            const res = await axios.post(`${url}/userRecipe/post/${uid}`, data)
            console.log(res)
            setSuccess(true)
        } catch (err) {
            console.error(err, err.message)
        } finally {
            setSuccess(false)
        }
        handleClose()
    }

    useEffect(() => {
        const categoryMap = () => {
            if (!favourites) return
            const items = favourites.map(favourite => favourite.recipe_country).filter(Boolean)
            const uniqueItems = [...new Set(items)]
            setCategories(uniqueItems)
        }
        categoryMap()
    }, [favourites])

    useEffect(() => {
        const handleFavourite = async () => {
            try {
                const res = await axios.get(`${url}/recipes/${uid}`)
                setFavourites(res.data)
            } catch (err) {
                console.error(err, err.message)
            }
        }
        handleFavourite()
    }, [url, uid])

    // Reusable Sidebar View
    const SidebarContent = () => (
        <div className="d-flex flex-column h-100 py-3 px-3">
            <div className="text-center mb-3">
                <Image src={icon} alt="App Icon" style={{ maxHeight: "60px", maxWidth: "100%" }} />
            </div>

            {userInfo && (
                <div className="text-center mb-3">
                    <p className="fw-semibold mb-2">Welcome, {userInfo.name}</p>
                    <ButtonGroup className="p-1 bg-light rounded-pill border w-100">
                        <Button onClick={() => navigate("/marketplace")} style={{ color: "#000000", border: "0px" }} className="rounded-pill bg-light btn-sm w-50">
                            Marketplace
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
                    {categories?.map((category, index) => (
                        <Form.Check
                            key={index}
                            type="checkbox"
                            id={`category-${index}`}
                            label={category}
                            value={category}
                            checked={selectedCountries?.includes(category)}
                            onChange={(e) => handleCheckBox(e.target.value)}
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

            {/* MOBILE TOP NAVBAR (Only visible on screens smaller than tablet/desktop) */}
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

            {/* MOBILE SLIDE-OUT DRAWER (Only opens when clicking 'Filter Menu' on mobile) */}
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
                    {/* DESKTOP SIDEBAR (Explicitly hidden on small screens with `d-none d-md-block`) */}
                    <Col md={3} lg={2} className="d-none d-md-block vh-100 position-sticky top-0 bg-white shadow-sm border-end">
                        <SidebarContent />
                    </Col>

                    {/* MAIN CONTENT AREA */}
                    <Col xs={12} md={9} lg={10} className="p-3 p-md-4">
                        {/* SEARCH HEADER */}
                        <Row className="mb-4 align-items-center justify-content-center">
                            <Col xs={12} sm={8} md={6} lg={5} className="d-flex align-items-center gap-2">
                                <Form.Control
                                    type="search"
                                    placeholder="Search recipes..."
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
                                        width: "40px",
                                        height: "40px",
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

                        {/* CARD GRID */}
                        <Row className="g-3 g-md-4">
                            {activeCategories()?.map((favourite) => (
                                <Col key={favourite.recipe_id || favourite.id} xs={12} sm={6} md={6} lg={4} xl={3}>
                                    <Card className="h-100 border-0 rounded-4 shadow-sm overflow-hidden" style={{ backgroundColor: "#ffffff" }}>
                                        <div style={{ position: "relative", height: "180px" }}>
                                            <Card.Img
                                                src={favourite.image_url}
                                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                            />
                                            <span
                                                className="badge rounded-pill bg-light text-dark shadow-sm position-absolute"
                                                style={{ top: "12px", right: "12px", fontSize: "12px", opacity: 0.9 }}
                                            >
                                                📍 {favourite.recipe_country}
                                            </span>
                                        </div>

                                        <Card.Body className="d-flex flex-column justify-content-between p-3 text-center">
                                            <div>
                                                <Card.Title className="fw-bold fs-6 mb-2 text-dark" style={{ minHeight: "40px" }}>
                                                    {favourite.recipe_name || favourite.title}
                                                </Card.Title>

                                                {favourite.youtube_url && (
                                                    <a
                                                        href={favourite.youtube_url}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="btn btn-sm btn-outline-danger rounded-pill px-3 py-1 mb-3 d-inline-block"
                                                        style={{ fontSize: "12px" }}
                                                    >
                                                        ▶ Watch Video Guide
                                                    </a>
                                                )}
                                            </div>

                                            <div className="d-flex flex-column gap-2 mt-2">
                                                <Button
                                                    onClick={() => mealDetail(favourite.recipe_id)}
                                                    style={{ backgroundColor: "#2e7d32", border: "none" }}
                                                    className="rounded-3 fw-medium py-2 btn-sm text-white"
                                                >
                                                    View Recipe & Ingredients
                                                </Button>

                                                <Button
                                                    variant="outline-secondary"
                                                    onClick={() => handleShow(favourite.recipe_id, favourite.recipe_country)}
                                                    className="rounded-3 py-2 btn-sm fw-medium"
                                                    style={{ borderColor: "#b29a78", color: "#6c5a3d" }}
                                                >
                                                    Post Creation
                                                </Button>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </Col>
                </Row>
            </Container>

            {/* MODAL */}
            <Modal show={show} onHide={handleClose} centered size="md">
                <Modal.Header closeButton>
                    <Modal.Title style={{ fontFamily: "cursive" }} className="w-100 text-center">
                        Post Detail
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-3 p-md-4">
                    <Form className="d-flex flex-column gap-3" onSubmit={handleSubmit} style={{ fontFamily: "cursive" }}>
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
                                onChange={(e) => submitImageUrl(e)}
                            />
                            {uploadState ? <p>Uploading...</p> : null}
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Country:</Form.Label>
                            <Form.Control
                                type="text"
                                value={recipe_country}
                                disabled
                            />
                        </Form.Group>

                        <Button type="submit" variant="success" className="mt-2 py-2 fw-bold">
                            Submit
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    )
}