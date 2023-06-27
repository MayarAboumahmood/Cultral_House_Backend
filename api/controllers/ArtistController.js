const bcrypt = require("bcrypt");
const db = require("../Models/index");
const jwt = require("jsonwebtoken");

const Artist = db.artists;

const createArtist = async (req, res) => {
    try {
        const {artist_name, description} = req.body
        const data = {artist_name, description}
        const artist = await Artist.create(data)
        res.status(200).json(artist)

    } catch (e) {
        res.status(400).json({
            req: req.body,
            msg: e.name
        })
        console.log(e);
    }
}

const deleteArtist = async (req, res) => {
    try {
        const artist = await Artist.findByPk(req.body.artist_id)
        if (!artist) {
            throw new Error("No Artist Found")
        }
        artist.destroy();
        res.status(202).json({
            msg: "Event has been deleted successfully",
            data: artist
        });

    } catch (e) {
        console.log(e)
        res.status(404).json({
            msg: "Error",
            data: e.message
        })
    }
}


module.exports = {
    createArtist,
    deleteArtist
}
