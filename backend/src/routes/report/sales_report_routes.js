const { Router } = require('express');
const { reportsGet, reportGet, reportPost, reportPut, reportDel, reportPdf, reportSummary } = require('../../controllers/report/salesReport.controller.js');
const router = Router();

router.get('/', reportsGet );             
router.get('/:id', reportGet );          
router.post('/', reportPost );             
router.put('/:id', reportPut );          
router.delete('/:id', reportDel );        


router.get('/:id/pdf', reportPdf );
router.get('/:id/summary', reportSummary );

module.exports = router;
