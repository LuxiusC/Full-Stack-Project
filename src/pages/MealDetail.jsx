import background from './images/background-2.jpg'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'

export default function MealDetail() {
    const { id } = useParams()
    const [meal, setMeal] = useState([])
    const [ingredients, setIngredients] = useState([])

    console.log(meal)
    console.log(ingredients)
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


                const extractedItems = []
                for (let i = 1; i <= 20; i++) {
                    const ingredients = mealData[`strIngredient${i}`]
                    const measure = mealData[`strMeasure${i}`]

                    if (ingredients && ingredients.trim() !== "")
                        extractedItems.push({
                            ingredient: ingredients,
                            measure: measure
                        })
                }
                setIngredients(extractedItems)
            })
            .catch((err) => console.error(err))
    }, [])



    return (
        <p>hi</p>
    )
}