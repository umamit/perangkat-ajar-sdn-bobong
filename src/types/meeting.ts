export interface MeetingAttendee {
  nip: string;
  name: string;
  role?: string;
  status: 'Hadir' | 'Izin' | 'Sakit' | 'Alpa';
}

export interface MeetingNote {
  id: string;
  title: string;
  date: string;
  timeStart: string;
  timeEnd?: string;
  location: string;
  leaderName: string;
  leaderNip?: string;
  notaryName: string;
  notaryNip?: string;
  agendaTopics: string;
  discussionSummary: string;
  decisions: string;
  attendees: MeetingAttendee[];
  status: 'Rencana' | 'Selesai';
  createdAt?: string;
}
