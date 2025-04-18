"use server";
import { redirect } from "next/navigation";
import { saveMeal } from "./meals";
import { revalidatePath } from "next/cache";
function isInvalidText(text) {
  return !text || text.trim() === "";
}
//no nos interesa en este caso el estado previo, pero necesitamos el segundo parametro
export async function shareMeal(prevState, formData) {
  const meal = {
    title: formData.get("title"),
    summary: formData.get("summary"),
    instructions: formData.get("instructions"),
    image: formData.get("image"),
    creator: formData.get("name"),
    creator_email: formData.get("email"),
  };
  // va a analizar si se tienen los inputs necesarios, ya que la parte de front puede saltarse facilmente sino es así redirige al error page de la carpeta
  if (
    isInvalidText(meal.title) ||
    isInvalidText(meal.summary) ||
    isInvalidText(meal.instructions) ||
    isInvalidText(meal.creator) ||
    isInvalidText(meal.creator_email) ||
    !meal.creator_email.includes("@") ||
    !meal.image ||
    meal.image.size === 0
  ) {
    return { message: "Invalid input." };
  }
  await saveMeal(meal);
  //para que en producción se llame de nuevo al fetch y se cachee la información cada que guardemos vamos a llamar al revalidador, como segundo argumento podemos pasar "page" si solo queremos que se revalide la pagina o layout si queremos que se revalide el layout.
  //si se tienen que revalidar todo "/", "layout"
  revalidatePath("/images");
  revalidatePath("/meals");
  redirect("/meals");
}
//el contenido viene de sharemeal form.
