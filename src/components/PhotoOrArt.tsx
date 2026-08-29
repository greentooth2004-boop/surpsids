import { useState } from "react";

/** Loads a real photo (public/photos/...); if missing, shows the SVG art. */
export default function PhotoOrArt({
  src,
  alt,
  art,
  className = "",
}: {
  src: string;
  alt: string;
  art: React.ReactNode;
  className?: string;
}) {
  const [ok, setOk] = useState(true);
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {ok ? (
        <img
          src={src}
          alt={alt}
          onError={() => setOk(false)}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#ffd1e8] to-[#d8b4fe]">
          {art}
        </div>
      )}
    </div>
  );
}
