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
let lightboxCloseTimer = null;

const FILTER_MOVE_MS = 520;
const FILTER_FADE_MS = 360;

function cancelCardAnimations(card) {
  for (const anim of card.getAnimations()) {
    anim.cancel();
  }
}

function animateFilter(filter) {
  const allCards = Array.from(cards);
  allCards.forEach(cancelCardAnimations);

  const currentlyVisible = allCards.filter((card) => card.style.display !== "none");
  const firstRects = new Map(
    currentlyVisible.map((card) => [card, card.getBoundingClientRect()])
  );

  allCards.forEach((card) => {
    const match = filter === "all" || card.dataset.category === filter;
    card.style.display = match ? "block" : "none";
  });

  const nextVisible = allCards.filter((card) => card.style.display !== "none");
  const nextVisibleSet = new Set(nextVisible);
  const previousVisibleSet = new Set(currentlyVisible);

  nextVisible.forEach((card, index) => {
    if (!previousVisibleSet.has(card)) {
      card.animate(
        [
          { opacity: 0, transform: "translateY(14px) scale(0.98)" },
          { opacity: 1, transform: "translateY(0) scale(1)" },
        ],
        {
          duration: FILTER_FADE_MS,
          delay: Math.min(index * 25, 180),
          easing: "ease",
          fill: "none",
        }
      );
      return;
    }

    const first = firstRects.get(card);
    const last = card.getBoundingClientRect();
    const dx = first.left - last.left;
    const dy = first.top - last.top;

    if (dx !== 0 || dy !== 0) {
      card.animate(
        [
          { transform: `translate(${dx}px, ${dy}px)` },
          { transform: "translate(0, 0)" },
        ],
        {
          duration: FILTER_MOVE_MS,
          easing: "cubic-bezier(0.22, 1, 0.36, 1)",
          fill: "none",
        }
      );
    }
  });
}

chips.forEach((chip) => {
  chip.addEventListener("click", () => {
    chips.forEach((c) => c.classList.remove("active"));
    chip.classList.add("active");

    const filter = chip.dataset.filter;
    animateFilter(filter);
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
