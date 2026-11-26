const AR = '٠١٢٣٤٥٦٧٨٩';

/** Latin digits → Arabic-Indic digits, no thousands separators (1500 → "١٥٠٠"). */
export function arDigits(n: number | string): string {
  return String(n).replace(/[0-9]/g, (d) => AR[Number(d)]);
}

export function priceLabel(n: number): string {
  return `${arDigits(n)} جنيه`;
}
