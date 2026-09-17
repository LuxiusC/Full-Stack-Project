import { useState, useEffect } from "react";
import { Col, Row, Image, Form } from "react-bootstrap";
import icon from './images/icon.png'
export default function MarketPlace() {
    const [activeCategories, setActiveCategories] = useState([])
    const [CategoryNames, setCategoryNames] = useState([])
    const [meals, setMeals] = useState([])

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
            <Col sm={3} className="d-flex flex-column vh-100" style={{ backgroundColor: "#484b6a" }}>
                <Image src={icon} />
                {CategoryNames.map((category) => {
                    const catName = category.strCategory
                    return (
                        <Form.Check
                            type="checkbox"
                            value={catName}
                            label={catName}
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
            </Col>
            <Col sm={9}>
                <div><p>LOLOL</p></div>
            </Col>
        </Row >
    )

}