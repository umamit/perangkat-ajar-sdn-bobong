export function getFallbackForm(prompt: string, formType: string) {
  const p = prompt.toLowerCase();
  
  if (p.includes('kepuasan') || p.includes('survei')) {
    return {
      title: 'Survei Kepuasan Layanan Pendidikan SD Negeri Bobong',
      description: 'Instrumen evaluasi kepuasan masyarakat dan wali murid terhadap mutu layanan pembelajaran serta sarana prasarana sekolah.',
      type: 'assessment',
      fields: [
        {
          type: 'dropdown',
          label: 'Status Responden',
          is_required: true,
          options: [
            { label: 'Orang Tua / Wali Murid', value: 'wali_murid' },
            { label: 'Tokoh Masyarakat / Komite', value: 'komite' },
            { label: 'Alumni / Pengunjung', value: 'pengunjung' },
          ]
        },
        {
          type: 'linear_scale',
          label: 'Keramahan, kesantunan, dan ketanggapan komunikasi guru/staf sekolah',
          scale_min: 1,
          scale_max: 5,
          scale_min_label: 'Sangat Tidak Puas',
          scale_max_label: 'Sangat Puas',
          is_required: true,
        },
        {
          type: 'linear_scale',
          label: 'Kebersihan, kenyamanan, dan keamanan lingkungan belajar anak',
          scale_min: 1,
          scale_max: 5,
          scale_min_label: 'Sangat Tidak Puas',
          scale_max_label: 'Sangat Puas',
          is_required: true,
        },
        {
          type: 'linear_scale',
          label: 'Kualitas dan transparansi perkembangan proses belajar mengajar siswa',
          scale_min: 1,
          scale_max: 5,
          scale_min_label: 'Sangat Tidak Puas',
          scale_max_label: 'Sangat Puas',
          is_required: true,
        },
        {
          type: 'textarea',
          label: 'Kritik, saran, atau masukan untuk peningkatan mutu SD Negeri Bobong',
          is_required: false,
        }
      ]
    };
  }

  // Default Fallback: Instrumen Asesmen Karakter Profil Pelajar Pancasila / Observasi Pembelajaran
  return {
    title: 'Instrumen Asesmen Observasi Perkembangan Pembelajaran Siswa',
    description: 'Format lembar asesmen diagnostik dan formatif berkala berbasis capaian kompetensi Kurikulum Merdeka.',
    type: 'assessment',
    fields: [
      {
        type: 'text',
        label: 'Nama Siswa yang Dinilai',
        is_required: true,
      },
      {
        type: 'linear_scale',
        label: 'Kemandirian dan inisiatif dalam menyelesaikan tugas belajar',
        scale_min: 1,
        scale_max: 4,
        scale_min_label: 'Perlu Bimbingan',
        scale_max_label: 'Sangat Mahir',
        is_required: true,
      },
      {
        type: 'linear_scale',
        label: 'Kolaborasi, gotong royong, dan keaktifan dalam diskusi kelompok',
        scale_min: 1,
        scale_max: 4,
        scale_min_label: 'Perlu Bimbingan',
        scale_max_label: 'Sangat Mahir',
        is_required: true,
      },
      {
        type: 'linear_scale',
        label: 'Kemampuan bernalar kritis dan menyampaikan argumen logis',
        scale_min: 1,
        scale_max: 4,
        scale_min_label: 'Perlu Bimbingan',
        scale_max_label: 'Sangat Mahir',
        is_required: true,
      },
      {
        type: 'textarea',
        label: 'Catatan rekomendasi pembinaan guru terhadap siswa',
        is_required: false,
      }
    ]
  };
}
