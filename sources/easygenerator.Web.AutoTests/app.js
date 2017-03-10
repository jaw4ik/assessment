'use strict';

require('dotenv').config();
var Launcher = require('./launcher');

var launcher = new Launcher();
module.exports = launcher.run(process.env.continue || false);