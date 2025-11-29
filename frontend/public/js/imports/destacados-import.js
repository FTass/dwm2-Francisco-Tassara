// import updateCartQuantity  from "/frontend/public/js/handlers/cart/render-cart.js";

const destacadosPromise = fetch(
        "/frontend/public/partials/destacados.html"
      )
        .then((r) => r.text())
        .then((html) => {
          document.getElementById("destacados-root").innerHTML = html;
        })
        .then(() => {
          if (typeof initHighlight === "function") {
            
            initHighlight();
          } else {
            console.error("initDestacados no está definida");
          }
        });
