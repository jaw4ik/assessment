var co = require('co');
var dataManager = require('../data/dataManager');

co(dataManager.restoreFromBackups()).then(process.exit);