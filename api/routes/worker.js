const checkAuth = require("../middleware/checkAuth");
const workerController = require("../controllers/WorkerController");
const upload = require("../middleware/upload");
const express = require('express')

const router = express.Router()

router.get('/show-all', checkAuth.checkIfSuper, workerController.showAllWorkers)

router.post('/create', checkAuth.checkIfSuper, upload('workers').single('image'), checkAuth.checkWorker, workerController.createWorker)

router.delete('/delete', checkAuth.checkIfSuper, workerController.deleteWorker)
router.get('/show-worker-details/:worker_id', checkAuth.checkIfSuper, workerController.showWorkerDetails)



module.exports = router