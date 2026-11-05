(() => {
  "use strict";

  const story = window.LOVE_STORY;
  if (!story) return;

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  const copy = story.copy;

  $$('[data-i18n]').forEach((element) => {
    const key = element.dataset.i18n;
    if (key === "herName") element.textContent = story.names.her;
    else if (key === "myName") element.textContent = story.names.my;
    else if (copy[key] !== undefined) element.textContent = copy[key];
  });

  document.title = `${story.names.her} & ${story.names.my} — a cute moment with you`;

  function renderReasons(items) {
    const grid = $("#reasons-grid");
    grid.replaceChildren();
    items.forEach(([title, reason], index) => {
      const button = document.createElement("button");
      button.className = `reason-card reveal reason-tone-${(index % 5) + 1}`;
      button.type = "button";
      button.setAttribute("aria-pressed", "false");
      button.setAttribute("aria-label", `${title}. Tap to reveal why.`);
      button.innerHTML = `
        <span class="reason-card-inner">
          <span class="reason-face reason-front"><span class="reason-number">${String(index + 1).padStart(2, "0")}</span><span class="reason-heart" aria-hidden="true">♡</span><strong>${escapeHtml(title)}</strong><span class="reason-tap">tap to find out <span aria-hidden="true">↗</span></span></span>
          <span class="reason-face reason-back"><span class="reason-heart" aria-hidden="true">♥</span><strong>${escapeHtml(title)}</strong><span>${escapeHtml(reason)}</span></span>
        </span>`;
      button.addEventListener("click", () => {
        const isOpen = button.classList.toggle("is-flipped");
        button.setAttribute("aria-pressed", String(isOpen));
      });
      grid.append(button);
    });
    observeReveals(grid);
  }

  function renderGallery(items) {
    const grid = $("#gallery-grid");
    grid.replaceChildren();
    items.forEach((item) => {
      const figure = document.createElement("figure");
      figure.className = `snapshot-card ${escapeClass(item.tone)} reveal`;
      figure.innerHTML = `
        <button class="gallery-card" type="button" aria-label="Open photo: ${escapeAttribute(item.title)}">
          ${galleryImage(item, false)}
        </button>
        <figcaption class="snapshot-caption">
          <h3>${escapeHtml(item.title)}</h3>
          <p>${escapeHtml(item.caption)}</p>
        </figcaption>`;
      $(".gallery-card", figure).addEventListener("click", () => openLightbox(item));
      grid.append(figure);
    });
    observeReveals(grid);
  }

  function galleryImage(item, large) {
    return `<img class="gallery-photo ${large ? "gallery-photo-large" : ""}" src="${escapeAttribute(item.image)}" alt="${escapeAttribute(item.alt)}" width="${Number(item.width)}" height="${Number(item.height)}" ${large ? "" : 'loading="lazy"'} decoding="async" />`;
  }

  const lightbox = $("#lightbox");
  function openLightbox(item) {
    $("#lightbox-content").innerHTML = galleryImage(item, true);
    $("#lightbox-caption").innerHTML = `<h2>${escapeHtml(item.title)}</h2><p>${escapeHtml(item.caption)}</p>`;
    if (typeof lightbox.showModal === "function") lightbox.showModal();
    else lightbox.setAttribute("open", "");
  }
  $("#lightbox-close").addEventListener("click", () => lightbox.close());
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) lightbox.close();
  });

  let letterTimer;
  let letterHasStarted = false;
  function resetLetter() {
    clearTimeout(letterTimer);
    const target = $("#letter-copy");
    target.replaceChildren();
    target.dataset.fullText = copy.letter.join("\n\n");
    target.dataset.finished = "false";
    letterHasStarted = false;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      target.textContent = target.dataset.fullText;
      target.dataset.finished = "true";
    }
  }

  function startLetterTyping() {
    const target = $("#letter-copy");
    clearTimeout(letterTimer);
    letterHasStarted = true;
    const fullText = target.dataset.fullText || "";
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      target.textContent = fullText;
      target.dataset.finished = "true";
      return;
    }
    let position = 0;
    target.textContent = "";
    target.dataset.finished = "false";
    const tick = () => {
      if (position >= fullText.length) {
        target.dataset.finished = "true";
        return;
      }
      const step = 4;
      target.textContent = fullText.slice(0, position + step);
      position += step;
      letterTimer = window.setTimeout(tick, 38);
    };
    tick();
  }

  $("#replay-letter").addEventListener("click", startLetterTyping);

  function makeHearts() {
    const holder = $("#floating-hearts");
    const symbols = ["♡", "♥", "✿", "·"];
    for (let i = 0; i < 17; i++) {
      const heart = document.createElement("span");
      heart.className = `float-heart float-heart-${i % 4}`;
      heart.textContent = symbols[i % symbols.length];
      heart.style.setProperty("--x", `${(i * 29 + 8) % 100}%`);
      heart.style.setProperty("--delay", `${(i % 7) * -1.7}s`);
      heart.style.setProperty("--duration", `${14 + (i % 6) * 2}s`);
      heart.style.setProperty("--size", `${14 + (i % 4) * 8}px`);
      holder.append(heart);
    }
  }

  const actions = $("#valentine-actions");
  const noButton = $("#no-button");
  function placeNoButton(avoidX = null, avoidY = null) {
    const box = actions.getBoundingClientRect();
    const yesBox = $("#yes-button").getBoundingClientRect();
    const width = noButton.offsetWidth;
    const height = noButton.offsetHeight;
    const maxX = Math.max(0, actions.clientWidth - width);
    const maxY = Math.max(0, actions.clientHeight - height);
    let x;
    let y;
    if (avoidX === null) {
      x = Math.min(maxX, Math.max(0, yesBox.right - box.left + 12));
      y = Math.max(0, yesBox.top - box.top);
      if (x === maxX && yesBox.left - box.left >= width + 12) x = yesBox.left - box.left - width - 12;
      if (yesBox.width + width + 12 > actions.clientWidth) {
        x = (actions.clientWidth - width) / 2;
        y = Math.min(maxY, yesBox.bottom - box.top + 8);
      }
    } else {
      const pointerX = avoidX - box.left;
      const pointerY = avoidY - box.top;
      let tries = 0;
      do {
        x = Math.random() * maxX;
        y = Math.random() * maxY;
        tries++;
      } while (tries < 16 && Math.hypot(x + width / 2 - pointerX, y + height / 2 - pointerY) < 96);
    }
    noButton.style.left = `${x}px`;
    noButton.style.top = `${y}px`;
  }
  noButton.addEventListener("pointerenter", (event) => placeNoButton(event.clientX, event.clientY));
  noButton.addEventListener("focus", () => placeNoButton(actions.getBoundingClientRect().left, actions.getBoundingClientRect().top));
  noButton.addEventListener("pointerdown", (event) => {
    if (event.pointerType !== "mouse") placeNoButton(event.clientX, event.clientY);
  });
  noButton.addEventListener("click", (event) => {
    event.preventDefault();
    placeNoButton(event.clientX, event.clientY);
  });
  window.addEventListener("resize", () => placeNoButton());

  $("#yes-button").addEventListener("click", () => {
    $("#yes-message").textContent = copy.yesMessage;
    $("#yes-message").classList.add("is-visible");
    launchConfetti();
    $("#yes-button").focus({ preventScroll: true });
  });

  function launchConfetti() {
    const layer = $("#confetti-layer");
    layer.replaceChildren();
    const colors = ["#df5973", "#f5a9ae", "#dfbf75", "#fff2df", "#c83d58", "#f6c9c5"];
    for (let i = 0; i < 72; i++) {
      const bit = document.createElement("i");
      bit.className = "confetti-bit";
      bit.style.setProperty("--confetti-x", `${Math.random() * 100}%`);
      bit.style.setProperty("--confetti-delay", `${Math.random() * 0.65}s`);
      bit.style.setProperty("--confetti-duration", `${2.5 + Math.random() * 2}s`);
      bit.style.setProperty("--confetti-color", colors[i % colors.length]);
      bit.style.setProperty("--confetti-rotate", `${Math.random() * 720 - 360}deg`);
      layer.append(bit);
    }
    window.setTimeout(() => layer.replaceChildren(), 5200);
  }

  function updateCounter() {
    const [year, month, day] = story.togetherSince.split("-").map(Number);
    const start = new Date(year, month - 1, day);
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const days = Math.max(0, Math.floor((todayStart - start) / 86400000));
    $("#days-together").textContent = new Intl.NumberFormat("en").format(days);
  }

  function observeReveals(scope = document) {
    const elements = $$(".reveal:not(.is-visible)", scope);
    if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      elements.forEach((element) => element.classList.add("is-visible"));
      return;
    }
    elements.forEach((element) => revealObserver.observe(element));
  }

  const revealObserver = "IntersectionObserver" in window ? new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        if (entry.target.classList.contains("letter-card") && !letterHasStarted) startLetterTyping();
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -24px 0px" }) : null;

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
  }
  function escapeAttribute(value) { return escapeHtml(value); }
  function escapeClass(value) { return /^[a-z0-9-]+$/i.test(value || "") ? value : ""; }

  renderReasons(copy.reasons);
  renderGallery(copy.snapshots);
  updateCounter();
  resetLetter();
  makeHearts();
  observeReveals(document);
  window.requestAnimationFrame(() => placeNoButton());
})();
