import background from './images/background-2.jpg'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useContext } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import axios from 'axios'

export default function MealDetail() {
    const { id } = useParams()
    const [meal, setMeal] = useState([])
    const [ingredients, setIngredients] = useState([])
    const [success, setSuccess] = useState(false)
    const { url, userInfo } = useContext(AuthContext)

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
        <div>
            {ingredients.map((item, index) => {
                return (
                    <p key={index}>{item.ingredient}:{item.measure}</p>
                )
            })}
            <p>{meal.strInstructions}</p>
            <button onClick={() => handleFavourite()}>S</button>
            {success ? <p>nice</p> : null}
        </div>
    )
}