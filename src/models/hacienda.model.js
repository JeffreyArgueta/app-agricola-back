import { DataTypes } from '../config/database.js';
import sequelize from '../config/database.js';

export const Hacienda = sequelize.define(
  'Hacienda',
  {
    idHacienda: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      field: 'id_hacienda',
    },
    nombre: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
    },
    ubicacion: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    estatus: {
      type: DataTypes.ENUM('Activo', 'Inactivo'),
      allowNull: false,
      defaultValue: 'Activo',
    },
  },
  {
    tableName: 'haciendas',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci',
  },
);

export default Hacienda;
