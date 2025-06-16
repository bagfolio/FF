import express from 'express';

const app = express();

app.get('/', (req, res) => {
  res.send('Hello Express app!')
});

app.listen(() => {
  console.log('Server started');
});
