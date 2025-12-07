import { showToast } from "../util/toast-util.js";
import { getOrders } from "../util/api/orderApi.js";
import { getShipping } from "../util/api/shippingApi.js";

let allOrders = [];
let userAddresses = [];
const API_BASE_URL = "http://localhost:3000";
let currentOrderId = null;
let currentUserId = null;
let pages = [];
let currentPage = 0;
const limit = 10;
const token = localStorage.getItem("qs_token");

$('document').ready(function () {
    const user = JSON.parse(localStorage.getItem('qs_user'));
    console.log(user)
    loadOrders();
})


async function loadOrders( ) {
    const response =  await getOrders( token )
    allOrders = response.data
    console.log(allOrders)
    buildPages();
    loadPages();
    populateTable(currentPage);
    
}


function buildPages () { 
    pages = [];
    const totalPages = Math.ceil(allOrders.length / limit);

    for (let i = 0; i < totalPages; i++) {
        const start = i * limit;
        const end = start + limit;
        pages.push(allOrders.slice(start, end));
    }

}


function loadPages() {
    let nav = $('#pagination');
    nav.empty(); 
    let ul = document.createElement('ul');
    ul.className = 'pagination';
    
    
    let previous = document.createElement('li');
    previous.className = 'page-item';
    previous.id = 'prev-page';
    previous.innerHTML = `<a class="page-link" href="#" id="prev"><span aria-hidden="true">&laquo;</span></a>`;
    ul.appendChild(previous);
    
    // Números de páginas
    for (let i = 0; i < pages.length; i++) {
        let li = document.createElement('li');
        li.className = 'page-item';
        
        li.innerHTML = `<a class="page-link" href="#" data-page="${i}">${i + 1}</a>`;
        ul.appendChild(li);
    }
    
    // Botón Siguiente
    let next = document.createElement('li');
    next.className = 'page-item';
    next.id = 'next-page';
    next.innerHTML = `<a class="page-link" href="#" id="next"><span aria-hidden="true">&raquo;</span></a>`;
    ul.appendChild(next);
    
    nav.append(ul);
    
    // Event listeners para números de página
    document.querySelectorAll('[data-page]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            populateTable(parseInt(btn.dataset.page));
        });
    });
}
async function populateTable( pageIndex ) {
    currentPage = pageIndex;
    const tableBody = $('#order-table-body');
    tableBody.empty();
    const pageOrders = pages[ pageIndex ] || [];
    if (pageOrders.length < 1) {
        const row = document.createElement('tr');
        row.innerHTML = `<td colspan ="6">No se encontraron ordenes</td>`
    }
    
    // Función para ajustar fecha a zona horaria de Chile (UTC-3) - solo para shipping
    const formatDateChile = (dateStr) => {
        if (!dateStr) return 'N/A';
        return new Date(dateStr).toLocaleDateString('es-ES');
    };
    
    // Para createdAt que ya viene correctamente
    const formatDateNormal = (dateStr) => {
        if (!dateStr) return 'N/A';
        return new Date(dateStr).toLocaleDateString('es-ES');
    };
    
    for (const o of pageOrders ) {
        const  response = await getShipping( o._id, token)
        const shipping = response.data[0];

        const dwldReceiptBtn = document.createElement('button')
        dwldReceiptBtn.textContent = 'Imprimir boleta'
        dwldReceiptBtn.className = 'btn btn-sm btn-secondary'
        dwldReceiptBtn.id = 'toggleReceipt'
        dwldReceiptBtn.setAttribute('data-orderId', o._id)
        
        
        let statusBadge = '';
        if (o.status === 'pending_payment') {
            statusBadge = '<span class="badge bg-warning text-dark">Pendiente</span>';
        } else if (o.status === 'paid') {
            statusBadge = '<span class="badge bg-info">Pagado</span>';
        } else if (o.status === 'shipped') {
            statusBadge = '<span class="badge bg-primary">Enviado</span>';
        } else if (o.status === 'delivered') {
            statusBadge = '<span class="badge bg-success">Entregado</span>';
        } else if (o.status === 'cancelled') {
            statusBadge = '<span class="badge bg-danger">Cancelado</span>';
        }

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${o.orderNumber}</td>
            <td>${formatDateNormal(o.createdAt)}</td>
            <td>${statusBadge}</td>
            <td>${o.total}</td>
            <td>${formatDateChile(shipping.shippedAt)}</td>
            <td>${formatDateChile(shipping.deliveredAt)}</td>`
        
        const td = document.createElement('td');
        
        
        td.appendChild(dwldReceiptBtn);
        td.appendChild(document.createTextNode(' '));
        
        
        row.appendChild(td);
        tableBody.append(row)
    }
}

$(document).on('click', '#toggleReceipt', function() {
    const orderId = this.getAttribute('data-orderId');
    const url = `${API_BASE_URL}/api/orders/${orderId}/boleta?token=${token}`;
    window.open(url, "_blank");
})