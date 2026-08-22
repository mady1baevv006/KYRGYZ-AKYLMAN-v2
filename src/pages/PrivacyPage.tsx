import React from 'react';
import { Link } from 'react-router-dom';
import { AppLanguage } from '../types';

const PRIVACY_TRANSLATIONS = {
  ru: {
    backHome: '← Назад на главную',
    title: 'Конфиденциальность',
    sec1Title: '1. Сбор данных',
    sec1Text: 'Мы не собираем и не храним ваши персональные данные (имя, фамилию, номер телефона или email) на наших серверах в процессе обычного тестирования.',
    sec2Title: '2. Локальное хранение',
    sec2Text: 'Для работы функции «Экзамен на паузе» используются технологии локального хранения данных (localStorage) вашего браузера. Эта информация (ваши ответы и время) хранится исключительно на вашем устройстве и не передается третьим лицам.',
    sec3Title: '3. Безопасность',
    sec3Text: 'Все запросы между вашим браузером и нашим сервером зашифрованы. Мы прилагаем все усилия для обеспечения безопасности работы с платформой.',
  },
  kg: {
    backHome: '← Башкы бетке кайтуу',
    title: 'Купуялуулук саясаты',
    sec1Title: '1. Маалыматтарды чогултуу',
    sec1Text: 'Биз кадимки тестирлөө учурунда жеке маалыматтарыңызды (аты-жөнү, телефон номери же email) серверлерибизде чогултпайбыз жана сактабайбыз.',
    sec2Title: '2. Жергиликтүү сактоо',
    sec2Text: '«Тестти тындыруу» кызматын камсыз кылуу үчүн браузериңиздин жергиликтүү сактоо технологиялары (localStorage) колдонулат. Бул маалыматтар (жоопторуңуз жана убактыңыз) сиздин түзмөгүңүздө гана сакталат.',
    sec3Title: '3. Коопсуздук',
    sec3Text: 'Браузериңиз менен биздин сервердин ортосундагы бардык суроо-талаптар шифрленген. Биз платформанын коопсуздугун камсыз кылууга бардык күч-аракетибизди жумшайбыз.',
  },
  en: {
    backHome: '← Back to Home',
    title: 'Privacy Policy',
    sec1Title: '1. Data Collection',
    sec1Text: 'We do not collect or store your personal information (name, surname, phone number, or email) on our servers during standard testing.',
    sec2Title: '2. Local Storage',
    sec2Text: 'To power the "Pause Test" feature, your browser local storage (localStorage) is used. This information (your answers and timer state) is stored strictly on your device and is not transmitted to third parties.',
    sec3Title: '3. Security',
    sec3Text: 'All requests between your browser and our server are encrypted. We strive to provide a secure learning environment.',
  },
};

export const PrivacyPage: React.FC<{ lang?: AppLanguage }> = ({ lang = 'ru' }) => {
  const t = PRIVACY_TRANSLATIONS[lang] || PRIVACY_TRANSLATIONS.ru;

  return (
    <div className="min-h-screen bg-transparent text-slate-100 font-sans pb-20 transition-colors">
      <div className="max-w-3xl mx-auto px-6 pt-20">
        <Link
          to="/"
          className="text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:underline transition-colors inline-flex items-center gap-1"
        >
          {t.backHome}
        </Link>
        <h1 className="text-4xl font-black mt-8 mb-10 tracking-tight text-slate-900 dark:text-white">
          {t.title}
        </h1>
        <div className="space-y-8 text-slate-600 dark:text-slate-300 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
              {t.sec1Title}
            </h2>
            <p>{t.sec1Text}</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
              {t.sec2Title}
            </h2>
            <p>{t.sec2Text}</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
              {t.sec3Title}
            </h2>
            <p>{t.sec3Text}</p>
          </section>
        </div>
      </div>
    </div>
  );
};
