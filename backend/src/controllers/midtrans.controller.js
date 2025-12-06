const midtransService = require('../services/midtrans.service');

// Recurring
const handleRecurring = async (req, res) => {
    try {
        await midtransService.processRecurring(req.body);
        return res.status(200).json({ success: true });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Pay Account notification
const handlePayAccount = async (req, res) => {
    try {
        await midtransService.processPayAccount(req.body);
        return res.status(200).json({ success: true });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Redirect successful payment
const finishRedirect = async (req, res) => {
    return res.status(200).json({
        success: true,
        message: "Payment success"
    });
};

// Redirect unfinish payment
const unfinishRedirect = async (req, res) => {
    return res.status(200).json({
        success: false,
        message: "Payment not finished"
    });
};

// Redirect error payment
const errorRedirect = async (req, res) => {
    return res.status(400).json({
        success: false,
        message: "Payment error"
    });
};

const createTransaction = async (req, res) => {
    try {
        const { orderId, amount, customer, method } = req.body;

        const response = await midtransService.createPayment(orderId, amount, customer, method);

        return res.status(200).json({
            success: true,
            data: response
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Notifikasi pembayaran utama
const midtransCallback = async (req, res) => {
    try {
        const notif = req.body;
        console.log("🔥 Callback Received");
        const result = await midtransService.updatePaymentStatus(req.body);

        const io = req.app.get("io");
        // Broadcast ke frontend pakai channel unik berdasarkan order_id
        io.emit(`payment_status_${notif.order_id}`, {
            order_id: notif.order_id,
            status: notif.transaction_status
        });
        
        return res.status(200).json({
            success: true,
            message: "Callback processed",
            data: result
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports = {
    handleRecurring,
    handlePayAccount,
    finishRedirect,
    unfinishRedirect,
    errorRedirect,
    createTransaction,
    midtransCallback
};
