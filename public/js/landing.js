window.addEventListener("DOMContentLoaded", () => {
  const hero = document.querySelector(".hero");
  if (hero) hero.classList.add("play");

  const topbar = document.getElementById("topbar");
  const showAt = 220; // px scrolled before it appears

  const onScroll = () => {
    if (!topbar) return;
    if (window.scrollY > showAt) topbar.classList.add("show");
    else topbar.classList.remove("show");
  };

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
});
async function fetchCart() {
  const res = await fetch("/api/cart");
  return await res.json();
}

function fmt(cents) {
  return `$${(cents / 100).toFixed(2)}`;
}

async function renderCartPanel() {
  const cart = await fetchCart();

  const countEl = document.querySelector("[data-cart-count]");
  if (countEl) countEl.textContent = cart.itemCount;

  const listEl = document.querySelector("[data-cart-items]");
  const totalEl = document.querySelector("[data-cart-total]");

  if (listEl) {
    listEl.innerHTML = cart.items
      .map(
        (i) => `
        <div class="cartItem">
          <div class="cartItemTitle">${i.name}</div>
          <div class="cartItemRow">
            <span>x${i.qty}</span>
            <span>${fmt(i.lineTotalCents)}</span>
          </div>
          <button class="cartRemove" data-remove="${i.productId}">Remove</button>
        </div>
      `
      )
      .join("");
  }

  if (totalEl) totalEl.textContent = fmt(cart.totalCents);

  document.querySelectorAll("[data-remove]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      await fetch("/api/cart/remove", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: btn.getAttribute("data-remove") }),
      });
      renderCartPanel();
    });
  });
}

document.addEventListener("DOMContentLoaded", renderCartPanel);