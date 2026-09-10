import { useMemo } from "react";
import { NotificationItem } from "./NotificationDropdown";

export function useNotificationGenerator({ students, attendance, journals, assignments, lockedClass, todayStr, currentTeacher, isKepsek }: any) {
  return useMemo(() => {
    const alerts: NotificationItem[] = [];
    if (lockedClass) {
      const classStudents = students.filter((s: any) => s.classId === lockedClass);
      const todayAttendance = attendance.filter((a: any) => a.date === todayStr);
      const filled = classStudents.length > 0 && classStudents.every((s: any) =>
        todayAttendance.some((a: any) => a.student_id === s.id || a.studentId === s.id)
      );
      if (!filled) {
        alerts.push({
          id: "attendance-today", text: `Presensi siswa Kelas ${lockedClass} hari ini belum diisi.`,
          type: "warning", icon: "ri-checkbox-blank-circle-line", targetView: "absensi"
        });
      }
    }
    const filledJournal = journals.some((j: any) => j.date === todayStr && j.teacherNip === currentTeacher?.nip);
    if (!filledJournal && currentTeacher?.nip !== "199610272019032006") {
      alerts.push({
        id: "journal-today", text: "Jurnal mengajar Anda hari ini belum diisi.",
        type: "warning", icon: "ri-book-read-line", targetView: "jurnal"
      });
    }
    const activeTasks = assignments || [];
    activeTasks.forEach((a: any) => {
      if (a.status === "Aktif" && a.dueDate) {
        const due = new Date(a.dueDate).getTime();
        const diffDays = Math.ceil((due - new Date(todayStr).getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays >= 0 && diffDays <= 3) {
          const timeText = diffDays <= 0 ? "Jatuh tempo HARI INI!" : (diffDays === 1 ? "Berakhir BESOK (1 hari lagi)" : `Berakhir dalam ${diffDays} hari`);
          alerts.push({
            id: `task-due-${a.id}`, text: `Tenggat tugas "${a.title}" (${a.dueDate}) ${timeText}.`,
            type: "info", icon: "ri-time-line", targetView: "tugas"
          });
        }
      }
    });
    if (isKepsek) {
      const pending = activeTasks.filter((a: any) => a.status === "Menunggu Verifikasi");
      if (pending.length > 0) {
        alerts.push({
          id: "pending-verification-soal", text: `Ada ${pending.length} naskah tugas/soal baru publik yang membutuhkan verifikasi Kepala Sekolah.`,
          type: "warning", icon: "ri-shield-check-line", targetView: "tugas"
        });
      }
    }
    return alerts;
  }, [students, attendance, journals, assignments, lockedClass, todayStr, currentTeacher, isKepsek]);
}
