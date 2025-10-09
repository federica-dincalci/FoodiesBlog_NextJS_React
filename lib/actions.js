"use server";  //creates an action that only runs on the server
import { redirect } from "next/navigation";
import { saveMeal } from "./meals";

export async function shareMeal(prevState, formData) {
    function isInvalidText(text) {
        return !text || text.trim() === '';
    }

    const meal = {
        title: formData.get('title'),
        summary: formData.get('summary'),
        instructions: formData.get('instructions'),
        image: formData.get('image'),
        creator: formData.get('name'),
        creator_email: formData.get('email')
    };

    if (
        isInvalidText(meal.title) || 
        isInvalidText(meal.summary) || 
        isInvalidText(meal.instructions) || 
        isInvalidText(meal.creator) || 
        isInvalidText(meal.creator_email) || 
        !meal.creator_email.includes('@') || 
        !meal.image || meal.image.sixe === 0
    ) {
        // throw new Error ('Invalid input');
        return {
            message: 'Invalid input.'
        };
    }

    await saveMeal(meal);
    redirect('/meals');
}