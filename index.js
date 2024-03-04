require('dotenv').config()
const express = require('express')
const cors = require('cors');
const connectToDB = require('./db');
const blogRoutes = require('./routes/blog');
const jobRoutes = require('./routes/job');
const authRoutes = require('./routes/login');
const app = express()
const port = process.env.PORT || 3000;
connectToDB();

app.use(express.json())
app.use(cors({
    origin: 'https://metamorph-ochre.vercel.app',
    accessControlAllowOrigin: 'https://metamorph-ochre.vercel.app',
    credentials: true,
    optionsSuccessStatus: 200
}));
app.use('/blog', blogRoutes);
app.use('/job', jobRoutes);
app.use('/admin', authRoutes);

app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`)) 