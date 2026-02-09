const employeeService = require('../services/employee.service');

const index = async (req, res) => {
    try {
        const employees = await employeeService.getAllEmployees();
        return res.status(200).json({
            success: true,
            data: employees
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getByMitra = async (req, res) => {
    const { idMitra } = req.params;
    try {
        const employees = await employeeService.getEmployeesByMitra(idMitra);
        return res.status(200).json({
            success: true,
            data: employees
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getAllAdmin = async (req, res) => {
    try {
        const admins = await employeeService.getAllAdmin();
        return res.status(200).json({
            success: true,
            data: admins
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
        const employee = await employeeService.getEmployeeById(id);
        return res.status(200).json({
            success: true,
            data: employee
        });
    } catch (error) {
        return res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

const store = async (req, res) => {
    const { idMitra, idRole, nama, nik, alamat, telephone, email, password } = req.body || {};
    try {
        const employee = await employeeService.createEmployee({ idMitra, idRole, nama, nik, alamat, telephone, email, password });
        return res.status(201).json({
            success: true,
            message: 'Employee berhasil ditambahkan.',
            data: employee
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const update = async (req, res) => {
    const { id } = req.params;
    const { idMitra, idRole, nama, nik, alamat, telephone, email, password, status } = req.body || {};
    try {
        const updatedEmployee = await employeeService.updateEmployee({ id, idMitra, idRole, nama, nik, alamat, telephone, email, password, status });
        return res.status(200).json({
            success: true,
            message: "Data employee berhasil diperbarui!",
            data: updatedEmployee
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
        await employeeService.deleteEmployee(id);
        return res.status(200).json({
            success: true,
            message: "Employee berhasil dihapus!"
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
    getByMitra,
    getAllAdmin,
    show,
    store,
    update,
    destroy
};
