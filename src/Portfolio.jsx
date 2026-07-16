import React, { useState, useEffect, useRef, useMemo } from "react";
import { Mail, Phone, MapPin, ArrowRight, ArrowUpRight, ArrowUp, Github, Linkedin, Download } from "lucide-react";

const PROFILE_IMG = "/image.jpeg";

const palette = {
  bg: "#08090F",
  panel: "#12131E",
  panelAlt: "#0D0E17",
  line: "#232540",
  ink: "#F3F4FA",
  inkDim: "#8D90AE",
  violet: "#8A7CFF",
  cyan: "#3FE0D0",
  coral: "#FF7A7A",
};

const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');`;

/* ---------- helpers ---------- */

function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function Reveal({ children, delay = 0, className = "" }) {
  const [ref, visible] = useReveal();
  return (
    <div
      ref={ref}
      className={`reveal ${visible ? "reveal-in" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function Counter({ value, suffix = "", duration = 1400 }) {
  const [ref, visible] = useReveal();
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!visible) return;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setN(value * eased);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [visible, value, duration]);
  const display = Number.isInteger(value) ? Math.round(n) : n.toFixed(1);
  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}

function SectionLabel({ tag, title }) {
  return (
    <Reveal className="section-label">
      <span className="tag-chip">{tag}</span>
      <h2>{title}</h2>
    </Reveal>
  );
}

/* ---------- main ---------- */

export default function Portfolio() {
  const [active, setActive] = useState("home");
  const [scrolled, setScrolled] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const [spot, setSpot] = useState({ x: 50, y: 40 });
  const [filter, setFilter] = useState("all");

  const sections = ["home", "about", "experience", "projects", "skills", "contact"];

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      setShowTop(window.scrollY > 800);
      let current = "home";
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 140) current = id;
      }
      setActive(current);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const onHeroMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setSpot({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  const scrollTo = (id) => (e) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const experience = [
    {
      range: "2025 — 2026",
      role: "AI/ML Project",
      org: "University of Lahore — FYP Collaboration",
      bullets: [
        "Collaborated on an AI-powered tennis ball direction analyzer using YOLOv8, Kalman filtering, and homography calibration.",
        "Built the shot-classification pipeline (Forehand / Backhand / Serve) and real-time speed estimation in km/h.",
      ],
    },
    {
      range: "2023 — Present",
      role: "Freelance Developer & Digital Marketer",
      org: "Independent",
      bullets: [
        "Developed and launched Tbazar, a Shopify store, running Meta Ads campaigns for product promotion.",
        "Managed Facebook and Instagram paid advertising for audience engagement and sales conversion.",
        "Advised clients on Amazon product research, store setup, and selling strategy.",
      ],
    },
  ];

  const projects = [
    {
      flagship: true,
      category: "ai",
      title: "AI Tennis Ball Direction Analyzer",
      meta: "FYP Collaboration — UOL",
      desc: "Real-time ball tracking with YOLOv8, trained on 1,881 images to 92.3% mAP. Classifies shots (Forehand / Backhand / Serve, Cross Court / Down the Line), estimates speed in km/h, and streams live video overlays through a FastAPI dashboard.",
      tags: ["Python", "YOLOv8", "OpenCV", "PyTorch", "Kalman Filter", "FastAPI"],
      stat: { label: "mAP", value: "92.3%" },
    },
    {
      category: "ai",
      title: "AI Resume Analyzer",
      meta: "Full-stack SaaS app",
      desc: "A full-stack resume analysis tool — a React/Tailwind frontend sends resumes to a FastAPI backend, which extracts text and sends it to Google Gemini with a strict JSON schema. Validated results render as score rings, strength/weakness cards, missing keywords, and improvement suggestions.",
      tags: ["React", "Vite", "Tailwind", "FastAPI", "Python", "Gemini API"],
    },
    {
      category: "ai",
      title: "Jarvis Voice Assistant",
      meta: "Personal AI assistant",
      desc: "A hands-free voice assistant combining speech recognition, text-to-speech, and task automation.",
      tags: ["Python", "Speech Recognition", "Text-to-Speech"],
    },
    {
      category: "web",
      title: "Uppal Traders – Digi Khata",
      meta: "Full-stack ledger management app",
      desc: "A full-stack digital ledger application for managing customer and supplier credit/debit transactions. Built with Next.js and Kotlin Spring Boot, it features Firebase Authentication, PostgreSQL, transaction tracking, real-time balance management, dashboard analytics, customer and supplier management, and PDF/Excel export functionality.",
      tags: [
        "Next.js",
        "TypeScript",
        "Tailwind CSS",
        "Kotlin",
        "Spring Boot",
        "PostgreSQL",
        "Firebase",
        "Docker"
      ],
    },
    {
      category: "web",
      title: "Learning Management System",
      meta: "Course platform",
      desc: "A full-featured LMS for course management, student enrollment, and content delivery.",
      tags: ["WordPress", "PHP"],
    },
    {
      category: "web",
      title: "ATM System",
      meta: "OOP coursework",
      desc: "A functional ATM simulation covering account management, balance checks, and secure transactions.",
      tags: ["C#", "OOP"],
    },
    {
      category: "business",
      title: "Tbazar E-Commerce Store",
      meta: "Shopify storefront",
      desc: "An online store built and scaled through paid social and search advertising campaigns.",
      tags: ["Shopify", "Meta Ads", "Google Ads"],
    },
    {
      category: "mobile",
      title: "Mehfil e Ghazal",
      meta: "Cross-platform app",
      desc: "A cross-platform mobile app with a responsive, user-friendly UI for browsing and playing ghazal music.",
      tags: ["Flutter", "Dart"],
    },
  ];

  const filters = [
    { id: "all", label: "All" },
    { id: "ai", label: "AI / ML" },
    { id: "mobile", label: "Mobile" },
    { id: "web", label: "Web" },
    { id: "business", label: "Business" },
  ];

  const visibleProjects = useMemo(
    () => (filter === "all" ? projects : projects.filter((p) => p.category === filter)),
    [filter]
  );

  const skillGroups = [
    { label: "Languages", items: ["Python", "JavaScript", "React", "C++", "C#", "HTML", "CSS", "PHP", "Dart"] },
    { label: "Frameworks", items: ["Fast/Flask API", "Next.js", "Laravel", "Flutter", "Tailwind"] },
    { label: "Databases", items: ["MySQL", "SQLite"] },
    { label: "AI & ML", items: ["YOLOv8", "PyTorch", "OpenCV", "Kalman Filtering", "Speech Recognition"] },
    { label: "Dev Tools", items: ["REST APIs", "Git", "IntelliJ IDEA", "Docker", "VS Code", "XAMPP"] },
    { label: "Business", items: ["Shopify", "Meta Ads", "Google Ads", "Amazon", "Digital Marketing"] },
  ];

  const education = [
    { school: "University of Lahore (UOL)", deg: "BS Software Engineering", range: "2022 — Jul 2026", note: "Expected graduation" },
    { school: "Punjab Group of Colleges, Gujrat", deg: "ICS (Intermediate)", range: "2020 — 2022" },
  ];

  return (
    <div className="pf-root">
      <style>{`
        ${FONT_IMPORT}
        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        .pf-root {
          background: ${palette.bg};
          color: ${palette.ink};
          font-family: 'Inter', sans-serif;
          min-height: 100vh;
          width: 100%;
          position: relative;
          overflow-x: hidden;
        }
        .noise-grid {
          position: fixed;
          inset: 0;
          background-image:
            linear-gradient(${palette.line} 1px, transparent 1px),
            linear-gradient(90deg, ${palette.line} 1px, transparent 1px);
          background-size: 56px 56px;
          opacity: 0.08;
          pointer-events: none;
          z-index: 0;
        }
        .blob {
          position: fixed;
          border-radius: 50%;
          filter: blur(90px);
          opacity: 0.35;
          pointer-events: none;
          z-index: 0;
        }
        .blob-a {
          width: 480px; height: 480px;
          background: ${palette.violet};
          top: -160px; left: -120px;
          animation: floatA 16s ease-in-out infinite;
        }
        .blob-b {
          width: 420px; height: 420px;
          background: ${palette.cyan};
          bottom: -160px; right: -140px;
          animation: floatB 18s ease-in-out infinite;
        }
        @keyframes floatA {
          0%, 100% { transform: translate(0,0) scale(1); }
          50% { transform: translate(60px, 40px) scale(1.1); }
        }
        @keyframes floatB {
          0%, 100% { transform: translate(0,0) scale(1); }
          50% { transform: translate(-50px, -30px) scale(1.08); }
        }
        .wrap {
          max-width: 1080px;
          margin: 0 auto;
          padding: 0 28px;
          position: relative;
          z-index: 1;
        }

        .reveal {
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.7s cubic-bezier(.2,.7,.3,1), transform 0.7s cubic-bezier(.2,.7,.3,1);
        }
        .reveal-in { opacity: 1; transform: translateY(0); }

        nav.pf-nav {
          position: sticky;
          top: 0;
          z-index: 50;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 0;
          backdrop-filter: blur(14px);
          transition: background 0.3s, border-color 0.3s, padding 0.3s;
          border-bottom: 1px solid transparent;
        }
        nav.pf-nav.scrolled {
          background: rgba(8,9,15,0.72);
          border-bottom: 1px solid ${palette.line};
          padding: 14px 0;
        }
        .brand {
          font-family: 'JetBrains Mono', monospace;
          font-size: 13px;
          background: linear-gradient(90deg, ${palette.violet}, ${palette.cyan});
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          letter-spacing: 0.5px;
          font-weight: 600;
        }
        .nav-links { display: flex; gap: 6px; font-size: 13px; }
        .nav-links a {
          color: ${palette.inkDim};
          text-decoration: none;
          font-family: 'JetBrains Mono', monospace;
          padding: 7px 13px;
          border-radius: 20px;
          transition: color 0.2s, background 0.2s;
        }
        .nav-links a:hover { color: ${palette.ink}; }
        .nav-links a.active {
          color: ${palette.bg};
          background: linear-gradient(90deg, ${palette.violet}, ${palette.cyan});
          font-weight: 600;
        }

        .hero {
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          gap: 48px;
          padding: 64px 0 96px;
          align-items: center;
          position: relative;
        }
        .hero-spotlight {
          position: absolute;
          inset: 0;
          background: radial-gradient(500px circle at var(--x) var(--y), rgba(138,124,255,0.10), transparent 60%);
          pointer-events: none;
          transition: background 0.1s;
        }
        .eyebrow {
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          color: ${palette.cyan};
          letter-spacing: 1.5px;
          text-transform: uppercase;
          margin-bottom: 18px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .eyebrow::before {
          content: "";
          width: 22px; height: 1px;
          background: ${palette.cyan};
        }
        h1.name {
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 700;
          font-size: clamp(40px, 5.2vw, 68px);
          line-height: 1.03;
          margin: 0 0 22px;
          letter-spacing: -0.5px;
        }
        h1.name .grad {
          background: linear-gradient(90deg, ${palette.violet}, ${palette.cyan});
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
        .tagline {
          font-size: 17px;
          line-height: 1.6;
          color: ${palette.inkDim};
          max-width: 480px;
          margin-bottom: 30px;
        }
        .tagline b { color: ${palette.ink}; font-weight: 600; }
        .cta-row { display: flex; gap: 14px; margin-bottom: 40px; flex-wrap: wrap; }
        .btn {
          font-family: 'JetBrains Mono', monospace;
          font-size: 13px;
          padding: 13px 22px;
          border-radius: 30px;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: all 0.25s;
          border: 1px solid transparent;
          cursor: pointer;
        }
        .btn-primary {
          background: linear-gradient(90deg, ${palette.violet}, ${palette.cyan});
          color: #06070C;
          font-weight: 600;
          box-shadow: 0 8px 24px rgba(138,124,255,0.25);
        }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 12px 30px rgba(138,124,255,0.4); }
        .btn-ghost {
          border-color: ${palette.line};
          color: ${palette.ink};
        }
        .btn-ghost:hover { border-color: ${palette.cyan}; color: ${palette.cyan}; transform: translateY(-2px); }

        .stat-row { display: flex; gap: 10px; flex-wrap: wrap; }
        .stat-chip {
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          border: 1px solid ${palette.line};
          background: rgba(18,19,30,0.6);
          padding: 9px 14px;
          border-radius: 20px;
          color: ${palette.inkDim};
        }
        .stat-chip b { color: ${palette.cyan}; font-size: 13px; }
        .social-row {
          display: flex;
          gap: 10px;
          margin-top: 18px;
        }
        .social-btn {
          width: 40px; height: 40px;
          border-radius: 50%;
          border: 1px solid ${palette.line};
          display: flex;
          align-items: center;
          justify-content: center;
          color: ${palette.ink};
          text-decoration: none;
          transition: all 0.25s;
          background: rgba(18,19,30,0.6);
        }
        .social-btn:hover {
          border-color: ${palette.cyan};
          color: ${palette.cyan};
          transform: translateY(-3px);
        }
        .photo-wrap {
          position: relative;
          justify-self: center;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 300px;
          height: 300px;
        }
        .ring {
          position: absolute;
          inset: -14px;
          border-radius: 50%;
          background: conic-gradient(from 0deg, ${palette.violet}, ${palette.cyan}, ${palette.violet});
          animation: spin 8s linear infinite;
          -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 3px));
          mask: radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 3px));
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .photo-glow {
          position: absolute;
          width: 340px;
          height: 340px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(138,124,255,0.25), transparent 70%);
          filter: blur(14px);
          z-index: 0;
          animation: pulseGlow 3.5s ease-in-out infinite;
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }
        .photo-frame {
          width: 280px;
          height: 280px;
          border-radius: 50%;
          overflow: hidden;
          border: 3px solid ${palette.bg};
          position: relative;
          z-index: 1;
          box-shadow: 0 25px 60px rgba(0,0,0,0.5);
        }
        .photo-frame img {
          width: 100%; height: 100%; object-fit: cover;
          filter: saturate(0.95) contrast(1.03);
          transition: transform 0.5s ease;
        }
        .photo-wrap:hover .photo-frame img { transform: scale(1.06); }
        .photo-badge {
          position: absolute;
          bottom: 6px;
          right: -6px;
          background: ${palette.panel};
          border: 1px solid ${palette.line};
          padding: 9px 16px;
          border-radius: 24px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          display: flex;
          align-items: center;
          gap: 8px;
          color: ${palette.ink};
          box-shadow: 0 10px 26px rgba(0,0,0,0.4);
          z-index: 2;
          animation: floatBadge 3s ease-in-out infinite;
        }
        @keyframes floatBadge {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        .photo-badge .dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: #3FE07A;
          box-shadow: 0 0 8px #3FE07A;
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }

        section { padding: 76px 0; border-bottom: 1px solid ${palette.line}; position: relative; }
        .section-label {
          display: flex;
          align-items: baseline;
          gap: 16px;
          margin-bottom: 40px;
        }
        .tag-chip {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          color: ${palette.cyan};
          border: 1px solid rgba(63,224,208,0.35);
          padding: 4px 10px;
          border-radius: 20px;
          letter-spacing: 0.5px;
        }
        .section-label h2 {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 28px;
          font-weight: 600;
          margin: 0;
        }

        .about-grid {
          display: grid;
          grid-template-columns: 1.3fr 1fr;
          gap: 50px;
        }
        .about-grid p {
          font-size: 16px;
          line-height: 1.75;
          color: ${palette.inkDim};
          margin: 0 0 16px;
        }
        .about-grid p b { color: ${palette.ink}; font-weight: 600; }
        .fact-card {
          background: ${palette.panel};
          border: 1px solid ${palette.line};
          border-radius: 16px;
          padding: 6px 22px;
        }
        .fact-row {
          display: flex;
          justify-content: space-between;
          padding: 15px 0;
          border-bottom: 1px solid ${palette.line};
          font-size: 14px;
          gap: 12px;
        }
        .fact-row:last-child { border-bottom: none; }
        .fact-row .k { color: ${palette.inkDim}; font-family: 'JetBrains Mono', monospace; font-size: 12px; white-space: nowrap; }
        .fact-row .v { color: ${palette.ink}; font-weight: 500; text-align: right; }

        .timeline { display: flex; flex-direction: column; gap: 0; position: relative; }
        .tl-item {
          display: grid;
          grid-template-columns: 150px 1fr;
          gap: 32px;
          padding: 32px 0;
          border-top: 1px solid ${palette.line};
          position: relative;
        }
        .tl-item:first-child { border-top: none; }
        .tl-item::before {
          content: "";
          position: absolute;
          left: 145px;
          top: 38px;
          width: 10px; height: 10px;
          border-radius: 50%;
          background: ${palette.cyan};
          box-shadow: 0 0 10px ${palette.cyan};
        }
        .tl-range {
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          color: ${palette.cyan};
          padding-top: 3px;
        }
        .tl-role {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 19px;
          font-weight: 600;
          margin: 0 0 4px;
        }
        .tl-org { color: ${palette.inkDim}; font-size: 14px; margin-bottom: 14px; }
        .tl-item ul { margin: 0; padding-left: 18px; }
        .tl-item li { color: ${palette.inkDim}; font-size: 14.5px; line-height: 1.7; margin-bottom: 6px; }

        .filter-row {
          display: flex;
          gap: 10px;
          margin-bottom: 30px;
          flex-wrap: wrap;
        }
        .filter-btn {
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          padding: 9px 16px;
          border-radius: 20px;
          border: 1px solid ${palette.line};
          background: transparent;
          color: ${palette.inkDim};
          cursor: pointer;
          transition: all 0.2s;
        }
        .filter-btn:hover { color: ${palette.ink}; border-color: ${palette.cyan}; }
        .filter-btn.active {
          background: linear-gradient(90deg, ${palette.violet}, ${palette.cyan});
          color: #06070C;
          font-weight: 600;
          border-color: transparent;
        }

        .proj-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 18px;
        }
        .proj-card {
          position: relative;
          background: ${palette.panel};
          border: 1px solid ${palette.line};
          border-radius: 16px;
          padding: 26px;
          transition: border-color 0.3s, transform 0.3s, box-shadow 0.3s;
          overflow: hidden;
        }
        .proj-card::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(138,124,255,0.10), rgba(63,224,208,0.06));
          opacity: 0;
          transition: opacity 0.3s;
          pointer-events: none;
        }
        .proj-card.flagship { grid-column: span 2; }
        .proj-card:hover {
          border-color: rgba(63,224,208,0.4);
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.35);
        }
        .proj-card:hover::before { opacity: 1; }
        .proj-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 10px;
          gap: 12px;
          position: relative;
        }
        .proj-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 19px;
          font-weight: 600;
          margin: 0 0 3px;
        }
        .proj-meta {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          color: ${palette.violet};
          text-transform: uppercase;
          letter-spacing: 0.4px;
        }
        .proj-stat {
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          color: ${palette.cyan};
          border: 1px solid rgba(63,224,208,0.35);
          padding: 5px 10px;
          border-radius: 20px;
          white-space: nowrap;
        }
        .proj-desc {
          font-size: 14px;
          line-height: 1.65;
          color: ${palette.inkDim};
          margin: 0 0 16px;
          position: relative;
        }
        .tag-row { display: flex; flex-wrap: wrap; gap: 7px; position: relative; }
        .tag-pill {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          padding: 5px 11px;
          background: ${palette.panelAlt};
          border: 1px solid ${palette.line};
          border-radius: 20px;
          color: ${palette.inkDim};
          transition: all 0.2s;
        }
        .proj-card:hover .tag-pill { border-color: rgba(138,124,255,0.3); color: ${palette.ink}; }

        .skills-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 22px;
        }
        .skill-card {
          background: ${palette.panel};
          border: 1px solid ${palette.line};
          border-radius: 16px;
          padding: 20px;
          transition: transform 0.3s, border-color 0.3s;
        }
        .skill-card:hover { transform: translateY(-3px); border-color: rgba(138,124,255,0.35); }
        .skill-group-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          color: ${palette.cyan};
          margin-bottom: 12px;
          letter-spacing: 0.4px;
        }
        .skill-chips { display: flex; flex-wrap: wrap; gap: 7px; }
        .skill-chip {
          font-size: 13px;
          padding: 6px 12px;
          background: ${palette.panelAlt};
          border: 1px solid ${palette.line};
          border-radius: 20px;
          color: ${palette.ink};
          transition: all 0.2s;
        }
        .skill-chip:hover {
          border-color: ${palette.cyan};
          color: ${palette.cyan};
          transform: translateY(-2px);
        }

        .edu-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
        .edu-card {
          border: 1px solid ${palette.line};
          background: ${palette.panel};
          padding: 24px;
          border-radius: 16px;
          transition: transform 0.3s, border-color 0.3s;
        }
        .edu-card:hover { transform: translateY(-3px); border-color: rgba(63,224,208,0.35); }
        .edu-card .range {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          color: ${palette.cyan};
          margin-bottom: 10px;
        }
        .edu-card .school {
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 600;
          font-size: 17px;
          margin: 0 0 4px;
        }
        .edu-card .deg { color: ${palette.inkDim}; font-size: 14px; }

        .contact-section { border-bottom: none; padding-bottom: 50px; }
        .contact-links {
          display: flex;
          justify-content: center;
          gap: 14px;
          flex-wrap: wrap;
          position: relative;
        }
        .contact-links a {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 13px;
          color: ${palette.ink};
          text-decoration: none;
          border: 1px solid ${palette.line};
          padding: 12px 20px;
          border-radius: 30px;
          transition: all 0.25s;
          background: rgba(0,0,0,0.15);
        }
        .contact-links a:hover {
          border-color: ${palette.cyan};
          color: ${palette.cyan};
          transform: translateY(-3px);
        }
        footer.pf-footer {
          text-align: center;
          padding: 26px 0 40px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          color: ${palette.inkDim};
        }

        .back-top {
          position: fixed;
          bottom: 26px;
          right: 26px;
          width: 44px; height: 44px;
          border-radius: 50%;
          background: linear-gradient(90deg, ${palette.violet}, ${palette.cyan});
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          opacity: 0;
          transform: translateY(10px);
          pointer-events: none;
          transition: opacity 0.3s, transform 0.3s;
          z-index: 60;
          box-shadow: 0 10px 26px rgba(0,0,0,0.4);
        }
        .back-top.show { opacity: 1; transform: translateY(0); pointer-events: auto; }

        @media (max-width: 820px) {
          .hero { grid-template-columns: 1fr; padding-top: 40px; }
          .photo-wrap { order: -1; margin: 0 auto; }
          .about-grid { grid-template-columns: 1fr; }
          .proj-grid { grid-template-columns: 1fr; }
          .proj-card.flagship { grid-column: span 1; }
          .skills-grid { grid-template-columns: 1fr 1fr; }
          .edu-grid { grid-template-columns: 1fr; }
          .tl-item { grid-template-columns: 1fr; gap: 8px; }
          .tl-item::before { display: none; }
          .nav-links { display: none; }
        }
        @media (max-width: 480px) {
          .skills-grid { grid-template-columns: 1fr; }
          .photo-wrap { width: 240px; height: 240px; }
          .photo-frame { width: 220px; height: 220px; }
          .photo-glow { width: 270px; height: 270px; }
        }
      `}</style>

      <div className="noise-grid" />
      <div className="blob blob-a" />
      <div className="blob blob-b" />

      <div className="wrap">
        <nav className={`pf-nav ${scrolled ? "scrolled" : ""}`}>
          <div className="brand">AA_PORTFOLIO</div>
          <div className="nav-links">
            {["about", "experience", "projects", "skills", "contact"].map((id) => (
              <a
                key={id}
                href={`#${id}`}
                className={active === id ? "active" : ""}
                onClick={scrollTo(id)}
              >
                {id.charAt(0).toUpperCase() + id.slice(1)}
              </a>
            ))}
          </div>
        </nav>

        <section id="home" className="hero" style={{ border: "none" }} onMouseMove={onHeroMove}>
          <div className="hero-spotlight" style={{ "--x": `${spot.x}%`, "--y": `${spot.y}%` }} />
          <div>
            <Reveal>
              <div className="eyebrow">GRADUATE SOFTWARE ENGINEER</div>
            </Reveal>
            <Reveal delay={80}>
              <h1 className="name">
                Abdullah<br /><span className="grad">Attique</span>
              </h1>
            </Reveal>
            <Reveal delay={160}>
              <p className="tagline">
                I build full-stack web applications, AI-powered solutions, and automation tools using modern technologies. Passionate about solving real-world problems through software.
              </p>
            </Reveal>
            <Reveal delay={240}>
              <div className="cta-row">
                <a className="btn btn-primary" href="#projects" onClick={scrollTo("projects")}>
                  View projects <ArrowRight size={15} />
                </a>
                <a className="btn btn-ghost" href="#contact" onClick={scrollTo("contact")}>
                  Get in touch
                </a>
                <a className="btn btn-ghost" href="/MyResume.pdf" download="MyResume.pdf">
                  <Download size={15} /> MyResume.pdf
                </a>
              </div>
            </Reveal>
            <Reveal delay={320}>
              <div className="stat-row">
                <span className="stat-chip">Full-Stack <b>Developer</b></span>
                <span className="stat-chip">AI & ML <b>Enthusiast</b></span>
                <span className="stat-chip">Graduate <b>Jul 2026</b></span>
              </div>
            </Reveal>
            <Reveal delay={380}>
              <div className="social-row">
                <a className="social-btn" href="https://github.com/Abdullah-1389" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                  <Github size={18} />
                </a>
                <a className="social-btn" href="https://linkedin.com/in/abdullah-attique-a89814373" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                  <Linkedin size={18} />
                </a>
              </div>
            </Reveal>
          </div>

          <Reveal delay={200}>
            <div className="photo-wrap">
              <div className="photo-glow" />
              <div className="ring" />
              <div className="photo-frame">
                <img src={PROFILE_IMG} alt="Abdullah Attique" />
              </div>
              <div className="photo-badge">
                <span className="dot" /> Available for work
              </div>
            </div>
          </Reveal>
        </section>

        <section id="about">
          <SectionLabel tag="Software Engineer" title="👨‍💻 About" />
          <div className="about-grid">
            <Reveal delay={60}>
              <div>
                <p>
                  I'm a <b>Software Engineering graduate</b> from the University of
                  Lahore. My work sits at the intersection of
                  <b> AI/ML automation, mobile development, and practical web tooling</b> —
                  I like taking an idea from a rough sketch to something that actually
                  runs, in front of real users.
                </p>
                <p>
                  Recently that meant co-building an AI-powered tennis ball tracker with
                  YOLOv8 and Kalman filtering as my final year project. Outside of
                  coursework, I run a freelance practice covering Shopify builds, paid
                  social campaigns, and Amazon store setup for clients.
                </p>
                <p>
                  I play badminton and cricket competitively, which is where the
                  discipline and teamwork behind my engineering work actually comes from.
                </p>
              </div>
            </Reveal>
            <Reveal delay={160}>
              <div className="fact-card">
                <div className="fact-row"><span className="k">LOCATION</span><span className="v">Lalamusa, Gujrat, Pakistan</span></div>
                <div className="fact-row"><span className="k">EDUCATION</span><span className="v">BS Software Engineering, UOL</span></div>
                <div className="fact-row"><span className="k">STATUS</span><span className="v">Open to Work &amp; freelance work</span></div>
                <div className="fact-row"><span className="k">FOCUS</span><span className="v">AI/ML · Data Science · Automation</span></div>
                <div className="fact-row"><span className="k">EMAIL</span><span className="v">abdullahattique029@gmail.com</span></div>
                <div className="fact-row"><span className="k">PHONE</span><span className="v">0331-7333700</span></div>
              </div>
            </Reveal>
          </div>
        </section>

        <section id="experience">
          <SectionLabel tag="01" title="💼 Experience" />
          <div className="timeline">
            {experience.map((e, i) => (
              <Reveal key={i} delay={i * 100}>
                <div className="tl-item">
                  <div className="tl-range">{e.range}</div>
                  <div>
                    <h3 className="tl-role">{e.role}</h3>
                    <div className="tl-org">{e.org}</div>
                    <ul>
                      {e.bullets.map((b, j) => <li key={j}>{b}</li>)}
                    </ul>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section id="projects">
          <SectionLabel tag="02" title="🚀 Projects" />
          <Reveal>
            <div className="filter-row">
              {filters.map((f) => (
                <button
                  key={f.id}
                  className={`filter-btn ${filter === f.id ? "active" : ""}`}
                  onClick={() => setFilter(f.id)}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </Reveal>
          <div className="proj-grid">
            {visibleProjects.map((p, i) => (
              <Reveal key={p.title} delay={i * 70}>
                <div className={`proj-card ${p.flagship ? "flagship" : ""}`}>
                  <div className="proj-top">
                    <div>
                      <h3 className="proj-title">{p.title}</h3>
                      <div className="proj-meta">{p.meta}</div>
                    </div>
                    {p.stat && <span className="proj-stat">{p.stat.label} {p.stat.value}</span>}
                  </div>
                  <p className="proj-desc">{p.desc}</p>
                  <div className="tag-row">
                    {p.tags.map((t, j) => <span className="tag-pill" key={j}>{t}</span>)}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section id="skills">
          <SectionLabel tag="03" title="🛠️ Skills" />
          <div className="skills-grid">
            {skillGroups.map((g, i) => (
              <Reveal key={i} delay={i * 60}>
                <div className="skill-card">
                  <div className="skill-group-label">{g.label}</div>
                  <div className="skill-chips">
                    {g.items.map((s, j) => <span className="skill-chip" key={j}>{s}</span>)}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section id="education">
          <SectionLabel tag="04" title="🎓 Education" />
          <div className="edu-grid">
            {education.map((e, i) => (
              <Reveal key={i} delay={i * 80}>
                <div className="edu-card">
                  <div className="range">{e.range}</div>
                  <h3 className="school">{e.school}</h3>
                  <div className="deg">{e.deg}{e.note ? ` · ${e.note}` : ""}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section id="contact" className="contact-section">
          <Reveal>
            <div className="contact-links">
              <a href="mailto:abdullahattique029@gmail.com"><Mail size={15} /> abdullahattique029@gmail.com</a>
              <a href="https://github.com/Abdullah-1389" target="_blank" rel="noopener noreferrer"><Github size={15} /> GitHub</a>
              <a href="https://linkedin.com/in/abdullah-attique-a89814373" target="_blank" rel="noopener noreferrer"><Linkedin size={15} /> LinkedIn</a>
              <a href="tel:03317333700"><Phone size={15} /> 0331-7333700</a>
              <a href="/MyResume.pdf" download="MyResume.pdf"><Download size={15} /> MyResume.pdf</a>
              <a href="#about" onClick={scrollTo("about")}><MapPin size={15} /> Lalamusa, Gujrat, PK</a>
            </div>
          </Reveal>
        </section>

        <footer className="pf-footer">
          © {new Date().getFullYear()} Abdullah Attique — built with React
        </footer>
      </div>

      <button
        className={`back-top ${showTop ? "show" : ""}`}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Back to top"
      >
        <ArrowUp size={18} color="#06070C" />
      </button>
    </div>
  );
}