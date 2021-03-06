const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')

const path = require('path');

const app = express();
const authRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauces');

//ADMIN : SoPekockoADMIN:OoOypk3I4dTD8iDO
//CélianN:GBiMOsPeuwlMO1yn
mongoose
  .connect(
    'mongodb+srv://CelianN:GBiMOsPeuwlMO1yn@sopekocko.n9gok.mongodb.net/SoPekockoDatabase?retryWrites=true&w=majority',
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch((error) => console.log('Connexion à MongoDB échouée !', error));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH, OPTIONS'
  );
  next();
});

app.use(bodyParser.json());

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/auth', authRoutes);
app.use('/api/sauces', sauceRoutes);

module.exports = app;
