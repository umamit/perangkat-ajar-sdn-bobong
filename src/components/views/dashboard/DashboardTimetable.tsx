"use client";

import React from "react";
import { DashboardScheduleCard } from "./DashboardScheduleCard";
import { DashboardRecentJournalsCard } from "./DashboardRecentJournalsCard";

export function DashboardTimetable({ timetable, journals, onViewAllJournals }: any) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <DashboardScheduleCard timetable={timetable} />
      <DashboardRecentJournalsCard journals={journals} onViewAllJournals={onViewAllJournals} />
    </div>
  );
}
