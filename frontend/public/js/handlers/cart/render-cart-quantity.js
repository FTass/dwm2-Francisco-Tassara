import { fetchCartItems } from "/frontend/public/js/handlers/cart/cart-util.js";

// Actualizar cantidad del carrito cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
  updateCartQuantity();
});

// Actualizar también cuando el drawer se abre
$(document).on('show.bs.offcanvas', '#cartDrawer', function () {
  updateCartQuantity();
});

async function updateCartQuantity() {
  try {
    console.log("[updateCartQuantity] Iniciando...");
    const items = await fetchCartItems();
    console.log("[updateCartQuantity] Items obtenidos:", items);
    
    const totalItems = Array.isArray(items) 
      ? items.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0)
      : 0;
    
    console.log("[updateCartQuantity] Total items:", totalItems);
    
    const badge = document.getElementById('productQuantity');
    console.log("[updateCartQuantity] Badge encontrado:", !!badge);
    
    if (badge) {
      if (totalItems > 0) {
        badge.textContent = totalItems;
        badge.style.display = 'block';
        console.log("[updateCartQuantity] ✓ Badge actualizado a:", totalItems);
      } else {
        badge.style.display = 'none';
      }
    }
  } catch (error) {
    console.error('Error actualizando cantidad del carrito:', error);
  }
}

// Exportar para que otros handlers lo usen
window.updateCartQuantity = updateCartQuantity;