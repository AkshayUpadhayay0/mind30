export type MathQuestion = {
  id: string;
  text: string;
  answer: number;
};

type LevelConfig = {
  min: number;
  max: number;
  operations: string[];
};

const LEVEL_CONFIG: Record<number, LevelConfig> = {
  1: {
    min: 1,
    max: 10,
    operations: ['+'],
  },

  2: {
    min: 1,
    max: 20,
    operations: ['+', '-'],
  },

  3: {
    min: 1,
    max: 30,
    operations: ['+', '-', '×'],
  },

  4: {
    min: 5,
    max: 50,
    operations: ['+', '-', '×', '÷'],
  },

  5: {
    min: 10,
    max: 75,
    operations: ['+', '-', '×', '÷'],
  },

  6: {
    min: 10,
    max: 100,
    operations: ['+', '-', '×', '÷'],
  },

  7: {
    min: 10,
    max: 150,
    operations: ['+', '-', '×', '÷'],
  },

  8: {
    min: 20,
    max: 200,
    operations: ['+', '-', '×', '÷'],
  },

  9: {
    min: 20,
    max: 300,
    operations: ['+', '-', '×', '÷'],
  },

  10: {
    min: 25,
    max: 500,
    operations: ['+', '-', '×', '÷'],
  },
};

const DEFAULT_CONFIG: LevelConfig = {
  min: 10,
  max: 100,
  operations: ['+', '-', '×', '÷'],
};

function randomInt(min: number, max: number) {
  return Math.floor(
    Math.random() * (max - min + 1)
  ) + min;
}

function randomItem<T>(items: T[]): T {
  return items[
    Math.floor(Math.random() * items.length)
  ];
}

function createId() {
  return `${Date.now()}-${Math.random()
    .toString(36)
    .substring(2, 9)}`;
}

function generateAddition(config: LevelConfig) {
  const a = randomInt(config.min, config.max);
  const b = randomInt(config.min, config.max);

  return {
    text: `${a} + ${b}`,
    answer: a + b,
  };
}

function generateSubtraction(config: LevelConfig) {
  let a = randomInt(config.min, config.max);
  let b = randomInt(config.min, config.max);

  // Keep answers non-negative.
  if (b > a) {
    [a, b] = [b, a];
  }

  return {
    text: `${a} - ${b}`,
    answer: a - b,
  };
}

function generateMultiplication(config: LevelConfig) {
  const a = randomInt(
    Math.max(1, Math.floor(config.min / 2)),
    Math.max(5, Math.floor(config.max / 5))
  );

  const b = randomInt(
    2,
    Math.max(5, Math.floor(config.max / 10))
  );

  return {
    text: `${a} × ${b}`,
    answer: a * b,
  };
}

function generateDivision(config: LevelConfig) {
  const divisor = randomInt(
    2,
    Math.max(3, Math.floor(config.max / 10))
  );

  const quotient = randomInt(
    2,
    Math.max(5, Math.floor(config.max / divisor))
  );

  const dividend = divisor * quotient;

  return {
    text: `${dividend} ÷ ${divisor}`,
    answer: quotient,
  };
}

export function generateMathQuestion(
  level: number
): MathQuestion {
  const config =
    LEVEL_CONFIG[level] ?? DEFAULT_CONFIG;

  const operation = randomItem(
    config.operations
  );

  let question: {
    text: string;
    answer: number;
  };

  switch (operation) {
    case '+':
      question = generateAddition(config);
      break;

    case '-':
      question = generateSubtraction(config);
      break;

    case '×':
      question = generateMultiplication(config);
      break;

    case '÷':
      question = generateDivision(config);
      break;

    default:
      question = generateAddition(config);
  }

  return {
    id: createId(),
    text: question.text,
    answer: question.answer,
  };
}

export function generateChallengeQuestions(
  level: number,
  count = 5
): MathQuestion[] {
  const questions: MathQuestion[] = [];

  while (questions.length < count) {
    const question = generateMathQuestion(level);

    const duplicate = questions.some(
      existing =>
        existing.text === question.text
    );

    if (!duplicate) {
      questions.push(question);
    }
  }

  return questions;
}

export function getChallengeTimeSeconds(
  level: number
) {
  if (level <= 3) {
    return 5 * 60;
  }

  return 3 * 60;
}