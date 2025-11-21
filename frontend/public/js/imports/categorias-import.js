const categoriasPromise = fetch(
        "/frontend/public/partials/categorias.html"
      )
        .then((r) => r.text())
        .then((html) => {
          document.getElementById("categorias-root").innerHTML = html;
        });