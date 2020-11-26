const express = require('express');
const cors = require('cors');

const connectDB = require('./config/db');
require('./models/User');

connectDB();
const app = express();

app.use(express.json({ extended: false }));
app.use(cors());

app.use('/api/v1/users', require('./routes/users'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  // eslint-disable-next-line no-unused-expressions
  `Server listening on port ${PORT}`;
});
