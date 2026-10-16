/*
 * KAGE — The Art of the Unseen (Japanese Mask Showcase)
 * Subject: A cinematic scroll-driven Japanese mask atelier & ritual showcase.
 * Palette: Obsidian Slate (#111514), Deep Charcoal (#151a18), Bone Ivory (#e8e7dc), Warm Sage Stone (#c7c7b9), Muted Ash (#8e968c) — strictly zero red.
 * Typography: Manrope (display/body), Cormorant Garamond (editorial italic accents), DM Mono (technical & chapter indices).
 * Signature: Close-up masked shinobi gripping katana in a scroll-scrubbed 4K-styled hero film + real-time WebGL 3D sculpted mask that orbits and travels across sections on scroll.
 */
import { useEffect, useRef, useState } from "react";
import "./styles.css";
import Mask3DStage from "./Mask3DStage";

import heroVideoUrl from "./assets/hero-kage.mp4";
import heroPosterUrl from "./assets/hero-samurai.webp";
import maskInariUrl from "./assets/mask-inari-cutout.webp";
import maskInariDepthUrl from "./assets/mask-inari-depth.webp";
import maskOniUrl from "./assets/mask-oni-cutout.webp";
import maskOniDepthUrl from "./assets/mask-oni-depth.webp";
import maskHannyaUrl from "./assets/mask-hannya-cutout.webp";
import maskHannyaDepthUrl from "./assets/mask-hannya-depth.webp";

const ARCHETYPES = [
  {
    id: "inari",
    number: "NO. 001",
    kanji: "稲荷 / INARI",
    title: "The Watcher",
    subtitle: "Quiet intuition. A gaze that sees beyond.",
    wood: "Aged Hinoki Cypress & Brushed Silver Leaf",
    era: "Muromachi Lineage · Kyoto",
    philosophy:
      "Carved with razor-narrow ocular slits that filter glare into moonlit clarity. Worn at threshold rituals where silence speaks louder than command.",
    image: maskInariUrl,
    depth: maskInariDepthUrl,
  },
  {
    id: "oni",
    number: "NO. 002",
    kanji: "鬼 / ONI",
    title: "The Guardian",
    subtitle: "Strength held in stillness. Power without noise.",
    wood: "Charred Keyaki Ash & Patinated Iron Tusk",
    era: "Edo Sanctuary Guard · Nara",
    philosophy:
      "Every gouge of the chisel is left deliberate and raw, turning fierce intimidation into a meditative ward against unseen chaos.",
    image: maskOniUrl,
    depth: maskOniDepthUrl,
  },
  {
    id: "hannya",
    number: "NO. 003",
    kanji: "般若 / HANNYA",
    title: "The Unbound",
    subtitle: "Raw emotion. The beauty of becoming.",
    wood: "Weathered Bone-Ivory Camphor & Sumi Ink",
    era: "Classic Noh Theater · Kanazawa",
    philosophy:
      "Tilted downward, the expression mourns in shadow; tilted upward into the light, it awakens with fierce, untamed resolve.",
    image: maskHannyaUrl,
    depth: maskHannyaDepthUrl,
  },
];

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return "00:00";
  const whole = Math.floor(seconds);
  const mins = String(Math.floor(whole / 60)).padStart(2, "0");
  const secs = String(whole % 60).padStart(2, "0");
  return `${mins}:${secs}`;
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeChapter, setActiveChapter] = useState("top");
  const [selectedArchetypeId, setSelectedArchetypeId] = useState("oni");
  const [isMobile, setIsMobile] = useState(false);

  const [scrollState, setScrollState] = useState({
    pageProgress: 0,
    heroProgress: 0,
    filmProgress: 0,
    travelerOpacity: 0,
    travelerX: 24,
    travelerY: 0,
    travelerScale: 1,
    travelerProgress: 0,
    lightNav: false,
  });

  const heroTrackRef = useRef(null);
  const originsRef = useRef(null);
  const filmTrackRef = useRef(null);
  const craftRef = useRef(null);
  const collectionRef = useRef(null);
  const discoverRef = useRef(null);

  const heroVideoRef = useRef(null);
  const ritualVideoRef = useRef(null);
  const [filmDuration, setFilmDuration] = useState(4.0);

  const selectedArchetype =
    ARCHETYPES.find((a) => a.id === selectedArchetypeId) || ARCHETYPES[1];

  useEffect(() => {
    const checkViewport = () => setIsMobile(window.innerWidth <= 900);
    checkViewport();
    window.addEventListener("resize", checkViewport, { passive: true });
    return () => window.removeEventListener("resize", checkViewport);
  }, []);

  // Close mobile menu on Escape
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // Scroll-linked storytelling engine (Hero video scrub, Ritual film scrub, 3D Mask spatial choreography)
  useEffect(() => {
    let rafId = null;

    const updateScroll = () => {
      const scrollY = window.scrollY;
      const vh = Math.max(1, window.innerHeight);
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - vh);
      const pageProgress = Math.min(1, Math.max(0, scrollY / maxScroll));

      // 1. Hero track progress (0 -> 1 across 250vh)
      let heroProgress = 0;
      if (heroTrackRef.current) {
        const rect = heroTrackRef.current.getBoundingClientRect();
        const travel = Math.max(1, heroTrackRef.current.offsetHeight - vh);
        heroProgress = Math.min(1, Math.max(0, -rect.top / travel));
      }

      // Scrub hero video smoothly with scroll
      const hv = heroVideoRef.current;
      if (hv && Number.isFinite(hv.duration) && hv.duration > 0) {
        const targetTime = heroProgress * (hv.duration - 0.05);
        if (Math.abs(hv.currentTime - targetTime) > 0.03) {
          try {
            hv.currentTime = targetTime;
          } catch {}
        }
      }

      // 2. Ritual film section progress
      let filmProgress = 0;
      if (filmTrackRef.current) {
        const rect = filmTrackRef.current.getBoundingClientRect();
        const travel = Math.max(1, filmTrackRef.current.offsetHeight - vh);
        filmProgress = Math.min(1, Math.max(0, -rect.top / travel));
      }

      const rv = ritualVideoRef.current;
      if (rv && Number.isFinite(rv.duration) && rv.duration > 0) {
        const targetTime = filmProgress * (rv.duration - 0.05);
        if (Math.abs(rv.currentTime - targetTime) > 0.03) {
          try {
            rv.currentTime = targetTime;
          } catch {}
        }
      }

      // 3. Determine active chapter & 3D mask traveler position across sections
      const originsRect = originsRef.current?.getBoundingClientRect();
      const filmRect = filmTrackRef.current?.getBoundingClientRect();
      const craftRect = craftRef.current?.getBoundingClientRect();
      const collectionRect = collectionRef.current?.getBoundingClientRect();
      const discoverRect = discoverRef.current?.getBoundingClientRect();

      let chapter = "top";
      if (discoverRect && discoverRect.top < vh * 0.5) chapter = "discover";
      else if (collectionRect && collectionRect.top < vh * 0.5) chapter = "collection";
      else if (craftRect && craftRect.top < vh * 0.5) chapter = "craft";
      else if (originsRect && originsRect.top < vh * 0.55) chapter = "origins";
      setActiveChapter(chapter);

      const lightNav =
        (craftRect && craftRect.top < 70 && craftRect.bottom > 70) ||
        (discoverRect && discoverRect.top < 70 && discoverRect.bottom > 70);

      // Compute 3D Traveler trajectory from Origins -> Film -> Craftsmanship
      let travelerOpacity = 0;
      let travelerX = 24; // vw offset from center
      let travelerY = 0; // vh offset from center
      let travelerScale = 1;
      let travelerProgress = 0;

      if (originsRect && craftRect && collectionRect) {
        const startY = scrollY + originsRect.top - vh * 0.35;
        const endY = scrollY + craftRect.bottom - vh * 0.45;
        const totalSpan = Math.max(1, endY - startY);
        const rawT = (scrollY - startY) / totalSpan;
        travelerProgress = Math.min(1, Math.max(0, rawT));

        if (rawT > -0.05 && rawT < 1.08) {
          // Fade in entering Origins, stay visible through Film & Craft, fade out entering Collection
          if (rawT < 0.12) {
            travelerOpacity = Math.max(0, Math.min(1, (rawT + 0.05) / 0.17));
          } else if (rawT > 0.88) {
            travelerOpacity = Math.max(0, Math.min(1, (1.08 - rawT) / 0.2));
          } else {
            travelerOpacity = 1;
          }

          // Smooth horizontal S-curve between right stage (Origins), right-center (Film), and right stage (Craft)
          if (travelerProgress < 0.5) {
            const p = travelerProgress * 2;
            travelerX = 22 + Math.sin(p * Math.PI) * 5;
            travelerY = (0.5 - p) * 4;
            travelerScale = 1.0 - Math.sin(p * Math.PI) * 0.06;
          } else {
            const p = (travelerProgress - 0.5) * 2;
            travelerX = 22 - Math.sin(p * Math.PI) * 4;
            travelerY = Math.sin(p * Math.PI) * 3;
            travelerScale = 0.96 + p * 0.06;
          }
        }
      }

      setScrollState({
        pageProgress,
        heroProgress,
        filmProgress,
        travelerOpacity,
        travelerX,
        travelerY,
        travelerScale,
        travelerProgress,
        lightNav: Boolean(lightNav),
      });
    };

    const onScroll = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateScroll);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    updateScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  const {
    pageProgress,
    heroProgress,
    filmProgress,
    travelerOpacity,
    travelerX,
    travelerY,
    travelerScale,
    travelerProgress,
    lightNav,
  } = scrollState;

  // Derived Hero scroll-storytelling transforms
  const titleOpacity = Math.max(0, 1 - heroProgress * 2.1);
  const titleTranslateY = -heroProgress * 110;
  const titleBlur = heroProgress * 12;
  const heroVideoScale = 1.02 + heroProgress * 0.14;

  // Whisper 1 appears between 20% and 58% of hero scroll
  const whisper1Opacity =
    heroProgress > 0.16 && heroProgress < 0.62
      ? Math.sin(((heroProgress - 0.16) / 0.46) * Math.PI)
      : 0;
  // Whisper 2 appears between 52% and 94% of hero scroll
  const whisper2Opacity =
    heroProgress > 0.5 && heroProgress < 0.96
      ? Math.sin(((heroProgress - 0.5) / 0.46) * Math.PI)
      : 0;

  return (
    <div>
      <div className="grain" aria-hidden="true" />
      <div className="progress" aria-hidden="true">
        <span style={{ width: `${(pageProgress * 100).toFixed(1)}%` }} />
      </div>

      {/* Navigation */}
      <header className={`nav ${lightNav ? "nav-light" : ""}`}>
        <a className="wordmark" href="#top" aria-label="KAGE home">
          K<span>A</span>GE<span className="wordmark-dot">.</span>
          <span className="wordmark-kanji">影</span>
        </a>

        <div className="nav-center">
          <span className="status-dot" /> A STUDY IN SHADOW
        </div>

        <button
          type="button"
          className="menu-toggle"
          aria-expanded={menuOpen}
          aria-controls="nav-links"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          <span />
          <span />
          <b>{menuOpen ? "CLOSE" : "MENU"}</b>
        </button>

        <nav
          id="nav-links"
          className={`nav-links ${menuOpen ? "open" : ""}`}
          aria-label="Primary"
        >
          <a
            href="#origins"
            aria-current={activeChapter === "origins" ? "location" : undefined}
            onClick={() => setMenuOpen(false)}
          >
            Origins
          </a>
          <a
            href="#craft"
            aria-current={activeChapter === "craft" ? "location" : undefined}
            onClick={() => setMenuOpen(false)}
          >
            Craft
          </a>
          <a
            href="#collection"
            aria-current={activeChapter === "collection" ? "location" : undefined}
            onClick={() => setMenuOpen(false)}
          >
            Collection
          </a>
          <a
            className="nav-cta"
            href="#discover"
            aria-current={activeChapter === "discover" ? "location" : undefined}
            onClick={() => setMenuOpen(false)}
          >
            Discover <span>↗</span>
          </a>
        </nav>
      </header>

      {/* Desktop Orbiting 3D Mask Traveler that moves between Origins, Film, and Craftsmanship */}
      {!isMobile && (
        <div
          className={`floating-3d-traveler ${
            travelerOpacity > 0.25 ? "is-interactive" : ""
          }`}
          style={{
            opacity: travelerOpacity,
            transform: `translate3d(calc(-50% + ${travelerX}vw), calc(-50% + ${travelerY}vh), 0) scale(${travelerScale})`,
          }}
        >
          <Mask3DStage
            textureUrl={selectedArchetype.image}
            depthUrl={selectedArchetype.depth}
            scrollProgress={travelerProgress}
            chapter={activeChapter}
            activeArchetype={selectedArchetype.id}
            interactive={true}
          />
          <div className="traveler-hud">
            3D SCULPT · {selectedArchetype.kanji} · DRAG TO ORBIT
          </div>
        </div>
      )}

      <main id="top">
        {/* =====================================================
            HERO SECTION: Pinned 4K-styled Video + Scroll Storytelling
           ===================================================== */}
        <div ref={heroTrackRef} className="hero-scroll-track">
          <section className="hero" aria-label="KAGE introduction">
            <video
              ref={heroVideoRef}
              className="hero-film"
              src={heroVideoUrl}
              poster={heroPosterUrl}
              muted
              playsInline
              loop
              autoPlay
              preload="auto"
              style={{
                transform: `scale(${heroVideoScale.toFixed(3)})`,
              }}
              aria-hidden="true"
            />
            <div
              className="hero-image"
              style={{
                backgroundImage: `url(${heroPosterUrl})`,
                opacity: 0.25,
                transform: `scale(${heroVideoScale.toFixed(3)})`,
              }}
              aria-hidden="true"
            />
            <div className="hero-vignette" aria-hidden="true" />

            <div
              className="hero-topline mono"
              style={{ opacity: Math.max(0, 1 - heroProgress * 2.5) }}
            >
              <span>伝統と影 / TRADITION &amp; SHADOW</span>
              <span>EST. IN SILENCE — VOL. 01</span>
            </div>

            <div
              className="hero-title-wrap"
              style={{
                opacity: titleOpacity,
                transform: `translate3d(0, ${titleTranslateY.toFixed(1)}px, 0)`,
                filter: `blur(${titleBlur.toFixed(1)}px)`,
              }}
            >
              <p className="eyebrow hero-eyebrow">
                <span className="line" /> THE ART OF THE UNSEEN
              </p>
              <h1 className="hero-title" aria-label="KAGE">
                KAGE
              </h1>
              <p className="hero-subtitle">
                A face can hide a thousand stories.
                <br />
                <em>A mask lets them breathe.</em>
              </p>
            </div>

            {/* Scroll Storytelling Callout 01 */}
            <div
              className="hero-story-whisper whisper-left"
              style={{
                opacity: whisper1Opacity,
                transform: `translate3d(0, ${(1 - whisper1Opacity) * 24}px, 0)`,
              }}
            >
              <span className="whisper-tag">01 // THE THRESHOLD</span>
              <h3>Carved from Moonlit Ash</h3>
              <p>
                Every contour is angled to catch twilight and cast deliberate shadow across the eyes.
              </p>
            </div>

            {/* Scroll Storytelling Callout 02 */}
            <div
              className="hero-story-whisper whisper-right"
              style={{
                opacity: whisper2Opacity,
                transform: `translate3d(0, ${(1 - whisper2Opacity) * 24}px, 0)`,
              }}
            >
              <span className="whisper-tag">02 // TEMPERED STEEL &amp; SPIRIT</span>
              <h3>Discipline in Stillness</h3>
              <p>
                Held with unwavering grip, blade and mask become a single vessel of presence before a word is spoken.
              </p>
            </div>

            <div className="hero-bottom">
              <a
                className="round-link"
                href="#origins"
                aria-label="Scroll to explore"
              >
                <span>↓</span>
              </a>
              <p className="hero-note mono">
                SCROLL TO ENTER
                <br />
                <span>THE WORLD BEHIND THE MASK</span>
              </p>
              <div className="hero-index mono">
                <span>01</span>
                <i>
                  <b style={{ width: `${(heroProgress * 100).toFixed(0)}%` }} />
                </i>
                <span>04</span>
              </div>
            </div>

            <div
              className="scroll-word mono"
              style={{
                transform: `translate3d(${(heroProgress * 14).toFixed(1)}%, 0, 0)`,
              }}
              aria-hidden="true"
            >
              KAGE — KAGE — KAGE —
            </div>
          </section>
        </div>

        {/* =====================================================
            SECTION 01: ORIGINS
           ===================================================== */}
        <section
          id="origins"
          ref={originsRef}
          className="section-grid"
        >
          <div className="section-number mono">01 / ORIGINS</div>

          <div className="story-copy">
            <p className="eyebrow">BEFORE THE WORDS</p>
            <h2>
              Every shadow
              <br />
              has <em>an origin.</em>
            </h2>
            <p className="body-copy">
              Long before a face became a performance, it became a vessel. Across
              generations, Japanese masks carried the weight of spirits, stories,
              and transformations. They were never merely worn. They were
              awakened.
            </p>

            <div className="origins-pillars">
              <div>
                <strong>神楽 / KAGURA</strong>
                <span>Sacred nocturnal rites of transformation and ancestral presence.</span>
              </div>
              <div>
                <strong>能面 / NOH-MEN</strong>
                <span>Micro-expressions unlocked by a two-degree tilt of the chin.</span>
              </div>
            </div>

            <a className="text-link" href="#craft">
              Discover the origins <span>↗</span>
            </a>
          </div>

          <div className="mask-stage">
            <div className="orbit" />
            <div className="orbit orbit-b" />

            <div className="stage-3d-slot">
              {isMobile ? (
                <Mask3DStage
                  textureUrl={selectedArchetype.image}
                  depthUrl={selectedArchetype.depth}
                  scrollProgress={pageProgress}
                  chapter="origins"
                  activeArchetype={selectedArchetype.id}
                  interactive={true}
                />
              ) : (
                <img
                  className="mask-photo"
                  src={selectedArchetype.image}
                  alt={selectedArchetype.title}
                  style={{ opacity: travelerOpacity > 0.2 ? 0.12 : 0.9 }}
                />
              )}
            </div>

            <p className="stage-caption mono">
              面 / OMOTE <span>— THE OUTER FACE</span>
            </p>
          </div>

          <div className="side-caption mono">A VESSEL FOR THE INVISIBLE</div>
        </section>

        {/* =====================================================
            SCROLL-CONTROLLED RITUAL FILM SECTION
           ===================================================== */}
        <section
          ref={filmTrackRef}
          className="film-scroll"
          aria-label="A scroll-controlled film about traditional Japanese masks"
        >
          <div className="film-sticky">
            <video
              ref={ritualVideoRef}
              className="scroll-film"
              src={heroVideoUrl}
              poster={heroPosterUrl}
              muted
              playsInline
              preload="auto"
              onLoadedMetadata={(e) => {
                if (Number.isFinite(e.currentTarget.duration)) {
                  setFilmDuration(e.currentTarget.duration);
                }
              }}
            />
            <div className="film-shade" />

            <div className="film-copy">
              <p className="eyebrow mono">A LIVING TRADITION / 02</p>
              <h2>
                Stillness
                <br />
                becomes <em>motion.</em>
              </h2>
              <p>
                Scroll to move through the ritual. Every frame follows your
                journey down the page while the 3D vessel orbits in shadow.
              </p>

              <div className="film-annotations">
                <span className={`film-chip ${filmProgress < 0.34 ? "active" : ""}`}>
                  I · THE GAZE
                </span>
                <span
                  className={`film-chip ${
                    filmProgress >= 0.34 && filmProgress < 0.68 ? "active" : ""
                  }`}
                >
                  II · THE DRAWN STEEL
                </span>
                <span className={`film-chip ${filmProgress >= 0.68 ? "active" : ""}`}>
                  III · THE AWAKENING
                </span>
              </div>

              <span className="film-hint mono">
                SCROLL TO CONTROL THE FILM ↓
              </span>
            </div>

            <div className="film-counter mono">
              <span>
                {formatTime(filmProgress * filmDuration)}
              </span>
              <span className="film-line">
                <i style={{ width: `${(filmProgress * 100).toFixed(1)}%` }} />
              </span>
              <span>{formatTime(filmDuration)}</span>
            </div>
          </div>
        </section>

        {/* =====================================================
            SECTION 02: CRAFTSMANSHIP
           ===================================================== */}
        <section id="craft" ref={craftRef} className="craft-section">
          <div className="craft-backdrop" aria-hidden="true" />
          <div className="section-number mono">02 / CRAFTSMANSHIP</div>

          <div className="craft-content">
            <p className="eyebrow">MADE BY HAND. KEPT BY TIME.</p>
            <h2>
              Patience is
              <br />
              the <em>finest tool.</em>
            </h2>
            <p className="body-copy">
              Carved from seasoned hinoki and ash wood, layered with crushed
              oyster-shell胡粉 (gofun) mineral pigments, and finished by hands
              that understand restraint. Every contour holds a decision. Every
              imperfection remembers the maker.
            </p>

            <div className="craft-stats">
              <div>
                <strong>01</strong>
                <span>
                  ONE BLOCK
                  <br />
                  OF WOOD
                </span>
              </div>
              <div>
                <strong>∞</strong>
                <span>
                  WAYS TO
                  <br />
                  TRANSFORM
                </span>
              </div>
              <div>
                <strong>100%</strong>
                <span>
                  MADE WITH
                  <br />
                  INTENTION
                </span>
              </div>
            </div>
          </div>

          <div className="craft-object">
            <div className="craft-ring" />
            <div className="craft-ring ring-2" />
            {isMobile ? (
              <div className="stage-3d-slot">
                <Mask3DStage
                  textureUrl={maskInariUrl}
                  depthUrl={maskInariDepthUrl}
                  scrollProgress={pageProgress}
                  chapter="craft"
                  activeArchetype="inari"
                  interactive={true}
                />
              </div>
            ) : (
              <img
                className="mask-photo"
                src={selectedArchetype.image}
                alt={selectedArchetype.title}
                style={{ opacity: travelerOpacity > 0.2 ? 0.14 : 0.92 }}
              />
            )}
          </div>

          <div className="craft-bottom mono">
            <span>01 — CARVE (木取り)</span>
            <span>02 — LACQUER (漆塗り)</span>
            <span>03 — BECOME (魂入れ)</span>
          </div>
        </section>

        {/* =====================================================
            SECTION 03: THE COLLECTION
           ===================================================== */}
        <section
          id="collection"
          ref={collectionRef}
          className="collection-section"
        >
          <div className="collection-heading">
            <div>
              <div className="section-number mono">03 / THE COLLECTION</div>
              <p className="eyebrow">A GALLERY OF IDENTITIES</p>
              <h2>
                Choose your <em>shadow.</em>
              </h2>
            </div>
            <p className="collection-intro">
              Three archetypes. Three ways to step beyond the self. Select any
              mask below to inspect its 3D sculptural relief and lineage.
            </p>
          </div>

          <div className="collection-grid">
            {ARCHETYPES.map((item) => {
              const isSelected = item.id === selectedArchetypeId;
              return (
                <article
                  key={item.id}
                  className={`mask-card ${
                    isSelected ? "is-selected" : ""
                  }`}
                  onClick={() => setSelectedArchetypeId(item.id)}
                  role="button"
                  tabIndex={0}
                  aria-pressed={isSelected}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelectedArchetypeId(item.id);
                    }
                  }}
                >
                  <div className="card-top mono">
                    <span>{item.number}</span>
                    <span>{item.kanji}</span>
                  </div>

                  <div className="card-art">
                    <img
                      className="card-photo"
                      src={item.image}
                      alt={`${item.title} — ${item.kanji}`}
                      loading="lazy"
                    />
                  </div>

                  <div className="card-bottom">
                    <h3>{item.title}</h3>
                    <p>{item.subtitle}</p>
                    <span className="card-arrow">↗</span>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Interactive 3D & Lineage Inspector for Selected Collection Archetype */}
          <div className="archetype-inspector">
            <div>
              <p className="eyebrow mono">
                SELECTED ARCHETYPE // {selectedArchetype.number} ·{" "}
                {selectedArchetype.kanji}
              </p>
              <h3
                style={{
                  fontSize: "clamp(28px, 3.4vw, 44px)",
                  fontWeight: 400,
                  margin: "0 0 14px",
                  letterSpacing: "-0.04em",
                }}
              >
                {selectedArchetype.title}
              </h3>
              <p className="body-copy" style={{ maxWidth: "540px" }}>
                {selectedArchetype.philosophy}
              </p>

              <div className="inspector-meta">
                <div>
                  <span>MATERIAL &amp; PIGMENT</span>
                  <strong>{selectedArchetype.wood}</strong>
                </div>
                <div>
                  <span>PROVENANCE</span>
                  <strong>{selectedArchetype.era}</strong>
                </div>
              </div>
            </div>

            <div
              style={{
                height: "360px",
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Mask3DStage
                textureUrl={selectedArchetype.image}
                depthUrl={selectedArchetype.depth}
                scrollProgress={pageProgress}
                chapter="collection"
                activeArchetype={selectedArchetype.id}
                interactive={true}
              />
              <div className="traveler-hud">
                INTERACTIVE 3D RELIEF · DRAG TO ROTATE
              </div>
            </div>
          </div>

          <p className="collection-foot mono">
            <span>HAND-CARVED IDEAS / ENDLESS INTERPRETATIONS</span>
            <span>03 OBJECTS — 01 PHILOSOPHY</span>
          </p>
        </section>

        {/* =====================================================
            SECTION 04: DISCOVER CTA & FOOTER
           ===================================================== */}
        <section id="discover" ref={discoverRef} className="discover-section">
          <div className="discover-halo" aria-hidden="true" />
          <p className="eyebrow">THE NEXT FACE IS YOURS</p>
          <h2>
            What will you
            <br />
            <em>become?</em>
          </h2>
          <a className="discover-button" href="#collection">
            <span>Discover your mask</span>
            <b>↗</b>
          </a>
          <p className="discover-note mono">
            THE STORY DOESN&apos;T END AT THE SURFACE.
          </p>
        </section>
      </main>

      <footer className="footer">
        <a className="wordmark" href="#top">
          K<span>A</span>GE<span className="wordmark-dot">.</span>
        </a>
        <span className="footer-copy mono">A STUDY IN SHADOW — 2026</span>
        <a className="back-top mono" href="#top">
          BACK TO THE SURFACE ↑
        </a>
      </footer>
    </div>
  );
}
