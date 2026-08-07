'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function LoginView() {
  const { setIsLoggedIn, setCurrentTeacher, showToast } = useApp();
  const [nip, setNip] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

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
        try {
          localStorage.setItem('sdn_bobong_auth', 'true');
          localStorage.setItem('sdn_bobong_teacher', JSON.stringify(data.teacher));
        } catch (err) {}
        setIsLoggedIn(true);
        showToast(`Selamat datang, ${data.teacher.name}!`, 'success');
      } else {
        setErrorMsg(data.error || 'NIP atau Password salah. Silakan periksa kembali!');
      }
    } catch (err) {
      setErrorMsg('Terjadi kesalahan koneksi. Silakan coba lagi.');
    }
  };

  return (
    <div className="login-wrapper min-h-screen flex flex-col items-center justify-center p-4 bg-slate-950 relative overflow-hidden">
      {/* Background Glowing Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-accent/20 blur-[120px] pointer-events-none animate-pulse duration-5000" />
      
      <Card className="login-card w-full max-w-md shadow-2xl border border-white/25 bg-white/80 backdrop-blur-xl relative z-10 rounded-[28px] p-6 transition-all duration-300 hover:shadow-primary/5 hover:border-white/30">
        <CardHeader className="text-center pb-4 border-none bg-transparent p-0">
          <div className="school-logo-container flex justify-center mb-4 hover:scale-105 transition-transform duration-300">
            <img
              src="/assets/logo-sdn-bobong.png"
              alt="Logo SD Negeri Bobong"
              className="w-24 h-24 object-contain filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.12)]"
            />
          </div>
          <CardTitle className="text-2xl font-black text-slate-800 tracking-wide">
            SD NEGERI BOBONG
          </CardTitle>
          <p className="text-[10px] text-slate-500 font-extrabold uppercase tracking-widest mt-0.5">Kabupaten Pulau Taliabu</p>
        </CardHeader>
 
        <CardContent className="pt-2 p-0">
          {errorMsg && (
            <div className="mb-4 flex items-center gap-2 p-3.5 rounded-2xl bg-rose-50 border border-rose-100 text-rose-700 text-xs font-bold animate-fade-in">
              <i className="ri-error-warning-line text-lg shrink-0 text-rose-500" />
              <span>{errorMsg}</span>
            </div>
          )}
 
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5 text-left text-xs">
              <label className="font-bold text-slate-700 flex items-center gap-1.5 ml-1">
                <i className="ri-id-card-line text-primary" /> NIP Guru
              </label>
              <Input
                type="text"
                placeholder="Masukkan NIP"
                value={nip}
                onChange={e => setNip(e.target.value)}
                required
                autoComplete="username"
                className="h-10 text-xs rounded-xl focus:ring-2 focus:ring-primary/20"
              />
            </div>
 
            <div className="space-y-1.5 text-left text-xs">
              <label className="font-bold text-slate-700 flex items-center gap-1.5 ml-1">
                <i className="ri-lock-password-line text-primary" /> Password
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Masukkan Password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="pr-10 h-10 text-xs rounded-xl focus:ring-2 focus:ring-primary/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <i className={showPassword ? 'ri-eye-off-line' : 'ri-eye-line'} />
                </button>
              </div>
            </div>
 
            <Button type="submit" className="w-full h-11 text-xs font-black shadow-md mt-4 bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white rounded-xl transition-all duration-300 transform active:scale-95 gap-1.5">
              <i className="ri-login-box-line text-base" /> Masuk Aplikasi
            </Button>
          </form>
        </CardContent>
      </Card>
 
      <div className="mt-8 text-center relative z-10">
        <a
          href="https://digital.ibraglobalenglish.uk"
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
