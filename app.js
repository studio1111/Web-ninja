(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const body = document.body;
  const progress = document.querySelector('.progress span');
  const scrollFilm = document.querySelector('.scroll-film');
  const filmLine = document.querySelector('.film-line i');
  const filmCurrent = document.querySelector('.film-current');
  const filmDuration = document.querySelector('.film-duration');
  const menu = document.querySelector('.menu-toggle');
  const links = document.querySelector('.nav-links');
  body.classList.add('js-ready');

  menu?.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', String(open));
    links?.classList.toggle('open', open);
  });
  links?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    links.classList.remove('open');
    menu?.setAttribute('aria-expanded', 'false');
  }));

  const updateProgress = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.width = (max > 0 ? window.scrollY / max * 100 : 0) + '%';
  };
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  // Remote video can fail on restricted networks; retain the poster and readable overlay.
  document.querySelectorAll('video').forEach(video => {
    video.addEventListener('error', () => {
      video.classList.add('media-unavailable');
      if (video.classList.contains('hero-film')) document.querySelector('.hero')?.classList.add('hero-film-unavailable');
    }, { once: true });
  });


  if (reduceMotion || !window.gsap || !window.ScrollTrigger) {
    body.classList.remove('js-ready');
    return;
  }
  gsap.registerPlugin(ScrollTrigger);

  const formatTime = value => {
    if (!Number.isFinite(value)) return '00:00';
    const seconds = Math.max(0, Math.floor(value));
    return String(Math.floor(seconds / 60)).padStart(2, '0') + ':' + String(seconds % 60).padStart(2, '0');
  };
  if (scrollFilm) {
    const filmSection = document.querySelector('.film-scroll');
    const syncFilm = () => {
      const duration = scrollFilm.duration;
      if (!Number.isFinite(duration) || duration <= 0 || scrollFilm.dataset.scrollReady) return;
      scrollFilm.dataset.scrollReady = 'true';
      if (filmDuration) filmDuration.textContent = formatTime(duration);
      gsap.to(scrollFilm, {
        currentTime: duration,
        ease: 'none',
        scrollTrigger: {
          trigger: '.film-scroll',
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.12,
          onUpdate: self => {
            if (filmLine) filmLine.style.width = (self.progress * 100) + '%';
            if (filmCurrent) filmCurrent.textContent = formatTime(scrollFilm.currentTime || duration * self.progress);
          }
        }
      });
      ScrollTrigger.refresh();
    };
    if (scrollFilm.readyState >= 1) syncFilm();
    else scrollFilm.addEventListener('loadedmetadata', syncFilm, { once: true });
    scrollFilm.addEventListener('error', () => document.querySelector('.film-scroll')?.classList.add('film-unavailable'), { once: true });
  }
  gsap.to('.hero-title', { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out', delay: .15 });
  gsap.to('.hero-eyebrow', { opacity: 1, y: 0, duration: .8, ease: 'power3.out', delay: .35 });
  gsap.to('.hero-subtitle', { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: .55 });

  const hero = document.querySelector('.hero');
  gsap.to('.hero-image', {
    scale: 1.16, yPercent: 7, ease: 'none',
    scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 1.25 }
  });
  gsap.to('.hero-title-wrap', {
    yPercent: -28, opacity: 0, filter: 'blur(8px)', ease: 'none',
    scrollTrigger: { trigger: hero, start: 'top top', end: '65% top', scrub: 1.1 }
  });
  gsap.to('.hero-topline, .hero-bottom', {
    opacity: 0, y: -12, ease: 'none',
    scrollTrigger: { trigger: hero, start: 'top top', end: '28% top', scrub: .8 }
  });
  gsap.to('.scroll-word', {
    xPercent: 18, ease: 'none',
    scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 1.5 }
  });

  gsap.from('.story-copy', {
    y: 42, opacity: 0, duration: 1, ease: 'power3.out',
    scrollTrigger: { trigger: '.origins', start: 'top 68%', once: true }
  });
  gsap.from('.mask-stage', {
    y: 55, opacity: 0, duration: 1.2, ease: 'power3.out',
    scrollTrigger: { trigger: '.origins', start: 'top 64%', once: true }
  });
  gsap.to('.mask-illustration', {
    y: -25, rotate: -2, ease: 'none',
    scrollTrigger: { trigger: '.origins', start: 'top bottom', end: 'bottom top', scrub: 1.2 }
  });
  gsap.from('.craft-content', {
    x: -35, opacity: 0, duration: 1, ease: 'power3.out',
    scrollTrigger: { trigger: '.craft-section', start: 'top 65%', once: true }
  });
  gsap.from('.craft-object', {
    x: 35, opacity: 0, duration: 1.2, ease: 'power3.out',
    scrollTrigger: { trigger: '.craft-section', start: 'top 65%', once: true }
  });
  gsap.to('.craft-mask', {
    rotateY: 17, rotateZ: -3, ease: 'none',
    scrollTrigger: { trigger: '.craft-section', start: 'top bottom', end: 'bottom top', scrub: 1.5 }
  });
  gsap.from('.mask-card', {
    y: 40, opacity: 0, duration: .8, stagger: .14, ease: 'power3.out',
    scrollTrigger: { trigger: '.collection-grid', start: 'top 78%', once: true }
  });
  gsap.from('.discover-section h2, .discover-button', {
    y: 28, opacity: 0, duration: 1, stagger: .12, ease: 'power3.out',
    scrollTrigger: { trigger: '.discover-section', start: 'top 70%', once: true }
  });

  // Remove the pre-animation guard only after GSAP has taken control.
  requestAnimationFrame(() => body.classList.remove('js-ready'));
  window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
  if (document.fonts?.ready) document.fonts.ready.then(() => ScrollTrigger.refresh()).catch(() => {});
})();