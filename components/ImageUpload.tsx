"use client";

import { useRef, useState } from "react";
import { LIMITS } from "@/lib/gemini-config";

interface ImageUploadProps {
  onChange: (payload: { base64: string; mimeType: string } | null) => void;
}

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function ImageUpload({ onChange }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    setError(null);

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError("Поддерживаются только форматы JPG, PNG и WEBP.");
      return;
    }
    if (file.size > LIMITS.imageMaxBytes) {
      setError("Файл слишком большой. Максимум 4 МБ.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const [, base64 = ""] = result.split(",");
      setPreview(result);
      onChange({ base64, mimeType: file.type });
    };
    reader.onerror = () => setError("Не удалось прочитать файл.");
    reader.readAsDataURL(file);
  };

  const clear = () => {
    setPreview(null);
    onChange(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div>
      <label htmlFor="product-image" className="mb-2 block text-sm font-medium">
        Добавить фото товара
        <span className="ml-1 font-normal text-muted">(необязательно)</span>
      </label>

      {!preview ? (
        <label
          htmlFor="product-image"
          className="surface flex cursor-pointer flex-col items-center justify-center gap-1 rounded-2xl border-dashed p-6 text-center text-sm text-muted transition hover:border-violet/60"
        >
          <span>Нажмите, чтобы выбрать изображение</span>
          <span className="text-xs">JPG, PNG или WEBP, до 4 МБ</span>
        </label>
      ) : (
        <div className="surface flex items-center gap-4 rounded-2xl p-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt="Предпросмотр товара"
            className="h-16 w-16 rounded-xl object-cover"
          />
          <button
            type="button"
            onClick={clear}
            className="ml-auto rounded-full border border-[var(--border)] px-3 py-1.5 text-xs transition hover:border-violet/60"
          >
            Убрать фото
          </button>
        </div>
      )}

      <input
        ref={inputRef}
        id="product-image"
        type="file"
        accept={ACCEPTED_TYPES.join(",")}
        className="sr-only"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) handleFile(file);
        }}
      />

      {error && <p className="mt-2 text-xs text-red-300">{error}</p>}
    </div>
  );
}
