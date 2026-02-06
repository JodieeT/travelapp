const express = require('express');
const app = express();

app.use(express.json());

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api', require('./routes/public.routes'));
app.use('/api/merchant', require('./routes/merchant.routes'));
app.use('/api/admin', require('./routes/admin.routes'));

module.exports = app;