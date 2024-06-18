const express = require('express');
const router = express.Router();
const db = require('../database');
const bcrypt = require('bcrypt');
const saltRounds = 10;

router.post('/register', (req, res) => {
  const { username, password } = req.body;

  bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) return res.status(500).send('Error hashing password');

    db.run("INSERT INTO users (username, password, score) VALUES (?, ?, 0)", [username, hash], function(err) {
      if (err) return res.status(500).send('Error registering user');

      res.status(200).send('User registered');
    });
  });
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  db.get("SELECT * FROM users WHERE username = ?", [username], (err, row) => {
    if (err) return res.status(500).send('Error fetching user');
    if (!row) return res.status(404).send('User not found');

    bcrypt.compare(password, row.password, (err, result) => {
      if (result) {
        res.status(200).json({ message: 'Login successful', userId: row.id });
      } else {
        res.status(401).send('Incorrect password');
      }
    });
  });
});

router.get('/score/:userId', (req, res) => {
  const { userId } = req.params;

  db.get("SELECT score FROM users WHERE id = ?", [userId], (err, row) => {
    if (err) return res.status(500).send('Error fetching score');
    if (!row) return res.status(404).send('User not found');

    res.json({ score: row.score });
  });
});

router.post('/score', (req, res) => {
  const { userId, score } = req.body;

  db.run("UPDATE users SET score = score + ? WHERE id = ?", [score, userId], function(err) {
    if (err) return res.status(500).send('Error updating score');

    res.status(200).send('Score updated');
  });
});

module.exports = router;
