// service/order/receipt.service.js
const orderRepo = require('../../../database/repo/order/order_repo');
const orderItemRepo = require('../../../database/repo/order/orderItem_repo');


const { renderReceiptHtml } = require('./receipt.template');

const puppeteer = require('puppeteer');

async function generateReceiptPdf(orderId, currentUser) {
  const order = await orderRepo.findById(orderId);

  if (!order) {
    const e = new Error('Order not found');
    e.status = 404;
    throw e;
  }

  const items = await orderItemRepo.findByOrder(orderId);

  const viewModel = {
    orderNumber: order.orderNumber,
    date: order.createdAt.toLocaleDateString('es-CL'),
    user: order.userId,
    subtotal: order.subTotal, 
    address: order.addressId,
    items: items.map(item => item.toObject()), 
    tax: order.tax,
    total: order.total,
};

  const html = renderReceiptHtml(viewModel);

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });

  const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
  await browser.close();

  return pdfBuffer;
}

module.exports = { generateReceiptPdf };
