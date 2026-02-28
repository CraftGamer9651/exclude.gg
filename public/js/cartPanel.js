(() => {
  // Prevent double-binding if script gets included twice by accident
  if (window.__cartPanelBound) return;
  window.__cartPanelBound = true;

  const $ = (sel) => document.querySelector(sel);

  async function getCart() {
    const res = await fetch("/api/cart");
    return res.json();
  }

  function money(cents) {
    return `$${(cents / 100).toFixed(2)}`;
  }

  function showCartHint() {
    document.body.classList.add("cart-hint-show");
    setTimeout(() => document.body.classList.remove("cart-hint-show"), 2600);
  }

  function openCart({ pin = false } = {}) {
    // "pin" means the user intentionally opened it (click add-to-cart, etc.)
    document.body.classList.add("cart-open");
    document.body.classList.toggle("cart-pinned", !!pin);
  }

  function closeCart() {
    document.body.classList.remove("cart-open");
    document.body.classList.remove("cart-pinned");
  }

  window.renderCartPanel = async function renderCartPanel() {
    const cart = await getCart();

    const countEl = $("[data-cart-count]");
    if (countEl) countEl.textContent = cart.itemCount ?? 0;

    const itemsEl = $("[data-cart-items]");
    const totalEl = $("[data-cart-total]");

    if (itemsEl) {
      if (!cart.items || cart.items.length === 0) {
        itemsEl.innerHTML = `<div class="muted" style="padding:10px 0;">Cart is empty.</div>`;
      } else {
        itemsEl.innerHTML = cart.items
          .map(
            (i) => `
            <div class="cartItem">
              <div class="cartItemTop">
                <div class="cartItemTitle">${i.name}</div>
                <button class="cartRemove" type="button" data-remove="${i.productId}">Remove</button>
              </div>
              <div class="cartItemBottom">
                <div class="muted">x${i.qty}</div>
                <div>${money(i.lineTotalCents)}</div>
              </div>
            </div>
          `
          )
          .join("");
      }
    }

    if (totalEl) totalEl.textContent = money(cart.totalCents ?? 0);
  };

  // One global click handler (delegated)
  document.addEventListener("click", async (e) => {
    // Add to cart
    const addBtn = e.target.closest("[data-add-to-cart]");
    if (addBtn) {
      e.preventDefault();

      const productId = addBtn.getAttribute("data-product-id");
      if (!productId) return;

      await fetch("/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, qty: 1 }),
      });

      openCart({ pin: true }); // user action => pinned open
      await window.renderCartPanel();
      showCartHint();
      return;
    }

    // Remove from cart
    const removeBtn = e.target.closest("[data-remove]");
    if (removeBtn) {
      e.preventDefault();
      const productId = removeBtn.getAttribute("data-remove");
      if (!productId) return;

      await fetch("/api/cart/remove", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });

      await window.renderCartPanel();
      return;
    }

    // Optional: click outside to close if not pinned
    const cartPanel = $("#cartPanel");
    if (document.body.classList.contains("cart-open") && !document.body.classList.contains("cart-pinned")) {
      if (cartPanel && !cartPanel.contains(e.target)) {
        closeCart();
      }
    }
  });

  // Edge-hover open (desktop only) — DOES NOT pin, so it won't lock scroll
  // Also: throttle it so it’s not insane.
  let lastEdgeCheck = 0;
  document.addEventListener("mousemove", (e) => {
    const now = Date.now();
    if (now - lastEdgeCheck < 120) return;
    lastEdgeCheck = now;

    const edge = 26; // tighter so it doesn't trigger on scrollbars as much
    const nearRightEdge = window.innerWidth - e.clientX < edge;

    if (nearRightEdge && !document.body.classList.contains("cart-open")) {
      openCart({ pin: false });
      window.renderCartPanel?.();
    }
  });

  // Close when leaving panel area IF not pinned
  const cartPanel = $("#cartPanel");
  if (cartPanel) {
    let closeTimer = null;

    cartPanel.addEventListener("mouseleave", () => {
      if (document.body.classList.contains("cart-pinned")) return;
      clearTimeout(closeTimer);
      closeTimer = setTimeout(() => closeCart(), 450);
    });

    cartPanel.addEventListener("mouseenter", () => {
      clearTimeout(closeTimer);
    });
  }

  // Mobile swipe gestures (optional)
  let touchStartX = null;

  document.addEventListener(
    "touchstart",
    (e) => {
      touchStartX = e.touches[0].clientX;
    },
    { passive: true }
  );

  document.addEventListener(
    "touchmove",
    (e) => {
      if (touchStartX == null) return;

      const x = e.touches[0].clientX;
      const leftSwipe = touchStartX - x;
      const rightSwipe = x - touchStartX;

      if (leftSwipe > 70) {
        openCart({ pin: true });
        window.renderCartPanel?.();
        touchStartX = null;
      }

      if (rightSwipe > 70 && document.body.classList.contains("cart-open")) {
        closeCart();
        touchStartX = null;
      }
    },
    { passive: true }
  );

  document.addEventListener("DOMContentLoaded", () => {
    window.renderCartPanel?.();
  });

  // Expose close if you want a close button later
  window.closeCart = closeCart;
})();