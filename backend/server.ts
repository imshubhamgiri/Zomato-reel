import app from './src/app';
const PORT = process.env.PORT || 3000;
import { connectDB } from './src/db/db';

(async () => {
  await connectDB();
  
  app.listen(PORT, () => {
    console.log(`Server👻 is running on port ${PORT}`);
  });
})();