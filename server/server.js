
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/mongodb');

require('dotenv/config')
//App config
const PORT= process.env.PORT || 4000;
const app = express();
 connectDB()
//intialize middleware
app.use(express.json());
app.use(cors());

//API routes
app.get('/', (req, res) => {
    res.send('Hello World!')
})
app.use('/api/user', require('./routes/userRoutes'));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})