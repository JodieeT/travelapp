const router = require('express').Router();
const auth = require('../middlewares/auth');
const role = require('../middlewares/role');
const controller = require('../controllers/admin.controller');

router.get('/hotels', auth, role('admin'), controller.getHotels);
router.post('/hotels/:id/approve', auth, role('admin'), controller.approveHotel);
router.post('/hotels/:id/reject', auth, role('admin'), controller.rejectHotel);
router.post('/hotels/:id/offline', auth, role('admin'), controller.offlineHotel);
router.post('/hotels/:id/restore', auth, role('admin'), controller.restoreHotel);

module.exports = router;
