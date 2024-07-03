import express, { Application } from 'express';

import * as dotenv from 'dotenv';
import bodyParser from 'body-parser';
import productRoutes from './handler/productRoutes';
import userRoutes from './handler/userRoutes';
import orderRoutes from './handler/orderRoutes';
dotenv.config();
const PORT = process.env.PORT || 3000;
const app: Application = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

productRoutes(app);
userRoutes(app);
orderRoutes(app);

app.listen(PORT, async (): Promise<void> => {
  const url: string = `\x1b[2mhttp://localhost:${PORT}\x1b[0m`;
  console.log(`Please open ${url} to review the project`);
});
export default app;
