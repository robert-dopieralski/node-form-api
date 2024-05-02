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
  
    const nowyFormularz = { name, email, password, id: new Date().toISOString() };
    formularze.push(nowyFormularz);
  
    console.log('Dodano formularz:', nowyFormularz);
  
    res.status(200).json(nowyFormularz);
  });

app.get('/api/formularze', (req, res) => {
    res.status(200).json(formularze);
});

app.delete('/api/formularz/:email', (req, res) => {
    const email = req.params.email;
  
    // Znajdź indeks rekordu z danym e-mailem
    const index = formularze.findIndex((f) => f.email === email);
  
    if (index === -1) {
      // Jeśli e-mail nie istnieje, zwróć błąd 404
      res.status(404).json({ message: 'Formularz z podanym e-mailem nie istnieje' });
      return;
    }
  
    formularze.splice(index, 1);
  
    res.status(200).json({ message: 'Formularz został usunięty' });
});

app.listen(port, () => {
  console.log(`Serwer działa na porcie ${port}`);
});
