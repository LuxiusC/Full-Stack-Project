import { useState, useEffect } from "react";
import { Col, Row, Image, Form, Card, Button, Container } from "react-bootstrap";
import icon from './images/icon.png'
import background from './images/background-2.jpg'
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { useContext } from "react";
export default function Recipes() {
    const { userInfo } = useContext(AuthContext)
    const [activeCategories, setActiveCategories] = useState([])
    const [CategoryNames, setCategoryNames] = useState([])
    const [meals, setMeals] = useState([])
    const [mealDetail, setMealDetail] = useState([])
    const navigate = useNavigate()

    console.log(userInfo)


    const handleMealInstruction = (mealId) => {
        if (mealDetail > 0) {
            setMealDetail([])
        }
        navigate(`/mealDetails/${mealId}`)
    }

    console.log(meals)
    useEffect(() => {
        fetch('https://www.themealdb.com/api/json/v1/1/list.php?c=list')
            .then((res) => res.json())
            .then((data) => setCategoryNames(data.meals))
    }, [])


    useEffect(() => {
        if (activeCategories.length === 0) {
            setMeals([])
            return
        }

        const categoryChecked = activeCategories.map((category) => (
            fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
                .then((res) => res.json())
                // [] is for safeguards (u might add category that isnt in the database which might fail to fetch)
                .then((data) => data.meals || [])
        ))

        Promise.all(categoryChecked)
            .then((results) => {
                const combinedArray = results.flat()
                setMeals(combinedArray)
            })
            .catch((err) => console.error("error fetching meals", err))
    }, [activeCategories])

    return (
        <Row style={{ display: "flex", backgroundImage: `linear-gradient(rgba(244, 235, 217, 0.65), rgba(244, 235, 217, 0.6)),url(${background})` }}>
            <Col xs={4} md={2} lg={2} className="d-flex flex-column vh-100 py-4 position-sticky top-0"
                style={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    borderRight: "1px solid rgba(0, 0, 0, 0.08)"
                }}>
                <Image src={icon} />
                {userInfo ?
                    <div style={{ textAlign: "center" }}>
                        <p> Welcome , <a href="/setProfile">{userInfo?.name}</a></p>
                        <a href="/marketplace" className="me-2">Marketplace</a>
                        <span><a href="/favourites'">Favourites</a></span>
                        <hr />
                    </div>
                    : ""
                }
                <div className="px-5 py-1 px-lg-5">
                    {CategoryNames.map((category) => {
                        const catName = category.strCategory
                        return (
                            <Form.Check
                                type="checkbox"
                                value={catName}
                                label={catName}
                                className="mb-1"
                                // check if activeCategory is in the array so .includes(autoBoolean)
                                checked={activeCategories.includes(catName)}
                                onChange={(e) => {
                                    const { value, checked } = e.target
                                    setActiveCategories(
                                        checked ?
                                            [...activeCategories, value]
                                            : activeCategories.filter((category) => category !== value)
                                    )
                                }}
                            />
                        )
                    })}
                </div>
            </Col>
            <Col xs={8} md={9} lg={10} className="py-1"  >
                <Row className="row-gy-3 pe-2 g-4">
                    {meals.map((meal, index) => {
                        const mealName = meal.strMeal
                        const mealPic = meal.strMealThumb
                        const country = meal.strCountry
                        const mealId = meal.idMeal
                        return (
                            <Col xs={6} md={4} lg={3}  >
                                <Card key={index} style={{ padding: "1px", width: "100%", backgroundColor: "rgba(255, 255, 255, 0.85)", textAlign: "center" }} className="h-100">
                                    <Card.Img src={mealPic} width={100} height={200} />
                                    <Card.Body className="d-flex flex-column justify-content-between ">
                                        <Card.Title>{mealName}</Card.Title>
                                        <Card.Text>Country:{country}</Card.Text>
                                        <Button className="w-100" style={{ backgroundColor: "#B29A78", border: "0px" }} onClick={() => handleMealInstruction(mealId)}>Ingredients/ Instructions</Button>
                                    </Card.Body>
                                </Card>
                            </Col>
                        )
                    })}
                </Row>
            </Col>
        </Row >
    )
}