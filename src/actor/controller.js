import { ObjectId } from "mongodb";
import client from "../common/db.js";

const actorCollection = client.db("cine-db").collection("actores");
const peliculaCollection = client.db("cine-db").collection("peliculas");

async function handleInsertActorRequest(req, res) {

    const nombrePelicula = req.body.nombrePelicula;

    await peliculaCollection.findOne({ nombre: nombrePelicula })
        .then(async (pelicula) => {

            if (!pelicula) {
                return res.status(404).json({
                    mensaje: "Película no encontrada"
                });
            }

            const actor = {
                idPelicula: pelicula._id.toString(),
                nombre: req.body.nombre,
                edad: req.body.edad,
                estaRetirado: req.body.estaRetirado,
                premios: req.body.premios
            };

            await actorCollection.insertOne(actor)
                .then((data) => {
                    return res.status(201).json({
                        mensaje: "Actor creado correctamente",
                        data: actor,
                        id: data.insertedId
                    });
                })
                .catch((error) => {
                    return res.status(500).json({
                        mensaje: "Error al crear el actor",
                        error: error.message
                    });
                });
        })
        .catch((error) => {
            return res.status(500).json({
                mensaje: "Error al validar la película",
                error: error.message
            });
        });
}

async function handleGetActoresRequest(req, res) {

    await actorCollection.find({}).toArray()
        .then((data) => {
            return res.status(200).json(data);
        })
        .catch((error) => {
            return res.status(500).json({
                mensaje: "Error al obtener los actores",
                error: error.message
            });
        });
}

async function handleGetActorByIdRequest(req, res) {

    try {

        const id = new ObjectId(req.params.id);

        await actorCollection.findOne({ _id: id })
            .then((data) => {

                if (!data) {
                    return res.status(404).json({
                        mensaje: "Actor no encontrado"
                    });
                }

                return res.status(200).json(data);
            })
            .catch((error) => {
                return res.status(500).json({
                    mensaje: "Error al obtener el actor",
                    error: error.message
                });
            });

    } catch (error) {

        return res.status(400).json({
            mensaje: "Id mal formado"
        });
    }
}

async function handleGetActoresByPeliculaIdRequest(req, res) {

    try {

        const peliculaId = new ObjectId(req.params.pelicula);

        await peliculaCollection.findOne({ _id: peliculaId })
            .then(async (pelicula) => {

                if (!pelicula) {
                    return res.status(404).json({
                        mensaje: "Película no encontrada"
                    });
                }

                await actorCollection.find({
                    idPelicula: peliculaId.toString()
                }).toArray()
                    .then((data) => {
                        return res.status(200).json(data);
                    })
                    .catch((error) => {
                        return res.status(500).json({
                            mensaje: "Error al obtener los actores",
                            error: error.message
                        });
                    });
            })
            .catch((error) => {
                return res.status(500).json({
                    mensaje: "Error al consultar la película",
                    error: error.message
                });
            });

    } catch (error) {

        return res.status(400).json({
            mensaje: "Id mal formado"
        });
    }
}

export default {
    handleInsertActorRequest,
    handleGetActoresRequest,
    handleGetActorByIdRequest,
    handleGetActoresByPeliculaIdRequest
};