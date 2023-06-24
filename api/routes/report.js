const express = require('express');





const router = express.Router();

const reportController = require('../controllers/ReportController.js');



router.post('/make-report', reportController.makeReport);
router.get('/show-reports', reportController.showReports);
router.get('/:report_id/view-report', reportController.viewReport);
router.put('/:report_id/update-report', reportController.updateReport);
router.delete('/:report_id/delete-report', reportController.deleteReport);
router.get('/show-all-reports', reportController.showAllReports);


module.exports = router;