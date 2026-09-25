import { useEffect, useContext, useState } from "react"
import { AuthContext } from "../contexts/AuthContext"
import axios from "axios"
import { Card, Row, Col, Button, Modal, Form } from "react-bootstrap"
import { useNavigate } from "react-router-dom"

export default function Favourite() {
    const { userInfo, url, handleImageUpload } = useContext(AuthContext)
    const [favourites, setFavourites] = useState(null)
    const [show, setShow] = useState(false)
    const [categories, setCategories] = useState([])
    const [selectedCountries, setSelectedCountries] = useState([])
    const [title, setTitle] = useState('')
    const [price, setPrice] = useState(0.00)
    const [image_url, setImageUrl] = useState(null)
    const [recipe_id, setRecipe_id] = useState('')
    const [success, setSuccess] = useState('')

    console.log(categories)
    console.log(selectedCountries)
    console.log(recipe_id)
    console.log(image_url)
    const uid = userInfo?.firebase_uid
    const navigate = useNavigate()

    const handleClose = () => setShow(false)

    const handleShow = (recipeId) => {
        setRecipe_id(recipeId)
        setShow(true)
    }


    const mealDetail = (id) => {
        navigate(`/mealDetails/${id}`)
    }

    //bug here no return line 43-44
    const handleCheckBox = (country) => {
        setSelectedCountries((prev) =>
            prev.includes(country)
                ? prev.filter((c) => c !== country)
                : [...prev, country]
        )
    }

    const activeCategories = () => {
        if (selectedCountries.length === 0) return favourites

        return favourites.filter((favourite) =>
            selectedCountries.includes(favourite.recipe_country)
        )
    }

    const submitImageUrl = async (e) => {
        const file = e.target.files[0]
        if (!file) return

        const uploadUrl = await handleImageUpload(file)
        setImageUrl(uploadUrl)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const data = {
            recipe_id: recipe_id,
            title: title,
            price: price ? parseFloat(price) : 0.00,
            image_url: image_url
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
            const items = []
            {
                favourites?.map((favourite) => {
                    const category = favourite.recipe_country
                    items.push(category)

                })
                const uniqueItems = [...new Set(items)]
                setCategories(uniqueItems)
            }
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
    }, [])

    return (
        <div className="p-0">
            <Row style={{ display: "flex" }}>
                <Col sm={4} md={3} lg={3} className="vh-100 position-sticky top-0" style={{ backgroundColor: "white" }}>
                    {categories?.map((category) => {
                        return (
                            <Form.Check
                                key={category.id}
                                type="checkbox"
                                label={category}
                                value={category}
                                checked={selectedCountries?.includes(category)}
                                onChange={(e) => handleCheckBox(e.target.value)}
                            />
                        )
                    })}
                </Col>
                <Col sm={8} md={9} lg={9} className="d-flex flex-row p-3">
                    {activeCategories()?.map((favourite) => {
                        return (
                            <Col sm={3} md={4} lg={3} className="me-3 d-flex" style={{ maxHeight: '500px', objectFit: "cover" }}>
                                <Card>
                                    <Card.Img variant="top" src={`${favourite.image_url}`} />
                                    <Card.Body>
                                        <Card.Title>{favourite.recipe_name}</Card.Title>
                                        <Card.Subtitle>Country: {favourite.recipe_country}</Card.Subtitle>
                                        <Card.Link href={`${favourite.youtube_url}`}>Guide: {favourite.youtube_url}</Card.Link>
                                        <div className="d-flex flex-row flex-wrap gap-2" style={{}}>
                                            <Button onClick={() => mealDetail(favourite.recipe_id)}>Instruction / Ingredients</Button>
                                            <Button onClick={() => handleShow(favourite.recipe_id)}>Post your own creation here</Button>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        )
                    })}
                </Col>
            </Row>
            <Modal show={show} onHide={handleClose}>
                <Form onSubmit={handleSubmit}>
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
                    </Form.Group>
                    <Button type="submit">Submit</Button>
                </Form>
            </Modal>
        </div>
    )
}