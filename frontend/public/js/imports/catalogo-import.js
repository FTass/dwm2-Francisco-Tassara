const catalogoPromise = fetch("/frontend/public/partials/catalogo.html")
        .then((r) => r.text())
        .then((html) => {
          document.getElementById("catalogo-root").innerHTML = html;
        })
        .then(() => {
          if (typeof initProd === "function") {
            
            initProd();
            initOffers();
            initCombo();
            initTable();
          } else {
            console.error("initProd no está definida");
          }
        });