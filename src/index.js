import express from 'express';
import dotenv from 'dotenv';
import OrderRoute from './routes/OrderRoute.js';
import ProductRoute from './routes/ProductRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/api/orders', OrderRoute);
app.use('/api/products', ProductRoute);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
