import { useState, useEffect } from "react";
import { Teacher } from "@/types";

export const defaultTeacher: Teacher = {
  nip: "199610272019032006",
  name: "Husnita Usman, M.Pd",
  role: "Kepala Sekolah / Executive Admin",
  subject: "Bahasa Inggris & Manajemen Sekolah",
  school: "SD Negeri Bobong",
  kecamatan: "Kabupaten Pulau Taliabu",
  avatar: "/assets/logo-sdn-bobong.png"
};

export function useAuthSession() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [currentTeacher, setCurrentTeacher] = useState<Teacher>(defaultTeacher);
  const [isInitializing, setIsInitializing] = useState<boolean>(true);

  useEffect(() => {
    try {
      const localAuth = localStorage.getItem("sdn_bobong_auth");
      const cookieAuth = document.cookie.split("; ").find(row => row.startsWith("sdn_bobong_auth="));
      const authed = localAuth === "true" || (cookieAuth ? cookieAuth.split("=")[1] === "true" : false);
      
      setIsLoggedIn(authed);
      if (authed) {
        const saved = localStorage.getItem("sdn_bobong_teacher");
        if (saved) {
          const parsed = JSON.parse(saved);
          setCurrentTeacher(parsed);
          if (parsed?.nip) {
            document.cookie = "sdn_bobong_auth=true; path=/; max-age=604800; SameSite=Lax";
            document.cookie = `sdn_bobong_nip=${parsed.nip}; path=/; max-age=604800; SameSite=Lax`;
          }
        }
      }
    } catch (e) {
      console.warn("[Session Recovery Failed]", e);
    } finally {
      setIsInitializing(false);
    }
  }, []);

  return { isLoggedIn, setIsLoggedIn, currentTeacher, setCurrentTeacher, isInitializing, setIsInitializing };
}
