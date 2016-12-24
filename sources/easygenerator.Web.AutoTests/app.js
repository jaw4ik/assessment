var Launcher = require('./launcher');
var launcher = new Launcher({ reporters: ['spec']});
launcher.run();