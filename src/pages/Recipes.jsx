import { useState, useEffect } from "react";
import { Col, Row, Image, Form, Card, Button } from "react-bootstrap";
import icon from './images/icon.png'
import { useNavigate } from "react-router-dom";

export default function Recipes() {
    const [activeCategories, setActiveCategories] = useState([])
    const [CategoryNames, setCategoryNames] = useState([])
    const [meals, setMeals] = useState([])
    const [mealDetail, setMealDetail] = useState([])
    const navigate = useNavigate()

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
        <Row>
            <Col xs={4} md={2} lg={2} className="d-flex flex-column vh-100 py-4 position-sticky top-0" style={{ backgroundColor: "#484b6a" }}>
                <Image src={icon} />
                <div className="px-4 py-4 px-lg-5">
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
            <Col xs={8} md={9} lg={10} >
                <Row className="row-gy-3">
                    {meals.map((meal, index) => {
                        const mealName = meal.strMeal
                        const mealPic = meal.strMealThumb
                        const country = meal.strCountry
                        const mealId = meal.idMeal
                        return (
                            <Col xs={6} md={4} lg={3} >
                                <Card key={index} className="h-100">
                                    <Card.Img src={mealPic} />
                                    <Card.Body>
                                        <Card.Title>{mealName}</Card.Title>
                                        <Card.Text>Country:{country}</Card.Text>
                                        <Button className="w-100" variant="primary" onClick={() => handleMealInstruction(mealId)}>Ingredients/ Instructions</Button>
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