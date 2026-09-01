export async function uploadFileToSupabase(
  bucketName: string,
  path: string,
  file: File
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('path', path);

    const res = await fetch('/api/upload/document', {
      method: 'POST',
      body: formData,
    });

    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      const text = await res.text();
      const statusText = res.statusText || 'Server Error';
      console.warn(`[Storage Server Error in ${bucketName}]`, res.status, statusText, text);

      let errorMsg = `Server error ${res.status}: ${statusText}`;
      if (res.status === 413) {
        errorMsg = 'Ukuran berkas terlalu besar (melebihi batas limit server/proxy 15MB)';
      }
      return { success: false, error: errorMsg };
    }

    const data = await res.json();
    if (data.success && data.url) {
      return { success: true, url: data.url };
    }
    console.warn(`[Storage Upload Error in ${bucketName}]`, data.error);
    return { success: false, error: data.error || 'Gagal mengunggah berkas ke cloud storage' };
  } catch (e: any) {
    console.warn(`[Storage Exception in ${bucketName}]`, e);
    return { success: false, error: e.message || 'Terjadi masalah koneksi saat mengunggah' };
  }
}

export async function uploadAvatarToSupabaseStorage(file: File, nip?: string): Promise<string> {
  try {
    const formData = new FormData();
    formData.append('file', file);
    if (nip) formData.append('nip', nip);

    const res = await fetch('/api/upload/avatar', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    if (data.success && data.url) {
      return data.url;
    }
    console.warn('[Avatar Upload Error]', data.error);
    return '';
  } catch (e) {
    console.warn('[Avatar Upload Exception]', e);
    return '';
  }
}
