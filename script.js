const progress = document.querySelector(".scroll-progress");
const backTop = document.querySelector(".back-top");
const navLinks = Array.from(document.querySelectorAll(".top-nav nav a"));
const sections = Array.from(document.querySelectorAll(".section"));

const updateProgress = () => {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const percent = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
  progress.style.width = `${percent}%`;
  backTop.classList.toggle("show", window.scrollY > window.innerHeight * 0.55);
};

const setActiveLink = (id) => {
  navLinks.forEach((link) => {
    const target = link.getAttribute("href").replace("#", "");
    const isProject = link.textContent.trim() === "Projects" && [
      "rag", "rag-details", "churn", "churn-details", "fraud", "fraud-details",
      "plate", "plate-details", "house", "house-details"
    ].includes(id);

    link.classList.toggle("active", target === id || isProject);
  });
};

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  },
  {
    threshold: 0.12,
    rootMargin: "0px 0px -7% 0px"
  }
);

document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

const sectionObserver = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

    if (visible.length) setActiveLink(visible[0].target.id);
  },
  {
    threshold: [0.22, 0.4, 0.6]
  }
);

sections.forEach((section) => sectionObserver.observe(section));

navLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const target = document.querySelector(link.getAttribute("href"));
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

backTop.addEventListener("click", () => {
  document.querySelector("#home").scrollIntoView({ behavior: "smooth", block: "start" });
});

const tiltTargets = Array.from(document.querySelectorAll(".visual-card, .skill-card, .contact-cards a, .metric-row div"));

const canTilt = () => window.matchMedia("(pointer: fine) and (min-width: 900px)").matches &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

tiltTargets.forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    if (!canTilt()) return;

    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const midX = rect.width / 2;
    const midY = rect.height / 2;

    const rotateY = ((x - midX) / midX) * 6;
    const rotateX = -((y - midY) / midY) * 6;

    card.style.setProperty("--mx", `${(x / rect.width) * 100}%`);
    card.style.setProperty("--my", `${(y / rect.height) * 100}%`);
    card.style.transform = `perspective(1100px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
  });

  card.addEventListener("pointerleave", () => {
    card.style.transform = "";
  });
});

window.addEventListener("scroll", updateProgress, { passive: true });
window.addEventListener("resize", updateProgress);

updateProgress();
setActiveLink("home");
