import { CourseGroup, CourseLesson, CourseHomework, CourseChatMessage } from '../types/courses';
import { COURSES_DATA, PRIMARY_COURSE } from './coursesData';

const COURSES_STORAGE_KEY = 'kyrgyz_akylman_courses_v2';
const ENROLLED_STUDENTS_KEY = 'kyrgyz_akylman_enrolled_students_v2';

export interface EnrolledStudentRecord {
  id: string;
  courseId: string;
  name: string;
  email: string;
  phone: string;
  targetScore: number;
  enrolledAt: string;
  status: 'active' | 'trial' | 'completed' | 'blocked';
  paymentStatus: 'paid' | 'pending' | 'free_vip';
  attendanceCount: number;
  homeworkScore: number;
  note?: string;
}

const DEFAULT_STUDENTS: EnrolledStudentRecord[] = [
  {
    id: 'std-1',
    courseId: PRIMARY_COURSE.id,
    name: 'Айбек Садыков',
    email: 'aibek.ort@gmail.com',
    phone: '+996 700 123 456',
    targetScore: 220,
    enrolledAt: '2026-08-28',
    status: 'active',
    paymentStatus: 'paid',
    attendanceCount: 0,
    homeworkScore: 95,
  },
  {
    id: 'std-2',
    courseId: PRIMARY_COURSE.id,
    name: 'Арууке Касымова',
    email: 'aruuke.k@mail.ru',
    phone: '+996 555 987 654',
    targetScore: 225,
    enrolledAt: '2026-08-29',
    status: 'active',
    paymentStatus: 'paid',
    attendanceCount: 0,
    homeworkScore: 100,
  },
  {
    id: 'std-3',
    courseId: PRIMARY_COURSE.id,
    name: 'Бексултан Токтогулов',
    email: 'beksultan.t@gmail.com',
    phone: '+996 772 334 455',
    targetScore: 215,
    enrolledAt: '2026-08-30',
    status: 'active',
    paymentStatus: 'free_vip',
    attendanceCount: 0,
    homeworkScore: 90,
  },
];

export const getStoredCourses = (): CourseGroup[] => {
  try {
    const raw = localStorage.getItem(COURSES_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(COURSES_STORAGE_KEY, JSON.stringify(COURSES_DATA));
      return COURSES_DATA;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      // Validate that at least the teacher name is updated
      return parsed;
    }
    return COURSES_DATA;
  } catch (e) {
    console.error('Failed to load courses from localStorage:', e);
    return COURSES_DATA;
  }
};

export const saveStoredCourses = (courses: CourseGroup[]): void => {
  try {
    localStorage.setItem(COURSES_STORAGE_KEY, JSON.stringify(courses));
    window.dispatchEvent(new Event('kyrgyz_akylman_courses_updated'));
  } catch (e) {
    console.error('Failed to save courses to localStorage:', e);
  }
};

export const resetStoredCourses = (): CourseGroup[] => {
  try {
    localStorage.setItem(COURSES_STORAGE_KEY, JSON.stringify(COURSES_DATA));
    window.dispatchEvent(new Event('kyrgyz_akylman_courses_updated'));
    return COURSES_DATA;
  } catch (e) {
    console.error('Failed to reset courses:', e);
    return COURSES_DATA;
  }
};

export const getStoredStudents = (): EnrolledStudentRecord[] => {
  try {
    const raw = localStorage.getItem(ENROLLED_STUDENTS_KEY);
    if (!raw) {
      localStorage.setItem(ENROLLED_STUDENTS_KEY, JSON.stringify(DEFAULT_STUDENTS));
      return DEFAULT_STUDENTS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return DEFAULT_STUDENTS;
  } catch (e) {
    console.error('Failed to load students:', e);
    return DEFAULT_STUDENTS;
  }
};

export const saveStoredStudents = (students: EnrolledStudentRecord[]): void => {
  try {
    localStorage.setItem(ENROLLED_STUDENTS_KEY, JSON.stringify(students));
    window.dispatchEvent(new Event('kyrgyz_akylman_students_updated'));
  } catch (e) {
    console.error('Failed to save students:', e);
  }
};
