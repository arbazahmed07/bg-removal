
// const express = require('express');
// const cors = require('cors');
// const connectDB = require('./config/mongodb');

// require('dotenv/config')
// //App config
// const PORT= process.env.PORT || 4000;
// const app = express();
//  connectDB()
// //intialize middleware
// app.use(express.json());
// app.use(cors());

// //API routes
// app.get('/', (req, res) => {
//     res.send('Hello World!')
// })
// app.use('/api/user', require('./routes/userRoutes'));
// app.use('/api/image', require('./routes/ImageRoutes'));
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// })

const express = require('express')
const cors = require('cors')
const connectDB = require('./config/mongodb')

require('dotenv/config')

// App config
const PORT = process.env.PORT || 4000
const app = express()
connectDB()

// Middleware
app.use(express.json())

// CORS Configuration
const corsOptions = {
  origin: 'https://bg-removal-l8g3.vercel.app/',
  methods: 'GET,POST,PUT,DELETE,OPTIONS',
  allowedHeaders: 'Content-Type,Authorization',
  credentials: true
}
app.use(cors(corsOptions))

// Handle Preflight Requests
app.options('*', cors(corsOptions))

// API routes
app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.use('/api/user', require('./routes/userRoutes'))
app.use('/api/image', require('./routes/ImageRoutes'))

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
