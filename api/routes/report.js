const express = require('express');





const router = express.Router();

const reportController = require('../controllers/ReportController.js');



router.post('/make-report', reportController.makeReport);
router.get('/show-reports', reportController.showReports);
router.get('/view-report', reportController.viewReport);
router.put('/update-report', reportController.updateReport);
router.delete('/delete-report', reportController.deleteReport);
router.get('/show-all-reports', reportController.showAllReports);


module.exports = router;