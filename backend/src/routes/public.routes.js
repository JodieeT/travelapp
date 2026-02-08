const router = require('express').Router();
const controller = require('../controllers/public.controller');

router.get('/banners', controller.getBanners);
router.get('/hotels', controller.listHotels);
router.get('/hotels/:id', controller.getHotelDetail);
router.get('/prices/stream', controller.streamPrices);

module.exports = router;
