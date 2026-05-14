const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/objects', require('./routes/objectRoutes'));

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../client/dist')));
  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, '../../client', 'dist', 'index.html'))
  );
} else {
  app.get('/', (req, res) => res.send('API is running...'));
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
