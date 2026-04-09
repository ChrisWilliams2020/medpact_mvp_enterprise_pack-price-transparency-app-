"use client";

import * as React from "react";
import { Button } from "@/components/ui";

export default function PlatformLauncher() {
  const [open, setOpen] = React.useState(false);
  const [videoUrl, setVideoUrl] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const videoRef = React.useRef<HTMLVideoElement | null>(null);

  async function loadActive() {
    setLoading(true);
    try {
      // First try the active video API
      const res = await fetch('/api/platform/active');
      if (res.ok) {
        const json = await res.json();
        if (json?.url) {
          setVideoUrl(json.url);
          setLoading(false);
          return;
        }
      }
      
      // Fallback: check for demo.mp4 in media folder
      const demoCheck = await fetch('/media/demo.mp4', { method: 'HEAD' });
      if (demoCheck.ok) {
        setVideoUrl('/media/demo.mp4');
        setLoading(false);
        return;
      }
      
      // Fallback: check for platform-demo.mp4
      const platformCheck = await fetch('/media/platform-demo.mp4', { method: 'HEAD' });
      if (platformCheck.ok) {
        setVideoUrl('/media/platform-demo.mp4');
      }
    } catch (err) {
      // ignore
    }
    setLoading(false);
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
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
              ) : videoUrl ? (
                <>
                  <div className="flex gap-2 mb-2">
                    <Button variant="secondary" onClick={() => rewind(10)}>◀◀ 10s</Button>
                    <Button variant="secondary" onClick={replay}>Replay</Button>
                  </div>
                  <video ref={videoRef} controls autoPlay className="w-full rounded">
                    <source src={videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </>
              ) : (
                <div className="text-center py-12">
                  <div className="text-4xl mb-4">🎬</div>
                  <div className="text-lg font-semibold mb-2">Platform Demo Coming Soon</div>
                  <div className="text-sm text-black/60">Upload <code className="bg-gray-100 px-2 py-1 rounded">demo.mp4</code> to <code className="bg-gray-100 px-2 py-1 rounded">public/media/</code> folder</div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
