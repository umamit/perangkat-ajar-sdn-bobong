"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import { getTeacherAssignedClass } from "@/lib/utils";
import { DashboardCharts } from "./dashboard/DashboardCharts";
import { KepsekStats } from "./dashboard/KepsekStats";
import { DashboardTimetable } from "./dashboard/DashboardTimetable";
import { DashboardHero } from "./dashboard/DashboardHero";
import { DashboardMetricCards } from "./dashboard/DashboardMetricCards";

export function DashboardView() {
  const { students, classes, modules, journals, setActiveView, currentTeacher, teachers, attendance, grades } = useApp();

  const isKepsek = !!(currentTeacher?.role?.toLowerCase().includes("kepala sekolah") || currentTeacher?.role?.toLowerCase().includes("admin") || currentTeacher?.nip === "199610272019032006");
  const lockedClass = getTeacherAssignedClass(currentTeacher?.role, currentTeacher?.subject);
  const totalStudents = lockedClass ? students.filter(s => s.classId === lockedClass).length : students.length;
  const totalClasses = lockedClass ? 1 : classes.length;

  const timetable = [
    { day: "Senin", time: "07.30 - 08.40", classId: "1A", topic: "Unit 1: Greetings & Expressions" },
    { day: "Senin", time: "09.00 - 10.10", classId: "4A", topic: "Unit 1: What Are You Doing?" },
    { day: "Selasa", time: "07.30 - 08.40", classId: "2A", topic: "Unit 1: My Family & Pets" },
    { day: "Rabu", time: "08.40 - 09.50", classId: "5A", topic: "Unit 2: Tastes & Favorite Foods" },
    { day: "Kamis", time: "09.00 - 10.10", classId: "6A", topic: "Unit 2: Past Events & History" },
    { day: "Jumat", time: "08.00 - 09.10", classId: "3A", topic: "Unit 1: Animals Around Us" }
  ];

  return (
    <div className="flex flex-col gap-8 animate-fade-in text-slate-800">
      <DashboardHero currentTeacher={currentTeacher} setActiveView={setActiveView} />
      <DashboardMetricCards totalStudents={totalStudents} totalClasses={totalClasses} totalModules={modules.length} totalJournals={journals.length} lockedClass={lockedClass} />
      <DashboardCharts />
      <DashboardTimetable timetable={timetable} journals={journals} onViewAllJournals={() => setActiveView("jurnal")} />
      {isKepsek && <KepsekStats teachers={teachers} students={students} classes={classes} journals={journals} attendance={attendance} grades={grades} />}
    </div>
  );
}
