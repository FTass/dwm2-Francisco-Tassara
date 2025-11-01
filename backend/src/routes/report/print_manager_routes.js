const { Router } = require('express');
const { printsGet, printGet, printPost, printPut, printDel, printGenerate, printStatus } = require('../../controllers/report/printManager.controller.js');
const router = Router();

router.get('/', printsGet );
router.get('/:id', printGet );
router.post('/', printPost );
router.put('/:id', printPut );
router.delete('/:id', printDel );

// Generar impresión
router.post('/:id/generate', printGenerate );
router.get('/:id/status', printStatus );

module.exports = router;
