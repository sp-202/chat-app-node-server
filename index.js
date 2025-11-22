import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import connectDB from './config/db.js';
import userRoutes from './routes/user.routes.js';

const app = express();
const PORT = process.env.PORT || 8080;

// Connect MongoDB
connectDB();

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/api/users', userRoutes);

// Root Route
app.get('/', (req, res) => res.send('User API is running'));

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
