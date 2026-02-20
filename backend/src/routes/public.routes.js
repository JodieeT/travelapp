const router = require('express').Router();
const controller = require('../controllers/public.controller');

router.get('/banners', controller.getBanners);
router.get('/hotels', controller.listHotels);
router.get('/hotels/:id', controller.getHotelDetail);
router.get('/prices/stream', controller.streamPrices);
router.get('/cities', controller.getCities);
router.get('/tags', controller.getTags);

module.exports = router;
