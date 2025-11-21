const footerPromise = fetch("/frontend/public/partials/footer.html")
        .then((r) => r.text())
        .then((html) => {
          document.getElementById("footer-root").innerHTML = html;
        });