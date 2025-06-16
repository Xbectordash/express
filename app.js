import express from 'express';
import { initDatabase } from './src/databaseModel/initdatabase.js';
import {
  mainRouter
} from './src/routers/user_Router/user.routes.js'; 
const app = express();
await initDatabase()
  .then(() => console.log('✅ Database initialized successfully.'))
  .catch(err => console.error('❌ Database initialization failed:', err.message));
app.use(express.json());
app.use('/', mainRouter);

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
}
);
