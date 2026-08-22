// Manager for customized test answer keys (Admin controlled)

export interface CustomAnswerKeysRecord {
  [variantId: string]: {
    [questionNumber: number]: string; // 'А' | 'Б' | 'В' | 'Г' | 'Д'
  };
}

const STORAGE_KEY = 'ort_custom_answer_keys_v1';

export function getCustomAnswerKeys(): CustomAnswerKeysRecord {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

export function saveCustomAnswerKeys(keys: CustomAnswerKeysRecord): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(keys));
    window.dispatchEvent(new CustomEvent('ort_answer_keys_updated', { detail: keys }));
  } catch (err) {
    console.error('Failed to save custom answer keys:', err);
  }
}

export function setCustomAnswer(variantId: string | number, questionNumber: number, answer: string): void {
  const current = getCustomAnswerKeys();
  const vKey = variantId.toString();
  if (!current[vKey]) {
    current[vKey] = {};
  }
  current[vKey][questionNumber] = answer;
  saveCustomAnswerKeys(current);
}

export function getCustomAnswer(variantId: string | number, questionNumber: number, fallbackAnswer: string): string {
  const current = getCustomAnswerKeys();
  const vKey = variantId.toString();
  if (current[vKey] && current[vKey][questionNumber]) {
    return current[vKey][questionNumber];
  }
  return fallbackAnswer;
}

export function resetCustomAnswersForVariant(variantId: string | number): void {
  const current = getCustomAnswerKeys();
  const vKey = variantId.toString();
  delete current[vKey];
  saveCustomAnswerKeys(current);
}
