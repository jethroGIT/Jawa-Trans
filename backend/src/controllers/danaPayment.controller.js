const { Dana } = require('dana-node');
const danaConfig = require('../config/dana.config');

const danaClient = new Dana(danaConfig);
console.log('✅ DANA Client initialized');
console.log('Dana client keys:', Object.keys(danaClient));
console.log('Dana client prototype methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(danaClient)));

exports.createPayment = async (req, res) => {
    try {
        const { amount, title, userId, reservasiId } = req.body;

        if (!amount || !title) {
            return res.status(400).json({
                success: false,
                message: 'Amount and title are required',
            });
        }

        const merchantTransId = `JAWA-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        const createOrderRequest = {
            merchantTransId: merchantTransId,
            merchantTransType: 'SINGLE_PAYMENT',
            orderAmount: {
                value: amount.toString(),
                currency: 'IDR',
            },
            orderTitle: title,
            productCode: 'CASHIER',
            notificationUrl: `${process.env.ORIGIN}/api/dana/payment/webhook`,
            returnUrl: `${process.env.FRONTEND_URL}/payment/result?orderId=${merchantTransId}`,
        };

        console.log('[DEBUG] createOrderRequest', createOrderRequest);
        const response = await danaClient.paymentGatewayApi.createOrder(createOrderRequest);
        return res.status(201).json({
            success: true,
            message: 'DANA payment created (via paymentGatewayApi)',
            data: {
                orderId: merchantTransId,
                danaResponse: response,
                paymentUrl: response?.cashierUrl || response?.redirectUrl || null,
            },
        });
    } catch (error) {
        console.error('createPayment error:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Failed to create DANA payment',
            danaError: error.response?.data || null,
            error: process.env.NODE_ENV === 'development' ? error.stack : undefined,
        });
    }
};


exports.checkPaymentStatus = async (req, res) => {
    try {
        const { orderId } = req.params;

        const queryReq = { merchantTransId: orderId };

        let response;
        if (typeof danaClient.queryPayment === 'function') {
            response = await danaClient.queryPayment(queryReq);
        } else if (danaClient.paymentGatewayApi && typeof danaClient.paymentGatewayApi.queryPayment === 'function') {
            response = await danaClient.paymentGatewayApi.queryPayment(queryReq);
        } else {
            return res.status(500).json({
                success: false,
                message: 'DANA client does not expose queryPayment method.',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'DANA payment status fetched',
            data: response,
        });
    } catch (error) {
        console.error('checkPaymentStatus error:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Failed to query DANA payment status',
        });
    }
};


exports.handleWebhook = async (req, res) => {
    try {
        const notification = req.body;

        // TODO: verifikasi signature kalau disyaratkan SDK / dokumen
        // TODO: parse extendInfo untuk ambil userId & reservasiId

        // Contoh pseudo:
        // const metadata = JSON.parse(notification.extendInfo || '{}');
        // const { reservasiId } = metadata;
        // update DB: payment + reservasi status

        res.status(200).json({ result: 'OK' });
    } catch (error) {
        console.error('handleWebhook error:', error);
        res.status(500).json({ success: false });
    }
};

exports.refundPayment = async (req, res) => {
    try {
        const { orderId, amount, reason } = req.body;

        const refundReq = {
            merchantTransId: orderId,
            refundAmount: {
                value: amount.toString(),
                currency: 'IDR',
            },
            refundReason: reason || 'Refund by merchant',
        };

        const response = await danaClient.paymentGateway.refundOrder(refundReq);

        return res.status(200).json({
            success: true,
            message: 'Refund request sent to DANA',
            data: response,
        });
    } catch (error) {
        console.error('refundPayment error:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Failed to refund payment',
        });
    }
};
