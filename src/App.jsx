/* KAGE: a moonlit Japanese mask atelier. */
import { useEffect, useRef, useState } from 'react';
import './styles.css';

const hero = 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=2200&q=85';
const quietMask = 'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=1000&q=85';
const hannya = 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=1000&q=85';
const signature = 'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=1200&q=85';

const stories = [
  { eyebrow:'01 / ORIGINS', title:'Before the face, there was the silence.', body:'Masks began as a way to step outside the self. KAGE keeps that threshold intact: one breath, one gaze, a different presence.', image:quietMask, align:'left' },
  { eyebrow:'02 / CRAFTSMANSHIP', title:'Made slowly. Worn briefly. Remembered forever.', body:'Wood, lacquer, mineral pigment. Every plane is cut to catch a little less light, and hold it a little longer.', image:hannya, align:'right' },
  { eyebrow:'03 / THE COLLECTION', title:'A private language of shadow and form.', body:'Eight studies in restraint. Each one carries a different weather system behind the eyes.', image:signature, align:'left' }
];

function App(){
  const [scroll, setScroll] = useState(0);
  const [menu, setMenu] = useState(false);
  const [dragRotation, setDragRotation] = useState(0);
  const dragStart = useRef(null);
  useEffect(()=>{
    const onScroll=()=>setScroll(window.scrollY);
    window.addEventListener('scroll',onScroll,{passive:true}); onScroll();
    return()=>window.removeEventListener('scroll',onScroll);
  },[]);
  const heroProgress = Math.min(scroll / Math.max(1, window.innerHeight*1.05), 1);
  const storyProgress = Math.min(Math.max((scroll-window.innerHeight*.72)/(window.innerHeight*3.1),0),1);
  const maskStyle = { transform:`translate3d(${storyProgress*38-19}vw, ${storyProgress*20-10}vh, 0) rotate(${storyProgress*20-10}deg) scale(${1.02-storyProgress*.18}) rotateY(${dragRotation + storyProgress*34}deg)` };
  const startDrag = (e) => { dragStart.current = e.clientX; e.currentTarget.setPointerCapture?.(e.pointerId); };
  const moveDrag = (e) => { if (dragStart.current !== null) setDragRotation((dragStart.current - e.clientX) * .42); };
  const endDrag = () => { dragStart.current = null; };
  const jump=(id)=>{document.getElementById(id)?.scrollIntoView({behavior:'smooth'}); setMenu(false)};
  return <main>
    <header className={scroll>40?'header header-away':'header'}>
      <button className="wordmark" onClick={()=>jump('top')}>KAGE<span>影</span></button>
      <nav className={menu?'nav open':'nav'}>
        <button onClick={()=>jump('origins')}>Origins</button><button onClick={()=>jump('craft')}>Craftsmanship</button><button onClick={()=>jump('collection')}>Collection</button>
      </nav>
      <button className="menu" onClick={()=>setMenu(!menu)} aria-label="Toggle menu"><i></i><i></i></button>
    </header>
    <section id="top" className="hero" style={{'--heroP':heroProgress}}>
      <div className="hero-media"><img className="hero-poster hero-poster-back" src={hero} alt="" /><img className="hero-poster" src={hero} alt="Masked figure in a moonlit Japanese courtyard" /></div>
      <div className="hero-vignette"></div><div className="hero-grid"></div>
      <div className="hero-content"><p className="kicker">A STUDY IN PRESENCE <span>•</span> 2026</p><h1>KAGE</h1><p className="hero-sub">The shape of what remains unseen.</p><div className="hero-actions"><button className="button button-light" onClick={()=>jump('collection')}>Enter the collection <span>↘</span></button><button className="button button-ghost" onClick={()=>jump('origins')}>Read the story</button></div></div>
      <div className="scroll-cue"><span>SCROLL TO REVEAL</span><b></b></div><div className="hero-note">01 — 03<br/><em>THE MASK AS<br/>A SECOND SKIN</em></div>
    </section>
    <section className="story" id="origins"><div className="story-backdrop">KAGE</div><div className="story-intro"><p className="kicker">THE ATELIER / 01</p><p>Three movements.<br/><em>One continuous form.</em></p></div>
      <div className="mask-stage" style={{opacity: storyProgress === 0 ? 0 : 1, visibility: storyProgress === 0 ? 'hidden' : 'visible'}} onPointerDown={startDrag} onPointerMove={moveDrag} onPointerUp={endDrag} onPointerCancel={endDrag} aria-label="Drag to rotate the mask">
        <div className="mask-depth depth-3"><img src={signature} alt="" /></div><div className="mask-depth depth-2"><img src={signature} alt="" /></div><div className="mask-depth depth-1"><img src={signature} style={maskStyle} alt="Signature KAGE mask, drag to rotate" /></div><span className="drag-hint">DRAG TO ROTATE</span>
      </div>
      {stories.map((s,i)=><article id={i===1?'craft':i===2?'collection':undefined} className={`story-card ${s.align}`} key={s.eyebrow}><div className="story-image"><img src={s.image} alt="Japanese mask study" /></div><div className="story-copy"><p className="kicker">{s.eyebrow}</p><h2>{s.title}</h2><p>{s.body}</p><span className="story-index">0{i+1}</span></div></article>)}
    </section>
    <section className="cta" id="discover"><div className="cta-orbit"></div><p className="kicker">THE NEXT FACE IS YOURS</p><h2>Discover<br/><em>your mask.</em></h2><button className="button button-light" onClick={()=>alert('The private viewing room opens soon.')}>Request a private viewing <span>↗</span></button></section>
    <footer><span>KAGE / 影</span><span>Objects for the unseen self</span><span>© 2026</span></footer>
  </main>
}
export default App;
