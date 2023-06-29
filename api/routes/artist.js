const express = require("express");
const artistController = require("../controllers/ArtistController")
const checkAuth = require('../middleware/checkAuth')
const router = express.Router()


router.post("/create",checkAuth.checkIfSuper,artistController.createArtist);
router.delete('/delete',checkAuth.checkIfSuper,artistController.deleteArtist);
router.get("/show-all",artistController.showAll)
router.get("/show",artistController.showArtist)

module.exports = router