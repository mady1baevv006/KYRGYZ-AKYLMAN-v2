import { RecommendedChannel, SectionMap } from '../types';

export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string) || '';

export const SECTION_NAMES: SectionMap = {
  1: 'Математика (Часть I)',
  2: 'Математика (Часть II)',
  3: 'Аналогии и дополнение предложений',
  4: 'Чтение и понимание',
  5: 'Практическая грамматика',
};

export const SECTION_NAMES_KG: SectionMap = {
  1: 'Математика (I бөлүк)',
  2: 'Математика (II бөлүк)',
  3: 'Окшоштуктар жана сүйлөмдү толуктоо',
  4: 'Окуу жана түшүнүү',
  5: 'Практикалык грамматика',
};

export const SECTION_TIMERS: { [key: number]: number } = {
  1: 1800, // 30 mins (Математика I)
  2: 3600, // 60 mins (Математика II)
  3: 1800, // 30 mins (Аналогии и дополнения)
  4: 3600, // 60 mins (Чтение и понимание)
  5: 2100, // 35 mins (Практическая грамматика)
};

export const SECTION_TIMES = SECTION_TIMERS;

export const formatTime = (seconds: number): string => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

export const getSectionQuestionRange = (sectionId: number): [number, number] => {
  if (sectionId === 1) return [1, 30];
  if (sectionId === 2) return [31, 60];
  if (sectionId === 3) return [61, 90];
  if (sectionId === 4) return [91, 120];
  if (sectionId === 5) return [121, 150];
  return [1, 30];
};

export const getSectionQuestions = (sectionId: number): number[] => {
  if (sectionId === 1) return Array.from({ length: 30 }, (_, i) => i + 1);
  if (sectionId === 2) return Array.from({ length: 30 }, (_, i) => i + 31);
  if (sectionId === 3) return Array.from({ length: 30 }, (_, i) => i + 61);
  if (sectionId === 4) return Array.from({ length: 30 }, (_, i) => i + 91);
  if (sectionId === 5) return Array.from({ length: 30 }, (_, i) => i + 121);
  return [];
};

export const getRelativeQuestionNumber = (globalNum: number, sectionId: number): number => {
  if (sectionId === 1 || sectionId === 2) return globalNum;
  if (sectionId === 3) return globalNum - 60;
  if (sectionId === 4) return globalNum - 90;
  if (sectionId === 5) return globalNum - 120;
  return globalNum;
};

export interface MotivationalQuote {
  text: string;
  author: string;
  source: string;
}

export const MOTIVATIONAL_QUOTES_RU: MotivationalQuote[] = [
  {
    text: 'Если ты сейчас уснешь, то тебе приснится твоя мечта. Если же сейчас выберешь учиться, то воплотишь свою мечту в реальность.',
    author: 'Гарвардский университет',
    source: 'Harvard University (Гарвардские наставления)',
  },
  {
    text: 'Мука учения лишь временна. Мука незнания и упущенных возможностей — вечна.',
    author: 'Гарвардский университет',
    source: 'Harvard University',
  },
  {
    text: 'Самое трудное для человека — быть каждый день человеком. А истинное образование и честный труд дают крылья твоему достоинству.',
    author: 'Чынгыз Айтматов',
    source: 'Великий писатель и мыслитель',
  },
  {
    text: 'Знание и мудрость — неиссякаемое сокровище, возвышающее человека над всеми трудностями мира.',
    author: 'Махмуд Кашгари',
    source: '«Диван лугат ат-турк», великий учёный-энциклопедист',
  },
  {
    text: 'Ум — неизнашиваемая одежда, знание — нескончаемое богатство. Упорный ученик преодолеет любые преграды.',
    author: 'Токтогул Сатылганов',
    source: 'Великий кыргызский акын и мыслитель',
  },
  {
    text: 'Упорство и дисциплина всегда побеждают врожденный талант, когда талант перестает усердно трудиться.',
    author: 'Оксфордский университет',
    source: 'University of Oxford',
  },
  {
    text: 'Знание открывает путь к величию, а дисциплинированный разум покоряет любые недосягаемые вершины.',
    author: 'Жусуп Баласагын',
    source: 'Мыслитель и поэт, «Кутадгу Билиг»',
  },
  {
    text: 'Тот, кто задает вопрос и ищет ответ — кажется незнающим лишь пять минут. Тот, кто не учится — остается невеждой навсегда.',
    author: 'Кембриджский университет',
    source: 'University of Cambridge',
  },
  {
    text: 'Инвестиции в знания и ежедневную подготовку всегда приносят наивысшие дивиденды в жизни.',
    author: 'Бенджамин Франклин',
    source: 'Harvard Hon. / Признанный мыслитель',
  },
  {
    text: 'Билек бирди жыгат, билим миңди жыгат (Сила победит одного, а глубокие знания одолеют тысячи преград).',
    author: 'Кыргызская народная мудрость',
    source: 'Эпос «Манас» и народное наследие',
  },
];

export const MOTIVATIONAL_QUOTES_KG: MotivationalQuote[] = [
  {
    text: 'Азыр уктасаң — кыялың түшүңө гана кирет. Азыр окуп, эмгектенсең — кыялың чындыкка айланат.',
    author: 'Гарвард университети',
    source: 'Harvard University (Гарвард насааттары)',
  },
  {
    text: 'Окуунун кыйынчылыгы убактылуу. Билимсиздиктин жана колдон чыгарган мүмкүнчүлүктүн өкүнүчү түбөлүктүү.',
    author: 'Гарвард университети',
    source: 'Harvard University',
  },
  {
    text: 'Адамга эң кыйыны — күн сайын адам болуу. Ал эми билим менен эмгек — адамдын рухун бийиктеткен түгөнгүс күч.',
    author: 'Чыңгыз Айтматов',
    source: 'Улуу жазуучу жана ойчул',
  },
  {
    text: 'Билимдүү адам — түгөнбөс кенч, акылдуу адам — караңгыдагы шам чырак. Өнөрдү эрикпей үйрөн.',
    author: 'Махмуд Кашгари',
    source: '«Диван лугат ат-түрк», улуу ойчул-энциклопедист',
  },
  {
    text: 'Акыл — тозбос тон, билим — түгөнбөс кенч. Талыкпаган өжөр жаш багынбас ашууларды багындырат.',
    author: 'Токтогул Сатылганов',
    source: 'Улуу акын, комузчу жана ойчул',
  },
  {
    text: 'Өжөрлүк менен темирдей тартип тубаса шыкты жеңет, эгерде шык талыкпай күн сайын эмгектенбесе.',
    author: 'Оксфорд университети',
    source: 'University of Oxford',
  },
  {
    text: 'Билим берди — адам бакыт тапты, билим менен көккө канат какты. Акылга таянган адам ар дайым жеңишке жетет.',
    author: 'Жусуп Баласагын',
    source: '«Кут алчу билим» дастанынын автору',
  },
  {
    text: 'Суроо берип үйрөнгөн адам беш мүнөт гана билбегендей көрүнөт. Окубай койгон адам өмүр бою карандай караңгы калат.',
    author: 'Кембридж университети',
    source: 'University of Cambridge',
  },
  {
    text: 'Билимге жана өзүңдү өнүктүрүүгө жумшалган ар бир мүнөт келечекте эң чоң жеңиштерди алып келет.',
    author: 'Бенджамин Франклин',
    source: 'Гарвард университетинин ардактуу доктору',
  },
  {
    text: 'Билек бирди жыгат, билим миңди жыгат.',
    author: 'Кыргыз эл накылы',
    source: 'Элдик акылмандык жана «Манас» мурасы',
  },
];

export const MOTIVATIONAL_QUOTES = MOTIVATIONAL_QUOTES_RU.map((q) => q.text);

export const RECOMMENDED_CHANNELS: RecommendedChannel[] = [
  {
    id: 1,
    name: 'ORT Titans Chat',
    description: 'До безумия хороший канал по подготовке к ОРТ, отдуши предлагаю.',
    link: 'https://t.me/ort_titans_chat',
    avatar: '/titans.jpg',
    members: 'Вступить в чат',
  },
  {
    id: 2,
    name: 'ОРТ Акбай',
    description: 'Самое активное комьюнити. Обсуждения, советы и совместная подготовка к ОРТ.',
    link: 'https://t.me/ort_akbai',
    avatar: '/akbai.jpg',
    members: 'Подписаться',
  },
  {
    id: 3,
    name: 'ЖРТ Материал',
    description: 'Лучшие материалы, разборы и тесты для уверенной сдачи ЖРТ на высокий балл.',
    link: 'https://t.me/daiyr_tilebaldyev',
    avatar: '/jrt_material.jpg',
    members: 'Присоединиться',
  },
  {
    id: 4,
    name: 'Грамматическая армия с Миланой 💅🏻',
    description: 'Строго, но эффективно. Улучшаем грамматику и готовимся забирать свои баллы.',
    link: 'https://t.me/+LShDyZ8VwKYzYTI6',
    avatar: '/milana.jpg',
    members: 'Вступить в ряды',
  },
  {
    id: 5,
    name: 'ЖРТ/ОРТ (Кыргызча)',
    description: 'Жалпы республикалык тестирлөөгө кыргыз тилинде мыкты даярдануу үчүн пайдалуу материалдар жана тесттер.',
    link: 'https://t.me/jrtkyrgyzcom',
    avatar: '/jrt_kyrgyz.jpg',
    members: 'Катталуу',
  },
  {
    id: 6,
    name: 'Espada',
    description: 'Один из лучших телеграм-каналов, где сидит почти вся молодёжь. Присоединяйся к огромному комьюнити!',
    link: 'https://t.me/espada_ort',
    avatar: '/espadaort.jpg',
    members: 'Подписаться',
  },
];

export const SUBJECT_TOPICS_AND_SKILLS = {
  ru: {
    math: {
      subs: [
        'Алгебра',
        'Арифметика',
        'Геометрия',
        'Статистика и вероятность',
      ],
      skills: [
        'Умение выполнять арифметические действия с рациональными числами',
        'Умение решать задачи на части, проценты, пропорции',
        'Умение выполнять действия с корнями',
        'Умение выполнять преобразование числовых выражений',
        'Умение использовать изображение фигур в декартовой системе координат',
        'Умение применять свойства основных геометрических фигур',
        'Умение применять новые понятия и определения',
        'Умение применять свойства степени',
        'Умение применять свойства целых чисел',
        'Умение решать рациональные уравнения',
        'Умение находить значение функции',
      ],
    },
    reading: {
      subs: [
        'Аналогии',
        'Дополнение предложений',
        'Чтение и понимание текста',
      ],
      skills: [
        'Умение находить аргументы за или против заданного явления',
        'Умение находить нужную информацию в тексте',
        'Умение определять главную цель автора',
        'Умение сопоставить между собой предложенные части',
        'Умение понимать логические связи между частями высказывания',
        'Умение определять значение слов в зависимости от контекста',
        'Умение анализировать отношения между понятиями',
        'Умение определить причину заданного явления',
        'Умение сделать вывод на основе информации всего текста',
        'Умение сделать вывод на основе информации отрывка',
        'Умение понимать назначение формы текста',
      ],
    },
    grammar: {
      subs: [
        'Синтаксис',
        'Пунктуация',
        'Орфография',
        'Морфология',
        'Лексика',
        'Культура речи',
      ],
      skills: [
        'Умение расставить соответствующие знаки препинания',
        'Умение определять грамматическую основу предложения',
        'Умение правильно согласовывать слова в предложении',
        'Умение находить и исправлять речевые и стилистические ошибки',
      ],
    },
  },
  kg: {
    math: {
      subs: [
        'Алгебра',
        'Арифметика',
        'Геометрия',
        'Статистика жана ыктымалдуулук',
      ],
      skills: [
        'Рационалдык сандар менен арифметикалык амалдарды аткара билүү',
        'Бөлүктөргө, пайыздарга жана пропорцияларга маселелерди чыгара билүү',
        'Тамырлар менен амалдарды аткара билүү',
        'Сандык туюнтмаларды өзгөртүп түзө билүү',
        'Декарттык координаттар системасында фигуралардын сүрөттөлүшүн колдоно билүү',
        'Негизги геометриялык фигуралардын касиеттерин колдоно билүү',
        'Жаңы түшүнүктөрдү жана аныктамаларды колдоно билүү',
        'Даражанын касиеттерин колдоно билүү',
        'Бүтүн сандардын касиеттерин колдоно билүү',
        'Рационалдык теңдемелерди чыгара билүү',
        'Функциянын маанисин таба билүү',
      ],
    },
    reading: {
      subs: [
        'Окшоштуктар',
        'Сүйлөмдү толуктоо',
        'Текстти окуу жана түшүнүү',
      ],
      skills: [
        'Берилген кубулуш боюнча далилдерди таба билүү',
        'Тексттен керектүү маалыматты таба билүү',
        'Автордун негизги максатын аныктай билүү',
        'Сунушталган бөлүктөрдү салыштыра билүү',
        'Ой жүгүртүүнүн бөлүктөрүнүн ортосундагы логикалык байланыштарды түшүнө билүү',
        'Контекстке жараша сөздөрдүн маанисин аныктай билүү',
        'Түшүнүктөрдүн ортосундагы мамилелерди талдай билүү',
        'Кубулуштун себебин аныктай билүү',
        'Бардык тексттин негизинде жыйынтык чыгара билүү',
      ],
    },
    grammar: {
      subs: [
        'Синтаксис',
        'Тыныш белгилери',
        'Орфография',
        'Морфология',
        'Лексика',
      ],
      skills: [
        'Тиешелүү тыныш белгилерин коё билүү',
        'Сүйлөмдүн грамматикалык негизин аныктай билүү',
        'Сөздөрдү сүйлөмдө туура байланыштыра билүү',
        'Кептик жана стилдик каталарды таап оңдой билүү',
      ],
    },
  },
};

export const ANALYTICS_METADATA = SUBJECT_TOPICS_AND_SKILLS;

export const PRACTICE_TRANSLATIONS = {
  ru: {
    title: 'Тренировочный полигон',
    subtitle: 'Точечная отработка конкретных навыков и разделов без учета времени.',
    allTests: 'Все тесты',
    math: 'Математика',
    analogies: 'Аналогии и ДП',
    reading: 'Чтение и понимание',
    grammar: 'Практическая грамматика',
    mathPart1: 'Часть I (1-30)',
    mathPart2: 'Часть II (31-60)',
    mathBoth: 'Обе части (1-60)',
    empty: 'В этом разделе пока нет тестов.',
    start: 'Начать тренировку',
  },
  kg: {
    title: 'Машыгуу полигону',
    subtitle: 'Убакытты эсепке албастан, конкреттүү бөлүмдөрдү жана көндүмдөрдү машыгуу.',
    allTests: 'Бардык тесттер',
    math: 'Математика',
    analogies: 'Окшоштуктар жана СТ',
    reading: 'Окуу жана түшүнүү',
    grammar: 'Практикалык грамматика',
    mathPart1: 'I бөлүк (1-30)',
    mathPart2: 'II бөлүк (31-60)',
    mathBoth: 'Эки бөлүк тең (1-60)',
    empty: 'Бул бөлүмдө азырынча тесттер жок.',
    start: 'Машыгууну баштоо',
  },
};

export const KYRGYZ_UNIVERSITIES = [
  'КНУ им. Ж. Баласагына — Кыргызский национальный университет',
  'КГТУ им. И. Раззакова — Кыргызский государственный технический университет',
  'КГМА им. И.К. Ахунбаева — Кыргызская государственная медицинская академия',
  'БГУ им. К. Карасаева — Бишкекский государственный университет',
  'КГУ им. И. Арабаева — Кыргызский государственный университет',
  'КЭУ им. М. Рыскулбекова — Кыргызский экономический университет',
  'КНАУ им. К.И. Скрябина — Кыргызский национальный аграрный университет',
  'КГУСТА им. Н. Исанова — Кыргызский государственный университет строительства, транспорта и архитектуры',
  'КРСУ им. Б. Ельцина — Кыргызско-Российский Славянский университет',
  'КТУ «Манас» — Кыргызско-Турецкий университет «Манас»',
  'АУЦА — Американский университет в Центральной Азии',
  'МУЦА — Международный университет в Центральной Азии',
  'МУК — Международный университет Кыргызстана',
  'МУ «Ала-Тоо» — Международный университет «Ала-Тоо»',
  'УЦА — Университет Центральной Азии',
  'ИСИТО — Институт современных информационных технологий в образовании',
  'Университет «Адам» — Бишкекская финансово-экономическая академия',
  'Салымбеков Университет — Учреждение «Салымбеков Университет»',
  'МВШМ — Международная высшая школа медицины',
  'МАУПФиБ — Международная академия управления, права, финансов и бизнеса',
  'ММУ — Международный медицинский университет',
  'КРАО — Кыргызско-Российская Академия образования',
  'Академия МВД КР им. Э. Алиева — Академия Министерства внутренних дел Кыргызской Республики',
  'ДА МИД КР им. К. Дикамбаева — Дипломатическая академия Министерства иностранных дел Кыргызской Республики',
  'КНК им. К. Молдобасанова — Кыргызская национальная консерватория',
  'НАХ КР им. Т. Садыкова — Национальная академия художеств Кыргызской Республики',
  'Академия ОБСЕ — Академия ОБСЕ в Бишкеке',
  'ОшГУ — Ошский государственный университет',
  'ОшТУ — Ошский технологический университет',
  'ОшГПУ — Ошский государственный педагогический университет',
  'ЖАГУ им. Б. Осмонова — Джалал-Абадский государственный университет',
  'ИГУ им. К. Тыныстанова — Иссык-Кульский государственный университет',
  'НГУ им. С. Нааматова — Нарынский государственный университет',
  'ТГУ — Таласский государственный университет',
  'БатГУ — Баткенский государственный университет',
];

export interface AvatarOption {
  id: string;
  nameRu: string;
  nameKg: string;
  url: string;
  attribution: string;
  category?: string;
}

export const USER_AVATARS: AvatarOption[] = [
  {
    id: 'bobcat',
    nameRu: 'Рысь (Bobcat)',
    nameKg: 'Сүлөөсүн',
    url: '/avatars/bobcat.svg',
    attribution: 'Bobcat icons created by Magnific - Flaticon',
  },
  {
    id: 'boa_constrictor',
    nameRu: 'Удав (Boa constrictor)',
    nameKg: 'Боа жыланы',
    url: '/avatars/boa_constrictor.svg',
    attribution: 'Boa constrictor icons created by Magnific - Flaticon',
    category: 'reptiles',
  },
  {
    id: 'blue_whale',
    nameRu: 'Синий кит (Blue whale)',
    nameKg: 'Көк кит',
    url: '/avatars/blue_whale.svg',
    attribution: 'Blue whale icons created by Magnific - Flaticon',
    category: 'marine',
  },
  {
    id: 'sea_turtle',
    nameRu: 'Морская черепаха (Sea turtle)',
    nameKg: 'Деңиз таш бакасы',
    url: '/avatars/sea_turtle.svg',
    attribution: 'Sea turtle icons created by Magnific - Flaticon',
    category: 'marine',
  },
  {
    id: 'narwhal',
    nameRu: 'Нарвал (Narwhal)',
    nameKg: 'Нарвал',
    url: '/avatars/narwhal.svg',
    attribution: 'Narwhal icons created by Magnific - Flaticon',
    category: 'marine',
  },
  {
    id: 'vaquita',
    nameRu: 'Вакита (Vaquita)',
    nameKg: 'Вакита (деңиз чочкосу)',
    url: '/avatars/vaquita.svg',
    attribution: 'Vaquita icons created by Magnific - Flaticon',
    category: 'marine',
  },
  {
    id: 'tarsier',
    nameRu: 'Долгопят (Tarsier)',
    nameKg: 'Долгопят',
    url: '/avatars/tarsier.svg',
    attribution: 'Tarsier icons created by Magnific - Flaticon',
    category: 'mammals',
  },
  {
    id: 'asian_tapir',
    nameRu: 'Чепрачный тапир (Asian tapir)',
    nameKg: 'Азия тапири',
    url: '/avatars/asian_tapir.svg',
    attribution: 'Asian tapir icons created by Magnific - Flaticon',
    category: 'mammals',
  },
  {
    id: 'fauna',
    nameRu: 'Лисица (Fauna)',
    nameKg: 'Түлкү',
    url: '/avatars/fauna.svg',
    attribution: 'Fauna icons created by Magnific - Flaticon',
    category: 'mammals',
  },
  {
    id: 'arabian_oryx',
    nameRu: 'Аравийский орикс (Arabian oryx)',
    nameKg: 'Арабия орикси',
    url: '/avatars/arabian_oryx.svg',
    attribution: 'Arabian oryx icons created by Magnific - Flaticon',
    category: 'mammals',
  },
  {
    id: 'bird_toucan',
    nameRu: 'Тукан (Bird)',
    nameKg: 'Тукан',
    url: '/avatars/bird_toucan.svg',
    attribution: 'Bird icons created by Magnific - Flaticon',
    category: 'birds',
  },
  {
    id: 'jaguar',
    nameRu: 'Ягуар (Jaguar)',
    nameKg: 'Ягуар',
    url: '/avatars/jaguar.svg',
    attribution: 'Jaguar icons created by Magnific - Flaticon',
    category: 'mammals',
  },
  {
    id: 'panda',
    nameRu: 'Большая панда (Panda)',
    nameKg: 'Панда',
    url: '/avatars/panda.svg',
    attribution: 'Panda icons created by Magnific - Flaticon',
    category: 'mammals',
  },
  {
    id: 'animals_lion',
    nameRu: 'Лев (Animals)',
    nameKg: 'Арстан',
    url: '/avatars/animals_lion.svg',
    attribution: 'Animals icons created by Magnific - Flaticon',
    category: 'mammals',
  },
  {
    id: 'orangutan',
    nameRu: 'Орангутан (Orangutan)',
    nameKg: 'Орангутан',
    url: '/avatars/orangutan.svg',
    attribution: 'Orangutan icons created by Magnific - Flaticon',
    category: 'mammals',
  },
  {
    id: 'gazelle',
    nameRu: 'Газель (Gazelle)',
    nameKg: 'Жейрен',
    url: '/avatars/gazelle.svg',
    attribution: 'Gazelle icons created by Magnific - Flaticon',
    category: 'mammals',
  },
  {
    id: 'wolf',
    nameRu: 'Волк (Wolf)',
    nameKg: 'Карышкыр',
    url: '/avatars/wolf.svg',
    attribution: 'Wolf icons created by Magnific - Flaticon',
    category: 'mammals',
  },
  {
    id: 'red_panda',
    nameRu: 'Красная панда (Red panda)',
    nameKg: 'Кызыл панда',
    url: '/avatars/red_panda.svg',
    attribution: 'Red panda icons created by Magnific - Flaticon',
    category: 'mammals',
  },
  {
    id: 'ferret',
    nameRu: 'Черноногий хорёк (Black footed ferret)',
    nameKg: 'Кара шыйрак күзөн',
    url: '/avatars/ferret.svg',
    attribution: 'Black footed ferret icons created by Magnific - Flaticon',
    category: 'mammals',
  },
  {
    id: 'rhinoceros',
    nameRu: 'Носорог (Rhinoceros)',
    nameKg: 'Керик',
    url: '/avatars/rhinoceros.svg',
    attribution: 'Rhinoceros icons created by Magnific - Flaticon',
    category: 'mammals',
  },
  {
    id: 'snow_leopard',
    nameRu: 'Снежный барс (Fauna / Snow Leopard)',
    nameKg: 'Ак илбирс',
    url: '/avatars/snow_leopard.svg',
    attribution: 'Fauna icons created by Magnific - Flaticon',
    category: 'mammals',
  },
  {
    id: 'shark',
    nameRu: 'Белая акула (Great white shark)',
    nameKg: 'Ак акула',
    url: '/avatars/shark.svg',
    attribution: 'Great white shark icons created by Magnific - Flaticon',
    category: 'marine',
  },
  {
    id: 'sloth',
    nameRu: 'Ленивец (Sloth)',
    nameKg: 'Жалкоо жаныбар',
    url: '/avatars/sloth.svg',
    attribution: 'Sloth icons created by Magnific - Flaticon',
    category: 'mammals',
  },
  {
    id: 'bear',
    nameRu: 'Бурый медведь (Bear)',
    nameKg: 'Күрөң аюу',
    url: '/avatars/bear.svg',
    attribution: 'Bear icons created by Magnific - Flaticon',
    category: 'mammals',
  },
  {
    id: 'polar_bear',
    nameRu: 'Белый медведь (Polar bear)',
    nameKg: 'Ак аюу',
    url: '/avatars/polar_bear.svg',
    attribution: 'Polar bear icons created by Magnific - Flaticon',
    category: 'mammals',
  },
  {
    id: 'bird_owl',
    nameRu: 'Сова (Bird)',
    nameKg: 'Үкү',
    url: '/avatars/bird_owl.svg',
    attribution: 'Bird icons created by Magnific - Flaticon',
    category: 'birds',
  },
  {
    id: 'brown_pelican',
    nameRu: 'Бурый пеликан (Brown pelican)',
    nameKg: 'Күрөң пеликан',
    url: '/avatars/brown_pelican.svg',
    attribution: 'Brown pelican icons created by Magnific - Flaticon',
    category: 'birds',
  },
  {
    id: 'fauna_koala',
    nameRu: 'Коала (Fauna)',
    nameKg: 'Коала',
    url: '/avatars/fauna_koala.svg',
    attribution: 'Fauna icons created by Magnific - Flaticon',
    category: 'mammals',
  },
  {
    id: 'macaw',
    nameRu: 'Попугай ара (Macaw)',
    nameKg: 'Ара тоту кушу',
    url: '/avatars/macaw.svg',
    attribution: 'Macaw icons created by Magnific - Flaticon',
    category: 'birds',
  },
  {
    id: 'condor',
    nameRu: 'Калифорнийский кондор (California condor)',
    nameKg: 'Калифорния кондору',
    url: '/avatars/condor.svg',
    attribution: 'California condor icons created by Magnific - Flaticon',
    category: 'birds',
  },
  {
    id: 'monal',
    nameRu: 'Гималайский монал (Himalayan monal)',
    nameKg: 'Гималай моналы',
    url: '/avatars/monal.svg',
    attribution: 'Himalayan monal icons created by Magnific - Flaticon',
    category: 'birds',
  },
  {
    id: 'cassowary',
    nameRu: 'Казуар (Cassowary)',
    nameKg: 'Казуар',
    url: '/avatars/cassowary.svg',
    attribution: 'Cassowary icons created by Magnific - Flaticon',
    category: 'birds',
  },
  {
    id: 'camel',
    nameRu: 'Верблюд (Bactrian camel)',
    nameKg: 'Төө',
    url: '/avatars/camel.svg',
    attribution: 'Bactrian camel icons created by Magnific - Flaticon',
    category: 'mammals',
  },
  {
    id: 'bison',
    nameRu: 'Бизон (Bison)',
    nameKg: 'Зубр / Бизон',
    url: '/avatars/bison.svg',
    attribution: 'Bison icons created by Magnific - Flaticon',
    category: 'mammals',
  },
  {
    id: 'elk',
    nameRu: 'Благородный олень / Лось (Elk)',
    nameKg: 'Бугу / Багыш',
    url: '/avatars/elk.svg',
    attribution: 'Elk icons created by Magnific - Flaticon',
    category: 'mammals',
  },
  {
    id: 'chinchilla',
    nameRu: 'Шиншилла (Chinchilla)',
    nameKg: 'Шиншилла',
    url: '/avatars/chinchilla.svg',
    attribution: 'Chinchilla icons created by Magnific - Flaticon',
    category: 'mammals',
  },
  {
    id: 'fauna_meerkat',
    nameRu: 'Сурикат (Fauna)',
    nameKg: 'Сурикат',
    url: '/avatars/fauna_meerkat.svg',
    attribution: 'Fauna icons created by Magnific - Flaticon',
    category: 'mammals',
  },
  {
    id: 'tiger',
    nameRu: 'Тигр (Tiger)',
    nameKg: 'Жолборс',
    url: '/avatars/tiger.svg',
    attribution: 'Tiger icons created by Magnific - Flaticon',
    category: 'mammals',
  },
  {
    id: 'white_tiger',
    nameRu: 'Белый бенгальский тигр (White bengal tiger)',
    nameKg: 'Ак жолборс',
    url: '/avatars/white_tiger.svg',
    attribution: 'White bengal tiger icons created by Magnific - Flaticon',
    category: 'mammals',
  },
  {
    id: 'cheetah',
    nameRu: 'Гепард (Cheetah)',
    nameKg: 'Гепард',
    url: '/avatars/cheetah.svg',
    attribution: 'Cheetah icons created by Magnific - Flaticon',
    category: 'mammals',
  },
  {
    id: 'chimpanzee',
    nameRu: 'Шимпанзе (Chimpanzee)',
    nameKg: 'Шимпанзе',
    url: '/avatars/chimpanzee.svg',
    attribution: 'Chimpanzee icons created by Magnific - Flaticon',
    category: 'mammals',
  },
  {
    id: 'wildlife_kangaroo',
    nameRu: 'Кенгуру (Wildlife)',
    nameKg: 'Кенгуру',
    url: '/avatars/wildlife_kangaroo.svg',
    attribution: 'Wildlife icons created by Magnific - Flaticon',
    category: 'mammals',
  },
  {
    id: 'dugong',
    nameRu: 'Дюгонь (Dugong)',
    nameKg: 'Дюгонь',
    url: '/avatars/dugong.svg',
    attribution: 'Dugong icons created by Magnific - Flaticon',
    category: 'marine',
  },
  {
    id: 'dart_frog',
    nameRu: 'Золотистый древолаз (Golden poison dart frog)',
    nameKg: 'Алтын бака',
    url: '/avatars/dart_frog.svg',
    attribution: 'Golden poison dart frog icons created by Magnific - Flaticon',
    category: 'reptiles',
  },
  {
    id: 'babirusa',
    nameRu: 'Бабирусса (Babirusa)',
    nameKg: 'Бабирусса',
    url: '/avatars/babirusa.svg',
    attribution: 'Babirusa icons created by Magnific - Flaticon',
    category: 'mammals',
  },
];

