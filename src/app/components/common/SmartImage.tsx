import { useEffect, useRef, useState } from "react";

interface SmartImageProps
  extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, "onLoad"> {
  src?: string | null;
  alt: string;
  /** class untuk elemen <img> */
  imgClassName?: string;
  /** class untuk wrapper */
  wrapperClassName?: string;
  /** true = prioritas tinggi (hero), muat segera & tanpa lazy */
  priority?: boolean;
  /** warna/gradient placeholder saat loading */
  placeholderClassName?: string;
  /** fallback bila src kosong / gagal */
  fallbackSrc?: string;
}

/**
 * Gambar dengan strategi "anti-jelek":
 * - Placeholder skeleton/gradient tampil seketika sehingga layout stabil (tidak ada
 *   pergeseran & tidak ada kesan lemot ketika gambar besar masih diunduh).
 * - Gambar di-fade-in halus setelah selesai dimuat (decode async).
 * - `priority` untuk hero: eager load + high fetchpriority.
 */
export function SmartImage({
  src,
  alt,
  imgClassName = "",
  wrapperClassName = "",
  placeholderClassName = "bg-neutral-200",
  priority = false,
  fallbackSrc,
  ...rest
}: SmartImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const finalSrc = failed ? fallbackSrc : src || fallbackSrc || undefined;

  // Jika gambar sudah ada di cache, onLoad kadang tidak terpanggil.
  useEffect(() => {
    if (imgRef.current?.complete && imgRef.current.naturalWidth > 0) {
      setLoaded(true);
    }
  }, [finalSrc]);

  return (
    <div className={`relative overflow-hidden ${wrapperClassName}`}>
      {/* Placeholder */}
      <div
        aria-hidden
        className={`absolute inset-0 transition-opacity duration-700 ${
          loaded ? "opacity-0" : "opacity-100 animate-pulse"
        } ${placeholderClassName}`}
      />
      {finalSrc && (
        <img
          ref={imgRef}
          src={finalSrc}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          // @ts-expect-error fetchpriority atribut baru
          fetchpriority={priority ? "high" : "auto"}
          onLoad={() => setLoaded(true)}
          onError={() => {
            if (!failed && fallbackSrc) setFailed(true);
            else setLoaded(true);
          }}
          className={`transition-opacity duration-700 ease-out ${
            loaded ? "opacity-100" : "opacity-0"
          } ${imgClassName}`}
          {...rest}
        />
      )}
    </div>
  );
}
