

import { showToast } from "../util/toast-util.js";

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
    if ( user?.profile?.name !== 'admin') {
        setTimeout(() =>{
            window.location.href = '/frontend/public/index.html'
        },200) 
    }
    loadOrders();

    
})


function buildPages () { 
    pages = [];
    const totalPages = Math.ceil(allOrders.length / limit);

    for (let i = 0; i < totalPages; i++) {
        const start = i * limit;
        const end = start + limit;

        pages.push(allOrders.slice(start, end));
    }

}

export function loadOrders( ) {
    $.ajax({
        url: "http://localhost:3000/api/orders",
        type: "GET",
        headers: {
        Authorization: `Bearer ${token}`,
        },
        success: function (response) {

        allOrders = response.data || response;
        
        buildPages();
        loadPages();
        populateTable( currentPage );
        },
        error: function (error) {
        console.error("Error:", error);
        alert("Error cargando categorias");
        },
    });
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
        // if (i === currentPage) li.classList.add('active');
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
    for (const o of pageOrders ) {
        const response = await getShipping( o._id, token)   
        const shipping = response.data[0];  
        const shippingId = shipping._id;

        
        
        const shippingBtn = document.createElement('button')
        shippingBtn.textContent = 'Envío'
        shippingBtn.className = 'btn btn-sm btn-info'
        shippingBtn.id = 'toggleEditShipping'
        shippingBtn.setAttribute('data-bs-toggle', 'modal');
        shippingBtn.setAttribute('data-bs-target',"#editShippingModal")
        shippingBtn.setAttribute('data-orderId', o._id)
        shippingBtn.setAttribute('data-shippingId', shippingId)
        
        const editBtn = document.createElement('button')
        editBtn.textContent = 'Editar'
        editBtn.className = 'btn btn-sm btn-primary'
        editBtn.id = 'toggleEdit'
        editBtn.setAttribute('data-bs-toggle', 'modal');
        editBtn.setAttribute('data-bs-target',"#editOrderModal")
        editBtn.setAttribute('data-orderId', o._id)
        
        const dwldReceiptBtn = document.createElement('button')
        dwldReceiptBtn.textContent = 'Imprimir boleta'
        dwldReceiptBtn.className = 'btn btn-sm btn-secondary'
        dwldReceiptBtn.id = 'toggleReceipt'
        dwldReceiptBtn.setAttribute('data-orderId', o._id)
        
        const row = document.createElement('tr');
        row.innerHTML = `<td>${o.userId._id}</td><td>${o.orderNumber}</td><td>${new Date(o.createdAt).toLocaleDateString('es-ES')}</td><td>${o.status}</td><td>${o.total}</td>`
        
        const td = document.createElement('td');
        td.appendChild(editBtn);
        td.appendChild(document.createTextNode(' '));
        td.appendChild(dwldReceiptBtn);
        td.appendChild(document.createTextNode(' '));
        td.appendChild(shippingBtn);
        
        row.appendChild(td);
        tableBody.append(row)
    }
}

$("#prev").click(() => {
    if (currentPage > 0) {
        populateTable(currentPage - 1);
    }
});

$("#next").click(() => {
    if (currentPage < pages.length - 1) {
        populateTable(currentPage + 1);
    }
});

$(document).on('click', '#toggleReceipt', function() {
    const orderId = this.getAttribute('data-orderId');
    const url = `${API_BASE_URL}/api/orders/${orderId}/boleta?token=${token}`;
    window.open(url, "_blank");
})


$(document).on('click', '#toggleEdit', function() {
  currentOrderId = this.getAttribute('data-orderId');
  const order = allOrders.find((o) => o._id === currentOrderId)
  console.log('order:', order);
  console.log('order.userId:', order.userId);
  currentUserId = order.userId._id;
  console.log('currentUserId asignado:', currentUserId);
  GetAddresses();
})


$(document).on("click", '#editOrderSubmit', function (e) {
    e.preventDefault();
    console.log('currentUserId:', currentUserId);
    const status = $('#status').val();
    const addressId = $('#address').val();
    
    // Validar que se seleccione una dirección
    if (!addressId) {
        showToast('Debes seleccionar una dirección', 'warning');
        return;
    }
    
    const admin = JSON.parse(localStorage.getItem('qs_user'));
    const adminId = admin._id;
    console.log('current admin id', adminId)
    
    let payload = {
        status,
        addressId,
        lastUpdatedBy : adminId
    }
  
    updOrder(  currentOrderId, payload )
  
});


function updOrder( currentOrderId, payload) {
     $.ajax({
        url: `http://localhost:3000/api/orders/${ currentOrderId}`,
        type: "PUT",
        contentType: "application/json",
        headers: {
        Authorization: `Bearer ${token}`,
        },
        data: JSON.stringify(payload),
        success: function (response) {
            showToast('Orden actualizada', 'success')
            bootstrap.Modal.getInstance(document.getElementById('editOrderModal')).hide();
            loadOrders();
        },
        error: function (error) {
            console.error('Error completo:', error);
            console.error('Response:', error.responseText);
            alert('Error: ' + error.statusText);
            showToast('Error al actualizar orden', 'danger')
        },
    });
}

function GetAddresses() {
    $.ajax({
        url: `http://localhost:3000/api/users/${currentUserId}/addresses`,
        type: "GET",
        headers: {
        Authorization: `Bearer ${token}`,
        },
        success: function (response) {
            userAddresses = response.data || [];
            let container = $('#address'); // Usar el ID correcto del select
            container.empty(); // Limpiar opciones anteriores
            container.append('<option value="" selected>Selecciona una dirección</option>');
            container.append('<option value="new"><b>+ Agregar nueva dirección</b></option>');
            userAddresses.forEach((a) => {
                const { street, number, apt, commune, city } = a;
                const opt = document.createElement("option");
                opt.value = a._id;
                opt.textContent = `${street}, ${number}, ${apt || ""}, ${commune}, ${city}`;
                container.append(opt);
            });
        },
        error: function (error) {
        console.error("Error:", error);
        console.log("Error cargando direcciones:", error);
        },
    });
}

// Mostrar modal de nueva dirección
$(document).on('change', '#address', function() {
    if ($(this).val() === 'new') {
        const newAddressModal = new bootstrap.Modal(document.getElementById('newAddressModal'));
        newAddressModal.show();
    }
});

$(document).on('submit', '#addressForm', function(e) {
    e.preventDefault(); 
    
    
    const calle = $('#calle').val();
    const numero = $('#numero').val();
    const depto = $('#depto').val();
    const comuna = $('#comuna').val();
    const ciudad = $('#ciudad').val();
    const isDefault = $("#useProfileAddressBtn").is(":checked");
    
    const payload = {
        street : calle,
        number : numero,
        apt: depto || '',
        commune : comuna,
        city : ciudad,
        isDefault
    }

    $.ajax({
      url: API_BASE_URL + `/api/users/${currentUserId}/addresses`,
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify(payload),
      headers: {
        Authorization: "Bearer " + localStorage.getItem("qs_token"),
      },
      success: function(response) {
        console.log('Dirección guardada:', response);
        
       
        $('#addressForm')[0].reset();
        
        
        bootstrap.Modal.getInstance(document.getElementById('newAddressModal')).hide();
        
        
        GetAddresses();
        
        showToast('Direccion guardada correctamente', 'success')
        
      },
      error: function(error) {
        
        
        showToast('Error al guardar la direccion', 'danger')
      }
    })
});

