const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
// const port = 5000;
const port = 4748;

// CORS Middleware - Allow multiple frontend origins
const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 3600
}));

app.use(express.json());

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const courseRoutes = require('./routes/courseRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const chapterRoutes = require('./routes/chapterRoutes');
const assignRoutes = require('./routes/assignRoutes');
const pricingRoutes = require("./routes/pricingRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const testRoutes = require("./routes/testRoutes");
const chapterProgressRoutes = require("./routes/chapterProgressRoutes");

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Register routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/chapters', chapterRoutes);
app.use('/api/assign', assignRoutes);
app.use("/api/pricing", pricingRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/tests", testRoutes);
app.use("/api/progress", chapterProgressRoutes); // Fixed path for chapter progress

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});



// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});