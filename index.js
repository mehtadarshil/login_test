const express = require('express');
const userController = require('./controller/user_controller.js');
const app = express();
var bodyParser = require('body-parser');
const port = 9000;

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('तुम बड़े मूर्ख हो');
});

app.get('/getAllUsers', userController.getAllUser);
app.post('/register', userController.insertUser);

app.post('/login', userController.loginUser);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

module.exports = app;