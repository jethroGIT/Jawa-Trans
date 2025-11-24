const { DataTypes } = require('sequelize');

let Terminal; // Inisialisasi variabel model

const defineTerminalModel = (sequelize) => {
    Terminal = sequelize.define('Terminal', {
        idTerminal: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        kota: {
            type: DataTypes.STRING(45),
            allowNull: true
        },
        nama: {
            type: DataTypes.STRING(45),
            allowNull: true
        }
    }, {
        tableName: 'Terminal',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });

    return Terminal;
};

module.exports = defineTerminalModel;