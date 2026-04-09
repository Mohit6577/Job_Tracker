import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import jobRoutes from './routes/jobRoutes.js';
import authRoutes from './routes/authRoutes.js';
import errorHandler from './middleware/errorMiddleware.js';

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());
app.get('/', (req, res) => {
  res.send('API is runing...');
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 5000;

//Routes
app.use('/api/jobs', jobRoutes);
app.use('/api/auth', authRoutes);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is runing on port${PORT}`);
});
