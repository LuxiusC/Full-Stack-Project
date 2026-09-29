import background from './images/background-2.jpg'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useContext } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function MealDetail() {
    const { id } = useParams()
    const [meal, setMeal] = useState([])
    const [ingredients, setIngredients] = useState([])
    const [success, setSuccess] = useState(false)
    const { url, userInfo } = useContext(AuthContext)
    const navigate = useNavigate()

    const uid = userInfo?.firebase_uid
    console.log(meal.strCountry)
    console.log(userInfo)
    console.log(uid)

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
        setMeal([])
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
                    const ingredients = mealData[`strIngredient${i}`]
                    const measure = mealData[`strMeasure${i}`]

                    if (ingredients && ingredients.trim() !== "")
                        items.push({
                            ingredient: ingredients,
                            measure: measure
                        })
                }
                setIngredients(items)
            })
            .catch((err) => console.error(err))
    }, [id])



    return (
        <div style={{ backgroundImage: `linear-gradient(rgba(244, 235, 217, 0.8), rgba(244, 235, 217, 0.6)),url(${background})`, minHeight: "100vh" }} className="d-flex justify-content-center align-items-center">
            <div style={{ fontFamily: "cursive", color: "#2C2C2C", borderRadius: "10px", textAlign: "start", backgroundColor: "rgba(255, 255, 255, 0.75)", width: "80%", padding: "10px" }}>
                <span onClick={() => navigate('/recipes')}><i class="bi bi-arrow-bar-left"></i></span>
                <p style={{ textAlign: "center" }}>Ingredients List:</p>
                <ul>
                    {ingredients.map((item, index) => {
                        return (
                            <li key={index}>{item.ingredient} : {item.measure}</li>
                        )
                    })}
                </ul>
                <p style={{ textAlign: 'center' }}>Instruction:</p>
                <p style={{ textAlign: 'center' }}>{meal.strInstructions}</p>
                <div className="d-flex justify-content-center">
                    <button style={{ backgroundColor: "transparent", border: "0px", marginTop: "5px", marginBottom: "5px" }} onClick={() => handleFavourite()}><i style={{ color: "red" }} class="bi bi-heart-fill"></i> Add To Favourite</button>
                </div>
                {success ? <p style={{ textAlign: "center" }}>Added To Favourite</p> : null}
            </div>
        </div>
    )
}