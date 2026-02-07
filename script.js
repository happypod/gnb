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
