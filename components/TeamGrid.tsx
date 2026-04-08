"use client";

import * as React from "react";
import Image from "next/image";
import { Button } from "@/components/ui";

type Member = {
  name: string;
  title: string;
  focus: string[];
  highlight?: string;
  note?: string;
};

// Helper to create slug from name
function nameToSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

// Optimized Image component with loading state
function TeamImage({ src, alt }: { src: string; alt: string }) {
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(false);

  if (error) {
    return <div className="text-xs text-black/50 px-2 text-center">No photo</div>;
  }

  return (
    <>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse rounded-xl" />
      )}
      <Image
        src={src}
        alt={alt}
        fill
        sizes="80px"
        className={`object-cover transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        onLoad={() => setIsLoading(false)}
        onError={() => setError(true)}
      />
    </>
  );
}

export default function TeamGrid({ members }: { members: Member[] }) {
  const [images, setImages] = React.useState<Record<string, string>>({});
  const [uploading, setUploading] = React.useState<Record<string, boolean>>({});

  // Show all members - no visibility filtering needed for public page
  const visibleMembers = members;

  async function onImageChange(name: string, file?: File) {
    if (!file) return;

    const localUrl = URL.createObjectURL(file);
    setImages((s) => ({ ...s, [name]: localUrl }));
    setUploading((s) => ({ ...s, [name]: true }));

    try {
      const fd = new FormData();
      fd.append("file", file);
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      fd.append("key", slug);

      const res = await fetch("/api/upload-photo", { method: "POST", body: fd });
      if (!res.ok) throw new Error(`upload failed ${res.status}`);
      const json = await res.json();
      if (json?.url) {
        setImages((s) => ({ ...s, [name]: json.url }));
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    } finally {
      setUploading((s) => ({ ...s, [name]: false }));
    }
  }

  React.useEffect(() => {
    (async () => {
      try {
        const mappingRes = await fetch("/api/mapping");
        const mapping = mappingRes.ok ? await mappingRes.json() : {};
        const urls: Record<string, string> = {};
        for (const m of members) {
          const slug = m.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
          const entry = mapping?.[slug];
          if (entry) {
            urls[m.name] = entry.url || entry;
            continue;
          }
          for (const ext of ["png", "jpg", "jpeg", "webp"]) {
            const candidate = `/media/${slug}.${ext}`;
            try {
              const head = await fetch(candidate, { method: "HEAD" });
              if (head.ok) {
                urls[m.name] = candidate;
                break;
              }
            } catch (e) {
              // ignore
            }
          }
        }
        if (Object.keys(urls).length) setImages((s) => ({ ...s, ...urls }));
      } catch (e) {
        // ignore
      }
    })();
  }, [members]);

  return (
    <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {visibleMembers.map((m, index) => (
        <div 
          key={m.name} 
          className={`rounded-3xl border border-black/10 bg-white p-7 shadow-sm flex gap-4 items-start scroll-animate scroll-delay-${Math.min(index % 3 + 1, 5)}`}
        >
          <div className="flex-shrink-0">
            <div className="h-20 w-20 overflow-hidden rounded-xl bg-black/5 flex items-center justify-center relative">
              {images[m.name] ? (
                <TeamImage src={images[m.name]} alt={m.name} />
              ) : (
                <div className="text-xs text-black/50 px-2 text-center">No photo</div>
              )}
            </div>

            <label className="mt-2 block text-xs">
              <input
                aria-label={`Upload photo for ${m.name}`}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e: any) => onImageChange(m.name, e.target.files?.[0])}
              />
              <Button variant="secondary" className="mt-2 w-full text-[13px]">Upload</Button>
            </label>
          </div>

          <div className="flex-1">
            <div className="text-lg font-extrabold tracking-tight">{m.name}</div>
            <div className="mt-1 text-sm font-semibold text-black/70">{m.title}</div>
            <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-black/70">
              {m.focus.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            {m.highlight ? (
              <div className="mt-4 text-sm font-medium">
                Highlight: <span className="font-normal text-black/70">{m.highlight}</span>
              </div>
            ) : null}
            {m.note ? <div className="mt-3 text-xs text-black/50">Note: {m.note}</div> : null}
          </div>
        </div>
      ))}
    </div>
  );
}
