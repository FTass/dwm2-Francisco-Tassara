const carouselPromise = fetch("/frontend/public/partials/carousel.html")
        .then((r) => r.text())
        .then((html) => {
          document.getElementById("carousel-root").innerHTML = html;
        });
