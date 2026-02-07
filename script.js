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
  // 모바일에서만 활성화
  if (!window.matchMedia("(max-width: 768px)").matches) return;

  // 페이지 순서(네비 링크와 동일)
  const pages = [
    "index.html",      // 메인
    "company.html",    // 소개
    "business.html",   // 일하는 방식
    "portfolio.html",  // 포트폴리오
    "contact.html"     // 연락하기
  ];

  // 현재 페이지 파일명 추출 (index.html은 제외하고 싶으면 아래에서 처리)
  const file = (location.pathname.split("/").pop() || "index.html").split("?")[0];

  // pages에 없는 페이지(예: index.html)에서는 스와이프 이동 비활성
  const idx = pages.indexOf(file);
  if (idx === -1) return;

  // 스와이프 판정값
  const SWIPE_THRESHOLD = 60;     // 최소 좌우 이동 px
  const MAX_VERTICAL = 80;        // 세로 이동이 크면 무시
  const MAX_TIME = 700;           // 너무 느린 스와이프 무시
  const EDGE_GUARD = 12;          // 화면 가장자리(특히 iOS) 간섭 방지

  let startX = 0, startY = 0, startT = 0, tracking = false;

  const isInteractive = (el) =>
    !!el.closest("a, button, input, textarea, select, label, [contenteditable='true'], .mobile-menu-btn");

  const onStart = (e) => {
    const t = e.touches?.[0];
    if (!t) return;

    // OS 제스처 간섭 방지
    if (t.clientX < EDGE_GUARD || t.clientX > (window.innerWidth - EDGE_GUARD)) return;

    if (isInteractive(e.target)) return;

    tracking = true;
    startX = t.clientX;
    startY = t.clientY;
    startT = Date.now();
  };

  const onEnd = (e) => {
    if (!tracking) return;
    tracking = false;

    const t = e.changedTouches?.[0];
    if (!t) return;

    const dx = t.clientX - startX;
    const dy = t.clientY - startY;
    const dt = Date.now() - startT;

    if (dt > MAX_TIME) return;
    if (Math.abs(dy) > MAX_VERTICAL) return;
    if (Math.abs(dx) < SWIPE_THRESHOLD) return;

    // 왼쪽 스와이프 → 다음 페이지
    if (dx < 0 && idx < pages.length - 1) {
      location.href = pages[idx + 1];
    }
    // 오른쪽 스와이프 → 이전 페이지
    else if (dx > 0 && idx > 0) {
      location.href = pages[idx - 1];
    }
  };

  document.addEventListener("touchstart", onStart, { passive: true });
  document.addEventListener("touchend", onEnd, { passive: true });
})();
