const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/api/formularz', (req, res) => {
  const { name, email, password } = req.body;

  console.log('Dane z formularza:', { name, email, password });

  res.status(200).json({ message: 'Formularz został odebrany', data: { name, email } });
});

app.listen(port, () => {
  console.log(`Serwer działa na porcie ${port}`);
});
