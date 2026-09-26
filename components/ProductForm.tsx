"use client";

import { useState, type FormEvent } from "react";
import { CATEGORIES, LENGTHS, TONES } from "@/types";
import type { ProductFormValues } from "@/types";
import { LIMITS } from "@/lib/gemini-config";
import { ImageUpload } from "./ImageUpload";
import { DEMO_PRODUCTS, DemoProducts, type DemoProduct } from "./DemoProducts";

const DEFAULT_VALUES: ProductFormValues = {
  productName: "",
  category: "",
  features: "",
  audience: "",
  tone: "Продающий",
  length: "Средняя",
  additionalInstructions: "",
  avoidUnverifiedClaims: true,
};

interface ProductFormProps {
  onSubmit: (values: ProductFormValues) => void;
  isGenerating: boolean;
}

type FieldErrors = Partial<Record<keyof ProductFormValues, string>>;

export function ProductForm({ onSubmit, isGenerating }: ProductFormProps) {
  const [values, setValues] = useState<ProductFormValues>(DEFAULT_VALUES);
  const [errors, setErrors] = useState<FieldErrors>({});

  const update = <K extends keyof ProductFormValues>(key: K, value: ProductFormValues[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const applyDemo = (demo: DemoProduct["values"]) => {
    setValues((prev) => ({ ...prev, ...demo }));
    setErrors({});
  };

  const generateRandomCard = () => {
    if (isGenerating) return;

    const demo = DEMO_PRODUCTS[Math.floor(Math.random() * DEMO_PRODUCTS.length)];
    const randomValues: ProductFormValues = { ...DEFAULT_VALUES, ...demo.values };
    setValues(randomValues);
    setErrors({});
    onSubmit(randomValues);
  };

  const validate = (): boolean => {
    const next: FieldErrors = {};

    if (values.productName.trim().length < LIMITS.productName.min) {
      next.productName = `Минимум ${LIMITS.productName.min} символа.`;
    } else if (values.productName.length > LIMITS.productName.max) {
      next.productName = `Максимум ${LIMITS.productName.max} символов.`;
    }

    if (!values.category) {
      next.category = "Выберите категорию.";
    }

    if (values.features.trim().length < LIMITS.features.min) {
      next.features = `Опишите характеристики подробнее (минимум ${LIMITS.features.min} символов).`;
    } else if (values.features.length > LIMITS.features.max) {
      next.features = `Максимум ${LIMITS.features.max} символов.`;
    }

    if (values.audience.trim().length < LIMITS.audience.min) {
      next.audience = "Укажите целевую аудиторию.";
    } else if (values.audience.length > LIMITS.audience.max) {
      next.audience = `Максимум ${LIMITS.audience.max} символов.`;
    }

    if (values.additionalInstructions.length > LIMITS.additionalInstructions.max) {
      next.additionalInstructions = `Максимум ${LIMITS.additionalInstructions.max} символов.`;
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (isGenerating) return;
    if (!validate()) return;
    onSubmit(values);
  };

  return (
    <section id="product-form" className="mx-auto max-w-2xl px-5 pb-10">
      <DemoProducts onSelect={applyDemo} />

      <form onSubmit={handleSubmit} className="surface mt-6 space-y-5 rounded-2xl p-5 sm:p-7" noValidate>
        <h2 className="text-xl font-semibold">Расскажите о товаре</h2>

        <div>
          <label htmlFor="productName" className="mb-1.5 block text-sm font-medium">
            Название товара
          </label>
          <input
            id="productName"
            type="text"
            value={values.productName}
            onChange={(e) => update("productName", e.target.value)}
            placeholder="Например: беспроводные наушники AirBeat Pro"
            className="surface w-full rounded-xl px-4 py-2.5 text-sm outline-none focus-visible:border-violet/70"
            aria-invalid={Boolean(errors.productName)}
            aria-describedby={errors.productName ? "productName-error" : undefined}
          />
          {errors.productName && (
            <p id="productName-error" className="mt-1 text-xs text-red-300">
              {errors.productName}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="category" className="mb-1.5 block text-sm font-medium">
            Категория
          </label>
          <select
            id="category"
            value={values.category}
            onChange={(e) => update("category", e.target.value)}
            className="surface w-full rounded-xl px-4 py-2.5 text-sm outline-none focus-visible:border-violet/70"
            aria-invalid={Boolean(errors.category)}
          >
            <option value="">Выберите категорию</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {errors.category && <p className="mt-1 text-xs text-red-300">{errors.category}</p>}
        </div>

        <div>
          <label htmlFor="features" className="mb-1.5 block text-sm font-medium">
            Характеристики
          </label>
          <textarea
            id="features"
            rows={4}
            value={values.features}
            onChange={(e) => update("features", e.target.value)}
            placeholder="Например: Bluetooth 5.3, активное шумоподавление, 40 часов работы, зарядка USB-C, микрофон..."
            className="surface w-full resize-y rounded-xl px-4 py-2.5 text-sm outline-none focus-visible:border-violet/70"
            aria-invalid={Boolean(errors.features)}
          />
          {errors.features && <p className="mt-1 text-xs text-red-300">{errors.features}</p>}
        </div>

        <div>
          <label htmlFor="audience" className="mb-1.5 block text-sm font-medium">
            Целевая аудитория
          </label>
          <input
            id="audience"
            type="text"
            value={values.audience}
            onChange={(e) => update("audience", e.target.value)}
            placeholder="Например: студенты, офисные сотрудники, люди, которые часто путешествуют"
            className="surface w-full rounded-xl px-4 py-2.5 text-sm outline-none focus-visible:border-violet/70"
            aria-invalid={Boolean(errors.audience)}
          />
          {errors.audience && <p className="mt-1 text-xs text-red-300">{errors.audience}</p>}
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="tone" className="mb-1.5 block text-sm font-medium">
              Тон текста
            </label>
            <select
              id="tone"
              value={values.tone}
              onChange={(e) => update("tone", e.target.value as ProductFormValues["tone"])}
              className="surface w-full rounded-xl px-4 py-2.5 text-sm outline-none focus-visible:border-violet/70"
            >
              {TONES.map((tone) => (
                <option key={tone} value={tone}>
                  {tone}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="length" className="mb-1.5 block text-sm font-medium">
              Длина
            </label>
            <select
              id="length"
              value={values.length}
              onChange={(e) => update("length", e.target.value as ProductFormValues["length"])}
              className="surface w-full rounded-xl px-4 py-2.5 text-sm outline-none focus-visible:border-violet/70"
            >
              {LENGTHS.map((len) => (
                <option key={len} value={len}>
                  {len}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="additionalInstructions" className="mb-1.5 block text-sm font-medium">
            Дополнительные пожелания
            <span className="ml-1 font-normal text-muted">(необязательно)</span>
          </label>
          <textarea
            id="additionalInstructions"
            rows={2}
            value={values.additionalInstructions}
            onChange={(e) => update("additionalInstructions", e.target.value)}
            placeholder="Например: сделай акцент на автономности и удобстве..."
            className="surface w-full resize-y rounded-xl px-4 py-2.5 text-sm outline-none focus-visible:border-violet/70"
          />
          {errors.additionalInstructions && (
            <p className="mt-1 text-xs text-red-300">{errors.additionalInstructions}</p>
          )}
        </div>

        <ImageUpload
          onChange={(payload) =>
            setValues((prev) => ({
              ...prev,
              imageBase64: payload?.base64,
              imageMimeType: payload?.mimeType,
            }))
          }
        />

        <label className="flex items-start gap-2.5 text-sm">
          <input
            type="checkbox"
            checked={values.avoidUnverifiedClaims}
            onChange={(e) => update("avoidUnverifiedClaims", e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-[var(--border)] accent-violet"
          />
          <span>Не использовать неподтверждённые характеристики</span>
        </label>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={generateRandomCard}
            disabled={isGenerating}
            className="flex-1 rounded-full border border-[var(--border)] px-6 py-3 text-sm font-semibold transition hover:border-violet/60 hover:bg-violet/10 disabled:cursor-not-allowed disabled:opacity-60"
          >
            🎲 Случайная карточка
          </button>
          <button
            type="submit"
            disabled={isGenerating}
            className="flex-1 rounded-full bg-gradient-to-r from-violet to-magenta px-6 py-3 text-sm font-semibold text-white shadow-[0_0_30px_-8px_var(--glow-violet)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isGenerating ? "Создаём карточку..." : "✨ Создать карточку"}
          </button>
        </div>
      </form>
    </section>
  );
}
