"use client";

import { useState, useEffect, useRef } from "react";
import { Lock, Mail, AlertCircle } from "lucide-react";

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

// Ayrı bir inner component — open her değiştiğinde key prop'u ile unmount/remount
// yapılır; böylece state otomatik sıfırlanır, useEffect içinde setState'e gerek kalmaz.
function LoginForm({
  onClose,
  onSuccess,
}: Pick<LoginModalProps, "onClose" | "onSuccess">) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);

  // Focus — sadece dış sistemi (DOM) etkiliyor, setState yok → kurala uygun
  useEffect(() => {
    const id = setTimeout(() => emailRef.current?.focus(), 100);
    return () => clearTimeout(id);
  }, []);

  // Klavye kısayolu — harici event listener, setState yok → kurala uygun
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  function doLogin() {
    if (email === "admin@nomad.app" && pass === "nomad2026") {
      onSuccess();
    } else {
      setError(true);
      setPass("");
    }
  }

  return (
    <div className="nomad-modal-body">
      {error && (
        <div className="nomad-error-msg">
          <AlertCircle size={13} />
          Hatalı e-posta veya şifre. İpucu: admin / nomad2026
        </div>
      )}

      <div className="nomad-form-group">
        <label className="nomad-form-label">E-posta</label>
        <Mail size={15} className="nomad-form-icon" />
        <input
          ref={emailRef}
          className="nomad-form-input"
          type="email"
          placeholder="admin@nomad.app"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="nomad-form-group">
        <label className="nomad-form-label">Şifre</label>
        <Lock size={15} className="nomad-form-icon" />
        <input
          className="nomad-form-input"
          type="password"
          placeholder="••••••••"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") doLogin();
          }}
        />
      </div>

      <button className="nomad-btn-submit" onClick={doLogin}>
        Giriş Yap
      </button>

      <div className="nomad-modal-hint">Demo: admin@nomad.app · nomad2026</div>
    </div>
  );
}

// Dış wrapper — sadece overlay + modal kabuğunu render eder.
// key={open ? 1 : 0} → open true olduğunda LoginForm yeniden mount edilir,
// tüm state sıfırlanır; useEffect içinde setState'e gerek kalmaz.
export default function LoginModal({
  open,
  onClose,
  onSuccess,
}: LoginModalProps) {
  if (!open) return null;

  return (
    <div
      className="nomad-modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="nomad-modal" onClick={(e) => e.stopPropagation()}>
        <div className="nomad-modal-header">
          <div className="nomad-modal-header-grid" />
          <div className="nomad-modal-logo">
            Nomad <span>[o]</span>
          </div>
          <div className="nomad-modal-eyebrow">
            Admin Girişi · Yönetim Paneli
          </div>
        </div>

        {/* key prop ile her açılışta taze mount → state sıfır başlar */}
        <LoginForm key="login-form" onClose={onClose} onSuccess={onSuccess} />
      </div>
    </div>
  );
}
