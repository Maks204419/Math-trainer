const express = require('express');
const app = express();
const port = 2241;

app.use(express.json());
app.use(express.static('public'));

const problemsRouter = require('./routes/problems');
const usersRouter = require('./routes/users');
app.use('/api/problems', problemsRouter);
app.use('/api/users', usersRouter);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
