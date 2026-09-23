/* =========================================================
   Kinnari Mishra — Academic Portfolio — Behaviour
   ========================================================= */
(function () {
  "use strict";

  /* ---------- Loading screen ---------- */
  window.addEventListener("load", function () {
    var loader = document.getElementById("loader");
    setTimeout(function () { loader && loader.classList.add("hide"); }, 350);
  });

  /* ---------- Theme toggle (persists for the session) ---------- */
  var root = document.documentElement;
  var themeBtn = document.getElementById("theme-toggle");
  var saved = null;
  try { saved = sessionStorage.getItem("km-theme"); } catch (e) {}
  if (saved) root.setAttribute("data-theme", saved);
  function currentTheme() {
    return root.getAttribute("data-theme") ||
      (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  }
  function setIcon() {
    if (!themeBtn) return;
    themeBtn.textContent = currentTheme() === "dark" ? "☀" : "☾";
  }
  setIcon();
  themeBtn && themeBtn.addEventListener("click", function () {
    var next = currentTheme() === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { sessionStorage.setItem("km-theme", next); } catch (e) {}
    setIcon();
  });

  /* ---------- Mobile nav ---------- */
  var navToggle = document.getElementById("nav-toggle");
  var navLinks = document.getElementById("nav-links");
  navToggle && navToggle.addEventListener("click", function () {
    navLinks.classList.toggle("open");
  });
  navLinks && navLinks.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", function () { navLinks.classList.remove("open"); });
  });

  /* ---------- Sticky nav shadow + scroll progress + back-to-top ---------- */
  var header = document.getElementById("site-nav");
  var progress = document.getElementById("scroll-progress");
  var backTop = document.getElementById("back-to-top");
  function onScroll() {
    var y = window.scrollY || document.documentElement.scrollTop;
    header && header.classList.toggle("scrolled", y > 8);
    var doc = document.documentElement;
    var max = doc.scrollHeight - doc.clientHeight;
    if (progress) progress.style.width = (max > 0 ? (y / max) * 100 : 0) + "%";
    if (backTop) backTop.classList.toggle("show", y > 600);
  }
  document.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  backTop && backTop.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* ---------- Active menu highlighting ---------- */
  var sections = Array.prototype.slice.call(document.querySelectorAll("main section[id]"));
  var navAnchors = Array.prototype.slice.call(document.querySelectorAll(".nav-links a"));
  var navObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var id = entry.target.getAttribute("id");
        navAnchors.forEach(function (a) {
          a.classList.toggle("active", a.getAttribute("href") === "#" + id);
        });
      }
    });
  }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
  sections.forEach(function (s) { navObserver.observe(s); });

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(function (el) { revealObserver.observe(el); });

  /* ---------- Animated counters ---------- */
  function animateCounter(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var suffix = el.getAttribute("data-suffix") || "";
    var dur = 1400, start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      var val = Math.round(target * eased);
      el.textContent = val + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var counters = document.querySelectorAll("[data-count]");
  var counterObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  counters.forEach(function (c) { counterObserver.observe(c); });

  /* ---------- Skill bars ---------- */
  var bars = document.querySelectorAll(".bar-fill");
  var barObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.style.width = entry.target.getAttribute("data-level") + "%";
        barObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  bars.forEach(function (b) { barObserver.observe(b); });

  /* ---------- Typing animation in hero ---------- */
  var typeEl = document.getElementById("type-target");
  if (typeEl) {
    var words = JSON.parse(typeEl.getAttribute("data-words") || "[]");
    var wi = 0, ci = 0, deleting = false;
    function tick() {
      var word = words[wi];
      if (!deleting) {
        ci++;
        typeEl.textContent = word.slice(0, ci);
        if (ci === word.length) { deleting = true; setTimeout(tick, 1500); return; }
      } else {
        ci--;
        typeEl.textContent = word.slice(0, ci);
        if (ci === 0) { deleting = false; wi = (wi + 1) % words.length; }
      }
      setTimeout(tick, deleting ? 40 : 80);
    }
    if (words.length) tick();
  }

  /* ---------- Ripple effect on buttons ---------- */
  document.querySelectorAll(".btn").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      var rect = btn.getBoundingClientRect();
      var span = document.createElement("span");
      var size = Math.max(rect.width, rect.height);
      span.className = "ripple";
      span.style.width = span.style.height = size + "px";
      span.style.left = (e.clientX - rect.left - size / 2) + "px";
      span.style.top = (e.clientY - rect.top - size / 2) + "px";
      btn.appendChild(span);
      setTimeout(function () { span.remove(); }, 650);
    });
  });

  /* ---------- Lightbox gallery ---------- */
  var lightbox = document.getElementById("lightbox");
  var lbImg = document.getElementById("lb-img");
  var lbCap = document.getElementById("lb-cap");
  var galleryLinks = Array.prototype.slice.call(document.querySelectorAll(".gallery-grid a"));
  var lbIndex = 0;
  function openLb(i) {
    lbIndex = i;
    var link = galleryLinks[i];
    lbImg.src = link.getAttribute("href");
    lbCap.textContent = link.getAttribute("data-caption") || "";
    lightbox.classList.add("open");
  }
  galleryLinks.forEach(function (a, i) {
    a.addEventListener("click", function (e) { e.preventDefault(); openLb(i); });
  });
  document.getElementById("lb-close") && document.getElementById("lb-close").addEventListener("click", function () {
    lightbox.classList.remove("open");
  });
  document.getElementById("lb-prev") && document.getElementById("lb-prev").addEventListener("click", function () {
    openLb((lbIndex - 1 + galleryLinks.length) % galleryLinks.length);
  });
  document.getElementById("lb-next") && document.getElementById("lb-next").addEventListener("click", function () {
    openLb((lbIndex + 1) % galleryLinks.length);
  });
  lightbox && lightbox.addEventListener("click", function (e) {
    if (e.target === lightbox) lightbox.classList.remove("open");
  });
  document.addEventListener("keydown", function (e) {
    if (!lightbox || !lightbox.classList.contains("open")) return;
    if (e.key === "Escape") lightbox.classList.remove("open");
    if (e.key === "ArrowRight") openLb((lbIndex + 1) % galleryLinks.length);
    if (e.key === "ArrowLeft") openLb((lbIndex - 1 + galleryLinks.length) % galleryLinks.length);
  });

  /* ---------- Contact form (front-end only demo) ---------- */
  var form = document.getElementById("contact-form");
  form && form.addEventListener("submit", function (e) {
    e.preventDefault();
    var note = document.getElementById("form-note");
    note.textContent = "Thank you — this demo form doesn't send yet. Please email directly until it's connected.";
  });

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Hero canvas: gentle drifting network ---------- */
  var canvas = document.getElementById("hero-canvas");
  if (canvas && canvas.getContext) {
    var ctx = canvas.getContext("2d");
    var w, h, points;
    function resize() {
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
    }
    function initPoints() {
      var count = Math.min(46, Math.floor((w * h) / 26000));
      points = [];
      for (var i = 0; i < count; i++) {
        points.push({
          x: Math.random() * w, y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25
        });
      }
    }
    function draw() {
      ctx.clearRect(0, 0, w, h);
      var isDark = currentTheme() === "dark";
      ctx.fillStyle = isDark ? "rgba(217,173,99,0.55)" : "rgba(184,134,59,0.4)";
      ctx.strokeStyle = isDark ? "rgba(217,173,99,0.14)" : "rgba(14,59,67,0.09)";
      for (var i = 0; i < points.length; i++) {
        var p = points[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        ctx.beginPath(); ctx.arc(p.x, p.y, 1.6, 0, Math.PI * 2); ctx.fill();
        for (var j = i + 1; j < points.length; j++) {
          var q = points[j];
          var dx = p.x - q.x, dy = p.y - q.y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
          }
        }
      }
      requestAnimationFrame(draw);
    }
    var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    resize(); initPoints();
    if (!reduceMotion) requestAnimationFrame(draw); else draw();
    window.addEventListener("resize", function () { resize(); initPoints(); });
  }
})();
