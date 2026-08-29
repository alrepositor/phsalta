// ===============================
// CONFIGURACIÓN DEL NEGOCIO
// ===============================
// Reemplazá este número por tu WhatsApp.
// Formato internacional, sin +, espacios ni guiones.
// Ejemplo Argentina: 5493871234567
const WHATSAPP_NUMBER = "543874036794";

const products = [
  {
    id: "huevos-seleccion",
    name: "Maple de huevos Selección",
    description: "30 huevos.",
    price: 6000,
    icon: "🥚"
  },
  {
    id: "huevos-medianos",
    name: "Maple de huevos Medianos",
    description: "30 huevos.",
    price: 5500,
    icon: "🥚"
  },
  {
    id: "caja-seleccion",
    name: "Caja de huevos Selección",
    description: "6 maples.",
    price: 27000,
    icon: "📦"
  },
  {
    id: "caja-medianos",
    name: "Caja de huevos Medianos",
    description: "6 maples.",
    price: 53500,
    icon: "📦"
  },
  {
    id: "leche",
    name: "Leche",
    description: "Producto fresco. Consultá presentación y disponibilidad.",
    price: 1800,
    icon: "🥛"
  },
  {
    id: "miel",
    name: "Miel",
    description: "Miel seleccionada. Consultá presentación y disponibilidad.",
    price: 7500,
    icon: "🍯"
  }
];

const money = value => value.toLocaleString("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0
});

let cart = JSON.parse(localStorage.getItem("laCanastaCart") || "{}");

function saveCart() {
  localStorage.setItem("laCanastaCart", JSON.stringify(cart));
}

function renderProducts() {
  const grid = document.getElementById("product-grid");
  grid.innerHTML = products.map(product => `
    <article class="product-card">
      <div class="product-icon">${product.icon}</div>
      <h3>${product.name}</h3>
      <p class="product-description">${product.description}</p>
      <div class="product-bottom">
        <div class="price">${product.price ? money(product.price) : "Consultar"}</div>
        <button class="btn btn-primary product-btn" onclick="addToCart('${product.id}')">
          Agregar
        </button>
      </div>
    </article>
  `).join("");
}

function addToCart(id) {
  cart[id] = (cart[id] || 0) + 1;
  saveCart();
  renderCart();
  document.getElementById("contacto").scrollIntoView({ behavior: "smooth" });
}

function changeQty(id, delta) {
  cart[id] = (cart[id] || 0) + delta;
  if (cart[id] <= 0) delete cart[id];
  saveCart();
  renderCart();
}

function renderCart() {
  const container = document.getElementById("cart-items");
  const ids = Object.keys(cart);

  if (!ids.length) {
    container.innerHTML = '<p class="empty-cart">Todavía no agregaste productos.</p>';
  } else {
    container.innerHTML = ids.map(id => {
      const product = products.find(p => p.id === id);
      const qty = cart[id];
      const subtotal = product.price ? product.price * qty : null;
      return `
        <div class="cart-row">
          <div>
            <div class="cart-row-name">${product.icon} ${product.name}</div>
            <small>${product.price ? money(product.price) : "Precio a confirmar"}</small>
          </div>
          <div class="qty-controls">
            <button onclick="changeQty('${id}', -1)" aria-label="Reducir">−</button>
            <strong>${qty}</strong>
            <button onclick="changeQty('${id}', 1)" aria-label="Aumentar">+</button>
          </div>
          <div class="cart-row-price">${subtotal !== null ? money(subtotal) : "Consultar"}</div>
        </div>
      `;
    }).join("");
  }

  const total = ids.reduce((sum, id) => {
    const product = products.find(p => p.id === id);
    return sum + (product.price || 0) * cart[id];
  }, 0);

  document.getElementById("cart-total").textContent = money(total);
}

function clearCart() {
  cart = {};
  saveCart();
  renderCart();
}

function buildWhatsAppMessage() {
  const ids = Object.keys(cart);
  if (!ids.length) return "";

  let message = "Hola! Quiero hacer el siguiente pedido:%0A%0A";
  let total = 0;

  ids.forEach(id => {
    const product = products.find(p => p.id === id);
    const qty = cart[id];
    const subtotal = product.price ? product.price * qty : 0;
    message += `• ${product.name} x${qty}`;
    if (product.price) {
      message += ` — ${money(subtotal)}`;
      total += subtotal;
    } else {
      message += " — consultar precio";
    }
    message += "%0A";
  });

  message += `%0A*Total estimado: ${money(total)}*`;
  message += "%0A%0A¿Me confirmás disponibilidad y costo de envío?";
  return message;
}

function sendOrder() {
  const message = buildWhatsAppMessage();
  if (!message) {
    alert("Agregá al menos un producto al pedido.");
    return;
  }
  if (WHATSAPP_NUMBER.includes("000000")) {
    alert("Primero configurá tu número de WhatsApp en el archivo script.js.");
    return;
  }
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank");
}

function directWhatsApp() {
  if (WHATSAPP_NUMBER.includes("000000")) return "#";
  return `https://wa.me/${WHATSAPP_NUMBER}?text=Hola!%20Quiero%20consultar%20por%20los%20productos.`;
}

document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  renderCart();
  document.getElementById("year").textContent = new Date().getFullYear();
  document.getElementById("clear-cart").addEventListener("click", clearCart);
  document.getElementById("send-order").addEventListener("click", sendOrder);
  document.getElementById("direct-whatsapp").href = directWhatsApp();

  document.querySelector(".menu-toggle").addEventListener("click", () => {
    document.querySelector(".nav-links").classList.toggle("open");
  });

  document.querySelectorAll(".nav-links a").forEach(link => {
    link.addEventListener("click", () => document.querySelector(".nav-links").classList.remove("open"));
  });
});
