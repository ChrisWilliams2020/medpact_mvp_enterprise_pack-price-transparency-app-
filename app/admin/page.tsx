"use client";

import * as React from "react";
import { Button } from "@/components/ui";

export default function AdminPage() {
  const [member, setMember] = React.useState('');
  const [file, setFile] = React.useState<File | null>(null);
  const [status, setStatus] = React.useState('');
  const [files, setFiles] = React.useState<{ name: string; url: string }[]>([]);

  async function refreshFiles() {
    try {
      const res = await fetch('/api/media');
      const json = await res.json();
      setFiles(json?.files || []);
    } catch (e) {}
  }

  React.useEffect(() => { refreshFiles(); }, []);

  async function uploadAsMultipart(filenamePrefix = '') {
    if (!file) return setStatus('No file selected');
    setStatus('Uploading...');
    try {
      // If S3 configured, try presign flow
      const presignRes = await fetch('/api/s3/presign', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ filename: (filenamePrefix ? `${filenamePrefix}-${file.name}` : file.name) }) });
      if (presignRes.ok) {
        const presign = await presignRes.json();
        const uploadUrl = presign?.url;
        const publicUrl = presign?.publicUrl || uploadUrl;
        if (uploadUrl) {
          // upload via PUT to presigned URL
          await fetch(uploadUrl, { method: 'PUT', headers: { 'Content-Type': file.type || 'application/octet-stream' }, body: file });
          // set mapping if key provided
          if (filenamePrefix) await fetch('/api/mapping/set', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: filenamePrefix, url: publicUrl }) });
          setStatus(`Uploaded: ${publicUrl}`);
          await refreshFiles();
          return;
        }
      }
      // fallback to server upload
      const fd = new FormData();
      fd.append('file', file);
      if (filenamePrefix) fd.append('key', filenamePrefix);
      const res = await fetch('/api/upload-photo', { method: 'POST', body: fd });
      const json = await res.json();
      if (json?.url) setStatus(`Uploaded: ${json.url}`);
      await refreshFiles();
    } catch (e: any) {
      setStatus(String(e));
    }
  }

  async function deleteFile(name: string) {
    setStatus('Deleting...');
    const res = await fetch('/api/media', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name }) });
    if (res.ok) {
      setStatus('Deleted');
      await refreshFiles();
    } else setStatus('Delete failed');
  }

  async function setActivePlatform(url: string) {
    setStatus('Setting active...');
    const res = await fetch('/api/platform/active', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url }) });
    if (res.ok) setStatus('Active platform video updated'); else setStatus('Failed to set active');
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Admin</h1>

      <section className="mt-6">
        <h2 className="font-semibold">Upload file (team photo / manifesto / video)</h2>
        <input className="mt-2" placeholder="Member slug (optional, e.g. jane-doe)" value={member} onChange={(e) => setMember(e.target.value)} />
        <input type="file" className="mt-2 block" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
        <div className="mt-2 flex gap-2">
          <Button onClick={() => uploadAsMultipart(member ? `${member}` : '')}>Upload</Button>
          <Button onClick={async () => { await uploadAsMultipart(member ? `${member}` : ''); await refreshFiles(); }}>Upload & Refresh</Button>
        </div>
      </section>

      <section className="mt-6">
        <h2 className="font-semibold">Media gallery</h2>
        <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-3">
          {files.map(f => (
            <div key={f.name} className="border p-2 rounded">
              <div className="truncate text-xs">{f.name}</div>
              <div className="mt-2">
                {/(png|jpg|jpeg|webp)$/i.test(f.name) ? <img src={f.url} alt={f.name} className="h-20 w-full object-cover rounded" /> : <div className="h-20 w-full bg-black/5 flex items-center justify-center text-xs">{f.name}</div>}
              </div>
              <div className="mt-2 flex gap-2">
                <Button onClick={() => setActivePlatform(f.url)}>Set Active</Button>
                <Button onClick={() => deleteFile(f.name)}>Delete</Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-6 text-sm text-black/60">{status}</div>
    </div>
  );
}
