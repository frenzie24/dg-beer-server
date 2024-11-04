const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = require('../config/connection');

class User extends Model {
  // hash that pass
  checkPassword(loginPw) {
    return bcrypt.compareSync(loginPw, this.password);
  }
}

// The user model contains an id, first_name, last_name, email, password, etc.
/*
  Each User's id is used to tie rows in the Collection table to the user
  Password is hashed for user security
*/
User.init(
  {
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [8],
      },
    },
    school_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    professor_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    last_login: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    first_game_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    latest_game_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    hooks: {
      beforeCreate: async (newUserData) => {
        newUserData.password = await bcrypt.hash(newUserData.password, 10);
        return newUserData;
      },
      beforeUpdate: async (updatedUserData) => {
        updatedUserData.password = await bcrypt.hash(updatedUserData.password, 10);
        return updatedUserData;
      },
    },
    sequelize,
    timestamps: true,
    freezeTableName: true,
    underscored: true,
    modelName: 'User',
  }
);

module.exports = User;
