var co = require('co');
var dataManager = require('../data/dataManager');

co(dataManager.updateBackups()).then(process.exit);