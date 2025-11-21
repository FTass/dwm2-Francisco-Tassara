 // ==========================
      // NAVBAR + CARRITO
      // ==========================
      fetch("/frontend/public/partials/navbar.html")
        .then((r) => r.text())
        .then((html) => {
          document.getElementById("navbar-root").innerHTML = html;
        })
        .then(() => {
          return Promise.all([
            fetch("/frontend/public/partials/carrito-btn.html")
              .then((r) => r.text())
              .then((html) => {
                const btnSlot = document.getElementById("cart-btn");
                if (btnSlot) btnSlot.innerHTML = html;
              }),
            fetch("/frontend/public/partials/carrito-content.html")
              .then((r) => r.text())
              .then((html) => {
                let contentSlot = document.getElementById("cart-content");
                if (!contentSlot) {
                  contentSlot = document.createElement("div");
                  contentSlot.id = "cart-content";
                  document.body.appendChild(contentSlot);
                }
                contentSlot.innerHTML = html;
              }),
          ]);
        })
        .catch(console.error);