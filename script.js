const chips = document.querySelectorAll(".chip");
const cards = document.querySelectorAll(".card");
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxCaption = document.getElementById("lightboxCaption");
const lightboxSubtext = document.getElementById("lightboxSubtext");
const closeLightbox = document.getElementById("closeLightbox");
const yearEl = document.getElementById("year");

yearEl.textContent = new Date().getFullYear();

const LIGHTBOX_ANIM_MS = 260;
const FILTER_TRANSITION_MS = 800;
const FILTER_STAGGER_MS = 45;
let lightboxCloseTimer = null;
const filterHideTimers = new WeakMap();

cards.forEach((card) => {
  card.classList.remove("filter-hidden");
  card.style.setProperty("--delay", "0s");
});

chips.forEach((chip) => {
  chip.addEventListener("click", () => {
    chips.forEach((c) => c.classList.remove("active"));
    chip.classList.add("active");

    const filter = chip.dataset.filter;
    let visibleIndex = 0;

    cards.forEach((card) => {
      const existingTimer = filterHideTimers.get(card);
      if (existingTimer) clearTimeout(existingTimer);

      const match = filter === "all" || card.dataset.category === filter;
      if (match) {
        card.style.display = "block";
        card.style.setProperty("--delay", `${visibleIndex * FILTER_STAGGER_MS}ms`);
        card.classList.remove("filter-hidden");
        visibleIndex += 1;
      } else {
        card.style.setProperty("--delay", "0s");
        card.classList.add("filter-hidden");
        const hideTimer = setTimeout(() => {
          if (card.classList.contains("filter-hidden")) {
            card.style.display = "none";
          }
        }, FILTER_TRANSITION_MS);
        filterHideTimers.set(card, hideTimer);
      }
    });
  });
});

cards.forEach((card) => {
  const image = card.querySelector("img");
  image.addEventListener("click", () => {
    lightboxImage.src = image.src;
    lightboxImage.alt = image.alt;

    const defaultTitle = card.querySelector("h2")?.textContent?.trim() || "";
    const title = (card.getAttribute("data-lightbox-title") || defaultTitle).trim();
    const subtext = (card.getAttribute("data-lightbox-text") || "").trim();

    lightboxCaption.textContent = title;
    lightboxSubtext.textContent = subtext;
    lightboxCaption.hidden = !title;
    lightboxSubtext.hidden = !subtext;

    if (lightboxCloseTimer) {
      clearTimeout(lightboxCloseTimer);
      lightboxCloseTimer = null;
    }
    lightbox.classList.remove("closing");
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
  });
});

function hideLightbox() {
  if (!lightbox.classList.contains("open")) return;
  lightbox.classList.remove("open");
  lightbox.classList.add("closing");
  lightboxCloseTimer = setTimeout(() => {
    lightbox.classList.remove("closing");
    lightbox.setAttribute("aria-hidden", "true");
  }, LIGHTBOX_ANIM_MS);
}

closeLightbox.addEventListener("click", hideLightbox);

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    hideLightbox();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && lightbox.classList.contains("open")) {
    hideLightbox();
  }
});
