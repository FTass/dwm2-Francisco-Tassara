
// escuchar el submit

import { getShipping, updShipping } from "../util/api/shippingApi.js";
import { updOrder } from "../util/api/orderApi.js";
import { showToast } from "../util/toast-util.js";
import { loadOrders } from "./orderManagement.js";

const token = localStorage.getItem("qs_token");
let currentOrderId = null;

$(document).on('change', '#shipping-status', function () {

});

$(document).on('click', '#toggleEditShipping', async function() {
    
    currentOrderId = this.getAttribute('data-orderId');
    const shippingId = this.getAttribute('data-shippingId');
    
    // Guardar shippingId globalmente también
    window.currentShippingId = shippingId;
    
    try {
        const response = await getShipping(currentOrderId, token);
        const shipping = response.data[0];
        
        $('#shipping-status').val(shipping.status);
        $('#carrier').val(shipping.carrier);
        $('#trackingNumber').val(shipping.trackingNumber);
        $('#shippedAt').val(shipping.shippedAt ? shipping.shippedAt.split('T')[0] : '');
        $('#estimatedDelivery').val(shipping.estimatedDelivery ? shipping.estimatedDelivery.split('T')[0] : '');
        $('#deliveredAt').val(shipping.deliveredAt ? shipping.deliveredAt.split('T')[0] : '');
    } catch(error) {
        console.error('Error cargando shipping:', error);
        showToast('Error al cargar envío', 'danger');
    }
});



$(document).on('change', '#shipping-status', function() {
    const status = $(this).val();
    if ( status === 'pending' || status === 'cancelled') {
        const shippedAtDate = null
        const deliveredAtDate = null
        $('#shippedAt').val(shippedAtDate);
        $('#deliveredAt').val(deliveredAtDate);
    }
    if (status === 'shipped') {
        const shippedAtDate = new Date().toISOString().split('T')[0];
        $('#shippedAt').val(shippedAtDate);
    }
    if (status === 'delivered') {
        const deliveredAtDate = new Date().toISOString().split('T')[0];
        $('#deliveredAt').val(deliveredAtDate);
    }
});

$(document).on('click', '#shippingSubmit', async function() {
    const status = $('#shipping-status').val();
    const carrier = $('#carrier').val();
    const trackingNumber = $('#trackingNumber').val();
    const shippedAt = $('#shippedAt').val() || null;
    const estimatedDelivery = $('#estimatedDelivery').val() || null; 
    const deliveredAt = $('#deliveredAt').val() || null;
    let orderStatus 
    if ( status === 'pending') {
        orderStatus = 'pending_payment';
    }
    if (status === 'shipped') {
        orderStatus = 'shipped';
    }
    if (status === 'delivered') {
        orderStatus = 'delivered';
    }
    if ( status === 'cancelled') {
        orderStatus = 'cancelled';
    }




    const shippingPayload = {
        status,
        carrier,
        trackingNumber,
        shippedAt,
        estimatedDelivery,
        deliveredAt
    };
    
    console.log('currentOrderId:', currentOrderId);
    console.log('currentShippingId:', window.currentShippingId);
    console.log('Payload:', shippingPayload);
    
    try {
        await updShipping(currentOrderId, window.currentShippingId, token, shippingPayload);
        if(orderStatus) {
            const orderPayload = { status: orderStatus };
            await updOrder(currentOrderId, orderPayload, token);
        }
        showToast('Envío guardado exitosamente', 'success');
        bootstrap.Modal.getInstance(document.getElementById('editShippingModal')).hide();
        loadOrders();
    } catch(error) {
        console.error('Error guardando shipping:', error);
        showToast('Error al guardar envío', 'danger');
    }
});