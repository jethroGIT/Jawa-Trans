const db = require('../models');
const Role = db.Role;

// Reusable helper
const findRoleOrFail = async (id) => {
    const role = await Role.findByPk(id);
    if (!role) {
        throw new Error('Role tidak ditemukan!');
    }
    return role;
};

const checkDuplicateRole = async (nama) => {
    const existingRole = await Role.findOne({
        where: { nama }
    });
    if (existingRole) {
        throw new Error('Role sudah ada!');
    }
    return true;
};


const getAllRoles = async () => {
    return await Role.findAll();
};

const getRoleById = async (id) => {
    const role = await findRoleOrFail(id);

    return role;
};

const createRole = async (nama) => {
    if (!nama || nama.trim() === '') {
        throw new Error('Nama role tidak boleh kosong.');
    }

    await checkDuplicateRole(nama);

    return await Role.create({ nama });
};

const updateRole = async (id, nama) => {
    const role = await findRoleOrFail(id);

    await checkDuplicateRole(nama);

    return await role.update({ nama });
};

const destroyRole = async (id) => {
    const role = await findRoleOrFail(id);

    return await role.destroy();
};

module.exports = {
    getAllRoles,
    getRoleById,
    createRole,
    updateRole,
    destroyRole
}