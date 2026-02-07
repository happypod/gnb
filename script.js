// Mobile Menu Toggle
const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
const navLinks = document.querySelector(".nav-links");

if (mobileMenuBtn) {
  mobileMenuBtn.addEventListener("click", () => {
    navLinks.classList.toggle("active");
    const icon = mobileMenuBtn.querySelector("i");
    // Simple toggle logic
    if (navLinks.classList.contains("active")) {
        // Change icon if needed, or just keep simple
    }
  });
}

// Header Scroll Effect
const header = document.querySelector("header");
window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    header.classList.add("scrolled");
    header.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.1)";
  } else {
    header.classList.remove("scrolled");
    header.style.boxShadow = "none";
  }
});

// Anti-gravity Scroll Reveal (Intersection Observer)
document.addEventListener("DOMContentLoaded", () => {
    // Select all text-heavy elements
    const textElements = document.querySelectorAll(
        ".text-section .container > *, .archive-item > *, .approach-content > *, .vision-item, .history-item"
    );

    const observerOptions = {
        root: null,
        rootMargin: "0px",
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target); // Animate only once
            }
        });
    }, observerOptions);

    textElements.forEach(el => {
        el.classList.add("fade-wrap");
        observer.observe(el);
    });

    // Also observe elements that already have .fade-wrap class manually
    const existingFades = document.querySelectorAll(".fade-wrap");
    existingFades.forEach(el => observer.observe(el));
});

(() => {
  if (!window.matchMedia("(max-width: 768px)").matches) return;

  const pages = ["company.html", "business.html", "portfolio.html", "contact.html"];
  const file = (location.pathname.split("/").pop() || "index.html").split("?")[0];
  const idx = pages.indexOf(file);
  if (idx === -1) return;

  // ---- UI hint (once) ----
  const HINT_KEY = "gnb_swipe_hint_seen_v1";
  const hint = document.createElement("div");
  hint.className = "swipe-hint";
  hint.textContent = "좌우로 밀어 다음 페이지로 이동";
  document.body.appendChild(hint);

  const edgeL = document.createElement("div");
  edgeL.className = "swipe-edge left";
  document.body.appendChild(edgeL);

  const edgeR = document.createElement("div");
  edgeR.className = "swipe-edge right";
  document.body.appendChild(edgeR);

  const showHintOnce = () => {
    if (localStorage.getItem(HINT_KEY)) return;
    localStorage.setItem(HINT_KEY, "1");
    hint.classList.add("show");
    edgeL.classList.add("show");
    edgeR.classList.add("show");
    setTimeout(() => hint.classList.remove("show"), 1800);
    setTimeout(() => { edgeL.classList.remove("show"); edgeR.classList.remove("show"); }, 1200);
  };

  // 첫 방문/첫 페이지 진입 시 1회 노출
  window.addEventListener("load", () => setTimeout(showHintOnce, 350), { once: true });

  // ---- swipe detection + drag effect ----
  const SWIPE_THRESHOLD = 70;
  const MAX_VERTICAL = 90;
  const MAX_TIME = 900;
  const EDGE_GUARD = 12;
  const DRAG_MAX_PX = 36; // 화면이 따라오는 최대 거리

  let startX = 0, startY = 0, startT = 0;
  let tracking = false;

  const isInteractive = (el) =>
    !!el.closest("a, button, input, textarea, select, label, [contenteditable='true'], .mobile-menu-btn");

  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

  const setDragX = (dx) => {
    // dx는 실제 이동량 → 화면은 아주 조금만 따라오게
    const dragX = clamp(dx * 0.18, -DRAG_MAX_PX, DRAG_MAX_PX);
    document.documentElement.style.setProperty("--drag-x", dragX + "px");
    document.body.style.transform = `translateX(var(--drag-x))`;
  };

  const resetDrag = (withTransition = true) => {
    if (withTransition) {
      document.body.style.transition = "transform 180ms ease";
      requestAnimationFrame(() => {
        document.body.style.transform = "translateX(0px)";
      });
      setTimeout(() => { document.body.style.transition = ""; }, 200);
    } else {
      document.body.style.transform = "translateX(0px)";
      document.body.style.transition = "";
    }
    document.body.classList.remove("is-dragging");
  };

  const onStart = (e) => {
    const t = e.touches?.[0];
    if (!t) return;

    if (t.clientX < EDGE_GUARD || t.clientX > (window.innerWidth - EDGE_GUARD)) return;
    if (isInteractive(e.target)) return;

    tracking = true;
    startX = t.clientX;
    startY = t.clientY;
    startT = Date.now();
    document.body.classList.add("is-dragging");
    document.body.style.willChange = "transform";
  };

  const onMove = (e) => {
    if (!tracking) return;
    const t = e.touches?.[0];
    if (!t) return;

    const dx = t.clientX - startX;
    const dy = t.clientY - startY;

    // 세로 스크롤 우세면 드래그 이펙트 중단
    if (Math.abs(dy) > MAX_VERTICAL) {
      tracking = false;
      resetDrag(true);
      return;
    }

    // 가볍게 따라오는 이펙트
    setDragX(dx);

    // 방향에 따라 edge 가이드 살짝 노출
    if (dx < -18 && idx < pages.length - 1) edgeR.classList.add("show");
    else edgeR.classList.remove("show");

    if (dx > 18 && idx > 0) edgeL.classList.add("show");
    else edgeL.classList.remove("show");
  };

  const onEnd = (e) => {
    if (!tracking) return;
    tracking = false;

    edgeL.classList.remove("show");
    edgeR.classList.remove("show");

    const t = e.changedTouches?.[0];
    if (!t) { resetDrag(true); return; }

    const dx = t.clientX - startX;
    const dy = t.clientY - startY;
    const dt = Date.now() - startT;

    // 원위치 복귀 먼저
    resetDrag(true);

    if (dt > MAX_TIME) return;
    if (Math.abs(dy) > MAX_VERTICAL) return;
    if (Math.abs(dx) < SWIPE_THRESHOLD) return;

    // 이동
    if (dx < 0 && idx < pages.length - 1) location.href = pages[idx + 1];
    else if (dx > 0 && idx > 0) location.href = pages[idx - 1];
  };

  document.addEventListener("touchstart", onStart, { passive: true });
  document.addEventListener("touchmove", onMove, { passive: true });
  document.addEventListener("touchend", onEnd, { passive: true });
})();
