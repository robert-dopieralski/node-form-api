const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const formularze = [];

app.post('/api/formularz', (req, res) => {
    const { name, email, password } = req.body;
  
    // Sprawdź, czy email już istnieje w tablicy
    const existingForm = formularze.find((f) => f.email === email);
  
    if (existingForm) {
      res.status(400).json({ message: 'Podany email już istnieje' });
      return;
    }
  
    const nowyFormularz = { name, email, password };
    formularze.push(nowyFormularz);
  
    console.log('Dodano formularz:', nowyFormularz);
  
    res.status(200).json({ message: 'Formularz dodany pomyślnie', data: nowyFormularz });
  });

app.get('/api/formularze', (req, res) => {
    res.status(200).json(formularze);
  });

app.listen(port, () => {
  console.log(`Serwer działa na porcie ${port}`);
});
