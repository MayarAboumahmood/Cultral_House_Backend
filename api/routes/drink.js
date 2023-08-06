const express = require('express');

const checkIfEmpty = require('../middleware/drinkUpdate');
const upload = require('../middleware/upload')



const router = express.Router();

const drinkController = require('../controllers/DrinksController');

router.post('/add',upload("drinks").single("picture"), drinkController.addDrink);
router.get('/', drinkController.showDrinks);
router.get('/view', drinkController.viewDrink);
router.put('/update', checkIfEmpty, drinkController.updateDrink);
router.delete('/delete', drinkController.deleteDrink);



module.exports = router;