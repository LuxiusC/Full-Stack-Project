import { useEffect, useContext, useState } from "react"
import { AuthContext } from "../contexts/AuthContext"
import axios from "axios"
import { Container, Card, Row, Col, Button } from "react-bootstrap"
import { useNavigate } from "react-router-dom"

export default function Favourite() {
    const { userInfo, url } = useContext(AuthContext)
    const [favourites, setFavourites] = useState(null)
    const uid = userInfo?.firebase_uid
    const navigate = useNavigate()

    console.log(userInfo)
    console.log(favourites)
    const mealDetail = (id) => {
        navigate(`/mealDetails/${id}`)
    }

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
        <Container>
            <Row>
                {favourites?.map((favourite) => {
                    return (
                        <Col sm={3} md={4} lg={3}>
                            <Card>
                                <Card.Img variant="top" src={`${favourite.image_url}`} />
                                <Card.Body>
                                    <Card.Title>{favourite.recipe_name}</Card.Title>
                                    <Card.Subtitle>Country: {favourite.recipe_country}</Card.Subtitle>
                                    <Card.Link href={`${favourite.youtube_url}`}>Guide: {favourite.youtube_url}</Card.Link>
                                    <Button onClick={() => mealDetail(favourite.recipe_id)}>Instruction/Ingredients</Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    )
                })}
            </Row>
        </Container>
    )
}