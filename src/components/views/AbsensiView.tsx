'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RiwayatPresensiCard } from './absensi/RiwayatPresensiCard';
import { StatCards } from './absensi/StatCards';
import { AttendanceTable } from './absensi/AttendanceTable';
import { AttendanceHeader } from './absensi/AttendanceHeader';
import { AttendanceDateSelector } from './absensi/AttendanceDateSelector';
import { AttendanceAiAnalyst } from './absensi/AttendanceAiAnalyst';
import { useAttendanceState } from './absensi/useAttendanceState';

export function AbsensiView() {
  const {
    classes, selectedClass, setSelectedClass, lockedClass, date, setDate,
    classStudents, currentStatuses, setCurrentStatuses, getStatusKey,
    currentHadir, currentIzin, currentSakit, currentAlpa, currentUnselected,
    pctHadir, pctIzin, pctSakit, pctAlpa, aggregatedHistory,
    handleStatusChange, handleMarkAllHadir, handleSaveAbsensi,
    handleDownloadPDF, handleExportExcel,
  } = useAttendanceState();

  return (
    <div className="flex flex-col gap-6 animate-fade-in text-slate-800">
      <AttendanceHeader
        onExportExcel={handleExportExcel}
        onDownloadPDF={handleDownloadPDF}
        onMarkAllHadir={handleMarkAllHadir}
      />

      <StatCards
        currentHadir={currentHadir} pctHadir={pctHadir}
        currentIzin={currentIzin} pctIzin={pctIzin}
        currentSakit={currentSakit} pctSakit={pctSakit}
        currentAlpa={currentAlpa} pctAlpa={pctAlpa}
        currentUnselected={currentUnselected}
      />

      <AttendanceAiAnalyst selectedClass={selectedClass} />

      <Card className="rounded-2xl border border-white/80 bg-white/70 backdrop-blur-md shadow-sm overflow-hidden">
        <CardHeader className="pb-4 border-b border-slate-100 bg-white/35">
          <CardTitle className="text-sm font-extrabold flex items-center gap-2">
            <i className="ri-edit-line text-primary" /> Input Presensi Kelas
          </CardTitle>
          <AttendanceDateSelector
            selectedClass={selectedClass}
            setSelectedClass={setSelectedClass}
            lockedClass={lockedClass}
            classes={classes}
            date={date}
            setDate={setDate}
            onSave={handleSaveAbsensi}
            onClassChangeReset={() => setCurrentStatuses({})}
          />
        </CardHeader>
        <CardContent className="p-0">
          <AttendanceTable
            classStudents={classStudents}
            currentStatuses={currentStatuses}
            getStatusKey={getStatusKey}
            onStatusChange={handleStatusChange}
          />
        </CardContent>
      </Card>

      <RiwayatPresensiCard attendance={aggregatedHistory} />
    </div>
  );
}
