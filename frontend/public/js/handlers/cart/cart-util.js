// ...existing code...
const BASE = typeof API_BASE_URL !== 'undefined' ? API_BASE_URL : (window.API_BASE_URL || 'http://localhost:3000');

export async function fetchCartItems(cartId, token) {
    // fallback a localStorage si no se pasan params
    const id = cartId || localStorage.getItem("qs_cartId");
    const t = token || localStorage.getItem("qs_token");

    if (!id) return [];

    try {
        const res = await $.ajax({
            url: `${BASE}/api/carts/${id}/items`,
            method: "GET",
            headers: {
                Authorization: "Bearer " + (t || ""),
            },
        });

        return res.data || [];
    } catch (err) {
        console.error("Error cargando items:", err);
        return [];
    }
}

// exponer global para scripts que no usan import
window.fetchCartItems = fetchCartItems;