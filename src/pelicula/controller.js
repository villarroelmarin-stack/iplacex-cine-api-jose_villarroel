import { ObjectId } from "mongodb";
import client from "../common/db.js";

const peliculaCollection = client.db("cine-db").collection("peliculas");

async function handleInsertPeliculaRequest(req, res) {
    const body = req.body;

    const pelicula = {
        nombre: body.nombre,
        generos: body.generos,
        anioEstreno: body.anioEstreno
    };

    await peliculaCollection.insertOne(pelicula)
        .then((data) => {
            return res.status(201).json({
                mensaje: "Película creada correctamente",
                data: pelicula,
                id: data.insertedId
            });
        })
        .catch((error) => {
            return res.status(500).json({
                mensaje: "Error al crear la película",
                error: error.message
            });
        });
}

async function handleGetPeliculasRequest(req, res) {
    await peliculaCollection.find({}).toArray()
        .then((data) => {
            return res.status(200).json(data);
        })
        .catch((error) => {
            return res.status(500).json({
                mensaje: "Error al obtener las películas",
                error: error.message
            });
        });
}

async function handleGetPeliculaByIdRequest(req, res) {
    try {
        const id = new ObjectId(req.params.id);

        await peliculaCollection.findOne({ _id: id })
            .then((data) => {
                if (!data) {
                    return res.status(404).json({
                        mensaje: "Película no encontrada"
                    });
                }

                return res.status(200).json(data);
            })
            .catch((error) => {
                return res.status(500).json({
                    mensaje: "Error al obtener la película",
                    error: error.message
                });
            });

    } catch (error) {
        return res.status(400).json({
            mensaje: "Id mal formado"
        });
    }
}

async function handleUpdatePeliculaByIdRequest(req, res) {
    try {
        const id = new ObjectId(req.params.id);

        const pelicula = {
            nombre: req.body.nombre,
            generos: req.body.generos,
            anioEstreno: req.body.anioEstreno
        };

        await peliculaCollection.updateOne(
            { _id: id },
            { $set: pelicula }
        )
            .then((data) => {
                if (data.matchedCount === 0) {
                    return res.status(404).json({
                        mensaje: "Película no encontrada"
                    });
                }

                return res.status(200).json({
                    mensaje: "Película actualizada correctamente"
                });
            })
            .catch((error) => {
                return res.status(500).json({
                    mensaje: "Error al actualizar la película",
                    error: error.message
                });
            });

    } catch (error) {
        return res.status(400).json({
            mensaje: "Id mal formado"
        });
    }
}

async function handleDeletePeliculaByIdRequest(req, res) {
    try {
        const id = new ObjectId(req.params.id);

        await peliculaCollection.deleteOne({ _id: id })
            .then((data) => {
                if (data.deletedCount === 0) {
                    return res.status(404).json({
                        mensaje: "Película no encontrada"
                    });
                }

                return res.status(200).json({
                    mensaje: "Película eliminada correctamente"
                });
            })
            .catch((error) => {
                return res.status(500).json({
                    mensaje: "Error al eliminar la película",
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
    handleInsertPeliculaRequest,
    handleGetPeliculasRequest,
    handleGetPeliculaByIdRequest,
    handleUpdatePeliculaByIdRequest,
    handleDeletePeliculaByIdRequest
};