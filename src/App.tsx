import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { TestPage } from './pages/TestPage';
import { ResultsPage } from './pages/ResultsPage';
import { PracticePage } from './pages/PracticePage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { AdminPage } from './pages/AdminPage';
import { ProfilePage } from './pages/ProfilePage';
import { TelegramCallbackPage } from './pages/TelegramCallbackPage';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { TwinklingStars } from './components/TwinklingStars';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TrialWelcomeModal } from './components/TrialWelcomeModal';
import { CreativeLoader } from './components/CreativeLoader';
import { ScrollToTopButton } from './components/ScrollToTopButton';

import { AppLanguage } from './types';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const AppContent: React.FC<{
  lang: AppLanguage;
  setLang: (lang: AppLanguage) => void;
}> = ({ lang, setLang }) => {
  const { isTrialWelcomeOpen, closeTrialWelcomeModal } = useAuth();
  const location = useLocation();
  const isTestPage = location.pathname.startsWith('/test/');
  const isAdminPage = location.pathname === '/admin';

  // Multi-device Content Protection across iOS, Android, macOS, Windows
  useEffect(() => {
    // 1. Disable context menu (right click / long-press save image)
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    // 2. Prevent drag-and-drop download of images
    const handleDragStart = (e: DragEvent) => {
      e.preventDefault();
    };

    // 3. Disable common print, save, devtools and screenshot shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // PrintScreen detection: clear clipboard
      if (e.key === 'PrintScreen') {
        try {
          navigator.clipboard?.writeText?.('');
        } catch {}
      }

      // Ctrl/Cmd + S (Save), Ctrl/Cmd + P (Print), Ctrl/Cmd + U (Source)
      if (
        (e.ctrlKey || e.metaKey) &&
        (e.key === 's' || e.key === 'S' || e.key === 'p' || e.key === 'P' || e.key === 'u' || e.key === 'U')
      ) {
        e.preventDefault();
      }

      // Ctrl/Cmd + Shift + I/C/J (DevTools inspect) or F12
      if (
        e.key === 'F12' ||
        ((e.ctrlKey || e.metaKey) &&
          e.shiftKey &&
          (e.key === 'I' || e.key === 'i' || e.key === 'C' || e.key === 'c' || e.key === 'J' || e.key === 'j'))
      ) {
        e.preventDefault();
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('dragstart', handleDragStart);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('dragstart', handleDragStart);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#041d16] text-emerald-50 transition-colors duration-200 select-none relative">
      <TwinklingStars density="dense" />
      <ScrollToTop />
      {!isTestPage && !isAdminPage && (
        <Header
          lang={lang}
          setLang={setLang}
        />
      )}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage lang={lang} />} />
          <Route path="/test/:variantId" element={<TestPage lang={lang} />} />
          <Route path="/results" element={<ResultsPage lang={lang} />} />
          <Route path="/practice" element={<PracticePage lang={lang} />} />
          <Route path="/profile" element={<ProfilePage lang={lang} />} />
          <Route path="/privacy" element={<PrivacyPage lang={lang} />} />
          <Route path="/terms" element={<TermsPage lang={lang} />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/auth/callback" element={<TelegramCallbackPage lang={lang} />} />
          <Route path="/auth/telegram/callback" element={<TelegramCallbackPage lang={lang} />} />
        </Routes>
      </main>
      {!isTestPage && !isAdminPage && <Footer lang={lang} />}
      <ScrollToTopButton lang={lang} />
      <TrialWelcomeModal
        isOpen={isTrialWelcomeOpen}
        onClose={closeTrialWelcomeModal}
        lang={lang}
      />
    </div>
  );
};

export default function App() {
  const [lang, setLang] = useState<AppLanguage>(() => {
    const saved = localStorage.getItem('ort_lang');
    if (saved === 'kg' || saved === 'ru') return saved;
    return 'ru';
  });
  const [initialLoading, setInitialLoading] = useState(true);

  const handleSetLang = (newLang: AppLanguage) => {
    setLang(newLang);
    localStorage.setItem('ort_lang', newLang);
  };

  useEffect(() => {
    document.documentElement.classList.add('dark');
    localStorage.setItem('ort_theme', 'dark');

    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 650);

    return () => clearTimeout(timer);
  }, []);

  if (initialLoading) {
    return (
      <CreativeLoader
        size="fullscreen"
        text={lang === 'kg' ? 'Кыргыз Акылман ЖРТ платформасы жүктөлүүдө...' : 'Загрузка платформы Кыргыз Акылман...'}
        subtext={lang === 'kg' ? 'Даярдануу системасы ишке кирүүдө' : 'Система подготовки к ОРТ запускается'}
      />
    );
  }

  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent
          lang={lang}
          setLang={handleSetLang}
        />
      </BrowserRouter>
    </AuthProvider>
  );
}

