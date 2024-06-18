let userId = null;

document.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('userId')) {
    userId = localStorage.getItem('userId');
    showMainContainer();
    document.getElementById('username-display').textContent = localStorage.getItem('username');
    updateScoreDisplay();
    loadRandomProblem();
  }
});

function register() {
  const username = document.getElementById('register-username').value;
  const password = document.getElementById('register-password').value;

  fetch('/api/users/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  })
    .then(response => response.text())
    .then(message => alert(message));
}

function login() {
  const username = document.getElementById('login-username').value;
  const password = document.getElementById('login-password').value;

  fetch('/api/users/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  })
    .then(response => response.json())
    .then(data => {
      if (data.userId) {
        userId = data.userId;
        localStorage.setItem('userId', userId);
        localStorage.setItem('username', username);
        showMainContainer();
        document.getElementById('username-display').textContent = username;
        updateScoreDisplay();
        loadRandomProblem();
      } else {
        alert('Не удалось войти');
      }
    });
}

function logout() {
  userId = null;
  localStorage.removeItem('userId');
  localStorage.removeItem('username');
  document.getElementById('auth-container').style.display = 'block';
  document.getElementById('main-container').style.display = 'none';
}

function showMainContainer() {
  document.getElementById('auth-container').style.display = 'none';
  document.getElementById('main-container').style.display = 'block';
  document.getElementById('main-container').classList.add('animated', 'slideIn');
}

function loadRandomProblem() {
  const level = document.querySelector('input[name="difficulty"]:checked').value;
  const type = document.querySelector('input[name="problem-type"]:checked').value;
  fetch(`/api/problems/random?level=${level}&type=${type}`)
    .then(response => response.json())
    .then(problem => {
      const container = document.getElementById('problem-container');
      container.innerHTML = `
        <p>${problem.question}</p>
        <input type="text" id="user-answer">
        <button class="btn btn-success mt-2" onclick="checkAnswer('${problem.question}', '${type}')">Проверить ответ</button>
        <p id="result"></p>
      `;
    });
}

function checkAnswer(question, type) {
  const userAnswer = document.getElementById('user-answer').value;

  fetch('/api/problems/check', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ question, userAnswer, type }),
  })
    .then(response => response.json())
    .then(data => {
      const resultElement = document.getElementById('result');
      if (data.correct) {
        resultElement.textContent = 'Правильно!';
        resultElement.style.color = 'green';
        updateScore(10);
      } else {
        resultElement.textContent = `Неправильно! Правильный ответ: ${data.correctAnswer}`;
        resultElement.style.color = 'red';
        updateScore(-5);
      }
    });
}

function updateScore(points) {
  fetch('/api/users/score', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId, score: points }),
  })
    .then(response => response.text())
    .then(message => {
      console.log(message);
      updateScoreDisplay();
    });
}

function updateScoreDisplay() {
  fetch(`/api/users/score/${userId}`)
    .then(response => response.json())
    .then(data => {
      document.getElementById('score-display').textContent = data.score;
    });
}
