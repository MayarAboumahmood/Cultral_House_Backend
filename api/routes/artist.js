const express = require("express");
const artistController = require("../controllers/ArtistController")
const checkAuth = require('../middleware/checkAuth')
const router = express.Router()


router.post("/create",checkAuth.checkIfSuper,artistController.createArtist);
router.delete('/delete',checkAuth.checkIfSuper,artistController.deleteArtist);
module.exports = router