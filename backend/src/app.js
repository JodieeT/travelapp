const path = require('path');
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const imgDir = path.join(__dirname, '..', 'img');
app.use('/img', express.static(imgDir));

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/upload', require('./routes/upload.routes'));
app.use('/api', require('./routes/public.routes'));
app.use('/api/merchant', require('./routes/merchant.routes'));
app.use('/api/admin', require('./routes/admin.routes'));

module.exports = app;