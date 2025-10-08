import fs from 'node:fs';

import sql from 'better-sqlite3';
import slugify from 'slugify';
import xss from 'xss';

const db = sql('meals.db');

export async function getMeals() {
    await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate a delay
    
    return db.prepare('SELECT * FROM meals').all();
}

export function getMeal(slug) {
    //to avoid sql injections you use ? and pass the value as a second argument with .get()
    return db.prepare('SELECT * FROM meals WHERE slug = ?').get(slug);
}

export async function saveMeal(meal) {
    //sanitize and create slug
    meal.slug = slugify(meal.title, {lower: true,});
    meal.instructions = xss(meal.instructions);

    //taking care of saving the image on the file system
    const extension = meal.image.name.split('.').pop();
    const fileName = `${meal.slug}.${extension}`;

    const stream = fs.createWriteStream(`public/images/${fileName}`);
    const bufferedImage = await meal.image.arrayBuffer();

    stream.write(Buffer.from(bufferedImage), (error) =>  {
        if(error) {
            throw new Error("Saving image failed!");
        }
    });
    //now I can save the path to the image in the database
    meal.image = `/images/${fileName}`;

    const statement = db.prepare(`
        INSERT INTO meals 
            (title, summary, instructions, creator, creator_email, image, slug)
        VALUES (
            @title, 
            @summary, 
            @instructions, 
            @creator, 
            @creator_email, 
            @image, 
            @slug
        )
    `).run(meal);
};