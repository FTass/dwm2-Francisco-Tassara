function cargar ( ) {

}

function renderProductos(response, containerId) {
  const productos = response?.data ?? [];
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = '';

  if (!Array.isArray(productos) || productos.length === 0) {
    container.innerHTML = `
      <div class="card prod h-100">
        <div class="card-body">Producto no encontrado</div>
      </div>`;
    return;
  }

  for (const p of productos) {
    const col = document.createElement('div');
    col.className = 'col-12 col-sm-6 col-md-4 col-lg-3 mb-4';

    const card = document.createElement('div');
    card.className = 'card prod h-100';

    // 👇 buscamos imagen primaria, o la primera, o una default
    const primaryImg = p.images?.find(i => i.isPrimary) || p.images?.[0];
    const imgUrl = primaryImg?.url || 'https://picsum.photos/seed/cheese/300/200';
    const imgAlt = primaryImg?.alt || p.name || 'producto';

    const imageContainer = document.createElement('div');
    imageContainer.className = 'ratio ratio-4x3';

    const img = document.createElement('img');
    img.src = imgUrl;
    img.alt = imgAlt;
    img.className = 'card-img-top';

    imageContainer.appendChild(img);

    const cardBody = document.createElement('div');
    cardBody.className = 'card-body';
    cardBody.innerHTML = `
      <h5>${p.name ?? '-'}</h5>
      <p><em>$${p.price ?? '-'}</em></p>
    `;

    card.appendChild(imageContainer);
    card.appendChild(cardBody);
    col.appendChild(card);
    container.appendChild(col);
  }
}

