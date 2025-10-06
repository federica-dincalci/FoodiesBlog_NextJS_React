import sql from 'better-sqlite3';

const db = sql('meals.db');

export async function getMeals() {
    await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate a delay
    
    throw new Error('Simulated fetch error'); // Simulate an error
    
    return db.prepare('SELECT * FROM meals').all();
}