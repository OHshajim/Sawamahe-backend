const express = require("express");
const { getAllUsers } = require("../controllers/adminController");
const { adminOnly } = require("../middleware/AdminMiddlewere");

const router = express.Router();

// router.get("/admin/users/all", adminOnly, getAllUsers);
router.get("/users/all", getAllUsers);

// router.get('/admin/contact/all/:id/:email', adminOnly, require('./getAllContact'));
// router.get('/admin/paygic/get/:id/:email', adminOnly, require('./getPaygic'));
// router.put('/admin/paygic/set/:id/:email', adminOnly, require('./setPaygic'));
// router.put('/admin/razorpay/set/:id/:email', adminOnly, require('./setRazorpay'));
// router.post('/admin/credit/:id/:email', adminOnly, require('./credit'));
// router.get('/admin/withdrawal/all/:id/:email', adminOnly, require('./all-withdrawal-request'));
// router.get('/admin/withdrawal/single/:id/:email/:withdrawalId', adminOnly, require('./getSingleWithdrawalData'));
// router.post('/admin/withdrawal/update/:id/:email/:withdrawalId', adminOnly, require('./approvedWithdrawal'));
// router.put('/admin/website/set/:id/:email', adminOnly, require('./set-commission'));
// router.post('/admin/withdrawal/send/:id/:email/:withdrawalId', adminOnly, require('./sendPayment'));

module.exports = router;
