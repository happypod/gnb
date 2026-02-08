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

    // Portfolio Tab Switching
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    if (tabBtns.length > 0) {
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all
                tabBtns.forEach(b => b.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));

                // Add active class to clicked
                btn.classList.add('active');
                const tabId = btn.getAttribute('data-tab');
                document.getElementById(`tab-${tabId}`).classList.add('active');
            });
        });
    }
});

(() => {
  if (!window.matchMedia("(max-width: 768px)").matches) return;

  // ✅ index부터 포함 + 무한 순환(첫/마지막 없음)
  const pages = [
    "index.html",
    "company.html",    // 소개
    "business.html",   // 일하는 방식
    "portfolio.html",  // 포트폴리오
    "contact.html"     // 연락하기
  ];

  // 현재 페이지 파일명
  const file = (location.pathname.split("/").pop() || "index.html").split("?")[0];

  // pages에 없는 페이지면 비활성
  const idx = pages.indexOf(file);
  if (idx === -1) return;

  // 페이지 라벨
  const labels = {
    "index.html": "홈",
    "company.html": "소개",
    "business.html": "일하는 방식",
    "portfolio.html": "포트폴리오",
    "contact.html": "연락하기"
  };

  // 무한 순환 인덱스 계산
  const nextIndex = (i) => (i + 1) % pages.length;
  const prevIndex = (i) => (i - 1 + pages.length) % pages.length;

  // ---- UI hint (once) ----
  const HINT_KEY = "gnb_swipe_hint_seen_v2";
  const hint = document.createElement("div");
  hint.className = "swipe-hint";
  hint.textContent = "좌우로 밀어 페이지 이동";
  document.body.appendChild(hint);

  const edgeL = document.createElement("div");
  edgeL.className = "swipe-edge left";
  document.body.appendChild(edgeL);

  const edgeR = document.createElement("div");
  edgeR.className = "swipe-edge right";
  document.body.appendChild(edgeR);

  // 상단 미리보기 라벨
  const preview = document.createElement("div");
  preview.className = "swipe-preview";
  document.body.appendChild(preview);

  const showHintOnce = () => {
    if (localStorage.getItem(HINT_KEY)) return;
    localStorage.setItem(HINT_KEY, "1");
    hint.classList.add("show");
    edgeL.classList.add("show");
    edgeR.classList.add("show");
    setTimeout(() => hint.classList.remove("show"), 1600);
    setTimeout(() => { edgeL.classList.remove("show"); edgeR.classList.remove("show"); }, 1000);
  };

  window.addEventListener("load", () => setTimeout(showHintOnce, 300), { once: true });

  // ---- preview ----
  const showPreviewAt = (text, x, y) => {
  preview.textContent = text;

  // 화면 밖으로 튀지 않게 약간 클램프
  const pad = 16;
  const px = Math.max(pad, Math.min(window.innerWidth - pad, x));
  const py = Math.max(pad, Math.min(window.innerHeight - pad, y));

  preview.style.left = px + "px";
  preview.style.top = py + "px";

  preview.classList.add("show");
  };
  const hidePreview = () => preview.classList.remove("show");

  const nextLabel = (i) => `${labels[pages[nextIndex(i)]]} 보기 →`;
  const prevLabel = (i) => `← ${labels[pages[prevIndex(i)]]} 보기`;

  // ---- swipe detection + drag effect ----
  const SWIPE_THRESHOLD = 70;
  const MAX_VERTICAL = 90;
  const MAX_TIME = 900;
  const EDGE_GUARD = 12;
  const DRAG_MAX_PX = 36;

  let startX = 0, startY = 0, startT = 0;
  let tracking = false;

  const isInteractive = (el) =>
    !!el.closest("a, button, input, textarea, select, label, [contenteditable='true'], .mobile-menu-btn");

  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

  const setDragX = (dx) => {
    const dragX = clamp(dx * 0.18, -DRAG_MAX_PX, DRAG_MAX_PX);
    document.body.style.transform = `translateX(${dragX}px)`;
  };

  const resetDrag = () => {
    document.body.style.transition = "transform 180ms ease";
    requestAnimationFrame(() => (document.body.style.transform = "translateX(0px)"));
    setTimeout(() => { document.body.style.transition = ""; }, 200);
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

    if (Math.abs(dy) > MAX_VERTICAL) {
      tracking = false;
      hidePreview();
      edgeL.classList.remove("show");
      edgeR.classList.remove("show");
      resetDrag();
      return;
    }

    setDragX(dx);

    // ✅ 무한 순환이므로 항상 양쪽 라벨 가능
    if (dx < -18) {
      showPreviewAt(nextLabel(idx), t.clientX, t.clientY);
      edgeR.classList.add("show");
      edgeL.classList.remove("show");
    } else if (dx > 18) {
      showPreviewAt(prevLabel(idx), t.clientX, t.clientY);
      edgeL.classList.add("show");
      edgeR.classList.remove("show");
    } else {
      hidePreview();
      edgeL.classList.remove("show");
      edgeR.classList.remove("show");
    } 
  };

  const onEnd = (e) => {
    if (!tracking) return;
    tracking = false;

    hidePreview();
    edgeL.classList.remove("show");
    edgeR.classList.remove("show");

    const t = e.changedTouches?.[0];
    if (!t) { resetDrag(); return; }

    const dx = t.clientX - startX;
    const dy = t.clientY - startY;
    const dt = Date.now() - startT;

    resetDrag();

    if (dt > MAX_TIME) return;
    if (Math.abs(dy) > MAX_VERTICAL) return;
    if (Math.abs(dx) < SWIPE_THRESHOLD) return;

    // ✅ 무한 순환 이동
    if (dx < 0) {
      location.href = pages[nextIndex(idx)];
    } else if (dx > 0) {
      location.href = pages[prevIndex(idx)];
    }
  };

  document.addEventListener("touchstart", onStart, { passive: true });
  document.addEventListener("touchmove", onMove, { passive: true });
  document.addEventListener("touchend", onEnd, { passive: true });
})();
