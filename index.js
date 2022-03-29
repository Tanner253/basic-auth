'use strict';
const { sequelize, UserModel} = require('./collection');
const { start } = require('./server/server.js');
const PORT = process.env.PORT || 3000;


// make sure our tables are created, start up the HTTP server.
sequelize.sync()
.then( () => {
  console.log('database is synced and ready to go');
  // UserModel.create({password: "superpass", username: "osknyo"})
  start(PORT);
}).catch(e => {
    console.error('Could not start server', e.message);
});
