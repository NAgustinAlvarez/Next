"use client";
import { useRef, useState } from "react";
import Image from "next/image";
import classes from "./image-picker.module.css";
export default function ImagePicker({ label, name }) {
  const [pickedImage, setPickedImage] = useState();
  const imageInput = useRef();
  function handleButton() {
    imageInput.current.click();
  }
  function handleImageChange(event) {
    const file = event.target.files[0];
    if (!file) {
      setPickedImage(null);
      return;
    }
    const fileReader = new FileReader(); //lector de file

    fileReader.onload = () => {
      setPickedImage(fileReader.result);
    }; // da instrucciones antes de ejecutar; predefine el set
    fileReader.readAsDataURL(file); // lo lee en formato para la pagina
  }
  return (
    <div className={classes.picker}>
      <label htmlFor={name}>{label}</label>
      <div className={classes.controls}>
        <div className={classes.preview}>
          {!pickedImage ? (
            <p> No image picked yet</p>
          ) : (
            <Image
              src={pickedImage}
              alt="The image selected by the user"
              fill
            ></Image>
          )}
        </div>
        <input //boton predefinido
          className={classes.input} // oculta el boton predefinido
          type="file"
          id={name}
          accept="image/png, image/jpeg"
          name={name}
          ref={imageInput} // la referencia
          onChange={handleImageChange}
        ></input>
        <button className={classes.button} type="button" onClick={handleButton}>
          {" "}
          {/*onClick activa la referencia al boton predefinido*/}
          Pick an image
        </button>
      </div>
    </div>
  );
}
