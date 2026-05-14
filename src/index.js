const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

// Connect to Database
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Static Folder for Uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/objects', require('./routes/objectRoutes'));

// Production Setup
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../client/dist')));
  app.get('/', (req, res) =>
    res.sendFile(path.resolve(__dirname, '../../client', 'dist', 'index.html'))
  );
} else {
  app.get('/', (req, res) => {
    res.send('Hello World!');
  });
}

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
