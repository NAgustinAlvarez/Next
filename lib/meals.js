import sql from "better-sqlite3";
import slugify from "slugify";
import xss from "xss";
import fs from "node:fs";
const db = sql("meals.db");
export async function getMeals() {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  // throw new Error("Error loading data from Db");
  return db.prepare("SELECT * FROM meals").all();
}

export function getMeal(slug) {
  return db.prepare("SELECT * FROM meals WHERE slug = ?").get(slug);
}

export async function saveMeal(meal) {
  meal.slug = slugify(meal.title, { lower: true });
  meal.instructions = xss(meal.instructions);
  const extension = meal.image.name.split(".").pop();
  const fileName = `${meal.slug}.${extension}`;
  const stream = fs.createWriteStream(`public/images/${fileName}`); // genera un canal de escritura hacia esa ruta
  const bufferedImage = await meal.image.arrayBuffer(); // lo convierte en una estructura binaria ArrayBuffer
  stream.write(Buffer.from(bufferedImage), (error) => {
    if (error) {
      throw new Error("Saving image failed!");
    }
  }); // node necesita convertirlo a Buffer para manipularlo
  meal.image = `/images/${fileName}`;
  // reemplazamos el image por la dirección
  db.prepare(
    `INSERT INTO meals 
  (title, summary, instructions, creator, creator_email, image, slug)
  VALUES (
         @title,
         @summary,
         @instructions,
         @creator,
         @creator_email,
         @image,
         @slug
         )`
  ).run(meal);
}
