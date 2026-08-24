export interface KyrgyzOperator {
  name: string;
  code: 'o' | 'beeline' | 'megacom' | 'unknown';
  colorBadge: string;
  dotColor: string;
}

export function detectKyrgyzOperator(phoneOrInput: string): KyrgyzOperator | null {
  if (!phoneOrInput) return null;

  // Clean all non-digits
  const digits = phoneOrInput.replace(/\D/g, '');
  if (digits.length < 3) return null;

  // Standardize: extract the 3-digit mobile prefix
  let prefix = '';
  if (digits.startsWith('996') && digits.length >= 6) {
    prefix = digits.substring(3, 6);
  } else if (digits.startsWith('0') && digits.length >= 4) {
    prefix = digits.substring(1, 4);
  } else if (digits.length >= 3) {
    prefix = digits.substring(0, 3);
  }

  if (!prefix) return null;

  // Check O! (700-709, 500-509, 501, 502, 505, 507, 508, 509, 701, 702, etc.)
  if (/^(70\d|50\d)/.test(prefix)) {
    return {
      name: 'О!',
      code: 'o',
      colorBadge: 'bg-rose-600 text-white border-rose-400/50',
      dotColor: 'bg-rose-400',
    };
  }

  // Check Beeline (770-779, 220-229)
  if (/^(77\d|22\d)/.test(prefix)) {
    return {
      name: 'Beeline',
      code: 'beeline',
      colorBadge: 'bg-amber-400 text-slate-950 font-black border-amber-300',
      dotColor: 'bg-amber-400',
    };
  }

  // Check MegaCom / MEGA (550-559, 990-999, 755)
  if (/^(55\d|99\d|755)/.test(prefix)) {
    return {
      name: 'MEGA (MegaCom)',
      code: 'megacom',
      colorBadge: 'bg-emerald-500 text-slate-950 font-black border-emerald-300',
      dotColor: 'bg-emerald-400',
    };
  }

  return null;
}

export function formatKyrgyzPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (!digits) return '';

  let normalized = digits;
  if (normalized.startsWith('996')) {
    normalized = normalized.substring(3);
  } else if (normalized.startsWith('0')) {
    normalized = normalized.substring(1);
  }

  // Limit to 9 digits (Kyrgyz mobile numbers are 9 digits: XXX XX-XX-XX)
  normalized = normalized.substring(0, 9);

  let formatted = '+996 ';
  if (normalized.length > 0) {
    formatted += `(${normalized.substring(0, Math.min(3, normalized.length))}`;
  }
  if (normalized.length >= 3) {
    formatted += `) ${normalized.substring(3, Math.min(6, normalized.length))}`;
  }
  if (normalized.length >= 6) {
    formatted += `-${normalized.substring(6, Math.min(8, normalized.length))}`;
  }
  if (normalized.length >= 8) {
    formatted += `-${normalized.substring(8, 9)}`;
  }

  return formatted;
}
