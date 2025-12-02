const app = require('./src/app');
const connectdb = require('./src/db/db');
const cors = require('cors');
require('dotenv').config();
connectdb();
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
// ess = require('express');