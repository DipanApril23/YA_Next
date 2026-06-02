"use client";

import { useState, useRef, useCallback } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Image from "next/image";

const SERVICES = [
  { icon: "✦", label: "AI Solutions & Automation", color: "#06b6d4" },
  { icon: "◈", label: "Web & App Development",      color: "#3b82f6" },
  { icon: "▲", label: "Digital Marketing & SEO",    color: "#a855f7" },
  { icon: "⟳", label: "Digital Transformation",     color: "#ec4899" },
  { icon: "◉", label: "Cloud & Infrastructure",     color: "#22d3ee" },
];

const FlipCard = ({
  frontLogo    = "https://youngarchitects.in/assets/image/logo.webp",
  backLogo     = "https://youngarchitects.in/assets/image/logo2.webp",
  qrCode       = "https://youngarchitects.in/assets/image/qr.webp",
  phoneNumbers = ["+91 9883952010", "+91 9804569051"],
  email        = "yafoundations@gmail.com",
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const tiltRef = useRef(null);

  /* ── Mouse-tracking tilt ────────────────────────────────────── */
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const rotateX = useSpring(useTransform(rawY, [-0.5, 0.5], [12, -12]), {
    stiffness: 160, damping: 28,
  });
  const rotateY = useSpring(useTransform(rawX, [-0.5, 0.5], [-12, 12]), {
    stiffness: 160, damping: 28,
  });

  const onMouseMove = useCallback((e) => {
    if (!tiltRef.current) return;
    const r = tiltRef.current.getBoundingClientRect();
    rawX.set((e.clientX - r.left) / r.width  - 0.5);
    rawY.set((e.clientY - r.top)  / r.height - 0.5);
  }, [rawX, rawY]);

  const onMouseLeave = useCallback(() => {
    rawX.set(0);
    rawY.set(0);
  }, [rawX, rawY]);

  const handleFlip = () => {
    if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate(50);
    setIsFlipped((v) => !v);
  };

  /* ── Shared face style ──────────────────────────────────────── */
  const faceBase = {
    position: "absolute",
    inset: 0,
    borderRadius: "48px",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "14px 22px",
    textAlign: "center",
    /* CRITICAL — must be on every face */
    WebkitBackfaceVisibility: "hidden",
    backfaceVisibility: "hidden",
    background: "linear-gradient(158deg, rgba(14,14,26,0.97) 0%, rgba(7,7,18,0.99) 100%)",
    border: "1px solid rgba(255,255,255,0.07)",
    boxShadow:
      "inset 0 1px 0 rgba(255,255,255,0.10), inset 0 -1px 0 rgba(0,0,0,0.6), 0 50px 100px rgba(0,0,0,0.85)",
  };

  return (
    <>
      {/* Keyframes */}
      <style>{`
        @keyframes fcGlow   { 0%,100%{opacity:.32;transform:scale(1)}  50%{opacity:.55;transform:scale(1.04)} }
        @keyframes fcRing1  { from{transform:rotate(0deg)}   to{transform:rotate(360deg)}  }
        @keyframes fcRing2  { from{transform:rotate(360deg)} to{transform:rotate(0deg)}    }
        @keyframes fcShim   { 0%{background-position:200% 50%} 100%{background-position:-200% 50%} }
        @keyframes fcPulse  { 0%,100%{opacity:.45;transform:scale(1)} 50%{opacity:1;transform:scale(1.55)} }
        @keyframes fcFlipHint { 0%,100%{opacity:.5;transform:translateY(0)}  50%{opacity:.9;transform:translateY(-3px)} }
      `}</style>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>

        {/* ── Glow + rings wrapper ─────────────────────────────── */}
        <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>

          {/* Ambient glow */}
          <div aria-hidden style={{
            position: "absolute", inset: -32, borderRadius: 80, pointerEvents: "none",
            background: "radial-gradient(ellipse at 50% 40%, rgba(6,182,212,.18) 0%, rgba(168,85,247,.12) 55%, transparent 75%)",
            filter: "blur(32px)",
            animation: "fcGlow 5s ease-in-out infinite",
          }} />

          {/* Outer ring */}
          <div aria-hidden style={{
            position: "absolute", inset: -26, borderRadius: 76, pointerEvents: "none",
            background: "linear-gradient(135deg, #06b6d4 0%, transparent 40%, #a855f7 60%, transparent 80%, #06b6d4 100%)",
            WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor", maskComposite: "exclude",
            padding: 1, opacity: 0.42,
            animation: "fcRing1 9s linear infinite",
          }} />

          {/* Inner ring */}
          <div aria-hidden style={{
            position: "absolute", inset: -10, borderRadius: 62, pointerEvents: "none",
            background: "linear-gradient(135deg, transparent 25%, #ec4899 50%, transparent 70%, #3b82f6 90%)",
            WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor", maskComposite: "exclude",
            padding: 1, opacity: 0.28,
            animation: "fcRing2 13s linear infinite",
          }} />

          <motion.div
            ref={tiltRef}
            onClick={handleFlip}
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
            style={{
              rotateX,
              rotateY,
              transformPerspective: 1100,
              transformStyle: "preserve-3d",
              cursor: "pointer",
              width:  "clamp(295px, 33vw, 345px)",
              height: "clamp(530px, 60vw, 610px)",
            }}
            animate={{
              y:      [0, -13, 0],
              rotate: [-0.4, 0.4, -0.4],
            }}
            transition={{
              y:      { duration: 6, repeat: Infinity, ease: "easeInOut" },
              rotate: { duration: 7, repeat: Infinity, ease: "easeInOut" },
            }}
          >
            {/* ── Flip container ────────────────────────────── */}
            <motion.div
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
              style={{
                position: "relative",
                width: "100%", height: "100%",
                transformStyle: "preserve-3d",
              }}
            >

              {/* ══════════ FRONT FACE ══════════ */}
              <div style={faceBase}>

                {/* Top edge light */}
                <div aria-hidden style={{
                  position:"absolute", top:0, left:"10%", right:"10%", height:1,
                  background:"linear-gradient(90deg,transparent,rgba(6,182,212,.7),rgba(168,85,247,.5),transparent)",
                }} />

                {/* Holographic shimmer */}
                <div aria-hidden style={{
                  position:"absolute", inset:0, borderRadius:48, pointerEvents:"none",
                  background:"linear-gradient(125deg,transparent 25%,rgba(6,182,212,.06) 50%,transparent 75%)",
                  backgroundSize:"300% 300%",
                  animation:"fcShim 5s linear infinite",
                }} />

                {/* FIXED Logo circle container */}
                <div style={{
                  position: "relative",
                  flexShrink: 0,
                  width: "82%",
                  aspectRatio: "1 / 1", 
                  borderRadius: "50%",
                  overflow: "hidden",
                  background: "radial-gradient(circle, rgba(6,182,212,.07) 0%, transparent 70%)",
                  boxShadow: "-6px -10px 12px rgba(255,255,255,.055), 6px 10px 14px rgba(0,0,0,.6), 0 0 50px rgba(6,182,212,.08), inset 0 0 40px rgba(0,0,0,.5)",
                  border: "1px solid rgba(255,255,255,.06)",
                }}>
                  <Image 
                    src={frontLogo} 
                    alt="Young Architects" 
                    fill 
                    className="object-cover" 
                    unoptimized 
                  />
                </div>

                {/* Contact */}
                <div style={{ width:"100%", display:"flex", flexDirection:"column", gap:10 }}>
                  <div style={{ height:1, background:"linear-gradient(90deg,transparent,rgba(6,182,212,.35),transparent)", margin:"0 18%" }} />
                  {phoneNumbers.map((ph, i) => (
                    <p key={i} style={{ fontSize:"1.05rem", fontWeight:500, letterSpacing:"0.04em", color:"rgba(255,255,255,.88)", margin:0 }}>{ph}</p>
                  ))}
                  <p style={{ fontSize:"0.88rem", color:"rgba(255,255,255,.5)", margin:0 }}>{email}</p>
                </div>

                {/* QR */}
                <div style={{
                  position:"relative", flexShrink:0,
                  width:144, height:144, borderRadius:14, overflow:"hidden",
                  boxShadow:"0 0 30px rgba(236,72,153,.22), 0 0 0 1px rgba(236,72,153,.18)",
                  background:"rgba(236,72,153,.04)",
                }}>
                  <Image src={qrCode} alt="QR Code" fill className="object-cover" unoptimized />
                  {[
                    {top:5,left:5,  borderTop:"2px solid rgba(236,72,153,.7)", borderLeft:"2px solid rgba(236,72,153,.7)"},
                    {top:5,right:5, borderTop:"2px solid rgba(236,72,153,.7)", borderRight:"2px solid rgba(236,72,153,.7)"},
                    {bottom:5,left:5,  borderBottom:"2px solid rgba(236,72,153,.7)", borderLeft:"2px solid rgba(236,72,153,.7)"},
                    {bottom:5,right:5, borderBottom:"2px solid rgba(236,72,153,.7)", borderRight:"2px solid rgba(236,72,153,.7)"},
                  ].map((s, i) => (
                    <span key={i} aria-hidden style={{ position:"absolute", width:12, height:12, borderRadius:3, ...s }} />
                  ))}
                </div>

                {/* Bottom edge */}
                <div aria-hidden style={{
                  position:"absolute", bottom:0, left:"12%", right:"12%", height:1,
                  background:"linear-gradient(90deg,transparent,rgba(168,85,247,.4),transparent)",
                }} />
              </div>

              {/* ══════════ BACK FACE ══════════ */}
              <div style={{ ...faceBase, transform: "rotateY(180deg)" }}>

                {/* Top edge */}
                <div aria-hidden style={{
                  position:"absolute", top:0, left:"10%", right:"10%", height:1,
                  background:"linear-gradient(90deg,transparent,rgba(168,85,247,.6),transparent)",
                }} />

                {/* Shimmer */}
                <div aria-hidden style={{
                  position:"absolute", inset:0, borderRadius:48, pointerEvents:"none",
                  background:"linear-gradient(125deg,transparent 25%,rgba(168,85,247,.05) 50%,transparent 75%)",
                  backgroundSize:"300% 300%",
                  animation:"fcShim 6s linear infinite reverse",
                }} />

                {/* FIXED Back logo container */}
                <div style={{
                  position: "relative",
                  flexShrink: 0,
                  width: "78%",
                  aspectRatio: "1 / 1",
                  borderRadius: "50%",
                  overflow: "hidden",
                  background: "radial-gradient(circle, rgba(168,85,247,.07) 0%, transparent 70%)",
                  boxShadow: "0 0 50px rgba(168,85,247,.1), inset 0 0 40px rgba(0,0,0,.4)",
                  border: "1px solid rgba(168,85,247,.10)",
                }}>
                  <Image 
                    src={backLogo} 
                    alt="Young Architects" 
                    fill 
                    className="object-cover" 
                    unoptimized 
                  />
                </div>

                {/* Services header */}
                <div style={{ width:"100%", textAlign:"center", marginTop:6 }}>
                  <p style={{ fontSize:"0.68rem", letterSpacing:"0.22em", textTransform:"uppercase", color:"rgba(168,85,247,.75)", fontWeight:600, margin:0 }}>
                    Our Services
                  </p>
                  <div style={{ height:1, background:"linear-gradient(90deg,transparent,rgba(168,85,247,.35),transparent)", margin:"8px 18% 0" }} />
                </div>

                {/* Services list */}
                <div style={{ width:"100%", display:"flex", flexDirection:"column", gap:9 }}>
                  {SERVICES.map((svc, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ x: 6, scale: 1.02 }}
                      transition={{ type:"spring", stiffness:400, damping:28 }}
                      style={{
                        display:"flex", alignItems:"center", gap:10,
                        borderRadius:12, padding:"10px 13px",
                        background:`linear-gradient(100deg,${svc.color}12 0%,transparent 100%)`,
                        border:`1px solid ${svc.color}22`,
                      }}
                    >
                      <span style={{
                        width:26, height:26, borderRadius:"50%", flexShrink:0,
                        display:"flex", alignItems:"center", justifyContent:"center",
                        background:`${svc.color}20`, color:svc.color, fontSize:"0.75rem",
                      }}>{svc.icon}</span>
                      <span style={{ flex:1, textAlign:"left", fontSize:"0.83rem", fontWeight:500, color:"rgba(255,255,255,.82)" }}>
                        {svc.label}
                      </span>
                      <span style={{
                        width:6, height:6, borderRadius:"50%", flexShrink:0,
                        background:svc.color, boxShadow:`0 0 7px ${svc.color}`,
                        animation:`fcPulse ${2 + i * 0.3}s ease-in-out infinite`,
                      }} />
                    </motion.div>
                  ))}
                </div>

                {/* Bottom edge */}
                <div aria-hidden style={{
                  position:"absolute", bottom:0, left:"12%", right:"12%", height:1,
                  background:"linear-gradient(90deg,transparent,rgba(6,182,212,.4),transparent)",
                }} />
              </div>

            </motion.div>
          </motion.div>
        </div>

        {/* ── "Tap to flip" indicator ─────────────────────────── */}
        <motion.button
          onClick={handleFlip}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.6 }}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.95 }}
          style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "7px 18px", borderRadius: 999,
            border: "1px solid rgba(255,255,255,0.1)",
            background: "rgba(255,255,255,0.04)",
            backdropFilter: "blur(8px)",
            cursor: "pointer", outline: "none",
            animation: "fcFlipHint 2.8s ease-in-out infinite",
          }}
          aria-label="Click to flip card"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(6,182,212,0.85)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
            <path d="M21 3v5h-5"/>
            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
            <path d="M8 16H3v5"/>
          </svg>
          <span style={{
            fontSize: "0.78rem", fontWeight: 500, letterSpacing: "0.08em",
            textTransform: "uppercase", color: "rgba(255,255,255,0.45)",
          }}>
            {isFlipped ? "Flip Back" : "Flip Card"}
          </span>
        </motion.button>

      </div>
    </>
  );
};

export default FlipCard;