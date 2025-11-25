import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import tripRoutes from './routes/tripRoutes.js';
import memberRoutes from './routes/memberRoutes.js';
import expenseRoutes from './routes/expenseRoutes.js';
import settlementRoutes from './routes/settlementRoutes.js';
import aiSummaryRoutes from './routes/aiSummaryRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

app.get('/', (_req, res) => {
  res.json({ message: 'TripSplit API is running' });
});

app.use('/api/trips', tripRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/settlement', settlementRoutes);
app.use('/api/summary/ai', aiSummaryRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({
    message: err.message || 'Server error',
  });
});

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();

