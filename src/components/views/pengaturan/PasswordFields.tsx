import React, { useState } from "react";
import { Input } from "@/components/ui/input";

export function PasswordFields({ register, errors }: any) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
      <div className="space-y-1 text-left font-semibold">
        <label className="font-bold text-slate-800 flex items-center gap-1">
          <i className="ri-key-line text-slate-500" />
          <span>Kata Sandi Lama (Verifikasi):</span>
        </label>
        <Input type="password" {...register("oldPassword")} placeholder="Masukkan sandi lama" className="font-mono h-9 rounded-xl" />
        {errors.oldPassword && <p className="text-[10px] text-rose-500 font-bold mt-0.5">{errors.oldPassword.message}</p>}
      </div>

      <div className="space-y-1 text-left font-semibold">
        <label className="font-bold text-slate-800 flex items-center gap-1">
          <i className="ri-lock-password-line text-primary" />
          <span>Kata Sandi Baru:</span>
        </label>
        <div className="relative">
          <Input type={showPassword ? "text" : "password"} {...register("password")} placeholder="Sandi baru" className="pr-10 font-mono h-9 rounded-xl" />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600">
            <i className={showPassword ? "ri-eye-off-line" : "ri-eye-line"} />
          </button>
        </div>
        {errors.password && <p className="text-[10px] text-rose-500 font-bold mt-0.5">{errors.password.message}</p>}
      </div>
    </div>
  );
}
