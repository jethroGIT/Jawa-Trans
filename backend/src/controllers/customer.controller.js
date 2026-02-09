const customerService = require('../services/customer.service');

const index = async (req, res) => {
    try {
        const customers = await customerService.getAllCustomers();
        return res.status(200).json({
            success: true,
            data: customers
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const show = async (req, res) => {
    const { id } = req.params;
    try {
        const customer = await customerService.getCustomerById(id);
        return res.status(200).json({
            success: true,
            data: customer
        });
    } catch (error) {
        return res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

const update = async (req, res) => {
    const { id } = req.params;
    const { nama, alamat, telephone, email, password } = req.body || {};
    try {
        const updatedCustomer = await customerService.updateCustomer({ id, nama, alamat, telephone, email, password });
        return res.status(200).json({
            success: true,
            message: "Data customer berhasil diperbarui!",
            data: updatedCustomer
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const destroy = async (req, res) => {
    const { id } = req.params;
    try {
        await customerService.deleteCustomer(id);
        return res.status(200).json({
            success: true,
            message: "Customer berhasil dihapus!"
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    index,
    show,
    update,
    destroy
};
