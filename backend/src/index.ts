import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db';
import applicationRoutes from './routes/application.routes';
import dashboardApp from './dashboard';
import cors from 'cors';

dotenv.config();
connectDB();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use('/', dashboardApp);
app.use('/api', applicationRoutes);

app.get('/', (req, res) => {
  res.send('Nerd Apply prototype backend is working 🚀');
});

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
