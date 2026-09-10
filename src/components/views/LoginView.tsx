'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { LoginFormCard } from './login/LoginFormCard';

export function LoginView() {
  const { setIsLoggedIn, setCurrentTeacher, showToast, syncData } = useApp();
  const [nip, setNip] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    const inputNip = nip.trim();
    const inputPass = password.trim();

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nip: inputNip, password: inputPass })
      });
      const data = await res.json();

      if (data.success && data.teacher) {
        setCurrentTeacher(data.teacher);
        document.cookie = 'sdn_bobong_auth=true; path=/; max-age=604800';
        document.cookie = `sdn_bobong_nip=${data.teacher.nip}; path=/; max-age=604800`;
        try {
          localStorage.setItem('sdn_bobong_auth', 'true');
          localStorage.setItem('sdn_bobong_teacher', JSON.stringify(data.teacher));
        } catch (err) {}
        setIsLoggedIn(true);
        await syncData();
        showToast(`Selamat datang, ${data.teacher.name}!`, 'success');
      } else {
        setErrorMsg(data.error || 'NIP atau Password salah. Silakan periksa kembali!');
      }
    } catch (err) {
      setErrorMsg('Terjadi kesalahan koneksi. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-wrapper min-h-screen flex flex-col items-center justify-center p-4 bg-slate-950 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-accent/20 blur-[120px] pointer-events-none animate-pulse duration-5000" />
      
      <LoginFormCard
        nip={nip}
        setNip={setNip}
        password={password}
        setPassword={setPassword}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        errorMsg={errorMsg}
        isSubmitting={isSubmitting}
        handleSubmit={handleSubmit}
      />

      <div className="mt-8 text-center relative z-10">
        <a
          href="https://ibradigital.id"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-primary transition-colors duration-200"
        >
          <span>Developed by IBRA Digital Engineering</span>
          <img
            src="/assets/logo-ide.png"
            alt="IBRA Digital Engineering Logo"
            className="w-4 h-4 rounded-full object-contain inline-block border border-slate-700"
          />
        </a>
      </div>
    </div>
  );
}
