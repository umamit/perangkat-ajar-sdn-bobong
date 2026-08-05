export function backupSystemData(data: {
  students: any[];
  classes: any[];
  teachers: any[];
  journals: any[];
  attendance: any[];
  modules: any[];
}): void {
  const backupPayload = {
    appName: 'Perangkat Ajar Online - SD Negeri Bobong',
    version: '3.9.5',
    backupDate: new Date().toISOString(),
    school: 'SD Negeri Bobong - Kabupaten Pulau Taliabu',
    data,
  };

  const jsonStr = JSON.stringify(backupPayload, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `Backup_Data_SDN_Bobong_${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
