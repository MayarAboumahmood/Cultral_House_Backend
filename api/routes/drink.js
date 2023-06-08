const express = require('express');

const checkIfEmpty = require('../middleware/drinkUpdate');
const upload = require('../middleware/upload')



const router = express.Router();

const drinkController = require('../controllers/DrinksController');

router.post('/add',upload("drinks").single("picture"), drinkController.addDrink);
router.get('/', drinkController.showDrinks);
router.get('/:drink_id', drinkController.viewDrink);
router.put('/:drink_id/update', checkIfEmpty, drinkController.updateDrink);


module.exports = router;