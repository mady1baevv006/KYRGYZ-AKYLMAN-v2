/**
 * OnlineMSchool Fractions Mathematical Engine
 * Accurate port of pfract-1.002.js and fr-1.051.js generator & verification rules.
 */

export interface FractionValue {
  c?: number | string; // integer whole part (e.g. 2 in 2 1/3)
  n: number | string;  // numerator
  d: number | string;  // denominator
  zn?: number;         // sign (+1 or -1)
}

export interface ExerciseProblem {
  exerciseId: string;
  op?: string;         // '+', '-', '·', ':', or comparison
  fr1: FractionValue;
  fr2?: FractionValue;
  decimalStr?: string; // for transform2 (e.g. "3.75")
  paren2?: boolean;    // for negative fractions in calk2
}

export interface VerificationResult {
  isCorrect: boolean;
  score: number;
  maxScore: number;
  message: string;
  notes?: string[];
  correctAnswerStr?: string;
  stepsHtml?: string;
}

/** Greatest Common Divisor (НОД) */
export function gcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y > 0) {
    const temp = y;
    y = x % y;
    x = temp;
  }
  return x === 0 ? 1 : x;
}

/** Least Common Multiple (НОК) */
export function lcm(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  return Math.abs((a * b) / gcd(a, b));
}

/** Random integer between min and max inclusive */
function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generate a new random problem based on exercise type
 */
export function generateFractionProblem(exerciseId: string): ExerciseProblem {
  const maxd = 40;
  const maxc = 10;

  switch (exerciseId) {
    case 'calk': {
      // Сложение и вычитание дробей с равными знаменателями
      const d = randInt(3, maxd - 2);
      const isPlus = Math.random() < 0.5;
      if (isPlus) {
        const n1 = randInt(1, d - 1);
        const n2 = randInt(1, Math.max(1, d - n1));
        return {
          exerciseId,
          op: '+',
          fr1: { n: n1, d },
          fr2: { n: n2, d }
        };
      } else {
        const n1 = randInt(2, d - 1);
        const n2 = randInt(1, n1);
        return {
          exerciseId,
          op: '-',
          fr1: { n: n1, d },
          fr2: { n: n2, d }
        };
      }
    }

    case 'simplify': {
      // Сокращение дробей
      const baseD = randInt(2, Math.floor(maxd / 2));
      const baseN = randInt(1, baseD - 1);
      const mult = randInt(2, 9);
      return {
        exerciseId,
        fr1: { n: baseN * mult, d: baseD * mult }
      };
    }

    case 'lcd': {
      // Приведение к общему знаменателю
      let d1 = randInt(2, 20);
      let d2 = randInt(2, 20);
      if (d1 === d2) d2 = d1 + 1;
      let n1 = randInt(1, d1 - 1);
      let n2 = randInt(1, d2 - 1);
      // Simplify base fractions first
      const g1 = gcd(n1, d1);
      n1 = n1 / g1;
      d1 = d1 / g1;
      const g2 = gcd(n2, d2);
      n2 = n2 / g2;
      d2 = d2 / g2;
      if (d1 === d2) d2 = d1 + 1;
      return {
        exerciseId,
        fr1: { n: n1, d: d1 },
        fr2: { n: n2, d: d2 }
      };
    }

    case 'transform': {
      // Неправильная в смешанную
      const d = randInt(2, 20);
      const whole = randInt(1, maxc);
      const remainder = randInt(1, d - 1);
      const n = whole * d + remainder;
      return {
        exerciseId,
        fr1: { n, d }
      };
    }

    case 'transform1': {
      // Смешанная в неправильную
      const d = randInt(2, 20);
      const whole = randInt(1, maxc);
      const n = randInt(1, d - 1);
      return {
        exerciseId,
        fr1: { c: whole, n, d }
      };
    }

    case 'comparison1': {
      // Сравнение обыкновенных дробей
      const d1 = randInt(2, 25);
      const d2 = randInt(2, 25);
      const n1 = randInt(1, d1);
      const n2 = randInt(1, d2);
      return {
        exerciseId,
        fr1: { n: n1, d: d1 },
        fr2: { n: n2, d: d2 }
      };
    }

    case 'calk3': {
      // Сложение и вычитание двух обыкновенных дробей (разные знаменатели)
      const isPlus = Math.random() < 0.5;
      let d1 = randInt(2, 20);
      let d2 = randInt(2, 20);
      let n1 = randInt(1, d1);
      let n2 = randInt(1, d2);
      if (!isPlus) {
        // Ensure fr1 >= fr2 for positive difference
        if (n1 * d2 < n2 * d1) {
          const tn = n1; n1 = n2; n2 = tn;
          const td = d1; d1 = d2; d2 = td;
        }
      }
      return {
        exerciseId,
        op: isPlus ? '+' : '-',
        fr1: { n: n1, d: d1 },
        fr2: { n: n2, d: d2 }
      };
    }

    case 'multiplication1': {
      // Умножение двух обыкновенных дробей
      const d1 = randInt(2, 20);
      const d2 = randInt(2, 20);
      const n1 = randInt(1, d1);
      const n2 = randInt(1, d2);
      return {
        exerciseId,
        op: '·',
        fr1: { n: n1, d: d1 },
        fr2: { n: n2, d: d2 }
      };
    }

    case 'division1': {
      // Деление двух обыкновенных дробей
      const d1 = randInt(2, 20);
      const d2 = randInt(2, 20);
      const n1 = randInt(1, d1);
      const n2 = randInt(1, d2);
      return {
        exerciseId,
        op: ':',
        fr1: { n: n1, d: d1 },
        fr2: { n: n2, d: d2 }
      };
    }

    case 'calk4': {
      // Вычисления с двумя обыкновенными дробями (+, -, ·, :)
      const ops = ['+', '-', '·', ':'];
      const chosenOp = ops[randInt(0, 3)];
      let d1 = randInt(2, 20);
      let d2 = randInt(2, 20);
      let n1 = randInt(1, d1);
      let n2 = randInt(1, d2);
      if (chosenOp === '-' && n1 * d2 < n2 * d1) {
        const tn = n1; n1 = n2; n2 = tn;
        const td = d1; d1 = d2; d2 = td;
      }
      return {
        exerciseId,
        op: chosenOp,
        fr1: { n: n1, d: d1 },
        fr2: { n: n2, d: d2 }
      };
    }

    case 'comparison': {
      // Сравнение смешанных дробей
      const d1 = randInt(2, 20);
      const d2 = randInt(2, 20);
      const c1 = randInt(1, 10);
      // Half time make same whole, half time different
      const c2 = Math.random() < 0.5 ? c1 : randInt(1, 10);
      const n1 = randInt(1, d1 - 1);
      const n2 = randInt(1, d2 - 1);
      return {
        exerciseId,
        fr1: { c: c1, n: n1, d: d1 },
        fr2: { c: c2, n: n2, d: d2 }
      };
    }

    case 'calk1': {
      // Сложение и вычитание двух смешанных дробей
      const isPlus = Math.random() < 0.5;
      let d1 = randInt(2, 16);
      let d2 = randInt(2, 16);
      let c1 = randInt(1, 8);
      let c2 = randInt(1, 8);
      let n1 = randInt(1, d1 - 1);
      let n2 = randInt(1, d2 - 1);
      if (!isPlus) {
        const val1 = c1 + n1 / d1;
        const val2 = c2 + n2 / d2;
        if (val1 < val2) {
          const tc = c1; c1 = c2; c2 = tc;
          const tn = n1; n1 = n2; n2 = tn;
          const td = d1; d1 = d2; d2 = td;
        }
      }
      return {
        exerciseId,
        op: isPlus ? '+' : '-',
        fr1: { c: c1, n: n1, d: d1 },
        fr2: { c: c2, n: n2, d: d2 }
      };
    }

    case 'multiplication': {
      // Умножение двух смешанных дробей
      const d1 = randInt(2, 12);
      const d2 = randInt(2, 12);
      const c1 = randInt(1, 5);
      const c2 = randInt(1, 5);
      const n1 = randInt(1, d1 - 1);
      const n2 = randInt(1, d2 - 1);
      return {
        exerciseId,
        op: '·',
        fr1: { c: c1, n: n1, d: d1 },
        fr2: { c: c2, n: n2, d: d2 }
      };
    }

    case 'division': {
      // Деление двух смешанных дробей
      const d1 = randInt(2, 12);
      const d2 = randInt(2, 12);
      const c1 = randInt(1, 6);
      const c2 = randInt(1, 6);
      const n1 = randInt(1, d1 - 1);
      const n2 = randInt(1, d2 - 1);
      return {
        exerciseId,
        op: ':',
        fr1: { c: c1, n: n1, d: d1 },
        fr2: { c: c2, n: n2, d: d2 }
      };
    }

    case 'calk2': {
      // Вычисления с двумя смешанными дробями (+, -, ·, :)
      const ops = ['+', '-', '·', ':'];
      const chosenOp = ops[randInt(0, 3)];
      const d1 = randInt(2, 12);
      const d2 = randInt(2, 12);
      let c1 = randInt(1, 6);
      let c2 = randInt(1, 6);
      const n1 = randInt(1, d1 - 1);
      const n2 = randInt(1, d2 - 1);
      // Occasionally introduce negative for second fraction
      const paren2 = Math.random() < 0.25;
      if (paren2) {
        c2 = -c2;
      }
      return {
        exerciseId,
        op: chosenOp,
        fr1: { c: c1, n: n1, d: d1 },
        fr2: { c: c2, n: n2, d: d2 },
        paren2
      };
    }

    case 'transform2': {
      // Десятичная в обыкновенную
      const whole = randInt(0, 8);
      const decimalChoices = [
        0.2, 0.4, 0.5, 0.6, 0.8,
        0.25, 0.75, 0.15, 0.35, 0.45, 0.65, 0.85,
        0.125, 0.375, 0.625, 0.875,
        0.05, 0.04, 0.08, 0.12, 0.16, 0.24, 0.32
      ];
      const fracPart = decimalChoices[randInt(0, decimalChoices.length - 1)];
      const val = whole + fracPart;
      const decimalStr = val.toFixed(fracPart.toString().split('.')[1]?.length || 2);
      return {
        exerciseId,
        decimalStr,
        fr1: { n: 0, d: 1 } // placeholder
      };
    }

    default:
      return {
        exerciseId: 'calk',
        op: '+',
        fr1: { n: 1, d: 5 },
        fr2: { n: 2, d: 5 }
      };
  }
}

/**
 * Validates user answer according to OnlineMSchool logic & points
 */
export function verifyFractionProblem(
  problem: ExerciseProblem,
  userInput: {
    c?: string;
    n?: string;
    d?: string;
    op?: string;
    c2?: string;
    n2?: string;
    d2?: string;
  }
): VerificationResult {
  const { exerciseId } = problem;

  // 1. Comparison verification (comparison1 & comparison)
  if (exerciseId === 'comparison1' || exerciseId === 'comparison') {
    const userOp = userInput.op?.trim();
    if (!userOp || userOp === '') {
      return {
        isCorrect: false,
        score: 0,
        maxScore: 1,
        message: 'Выберите знак сравнения (<, = или >)!'
      };
    }

    const c1 = Number(problem.fr1.c) || 0;
    const n1 = Number(problem.fr1.n) || 0;
    const d1 = Number(problem.fr1.d) || 1;
    const val1 = c1 + n1 / d1;

    const c2 = Number(problem.fr2?.c) || 0;
    const n2 = Number(problem.fr2?.n) || 0;
    const d2 = Number(problem.fr2?.d) || 1;
    const val2 = c2 + n2 / d2;

    const diff = (c1 * d1 + n1) * d2 - (c2 * d2 + n2) * d1;
    let expectedOp = '=';
    if (diff > 0) expectedOp = '>';
    if (diff < 0) expectedOp = '<';

    if (userOp === expectedOp) {
      return {
        isCorrect: true,
        score: 1,
        maxScore: 1,
        message: 'Верно!!',
        correctAnswerStr: `${formatFraction(problem.fr1)} ${expectedOp} ${formatFraction(problem.fr2!)}`
      };
    } else {
      return {
        isCorrect: false,
        score: 0,
        maxScore: 1,
        message: 'Вы ошиблись!',
        correctAnswerStr: `${formatFraction(problem.fr1)} ${expectedOp} ${formatFraction(problem.fr2!)}`
      };
    }
  }

  // 2. LCD verification (приведение к общему знаменателю)
  if (exerciseId === 'lcd') {
    const n1In = userInput.n?.trim();
    const d1In = userInput.d?.trim();
    const n2In = userInput.n2?.trim();
    const d2In = userInput.d2?.trim();

    if (!n1In || !d1In || !n2In || !d2In) {
      return {
        isCorrect: false,
        score: 0,
        maxScore: 2,
        message: 'Ошибка! Заполните числители и знаменатели обеих дробей!'
      };
    }

    const uN1 = Number(n1In);
    const uD1 = Number(d1In);
    const uN2 = Number(n2In);
    const uD2 = Number(d2In);

    if (isNaN(uN1) || isNaN(uD1) || isNaN(uN2) || isNaN(uD2)) {
      return {
        isCorrect: false,
        score: 0,
        maxScore: 2,
        message: 'Ошибка! Можно вводить только числа!'
      };
    }

    const origN1 = Number(problem.fr1.n);
    const origD1 = Number(problem.fr1.d);
    const origN2 = Number(problem.fr2!.n);
    const origD2 = Number(problem.fr2!.d);

    const trueLcm = lcm(origD1, origD2);
    const expectedN1 = origN1 * (trueLcm / origD1);
    const expectedN2 = origN2 * (trueLcm / origD2);

    if (uD1 === trueLcm && uD2 === trueLcm && uN1 === expectedN1 && uN2 === expectedN2) {
      return {
        isCorrect: true,
        score: 2,
        maxScore: 2,
        message: 'Верно!!',
        correctAnswerStr: `${expectedN1}/${trueLcm} и ${expectedN2}/${trueLcm}`
      };
    }

    // Check if they brought to a common denominator, but not the least common one
    if (uD1 === uD2 && uD1 > 0 && uN1 * origD1 === origN1 * uD1 && uN2 * origD2 === origN2 * uD2) {
      return {
        isCorrect: false,
        score: 1,
        maxScore: 2,
        message: 'Вы привели дроби к общему знаменателю, но не к наименьшему!',
        correctAnswerStr: `Наименьший общий знаменатель: ${trueLcm} (${expectedN1}/${trueLcm} и ${expectedN2}/${trueLcm})`
      };
    }

    return {
      isCorrect: false,
      score: 0,
      maxScore: 2,
      message: 'Вы ошиблись при приведении дробей к общему знаменателю!',
      correctAnswerStr: `${expectedN1}/${trueLcm} и ${expectedN2}/${trueLcm}`
    };
  }

  // 3. Simplify verification (сокращение)
  if (exerciseId === 'simplify') {
    const nIn = userInput.n?.trim();
    const dIn = userInput.d?.trim();

    if (!nIn || !dIn) {
      return {
        isCorrect: false,
        score: 0,
        maxScore: 2,
        message: 'Ошибка! Заполните числитель и знаменатель дроби!'
      };
    }

    const uN = Number(nIn);
    const uD = Number(dIn);
    if (isNaN(uN) || isNaN(uD) || uD === 0) {
      return {
        isCorrect: false,
        score: 0,
        maxScore: 2,
        message: 'Ошибка! Можно вводить только числа, знаменатель не равен нулю!'
      };
    }

    const origN = Number(problem.fr1.n);
    const origD = Number(problem.fr1.d);
    const g = gcd(origN, origD);
    const trueN = origN / g;
    const trueD = origD / g;

    if (uN === trueN && uD === trueD) {
      return {
        isCorrect: true,
        score: 2,
        maxScore: 2,
        message: 'Верно!!',
        correctAnswerStr: `${trueN}/${trueD}`
      };
    }

    // Check partial reduction
    if (uN * origD === origN * uD && uN < origN && gcd(uN, uD) > 1) {
      return {
        isCorrect: false,
        score: 1,
        maxScore: 2,
        message: 'Вы не до конца сократили дробь!',
        correctAnswerStr: `${trueN}/${trueD}`
      };
    }

    return {
      isCorrect: false,
      score: 0,
      maxScore: 2,
      message: 'Вы ошиблись!',
      correctAnswerStr: `${trueN}/${trueD}`
    };
  }

  // 4. Equal denominator addition/subtraction (calk)
  if (exerciseId === 'calk') {
    const nIn = userInput.n?.trim();
    const dIn = userInput.d?.trim();
    if (!nIn || !dIn) {
      return {
        isCorrect: false,
        score: 0,
        maxScore: 2,
        message: 'Ошибка! Заполните числитель и знаменатель дроби!'
      };
    }
    const uN = Number(nIn);
    const uD = Number(dIn);
    if (isNaN(uN) || isNaN(uD) || uD === 0) {
      return {
        isCorrect: false,
        score: 0,
        maxScore: 2,
        message: 'Ошибка! Можно вводить только числа!'
      };
    }

    const n1 = Number(problem.fr1.n);
    const n2 = Number(problem.fr2!.n);
    const d = Number(problem.fr1.d);
    const rawResN = problem.op === '+' ? n1 + n2 : n1 - n2;
    const g = gcd(rawResN, d);
    const simpN = rawResN / g;
    const simpD = d / g;

    // Direct match or simplified match
    if ((uN === rawResN && uD === d) || (uN === simpN && uD === simpD)) {
      return {
        isCorrect: true,
        score: 2,
        maxScore: 2,
        message: 'Верно!!',
        correctAnswerStr: simpD === 1 ? `${simpN}` : `${rawResN}/${d} ${g > 1 ? ` = ${simpN}/${simpD}` : ''}`
      };
    }

    return {
      isCorrect: false,
      score: 0,
      maxScore: 2,
      message: 'Вы ошиблись!',
      correctAnswerStr: simpD === 1 ? `${simpN}` : `${rawResN}/${d} ${g > 1 ? ` = ${simpN}/${simpD}` : ''}`
    };
  }

  // 5. Transform2 (decimal to fraction)
  if (exerciseId === 'transform2') {
    const rawDec = problem.decimalStr || '0';
    const [cStr, fStr] = rawDec.split('.');
    const whole = Number(cStr) || 0;
    const fracLen = fStr?.length || 0;
    const rawN = Number(fStr) || 0;
    const rawD = Math.pow(10, fracLen);
    const g = gcd(rawN, rawD);
    const expectedN = rawN / g;
    const expectedD = rawD / g;

    const uC = userInput.c?.trim() ? Number(userInput.c) : 0;
    const uN = userInput.n?.trim() ? Number(userInput.n) : 0;
    const uD = userInput.d?.trim() ? Number(userInput.d) : 0;

    if (isNaN(uC) || isNaN(uN) || isNaN(uD)) {
      return {
        isCorrect: false,
        score: 0,
        maxScore: 4,
        message: 'Ошибка! Можно вводить только числа!'
      };
    }

    // Exact simplified mixed form
    if (uC === whole && uN === expectedN && uD === expectedD) {
      return {
        isCorrect: true,
        score: 4,
        maxScore: 4,
        message: 'Верно!!',
        correctAnswerStr: whole > 0 ? `${whole} ${expectedN}/${expectedD}` : `${expectedN}/${expectedD}`
      };
    }

    // Unsimplified decimal representation (e.g. whole and rawN/rawD)
    if (uC === whole && uN * rawD === rawN * uD && uD !== expectedD) {
      return {
        isCorrect: true,
        score: 2,
        maxScore: 4,
        message: 'Верно, но вы забыли сократить дробь!',
        notes: ['Вы не сократили дробь на наибольший общий делитель.'],
        correctAnswerStr: whole > 0 ? `${whole} ${expectedN}/${expectedD}` : `${expectedN}/${expectedD}`
      };
    }

    // Improper fraction form
    if (uC === 0 && uN === whole * expectedD + expectedN && uD === expectedD) {
      return {
        isCorrect: true,
        score: 3,
        maxScore: 4,
        message: 'Верно, но вы забыли выделить целую часть!',
        notes: ['Вы не преобразовали неправильную дробь в смешанное число.'],
        correctAnswerStr: whole > 0 ? `${whole} ${expectedN}/${expectedD}` : `${expectedN}/${expectedD}`
      };
    }

    return {
      isCorrect: false,
      score: 0,
      maxScore: 4,
      message: 'Вы ошиблись!',
      correctAnswerStr: whole > 0 ? `${whole} ${expectedN}/${expectedD}` : `${expectedN}/${expectedD}`
    };
  }

  // 6. Transform1 (mixed to improper)
  if (exerciseId === 'transform1') {
    const c = Number(problem.fr1.c) || 0;
    const n = Number(problem.fr1.n) || 0;
    const d = Number(problem.fr1.d) || 1;
    const trueN = c * d + n;
    const trueD = d;

    const uN = userInput.n?.trim() ? Number(userInput.n) : NaN;
    const uD = userInput.d?.trim() ? Number(userInput.d) : NaN;

    if (isNaN(uN) || isNaN(uD) || uD === 0) {
      return {
        isCorrect: false,
        score: 0,
        maxScore: 4,
        message: 'Ошибка! Заполните числитель и знаменатель дроби!'
      };
    }

    if (uN === trueN && uD === trueD) {
      return {
        isCorrect: true,
        score: 4,
        maxScore: 4,
        message: 'Верно!!',
        correctAnswerStr: `${trueN}/${trueD}`
      };
    }

    return {
      isCorrect: false,
      score: 0,
      maxScore: 4,
      message: 'Вы ошиблись!',
      correctAnswerStr: `${trueN}/${trueD}`
    };
  }

  // 7. General fraction operations (calk3, multiplication1, division1, calk4, transform, calk1, multiplication, division, calk2)
  // Compute true mathematical result in standard normalized mixed form
  let trueNum = 0;
  let trueDen = 1;

  if (exerciseId === 'transform') {
    trueNum = Number(problem.fr1.n);
    trueDen = Number(problem.fr1.d);
  } else {
    // Arithmetic calculation
    const c1 = Number(problem.fr1.c) || 0;
    const n1 = Number(problem.fr1.n) || 0;
    const d1 = Number(problem.fr1.d) || 1;
    const sign1 = c1 < 0 ? -1 : 1;
    const top1 = (Math.abs(c1) * d1 + n1) * sign1;
    const bot1 = d1;

    const c2 = Number(problem.fr2?.c) || 0;
    const n2 = Number(problem.fr2?.n) || 0;
    const d2 = Number(problem.fr2?.d) || 1;
    const sign2 = (problem.paren2 || c2 < 0) ? -1 : 1;
    const top2 = (Math.abs(c2) * d2 + n2) * sign2;
    const bot2 = d2;

    switch (problem.op) {
      case '+':
        trueNum = top1 * bot2 + top2 * bot1;
        trueDen = bot1 * bot2;
        break;
      case '-':
        trueNum = top1 * bot2 - top2 * bot1;
        trueDen = bot1 * bot2;
        break;
      case '·':
        trueNum = top1 * top2;
        trueDen = bot1 * bot2;
        break;
      case ':':
        trueNum = top1 * bot2;
        trueDen = bot1 * top2;
        break;
      default:
        trueNum = top1;
        trueDen = bot1;
    }
  }

  // Check division by zero
  if (trueDen === 0) {
    return {
      isCorrect: false,
      score: 0,
      maxScore: 4,
      message: 'Деление на ноль невозможно!'
    };
  }

  // Normalize sign
  let overallSign = 1;
  if ((trueNum < 0 && trueDen > 0) || (trueNum > 0 && trueDen < 0)) {
    overallSign = -1;
  }
  trueNum = Math.abs(trueNum);
  trueDen = Math.abs(trueDen);

  // Reduce
  const g = gcd(trueNum, trueDen);
  trueNum = trueNum / g;
  trueDen = trueDen / g;

  // Expected whole & fractional part
  const expectedWhole = Math.floor(trueNum / trueDen);
  const expectedRemN = trueNum % trueDen;
  const expectedD = expectedRemN === 0 ? 0 : trueDen;

  // Parse user input
  const uWholeRaw = userInput.c?.trim();
  let uSign = 1;
  let uWhole = 0;
  if (uWholeRaw) {
    if (uWholeRaw === '-') {
      uSign = -1;
      uWhole = 0;
    } else {
      const parsed = Number(uWholeRaw);
      if (!isNaN(parsed)) {
        uSign = parsed < 0 ? -1 : 1;
        uWhole = Math.abs(parsed);
      }
    }
  }

  const uN = userInput.n?.trim() ? Number(userInput.n) : 0;
  const uD = userInput.d?.trim() ? Number(userInput.d) : (expectedD === 0 ? 0 : 0);

  if (isNaN(uN) || isNaN(uD)) {
    return {
      isCorrect: false,
      score: 0,
      maxScore: 4,
      message: 'Ошибка! Можно вводить только числа!'
    };
  }

  // Build expected string for display
  let expectedStr = '';
  const signPrefix = overallSign === -1 ? '-' : '';
  if (expectedRemN === 0) {
    expectedStr = `${signPrefix}${expectedWhole}`;
  } else if (expectedWhole === 0) {
    expectedStr = `${signPrefix}${expectedRemN}/${expectedD}`;
  } else {
    expectedStr = `${signPrefix}${expectedWhole} ${expectedRemN}/${expectedD}`;
  }

  // Compute total user numerator value
  const userTotalNum = (uWhole * (uD || 1) + uN) * uSign;
  const userDen = uD || 1;

  // Exact Match
  const isExactWhole = uWhole === expectedWhole;
  const isExactN = uN === expectedRemN;
  const isExactD = (expectedRemN === 0 && uN === 0) || uD === expectedD;
  const isExactSign = (expectedWhole === 0 && expectedRemN === 0) || (uSign === overallSign);

  if (isExactWhole && isExactN && isExactD && isExactSign) {
    return {
      isCorrect: true,
      score: 4,
      maxScore: 4,
      message: 'Верно!!',
      correctAnswerStr: expectedStr
    };
  }

  // Check if mathematically equivalent
  const isEquiv = userTotalNum * trueDen === (trueNum * overallSign) * userDen;

  if (isEquiv) {
    let score = 4;
    const notes: string[] = [];

    // Did they forget to simplify?
    if (uD > 0 && uD !== expectedD && gcd(uN, uD) > 1) {
      notes.push('Вы забыли упростить (сократить) дробь!');
      score--;
    }

    // Did they forget to extract whole part?
    if (uWhole !== expectedWhole && expectedWhole > 0 && uN >= uD && uD > 0) {
      notes.push('Вы забыли преобразовать неправильную дробь в смешанное число!');
      score--;
    }

    // Sign mismatch
    if (uSign !== overallSign && (expectedWhole !== 0 || expectedRemN !== 0)) {
      notes.push('Ошибка! Неверный знак ответа!');
      score--;
    }

    return {
      isCorrect: true,
      score: Math.max(1, score),
      maxScore: 4,
      message: 'Верно!! Но есть замечания:',
      notes,
      correctAnswerStr: expectedStr
    };
  }

  // Otherwise incorrect
  return {
    isCorrect: false,
    score: 0,
    maxScore: 4,
    message: 'Вы ошиблись!',
    correctAnswerStr: expectedStr
  };
}

function formatFraction(fr: FractionValue): string {
  const parts: string[] = [];
  if (fr.c && Number(fr.c) !== 0) {
    parts.push(String(fr.c));
  }
  if (Number(fr.n) !== 0) {
    parts.push(`${fr.n}/${fr.d}`);
  }
  return parts.length > 0 ? parts.join(' ') : '0';
}
