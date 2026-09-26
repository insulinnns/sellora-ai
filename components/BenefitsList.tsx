export function BenefitsList({ benefits }: { benefits: string[] }) {
  return (
    <div>
      <h3 className="mb-3 text-sm font-medium text-muted">04 — Почему стоит купить</h3>
      <ul className="space-y-2">
        {benefits.map((benefit, index) => (
          <li key={index} className="flex items-start gap-2 text-sm">
            <span className="mt-0.5 text-violet-soft" aria-hidden="true">✓</span>
            <span>{benefit}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
