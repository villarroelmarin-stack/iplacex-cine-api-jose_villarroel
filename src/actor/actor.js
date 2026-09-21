import { ObjectId } from "mongodb";

const Actor = {
    _id: new ObjectId(),
    idPelicula: "",
    nombre: "",
    edad: 0,
    estaRetirado: false,
    premios: []
};

export default Actor;