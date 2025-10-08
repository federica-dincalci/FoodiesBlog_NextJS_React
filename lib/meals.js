import sql from 'better-sqlite3';

const db = sql('meals.db');

export async function getMeals() {
    await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate a delay
    
    return db.prepare('SELECT * FROM meals').all();
}

export function getMeal(slug) {
    //to avoid sql injections you use ? and pass the value as a second argument with .get()
    return db.prepare('SELECT * FROM meals WHERE slug = ?').get(slug);
}