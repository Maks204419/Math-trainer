const express = require('express');
const router = express.Router();

function generateRandomProblem(level, type) {
  let question, answer;

  switch (type) {
    case 'arithmetic':
      ({ question, answer } = generateArithmeticProblem(level));
      break;
    case 'area':
      ({ question, answer } = generateAreaProblem(level));
      break;
    case 'perimeter':
      ({ question, answer } = generatePerimeterProblem(level));
      break;
    case 'comparison':
      ({ question, answer } = generateComparisonProblem(level));
      break;
    default:
      ({ question, answer } = generateArithmeticProblem(level));
  }

  return { question, answer };
}

function generateArithmeticProblem(level) {
  let num1, num2;
  switch (level) {
    case 'easy':
      num1 = Math.floor(Math.random() * 10) + 1;
      num2 = Math.floor(Math.random() * 10) + 1;
      break;
    case 'medium':
      num1 = Math.floor(Math.random() * 50) + 1;
      num2 = Math.floor(Math.random() * 50) + 1;
      break;
    case 'hard':
      num1 = Math.floor(Math.random() * 100) + 1;
      num2 = Math.floor(Math.random() * 100) + 1;
      break;
    default:
      num1 = Math.floor(Math.random() * 10) + 1;
      num2 = Math.floor(Math.random() * 10) + 1;
  }
  const operations = ['+', '-', '*', '/'];
  const operation = operations[Math.floor(Math.random() * operations.length)];

  let question = `${num1} ${operation} ${num2}`;
  let answer;

  switch (operation) {
    case '+':
      answer = num1 + num2;
      break;
    case '-':
      answer = num1 - num2;
      break;
    case '*':
      answer = num1 * num2;
      break;
    case '/':
      // Избегаем периодических дробей
      while (num1 % num2 !== 0) {
        num2 = Math.floor(Math.random() * 10) + 1;
      }
      answer = num1 / num2;
      answer = parseFloat(answer.toFixed(2));
      question = `${num1} / ${num2}`;
      break;
  }

  return { question, answer };
}


function generateAreaProblem(level) {
  let side1, side2;
  switch (level) {
    case 'easy':
      side1 = Math.floor(Math.random() * 10) + 1;
      side2 = Math.floor(Math.random() * 10) + 1;
      break;
    case 'medium':
      side1 = Math.floor(Math.random() * 20) + 1;
      side2 = Math.floor(Math.random() * 20) + 1;
      break;
    case 'hard':
      side1 = Math.floor(Math.random() * 50) + 1;
      side2 = Math.floor(Math.random() * 50) + 1;
      break;
    default:
      side1 = Math.floor(Math.random() * 10) + 1;
      side2 = Math.floor(Math.random() * 10) + 1;
  }

  const question = `Calculate the area of a rectangle with sides ${side1} and ${side2}`;
  const answer = side1 * side2;
  return { question, answer };
}

function generatePerimeterProblem(level) {
  let side1, side2;
  switch (level) {
    case 'easy':
      side1 = Math.floor(Math.random() * 10) + 1;
      side2 = Math.floor(Math.random() * 10) + 1;
      break;
    case 'medium':
      side1 = Math.floor(Math.random() * 20) + 1;
      side2 = Math.floor(Math.random() * 20) + 1;
      break;
    case 'hard':
      side1 = Math.floor(Math.random() * 50) + 1;
      side2 = Math.floor(Math.random() * 50) + 1;
      break;
    default:
      side1 = Math.floor(Math.random() * 10) + 1;
      side2 = Math.floor(Math.random() * 10) + 1;
  }

  const question = `Calculate the perimeter of a rectangle with sides ${side1} and ${side2}`;
  const answer = 2 * (side1 + side2);
  return { question, answer };
}

function generateComparisonProblem(level) {
  let num1, num2;
  switch (level) {
    case 'easy':
      num1 = Math.floor(Math.random() * 10) + 1;
      num2 = Math.floor(Math.random() * 10) + 1;
      break;
    case 'medium':
      num1 = Math.floor(Math.random() * 50) + 1;
      num2 = Math.floor(Math.random() * 50) + 1;
      break;
    case 'hard':
      num1 = Math.floor(Math.random() * 100) + 1;
      num2 = Math.floor(Math.random() * 100) + 1;
      break;
    default:
      num1 = Math.floor(Math.random() * 10) + 1;
      num2 = Math.floor(Math.random() * 10) + 1;
  }

  const question = `Which number is greater: ${num1} or ${num2}?`;
  const answer = num1 > num2 ? num1 : num2;
  return { question, answer };
}

router.get('/random', (req, res) => {
  const level = req.query.level || 'easy';
  const type = req.query.type || 'arithmetic';
  const problem = generateRandomProblem(level, type);
  res.json(problem);
});

router.post('/check', (req, res) => {
  const { question, userAnswer, type } = req.body;
  
  let correctAnswer;

  switch (type) {
    case 'arithmetic':
      try {
        correctAnswer = eval(question);
        correctAnswer = parseFloat(correctAnswer.toFixed(2));
      } catch (error) {
        return res.status(400).send('Invalid question format');
      }
      break;
    case 'area':
      const areaMatch = question.match(/sides (\d+) and (\d+)/);
      if (areaMatch) {
        const [_, side1, side2] = areaMatch.map(Number);
        correctAnswer = side1 * side2;
      } else {
        return res.status(400).send('Invalid question format');
      }
      break;
    case 'perimeter':
      const perimeterMatch = question.match(/sides (\d+) and (\d+)/);
      if (perimeterMatch) {
        const [_, side1, side2] = perimeterMatch.map(Number);
        correctAnswer = 2 * (side1 + side2);
      } else {
        return res.status(400).send('Invalid question format');
      }
      break;
    case 'comparison':
      const numbers = question.match(/\d+/g).map(Number);
      correctAnswer = numbers[0] > numbers[1] ? numbers[0] : numbers[1];
      break;
    default:
      return res.status(400).send('Invalid problem type');
  }

  const isCorrect = correctAnswer === parseFloat(userAnswer);
  res.json({ correct: isCorrect, correctAnswer });
});



module.exports = router;
