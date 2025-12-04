
import { showToast } from "../util/toast-util.js";
const token = localStorage.getItem("qs_token");
let allProducts = [];
let milkTypeSelected = null;
let categorySelected = null;

let currentProductId = null;
function loadCategories() {
    $.ajax({
        url: "http://localhost:3000/api/categories/",
        type: "GET",
        headers: {
        Authorization: `Bearer ${token}`,
        },
        success: function (response) {
        const allCategories = response.data || response;
        populateSelect( allCategories, categorySelect );
        },
        error: function (error) {
        console.error("Error:", error);
        alert("Error cargando categorias");
        },
    });
}



function loadMilkTypes() {
    populateSelect( ['cow', 'goat', 'sheep', 'veggie'], milkFilter )
}





$(document).ready(function () {

    const user = JSON.parse(localStorage.getItem("qs_user"));
    if ( user && user.profile && user.profile && user.profile.name !== 'admin') {
        window.location.href = '/frontend/public/index.html';
    }
    
    loadCategories()
    loadMilkTypes()
  // Evento del select
  $("#productSelect").prop('disabled', true)
  $("#productSelect").on("change", function () {
    const productId = $(this).val();
    if (productId) {
      showProduct(productId);
    } else {
      $("#stock-table-body").html(
        '<tr><td colspan="3" class="text-center text-muted">Selecciona un producto</td></tr>'
      );
    }
  });
});

$('#categorySelect').on('change', function() {
  
  if ( milkTypeSelected ) milkTypeSelected = null;
  
  categorySelected = $(this).val();
  
  if ( categorySelected === "none"  ) {
    $('#milkFilter').prop('disabled', false)
    allProducts = [];
    $('#productSelect').html('<option value="">Selecciona un producto</option>');
    $('#productSelect').prop('disabled', true);
  } else {
    $('#milkFilter').prop('disabled', true)
    loadProducts( {categoryId : categorySelected} )
  }
})

$('#milkFilter').on('change', function() {
  if (categorySelected ) categorySelected = null;
  milkTypeSelected = $(this).val();
  if ( milkTypeSelected === "none"  ) {
    $('#categorySelect').prop('disabled', false)
    allProducts = [];
    $('#productSelect').html('<option value="">Selecciona un producto</option>');
    $('#productSelect').prop('disabled', true);
    
  } else {
    $('#categorySelect').prop('disabled', true)
    loadProducts( {milkType : milkTypeSelected} )

  }
})




function loadProducts( query ) {
  $.ajax({
    url: "http://localhost:3000/api/products",
    type: "GET",
    data: query,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    success: function (response) {
      allProducts = response.data || response;
      $('#productSelect').html('<option value="">Selecciona un producto</option>');
      $('#productSelect').prop('disabled', false)
      populateSelect(allProducts, productSelect);
    },
    error: function (error) {
      console.error("Error:", error);
      alert("Error cargando productos");
    },
  });
}

function populateSelect( array, selectId ) {
  
    
    if (selectId == productSelect ) {
        const select = $("#productSelect");
        array.forEach((item) => {
        select.append(`<option value="${item._id}">${item.name}</option>`);
        });
    }
  
    if ( selectId == categorySelect) {
        const select = $("#categorySelect");
        array.forEach( (item) => {
        const opt = `<option value=${item._id}> ${item.name}</option>`
        select.append(opt)
    })
    }
  
    if ( selectId == milkFilter) {
        const select = $("#milkFilter");
        array.forEach( (item) => {
        const opt = `<option value=${item}> ${item}</option>`
        select.append(opt)
    });
    }
  

}



function showProduct(productId) {
    currentProductId = productId
    const product = allProducts.find((p) => p._id === productId);
    if (!product) return;

    const tbody = $("#stock-table-body");
    tbody.html(`
        <tr>
            <td>${product.name}</td>
                <td id="actualStock">${product.stock}</td>
                <td>
                    <button 
                    class="btn btn-primary"
                    id="editProductBtn",
                    data-bs-toggle="modal",
                    data-bs-target="#editProductModal">
                    Editar
                    </button>
                </td>

        </tr>`);
    $("#isOffer").on("change", function(){
        if ($(this).val() == 'true') {
            $("#discountPercentage").prop("disabled", false)
        } 
        if ($(this).val() == 'false') {
            $("#discountPercentage").prop("disabled", true)
        } 
    })

    
      
  $("#quantity").on("change", function () {
    const newStock = $(this).val();
    updateStock(productId, newStock);
  });
}


function updateStock(productId, newStock) {
  $.ajax({
    url: `http://localhost:3000/api/products/${productId}`,
    type: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    data: JSON.stringify({ stock: parseInt(newStock) }),
    success: function () {
      showToast('Stock Actualizado', 'success')
      setTimeout( () => {

          loadProducts(); 
      },500);
    },
    error: function (error) {
      console.error("Error:", error);
      showToast('Error actualizando Stock', 'warning')
    },
  });
}

function createStockMovement( productId, payload) {
  $.ajax({
    url: `http://localhost:3000/api/products/${productId}/stock-movement`,
    type: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    data: JSON.stringify( payload ),
    success :  function( res ) {
      showToast('Movimiento creado', 'success')
    },
    error: function ( err ) {
      showToast('Error al crear movimiento', 'warning')
    }
  });
}


// debug
$('#isOffer').on('change', function(){
  console.log('Has seleccionado', $(this).val());
  
})



$(document).on('click', '[data-bs-target="#editProductModal"]', function() {
  console.log('Entro');
  const product = allProducts.find((p)=> p._id === currentProductId);
  const stock = parseInt($('#actualStock').text());
  
  localStorage.setItem('qs_productStock', stock);

  $('#quantity').val( product.stock );
  $('#isOffer').val( product.offer ? 'true' : 'false' );
  $('#discountPercentage').val(product.discount || 0 );

} )


function applyDiscount( productId, payload) {
  $.ajax({
    url: `http://localhost:3000/api/products/${productId}/`,
    type: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    data: JSON.stringify( payload ),
    success :  function( res ) {
      showToast('Movimiento creado', 'success')
    },
    error: function ( err ) {
      showToast('Error al crear movimiento', 'warning')
    }
  });
}

$(document).on("click", '#editProductSubmit', function () {
  const newStock = $('#quantity').val();
  let quantity = 0;
  const oldStock = parseInt(localStorage.getItem('qs_productStock'));
  let type = 'entry'
  const user = JSON.parse(localStorage.getItem('qs_user'));
  const userId = user._id;
  if ( oldStock > newStock ) {
    type = 'exit'
    quantity = oldStock - newStock
  }   else {
    quantity =  newStock - oldStock 
  }

  const offer = $("#isOffer").val() === 'true';
  const discount = offer ? parseInt($("#discountPercentage").val()) : 0;

applyDiscount( currentProductId, { offer, discount })
  
  const reason = $('#reason').val();
  updateStock(currentProductId, newStock);
  console.log(type)
  let payload = {
    userId,
    type,
    quantity,
    reason
  }
  createStockMovement( currentProductId, payload )
  
});
