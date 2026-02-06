const router = require('express').Router();
const auth = require('../middlewares/auth');
const role = require('../middlewares/role');
const controller = require('../controllers/merchant.controller');

router.get('/hotels', auth, role('merchant'), controller.getMyHotels);
router.get('/hotels/:id', auth, role('merchant'), controller.getHotelById);
router.post('/hotels', auth, role('merchant'), controller.createHotel);
router.put('/hotels/:id', auth, role('merchant'), controller.updateHotel);
router.post('/hotels/:id/submit', auth, role('merchant'), controller.submitHotel);

module.exports = router;
