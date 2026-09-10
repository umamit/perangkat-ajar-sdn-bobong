import { useState, useEffect, useCallback, useTransition } from "react";

export interface ToastMessage {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

export function useUiState() {
  const [isPending, startTransition] = useTransition();
  const [activeView, setActiveViewState] = useState<string>(() => {
    if (typeof window !== "undefined") {
      try {
        return localStorage.getItem("sdn_bobong_active_view") || "dashboard";
      } catch (e) {
        return "dashboard";
      }
    }
    return "dashboard";
  });

  const setActiveView = useCallback((view: string) => {
    startTransition(() => {
      setActiveViewState(view);
    });
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("sdn_bobong_active_view", activeView);
    } catch (e) {}
  }, [activeView]);

  const [selectedClassFilter, setSelectedClassFilter] = useState<string>("ALL");
  const [activeRoleMode, setActiveRoleMode] = useState<string>("guru_inggris");
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [sidebarCollapsed, setSidebarCollapsedState] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      try {
        return localStorage.getItem("sdn_bobong_sidebar_collapsed") === "true";
      } catch (e) {
        return false;
      }
    }
    return false;
  });

  const setSidebarCollapsed = useCallback((collapsed: boolean) => {
    setSidebarCollapsedState(collapsed);
    try {
      localStorage.setItem("sdn_bobong_sidebar_collapsed", String(collapsed));
    } catch (e) {}
  }, []);

  const showToast = useCallback((message: string, type: "success" | "error" | "info" = "success") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  return {
    activeView, setActiveView,
    selectedClassFilter, setSelectedClassFilter,
    activeRoleMode, setActiveRoleMode,
    toasts, setToasts,
    isLoading, setIsLoading,
    sidebarOpen, setSidebarOpen,
    sidebarCollapsed, setSidebarCollapsed,
    showToast
  };
}
