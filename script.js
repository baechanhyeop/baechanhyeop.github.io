const chips = document.querySelectorAll(".chip");
const cards = document.querySelectorAll(".card");
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxCaption = document.getElementById("lightboxCaption");
const lightboxSubtext = document.getElementById("lightboxSubtext");
const closeLightbox = document.getElementById("closeLightbox");
const yearEl = document.getElementById("year");

yearEl.textContent = new Date().getFullYear();

const FADE_MS = 220;
const hideTimers = new WeakMap();

function showCard(card) {
  const existing = hideTimers.get(card);
  if (existing) clearTimeout(existing);

  card.style.display = "block";
  card.style.opacity = "0";

  requestAnimationFrame(() => {
    card.style.opacity = "1";
  });
}

function hideCard(card) {
  card.style.opacity = "0";

  const t = setTimeout(() => {
    card.style.display = "none";
  }, FADE_MS);
  hideTimers.set(card, t);
}

chips.forEach((chip) => {
  chip.addEventListener("click", () => {
    chips.forEach((c) => c.classList.remove("active"));
    chip.classList.add("active");

    const filter = chip.dataset.filter;
    cards.forEach((card) => {
      const match = filter === "all" || card.dataset.category === filter;
      if (match) showCard(card);
      else hideCard(card);
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

    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
  });
});

function hideLightbox() {
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
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
