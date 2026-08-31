import { AppLanguage } from './index';

export type CourseSubject = 'math' | 'analogies' | 'reading' | 'grammar' | 'intensive';

export interface CourseTeacher {
  id: string;
  name: string;
  nameKg: string;
  title: string;
  titleKg: string;
  avatar: string;
  credentials: string;
  credentialsKg: string;
  ortScore?: number;
  experienceYears: number;
}

export interface CourseScheduleItem {
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, etc.
  dayNameRu: string;
  dayNameKg: string;
  startTime: string; // e.g. "18:30"
  endTime: string;   // e.g. "20:00"
  timezone: string;  // "Бишкек (GMT+6)"
}

export interface CourseLesson {
  id: string;
  titleRu: string;
  titleKg: string;
  topicRu: string;
  topicKg: string;
  date: string; // ISO or "2026-09-02"
  time: string; // "18:30"
  durationMinutes: number;
  status: 'upcoming' | 'live' | 'completed';
  recordingUrl?: string;
  materialsPdfUrl?: string;
  homeworkId?: string;
  zoomOrRoomId?: string;
}

export interface CourseHomework {
  id: string;
  lessonId: string;
  titleRu: string;
  titleKg: string;
  descriptionRu: string;
  descriptionKg: string;
  dueDate: string;
  taskCount: number;
  maxScore: number;
  status: 'pending' | 'submitted' | 'graded';
  studentScore?: number;
  teacherFeedback?: string;
  submittedAt?: string;
}

export interface CourseChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  senderRole: 'teacher' | 'admin' | 'student';
  text: string;
  timestamp: string;
  isPinned?: boolean;
  attachedFile?: string;
}

export interface CourseGroup {
  id: string;
  titleRu: string;
  titleKg: string;
  subject: CourseSubject;
  subjectNameRu: string;
  subjectNameKg: string;
  targetBadgeRu: string;
  targetBadgeKg: string;
  targetScore: number; // e.g. 220
  descriptionRu: string;
  descriptionKg: string;
  teacher: CourseTeacher;
  totalSpots: number;
  enrolledCount: number;
  priceSom: number;
  periodLabelRu: string;
  periodLabelKg: string;
  isFreeForPremium: boolean;
  schedule: CourseScheduleItem[];
  nextLessonDate: string;
  nextLessonTime: string;
  isLiveNow?: boolean;
  tags: string[];
  lessons: CourseLesson[];
  homeworks: CourseHomework[];
  chatMessages: CourseChatMessage[];
}

export interface StudentCourseProfile {
  studentId: string;
  studentName: string;
  studentAvatar?: string;
  targetScore: number;
  currentEstimatedScore: number;
  attendanceRate: number; // 0 - 100
  homeworkCompletionRate: number; // 0 - 100
  lessonsAttended: number;
  totalLessons: number;
  streakDays: number;
  groupRank: number;
  totalStudentsInGroup: number;
  enrolledAt: string;
  status: 'active' | 'graduated' | 'trial';
  badges: Array<{
    id: string;
    icon: string;
    titleRu: string;
    titleKg: string;
    color: string;
  }>;
}
