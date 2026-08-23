import { Question } from '../types';
import { getOptimizedTestPageUrl } from '../utils/imageOptimization';

// Shared Math Topics & Skills in Russian
export const MATH1_TOPICS_RU = [
  'Арифметика и делимость',
  'Дроби и проценты',
  'Алгебраические выражения',
  'Линейные уравнения',
  'Квадратные уравнения',
  'Степени и корни',
  'Пропорции и отношения',
  'Сравнение величин (Колонки А и Б)',
  'Сравнение алгебраических выражений',
  'Задачи на движение',
  'Задачи на работу и производительность',
  'Задачи на смеси и сплавы',
  'Геометрия: Углы и треугольники',
  'Геометрия: Теорема Пифагора',
  'Геометрия: Четырехугольники',
  'Геометрия: Окружность и круг',
  'Геометрия: Площади фигур',
  'Стереометрия: Объем и поверхность',
  'Координаты на плоскости',
  'Функции и графики',
  'Числовые последовательности и прогрессии',
  'Теория вероятностей',
  'Комбинаторика и логика',
  'Сравнение площадей и длин',
  'Статистика и среднее арифметическое',
  'Множества и круги Эйлера',
  'Модуль числа и свойства',
  'Неравенства и метод интервалов',
  'Нестандартные операции ОРТ',
  'Комплексные логические задачи',
];

export const MATH1_SKILLS_RU = [
  'Умение выполнять вычисления с целыми и рациональными числами',
  'Умение находить проценты и доли от величины',
  'Умение упрощать алгебраические выражения',
  'Умение находить корни линейных уравнений',
  'Умение решать квадратные уравнения и применять теорему Виета',
  'Умение применять свойства степеней и корней',
  'Умение составлять пропорции',
  'Умение сравнивать величины в колонках А и Б',
  'Умение определять знак разности выражений',
  'Умение применять формулу пути S = v·t',
  'Умение рассчитывать совместную производительность',
  'Умение составлять уравнения для процентной концентрации',
  'Умение находить углы при параллельных прямых',
  'Умение применять теорему Пифагора',
  'Умение находить периметры и стороны четырехугольников',
  'Умение находить радиус и длину окружности',
  'Умение вычислять площади плоских фигур',
  'Умение находить объем параллелепипеда, призмы и цилиндра',
  'Умение определять координаты точек и расстояние',
  'Умение считывать свойства функций по графикам',
  'Умение находить члены арифметической и геометрической прогрессий',
  'Умение находить классическую вероятность',
  'Умение вычислять число комбинаций и перестановок',
  'Умение сравнивать геометрические величины',
  'Умение находить среднее арифметическое набора чисел',
  'Умение использовать круги Эйлера',
  'Умение раскрывать модуль при различных знаках подмодульного выражения',
  'Умение решать неравенства методом интервалов',
  'Умение вычислять по заданному правилу нестандартной операции',
  'Умение делать логические выводы на основе условий ОРТ',
];

export const MATH2_TOPICS_RU = [
  'Алгебра и преобразования',
  'Дробно-рациональные уравнения',
  'Иррациональные уравнения',
  'Системы уравнений',
  'Неравенства второй степени',
  'Показательные уравнения',
  'Логарифмические уравнения',
  'Свойства логарифмов',
  'Тригонометрические формулы',
  'Тригонометрические уравнения',
  'Планиметрия: Прямоугольный треугольник',
  'Планиметрия: Равнобедренный треугольник',
  'Планиметрия: Трапеция и параллелограмм',
  'Вписанные и описанные окружности',
  'Площади сложных геометрических фигур',
  'Стереометрия: Призма и Параллелепипед',
  'Стереометрия: Пирамида',
  'Стереометрия: Тела вращения (Цилиндр, Конус, Шар)',
  'Векторы и координаты',
  'Прогрессии и числовые ряды',
  'Текстовые задачи на смеси и растворы',
  'Текстовые задачи на движение по воде и суше',
  'Задачи на проценты повышенной сложности',
  'Анализ графиков и диаграмм',
  'Уравнения и неравенства с модулем',
  'Комбинаторика и бином',
  'Метрические соотношения в треугольнике',
  'Исследование функций и экстремумы',
  'Сечения многогранников',
  'Логика и нестандартные задачи ОРТ',
];

export const MATH2_SKILLS_RU = [
  'Умение выполнять многошаговые алгебраические преобразования',
  'Умение решать дробно-рациональные уравнения с учетом ОДЗ',
  'Умение решать иррациональные уравнения',
  'Умение решать системы нелинейных уравнений',
  'Умение применять метод интервалов для квадратичных неравенств',
  'Умение приводить основания в показательных уравнениях',
  'Умение применять основные логарифмические тождества',
  'Умение преобразовывать логарифмические выражения',
  'Умение вычислять значения тригонометрических функций',
  'Умение решать базовые тригонометрические уравнения',
  'Умение находить элементы прямоугольного треугольника',
  'Умение находить углы и стороны равнобедренного треугольника',
  'Умение вычислять среднюю линию и площадь трапеции',
  'Умение находить радиус вписанной и описанной окружности',
  'Умение разбивать сложную фигуру на простые для вычисления площади',
  'Умение находить объем и площадь поверхности призмы',
  'Умение вычислять высоту и объем пирамиды',
  'Умение находить объем цилиндра и конуса',
  'Умение вычислять скалярное произведение векторов',
  'Умение суммировать члены прогрессии',
  'Умение составлять уравнения для процентной концентрации',
  'Умение учитывать скорость течения при движении',
  'Умение рассчитывать сложный процент',
  'Умение извлекать данные из графических зависимостей',
  'Умение раскрывать модули при решении уравнений',
  'Умение применять формулы сочетаний и перестановок',
  'Умение применять теоремы синусов и косинусов',
  'Умение определять промежутки монотонности функций',
  'Умение вычислять геометрические параметры тел вращения',
  'Умение проводить строгие логические рассуждения',
];

// Shared Math Topics & Skills in Kyrgyz (ББОУБ)
export const MATH1_TOPICS_KG = [
  'Арифметика жана бөлүнүүчүлүк',
  'Бөлчөктөр жана пайыздар',
  'Алгебралык туюнтмалар',
  'Сызыктуу теңдемелер',
  'Квадраттык теңдемелер',
  'Даражалар жана тамырлар',
  'Пропорциялар жана катыштар',
  'Чоңдуктарды салыштыруу (А жана Б мамычалары)',
  'Алгебралык туюнтмаларды салыштыруу',
  'Кыймылга карата маселелер',
  'Биргелешкен жумушка карата маселелер',
  'Эритмелер жана аралашмалар',
  'Геометрия: Бурчтар жана үч бурчтуктар',
  'Геометрия: Пифагор теоремасы',
  'Геометрия: Төрт бурчтуктар',
  'Геометрия: Айлана жана тегерек',
  'Геометрия: Фигуралардын аянттары',
  'Стереометрия: Көлөм жана беттин аянты',
  'Тегиздиктеги координаттар',
  'Функциялар жана графиктер',
  'Сан удаалаштыктары жана прогрессиялар',
  'Ыктымалдуулук теориясы',
  'Комбинаторика жана логика',
  'Аянттарды жана узундуктарды салыштыруу',
  'Статистика жана арифметикалык орточо сан',
  'Көптүктөр жана Эйлер тегеректери',
  'Сандын модулу жана касиеттери',
  'Барабарсыздыктар жана интервалдар ыкмасы',
  'ЖРТнын стандарттуу эмес амалдары',
  'Комплекстүү логикалык маселелер',
];

export const MATH1_SKILLS_KG = [
  'Бүтүн жана рационалдык сандар менен амалдарды аткаруу билгичтиги',
  'Чоңдуктан пайызды жана үлүштү табуу билгичтиги',
  'Алгебралык туюнтмаларды жөнөкөйлөтүү билгичтиги',
  'Сызыктуу теңдемелердин тамырларын табуу билгичтиги',
  'Квадраттык теңдемелерди чыгаруу жана Виет теоремасын колдонуу',
  'Даражалардын жана тамырлардын касиеттерин колдонуу билгичтиги',
  'Пропорцияларды түзүү билгичтиги',
  'А жана Б мамычаларындагы чоңдуктарды салыштыруу билгичтиги',
  'Туюнтмалардын айырмасынын белгисин аныктоо билгичтиги',
  'Жолдун S = v·t формуласын колдонуу билгичтиги',
  'Биргелешкен жумуштун өндүрүмдүүлүгүн эсептөө билгичтиги',
  'Пайыздык концентрацияга карата теңдемелерди түзүү билгичтиги',
  'Параллель түз сызыктардагы бурчтарды табуу билгичтиги',
  'Пифагор теоремасын колдонуу билгичтиги',
  'Төрт бурчтуктардын периметрин жана жактарын табуу билгичтиги',
  'Айлананын радиусун жана узундугун табуу билгичтиги',
  'Тегиз фигуралардын аянттарын эсептөө билгичтиги',
  'Параллелепипеддин, призманын жана цилиндрдин көлөмүн табуу билгичтиги',
  'Чекиттердин координаттарын жана аралыкты аныктоо билгичтиги',
  'Графиктерден функциянын касиеттерин окуу билгичтиги',
  'Арифметикалык жана геометриялык прогрессиялардын мүчөлөрүн табуу билгичтиги',
  'Классикалык ыктымалдуулукту табуу билгичтиги',
  'Комбинациялардын санын эсептөө билгичтиги',
  'Геометриялык чоңдуктарды салыштыруу билгичтиги',
  'Сандардын арифметикалык орточо маанисин табуу билгичтиги',
  'Эйлер тегеректерин пайдалануу билгичтиги',
  'Модулду белгисине жараша ачуу билгичтиги',
  'Барабарсыздыктарды интервалдар ыкмасы менен чыгаруу билгичтиги',
  'Берилген стандарттуу эмес эреже боюнча эсептөө билгичтиги',
  'ЖРТ шартынын негизинде логикалык жыйынтык чыгаруу билгичтиги',
];

export const MATH2_TOPICS_KG = [
  'Алгебра жана өзгөртүп түзүүлөр',
  'Бөлчөк-рационалдык теңдемелер',
  'Иррационалдык теңдемелер',
  'Теңдемелер системасы',
  'Экинчи даражадагы барабарсыздыктар',
  'Көрсөткүчтүү теңдемелер',
  'Логарифмдик теңдемелер',
  'Логарифмдердин касиеттери',
  'Тригонометриялык формулалар',
  'Тригонометриялык теңдемелер',
  'Планиметрия: Тик бурчтуу үч бурчтук',
  'Планиметрия: Тең капталдуу үч бурчтук',
  'Планиметрия: Трапеция жана параллелограмм',
  'Ичтен жана сырттан сызылган айланалар',
  'Татаал геометриялык фигуралардын аянттары',
  'Стереометрия: Призма жана Параллелепипед',
  'Стереометрия: Пирамида',
  'Стереометрия: Айлануу нерселери (Цилиндр, Конус, Шар)',
  'Векторлор жана координаттар',
  'Прогрессиялар жана сандык катарлар',
  'Аралашмаларга жана эритмелерге карата маселелер',
  'Сууда жана кургакта кыймылга карата маселелер',
  'Татаалдаштырылган пайыздык маселелер',
  'Графиктерди жана диаграммаларды талдоо',
  'Модулдуу теңдемелер жана барабарсыздыктар',
  'Комбинаторика жана бином',
  'Үч бурчтуктун метрикалык катыштары',
  'Функцияларды изилдөө жана экстремумдар',
  'Көп грандыктардын кесилиштери',
  'ЖРТнын логикалык жана стандарттуу эмес маселелери',
];

export const MATH2_SKILLS_KG = [
  'Көп баскычтуу алгебралык өзгөртүп түзүүлөрдү аткаруу билгичтиги',
  'Аныкталуу областын эске алуу менен бөлчөк-рационалдык теңдемелерди чыгаруу',
  'Иррационалдык теңдемелерди чыгаруу билгичтиги',
  'Сызыктуу эмес теңдемелер системасын чыгаруу',
  'Квадраттык барабарсыздыктарды интервалдар ыкмасы менен чыгаруу',
  'Көрсөткүчтүү теңдемелердин негиздерин бирдей кылуу билгичтиги',
  'Негизги логарифмдик барабардыктарды колдонуу билгичтиги',
  'Логарифмдик туюнтмаларды өзгөртүп түзүү билгичтиги',
  'Тригонометриялык функциялардын маанилерин табуу билгичтиги',
  'Жөнөкөй тригонометриялык теңдемелерди чыгаруу билгичтиги',
  'Тик бурчтуу үч бурчтуктун элементтерин табуу билгичтиги',
  'Тең капталдуу үч бурчтуктун бурчтарын жана жактарын табуу билгичтиги',
  'Трапециянын орто сызыгын жана аянтын табуу билгичтиги',
  'Ичтен жана сырттан сызылган айланалардын радиустарын табуу билгичтиги',
  'Аянтты табуу үчүн татаал фигураны жөнөкөй бөлүктөргө бөлүү билгичтиги',
  'Призманын көлөмүн жана толук бетинин аянтын табуу билгичтиги',
  'Пирамиданын бийиктигин жана көлөмүн эсептөө билгичтиги',
  'Цилиндр жана конустун көлөмүн табуу билгичтиги',
  'Векторлордун скалярдык көбөйтүндүсүн эсептөө билгичтиги',
  'Прогрессиянын мүчөлөрүнүн суммасын табуу билгичтиги',
  'Пайыздык концентрация боюнча теңдемелерди түзүү билгичтиги',
  'Кыймылдагы агымдын ылдамдыгын эске алуу билгичтиги',
  'Татаал пайызды эсептөө билгичтиги',
  'Графиктерден маалыматтарды алуу билгичтиги',
  'Теңдемелерде модулдарды туура ачуу билгичтиги',
  'Орун алмаштыруу жана топтоштуруу формулаларын колдонуу',
  'Синустар жана косинустар теоремаларын колдонуу билгичтиги',
  'Функциянын өсүү жана кемүү аралыктарын аныктоо билгичтиги',
  'Айлануу нерселеринин геометриялык параметрлерин табуу билгичтиги',
  'Так логикалык ой жүгүртүүлөрдү жүргүзүү билгичтиги',
];

// ==========================================
// 1. ЦООМО №16 (Variant 16)
// ==========================================
export const getQuestionsVariant16 = (): Question[] => {
  const vId = 16;
  const questions: Question[] = [];

  // Часть 1:
  // Фото 1 = 1-8 (включ.)
  // Фото 2 = 9-21 (включ.)
  // Фото 3 = 22-30 (включ.)
  const section1PagesV16 = [
    getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1787398651/%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E_16_%D0%9C%D0%B0%D1%82%D0%B5%D0%BC_1.1.jpg'),
    getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1787398651/%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E_16_%D0%9C%D0%B0%D1%82%D0%B5%D0%BC_1.2.jpg'),
    getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1787398652/%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E_16_%D0%9C%D0%B0%D1%82%D0%B5%D0%BC_1.3.jpg'),
  ];

  const getSection1PageV16 = (qNum: number): string => {
    if (qNum <= 8) return section1PagesV16[0];
    if (qNum <= 21) return section1PagesV16[1];
    return section1PagesV16[2];
  };

  const defaultAnswersV16Part1: ('А' | 'Б' | 'В' | 'Г')[] = [
    'А', 'Б', 'В', 'Г', 'А', 'Б', 'В', 'Г', 'А', 'Б',
    'В', 'Г', 'А', 'Б', 'В', 'Г', 'А', 'Б', 'В', 'Г',
    'А', 'Б', 'В', 'Г', 'А', 'Б', 'В', 'Г', 'А', 'Б',
  ];

  for (let i = 1; i <= 30; i++) {
    const pageImg = getSection1PageV16(i);
    const ansIdx = i - 1;

    questions.push({
      id: 16000 + i,
      variant_number: vId,
      section_id: 1,
      question_number: i,
      image_url: pageImg,
      correct_answer: defaultAnswersV16Part1[ansIdx] || 'А',
      title: 'ЦООМО №16',
      theme_color: 'emerald',
      language: 'ru',
      sub_section: MATH1_TOPICS_RU[ansIdx] || 'Математика I',
      skill: MATH1_SKILLS_RU[ansIdx] || 'Умение решать задачи ОРТ',
      is_practice: false,
    });
  }

  // Часть 2:
  // Фото 1 = 31-35 (включ.)
  // Фото 2 = 36-40 (включ.)
  // Фото 3 = 41-47 (включ.)
  // Фото 4 = 48-52 (включ.)
  // Фото 5 = 53-57 (включ.)
  // Фото 6 = 58-60 (включ.)
  const section2PagesV16 = [
    getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1787399615/%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E_16_%D0%9C%D0%B0%D1%82%D0%B5%D0%BC_2.1.jpg'),
    getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1787399615/%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E_16_%D0%9C%D0%B0%D1%82%D0%B5%D0%BC_2.2.jpg'),
    getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1787399614/%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E_16_%D0%9C%D0%B0%D1%82%D0%B5%D0%BC_2.3.jpg'),
    getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1787399614/%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E_16_%D0%9C%D0%B0%D1%82%D0%B5%D0%BC_2.4.jpg'),
    getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1787399614/%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E_16_%D0%9C%D0%B0%D1%82%D0%B5%D0%BC_2.5.jpg'),
    getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1787399614/%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E_16_%D0%9C%D0%B0%D1%82%D0%B5%D0%BC_2.6.jpg'),
  ];

  const getSection2PageV16 = (qNum: number): string => {
    if (qNum <= 35) return section2PagesV16[0];
    if (qNum <= 40) return section2PagesV16[1];
    if (qNum <= 47) return section2PagesV16[2];
    if (qNum <= 52) return section2PagesV16[3];
    if (qNum <= 57) return section2PagesV16[4];
    return section2PagesV16[5];
  };

  const defaultAnswersV16Part2: ('А' | 'Б' | 'В' | 'Г' | 'Д')[] = [
    'А', 'Б', 'В', 'Г', 'Д', 'А', 'Б', 'В', 'Г', 'Д',
    'А', 'Б', 'В', 'Г', 'Д', 'А', 'Б', 'В', 'Г', 'Д',
    'А', 'Б', 'В', 'Г', 'Д', 'А', 'Б', 'В', 'Г', 'Д',
  ];

  for (let i = 31; i <= 60; i++) {
    const pageImg = getSection2PageV16(i);
    const ansIdx = i - 31;

    questions.push({
      id: 16000 + i,
      variant_number: vId,
      section_id: 2,
      question_number: i,
      image_url: pageImg,
      correct_answer: defaultAnswersV16Part2[ansIdx] || 'А',
      title: 'ЦООМО №16',
      theme_color: 'emerald',
      language: 'ru',
      sub_section: MATH2_TOPICS_RU[ansIdx] || 'Математика II',
      skill: MATH2_SKILLS_RU[ansIdx] || 'Умение решать задачи ОРТ',
      is_practice: false,
    });
  }

  return questions;
};

// ==========================================
// 2. ЦООМО №19 (Variant 19)
// ==========================================
export const getQuestionsVariant19 = (): Question[] => {
  const vId = 19;
  const questions: Question[] = [];

  // Часть 1:
  // Фото 1 = 1-6 (включ.)
  // Фото 2 = 7-17 (включ.)
  // Фото 3 = 18-26 (включ.)
  // Фото 4 = 27-30 (включ.)
  const section1PagesV19 = [
    getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1787399921/%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E_19_%D0%9C%D0%B0%D1%82%D0%B5%D0%BC_1.1.jpg'),
    getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1787399921/%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E_19_%D0%9C%D0%B0%D1%82%D0%B5%D0%BC_1.2.jpg'),
    getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1787399921/%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E_19_%D0%9C%D0%B0%D1%82%D0%B5%D0%BC_1.3.jpg'),
    getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1787399921/%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E_19_%D0%9C%D0%B0%D1%82%D0%B5%D0%BC_1.4.jpg'),
  ];

  const getSection1PageV19 = (qNum: number): string => {
    if (qNum <= 6) return section1PagesV19[0];
    if (qNum <= 17) return section1PagesV19[1];
    if (qNum <= 26) return section1PagesV19[2];
    return section1PagesV19[3];
  };

  const defaultAnswersV19Part1: ('А' | 'Б' | 'В' | 'Г')[] = [
    'А', 'Б', 'В', 'Г', 'А', 'Б', 'В', 'Г', 'А', 'Б',
    'В', 'Г', 'А', 'Б', 'В', 'Г', 'А', 'Б', 'В', 'Г',
    'А', 'Б', 'В', 'Г', 'А', 'Б', 'В', 'Г', 'А', 'Б',
  ];

  for (let i = 1; i <= 30; i++) {
    const pageImg = getSection1PageV19(i);
    const ansIdx = i - 1;

    questions.push({
      id: 19000 + i,
      variant_number: vId,
      section_id: 1,
      question_number: i,
      image_url: pageImg,
      correct_answer: defaultAnswersV19Part1[ansIdx] || 'А',
      title: 'ЦООМО №19',
      theme_color: 'emerald',
      language: 'ru',
      sub_section: MATH1_TOPICS_RU[ansIdx] || 'Математика I',
      skill: MATH1_SKILLS_RU[ansIdx] || 'Умение решать задачи ОРТ',
      is_practice: false,
    });
  }

  // Часть 2:
  // Фото 1 = 31-36 (включ.)
  // Фото 2 = 37-42 (включ.)
  // Фото 3 = 43-47 (включ.)
  // Фото 4 = 48-54 (включ.)
  // Фото 5 = 55-60 (включ.)
  const section2PagesV19 = [
    getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1787400038/%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E_19_%D0%9C%D0%B0%D1%82%D0%B5%D0%BC_2.1.jpg'),
    getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1787400040/%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E_19_%D0%9C%D0%B0%D1%82%D0%B5%D0%BC_2.2.jpg'),
    getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1787400042/%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E_19_%D0%9C%D0%B0%D1%82%D0%B5%D0%BC_2.3.jpg'),
    getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1787400042/%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E_19_%D0%9C%D0%B0%D1%82%D0%B5%D0%BC_2.4.jpg'),
    getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1787400041/%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E_19_%D0%9C%D0%B0%D1%82%D0%B5%D0%BC_2.5.jpg'),
  ];

  const getSection2PageV19 = (qNum: number): string => {
    if (qNum <= 36) return section2PagesV19[0];
    if (qNum <= 42) return section2PagesV19[1];
    if (qNum <= 47) return section2PagesV19[2];
    if (qNum <= 54) return section2PagesV19[3];
    return section2PagesV19[4];
  };

  const defaultAnswersV19Part2: ('А' | 'Б' | 'В' | 'Г' | 'Д')[] = [
    'А', 'Б', 'В', 'Г', 'Д', 'А', 'Б', 'В', 'Г', 'Д',
    'А', 'Б', 'В', 'Г', 'Д', 'А', 'Б', 'В', 'Г', 'Д',
    'А', 'Б', 'В', 'Г', 'Д', 'А', 'Б', 'В', 'Г', 'Д',
  ];

  for (let i = 31; i <= 60; i++) {
    const pageImg = getSection2PageV19(i);
    const ansIdx = i - 31;

    questions.push({
      id: 19000 + i,
      variant_number: vId,
      section_id: 2,
      question_number: i,
      image_url: pageImg,
      correct_answer: defaultAnswersV19Part2[ansIdx] || 'А',
      title: 'ЦООМО №19',
      theme_color: 'emerald',
      language: 'ru',
      sub_section: MATH2_TOPICS_RU[ansIdx] || 'Математика II',
      skill: MATH2_SKILLS_RU[ansIdx] || 'Умение решать задачи ОРТ',
      is_practice: false,
    });
  }

  return questions;
};

// ==========================================
// 3. ЦООМО №20 (Variant 20)
// ==========================================
export const getQuestionsVariant20 = (): Question[] => {
  const vId = 20;
  const questions: Question[] = [];

  // Часть 1:
  // Фото 1 = 1-7 (включ.)
  // Фото 2 = 8-19 (включ.)
  // Фото 3 = 20-30 (включ.)
  const section1PagesV20 = [
    getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1787400320/%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E_20_%D0%9C%D0%B0%D1%82%D0%B5%D0%BC_1.1.jpg'),
    getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1787400319/%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E_20_%D0%9C%D0%B0%D1%82%D0%B5%D0%BC_1.2.jpg'),
    getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1787400319/%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E_20_%D0%9C%D0%B0%D1%82%D0%B5%D0%BC_1.3.jpg'),
  ];

  const getSection1PageV20 = (qNum: number): string => {
    if (qNum <= 7) return section1PagesV20[0];
    if (qNum <= 19) return section1PagesV20[1];
    return section1PagesV20[2];
  };

  const defaultAnswersV20Part1: ('А' | 'Б' | 'В' | 'Г')[] = [
    'А', 'Б', 'В', 'Г', 'А', 'Б', 'В', 'Г', 'А', 'Б',
    'В', 'Г', 'А', 'Б', 'В', 'Г', 'А', 'Б', 'В', 'Г',
    'А', 'Б', 'В', 'Г', 'А', 'Б', 'В', 'Г', 'А', 'Б',
  ];

  for (let i = 1; i <= 30; i++) {
    const pageImg = getSection1PageV20(i);
    const ansIdx = i - 1;

    questions.push({
      id: 20000 + i,
      variant_number: vId,
      section_id: 1,
      question_number: i,
      image_url: pageImg,
      correct_answer: defaultAnswersV20Part1[ansIdx] || 'А',
      title: 'ЦООМО №20',
      theme_color: 'emerald',
      language: 'ru',
      sub_section: MATH1_TOPICS_RU[ansIdx] || 'Математика I',
      skill: MATH1_SKILLS_RU[ansIdx] || 'Умение решать задачи ОРТ',
      is_practice: false,
    });
  }

  // Часть 2:
  // Фото 1 = 31-38 (включ.)
  // Фото 2 = 39-44 (включ.)
  // Фото 3 = 45-50 (включ.)
  // Фото 4 = 51-55 (включ.)
  // Фото 5 = 56-60 (включ.)
  const section2PagesV20 = [
    getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1787400435/%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E_20_%D0%9C%D0%B0%D1%82%D0%B5%D0%BC_2.1.jpg'),
    getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1787400435/%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E_20_%D0%9C%D0%B0%D1%82%D0%B5%D0%BC_2.2.jpg'),
    getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1787400435/%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E_20_%D0%9C%D0%B0%D1%82%D0%B5%D0%BC_2.3.jpg'),
    getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1787400437/%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E_20_%D0%9C%D0%B0%D1%82%D0%B5%D0%BC_2.4.jpg'),
    getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1787400437/%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E_20_%D0%9C%D0%B0%D1%82%D0%B5%D0%BC_2.5.jpg'),
  ];

  const getSection2PageV20 = (qNum: number): string => {
    if (qNum <= 38) return section2PagesV20[0];
    if (qNum <= 44) return section2PagesV20[1];
    if (qNum <= 50) return section2PagesV20[2];
    if (qNum <= 55) return section2PagesV20[3];
    return section2PagesV20[4];
  };

  const defaultAnswersV20Part2: ('А' | 'Б' | 'В' | 'Г' | 'Д')[] = [
    'А', 'Б', 'В', 'Г', 'Д', 'А', 'Б', 'В', 'Г', 'Д',
    'А', 'Б', 'В', 'Г', 'Д', 'А', 'Б', 'В', 'Г', 'Д',
    'А', 'Б', 'В', 'Г', 'Д', 'А', 'Б', 'В', 'Г', 'Д',
  ];

  for (let i = 31; i <= 60; i++) {
    const pageImg = getSection2PageV20(i);
    const ansIdx = i - 31;

    questions.push({
      id: 20000 + i,
      variant_number: vId,
      section_id: 2,
      question_number: i,
      image_url: pageImg,
      correct_answer: defaultAnswersV20Part2[ansIdx] || 'А',
      title: 'ЦООМО №20',
      theme_color: 'emerald',
      language: 'ru',
      sub_section: MATH2_TOPICS_RU[ansIdx] || 'Математика II',
      skill: MATH2_SKILLS_RU[ansIdx] || 'Умение решать задачи ОРТ',
      is_practice: false,
    });
  }

  return questions;
};

// ==========================================
// 4. ББОУБ №1 (Кыргызча ЦООМО №1 - Variant 101)
// ==========================================
export const getQuestionsVariant101 = (): Question[] => {
  const vId = 101;
  const questions: Question[] = [];

  // Часть 1:
  // Фото 1 = 1-6 (включ.)
  // Фото 2 = 7-15 (включ.)
  // Фото 3 = 16-24 (включ.)
  // Фото 4 = 25-30 (включ.)
  const section1PagesV101 = [
    getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1787401723/%D0%91%D0%91%D0%9E%D0%A3%D0%91_1_%D0%BC%D0%B0%D1%82%D0%B5%D0%BC_1.1.jpg'),
    getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1787401721/%D0%91%D0%91%D0%9E%D0%A3%D0%91_1_%D0%BC%D0%B0%D1%82%D0%B5%D0%BC_1.2.jpg'),
    getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1787401721/%D0%91%D0%91%D0%9E%D0%A3%D0%91_1_%D0%BC%D0%B0%D1%82%D0%B5%D0%BC_1.3.jpg'),
    getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1787401722/%D0%91%D0%91%D0%9E%D0%A3%D0%91_1_%D0%BC%D0%B0%D1%82%D0%B5%D0%BC_1.4.jpg'),
  ];

  const getSection1PageV101 = (qNum: number): string => {
    if (qNum <= 6) return section1PagesV101[0];
    if (qNum <= 15) return section1PagesV101[1];
    if (qNum <= 24) return section1PagesV101[2];
    return section1PagesV101[3];
  };

  const defaultAnswersV101Part1: ('А' | 'Б' | 'В' | 'Г')[] = [
    'А', 'Б', 'В', 'Г', 'А', 'Б', 'В', 'Г', 'А', 'Б',
    'В', 'Г', 'А', 'Б', 'В', 'Г', 'А', 'Б', 'В', 'Г',
    'А', 'Б', 'В', 'Г', 'А', 'Б', 'В', 'Г', 'А', 'Б',
  ];

  for (let i = 1; i <= 30; i++) {
    const pageImg = getSection1PageV101(i);
    const ansIdx = i - 1;

    questions.push({
      id: 101000 + i,
      variant_number: vId,
      section_id: 1,
      question_number: i,
      image_url: pageImg,
      correct_answer: defaultAnswersV101Part1[ansIdx] || 'А',
      title: 'ББОУБ №1',
      theme_color: 'emerald',
      language: 'kg',
      sub_section: MATH1_TOPICS_KG[ansIdx] || 'Математика I',
      skill: MATH1_SKILLS_KG[ansIdx] || 'ЖРТ маселелерин чыгаруу билгичтиги',
      is_practice: false,
    });
  }

  // Часть 2:
  // Фото 1 = 31-33 (включ.)
  // Фото 2 = 34-39 (включ.)
  // Фото 3 = 40-43 (включ.)
  // Фото 4 = 44-46 (включ.)
  // Фото 5 = 47-51 (включ.)
  // Фото 6 = 52-57 (включ.)
  // Фото 7 = 58-60 (включ.)
  const section2PagesV101 = [
    getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1787402494/%D0%91%D0%91%D0%9E%D0%A3%D0%91_1_%D0%BC%D0%B0%D1%82%D0%B5%D0%BC_2.1.jpg'),
    getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1787402491/%D0%91%D0%91%D0%9E%D0%A3%D0%91_1_%D0%BC%D0%B0%D1%82%D0%B5%D0%BC_2.2.jpg'),
    getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1787402495/%D0%91%D0%91%D0%9E%D0%A3%D0%91_1_%D0%BC%D0%B0%D1%82%D0%B5%D0%BC_2.3.jpg'),
    getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1787402494/%D0%91%D0%91%D0%9E%D0%A3%D0%91_1_%D0%BC%D0%B0%D1%82%D0%B5%D0%BC_2.4.jpg'),
    getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1787402513/%D0%91%D0%91%D0%9E%D0%A3%D0%91_1_%D0%BC%D0%B0%D1%82%D0%B5%D0%BC_2.5.jpg'),
    getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1787402507/%D0%91%D0%91%D0%9E%D0%A3%D0%91_1_%D0%BC%D0%B0%D1%82%D0%B5%D0%BC_2.6.jpg'),
    getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1787402500/%D0%91%D0%91%D0%9E%D0%A3%D0%91_1_%D0%BC%D0%B0%D1%82%D0%B5%D0%BC_2.7.jpg'),
  ];

  const getSection2PageV101 = (qNum: number): string => {
    if (qNum <= 33) return section2PagesV101[0];
    if (qNum <= 39) return section2PagesV101[1];
    if (qNum <= 43) return section2PagesV101[2];
    if (qNum <= 46) return section2PagesV101[3];
    if (qNum <= 51) return section2PagesV101[4];
    if (qNum <= 57) return section2PagesV101[5];
    return section2PagesV101[6];
  };

  const defaultAnswersV101Part2: ('А' | 'Б' | 'В' | 'Г' | 'Д')[] = [
    'А', 'Б', 'В', 'Г', 'Д', 'А', 'Б', 'В', 'Г', 'Д',
    'А', 'Б', 'В', 'Г', 'Д', 'А', 'Б', 'В', 'Г', 'Д',
    'А', 'Б', 'В', 'Г', 'Д', 'А', 'Б', 'В', 'Г', 'Д',
  ];

  for (let i = 31; i <= 60; i++) {
    const pageImg = getSection2PageV101(i);
    const ansIdx = i - 31;

    questions.push({
      id: 101000 + i,
      variant_number: vId,
      section_id: 2,
      question_number: i,
      image_url: pageImg,
      correct_answer: defaultAnswersV101Part2[ansIdx] || 'А',
      title: 'ББОУБ №1',
      theme_color: 'emerald',
      language: 'kg',
      sub_section: MATH2_TOPICS_KG[ansIdx] || 'Математика II',
      skill: MATH2_SKILLS_KG[ansIdx] || 'ЖРТ маселелерин чыгаруу билгичтиги',
      is_practice: false,
    });
  }

  return questions;
};
