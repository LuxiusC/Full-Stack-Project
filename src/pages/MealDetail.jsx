import background from './images/background-2.jpg'
import { useParams } from 'react-router-dom'
import { useEffect, useState, useContext } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import 'bootstrap-icons/font/bootstrap-icons.css'

export default function MealDetail() {
    const { id } = useParams()
    const [meal, setMeal] = useState(null)
    const [ingredients, setIngredients] = useState([])
    const [success, setSuccess] = useState(false)
    const [isHovered, setIsHovered] = useState(false)
    const { url, userInfo } = useContext(AuthContext)
    const navigate = useNavigate()

    const uid = userInfo?.firebase_uid

    const handleFavourite = async () => {
        if (!meal) return
        const data = {
            recipe_id: meal.idMeal,
            recipe_name: meal.strMeal,
            recipe_country: meal.strCountry,
            youtube_url: meal.strYoutube,
            image_url: meal.strMealThumb
        }
        try {
            const res = await axios.post(`${url}/recipes/post/${uid}`, data)
            setSuccess(true)
            console.log(res)
        } catch (err) {
            console.error(err, err.message)
        }
    }

    useEffect(() => {
        setMeal(null)
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
            .then((res) => res.json())
            .then((data) => {
                if (!data.meals || data.meals.length === 0) {
                    return
                }
                const mealData = data.meals[0]
                setMeal(mealData)

                const items = []
                for (let i = 1; i <= 20; i++) {
                    const ingredient = mealData[`strIngredient${i}`]
                    const measure = mealData[`strMeasure${i}`]

                    if (ingredient && ingredient.trim() !== "") {
                        items.push({
                            ingredient: ingredient,
                            measure: measure
                        })
                    }
                }
                setIngredients(items)
            })
            .catch((err) => console.error(err))
    }, [id])

    const serifFont = "Garamond, 'Hoefler Text', 'Times New Roman', serif"

    if (!meal) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
                <p>Loading recipe...</p>
            </div>
        )
    }

    return (
        <div
            style={{
                backgroundImage: `linear-gradient(rgba(244, 235, 217, 0.8), rgba(244, 235, 217, 0.6)), url(${background})`,
                minHeight: "100vh",
                padding: "20px 0"
            }}
            className="d-flex justify-content-center align-items-center"
        >
            <div
                style={{
                    fontFamily: serifFont,
                    color: "#2C2C2C",
                    borderRadius: "15px",
                    textAlign: "start",
                    backgroundColor: "rgba(255, 255, 255, 0.85)",
                    width: "85%",
                    maxWidth: "1000px",
                    padding: "30px",
                    boxShadow: "0px 8px 20px rgba(0,0,0,0.2)",
                    position: "relative"
                }}
            >
                {/* Back Button */}
                <span
                    onClick={() => navigate('/recipes')}
                    style={{
                        cursor: "pointer",
                        fontSize: "2rem",
                        position: "absolute",
                        top: "20px",
                        left: "20px",
                        color: "#5C5C5C"
                    }}
                >
                    <i className="bi bi-arrow-bar-left"></i>
                </span>

                {/* Main Meal Title and Hero Image */}
                <h1
                    style={{
                        fontFamily: "'Playfair Display', serif",
                        textAlign: "center",
                        marginBottom: "25px",
                        color: "#4A4A4A"
                    }}
                >
                    {meal.strMeal} {meal.strCountry && `(${meal.strCountry})`}
                </h1>

                {meal.strMealThumb && (
                    <div className="text-center mb-4">
                        <img
                            src={meal.strMealThumb}
                            alt={meal.strMeal}
                            style={{
                                width: "60%",
                                maxHeight: "350px",
                                objectFit: "cover",
                                borderRadius: "10px",
                                boxShadow: "0px 4px 10px rgba(0,0,0,0.15)"
                            }}
                        />
                    </div>
                )}

                {/* Two-Column Recipe Layout */}
                <div className="row mt-4">
                    {/* Ingredients Column */}
                    <div className="col-md-5" style={{ paddingRight: "30px", borderRight: "1px solid #E0E0E0" }}>
                        <h3 style={{ borderBottom: "2px solid #D2B48C", paddingBottom: "10px", color: "#5D4037" }}>Ingredients List</h3>
                        <ul style={{ listStyleType: "none", paddingLeft: "10px" }}>
                            {ingredients.map((item, index) => (
                                <li key={index} style={{ marginBottom: "10px", fontSize: "1.1rem" }}>
                                    <i className="bi bi-tag-fill" style={{ color: "#D2B48C", marginRight: "10px" }}></i>
                                    {item.ingredient} : <strong>{item.measure}</strong>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Instructions Column */}
                    <div className="col-md-7" style={{ paddingLeft: "30px" }}>
                        <h3 style={{ borderBottom: "2px solid #D2B48C", paddingBottom: "10px", color: "#5D4037" }}>Instructions</h3>
                        <p style={{ lineHeight: "1.8", fontSize: "1.05rem", textAlign: "justify" }}>
                            {meal.strInstructions}
                        </p>
                    </div>
                </div>

                {/* Action Area: Favourite Button and Success Message */}
                <div className="d-flex flex-column align-items-center justify-content-center mt-5" style={{ borderTop: "1px solid #E0E0E0", paddingTop: "20px" }}>
                    <button
                        style={{
                            backgroundColor: isHovered ? "#D2B48C" : "transparent",
                            border: "2px solid #D2B48C",
                            color: isHovered ? "#FFFFFF" : "#5D4037",
                            borderRadius: "30px",
                            padding: "10px 25px",
                            fontSize: "1.1rem",
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            transition: "all 0.3s ease",
                            boxShadow: "0px 3px 6px rgba(0,0,0,0.1)",
                            cursor: "pointer"
                        }}
                        onClick={handleFavourite}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                    >
                        <i style={{ color: "red", fontSize: "1.3rem" }} className="bi bi-heart-fill"></i>
                        Add To Favourite
                    </button>
                    {success && <p className="mt-3 text-success" style={{ fontStyle: "italic" }}>Successfully added to your favourites!</p>}
                </div>
            </div>
        </div>
    )
}