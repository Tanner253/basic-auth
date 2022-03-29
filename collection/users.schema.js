// Create a Sequelize model
const bcrypt = require('bcrypt');

const UserModel = (sequelize, DataTypes) => {
    let users = sequelize.define("User", {
        username: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    );
    users.authenticateBasic = async function (username, password) {
      let user = await this.findOne({where:{username}});
      if(user){
        let validUser = await bcrypt.compare(password, user.password);
        if(validUser){
          return user;
        }
      }
    }
    return users;
  };

module.exports = UserModel;