const path = require('path');
const express = require('express');
const app = express();

app.use(express.json());

const uploadsDir = path.join(__dirname, '..', 'uploads');
app.use('/uploads', express.static(uploadsDir));

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/upload', require('./routes/upload.routes'));
app.use('/api', require('./routes/public.routes'));
app.use('/api/merchant', require('./routes/merchant.routes'));
app.use('/api/admin', require('./routes/admin.routes'));

module.exports = app;