"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";

type Step = "cuenta" | "ine-intro" | "frente" | "reverso" | "selfie" | "procesando" | "exito";

interface UploadedFile { url: string; name: string; }

const SHARED_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700&family=EB+Garamond:ital,wght@0,400;0,600;0,700;1,400&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --green-1: #3A7D5E;
    --green-2: #2A5C47;
    --green-3: #1C3D30;
    --neon:    #00F580;
    --gold:    #C9962F;
    --bg:      #0D1F18;
    --border:  rgba(0,245,128,0.15);
    --text:    #E8F0EB;
    --muted:   #7A9B8A;
  }

  html, body { height: 100%; }

  body {
    font-family: 'Lexend', sans-serif;
    background-color: var(--bg);
    color: var(--text);
    min-height: 100vh;
  }

  /* ── Background ── */
  .bg-layer {
    position: fixed; inset: 0; z-index: 0;
    background: radial-gradient(ellipse 100% 55% at 50% 0%, #1a3828 0%, #0D1F18 55%);
    pointer-events: none;
  }
  .bg-layer::before {
    content: '';
    position: absolute; inset: 0;
    background-image:
      repeating-linear-gradient(0deg, transparent, transparent 79px, rgba(0,245,128,0.025) 80px),
      repeating-linear-gradient(90deg, transparent, transparent 79px, rgba(0,245,128,0.025) 80px);
  }
  .orb { position: fixed; border-radius: 50%; filter: blur(90px); pointer-events: none; z-index: 0; }
  .orb-a { width: 500px; height: 500px; background: rgba(58,125,94,0.14); bottom: -150px; right: -150px; }
  .orb-b { width: 350px; height: 350px; background: rgba(201,150,47,0.08); top: 0; left: -100px; }

  /* ── Page ── */
  .page {
    min-height: 100vh;
    display: flex; flex-direction: column;
    align-items: center;
    padding: 36px 16px 60px;
    position: relative;
  }

  /* ── Topbar ── */
  .topbar {
    position: relative; z-index: 10;
    width: 100%; max-width: 580px;
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 32px;
  }
  .back-btn {
    display: flex; align-items: center; gap: 7px;
    background: none; border: 1px solid var(--border);
    border-radius: 8px; padding: 8px 14px;
    color: var(--muted); font-family: 'Lexend'; font-size: 12px; font-weight: 400;
    cursor: pointer; transition: color .2s, border-color .2s;
    text-decoration: none;
  }
  .back-btn:hover { color: var(--text); border-color: rgba(0,245,128,0.3); }
  .logo-sm {
    font-family: 'EB Garamond', serif;
    font-size: 18px; font-weight: 700; letter-spacing: .05em;
  }
  .logo-sm span { color: var(--gold); }
  .secure-badge {
    display: flex; align-items: center; gap: 5px;
    font-size: 10px; font-weight: 300; letter-spacing: .08em; color: var(--muted);
  }

  /* ── Global progress bar ── */
  .global-progress {
    position: relative; z-index: 10;
    width: 100%; max-width: 580px;
    margin-bottom: 28px;
  }
  .gp-labels {
    display: flex; justify-content: space-between;
    margin-bottom: 8px;
  }
  .gp-label {
    font-size: 10px; font-weight: 500; letter-spacing: .1em; text-transform: uppercase;
    color: var(--muted); transition: color .3s;
  }
  .gp-label.active { color: var(--neon); }
  .gp-label.done   { color: var(--green-1); }
  .gp-track {
    width: 100%; height: 3px; border-radius: 99px;
    background: rgba(0,245,128,.1);
    overflow: hidden;
  }
  .gp-fill {
    height: 100%; border-radius: 99px;
    background: linear-gradient(90deg, var(--green-2), var(--neon));
    transition: width .5s cubic-bezier(.4,0,.2,1);
    box-shadow: 0 0 10px rgba(0,245,128,.3);
  }

  /* ── Card ── */
  .card {
    position: relative; z-index: 10;
    width: 100%; max-width: 520px;
    background: linear-gradient(160deg, rgba(18,38,25,.96) 0%, rgba(13,31,24,.99) 100%);
    border: 1px solid var(--border);
    border-radius: 22px;
    padding: 40px 44px 36px;
    box-shadow: 0 0 0 1px rgba(0,245,128,.04), 0 28px 70px rgba(0,0,0,.55);
    animation: rise .5s cubic-bezier(.22,1,.36,1) both;
  }
  @keyframes rise {
    from { opacity: 0; transform: translateY(22px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ── Typography ── */
  .card-tag {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 4px 10px; border-radius: 20px;
    font-size: 10px; font-weight: 500; letter-spacing: .08em; text-transform: uppercase;
    margin-bottom: 12px;
  }
  .card-tag.green {
    border: 1px solid rgba(0,245,128,.2); background: rgba(0,245,128,.05); color: var(--neon);
  }
  .card-tag.gold {
    border: 1px solid rgba(201,150,47,.3); background: rgba(201,150,47,.07); color: var(--gold);
  }
  .card-title {
    font-family: 'EB Garamond', serif;
    font-size: 24px; font-weight: 700; margin-bottom: 6px; line-height: 1.2;
  }
  .card-sub {
    font-size: 13px; font-weight: 300; color: var(--muted); line-height: 1.65; margin-bottom: 28px;
  }

  /* ── Form elements ── */
  .form-group { margin-bottom: 16px; }
  .form-label {
    display: block; font-size: 11px; font-weight: 500;
    letter-spacing: .1em; text-transform: uppercase;
    color: var(--muted); margin-bottom: 8px;
  }
  .form-input {
    width: 100%; padding: 13px 16px;
    background: rgba(0,0,0,.25);
    border: 1px solid rgba(0,245,128,.12); border-radius: 10px;
    font-family: 'Lexend'; font-size: 14px; font-weight: 300; color: var(--text);
    outline: none;
    transition: border-color .2s, box-shadow .2s, background .2s;
  }
  .form-input::placeholder { color: rgba(122,155,138,.5); }
  .form-input:focus {
    border-color: rgba(0,245,128,.4); background: rgba(0,0,0,.35);
    box-shadow: 0 0 0 3px rgba(0,245,128,.06);
  }
  .input-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

  /* ── Buttons ── */
  .btn-primary {
    width: 100%; padding: 15px; border: none; border-radius: 10px;
    background: linear-gradient(135deg, var(--neon), #00C468);
    color: var(--green-3); font-family: 'Lexend'; font-size: 14px; font-weight: 600;
    letter-spacing: .06em; text-transform: uppercase;
    cursor: pointer; margin-top: 6px;
    transition: transform .15s, box-shadow .2s;
    box-shadow: 0 4px 20px rgba(0,245,128,.25);
  }
  .btn-primary:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 8px 28px rgba(0,245,128,.35); }
  .btn-primary:disabled { opacity: .55; cursor: not-allowed; }

  .btn-secondary {
    width: 100%; padding: 13px; margin-top: 10px;
    border: 1px solid var(--border); border-radius: 10px;
    background: rgba(0,0,0,.2); color: var(--text);
    font-family: 'Lexend'; font-size: 13px; font-weight: 400;
    cursor: pointer;
    transition: border-color .2s, background .2s;
  }
  .btn-secondary:hover { border-color: rgba(0,245,128,.3); background: rgba(0,0,0,.35); }

  .spinner {
    display: inline-block; width: 16px; height: 16px;
    border: 2px solid rgba(28,61,48,.3); border-top-color: var(--green-3);
    border-radius: 50%; animation: spin .7s linear infinite;
    vertical-align: middle; margin-right: 8px;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* ── Requirements box ── */
  .req-box {
    background: rgba(0,0,0,.2); border: 1px solid var(--border);
    border-radius: 12px; padding: 18px 20px; margin-bottom: 28px;
  }
  .req-title {
    font-size: 10px; font-weight: 600; letter-spacing: .12em; text-transform: uppercase;
    color: var(--gold); margin-bottom: 12px;
  }
  .req-list { list-style: none; display: flex; flex-direction: column; gap: 9px; }
  .req-item {
    display: flex; align-items: flex-start; gap: 9px;
    font-size: 13px; font-weight: 300; color: var(--text); line-height: 1.5;
  }
  .req-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: var(--neon); flex-shrink: 0; margin-top: 5px;
  }

  /* ── INE guide visual ── */
  .ine-guide {
    width: 100%; border-radius: 12px;
    border: 1.5px solid rgba(0,245,128,.15);
    background: rgba(0,0,0,.2);
    overflow: hidden; margin-bottom: 16px;
  }
  .ine-guide-inner {
    padding: 20px; display: flex; flex-direction: column; align-items: center; gap: 10px;
  }

  /* ── Drop zone ── */
  .drop-zone {
    width: 100%; border-radius: 12px;
    border: 1.5px dashed rgba(0,245,128,.2);
    background: rgba(0,0,0,.18); padding: 22px;
    text-align: center; cursor: pointer; margin-bottom: 10px;
    transition: border-color .2s, background .2s;
  }
  .drop-zone:hover, .drop-zone.drag-over {
    border-color: rgba(0,245,128,.5); background: rgba(0,245,128,.04);
  }
  .drop-zone-inner { display: flex; flex-direction: column; align-items: center; gap: 8px; }
  .drop-icon {
    width: 40px; height: 40px; border-radius: 10px;
    background: linear-gradient(135deg, var(--green-2), var(--green-3));
    display: flex; align-items: center; justify-content: center; margin-bottom: 4px;
  }
  .drop-text { font-size: 13px; font-weight: 400; color: var(--text); }
  .drop-hint { font-size: 11px; font-weight: 300; color: var(--muted); }
  .fmt-pills { display: flex; gap: 6px; margin-top: 4px; flex-wrap: wrap; justify-content: center; }
  .fmt-pill {
    padding: 2px 8px; border-radius: 20px; border: 1px solid var(--border);
    font-size: 9px; font-weight: 500; letter-spacing: .06em; color: var(--muted); text-transform: uppercase;
  }

  /* ── Image preview ── */
  .preview-wrap {
    position: relative; width: 100%; border-radius: 12px;
    overflow: hidden; margin-bottom: 12px; min-height: 140px;
    border: 1px solid rgba(0,245,128,.2);
  }
  .preview-img { width: 100%; object-fit: cover; max-height: 200px; display: block; }
  .preview-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(to top, rgba(13,31,24,.9) 0%, transparent 50%);
    display: flex; align-items: flex-end; padding: 12px 14px; gap: 8px;
  }
  .preview-name {
    font-size: 12px; font-weight: 400; color: var(--text); flex: 1;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .check-badge {
    width: 24px; height: 24px; border-radius: 50%;
    background: var(--neon); display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .change-btn {
    background: none; border: none; font-family: 'Lexend'; font-size: 11px;
    font-weight: 400; color: var(--neon); cursor: pointer; text-decoration: underline;
  }

  /* ── Selfie tips ── */
  .selfie-tips { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px; }
  .tip-card {
    background: rgba(0,0,0,.2); border: 1px solid var(--border);
    border-radius: 10px; padding: 12px 14px;
    display: flex; flex-direction: column; gap: 5px;
  }
  .tip-icon { font-size: 18px; }
  .tip-text { font-size: 11px; font-weight: 300; color: var(--muted); line-height: 1.5; }

  /* ── Processing ── */
  .processing-wrap { display: flex; flex-direction: column; align-items: center; gap: 22px; padding: 8px 0; }
  .process-ring { position: relative; width: 90px; height: 90px; }
  .process-ring svg { position: absolute; inset: 0; transform: rotate(-90deg); }
  .ring-bg { fill: none; stroke: rgba(0,245,128,.1); stroke-width: 6; }
  .ring-fill {
    fill: none; stroke: var(--neon); stroke-width: 6; stroke-linecap: round;
    stroke-dasharray: 251.2; transition: stroke-dashoffset .3s ease;
  }
  .ring-pct { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-size: 15px; font-weight: 600; color: var(--neon); }
  .process-title { font-family: 'EB Garamond', serif; font-size: 22px; font-weight: 700; text-align: center; }
  .process-steps { width: 100%; display: flex; flex-direction: column; gap: 9px; }
  .p-step {
    display: flex; align-items: center; gap: 12px; padding: 11px 14px;
    background: rgba(0,0,0,.2); border: 1px solid var(--border); border-radius: 10px;
  }
  .p-step-icon {
    width: 28px; height: 28px; border-radius: 8px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
  }
  .p-step-icon.pending { background: rgba(0,0,0,.3); border: 1px solid var(--border); }
  .p-step-icon.active  { background: rgba(0,245,128,.12); border: 1px solid rgba(0,245,128,.3); animation: pulseBorder 1.2s ease infinite; }
  .p-step-icon.done    { background: var(--green-2); border: 1px solid var(--neon); }
  @keyframes pulseBorder { 0%,100%{box-shadow:0 0 0 0 rgba(0,245,128,0)} 50%{box-shadow:0 0 0 4px rgba(0,245,128,.15)} }
  .p-step-text { font-size: 13px; font-weight: 300; color: var(--text); }
  .p-step-text.muted { color: var(--muted); }

  /* ── Success ── */
  .success-wrap { display: flex; flex-direction: column; align-items: center; gap: 18px; padding: 4px 0; }
  .success-ring {
    width: 76px; height: 76px; border-radius: 50%;
    background: linear-gradient(135deg, var(--green-1), var(--green-3));
    border: 2px solid var(--neon);
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 0 40px rgba(0,245,128,.25);
    animation: popIn .5s cubic-bezier(.34,1.56,.64,1) both;
  }
  @keyframes popIn { from{opacity:0;transform:scale(.5)} to{opacity:1;transform:scale(1)} }
  .success-title { font-family: 'EB Garamond', serif; font-size: 25px; font-weight: 700; text-align: center; }
  .success-sub { font-size: 13px; font-weight: 300; color: var(--muted); text-align: center; line-height: 1.65; }
  .summary-rows { width: 100%; display: flex; flex-direction: column; gap: 7px; }
  .s-row {
    display: flex; align-items: center; justify-content: space-between;
    padding: 10px 14px; background: rgba(0,0,0,.2);
    border: 1px solid var(--border); border-radius: 10px;
  }
  .s-key { font-size: 10px; font-weight: 500; letter-spacing: .07em; text-transform: uppercase; color: var(--muted); }
  .s-val { font-size: 12px; font-weight: 400; color: var(--text); }
  .s-val.green { color: var(--neon); }

  /* ── Footer ── */
  .footer-text {
    text-align: center; margin-top: 22px;
    font-size: 12px; font-weight: 300; color: var(--muted); line-height: 1.6;
  }
  .link { color: var(--neon); text-decoration: none; font-weight: 400; }
  .link:hover { text-decoration: underline; }

  @media (max-width: 520px) {
    .card { padding: 28px 20px 24px; }
    .selfie-tips { grid-template-columns: 1fr; }
    .input-row { grid-template-columns: 1fr; }
  }
`;

// ── Step config ──────────────────────────────────────────────────────────────
const STEPS: { id: Step; label: string; phase: "cuenta" | "ine" }[] = [
  { id: "cuenta",    label: "Cuenta",  phase: "cuenta" },
  { id: "ine-intro", label: "INE",     phase: "ine" },
  { id: "frente",    label: "Frente",  phase: "ine" },
  { id: "reverso",   label: "Reverso", phase: "ine" },
  { id: "selfie",    label: "Selfie",  phase: "ine" },
];

function getProgressPct(step: Step): number {
  const map: Record<Step, number> = {
    cuenta: 10, "ine-intro": 28, frente: 46, reverso: 64, selfie: 82, procesando: 95, exito: 100,
  };
  return map[step] ?? 0;
}

// ────────────────────────────────────────────────────────────────────────────
export default function RegisterPage() {
  const [step, setStep]                 = useState<Step>("cuenta");
  const [username, setUsername]         = useState("");
  const [email, setEmail]               = useState("");
  const [password, setPassword]         = useState("");
  const [confirmPass, setConfirmPass]   = useState("");
  const [frente, setFrente]             = useState<UploadedFile | null>(null);
  const [reverso, setReverso]           = useState<UploadedFile | null>(null);
  const [selfie, setSelfie]             = useState<UploadedFile | null>(null);
  const [dragOver, setDragOver]         = useState(false);
  const [progress, setProgress]         = useState(0);
  const [isLoading, setIsLoading]       = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File, type: "frente" | "reverso" | "selfie") => {
    const obj = { url: URL.createObjectURL(file), name: file.name };
    if (type === "frente")  setFrente(obj);
    if (type === "reverso") setReverso(obj);
    if (type === "selfie")  setSelfie(obj);
  }, []);

  const handleDrop = (e: React.DragEvent, type: "frente" | "reverso" | "selfie") => {
    e.preventDefault(); setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file, type);
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>, type: "frente" | "reverso" | "selfie") => {
    const file = e.target.files?.[0];
    if (file) handleFile(file, type);
    e.target.value = "";
  };

  const startProcessing = () => {
    setStep("procesando");
    let p = 0;
    const iv = setInterval(() => {
      p += Math.random() * 18 + 4;
      if (p >= 100) {
        setProgress(100); clearInterval(iv);
        setTimeout(() => setStep("exito"), 600);
      } else {
        setProgress(Math.round(p));
      }
    }, 280);
  };

  const handleAccountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => { setIsLoading(false); setStep("ine-intro"); }, 1000);
  };

  // Current file for upload steps
  const currentFile = step === "frente" ? frente : step === "reverso" ? reverso : step === "selfie" ? selfie : null;
  const currentType = (step === "frente" || step === "reverso" || step === "selfie") ? step : null;

  // Labels for progress bar
  const phaseLabels = [
    { label: "Cuenta", active: step === "cuenta", done: step !== "cuenta" },
    { label: "Verificación INE", active: ["ine-intro","frente","reverso","selfie"].includes(step), done: ["procesando","exito"].includes(step) },
    { label: "Listo", active: step === "procesando", done: step === "exito" },
  ];

  return (
    <>
      <style>{SHARED_STYLES}</style>

      <div className="bg-layer" />
      <div className="orb orb-a" />
      <div className="orb orb-b" />

      <div className="page">

        {/* Topbar */}
        <div className="topbar">
          <Link href="/login" className="back-btn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            Inicio de sesión
          </Link>
          <span className="logo-sm">Regnum <span>Casino</span></span>
          <div className="secure-badge">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            SSL 256-bit
          </div>
        </div>

        {/* Global progress */}
        <div className="global-progress">
          <div className="gp-labels">
            {phaseLabels.map(p => (
              <span key={p.label} className={`gp-label ${p.active ? "active" : ""} ${p.done ? "done" : ""}`}>
                {p.label}
              </span>
            ))}
          </div>
          <div className="gp-track">
            <div className="gp-fill" style={{ width: `${getProgressPct(step)}%` }} />
          </div>
        </div>

        {/* ─── CARD ─────────────────────────────────────── */}
        <div className="card" key={step}>

          {/* ══ CUENTA ══════════════════════════════════ */}
          {step === "cuenta" && (
            <>
              <div className="card-tag green">
                <span style={{ width:6, height:6, borderRadius:"50%", background:"var(--neon)", display:"inline-block" }} />
                Paso 1 de 2
              </div>
              <h2 className="card-title">Crea tu cuenta</h2>
              <p className="card-sub">Elige un nombre de jugador y configura tus credenciales de acceso.</p>

              <form onSubmit={handleAccountSubmit}>
                <div className="form-group">
                  <label className="form-label">Nombre de usuario</label>
                  <input type="text" className="form-input" placeholder="tu_nombre_de_jugador"
                    value={username} onChange={e => setUsername(e.target.value)} required />
                </div>

                <div className="form-group">
                  <label className="form-label">Correo electrónico</label>
                  <input type="email" className="form-input" placeholder="correo@ejemplo.com"
                    value={email} onChange={e => setEmail(e.target.value)} required />
                </div>

                <div className="input-row">
                  <div className="form-group">
                    <label className="form-label">Contraseña</label>
                    <input type="password" className="form-input" placeholder="••••••••"
                      value={password} onChange={e => setPassword(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Confirmar</label>
                    <input type="password" className="form-input" placeholder="••••••••"
                      value={confirmPass} onChange={e => setConfirmPass(e.target.value)} required />
                  </div>
                </div>

                <button type="submit" className="btn-primary" disabled={isLoading}>
                  {isLoading
                    ? <><span className="spinner" />Guardando...</>
                    : "Continuar → Verificar INE"
                  }
                </button>
              </form>

              <p className="footer-text">
                Al registrarte aceptas los{" "}
                <a href="#" className="link">Términos de Servicio</a> y la{" "}
                <a href="#" className="link">Política de Privacidad</a>.{" "}
                +18 · Juego responsable
              </p>
              <p className="footer-text" style={{ marginTop: 10 }}>
                ¿Ya tienes cuenta? <Link href="/login" className="link">Inicia sesión</Link>
              </p>
            </>
          )}

          {/* ══ INE INTRO ════════════════════════════════ */}
          {step === "ine-intro" && (
            <>
              <div className="card-tag gold">
                <span style={{ width:6, height:6, borderRadius:"50%", background:"var(--gold)", display:"inline-block" }} />
                Paso 2 de 2 — Verificación KYC
              </div>
              <h2 className="card-title">Verificación de identidad</h2>
              <p className="card-sub">
                Para cumplir con la regulación mexicana necesitamos validar tu INE/IFE.
                El proceso tarda menos de 2 minutos.
              </p>

              <div className="req-box">
                <p className="req-title">Qué necesitas tener a la mano</p>
                <ul className="req-list">
                  {[
                    "Tu INE o IFE vigente (no vencida)",
                    "Buena iluminación, sin reflejos sobre el plástico",
                    "Fotografía nítida y sin recortes en los bordes",
                    "Selfie sosteniendo la INE junto a tu rostro",
                  ].map(r => (
                    <li key={r} className="req-item"><span className="req-dot" />{r}</li>
                  ))}
                </ul>
              </div>

              <button className="btn-primary" onClick={() => setStep("frente")}>
                Comenzar verificación →
              </button>
            </>
          )}

          {/* ══ FRENTE / REVERSO ═════════════════════════ */}
          {(step === "frente" || step === "reverso") && currentType && (
            <>
              <div className="card-tag green">
                <span style={{ width:6, height:6, borderRadius:"50%", background:"var(--neon)", display:"inline-block" }} />
                {step === "frente" ? "Frente de INE" : "Reverso de INE"}
              </div>
              <h2 className="card-title">
                {step === "frente" ? "Fotografía la parte frontal" : "Fotografía la parte trasera"}
              </h2>
              <p className="card-sub">
                {step === "frente"
                  ? "Tu foto, nombre completo y CURP deben ser claramente legibles."
                  : "Asegúrate de que el código de barras y el domicilio sean visibles."
                }
              </p>

              {/* Visual guide */}
              <div className="ine-guide">
                <div className="ine-guide-inner">
                  {step === "frente" ? (
                    <div style={{ width:"100%", maxWidth:300, height:88, borderRadius:8, background:"rgba(0,0,0,.3)", border:"1px solid rgba(0,245,128,.15)", display:"flex", alignItems:"center", padding:"0 14px", gap:14 }}>
                      <div style={{ width:50, height:62, borderRadius:5, background:"rgba(0,245,128,.08)", border:"1px dashed rgba(0,245,128,.2)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="1.5"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
                      </div>
                      <div style={{ flex:1, display:"flex", flexDirection:"column", gap:5 }}>
                        {[60, 80, 50].map((w,i)=>(
                          <div key={i} style={{ height:6, width:`${w}%`, borderRadius:4, background:"rgba(0,245,128,.1)" }} />
                        ))}
                      </div>
                      <div style={{ width:34, height:34, borderRadius:5, background:"rgba(0,245,128,.06)", border:"1px dashed rgba(0,245,128,.12)" }} />
                    </div>
                  ) : (
                    <div style={{ width:"100%", maxWidth:300, height:88, borderRadius:8, background:"rgba(0,0,0,.3)", border:"1px solid rgba(0,245,128,.15)", display:"flex", flexDirection:"column", justifyContent:"center", padding:"0 14px", gap:7 }}>
                      <div style={{ display:"flex", gap:3, alignItems:"flex-end" }}>
                        {Array.from({length:28}).map((_,i)=>(
                          <div key={i} style={{ width:3, height: 20 + (i%3===0 ? 12 : i%2===0 ? 6 : 0), background:"rgba(0,245,128,.15)", borderRadius:1 }} />
                        ))}
                      </div>
                      {[68,50].map((w,i)=>(
                        <div key={i} style={{ height:5, width:`${w}%`, borderRadius:4, background:"rgba(0,245,128,.08)" }} />
                      ))}
                    </div>
                  )}
                  <span style={{ fontSize:9, letterSpacing:".1em", textTransform:"uppercase", color:"var(--muted)" }}>
                    {step === "frente" ? "CARA FRONTAL" : "CARA TRASERA"}
                  </span>
                </div>
              </div>

              {/* Upload / preview */}
              {currentFile ? (
                <div className="preview-wrap">
                  <img src={currentFile.url} alt="INE" className="preview-img" />
                  <div className="preview-overlay">
                    <span className="preview-name">{currentFile.name}</span>
                    <div className="check-badge">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#1C3D30" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>
                    </div>
                    <button className="change-btn" onClick={() => { if(currentType==="frente") setFrente(null); else setReverso(null); }}>Cambiar</button>
                  </div>
                </div>
              ) : (
                <div
                  className={`drop-zone ${dragOver ? "drag-over" : ""}`}
                  onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={e => handleDrop(e, currentType)}
                  onClick={() => fileRef.current?.click()}
                >
                  <input ref={fileRef} type="file" accept="image/*" style={{ display:"none" }} onChange={e => handleInput(e, currentType)} />
                  <div className="drop-zone-inner">
                    <div className="drop-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--neon)" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                    </div>
                    <span className="drop-text">Arrastra tu foto o <span style={{ color:"var(--neon)" }}>selecciona archivo</span></span>
                    <span className="drop-hint">Máx. 10 MB · Buena iluminación · Sin reflejos</span>
                    <div className="fmt-pills">
                      {["JPG","PNG","HEIC","PDF"].map(f=><span key={f} className="fmt-pill">{f}</span>)}
                    </div>
                  </div>
                </div>
              )}

              <button className="btn-primary" disabled={!currentFile} onClick={() => setStep(step === "frente" ? "reverso" : "selfie")}>
                Continuar →
              </button>
              <button className="btn-secondary" onClick={() => setStep(step === "frente" ? "ine-intro" : "frente")}>
                ← Atrás
              </button>
            </>
          )}

          {/* ══ SELFIE ═══════════════════════════════════ */}
          {step === "selfie" && (
            <>
              <div className="card-tag gold">
                <span style={{ width:6, height:6, borderRadius:"50%", background:"var(--gold)", display:"inline-block" }} />
                Último paso — Selfie
              </div>
              <h2 className="card-title">Foto con tu INE</h2>
              <p className="card-sub">
                Tómate una selfie sosteniendo tu INE junto a tu rostro para confirmar que eres tú.
              </p>

              <div className="selfie-tips">
                {[
                  { icon:"💡", text:"Buena iluminación frontal, sin sombras" },
                  { icon:"🪪", text:"Muestra la cara frontal de la INE" },
                  { icon:"👓", text:"Sin lentes oscuros ni cubrebocas" },
                  { icon:"📐", text:"Documento recto y legible" },
                ].map(t=>(
                  <div key={t.text} className="tip-card">
                    <span className="tip-icon">{t.icon}</span>
                    <span className="tip-text">{t.text}</span>
                  </div>
                ))}
              </div>

              {selfie ? (
                <div className="preview-wrap">
                  <img src={selfie.url} alt="Selfie" className="preview-img" />
                  <div className="preview-overlay">
                    <span className="preview-name">{selfie.name}</span>
                    <div className="check-badge">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#1C3D30" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>
                    </div>
                    <button className="change-btn" onClick={() => setSelfie(null)}>Cambiar</button>
                  </div>
                </div>
              ) : (
                <div
                  className={`drop-zone ${dragOver ? "drag-over" : ""}`}
                  onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={e => handleDrop(e, "selfie")}
                  onClick={() => fileRef.current?.click()}
                >
                  <input ref={fileRef} type="file" accept="image/*" capture="user" style={{ display:"none" }} onChange={e => handleInput(e, "selfie")} />
                  <div className="drop-zone-inner">
                    <div className="drop-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--neon)" strokeWidth="2"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>
                    </div>
                    <span className="drop-text"><span style={{ color:"var(--neon)" }}>Tomar foto</span> o subir imagen</span>
                    <span className="drop-hint">Selfie sosteniendo tu INE · Cara visible</span>
                  </div>
                </div>
              )}

              <button className="btn-primary" disabled={!selfie} onClick={startProcessing}>
                Enviar para verificación →
              </button>
              <button className="btn-secondary" onClick={() => setStep("reverso")}>← Atrás</button>
            </>
          )}

          {/* ══ PROCESANDO ═══════════════════════════════ */}
          {step === "procesando" && (
            <div className="processing-wrap">
              <div className="process-ring">
                <svg viewBox="0 0 90 90" width="90" height="90">
                  <circle className="ring-bg" cx="45" cy="45" r="40"/>
                  <circle className="ring-fill" cx="45" cy="45" r="40"
                    style={{ strokeDashoffset: 251.2 * (1 - progress / 100) }} />
                </svg>
                <div className="ring-pct">{progress}%</div>
              </div>
              <h2 className="process-title">Verificando tu identidad…</h2>
              <div className="process-steps">
                {[
                  { label:"Analizando frente de INE",  threshold:20 },
                  { label:"Verificando reverso",        threshold:45 },
                  { label:"Comparando selfie biométrica", threshold:65 },
                  { label:"Validando con RENAPO",       threshold:85 },
                ].map(s => {
                  const isDone   = progress > s.threshold + 14;
                  const isActive = progress > s.threshold && !isDone;
                  return (
                    <div key={s.label} className="p-step">
                      <div className={`p-step-icon ${isDone ? "done" : isActive ? "active" : "pending"}`}>
                        {isDone   ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--neon)" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>
                        : isActive ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--neon)" strokeWidth="2"><circle cx="12" cy="12" r="3"/></svg>
                        :            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2"><circle cx="12" cy="12" r="3"/></svg>}
                      </div>
                      <span className={`p-step-text ${isDone || isActive ? "" : "muted"}`}>{s.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ══ ÉXITO ════════════════════════════════════ */}
          {step === "exito" && (
            <div className="success-wrap">
              <div className="success-ring">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--neon)" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
              </div>
              <h2 className="success-title">¡Cuenta verificada!</h2>
              <p className="success-sub">
                Tu identidad fue validada exitosamente. Ya puedes disfrutar de todos los juegos de Regnum Casino.
              </p>
              <div className="summary-rows">
                {[
                  { k:"Usuario",          v: username || "jugador123" },
                  { k:"Estado KYC",       v: "Verificado ✓",    green: true },
                  { k:"Nivel de cuenta",  v: "Premium desbloqueado", green: true },
                  { k:"Depósito máx.",    v: "$50,000 MXN / día" },
                ].map(r => (
                  <div key={r.k} className="s-row">
                    <span className="s-key">{r.k}</span>
                    <span className={`s-val ${r.green ? "green" : ""}`}>{r.v}</span>
                  </div>
                ))}
              </div>
              <button className="btn-primary" onClick={() => alert("Redirigir al lobby")}>
                Ir al Casino →
              </button>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
