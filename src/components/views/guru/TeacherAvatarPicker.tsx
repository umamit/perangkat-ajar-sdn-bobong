import React from "react";

export function TeacherAvatarPicker({ avatarPreview, avatarFile, handleAvatarChange }: any) {
  return (
    <div className="flex flex-col items-center justify-center py-2 space-y-2">
      <div className="relative group w-20 h-20 rounded-full overflow-hidden border-2 border-slate-200 shadow-sm bg-slate-50 transition-all hover:border-primary/85">
        <img src={avatarPreview || "/assets/logo-sdn-bobong.png"} alt="Avatar Preview" className="w-full h-full object-cover" />
        <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
          <i className="ri-camera-switch-line text-white text-lg" />
          <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
        </label>
      </div>
      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">
        {avatarFile ? avatarFile.name : "Pilih Foto Profil Guru"}
      </span>
    </div>
  );
}
