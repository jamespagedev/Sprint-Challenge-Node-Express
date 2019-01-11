const express = require('express');
const server = express();

/***************************************************************************************************
 ******************************************** middleware *******************************************
 **************************************************************************************************/

/***************************************************************************************************
 ********************************************** routes *********************************************
 **************************************************************************************************/
server.get('/', (req, res) => {
  res.send(`Server is running...`);
});

/***************************************************************************************************
 ********************************************* export(s) *******************************************
 **************************************************************************************************/
module.exports = server;
