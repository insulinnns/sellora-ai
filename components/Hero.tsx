export function Hero() {
  return (
    <section className="relative mx-auto max-w-4xl px-5 pb-16 pt-16 text-center sm:pt-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-violet/30 blur-[100px] animate-glow"
      />
      <h1 className="animate-rise text-4xl font-semibold leading-tight tracking-tight sm:text-5xl md:text-6xl">
        Создавай карточки товаров с&nbsp;помощью AI
      </h1>
      <p
        className="mx-auto mt-5 max-w-xl text-balance text-base text-muted sm:text-lg"
        style={{ animationDelay: "0.1s" }}
      >
        Заполни несколько полей — Sellora превратит характеристики товара в
        готовый продающий контент.
      </p>

      <div
        id="how-it-works"
        className="mx-auto mt-12 grid max-w-2xl grid-cols-1 gap-3 text-left sm:grid-cols-3"
      >
        {[
          { title: "Опишите товар", text: "Название, характеристики, аудитория и тон." },
          { title: "Нажмите «Создать»", text: "Gemini соберёт продающий контент за секунды." },
          { title: "Скопируйте результат", text: "Готовые тексты — сразу на маркетплейс." },
        ].map((step) => (
          <div key={step.title} className="surface rounded-2xl p-4">
            <p className="text-sm font-medium">{step.title}</p>
            <p className="mt-1 text-sm text-muted">{step.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
