const express = require('express');
const router = express.Router();
const roleController = require('../controllers/role.controller');
const customerController = require('../controllers/customer.controller');
const employeeController = require('../controllers/employee.controller');
const authController = require('../controllers/auth.controller');
const uploadLogoMitra = require('../config/multerMitra');
const mitraController = require('../controllers/mitra.controller');
const terminalController = require('../controllers/terminal.controller');
const fasilitasController = require('../controllers/fasilitas.controller');
const multerErrorHandler = require('../middlewares/multerErrorHandler');
const uploadFotoBus = require('../config/multerBus');
const busController = require('../controllers/bus.controller');
const jadwalController = require('../controllers/jadwal.controller');
const reservasiController = require('../controllers/reservasi.controller');
const kursiController = require('../controllers/kursi.controller');
const midtransController = require('../controllers/midtrans.controller');
const tipeBusController = require('../controllers/tipeBus.controller');
const daftarPenumpangController = require('../controllers/daftarPenumpang.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

router.get('/', (req, res) => {
  res.render('index', { title: 'Hello EJS' });
});

// Authentication routes - Customer
router.post('/auth/customer/register', authController.registerCustomer);
router.post('/auth/customer/login', authController.loginCustomer);

// Authentication routes - Employee (admin, staff, keuangan)
router.post('/auth/employee/login', authController.loginEmployee);
// Authentication routes - Super Admin
router.post('/auth/superadmin/login', authController.loginSuperAdmin);

// Logout (same for both)
router.post('/auth/logout', authController.logout);

// Legacy routes (backward compatibility) - akan dihapus nanti
router.post('/register', authController.registerCustomer);
router.post('/login', authController.loginCustomer);

// versi menggunakan idRole
// router.get('/roles', authenticate, authorize([1, 5]), roleController.getAllRoles);
// versi menggunakan nama role
router.use('/roles', authenticate);
router.route('/roles')
  .get(roleController.getAllRoles)
  .post(roleController.store);

router.route('/roles/:id')
  .get(roleController.show)
  .put(roleController.update)
  .delete(roleController.destroy);

// CUSTOMER ROUTES
router.use('/customers', authenticate);
router.route('/customers')
  // .all(authorize(['admin']))
  .get(customerController.index) // List all customers

router.route('/customers/:id')
  .get(customerController.show)
  .put(customerController.update)
  .delete(customerController.destroy);

// EMPLOYEE ROUTES
router.use('/employees', authenticate);
router.route('/employees')
  // .all(authorize(['admin']))
  .get(employeeController.index)
  .post(employeeController.store);

router.get('/employees/admins', authenticate, authorize(['admin']), employeeController.getAllAdmin);

router.route('/employees/mitra/:idMitra')
  .get(authorize(['admin']), employeeController.getByMitra);

router.route('/employees/:id')
  .all(authorize(['admin']))
  .get(employeeController.show)
  .put(employeeController.update)
  .delete(employeeController.destroy);

router.use('/mitra', authenticate);
router.route('/mitra')
  .get(mitraController.gettAllMitra)
  .post(uploadLogoMitra.single('logo'), mitraController.store)

router.route('/mitra/:id', authenticate)
  .get(mitraController.show)
  .put(uploadLogoMitra.single('logo'), mitraController.update)
  .delete(mitraController.destroy)

// router.use('/terminal')
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

router.get('/mitra/:idMitra/tipebus', tipeBusController.getTipeByMitra);
router.get('/tipebus', tipeBusController.getAllTipe);
router.get('/tipeBus/:id', tipeBusController.show);
router.post('/tipeBus', uploadFotoBus.array('fotos', 5), multerErrorHandler, tipeBusController.store);
router.put('/tipeBus/:id', uploadFotoBus.array('fotos', 5), multerErrorHandler, tipeBusController.update);
router.delete('/tipeBus/:id', tipeBusController.destroy);

router.get('/mitra/:idMitra/jadwal', jadwalController.getJadwalByMitra);
router.get('/jadwal', jadwalController.getAllJadwal);
router.get('/jadwal/:id', jadwalController.show);
router.get('/jadwal/:id/reservasi', jadwalController.getJadwalWithReservasi);
router.post('/jadwal', jadwalController.store);
router.put('/jadwal/:id', jadwalController.update);
router.delete('/jadwal/:id', jadwalController.destroy);

router.get('/mitra/:idMitra/keuangan', reservasiController.getReservasiByMitra);
router.get('/mitra/keuangan/:idJadwal', reservasiController.getJumlahReservasiPerStatus);

router.get('/mitra/:idMitra/reservasi', reservasiController.getReservasiByMitra);
router.get('/reservasi', reservasiController.getAllReservasi);
router.get('/reservasi/:id', reservasiController.show);
router.post('/reservasi', reservasiController.store);
router.put('/reservasi/:id', reservasiController.update);
router.delete('/reservasi/:id', reservasiController.destroy);
router.get('/reservasi/user/:id', reservasiController.getReservasiByUser);

router.get('/tipe/:idTipe/bus', busController.getBusByTipe);
router.get('/bus/:idBus/kursi', kursiController.getKursiByIdBus);
router.get('/bus/:idBus/kursi/:idKursi', kursiController.show);
router.post('/bus/:idBus/kursi', kursiController.store);
router.put('/bus/:idBus/kursi/:idKursi', kursiController.update);
router.delete('/bus/:idBus/kursi/:idKursi', kursiController.destroy);
router.get('/kursi', kursiController.getAllKursi);

router.get('/mitra/:idMitra/daftarpenumpang', jadwalController.getJadwalByMitra);
router.get('/daftarpenumpang/:id', daftarPenumpangController.getDaftarPenumpangById);

//opsional
router.post('/midtrans/recurring', midtransController.handleRecurring);
router.post('/midtrans/pay-account', midtransController.handlePayAccount);

//opsional
router.get('/payment/finish', midtransController.finishRedirect);
router.get('/payment/unfinish', midtransController.unfinishRedirect);
router.get('/payment/error', midtransController.errorRedirect);

router.post('/midtrans/create', midtransController.createTransaction);
router.post('/midtrans/callback', midtransController.midtransCallback);

// gabungan reservasi dan payment
router.post('/reservasi/pay', reservasiController.storeAndPay);

module.exports = router;
