import React, { useState, useEffect } from 'react';
import { AppLanguage } from '../../types';
import { CourseGroup } from '../../types/courses';
import { MOCK_STUDENT_COURSE_PROFILE } from '../../data/coursesData';
import { getStoredCourses } from '../../data/coursesStorage';
import { CourseClassroom } from './CourseClassroom';
import { CourseEnrollModal } from './CourseEnrollModal';
import { CourseCurriculumShowcase } from './CourseCurriculumShowcase';
import { useAuth } from '../../context/AuthContext';

interface CoursesSectionProps {
  lang: AppLanguage;
}

export const CoursesSection: React.FC<CoursesSectionProps> = ({ lang }) => {
  const { user, isVip, isPremium, isAdmin } = useAuth();
  const hasVipAccess = isPremium || isVip;

  // Load courses from storage
  const [courses, setCourses] = useState<CourseGroup[]>(() => {
    return getStoredCourses();
  });

  const [activeClassroomCourse, setActiveClassroomCourse] = useState<CourseGroup | null>(null);
  const [enrollingCourse, setEnrollingCourse] = useState<CourseGroup | null>(null);

  // Identify the flagship math course with the 7-module curriculum
  const flagshipCourse =
    courses.find((c) => c.curriculumModules && c.curriculumModules.length > 0) || courses[0];

  // Enrolled course IDs
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('kyrgyz_akylman_enrolled_courses');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  useEffect(() => {
    const handleCoursesUpdate = () => {
      setCourses(getStoredCourses());
    };
    window.addEventListener('kyrgyz_akylman_courses_updated', handleCoursesUpdate);
    return () => {
      window.removeEventListener('kyrgyz_akylman_courses_updated', handleCoursesUpdate);
    };
  }, []);

  // Save enrollments
  useEffect(() => {
    try {
      localStorage.setItem('kyrgyz_akylman_enrolled_courses', JSON.stringify(enrolledCourseIds));
    } catch (e) {
      console.error('Error saving enrollments:', e);
    }
  }, [enrolledCourseIds]);

  const handleEnrollSuccess = (courseId: string) => {
    setEnrolledCourseIds((prev) => Array.from(new Set([...prev, courseId])));
    setEnrollingCourse(null);
    const target = courses.find((c) => c.id === courseId);
    if (target) {
      setActiveClassroomCourse(target);
    }
  };

  // If student entered classroom
  if (activeClassroomCourse) {
    return (
      <CourseClassroom
        course={activeClassroomCourse}
        studentProfile={MOCK_STUDENT_COURSE_PROFILE}
        lang={lang}
        onBackToCatalog={() => setActiveClassroomCourse(null)}
      />
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* THE ONLY PAGE / BIG BLOCK: "Математика ОРТ: Годовой курс подготовка на 220+ баллов" */}
      {flagshipCourse && (
        <CourseCurriculumShowcase
          course={flagshipCourse}
          lang={lang}
          isPremium={isPremium}
          isVip={isVip}
          isEnrolled={enrolledCourseIds.includes(flagshipCourse.id)}
          onEnroll={(c) => setEnrollingCourse(c)}
          onEnterClassroom={(c) => setActiveClassroomCourse(c)}
        />
      )}

      {/* Enrollment Modal */}
      {enrollingCourse && (
        <CourseEnrollModal
          course={enrollingCourse}
          lang={lang}
          onClose={() => setEnrollingCourse(null)}
          onEnrollSuccess={handleEnrollSuccess}
        />
      )}
    </div>
  );
};
