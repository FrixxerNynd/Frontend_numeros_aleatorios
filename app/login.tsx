"use client";

import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1800);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700&family=EB+Garamond:ital,wght@0,400;0,500;0,700;1,400&display=swap');

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
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .scene {
          position: fixed; inset: 0; z-index: 0;
          background: radial-gradient(ellipse 80% 60% at 50% -10%, #1C3D30 0%, #0D1F18 60%);
        }
        .scene::before {
          content: '';
          position: absolute; inset: 0;
          background-image:
            repeating-linear-gradient(0deg, transparent, transparent 79px, rgba(0,245,128,0.03) 80px),
            repeating-linear-gradient(90deg, transparent, transparent 79px, rgba(0,245,128,0.03) 80px);
        }
        .scene::after {
          content: '';
          position: absolute;
          width: 600px; height: 600px; border-radius: 50%;
          background: radial-gradient(circle, rgba(0,245,128,0.06) 0%, transparent 70%);
          top: -200px; left: 50%; transform: translateX(-50%);
          pointer-events: none;
        }

        .orb {
          position: fixed; border-radius: 50%;
          filter: blur(80px); pointer-events: none; z-index: 0;
        }
        .orb-1 {
          width: 400px; height: 400px;
          background: rgba(58,125,94,0.18);
          bottom: -100px; right: -100px;
          animation: drift1 12s ease-in-out infinite alternate;
        }
        .orb-2 {
          width: 300px; height: 300px;
          background: rgba(201,150,47,0.10);
          top: 50px; left: -80px;
          animation: drift2 15s ease-in-out infinite alternate;
        }
        @keyframes drift1 { from { transform: translate(0,0); } to { transform: translate(-40px,-60px); } }
        @keyframes drift2 { from { transform: translate(0,0); } to { transform: translate(50px,40px); } }

        .card {
          position: relative; z-index: 1;
          width: 100%; max-width: 440px;
          margin: 0 16px;
          background: linear-gradient(160deg, rgba(18,38,25,0.95) 0%, rgba(13,31,24,0.98) 100%);
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 48px 44px 44px;
          box-shadow: 0 0 0 1px rgba(0,245,128,0.05), 0 32px 80px rgba(0,0,0,0.6);
          animation: rise 0.6s cubic-bezier(0.22,1,0.36,1) both;
        }
        @keyframes rise {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .logo { text-align: center; margin-bottom: 32px; }
        .logo-symbol {
          display: inline-flex; align-items: center; justify-content: center;
          width: 52px; height: 52px; border-radius: 14px;
          background: linear-gradient(135deg, var(--green-1), var(--green-3));
          border: 1px solid rgba(0,245,128,0.25);
          margin-bottom: 14px;
          box-shadow: 0 0 24px rgba(0,245,128,0.15);
        }
        .logo-name {
          font-family: 'EB Garamond', serif;
          font-size: 26px; font-weight: 700; letter-spacing: 0.06em;
          color: var(--text); display: block;
        }
        .logo-name span { color: var(--gold); }
        .logo-tagline {
          font-size: 10px; font-weight: 300; letter-spacing: 0.28em;
          text-transform: uppercase; color: var(--muted);
          margin-top: 4px; display: block;
        }

        .badge {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 4px 10px; border-radius: 20px;
          border: 1px solid rgba(201,150,47,0.3);
          background: rgba(201,150,47,0.07);
          font-size: 10px; font-weight: 400; letter-spacing: 0.08em;
          color: var(--gold); margin-bottom: 28px;
        }
        .badge-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: var(--gold);
          animation: pulse 2s ease infinite;
        }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }

        .section-title {
          font-family: 'EB Garamond', serif;
          font-size: 22px; font-weight: 700;
          margin-bottom: 6px;
        }
        .section-sub {
          font-size: 12px; font-weight: 300; color: var(--muted);
          margin-bottom: 28px; line-height: 1.6;
        }

        .form-group { margin-bottom: 18px; }
        .form-label {
          display: block; font-size: 11px; font-weight: 500;
          letter-spacing: 0.1em; text-transform: uppercase;
          color: var(--muted); margin-bottom: 8px;
        }
        .form-input {
          width: 100%; padding: 13px 16px;
          background: rgba(0,0,0,0.25);
          border: 1px solid rgba(0,245,128,0.12);
          border-radius: 10px;
          font-family: 'Lexend', sans-serif;
          font-size: 14px; font-weight: 300; color: var(--text);
          outline: none;
          transition: border-color .2s, box-shadow .2s, background .2s;
        }
        .form-input::placeholder { color: rgba(122,155,138,0.5); }
        .form-input:focus {
          border-color: rgba(0,245,128,0.4);
          background: rgba(0,0,0,0.35);
          box-shadow: 0 0 0 3px rgba(0,245,128,0.06);
        }

        .forgot {
          text-align: right; margin-bottom: 20px; margin-top: -6px;
        }
        .link {
          color: var(--neon); text-decoration: none;
          font-size: 12px; font-weight: 400;
        }
        .link:hover { text-decoration: underline; }

        .btn-primary {
          width: 100%; padding: 15px; border: none; border-radius: 10px;
          background: linear-gradient(135deg, var(--neon), #00C468);
          color: var(--green-3);
          font-family: 'Lexend'; font-size: 14px; font-weight: 600;
          letter-spacing: 0.06em; text-transform: uppercase;
          cursor: pointer; margin-top: 4px;
          transition: transform .15s, box-shadow .2s;
          box-shadow: 0 4px 20px rgba(0,245,128,0.25);
        }
        .btn-primary:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 8px 28px rgba(0,245,128,0.35);
        }
        .btn-primary:disabled { opacity: .65; cursor: not-allowed; }

        .spinner {
          display: inline-block; width: 16px; height: 16px;
          border: 2px solid rgba(28,61,48,0.3);
          border-top-color: var(--green-3);
          border-radius: 50%;
          animation: spin .7s linear infinite;
          vertical-align: middle; margin-right: 8px;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .divider {
          display: flex; align-items: center; gap: 12px; margin: 24px 0;
        }
        .divider-line { flex: 1; height: 1px; background: var(--border); }
        .divider-text { font-size: 11px; font-weight: 300; color: var(--muted); letter-spacing: .1em; }

        .btn-social {
          width: 100%; padding: 13px;
          border: 1px solid var(--border); border-radius: 10px;
          background: rgba(0,0,0,0.2); color: var(--text);
          font-family: 'Lexend'; font-size: 13px; font-weight: 400;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 10px;
          transition: border-color .2s, background .2s;
        }
        .btn-social:hover {
          border-color: rgba(0,245,128,0.3);
          background: rgba(0,0,0,0.35);
        }

        .footer-text {
          text-align: center; margin-top: 24px;
          font-size: 12px; font-weight: 300; color: var(--muted); line-height: 1.6;
        }
      `}</style>

      <div className="scene" />
      <div className="orb orb-1" />
      <div className="orb orb-2" />

      <div className="card">
        {/* Logo */}
        <div className="logo">
          <div className="logo-symbol">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="#00F580">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          <span className="logo-name">Regnum <span>Casino</span></span>
          <span className="logo-tagline">Where Fortune Meets Elegance</span>
        </div>

        {/* Badge */}
        <div style={{ textAlign: "center" }}>
          <span className="badge">
            <span className="badge-dot" />
            3,842 jugadores en línea
          </span>
        </div>

        <h2 className="section-title">Bienvenido de vuelta</h2>
        <p className="section-sub">Ingresa tus credenciales para acceder a tu cuenta.</p>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Correo electrónico</label>
            <input
              type="email"
              className="form-input"
              placeholder="correo@ejemplo.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="forgot">
            <a href="#" className="link">¿Olvidaste tu contraseña?</a>
          </div>

          <button type="submit" className="btn-primary" disabled={isLoading}>
            {isLoading
              ? <><span className="spinner" />Verificando...</>
              : "Entrar al Casino"
            }
          </button>
        </form>

        {/* Social */}
        <div className="divider">
          <div className="divider-line" />
          <span className="divider-text">o continúa con</span>
          <div className="divider-line" />
        </div>

        <button className="btn-social">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continuar con Google
        </button>

        <p className="footer-text">
          ¿Aún no tienes cuenta?{" "}
          <Link href="/register" className="link">Regístrate gratis</Link>
        </p>
      </div>
    </>
  );
}
