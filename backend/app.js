const express = require('express');
const cors = require('cors');

const connectDB = require('./config/db');
require('./models/User');
require('./models/Profile');
require('./models/Post');

connectDB();
const app = express();

app.use(express.json({ extended: false }));
app.use(cors());

app.use('/api/v1/users', require('./routes/users'));
app.use('/api/v1/auth', require('./routes/auth'));
app.use('/api/v1/profiles', require('./routes/profile'));
app.use('/api/v1/posts', require('./routes/posts'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  // eslint-disable-next-line no-unused-expressions
  console.log(`Server listening on port ${PORT}`);
});
