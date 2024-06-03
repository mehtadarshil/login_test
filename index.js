const express = require('express');
const userController = require('./controller/user_controller.js');
const app = express();
var bodyParser = require('body-parser');
const path = require('path');
const port = 3000;

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
const filePath = path.join(__dirname, 'test.html');
app.get('/', (req, res) => {
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error('Error sending file:', err);
      // Send an error response if the file cannot be sent
      return res.status(500).send('Internal Server Error');
    }
  });
});

app.post('/register', userController.insertUser);

app.post('/login', userController.loginUser);

app.post('/getTodoList', userController.getTodoList);

app.post('/addTodo', userController.insertTodoList);

app.post('/updateTodo', userController.updateTodo);

app.delete('/deleteTodo', userController.deleteTodo);

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});

module.exports = app;