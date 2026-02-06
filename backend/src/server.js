require('dotenv').config();
const app = require('./app');
const { sequelize } = require('./models');

(async () => {
    await sequelize.sync();
    app.listen(3000, () => {
        console.log('Backend running at http://localhost:3000');
    });
})();