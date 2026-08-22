import { StudentResult } from '../types';
import { getOptimizedStudentPhotoUrl } from '../utils/imageOptimization';

export const DEFAULT_STUDENTS: StudentResult[] = [
  {
    id: 7,
    name: 'Шамшарбеков Шамынур',
    nameKg: 'Шамшарбеков Шамынур',
    score: 212,
    scoreLabel: '212 баллов',
    scoreLabelKg: '212 балл',
    university: 'КГТУ им. И. Раззакова (Политех)',
    universityKg: 'И. Раззаков атындагы КМТУ (Политех)',
    photoUrl: getOptimizedStudentPhotoUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1787123728/Image_2.png'),
    isGoldCertificate: false,
  },
  {
    id: 8,
    name: 'Самидинова Айгерим',
    nameKg: 'Самидинова Айгерим',
    score: 210,
    scoreLabel: '210 баллов',
    scoreLabelKg: '210 балл',
    university: 'КТУ «Манас» (Кыргызско-Турецкий университет «Манас»)',
    universityKg: 'Кыргыз-Түрк «Манас» университети (КТУ «Манас»)',
    photoUrl: getOptimizedStudentPhotoUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1787297754/%D0%94%D0%B8%D0%B7%D0%B0%D0%B9%D0%BD_%D0%B1%D0%B5%D0%B7_%D0%BD%D0%B0%D0%B7%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F__12.png_2K_202608211334.jpg'),
    isGoldCertificate: false,
  },
  {
    id: 1,
    name: 'Бабанов Актилек',
    nameKg: 'Бабанов Актилек',
    score: 207,
    scoreLabel: '207 баллов',
    scoreLabelKg: '207 балл',
    university: 'КГТУ им. И. Раззакова (Политех)',
    universityKg: 'И. Раззаков атындагы КМТУ (Политех)',
    photoUrl: getOptimizedStudentPhotoUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1787042378/%D0%94%D0%B8%D0%B7%D0%B0%D0%B9%D0%BD_%D0%B1%D0%B5%D0%B7_%D0%BD%D0%B0%D0%B7%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F_6.png'),
    isGoldCertificate: false,
  },
  {
    id: 2,
    name: 'Жайлообекова Миргул',
    nameKg: 'Жайлообекова Миргүл',
    score: 206,
    scoreLabel: '206 баллов',
    scoreLabelKg: '206 балл',
    university: 'МУ «Ала-Тоо» (Международный университет Ала-Тоо)',
    universityKg: '«Ала-Тоо» эл аралык университети',
    photoUrl: getOptimizedStudentPhotoUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1787043436/Image.png'),
    isGoldCertificate: false,
  },
  {
    id: 3,
    name: 'Жакшылыкова Амина',
    nameKg: 'Жакшылыкова Амина',
    score: 200,
    scoreLabel: '200 баллов',
    scoreLabelKg: '200 балл',
    university: 'МУЦА (Международный Университет в Центральной Азии)',
    universityKg: 'МУЦА (Борбордук Азиядагы Эл аралык Университети)',
    photoUrl: getOptimizedStudentPhotoUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1787044558/%D0%94%D0%B8%D0%B7%D0%B0%D0%B9%D0%BD_%D0%B1%D0%B5%D0%B7_%D0%BD%D0%B0%D0%B7%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F_9.png'),
    isGoldCertificate: false,
  },
  {
    id: 4,
    name: 'Омуржанова Адеми',
    nameKg: 'Өмүржанова Адеми',
    score: 200,
    scoreLabel: '200 баллов',
    scoreLabelKg: '200 балл',
    university: 'ЮАГПКР (Юридическая академия при Генеральной прокуратуре КР)',
    universityKg: 'КР Башкы прокуратурасына караштуу Юридикалык академиясы (ЮАГПКР)',
    photoUrl: getOptimizedStudentPhotoUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1787052923/Image_1.png'),
    isGoldCertificate: false,
  },
  {
    id: 5,
    name: 'Тураров Арсен',
    nameKg: 'Тураров Арсен',
    score: 196,
    scoreLabel: '196 баллов',
    scoreLabelKg: '196 балл',
    university: 'КГТУ им. И. Раззакова (Политех)',
    universityKg: 'И. Раззаков атындагы КМТУ (Политех)',
    photoUrl: getOptimizedStudentPhotoUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1787054519/%D0%94%D0%B8%D0%B7%D0%B0%D0%B9%D0%BD_%D0%B1%D0%B5%D0%B7_%D0%BD%D0%B0%D0%B7%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F_11.png'),
    isGoldCertificate: false,
  },
  {
    id: 6,
    name: 'Бейшенбекова Асема',
    nameKg: 'Бейшенбекова Асема',
    score: 190,
    scoreLabel: '190 баллов',
    scoreLabelKg: '190 балл',
    university: 'КТУ «Манас» (Кыргызско-Турецкий университет «Манас»)',
    universityKg: 'Кыргыз-Түрк «Манас» университети (КТУ «Манас»)',
    photoUrl: getOptimizedStudentPhotoUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1787053909/%D0%94%D0%B8%D0%B7%D0%B0%D0%B9%D0%BD_%D0%B1%D0%B5%D0%B7_%D0%BD%D0%B0%D0%B7%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F_10.png'),
    isGoldCertificate: false,
  },
];

const STORAGE_KEY = 'ort_students_data_v4';

export const getStoredStudents = (): StudentResult[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STUDENTS;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      // Return sorted by score descending
      return [...parsed].sort((a, b) => (b.score || 0) - (a.score || 0));
    }
    return DEFAULT_STUDENTS;
  } catch (err) {
    console.error('Failed to read students from localStorage:', err);
    return DEFAULT_STUDENTS;
  }
};

export const saveStoredStudents = (students: StudentResult[]): void => {
  try {
    const sorted = [...students].sort((a, b) => (b.score || 0) - (a.score || 0));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sorted));
    // Dispatch event to notify all components
    window.dispatchEvent(new Event('ort_students_updated'));
  } catch (err) {
    console.error('Failed to save students to localStorage:', err);
  }
};

export const addStoredStudent = (student: Omit<StudentResult, 'id'>): StudentResult => {
  const current = getStoredStudents();
  const newId = Date.now();
  const newStudent: StudentResult = {
    ...student,
    id: newId,
    scoreLabel: student.scoreLabel || `${student.score} баллов`,
    scoreLabelKg: student.scoreLabelKg || `${student.score} балл`,
    isGoldCertificate: student.isGoldCertificate ?? student.score >= 220,
  };
  saveStoredStudents([newStudent, ...current]);
  return newStudent;
};

export const updateStoredStudent = (id: number | string, updated: Partial<StudentResult>): void => {
  const current = getStoredStudents();
  const next = current.map((s) => {
    if (s.id === id) {
      const score = updated.score ?? s.score;
      return {
        ...s,
        ...updated,
        score,
        scoreLabel: updated.scoreLabel || `${score} баллов`,
        scoreLabelKg: updated.scoreLabelKg || `${score} балл`,
        isGoldCertificate: updated.isGoldCertificate ?? score >= 220,
      };
    }
    return s;
  });
  saveStoredStudents(next);
};

export const deleteStoredStudent = (id: number | string): void => {
  const current = getStoredStudents();
  const next = current.filter((s) => s.id !== id);
  saveStoredStudents(next);
};

export const resetStoredStudents = (): StudentResult[] => {
  localStorage.removeItem(STORAGE_KEY);
  saveStoredStudents(DEFAULT_STUDENTS);
  return DEFAULT_STUDENTS;
};
