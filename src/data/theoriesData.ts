export const TEACHER_PHOTO_URL = '';

export interface TheoryTopic {
  id: string;
  titleRu: string;
  titleKg: string;
  isAvailable: boolean;
  contentRu?: string;
  contentKg?: string;
  photos?: {
    id: string;
    titleRu: string;
    titleKg: string;
    imageUrl: string;
    descriptionRu: string;
    descriptionKg: string;
  }[];
  videos?: {
    id: string;
    titleRu: string;
    titleKg: string;
    duration: string;
    thumbnailUrl: string;
    videoUrl?: string;
    authorName: string;
    authorPhotoUrl?: string;
    descriptionRu: string;
    descriptionKg: string;
  }[];
}

export interface TheoryBlock {
  id: string;
  number: number;
  titleRu: string;
  titleKg: string;
  descRu: string;
  descKg: string;
  topics: TheoryTopic[];
}

export interface TheorySubject {
  id: 'algebra' | 'geometry' | 'russian' | 'english';
  category: 'math' | 'russian' | 'english';
  titleRu: string;
  titleKg: string;
  descRu: string;
  descKg: string;
  icon: string;
  isSubjectTest?: boolean;
  blocks: TheoryBlock[];
}

export const THEORIES_DATA: Record<'algebra' | 'geometry' | 'russian' | 'english', TheorySubject> = {
  algebra: {
    id: 'algebra',
    category: 'math',
    titleRu: 'Алгебра',
    titleKg: 'Алгебра',
    descRu: 'Числа, делимость, уравнения, неравенства, модули, функции и текстовые задачи ОРТ',
    descKg: 'Сандар, бөлүнүүчүлүк, теңдемелер, барабарсыздыктар, модулдар жана ЖРТ тексттик маселелери',
    icon: 'Calculator',
    blocks: [
      {
        id: 'block-1',
        number: 1,
        titleRu: 'Натуральные, целые числа и основы арифметики',
        titleKg: 'Натуралдык, бүтүн сандар жана арифметиканын негиздери',
        descRu: 'Фундаментальные понятия чисел, классификация множеств, знаки и арифметические ловушки ОРТ',
        descKg: 'Сандардын фундаменталдык түшүнүктөрү, көптүктөр, белгилер жана ЖРТнын негизги тузактары',
        topics: [
          {
            id: 'natural-and-integers',
            titleRu: 'Натуральные и целые числа',
            titleKg: 'Натуралдык жана бүтүн сандар',
            isAvailable: true,
            contentRu: `### 1. Натуральные числа ($\\mathbb{N}$)
Натуральные числа — это числа, которые используются при естественном счете предметов.

**Пример:** $1, 2, 3, 4, 5, \\dots, 100, \\dots$

> ⚠️ **Главная ловушка ОРТ:**
> **Ноль ($0$) НЕ является натуральным числом!** Ты не можешь посчитать «0 предметов».

* **Самое маленькое натуральное число:** $1$.
* **Самого большого натурального числа:** не существует (множество натуральных чисел бесконечно).

---

### 2. Целые числа ($\\mathbb{Z}$)
Целые числа — это расширенный набор чисел. В него входят:
1. **Все натуральные числа** (положительные целые: $1, 2, 3, \\dots$).
2. **Число $0$ (нуль)**.
3. **Отрицательные целые числа** (числа со знаком минус: $-1, -2, -3, \\dots$).

**Пример:** $\\dots, -4, -3, -2, -1, 0, 1, 2, 3, 4, \\dots$

**Важные свойства для ОРТ:**
* **Ноль ($0$):** Это целое число, но оно **не является ни положительным, ни отрицательным**.
* **Дроби и десятичные числа ($0.5$, $\\frac{3}{4}$, $-2.8$):** **НЕ являются целыми числами!**
* **Четность нуля ($0$):** Число $0$ является **четным целым числом**, так как делится на $2$ без остатка ($0 : 2 = 0$).`,
            contentKg: `### 1. Натуралдык сандар ($\\mathbb{N}$)
Натуралдык сандар — бул нерселерди (буюмдарды) табигый саноодо колдонулуучу сандар.

**Мисалы:** $1, 2, 3, 4, 5, \\dots, 100, \\dots$

> ⚠️ **ЖРТнын негизги тузагы:**
> **Нөл ($0$) натуралдык сан ЭМЕС!** Сен «0 буюм» деп санай албайсың.

* **Эң кичине натуралдык сан:** $1$.
* **Эң чоң натуралдык сан:** жок (натуралдык сандардын көптүгү чексиз).

---

### 2. Бүтүн сандар ($\\mathbb{Z}$)
Бүтүн сандар — бул сандардын кеңейтилген тобу. Анын курамына кирет:
1. **Бардык натуралдык сандар** (оң бүтүн сандар: $1, 2, 3, \\dots$).
2. **$0$ (нөл) саны**.
3. **Терс бүтүн сандар** (минус белгиси бар сандар: $-1, -2, -3, \\dots$).

**Мисалы:** $\\dots, -4, -3, -2, -1, 0, 1, 2, 3, 4, \\dots$

**ЖРТ үчүн маанилүү касиеттер:**
* **Нөл ($0$):** Бул бүтүн сан, бирок ал **оң дагы, терс дагы эмес**.
* **Бөлчөктөр жана ондук сандар ($0.5$, $\\frac{3}{4}$, $-2.8$):** Бүтүн сандар **БОЛБОЙТ!**
* **Нөлдүн жуптугу ($0$):** $0$ саны **жуп бүтүн сан** болуп саналат, анткени $2$ге калдыксыз бөлүнөт ($0 : 2 = 0$).`,
            photos: [
              {
                id: 'photo-ort-1',
                titleRu: 'Пример из реального ОРТ: Сравнение колонок (Натуральные числа)',
                titleKg: 'Чыныгы ЖРТдан мисал: Мамычаларды салыштыруу (Натуралдык сандар)',
                imageUrl: 'https://res.cloudinary.com/rw9qhk3a/image/upload/v1787233847/%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E__12_%D0%9C%D0%B0%D1%82%D0%B5%D0%BC_1.1.jpg',
                descriptionRu: 'Разбор типового задания ОРТ на свойства наименьшего натурального числа и четность нуля. Обратите внимание на условие «a — натуральное число».',
                descriptionKg: 'Эң кичине натуралдык сан жана нөлдүн касиеттери боюнча ЖРТнын типтүү тапшырмасынын чыгарылышы.',
              },
              {
                id: 'photo-ort-2',
                titleRu: 'Пример решения: Множество целых чисел и отрицательные значения',
                titleKg: 'Чыгаруу мисалы: Бүтүн сандардын көптүгү жана терс маанилер',
                imageUrl: 'https://res.cloudinary.com/rw9qhk3a/image/upload/v1787233827/%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E__12_%D0%9C%D0%B0%D1%82%D0%B5%D0%BC_1.2.jpg',
                descriptionRu: 'Пошаговый анализ ловушки с отрицательными числами и модулем при сравнении колонок А и Б.',
                descriptionKg: 'А жана Б мамычаларын салыштырууда терс сандар жана модуль менен болгон тузактын этап-этабы менен талдоосу.',
              },
            ],
            videos: [
              {
                id: 'video-nat-1',
                titleRu: 'Видеоразбор темы: Натуральные и целые числа на ОРТ',
                titleKg: 'Теманын видеоталдоосу: ЖРТдагы натуралдык жана бүтүн сандар',
                duration: '14:20',
                thumbnailUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80',
                authorName: 'Авторская методика ОРТ',
                descriptionRu: 'Подробный видеоразбор теории, всех подводных камней и решение 5 реальных задач ОРТ с объяснением каждого шага.',
                descriptionKg: 'Теорияны, бардык тузактарды жана ЖРТнын 5 чыныгы мисалын этап-этабы менен түшүндүргөн автордук видеосабак.',
              },
            ],
          },
          {
            id: 'fractions-and-percentages',
            titleRu: 'Дроби, проценты и пропорции',
            titleKg: 'Бөлчөктөр, пайыздар жана пропорциялар',
            isAvailable: false,
          },
          {
            id: 'divisibility-and-primes',
            titleRu: 'Делимость, простые и составные числа, НОД и НОК',
            titleKg: 'Бөлүнүүчүлүк, жөнөкөй жана курама сандар, ЭҮЖБ жана ЭКЖБ',
            isAvailable: false,
          },
        ],
      },
      {
        id: 'block-2',
        number: 2,
        titleRu: 'Алгебраические выражения и уравнения',
        titleKg: 'Алгебралык туюнтмалар жана теңдемелер',
        descRu: 'Формулы сокращенного умножения, линейные и квадратные уравнения, системы',
        descKg: 'Кыскача көбөйтүүнүн формулалары, сызыктуу жана квадраттык теңдемелер, системалар',
        topics: [
          {
            id: 'alg-expressions',
            titleRu: 'Формулы сокращенного умножения и разложение',
            titleKg: 'Кыскача көбөйтүүнүн формулалары',
            isAvailable: false,
          },
          {
            id: 'linear-quadratic-equations',
            titleRu: 'Линейные и квадратные уравнения, теорема Виета',
            titleKg: 'Сызыктуу жана квадраттык теңдемелер, Виет теоремасы',
            isAvailable: false,
          },
        ],
      },
      {
        id: 'block-3',
        number: 3,
        titleRu: 'Неравенства, модули и степени',
        titleKg: 'Барабарсыздыктар, модулдар жана даражалар',
        descRu: 'Метод интервалов, свойства степени, арифметический квадратный корень и модули',
        descKg: 'Интервалдар ыкмасы, даражанын касиеттери, тамырлар жана модулдар',
        topics: [
          {
            id: 'modules-and-inequalities',
            titleRu: 'Уравнения и неравенства с модулем',
            titleKg: 'Модулу бар теңдемелер жана барабарсыздыктар',
            isAvailable: false,
          },
        ],
      },
      {
        id: 'block-4',
        number: 4,
        titleRu: 'Текстовые задачи ОРТ и логика',
        titleKg: 'ЖРТнын тексттик маселелери жана логика',
        descRu: 'Задачи на движение, совместную работу, сплавы, смеси и логические цепочки',
        descKg: 'Кыймылга, биргелешкен жумушка, эритмелерге карата маселелер жана логика',
        topics: [
          {
            id: 'motion-and-work',
            titleRu: 'Задачи на движение и производительность',
            titleKg: 'Кыймыл жана өндүрүмдүүлүк маселелери',
            isAvailable: false,
          },
        ],
      },
    ],
  },
  geometry: {
    id: 'geometry',
    category: 'math',
    titleRu: 'Геометрия',
    titleKg: 'Геометрия',
    descRu: 'Треугольники, четырехугольники, окружности, вычисление площадей и стереометрия ОРТ',
    descKg: 'Үч бурчтуктар, төрт бурчтуктар, тегеректер, аянттарды эсептөө жана ЖРТ стереометриясы',
    icon: 'Shapes',
    blocks: [
      {
        id: 'geom-block-1',
        number: 1,
        titleRu: 'Планиметрия — Углы и Треугольники',
        titleKg: 'Планиметрия — Бурчтар жана Үч бурчтуктар',
        descRu: 'Смежные и вертикальные углы, прямоугольный треугольник, теорема Пифагора',
        descKg: 'Жанаша жана вертикалдык бурчтар, тик бурчтуу үч бурчтук, Пифагор теоремасы',
        topics: [
          {
            id: 'angles-and-triangles',
            titleRu: 'Свойства углов и виды треугольников',
            titleKg: 'Бурчтардын касиеттери жана үч бурчтуктардын түрлөрү',
            isAvailable: false,
          },
        ],
      },
      {
        id: 'geom-block-2',
        number: 2,
        titleRu: 'Четырехугольники и Окружность',
        titleKg: 'Төрт бурчтуктар жана Айлана',
        descRu: 'Параллелограмм, ромб, трапеция, вписанные и центральные углы',
        descKg: 'Параллелограмм, ромб, трапеция, ичтен сызылган жана борбордук бурчтар',
        topics: [
          {
            id: 'quadrilaterals-circle',
            titleRu: 'Параллелограмм, трапеция и окружность',
            titleKg: 'Параллелограмм, трапеция жана айлана',
            isAvailable: false,
          },
        ],
      },
      {
        id: 'geom-block-3',
        number: 3,
        titleRu: 'Площади фигур и Стереометрия',
        titleKg: 'Фигуралардын аянттары жана Стереометрия',
        descRu: 'Формулы площадей плоских фигур, призмы, пирамиды, цилиндры и конусы',
        descKg: 'Тегиз фигуралардын аянттары, призма, пирамида, цилиндр жана конустар',
        topics: [
          {
            id: 'areas-and-stereometry',
            titleRu: 'Площади фигур и пространственные тела',
            titleKg: 'Фигуралардын аянттары жана мейкиндиктеги нерселер',
            isAvailable: false,
          },
        ],
      },
    ],
  },
  russian: {
    id: 'russian',
    category: 'russian',
    titleRu: 'Русский язык',
    titleKg: 'Орус тили',
    descRu: 'Аналогии и дополнения предложений, чтение и понимание текста, практическая грамматика ОРТ',
    descKg: 'Аналогиялар жана сүйлөмдү толуктоо, текстти түшүнүү, практикалык грамматика',
    icon: 'BookOpen',
    blocks: [
      {
        id: 'rus-block-1',
        number: 1,
        titleRu: 'Аналогии и дополнение предложений',
        titleKg: 'Аналогиялар жана сүйлөмдөрдү толуктоо',
        descRu: 'Типы отношений между словами, синонимы, антонимы, род-вид, причина-следствие и контекст вставки слов в тестах ОРТ',
        descKg: 'Сөздөрдүн байланыш түрлөрү, синонимдер, антонимдер, себеп-натыйжа жана сүйлөмдү толуктоо эрежелери',
        topics: [
          {
            id: 'analogies-basics',
            titleRu: 'Типы логических отношений в аналогиях',
            titleKg: 'Аналогиялардагы логикалык байланыштардын түрлөрү',
            isAvailable: true,
            contentRu: `### 1. Что такое Аналогии в ОРТ?
Аналогии — это первый субтест основного теста (30 заданий). В каждом задании дана пара слов, между которыми существует четкая логическая связь. Ваша задача — найти среди вариантов пару с точно таким же типом связи и направлением.

---

### 2. Основные типы логических связей:
1. **Род — Вид (Общее — Частное):**
   * *Дерево : Дуб* (Дуб — это разновидность дерева).
   * *Инструмент : Молоток*.

2. **Часть — Целое:**
   * *Колесо : Автомобиль* (Колесо — часть автомобиля).
   * *Страница : Книга*.

3. **Причина — Следствие:**
   * *Вирус : Болезнь* (Вирус вызывает болезнь).
   * *Засуха : Неурожай*.

4. **Предмет — Функция (Действие):**
   * *Нож : Резать* (Нож предназначен для резки).
   * *Термометр : Измерять*.

5. **Субъект — Объект деятельности:**
   * *Хирург : Скальпель* (Инструмент специалиста).
   * *Художник : Кисть*.

> ⚠️ **Главная ловушка ОРТ:**
> Всегда проверяйте **направление связи**! Если в условии *«Род : Вид»* (*Птица : Орёл*), ответ *«Окунь : Рыба»* не подходит, так как там связь в обратном порядке (*Вид : Род*).`,
            contentKg: `### 1. ЖРТдагы Аналогиялар деген эмне?
Аналогиялар — негизги тесттин биринчи бөлүгү (30 тапшырма). Ар бир тапшырмада ортосунда так логикалык байланыш бар эки сөз берилет. Сиздин максат — дал ошондой байланыштагы вариантты табуу.

---

### 2. Негизги логикалык байланыш түрлөрү:
1. **Жалпы — Жекече (Род — Вид):**
   * *Дарак : Эмен*
2. **Бөлүк — Бүтүн:**
   * *Дөңгөлөк : Унаа*
3. **Себеп — Натыйжа:**
   * *Вирус : Оору*
4. **Буюм — Аткарган кызматы:**
   * *Бычак : Кесүү*`,
            photos: [
              {
                id: 'rus-photo-1',
                titleRu: 'Пример из ОРТ: Логические связи Род — Вид и Часть — Целое',
                titleKg: 'ЖРТдан мисал: Жалпы — Жекече жана Бөлүк — Бүтүн байланыштары',
                imageUrl: 'https://res.cloudinary.com/rw9qhk3a/image/upload/v1787233847/%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E__12_%D0%9C%D0%B0%D1%82%D0%B5%D0%BC_1.1.jpg',
                descriptionRu: 'Разбор 5 заданий на выявление точного направления связи в парах слов.',
                descriptionKg: 'Сөздөрдүн ортосундагы байланыш багытын так аныктоо боюнча 5 тапшырманын талдоосу.',
              },
            ],
            videos: [
              {
                id: 'rus-video-1',
                titleRu: 'Мастер-класс: Как безошибочно решать Аналогии на ОРТ',
                titleKg: 'Мастер-класс: ЖРТда Аналогияларды катасыз чыгаруу',
                duration: '16:45',
                thumbnailUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80',
                authorName: 'Авторская методика ОРТ',
                descriptionRu: 'Все 12 типов логических связей, алгоритм исключения ложных дистракторов и секреты экономии времени.',
                descriptionKg: 'Логикалык байланыштын 12 түрү, туура эмес варианттарды ылдам ыргытуу жана убакытты үнөмдөө.',
              },
            ],
          },
        ],
      },
      {
        id: 'rus-block-2',
        number: 2,
        titleRu: 'Чтение и понимание текста',
        titleKg: 'Текстти окуу жана түшүнүү',
        descRu: 'Анализ микротекстов и больших статей, выделение главной мысли, подтекст, аргументация и авторская позиция',
        descKg: 'Тексттерди талдоо, негизги ойду табуу, автордук көз караш жана аргументтер',
        topics: [
          {
            id: 'reading-comprehension',
            titleRu: 'Поиск главной мысли и анализ структуры текста',
            titleKg: 'Негизги ойду табуу жана тексттин түзүлүшү',
            isAvailable: true,
            contentRu: `### 1. Стратегия работы с текстами ОРТ
В субтесте «Чтение и понимание» даются научные, публицистические и художественные тексты. 

---

### 2. Ключевые шаги для безошибочного ответа:
1. **Сначала прочитайте вопросы к тексту**, а затем сам текст. Это сфокусирует ваше внимание на нужных абзацах.
2. **Главная мысль** чаще всего содержится в первом или последнем предложении каждого абзаца.
3. **Различайте факт и мнение:** вопрос «Что утверждает автор?» требует цитаты или прямого вывода, а не ваших личных суждений.
4. **Остерегайтесь крайностей:** варианты со словами «всегда», «никогда», «абсолютно все» в 90% случаев являются ложными.`,
            contentKg: `### 1. ЖРТ тексттери менен иштөө стратегиясы
«Текстти окуу жана түшүнүү» бөлүгүндө илимий, публицистикалык жана көркөм тексттер берилет.

---

### 2. Катасыз жооп берүүнүн негизги кадамдары:
1. **Адегенде тексттин суроолорун окуп чыгыңыз**, андан соң текстти окуңуз.
2. **Негизги ой** көбүнчө ар бир абзацтын башында же аягында камтылат.
3. **Факты менен көз карашты айырмалаңыз.**
4. «Дайыма», «эч качан», «баары» деген ашыкча кескин сөздөр көбүнчө туура эмес жооп болот.`,
            photos: [
              {
                id: 'rus-photo-2',
                titleRu: 'Схема анализа текста ОРТ: Структура микротем и аргументов',
                titleKg: 'ЖРТ текстинин түзүлүшү: Микротемалар жана аргументтер',
                imageUrl: 'https://res.cloudinary.com/rw9qhk3a/image/upload/v1787233827/%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E__12_%D0%9C%D0%B0%D1%82%D0%B5%D0%BC_1.2.jpg',
                descriptionRu: 'Алгоритм быстрого сканирования абзацев и поиск ключевых смысловых связок.',
                descriptionKg: 'Абзацтарды тез сканерлөө жана негизги маанилик байланыштарды табуу.',
              },
            ],
            videos: [
              {
                id: 'rus-video-2',
                titleRu: 'Секреты субтеста Чтение и Понимание ОРТ',
                titleKg: 'Окуу жана түшүнүү бөлүмүнүн сырлары',
                duration: '18:10',
                thumbnailUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80',
                authorName: 'Авторская методика ОРТ',
                descriptionRu: 'Разбор реальных текстов ОРТ прошлых лет и эффективные техники скоростного анализа смыслов.',
                descriptionKg: 'Өткөн жылдардагы ЖРТнын чыныгы тексттерин талдоо жана тез окуу ыкмалары.',
              },
            ],
          },
        ],
      },
      {
        id: 'rus-block-3',
        number: 3,
        titleRu: 'Практическая грамматика родного языка',
        titleKg: 'Эне тилдин практикалык грамматикасы',
        descRu: 'Орфографические и пунктуационные нормы, синтаксис, исправление речевых и грамматических ошибок',
        descKg: 'Орфография жана пунктуация эрежелери, синтаксис, грамматикалык каталарды оңдоо',
        topics: [
          {
            id: 'practical-grammar',
            titleRu: 'Нормы согласования и пунктуация сложных предложений',
            titleKg: 'Эрежелер жана татаал сүйлөмдөрдүн тыныш белгилери',
            isAvailable: true,
            contentRu: `### 1. Нормы практической грамматики в ОРТ
Этот субтест проверяет умение находить и исправлять речевые, грамматические и пунктуационные ошибки.

---

### 2. Частые ловушки ОРТ:
1. **Деепричастный оборот:** Действие деепричастия должно относиться к тому же подлежащему, что и действие сказуемого!
   * *Неверно:* Подъезжая к станции, у меня слетела шляпа.
   * *Верно:* Подъезжая к станции, я потерял шляпу.
2. **Согласование подлежащего и сказуемого:**
   * *Большинство студентов (мн. ч.) сдали экзамен.*
3. **Употребление предлогов:** «благодаря», «согласно», «вопреки» требуют **дательного падежа** (согласно *приказу*, вопреки *прогнозу*).`,
            contentKg: `### 1. Практикалык грамматиканын эрежелери
Бул бөлүм сүйлөмдөрдөгү грамматикалык жана кептик каталарды табуу жөндөмүн текшерет.

---

### 2. Көп кездешүүчү каталар:
1. **Чакчыл түрмөктөр:** Чакчыл менен баяндооч бир эле ээге таандык болушу зарыл.
2. **Башкаруу жана ээрчишүү байланыштарынын тууралыгы.**
3. **Татаал сүйлөмдөрдөгү тыныш белгилер.**`,
            photos: [
              {
                id: 'rus-photo-3',
                titleRu: 'Таблица-шпаргалка: Типовые грамматические ошибки ОРТ',
                titleKg: 'ЖРТнын типтүү грамматикалык каталарынын таблицасы',
                imageUrl: 'https://res.cloudinary.com/rw9qhk3a/image/upload/v1787233847/%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E__12_%D0%9C%D0%B0%D1%82%D0%B5%D0%BC_1.1.jpg',
                descriptionRu: 'Ключевые правила согласования деепричастных оборотов, предлогов и союзов.',
                descriptionKg: 'Чакчыл түрмөктөр жана сүйлөм мүчөлөрүнүн байланыш эрежелери.',
              },
            ],
            videos: [
              {
                id: 'rus-video-3',
                titleRu: 'Экспресс-курс: Практическая грамматика без ошибок',
                titleKg: 'Экспресс-курс: Практикалык грамматиканы катасыз өздөштүрүү',
                duration: '15:30',
                thumbnailUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80',
                authorName: 'Авторская методика ОРТ',
                descriptionRu: 'Разбор 20 самых коварных предложений с грамматическими ловушками из реальных тестов ОРТ.',
                descriptionKg: 'ЖРТнын тесттеринен алынган эң татаал 20 сүйлөмдүн толук талдоосу.',
              },
            ],
          },
        ],
      },
    ],
  },
  english: {
    id: 'english',
    category: 'english',
    titleRu: 'Английский язык',
    titleKg: 'Англис тили',
    descRu: 'Предметный тест ОРТ: Reading Comprehension, Grammar & Vocabulary, Error Identification',
    descKg: 'ЖРТ предметтик тести: Текстти түшүнүү, грамматика, лексика жана каталарды табуу',
    icon: 'Languages',
    isSubjectTest: true,
    blocks: [
      {
        id: 'eng-block-1',
        number: 1,
        titleRu: 'Reading & Text Comprehension',
        titleKg: 'Текстти окуу жана түшүнүү (Reading)',
        descRu: 'Работа с текстами ОРТ: skimming, scanning, контекстное значение слов, главная идея и логические выводы',
        descKg: 'ЖРТ тексттери менен иштөө: негизги ойду табуу, сөздөрдүн мааниси жана логикалык тыянактар',
        topics: [
          {
            id: 'eng-reading-strategies',
            titleRu: 'Strategies for Reading Comprehension on ORT',
            titleKg: 'ЖРТ тексттерин туура жана тез түшүнүү стратегиялары',
            isAvailable: true,
            contentRu: `### 1. English Subject Test on ORT
Предметный тест по английскому языку проверяет глубокое понимание письменной речи, знание грамматических конструкций и богатый словарный запас.

---

### 2. Key Reading Skills:
1. **Main Idea Identification:** Finding the core thesis of each paragraph.
2. **Context Clues:** Guessing unfamiliar vocabulary from the surrounding sentence structure.
3. **Inference & Conclusion:** Answering questions where information is implied rather than explicitly stated.
4. **Vocabulary in Context:** Pay attention to how polysemantic words function in specific sentences.`,
            contentKg: `### 1. Англис тили боюнча ЖРТ предметтик тести
Бул тест окуучунун текстти түшүнүүсүн, грамматиканы туура колдонуусун жана сөздүк корун текшерет.

---

### 2. Негизги ыкмалар:
1. **Негизги ойду табуу (Main Idea):** Ар бир абзацтын маанисин түшүнүү.
2. **Контексттен сөздү аныктоо:** Белгисиз сөздүн маанисин сүйлөмдүн түзүлүшүнөн чыгаруу.`,
            photos: [
              {
                id: 'eng-photo-1',
                titleRu: 'Reading Passage breakdown: Strategy for Inference questions',
                titleKg: 'Reading текстин талдоо: Логикалык суроолордун чыгарылышы',
                imageUrl: 'https://res.cloudinary.com/rw9qhk3a/image/upload/v1787233847/%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E__12_%D0%9C%D0%B0%D1%82%D0%B5%D0%BC_1.1.jpg',
                descriptionRu: 'Step-by-step breakdown of high-difficulty reading passage questions from previous ORT trials.',
                descriptionKg: 'ЖРТнын татаал деңгээлдеги англисче текст суроолорунун толук талдоосу.',
              },
            ],
            videos: [
              {
                id: 'eng-video-1',
                titleRu: 'ORT English: Reading Mastery & Time Management',
                titleKg: 'ЖРТ Англис тили: Тексттерди ылдам талдоо',
                duration: '17:20',
                thumbnailUrl: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=800&q=80',
                authorName: 'ORT English Master',
                descriptionRu: 'How to skim and scan academic texts efficiently without getting stuck on unknown words.',
                descriptionKg: 'Текстти тез окуп, түшүнүү жана белгисиз сөздөргө убакыт коротпоо ыкмалары.',
              },
            ],
          },
        ],
      },
      {
        id: 'eng-block-2',
        number: 2,
        titleRu: 'Grammar, Tenses & Vocabulary',
        titleKg: 'Грамматика, чактар жана сөздүк кор (Grammar & Vocab)',
        descRu: 'Времена глаголов, Passive Voice, Conditionals, модальные глаголы, предлоги и фразовые глаголы ОРТ',
        descKg: 'Этиштин чактары, Passive Voice, Conditionals, модалдык этиштер жана предлогдор',
        topics: [
          {
            id: 'eng-tenses-passive',
            titleRu: 'Tenses, Conditionals and Passive Voice mastery',
            titleKg: 'Чактар, Conditionals жана Passive Voice эрежелери',
            isAvailable: true,
            contentRu: `### 1. English Grammar Essentials for ORT
Grammar and vocabulary questions test your mastery of accurate tense forms and sentence structures.

---

### 2. High-Frequency Topics on ORT:
1. **Conditionals (0, 1st, 2nd, 3rd):**
   * *If + Past Simple, would + Verb* (2nd Conditional - unreal present).
   * *If + Past Perfect, would have + V3* (3rd Conditional - unreal past).
2. **Passive Voice:**
   * *Subject + to be + Past Participle (V3)*.
3. **Modal Verbs:**
   * *Must vs. Have to*, *Should*, *Could have done* (past regrets).
4. **Gerund vs. Infinitive:**
   * *Enjoy doing*, *decide to do*, *look forward to seeing*.`,
            contentKg: `### 1. Англис грамматикасынын маанилүү эрежелери
Бул бөлүмдө чактар, шарттуу сүйлөмдөр (Conditionals) жана пассив этиштер текшерилет.

---

### 2. ЖРТда көп кездешүүчү темалар:
1. **Conditionals (Шарттуу сүйлөмдөр).**
2. **Passive Voice (Туюк мамиле).**
3. **Модалдык этиштер (Modal verbs).**`,
            photos: [
              {
                id: 'eng-photo-2',
                titleRu: 'Cheat-Sheet: 12 English Tenses & Conditionals Matrix',
                titleKg: 'Англисче 12 чак жана Conditionals матрицасы',
                imageUrl: 'https://res.cloudinary.com/rw9qhk3a/image/upload/v1787233827/%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E__12_%D0%9C%D0%B0%D1%82%D0%B5%D0%BC_1.2.jpg',
                descriptionRu: 'Visual formula guide for active & passive voice transformations on ORT.',
                descriptionKg: 'Актив жана пассив формаларын оңой айырмалоочу формулярдык таблица.',
              },
            ],
            videos: [
              {
                id: 'eng-video-2',
                titleRu: 'Crack ORT Grammar: Tenses, Conditionals & Modals',
                titleKg: 'Англис тилинин грамматикалык сырлары',
                duration: '19:40',
                thumbnailUrl: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=800&q=80',
                authorName: 'ORT English Master',
                descriptionRu: 'Top 30 grammar pitfalls and formulaic patterns tested every year in ORT subject exams.',
                descriptionKg: 'ЖРТнын предметтик тестинде жыл сайын келүүчү 30 типтүү грамматикалык тузак.',
              },
            ],
          },
        ],
      },
      {
        id: 'eng-block-3',
        number: 3,
        titleRu: 'Sentence Structure & Error Identification',
        titleKg: 'Сүйлөмдүн түзүлүшү жана каталарды табуу (Error Identification)',
        descRu: 'Поиск грамматических и стилистических ошибок в подчеркнутых частях предложений формата ОРТ',
        descKg: 'ЖРТ форматындагы сүйлөмдөрдүн асты сызылган бөлүктөрүнөн каталарды аныктоо',
        topics: [
          {
            id: 'eng-error-detection',
            titleRu: 'Mastering Error Identification subtest',
            titleKg: 'Каталарды табуу бөлүмүнүн сырлары',
            isAvailable: true,
            contentRu: `### 1. What is Error Identification in ORT?
In this section, a sentence has four underlined words or phrases labeled (A), (B), (C), (D). One of them contains a grammatical error.

---

### 2. Strategy for finding the error:
1. **Check Subject-Verb Agreement:** Singular subject requires singular verb (*The list of items is...* not *are*).
2. **Check Parallel Structure:** *She likes swimming, dancing, and to run* ❌ -> *and running* ✅.
3. **Adjective vs. Adverb:** Adverbs modify verbs and adjectives (*He spoke polite* ❌ -> *politely* ✅).
4. **Preposition Collocations:** *interested in*, *depend on*, *accused of*.`,
            contentKg: `### 1. Error Identification (Каталарды табуу) бөлүмү
Сүйлөмдө 4 сызылган сөз же сөз айкашы берилет. Алардын биринде грамматикалык ката бар.

---

### 2. Ката табуунун эрежелери:
1. **Ээ менен баяндоочтун байланышы (Subject-Verb agreement).**
2. **Бир өңчөй мүчөлөрдүн түзүлүшү (Parallelism).**
3. **Сын атооч менен тактоочтун айырмасы (Adjective vs Adverb).**`,
            photos: [
              {
                id: 'eng-photo-3',
                titleRu: 'ORT Error Identification: Top 10 traps and patterns',
                titleKg: 'ЖРТ Каталарды табуу: Эң негизги 10 тузак',
                imageUrl: 'https://res.cloudinary.com/rw9qhk3a/image/upload/v1787233847/%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E__12_%D0%9C%D0%B0%D1%82%D0%B5%D0%BC_1.1.jpg',
                descriptionRu: 'Analyzed examples of subject-verb agreement and parallel structure questions.',
                descriptionKg: 'Каталарды табуу боюнча типтүү мисалдардын толук талдоосу.',
              },
            ],
            videos: [
              {
                id: 'eng-video-3',
                titleRu: 'Error Identification Masterclass for ORT',
                titleKg: 'Error Identification боюнча толук мастер-класс',
                duration: '14:55',
                thumbnailUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80',
                authorName: 'ORT English Master',
                descriptionRu: 'Fast method for scanning underlined parts and spotting grammatical errors in under 30 seconds.',
                descriptionKg: '30 секунддун ичинде сүйлөмдөгү грамматикалык катаны табуунун методу.',
              },
            ],
          },
        ],
      },
    ],
  },
};
