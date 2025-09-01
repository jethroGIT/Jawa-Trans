const express = require('express');
const router = express.Router();
const roleController = require('../controllers/role.controller');
const userController = require('../controllers/user.controller');
const authController = require('../controllers/auth.controller');
const mitraController = require('../controllers/mitra.controller');
const terminalController = require('../controllers/terminal.controller');
const fasilitasController = require('../controllers/fasilitas.controller');
const busController = require('../controllers/bus.controller');
const methodPaymentController = require('../controllers/methodPayment.controller');
const jadwalController = require('../controllers/jadwal.controller');
const reservasiController = require('../controllers/reservasi.controller');
const paymentController = require('../controllers/payment.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

router.get('/', (req, res) => {
  res.render('index', { title: 'Hello EJS' });
});


router.get('/login', (req, res) => {
  res.render('login');
});
router.post('/login', authController.login);
router.post('/logout', authController.logout);

// versi menggunakan idRole
// router.get('/roles', authenticate, authorize([1, 5]), roleController.getAllRoles);
// versi menggunakan nama role
router.get('/roles', authenticate, authorize(['admin', 'mitra']), roleController.getAllRoles);
router.get('/roles/:id', roleController.show);
router.post('/roles', roleController.store);
router.put('/roles/:id', roleController.update);
router.delete('/roles/:id', roleController.destroy);

router.get('/users', userController.allUsers);
router.get('/users/:id', userController.show);
router.post('/users', userController.store);
router.put('/users/:id', userController.update);
router.delete('/users/:id', userController.destroy);

router.get('/mitra', mitraController.gettAllMitra);
router.get('/mitra/:id', mitraController.show);
router.post('/mitra', mitraController.store);
router.put('/mitra/:id', mitraController.update);
router.delete('/mitra/:id', mitraController.destroy);

router.get('/terminal', terminalController.getAllTerminal);
router.get('/terminal/:id', terminalController.show);
router.post('/terminal', terminalController.store);
router.put('/terminal/:id', terminalController.update);
router.delete('/terminal/:id', terminalController.destroy);

router.get('/fasilitas', fasilitasController.getAllFasilitas);
router.get('/fasilitas/:id', fasilitasController.show);
router.post('/fasilitas', fasilitasController.store);
router.put('/fasilitas/:id', fasilitasController.update);
router.delete('/fasilitas/:id', fasilitasController.destroy);

router.get('/bus', busController.getAllBus);
router.get('/bus/:id', busController.show);
router.post('/bus', busController.store);
router.put('/bus/:id', busController.update);
router.delete('/bus/:id', busController.destroy);

router.get('/methodpayment', methodPaymentController.getAllMethodPayment);
router.get('/methodpayment/:id', methodPaymentController.show);
router.post('/methodpayment', methodPaymentController.store);
router.put('/methodpayment/:id', methodPaymentController.update);
router.delete('/methodpayment/:id', methodPaymentController.destroy);

router.get('/jadwal', jadwalController.getAllJadwal);
router.get('/jadwal/:id', jadwalController.show);
router.post('/jadwal', jadwalController.store);
router.put('/jadwal/:id', jadwalController.update);
router.delete('/jadwal/:id', jadwalController.destroy);

router.get('/reservasi', reservasiController.getAllReservasi);
router.get('/reservasi/:id', reservasiController.show);
router.post('/reservasi', reservasiController.store);
router.put('/reservasi/:id', reservasiController.update);
router.delete('/reservasi/:id', reservasiController.destroy);

router.get('/payment', paymentController.getAllPayment);
router.get('/payment/:id', paymentController.show);
router.post('/payment', paymentController.store);
router.put('/payment/:id', paymentController.update);
router.delete('/payment/:id', paymentController.destroy);

module.exports = router;
