(function () {
  "use strict";

  const body = document.body;
  const header = document.getElementById("site-header");
  const nav = document.getElementById("primary-nav");
  const navLinks = Array.from(nav.querySelectorAll("a"));
  const menuToggle = document.querySelector(".menu-toggle");
  const mainContent = document.getElementById("main");
  const footer = document.querySelector(".footer");
  const desktopQuery = window.matchMedia("(min-width: 961px)");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* ---------- Year ---------- */
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  /* ---------- Sticky header state ---------- */
  function updateHeader() {
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  }
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  /* ---------- Mobile navigation ---------- */
  function setNav(open, restoreFocus) {
    body.classList.toggle("nav-open", open);
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? "Tutup menu navigasi" : "Buka menu navigasi");

    if (mainContent) mainContent.inert = open;
    if (footer) footer.inert = open;

    if (open) {
      const firstLink = nav.querySelector("a");
      if (firstLink) {
        window.setTimeout(function () {
          if (body.classList.contains("nav-open")) firstLink.focus();
        }, 80);
      }
    } else if (restoreFocus) {
      menuToggle.focus();
    }
  }

  menuToggle.addEventListener("click", function () {
    setNav(!body.classList.contains("nav-open"), false);
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", function () {
      if (body.classList.contains("nav-open")) setNav(false, false);
    });
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && body.classList.contains("nav-open")) {
      setNav(false, true);
    }
  });

  function onDesktopChange(event) {
    if (event.matches && body.classList.contains("nav-open")) setNav(false, false);
  }
  if (typeof desktopQuery.addEventListener === "function") {
    desktopQuery.addEventListener("change", onDesktopChange);
  } else {
    desktopQuery.addListener(onDesktopChange);
  }

  /* ---------- Reveal on scroll ---------- */
  const revealItems = Array.from(document.querySelectorAll("[data-reveal]"));

  if ("IntersectionObserver" in window && !reduceMotion.matches) {
    const revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.06 }
    );

    revealItems.forEach(function (item) {
      revealObserver.observe(item);
    });
  } else {
    revealItems.forEach(function (item) {
      item.classList.add("is-visible");
    });
  }

  /* ---------- Scroll spy ---------- */
  const spySections = Array.from(document.querySelectorAll("main section[id]")).filter(function (section) {
    return navLinks.some(function (link) {
      return link.getAttribute("href") === "#" + section.id;
    });
  });

  if ("IntersectionObserver" in window && spySections.length) {
    const spyObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          const id = "#" + entry.target.id;

          navLinks.forEach(function (link) {
            if (link.getAttribute("href") === id) {
              link.setAttribute("aria-current", "true");
            } else {
              link.removeAttribute("aria-current");
            }
          });
        });
      },
      { rootMargin: "-42% 0px -52% 0px", threshold: 0 }
    );

    spySections.forEach(function (section) {
      spyObserver.observe(section);
    });
  }

  /* ---------- Gallery lightbox ---------- */
  const dialog = document.getElementById("lightbox");
  const galleryItems = Array.from(document.querySelectorAll(".gallery-item"));

  if (dialog && galleryItems.length && typeof dialog.showModal === "function") {
    const dialogImage = dialog.querySelector("figure img");
    const dialogCaption = dialog.querySelector(".lightbox-caption");
    const closeButton = dialog.querySelector(".lightbox-close");
    const prevButton = dialog.querySelector(".lightbox-prev");
    const nextButton = dialog.querySelector(".lightbox-next");
    let currentIndex = 0;

    function renderSlide(index) {
      currentIndex = (index + galleryItems.length) % galleryItems.length;
      const item = galleryItems[currentIndex];

      dialogImage.src = item.dataset.full;
      dialogImage.alt = item.dataset.alt || "";
      dialogCaption.textContent = item.dataset.caption || "";

      const nextItem = galleryItems[(currentIndex + 1) % galleryItems.length];
      if (nextItem) {
        const preload = new Image();
        preload.src = nextItem.dataset.full;
      }
    }

    function openLightbox(index) {
      if (!dialog.open) {
        dialog.showModal();
        body.classList.add("lightbox-open");
      }
      renderSlide(index);
    }

    function closeLightbox() {
      if (dialog.open) dialog.close();
    }

    galleryItems.forEach(function (item, index) {
      item.addEventListener("click", function () {
        openLightbox(index);
      });
    });

    closeButton.addEventListener("click", closeLightbox);
    prevButton.addEventListener("click", function () {
      renderSlide(currentIndex - 1);
    });
    nextButton.addEventListener("click", function () {
      renderSlide(currentIndex + 1);
    });

    dialog.addEventListener("click", function (event) {
      if (event.target === dialog) closeLightbox();
    });

    dialog.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        event.preventDefault();
        closeLightbox();
        return;
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        renderSlide(currentIndex + 1);
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        renderSlide(currentIndex - 1);
      }
    });

    function handleDialogClosed() {
      if (dialog.open) return;
      body.classList.remove("lightbox-open");

      const activeItem = galleryItems[currentIndex];
      if (!activeItem) return;

      const focusIsElsewhere =
        document.activeElement &&
        document.activeElement !== document.body &&
        !dialog.contains(document.activeElement);

      if (!focusIsElsewhere) activeItem.focus();
    }

    dialog.addEventListener("close", handleDialogClosed);

    if (typeof MutationObserver === "function") {
      new MutationObserver(handleDialogClosed).observe(dialog, {
        attributes: true,
        attributeFilter: ["open"],
      });
    }
  }
})();
