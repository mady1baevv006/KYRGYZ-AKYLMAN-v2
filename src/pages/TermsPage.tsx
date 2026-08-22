import React from 'react';
import { Link } from 'react-router-dom';
import { AppLanguage } from '../types';

const TERMS_TRANSLATIONS = {
  ru: {
    backHome: '← Назад на главную',
    title: 'Правовая информация',
    sec1Title: '1. Интеллектуальная собственность',
    sec1Text1: 'Все материалы, включая вопросы тестов, варианты ответов и методики подсчета баллов, являются собственностью ',
    sec1Org: 'Центра оценки в образовании и методов обучения (ЦООМО)',
    sec1Text2: '. Данная платформа является независимым инструментом для подготовки и не претендует на владение авторскими правами на контент тестов.',
    sec2Title: '2. Отказ от ответственности',
    sec2Text: 'Результаты, полученные в ходе тестирования на данной платформе, являются ориентировочными и не могут служить официальным подтверждением уровня знаний для поступления в ВУЗы. Автор платформы не несет ответственности за несовпадение баллов симулятора с результатами реального экзамена.',
    sec3Title: '3. Использование сервиса',
    sec3Text: 'Платформа предоставляется «как есть». Использование материалов в коммерческих целях без разрешения правообладателей (ЦООМО) строго запрещено.',
  },
  kg: {
    backHome: '← Башкы бетке кайтуу',
    title: 'Укуктук маалымат',
    sec1Title: '1. Интеллектуалдык менчик',
    sec1Text1: 'Бардык материалдар, анын ичинде тест суроолору, жооп варианттары жана балл эсептөө ыкмалары ',
    sec1Org: 'Билим берүүнү баалоо жана окутуу усулдары борборунун (БББОУБ / ЦООМО)',
    sec1Text2: ' менчиги болуп саналат. Бул платформа көз карандысыз даярдоо куралы болуп саналат жана автордук укуктарды талап кылбайт.',
    sec2Title: '2. Жоопкерчиликтен баш тартуу',
    sec2Text: 'Бул платформадагы тесттин жыйынтыктары багыттоочу мүнөздө жана ЖОЖдорго тапшыруу үчүн расмий далил боло албайт. Платформанын түзүүчүсү симулятордогу баллдар менен чыныгы экзамендин жыйынтыктарынын дал келбестиги үчүн жоопкерчилик тартпайт.',
    sec3Title: '3. Кызматты колдонуу',
    sec3Text: 'Платформа «кандай болсо, ошондой» берилет. Материалдарды автордук укук ээлеринин уруксатысыз коммерциялык максатта колдонууга тыюу салынат.',
  },
  en: {
    backHome: '← Back to Home',
    title: 'Legal Information',
    sec1Title: '1. Intellectual Property',
    sec1Text1: 'All materials, including test questions, answer options, and scoring methods, are the property of the ',
    sec1Org: 'Center for Educational Assessment and Teaching Methods (CEATM / ЦООМО)',
    sec1Text2: '. This platform is an independent preparation tool and does not claim ownership of the test content copyright.',
    sec2Title: '2. Disclaimer',
    sec2Text: 'The results obtained during testing on this platform are indicative and cannot serve as official confirmation of knowledge for university admission. The authors are not responsible for discrepancies between simulator scores and actual exam results.',
    sec3Title: '3. Terms of Use',
    sec3Text: 'The platform is provided "as is". Commercial use of materials without permission from the copyright holders is strictly prohibited.',
  },
};

export const TermsPage: React.FC<{ lang?: AppLanguage }> = ({ lang = 'ru' }) => {
  const t = TERMS_TRANSLATIONS[lang] || TERMS_TRANSLATIONS.ru;

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
            <p>
              {t.sec1Text1}
              <strong className="text-slate-900 dark:text-white">{t.sec1Org}</strong>
              {t.sec1Text2}
            </p>
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
