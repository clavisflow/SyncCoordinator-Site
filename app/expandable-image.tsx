"use client";

import { Maximize2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type ExpandableImageProps = {
  src: string;
  alt: string;
  expandLabel: string;
  closeLabel: string;
  hintLabel?: string;
};

export function ExpandableImage({ src, alt, expandLabel, closeLabel, hintLabel = "拡大" }: ExpandableImageProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) {
      dialog.showModal();
    }
    if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  return (
    <>
      <button className="expandableImageTrigger" type="button" onClick={() => setIsOpen(true)} aria-label={expandLabel}>
        <img src={src} alt={alt} />
        <span className="expandableImageHint" aria-hidden="true"><Maximize2 />{hintLabel}</span>
      </button>
      <dialog
        ref={dialogRef}
        className="imageLightbox"
        aria-label={alt}
        onCancel={() => setIsOpen(false)}
        onClose={() => setIsOpen(false)}
        onClick={(event) => {
          if (event.currentTarget === event.target) setIsOpen(false);
        }}
      >
        <button className="imageLightboxClose" type="button" onClick={() => setIsOpen(false)} aria-label={closeLabel}>
          <X aria-hidden="true" />
        </button>
        <img src={src} alt={alt} />
      </dialog>
    </>
  );
}
