import { fetchCartItems } from "../cart/cart-util.js";

document.querySelectorAll('input[name="flexRadioDefault"]').forEach(radio => {
  radio.addEventListener("change", (e) => {
    $("#paymentMethod").text(`${e.target.value}`)
  });
});


document.addEventListener("DOMContentLoaded", async () => {
    console.log("Se entro al eventListener");
    
    const cartId = localStorage.getItem("qs_cartId")
    const token = localStorage.getItem("qs_token")

    const items = await fetchCartItems( cartId, token );
    console.log(items);
    
    await fillResume( items );
})

async function fillResume( items ){
    const $tbody = $("#resumeBody");
    if (!items.length) {
        $tbody.html(`
            <tr>
                <td colspan="4" class="text-center text-muted py-4">
                    <i class="fa-solid fa-cart-shopping fa-2x mb-2"></i>
                    <div>Tu carrito está vacío</div>
                </td>
            </tr>`);

        $("#resumeSubTotal").text("$0");
        $("#IVA").text("$0");
        $("#resumeTotal").text("$0");
        return;  
    }
    let rows = "";
    let subtotal = 0;

    for (const item of items) {
        const name = item.productId?.name ?? "Producto sin nombre";
        const price = Number(item.productId?.price ?? 0);
        const qty = Number(item.quantity ?? 1);
        const rowSubtotal = price * qty;

        subtotal += rowSubtotal;
        rows += `
            <tr>
                <td>${name}</td>
                <td>${qty}</td>
                <td>$${price.toLocaleString("es-CL")}</td>
                <td>$${rowSubtotal.toLocaleString("es-CL")}</td>
            </tr>
        `
    }
    $tbody.html( rows );
    const IVA = subtotal * 0.19;
    const total = subtotal + IVA;

    $("#resumeSubTotal").text(`$${subtotal.toLocaleString("es-CL")}`)
    $("#IVA").text(`$${IVA.toLocaleString("es-CL")}`)
    $("#resumeTotal").text(`$${total.toLocaleString("es-CL")}`)
    
}