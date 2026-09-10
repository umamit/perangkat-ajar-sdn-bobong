import { useMemo } from "react";

export function useLaporanCalculations({ students, classes, journals, attendance, currentTeacher, grades, schoolSettings, selectedSubject, selectedClassExplorer }: any) {
  const isKepsek = currentTeacher?.nip === "199610272019032006";
  const lockedClass = currentTeacher?.role?.match(/Wali Kelas\s+([1-6][A-B]?)/i)?.[1] || null;

  const filteredStudents = isKepsek ? students : lockedClass ? students.filter((s: any) => s.classId === lockedClass) : students;
  const filteredClasses = isKepsek ? classes : lockedClass ? classes.filter((c: any) => c.id === lockedClass) : classes;
  const filteredAttendance = isKepsek ? attendance : lockedClass
    ? attendance.filter((a: any) => students.find((s: any) => s.id === (a.student_id || a.studentId))?.classId === lockedClass)
    : attendance;

  const totalDays = filteredAttendance.length;
  const totalHadir = filteredAttendance.filter((a: any) => a.status === "Hadir").length;
  const averageAttendanceRate = totalDays > 0 ? Math.round((totalHadir / totalDays) * 100) : 0;

  const classStats = filteredClasses.map((c: any) => {
    const cStudents = students.filter((s: any) => s.classId === c.id);
    let totalAtt = 0, totalPres = 0, totalG = 0;
    cStudents.forEach((st: any) => {
      const atts = attendance.filter((a: any) => a.student_id === st.id || a.studentId === st.id);
      totalAtt += atts.length;
      totalPres += atts.filter((a: any) => a.status === "Hadir").length;
      const f = grades.find((g: any) => g.student_id === st.id && g.type === "Formatif" && g.subject === selectedSubject)?.score || 0;
      const s = grades.find((g: any) => g.student_id === st.id && g.type === "STS" && g.subject === selectedSubject)?.score || 0;
      const a = grades.find((g: any) => g.student_id === st.id && g.type === "SAS" && g.subject === selectedSubject)?.score || 0;
      totalG += Math.round((Number(f) * 0.4) + (Number(s) * 0.3) + (Number(a) * 0.3));
    });
    return {
      name: c.name, studentCount: cStudents.length,
      attendanceRate: totalAtt > 0 ? Math.round((totalPres / totalAtt) * 100) : 0,
      gradeAverage: cStudents.length > 0 ? Math.round(totalG / cStudents.length) : 0
    };
  });

  const studentDetails = students.filter((s: any) => s.classId === selectedClassExplorer).map((s: any) => {
    const atts = attendance.filter((a: any) => a.student_id === s.id || a.studentId === s.id);
    const pres = atts.filter((a: any) => a.status === "Hadir").length;
    const f = grades.find((g: any) => g.student_id === s.id && g.type === "Formatif" && g.subject === selectedSubject)?.score || 0;
    const st = grades.find((g: any) => g.student_id === s.id && g.type === "STS" && g.subject === selectedSubject)?.score || 0;
    const sa = grades.find((g: any) => g.student_id === s.id && g.type === "SAS" && g.subject === selectedSubject)?.score || 0;
    return {
      name: s.name, nis: s.nis || "-",
      attendanceRate: atts.length > 0 ? Math.round((pres / atts.length) * 100) : 0,
      gradeAverage: Math.round((Number(f) * 0.4) + (Number(st) * 0.3) + (Number(sa) * 0.3))
    };
  });

  const monthlyAttendanceData = useMemo(() => {
    const isGenap = schoolSettings?.semester?.toLowerCase().includes("genap");
    const targetMonths = isGenap
      ? [{ name: "Jan", num: 0 }, { name: "Feb", num: 1 }, { name: "Mar", num: 2 }, { name: "Apr", num: 3 }, { name: "Mei", num: 4 }, { name: "Jun", num: 5 }]
      : [{ name: "Jul", num: 6 }, { name: "Agt", num: 7 }, { name: "Sep", num: 8 }, { name: "Okt", num: 9 }, { name: "Nov", num: 10 }, { name: "Des", num: 11 }];
    const cStudents = students.filter((s: any) => s.classId === selectedClassExplorer);
    return targetMonths.map(m => {
      const records = attendance.filter((a: any) => {
        if (!cStudents.some((s: any) => s.id === (a.student_id || a.studentId)) || !a.date) return false;
        return new Date(a.date).getMonth() === m.num;
      });
      const pres = records.filter((a: any) => a.status === "Hadir").length;
      const pct = records.length > 0 ? Math.round((pres / records.length) * 105) : 0;
      return { name: m.name, pct: pct > 100 ? 100 : pct };
    });
  }, [selectedClassExplorer, students, attendance, schoolSettings]);

  return { isKepsek, lockedClass, filteredStudents, filteredClasses, filteredAttendance, averageAttendanceRate, classStats, studentDetails, monthlyAttendanceData };
}
