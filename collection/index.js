'use strict';
const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();
const userSchema = require('./users.schema.js');
const ICollection = require('./lib/ICollection.js')

const DATABASE_URL = process.env.NODE_ENV === 'test' ? 'sqlite::memory' : process.env.DATABASE_URL || 'postgresql://localhost:5432/basic-auth'
console.log(DATABASE_URL, process.env.NODE_ENV)


//disable if need to seed locally!
const sequelize = new Sequelize(DATABASE_URL, {
  // dialectOptions:{
  //   ssl:{
  //     require:true,
  //     rejectUnauthorized: false,
  //   },
  // },
});

const UserModel = userSchema(sequelize, DataTypes);



module.exports = {
  sequelize,
  UserModel
}