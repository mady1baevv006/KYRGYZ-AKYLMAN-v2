import React from 'react';
import { AppLanguage } from '../types';
import { CoursesSection } from '../components/courses/CoursesSection';

interface CoursesPageProps {
  lang: AppLanguage;
}

export const CoursesPage: React.FC<CoursesPageProps> = ({ lang }) => {
  return (
    <div className="min-h-screen bg-[#031510] text-slate-100 py-6 sm:py-10 px-3 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <CoursesSection lang={lang} />
      </div>
    </div>
  );
};
