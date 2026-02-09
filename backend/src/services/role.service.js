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

const checkDuplicateRole = async (nama, excludeId = null) => {
    const where = { nama };

    // If updating, exclude the current role ID from duplicate check
    if (excludeId) {
        where.idRole = { [db.Sequelize.Op.ne]: excludeId };
    }

    const existingRole = await Role.findOne({ where });
    if (existingRole) {
        throw new Error('Role dengan nama tersebut sudah ada!');
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

const createRole = async (nama, guard_name = 'web') => {
    if (!nama || nama.trim() === '') {
        throw new Error('Nama role tidak boleh kosong.');
    }

    await checkDuplicateRole(nama);

    return await Role.create({
        nama: nama.trim(),
        guard_name: guard_name.trim() || 'web'
    });
};

const updateRole = async (id, nama, guard_name = 'web') => {
    const role = await findRoleOrFail(id);

    if (!nama || nama.trim() === '') {
        throw new Error('Nama role tidak boleh kosong.');
    }

    await checkDuplicateRole(nama, id);

    return await role.update({
        nama: nama.trim(),
        guard_name: guard_name.trim() || 'web'
    });
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