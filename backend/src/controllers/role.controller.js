const roleService = require('../services/roleService');

const getAllRoles = async (req, res) => {
  try {
    const role = await roleService.getAllRoles();
    return res.status(200).json({
      success: true,
      data: role
    });
  } catch (error) {
    return res.status(500), json({
      success: false,
      message: error.message
    })
  }
};

const show = async (req, res) => {
  const { id } = req.params;
  try {
    const role = await roleService.getRoleById(id);
    return res.status(200).json({
      success: true,
      data: role
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message
    });
  };
};

const store = async (req, res) => {
  try {
    const role = await roleService.createRole(req.body.nama);
    return res.status(201).json({
      success: true,
      message: 'Role berhasil ditambahkan.',
      data: role
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  };
};

const update = async (req, res) => {
  const { id } = req.params;
  const { nama } = req.body
  try {
    const updateRole = await roleService.updateRole(id, nama);
    return res.status(200).json({
      success: true,
      message: 'Role berhasil diperbarui!',
      data: updateRole
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    })
  };
};

const destroy = async (req, res) => {
  const { id } = req.params;
  try {
    const destroyRole = await roleService.destroyRole(id)
    return res.status(200).json({
      success: true,
      message: 'Role berhasil dihapus!',
      data: destroyRole
    });
  } catch (error) {
    return res.status(400).json({
      success: true,
      message: error.message,
    })
  };
};

module.exports = {
  getAllRoles,
  show,
  store,
  update,
  destroy
}