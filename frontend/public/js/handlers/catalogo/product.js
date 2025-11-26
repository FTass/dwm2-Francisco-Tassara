const API_BASE_URL = "http://localhost:3000";

function initProd() {
  initCatalogoProductos( 'cow', 'row-quesos-vaca');
  initCatalogoProductos('goat', 'row-quesos-cabra');
  initCatalogoProductos('sheep', 'row-quesos-oveja');
  initCatalogoProductos('veggie', 'row-quesos-veggie');
}

function initCatalogoProductos(milkType, containerId) {
  

  $.get(`${API_BASE_URL}/api/products`, {
    milkType,
    status : 'published'
    
  })
    .done(function (response) {
      
      renderProductos( response, containerId );
    })
    .fail(function (err) {
      console.error("Error al cargar productos", err);
    });
}

function renderProductos(response, containerId) {
  const productos = response?.data ?? [];
  const $container = $("#" + containerId);

  if ($container.length === 0) {
    console.warn("No se encontró el contenedor", containerId);
    return;
  }

  $container.empty();

  if (!Array.isArray(productos) || productos.length === 0) {
    $container.html(`
      <div class="col-12">
        <div class="alert alert-info text-center">No se encontraron productos</div>
      </div>
    `);
    return;
  }

  productos.forEach((p) => {
    const stock = typeof p.stock === "number" ? p.stock : 0;
    const placeholder = "https://via.placeholder.com/300x200?text=Cargando...";

    const $col = $(`
      <div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
        <div class="card prod h-100" 
             data-bs-toggle="modal"
             data-bs-target="#exampleModal"
             data-product-id="${p._id}"
             data-product-name="${p.name}"
             data-product-price="$${formatPrice(p.price)}"
             data-product-desc="${
               p.description || "Sin descripción disponible"
             }"
             data-product-stock="${stock}" data-product-img="${placeholder}">
          <div class="ratio ratio-4x3">
            <img class="card-img-top product-img" 
                 src="${placeholder}" 
                 alt="${p.name}" 
                 loading="lazy">
          </div>
          <div class="card-body">
            ${
              stock > 0
                ? ''
                : '<span class="badge bg-danger mb-2">Agotado</span>'
            }
            <h5 class="card-title">${p.name}</h5>
            <p class="card-text"><em>$${formatPrice(p.price)}</em></p>
          </div>
        </div>
      </div>
    `);

    $container.append($col);

    if (p._id) {
      $.get(
        `${API_BASE_URL}/api/products/${p._id}/images`,
        { productId: p._id },
        function (imgRes) {
          const imgs = imgRes?.data ?? [];
          const primary = imgs.find((i) => i.isPrimary) || imgs[0];

          if (primary?.url) {
            $col.find(".product-img").attr("src", primary.url);
            
          } else {
            $col
              .find(".product-img")
              .attr(
                "src",
                "https://via.placeholder.com/300x200?text=No+Disponible"
              );
          }
        }
      );
    }
  });
}

function formatPrice(price) {
  if (!price && price !== 0) return "0";
  return new Intl.NumberFormat("es-CL").format(price);
}
