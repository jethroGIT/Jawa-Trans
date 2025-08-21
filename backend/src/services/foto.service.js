const db = require('../models');
const Foto_Bus = db.Foto_Bus;
const Bus = db.Bus;

const findFotoBusOrFail = async (idBus) => {
    const bus = await Bus.findByPk(idBus);

    if (!bus) {
        throw new Error('Bus tidak ditemukan');
    }

    return await Foto_Bus.findAll({
        where: { idBus: idBus }
    });
};

const checkDuplicate = async (nama, id = null) => {
    const existingFoto = await Foto_Bus.findByPk(id)

    if (existingFoto && existingFoto.idFoto_Bus != id) {
        throw new Error('Nama foto sudah digunakan')
    }

    return true
};

const getAllFoto = async() => {
    return Foto_Bus.findAll();
};

const getFotoByIdBus = async (idBus) => {
    return await findFotoBusOrFail(idBus);
};

const createFotoBus = async (nama) => {
    return await Foto_Bus.create({nama});
}; 

const updateFotoBus = async ({ id, idBus, nama }) => {
    findFotoBusOrFail(idBus);
    
    return await Foto_Bus.update({nama});
};

const destroyFotoBus = async (nama) => {
    return await Foto_Bus.destroy()
};
