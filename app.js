const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Book = require('./models/Book');

const app = express();
const PORT = 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/library', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// Set view engine
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Home route
app.get('/', async (req, res) => {
  const books = await Book.find();
  res.render('index', { books });
});

// Add Book - GET
app.get('/add', (req, res) => {
  res.render('addBook');
});

// Add Book - POST
app.post('/add', async (req, res) => {
  const { title, author, genre, year } = req.body;
  const book = new Book({ title, author, genre, year });
  await book.save();
  res.redirect('/');
});

// Edit Book - GET
app.get('/edit/:id', async (req, res) => {
  const book = await Book.findById(req.params.id);
  res.render('editBook', { book });
});

// Edit Book - POST
app.post('/edit/:id', async (req, res) => {
  const { title, author, genre, year, available } = req.body;
  await Book.findByIdAndUpdate(req.params.id, { title, author, genre, year, available: available === 'on' });
  res.redirect('/');
});

// Delete Book
app.get('/delete/:id', async (req, res) => {
  await Book.findByIdAndDelete(req.params.id);
  res.redirect('/');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
