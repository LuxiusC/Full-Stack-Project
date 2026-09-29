import { useEffect, useContext, useState } from "react"
import { AuthContext } from "../contexts/AuthContext"
import axios from "axios"
import { Card, Row, Col, Button, Modal, Form, Image } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import icon from './images/icon.png'
import background from './images/background-2.jpg'

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
    const [recipe_country, setRecipe_country] = useState('')
    const [success, setSuccess] = useState('')

    console.log(categories)
    console.log(selectedCountries)
    console.log(recipe_id)
    console.log(image_url)
    console.log(favourites)
    const uid = userInfo?.firebase_uid
    const navigate = useNavigate()

    const handleClose = () => setShow(false)




    const handleShow = (recipeId, recipeCountry) => {
        setRecipe_id(recipeId)
        setRecipe_country(recipeCountry)
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
        <div className="p-0" >
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
                            <span><a href="/marketplace">Marketplace</a></span>
                            <hr />
                        </div>
                        : ""
                    }
                    <div className="px-5 py-2">
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
                    </div>
                </Col>
                <Col sm={8} md={9} lg={9} className="py-2">
                    <Row className="row-gy-3 pe-2 g-4">
                        {activeCategories()?.map((favourite) => {
                            return (
                                <Col sm={6} md={4} lg={3} >
                                    <Card className="h-100" style={{ textAlign: "center" }}>
                                        <Card.Img width={100} height={200} src={`${favourite.image_url}`} />
                                        <Card.Body className="d-flex flex-column flex-grow-1 justify-content-between gap-3">
                                            <div className="d-flex  flex-column gap-2">
                                                <Card.Title>{favourite.recipe_name}</Card.Title>
                                                <Card.Subtitle>Country: {favourite.recipe_country}</Card.Subtitle>
                                                <Card.Link href={`${favourite.youtube_url}`}>Guide</Card.Link>
                                            </div>
                                            <div className="d-flex flex-column flex-wrap gap-2" style={{}}>
                                                <Button onClick={() => mealDetail(favourite.recipe_id)}>Instruction / Ingredients</Button>
                                                <Button onClick={() => handleShow(favourite.recipe_id, favourite.recipe_country)}>Post your own creation here</Button>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            )
                        })}
                    </Row>
                </Col>
            </Row>
            <Modal show={show} onHide={handleClose}>
                <Form className="d-flex flex-column gap-3" onSubmit={handleSubmit} style={{ fontFamily: "cursive", padding: "15px" }}>
                    <Form.Group>
                        <p style={{ textAlign: 'center', fontSize: "25px" }}>Post Detail</p>
                        <hr style={{ width: "95%", margin: "0 auto", marginBottom: "20px" }} />
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
                            step="1.00"
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
                    <Form.Group>
                        <Form.Label>Country:</Form.Label>
                        <Form.Control
                            type="text"
                            value={recipe_country}
                            disabled
                        />
                    </Form.Group>
                    <Button type="submit">Submit</Button>
                </Form>
            </Modal>
        </div>
    )
}