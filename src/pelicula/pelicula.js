import { ObjectId } from "mongodb";

const Pelicula = {
    _id: new ObjectId(),
    nombre: "",
    generos: [],
    anioEstreno: 0
};

export default Pelicula;