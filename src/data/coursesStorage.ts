import { CourseGroup, CourseLesson, CourseHomework, CourseChatMessage } from '../types/courses';
import { COURSES_DATA, COURSE_TEMPLATE_PREVIEW } from './coursesData';

const COURSES_STORAGE_KEY = 'kyrgyz_akylman_courses_v3';
const ENROLLED_STUDENTS_KEY = 'kyrgyz_akylman_enrolled_students_v3';

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

const DEFAULT_STUDENTS: EnrolledStudentRecord[] = [];

export const getStoredCourses = (): CourseGroup[] => {
  try {
    const raw = localStorage.getItem(COURSES_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(COURSES_STORAGE_KEY, JSON.stringify(COURSES_DATA));
      return COURSES_DATA;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      // Filter out any basic math module course
      const filtered = parsed.filter(
        (c) =>
          c.id !== 'course-math-base-madylbaev' &&
          !(c.subject === 'math' && c.moduleType === 'base') &&
          !c.titleRu?.includes('Базовая часть')
      );
      if (filtered.length !== parsed.length) {
        localStorage.setItem(COURSES_STORAGE_KEY, JSON.stringify(filtered));
      }
      return filtered;
    }
    return COURSES_DATA;
  } catch (e) {
    console.error('Failed to load courses from localStorage:', e);
    return COURSES_DATA;
  }
};

export const saveStoredCourses = (courses: CourseGroup[]): void => {
  try {
    const cleanCourses = courses.filter(
      (c) =>
        c.id !== 'course-math-base-madylbaev' &&
        !(c.subject === 'math' && c.moduleType === 'base') &&
        !c.titleRu?.includes('Базовая часть')
    );
    localStorage.setItem(COURSES_STORAGE_KEY, JSON.stringify(cleanCourses));
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
