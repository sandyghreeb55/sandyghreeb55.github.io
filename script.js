/**
 * Sandy Ghareeb Kamal — Premium Portfolio
 * GSAP · Lenis · ScrollTrigger · AOS · Vanilla Tilt · Typed.js
 */

(function () {
  'use strict';

  /* ── Defensive Mocks for Third-Party Libraries ── */
  if (typeof window.gsap === 'undefined') {
    window.gsap = {
      registerPlugin: () => {},
      to: (target, vars) => { if (vars && vars.onComplete) vars.onComplete(); return { kill: () => {} }; },
      from: (target, vars) => { if (vars && vars.onComplete) vars.onComplete(); return { kill: () => {} }; },
      fromTo: (target, fromVars, toVars) => { if (toVars && toVars.onComplete) toVars.onComplete(); return { kill: () => {} }; },
      set: () => {},
      timeline: () => {
        const mockTimeline = {
          to: () => mockTimeline,
          from: () => mockTimeline,
          fromTo: () => mockTimeline,
          set: () => mockTimeline,
          add: () => mockTimeline
        };
        return mockTimeline;
      },
      utils: {
        toArray: (selector) => Array.from(document.querySelectorAll(selector))
      }
    };
  }

  if (typeof window.ScrollTrigger === 'undefined') {
    window.ScrollTrigger = {
      registerPlugin: () => {},
      update: () => {},
      refresh: () => {}
    };
  }

  if (typeof window.Lenis === 'undefined') {
    window.Lenis = class {
      constructor() {}
      on() {}
      raf() {}
      stop() {}
      start() {}
      scrollTo() {}
    };
  }

  if (typeof window.Typed === 'undefined') {
    window.Typed = class {
      constructor() {}
    };
  }

  /* ── Register GSAP Plugins ── */
  gsap.registerPlugin(ScrollTrigger);

  /* ── Lenis Smooth Scroll ── */
  const lenis = new Lenis({
    duration: 1.4,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    smoothWheel: true,
    touchMultiplier: 1.5,
  });

  lenis.on('scroll', (e) => {
    ScrollTrigger.update();
    if (e.limit > 0) {
      const percentage = (e.scroll / e.limit) * 100;
      const progressEl = document.getElementById('scrollProgress');
      if (progressEl) {
        progressEl.style.width = percentage + '%';
      }
    }
  });

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);



  /* ── Typed.js ── */
  if (document.getElementById('typedText')) {
    new Typed('#typedText', {
      strings: [
        'Data Analyst',
        'Graphic Designer',
        'Creative Strategist',
        'Business Student',
        'Freelance Designer',
      ],
      typeSpeed: 55,
      backSpeed: 35,
      backDelay: 1800,
      loop: true,
      showCursor: true,
      cursorChar: '|',
      cursorClass: 'typed-cursor',
    });
  }

  /* ── Vanilla Tilt ── */
  if (typeof VanillaTilt !== 'undefined' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    VanillaTilt.init(document.querySelectorAll('[data-tilt]'), {
      max: 12,
      speed: 400,
      glare: true,
      'max-glare': 0.15,
      scale: 1.02,
    });
  }





  /* ══════════════════════════════════════
     NAVBAR
     ══════════════════════════════════════ */
  const navbar = document.getElementById('navbar');
  const navLinks = document.getElementById('navLinks');
  const navToggle = document.getElementById('navToggle');
  const navLinkEls = document.querySelectorAll('.nav-link[data-section]');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });

  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.classList.toggle('active');
    navToggle.setAttribute('aria-expanded', isOpen);
  });

  // Consolidated smooth scroll listener below

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinkEls.forEach((link) => {
            link.classList.toggle('active', link.dataset.section === id);
          });
        }
      });
    },
    { rootMargin: '-40% 0px -40% 0px' }
  );

  sections.forEach((section) => sectionObserver.observe(section));

  /* ══════════════════════════════════════
     THEME LOCK (DARK MODE ONLY)
     ══════════════════════════════════════ */
  document.documentElement.setAttribute('data-theme', 'dark');

  /* ══════════════════════════════════════
     BUTTON RIPPLE
     ══════════════════════════════════════ */
  document.querySelectorAll('.ripple-btn').forEach((btn) => {
    btn.addEventListener('click', function (e) {
      const ripple = document.createElement('span');
      ripple.classList.add('ripple');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = e.clientX - rect.left - size / 2 + 'px';
      ripple.style.top = e.clientY - rect.top - size / 2 + 'px';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });

  /* ══════════════════════════════════════
     GSAP SCROLL ANIMATIONS
     ══════════════════════════════════════ */
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {

    /* Section headers */
    gsap.utils.toArray('.section-header').forEach((header) => {
      gsap.from(header.children, {
        scrollTrigger: {
          trigger: header,
          start: 'top 85%',
        },
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: 'power3.out',
      });
    });

    /* Home parallax */
    gsap.to('.home-content', {
      scrollTrigger: {
        trigger: '.section--home',
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
      },
      y: -80,
      opacity: 0.3,
    });

    gsap.to('.home-visual', {
      scrollTrigger: {
        trigger: '.section--home',
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
      },
      y: -40,
    });

    /* Education timeline reveal */
    gsap.utils.toArray('.timeline').forEach((timeline) => {
      gsap.from(timeline.querySelectorAll('.timeline-card'), {
        scrollTrigger: {
          trigger: timeline,
          start: 'top 85%',
        },
        y: 30,
        opacity: 0,
        duration: 1.0,
        ease: 'power2.out',
      });
    });

    /* Experience timeline reveal */
    gsap.utils.toArray('[data-exp]').forEach((card) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
        },
        y: 30,
        opacity: 0,
        duration: 1.0,
        ease: 'power2.out',
      });
    });

    /* Projects grid animation */
    gsap.utils.toArray('.projects-grid').forEach((grid) => {
      gsap.from(grid.querySelectorAll('[data-project]'), {
        scrollTrigger: {
          trigger: grid,
          start: 'top 85%',
        },
        y: 30,
        opacity: 0,
        duration: 1.0,
        stagger: 0.1,
        ease: 'power2.out',
      });
    });

    /* Service cards reveal */
    gsap.from('.service-card', {
      scrollTrigger: {
        trigger: '.services-grid',
        start: 'top 85%',
      },
      y: 30,
      opacity: 0,
      duration: 1.0,
      stagger: 0.1,
      ease: 'power2.out',
    });

    /* Background orbs parallax */
    gsap.to('.glow-orb--1', {
      scrollTrigger: { trigger: 'body', start: 'top top', end: 'bottom bottom', scrub: 2 },
      y: -200,
      x: 100,
    });

    gsap.to('.glow-orb--2', {
      scrollTrigger: { trigger: 'body', start: 'top top', end: 'bottom bottom', scrub: 2 },
      y: 150,
      x: -80,
    });



    /* Mouse parallax on home visual */
    const homeVisual = document.querySelector('.home-visual');
    if (homeVisual) {
      document.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 20;
        const y = (e.clientY / window.innerHeight - 0.5) * 20;
        gsap.to(homeVisual, { x, y, duration: 1, ease: 'power2.out' });
      });
    }


  }

  /* ══════════════════════════════════════
     SKILL ICON INDEPENDENT ANIMATION
     ══════════════════════════════════════ */
  document.querySelectorAll('.skill-icon').forEach((icon) => {
    icon.addEventListener('mouseenter', () => {
      gsap.to(icon, {
        rotation: '+=360',
        scale: 1.3,
        duration: 0.6,
        ease: 'back.out(2)',
      });
    });
    icon.addEventListener('mouseleave', () => {
      gsap.to(icon, { scale: 1, duration: 0.3 });
    });
  });

  /* ══════════════════════════════════════
     LAZY LOADING PLACEHOLDERS
     ══════════════════════════════════════ */
  const lazyObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('loaded');
          lazyObserver.unobserve(entry.target);
        }
      });
    },
    { rootMargin: '100px' }
  );

  document.querySelectorAll('.project-image-placeholder, .image-placeholder').forEach((el) => {
    el.setAttribute('loading', 'lazy');
    lazyObserver.observe(el);
  });

  /* ══════════════════════════════════════
     SMOOTH ANCHOR SCROLL (external links)
     ══════════════════════════════════════ */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        lenis.scrollTo(target, { offset: -80 });
        
        // Close mobile navigation menu if link belongs to it
        if (anchor.classList.contains('nav-link')) {
          navLinks.classList.remove('open');
          navToggle.classList.remove('active');
          navToggle.setAttribute('aria-expanded', 'false');
        }
      }
    });
  });





  /* ══════════════════════════════════════
     PROJECTS FILTERING & LIGHTBOX
     ══════════════════════════════════════ */
  const projectDetails = {
    "Product Design Showcase": {
      category: "Graphic Design",
      desc: "A premium package showcase featuring luxury cosmetics boxes, sustainable paper-bag layouts, and 3D product renders designed to feel elegant and premium.",
      tools: "Adobe Photoshop, Illustrator, Adobe Dimension",
      outcomes: "Designed 12 core product ranges, helping client secure listings in premium department stores."
    },
    "Billboard Design": {
      category: "Graphic Design",
      desc: "A bold, minimalist highway billboard design communicating automotive brand efficiency. Built with clean grids and high contrast to ensure readability at highway speeds.",
      tools: "Adobe Illustrator, Photoshop",
      outcomes: "Boosted brand recall rates by 22% during regional highway campaigns."
    },
    "Medical Branding": {
      category: "Graphic Design",
      desc: "A complete identity refresh for a pharmaceutical startup. Conveys high safety standards, scientific precision, and trustworthiness using a balanced clinical palette.",
      tools: "Adobe Illustrator, InDesign, Figma",
      outcomes: "Delivered 40+ branded assets including stationery, packaging, and digital guides."
    },
    "Gaming Thumbnails": {
      category: "Graphic Design",
      desc: "Vibrant high-contrast thumbnails optimizing click-through rates. Utilizes gaming neon highlights, custom game character cutouts, and readable 3D text layouts.",
      tools: "Adobe Photoshop, Wacom Tablet",
      outcomes: "Increased click-through rate (CTR) by an average of 4.2% on gaming channels."
    },

    "Sales Performance Dashboard": {
      category: "Data Analysis",
      desc: "Interactive business intelligence sales performance dashboard analyzing 43M in total revenue and 6K quantity across category lines. Modeled top 10 customers dynamics and state-by-state demand distribution.",
      tools: "Power BI, Microsoft Excel, Data Modeling, DAX Queries",
      outcomes: "Delivered 100% data visibility on sales vs. targets ($43M vs $44M), highlighting electronics & clothing as dominant category drivers."
    }
  };

  // Projects Filters
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('[data-project]');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', function () {
      if (this.classList.contains('active')) return;
      filterBtns.forEach((b) => b.classList.remove('active'));
      this.classList.add('active');

      const targetFilter = this.getAttribute('data-filter');
      const tl = gsap.timeline();

      // Fade out current visible cards
      tl.to(projectCards, { 
        opacity: 0, 
        scale: 0.9, 
        y: 15, 
        duration: 0.25, 
        stagger: 0.03, 
        onComplete: () => {
          projectCards.forEach((card) => {
            const cat = card.getAttribute('data-category');
            if (targetFilter === 'all' || cat === targetFilter) {
              card.style.display = 'flex';
            } else {
              card.style.display = 'none';
            }
          });
          ScrollTrigger.refresh();
        }
      });

      // Slide in visible cards dynamically
      tl.to(projectCards, {
        clearProps: "all",
        onStart: () => {
          const visibleCards = Array.from(projectCards).filter(c => c.style.display !== 'none');
          gsap.fromTo(visibleCards, 
            { opacity: 0, scale: 0.9, y: 15 },
            { opacity: 1, scale: 1, y: 0, duration: 0.35, stagger: 0.05, ease: 'power2.out' }
          );
        }
      }, "+=0.05");
    });
  });

  // Lightbox Modal Controller
  const lightbox = document.getElementById('projectLightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCat = document.getElementById('lightboxCat');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxDesc = document.getElementById('lightboxDesc');
  const lightboxTools = document.getElementById('lightboxTools');
  const lightboxOutcomes = document.getElementById('lightboxOutcomes');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxOverlay = document.getElementById('lightboxOverlay');

  function openLightbox(card) {
    const title = card.querySelector('h3').textContent.trim();
    const imgSrc = card.querySelector('img').getAttribute('src');
    const details = projectDetails[title];

    if (!details) return;

    lightboxImg.setAttribute('src', imgSrc);
    lightboxCat.textContent = details.category;
    lightboxTitle.textContent = title;
    lightboxDesc.textContent = details.desc;
    lightboxTools.textContent = details.tools;
    lightboxOutcomes.textContent = details.outcomes;

    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
    
    lenis.stop();
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    
    lenis.start();
    document.body.style.overflow = '';
  }

  projectCards.forEach((card) => {
    card.addEventListener('click', function () {
      openLightbox(this);
    });
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxOverlay) lightboxOverlay.addEventListener('click', closeLightbox);

  /* ══════════════════════════════════════
     INTERACTIVE CONTACT FORM
     ══════════════════════════════════════ */
  const contactForm = document.getElementById('interactiveContactForm');
  const formBody = document.getElementById('formBody');
  const formSuccess = document.getElementById('formSuccess');
  const resetBtn = document.querySelector('.reset-form-btn');

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (contactForm) contactForm.reset();
      if (formSuccess) formSuccess.style.display = 'none';
      if (formBody) {
        formBody.style.display = 'block';
        formBody.classList.add('active');
      }
    });
  }

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const nameInput = document.getElementById('formName');
      const emailInput = document.getElementById('formEmail');
      const phoneInput = document.getElementById('formPhone');
      const msgInput = document.getElementById('formMessage');
      
      let isValid = true;

      [nameInput, emailInput, phoneInput, msgInput].forEach((input) => {
        if (!input) return;
        if (!input.value.trim()) {
          isValid = false;
          input.style.borderColor = 'var(--primary)';
        } else {
          input.style.borderColor = '';
        }
      });

      if (emailInput && emailInput.value.trim()) {
        const pattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
        if (!pattern.test(emailInput.value.trim())) {
          isValid = false;
          emailInput.style.borderColor = 'var(--primary)';
        }
      }

      if (phoneInput && phoneInput.value.trim()) {
        const pattern = /^[0-9+\s\-()]{8,20}$/;
        if (!pattern.test(phoneInput.value.trim())) {
          isValid = false;
          phoneInput.style.borderColor = 'var(--primary)';
        }
      }

      if (isValid) {
        if (formBody) formBody.style.display = 'none';
        if (formSuccess) {
          formSuccess.style.display = 'block';
          const successIcon = formSuccess.querySelector('.success-icon-wrap');
          if (successIcon) {
            successIcon.style.animation = 'none';
            void successIcon.offsetWidth; // Trigger reflow
            successIcon.style.animation = 'successPop 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards';
          }
        }
      }
    });
  }

  /* ── Page Load Animation ── */
  window.addEventListener('load', () => {
    gsap.from('.navbar', { y: -100, opacity: 0, duration: 1, ease: 'power3.out' });
    gsap.from('.home-greeting', { y: 30, opacity: 0, duration: 0.8, delay: 0.3 });
    gsap.from('.home-title', { y: 40, opacity: 0, duration: 1, delay: 0.5 });
    gsap.from('.home-bio', { y: 30, opacity: 0, duration: 0.8, delay: 0.7 });
    gsap.from('.home-actions', { y: 30, opacity: 0, duration: 0.8, delay: 0.9 });
    gsap.from('.social-links', { y: 20, opacity: 0, duration: 0.8, delay: 1.1 });
    gsap.from('.home-visual', { scale: 0.8, opacity: 0, duration: 1.2, delay: 0.4, ease: 'back.out(1.5)' });
  });

  /* ── Back to Top Button Logic ── */
  const backToTopBtn = document.getElementById('backToTop');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    });

    backToTopBtn.addEventListener('click', () => {
      if (typeof lenis !== 'undefined' && lenis) {
        lenis.scrollTo(0);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

})();
