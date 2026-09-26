"use client";

import type { ProductFormValues } from "@/types";

export interface DemoProduct {
  emoji: string;
  label: string;
  values: Pick<
    ProductFormValues,
    "productName" | "category" | "features" | "audience"
  >;
}

export const DEMO_PRODUCTS: DemoProduct[] = [
  {
    emoji: "🎧",
    label: "Беспроводные наушники",
    values: {
      productName: "AirBeat Pro — беспроводные наушники",
      category: "Электроника",
      features:
        "Bluetooth 5.3, активное шумоподавление, до 40 часов работы с зарядным кейсом, USB-C, встроенный микрофон.",
      audience: "Студенты, офисные сотрудники и люди, которые часто находятся в дороге.",
    },
  },
  {
    emoji: "👜",
    label: "Женская сумка",
    values: {
      productName: "Velora — женская сумка через плечо",
      category: "Аксессуары",
      features:
        "Экокожа, регулируемый ремень, внутренний карман на молнии, компактный формат, подходит для повседневного использования.",
      audience: "Женщины, которым нужна компактная сумка для повседневных образов.",
    },
  },
  {
    emoji: "💡",
    label: "Умная LED-лампа",
    values: {
      productName: "Luma Mini — компактная LED-лампа",
      category: "Дом",
      features:
        "Три режима яркости, сенсорное управление, USB-C, компактный корпус, подходит для рабочего стола и прикроватной тумбы.",
      audience: "Студенты, удалённые сотрудники и люди, которые обустраивают рабочее пространство.",
    },
  },
];

interface DemoProductsProps {
  onSelect: (values: DemoProduct["values"]) => void;
}

export function DemoProducts({ onSelect }: DemoProductsProps) {
  return (
    <div className="surface rounded-2xl p-5">
      <p className="mb-3 text-sm font-medium">Попробуйте пример</p>
      <div className="flex flex-wrap gap-2">
        {DEMO_PRODUCTS.map((demo) => (
          <button
            key={demo.label}
            type="button"
            onClick={() => onSelect(demo.values)}
            className="rounded-full border border-[var(--border)] px-3 py-2 text-sm transition hover:border-violet/60 hover:bg-violet/10"
          >
            <span className="mr-1.5">{demo.emoji}</span>
            {demo.label}
          </button>
        ))}
      </div>
    </div>
  );
}
