
const receiptService = require('../../service/order/receipt.service.js');

const downloadReceipt = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const pdfBuffer = await receiptService.generateReceiptPdf(orderId, req.user);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=boleta-${orderId}.pdf`
    );
    res.send(pdfBuffer);
  } catch (err) {
    next(err);
  }
};

module.exports = { downloadReceipt };
