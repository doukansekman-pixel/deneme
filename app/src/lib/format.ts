const EUR_FORMAT = new Intl.NumberFormat("de-DE", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatEuro(amount: number): string {
  return `${EUR_FORMAT.format(amount)} €`;
}
