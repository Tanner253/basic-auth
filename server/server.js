'use strict';

const express = require('express');
const { authRouter, basic } = require('./auth/auth.js');
const cors = require('cors');
const app = express();
// Process FORM intput and put the data on req.body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors);
//routers go here
app.use(authRouter);

module.exports = {
  app,
  start: (PORT) => {
    app.listen(PORT, () => {
      console.log(`app is running on PORT: ${PORT}`);
    })
  }
}
