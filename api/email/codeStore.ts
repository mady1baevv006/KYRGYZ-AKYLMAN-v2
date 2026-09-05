// Shared in-memory and Firebase fallback store for 6-digit email login codes

interface EmailCodeRecord {
  code: string;
  expiresAt: number;
  attempts: number;
}

const memoryCodes = new Map<string, EmailCodeRecord>();

// Clean up expired codes every 2 minutes
setInterval(() => {
  const now = Date.now();
  for (const [email, record] of memoryCodes.entries()) {
    if (now > record.expiresAt) {
      memoryCodes.delete(email);
    }
  }
}, 2 * 60 * 1000);

export function setMemoryEmailCode(email: string, code: string, expiresAt: number) {
  memoryCodes.set(email.toLowerCase(), {
    code,
    expiresAt,
    attempts: 0,
  });
}

export function getMemoryEmailCode(email: string): EmailCodeRecord | null {
  const record = memoryCodes.get(email.toLowerCase());
  if (!record) return null;
  return record;
}

export function incrementMemoryAttempts(email: string) {
  const record = memoryCodes.get(email.toLowerCase());
  if (record) {
    record.attempts = (record.attempts || 0) + 1;
  }
}

export function deleteMemoryEmailCode(email: string) {
  memoryCodes.delete(email.toLowerCase());
}
