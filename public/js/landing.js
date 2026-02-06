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