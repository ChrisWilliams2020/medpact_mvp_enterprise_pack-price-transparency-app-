"use client";

import * as React from "react";
import { Button } from "@/components/ui";

export default function PlatformLauncher() {
  const [open, setOpen] = React.useState(false);
  const [videoUrl, setVideoUrl] = React.useState<string | null>(null);
  const videoRef = React.useRef<HTMLVideoElement | null>(null);

  async function loadActive() {
    try {
      const res = await fetch('/api/platform/active');
      if (!res.ok) return;
      const json = await res.json();
      if (json?.url) setVideoUrl(json.url);
    } catch (err) {
      // ignore
    }
  }

  React.useEffect(() => {
    if (open) loadActive();
  }, [open]);

  function replay() {
    if (!videoRef.current) return;
    videoRef.current.currentTime = 0;
    videoRef.current.play();
  }

  function rewind(sec = 10) {
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - sec);
  }

  return (
    <>
      <Button variant="ghost" onClick={() => setOpen(true)} className="text-sm">Platform</Button>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="mx-4 max-w-3xl rounded-lg bg-white p-4">
            <div className="flex justify-between">
              <div />
              <div>
                <button aria-label="Return from video" onClick={() => setOpen(false)} className="mr-3 text-sm font-medium text-black/70">Return</button>
                <button aria-label="Close video" onClick={() => setOpen(false)} className="text-black/60">✕</button>
              </div>
            </div>
            <div className="mt-2">
              {videoUrl ? (
                <>
                  <div className="flex gap-2 mb-2">
                    <Button variant="secondary" onClick={() => rewind(10)}>◀◀ 10s</Button>
                    <Button variant="secondary" onClick={replay}>Replay</Button>
                  </div>
                  <video ref={videoRef} controls className="w-full rounded">
                    <source src={videoUrl} />
                    Your browser does not support the video tag.
                  </video>
                </>
              ) : (
                <div className="text-sm text-black/60">No platform video set. Admin can upload to <code>public/media</code> and mark active via the admin UI.</div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
