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
    <div className="login-wrapper min-h-screen flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
      <Card className="login-card w-full max-w-md shadow-2xl border-white/80 glass-panel">
        <CardHeader className="text-center pb-2 border-none bg-transparent p-0">
          <div className="school-logo-container flex justify-center mb-3">
            <img
              src="/assets/logo-sdn-bobong.png"
              alt="Logo SD Negeri Bobong"
              className="w-24 h-24 object-contain filter drop-shadow-md"
            />
          </div>
          <CardTitle className="text-xl font-extrabold text-slate-800 tracking-wide">
            SD NEGERI BOBONG
          </CardTitle>
          <p className="text-xs text-slate-500 font-semibold">Kabupaten Pulau Taliabu</p>
        </CardHeader>

        <CardContent className="pt-2">
          {errorMsg && (
            <div className="mb-4 flex items-center gap-2 p-3 rounded-apple-sm bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
              <i className="ri-error-warning-line text-lg shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1 text-left">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <i className="ri-id-card-line text-primary" /> NIP Guru
              </label>
              <Input
                type="text"
                placeholder="Masukkan NIP"
                value={nip}
                onChange={e => setNip(e.target.value)}
                required
                autoComplete="username"
              />
            </div>

            <div className="space-y-1 text-left">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
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
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  <i className={showPassword ? 'ri-eye-off-line' : 'ri-eye-line'} />
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full h-11 text-base font-bold shadow-md mt-2">
              <i className="ri-login-box-line text-lg" /> Masuk Aplikasi
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="mt-6 text-center">
        <a
          href="https://digital.ibraglobalenglish.uk"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-cyan-300 transition-colors duration-200"
        >
          <span>Developed by IBRA Digital Engineering</span>
          <img
            src="/assets/logo-ide.png"
            alt="IBRA Digital Engineering Logo"
            className="w-4 h-4 rounded-full object-contain inline-block"
          />
        </a>
      </div>
    </div>
  );
}
