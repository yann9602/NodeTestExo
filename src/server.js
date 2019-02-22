import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';

import book from './routes/books';

let app = express();

//parse application/json and look for raw text
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: 'application/json' }));

app.get('/', (req, res) => res.json({ message: 'Welcome to our Bookstore!' }));

app
  .route('/book')
  .get(book.getBooks)
  .post(book.postBook);

app
  .route('/book/:id')
  .get(book.getBook)
  .delete(book.deleteBook)
  .put(book.updateBook);

var port = process.env.PORT || 80;
app.listen(port,function () {
  console.log('Application running on port ' + port)
});

module.exports = app; // for testing
