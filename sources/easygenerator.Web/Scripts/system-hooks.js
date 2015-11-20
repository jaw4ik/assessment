﻿(function () {

    window.define = System.amdDefine;
    window.require = window.requirejs = System.amdRequire;

    // hooks for durandal support
    var moduleIds = [];

    var systemNormalize = System.normalize;
    System.normalize = function (moduleName) {
        return systemNormalize.apply(this, arguments).then(function (normalizedName) {
            moduleIds[normalizedName] = moduleName;
            return normalizedName;
        });
    };

    var systemImport = System.import;
    System.import = function (moduleName) {
        return systemImport.apply(this, arguments).then(function (module) {
            module.__moduleId__ = moduleName;
            return module;
        });
    };

    var systemReduceRegister = System.reduceRegister_;
    System.reduceRegister_ = function (metadata, module) {
        if (module.entry.execute) {
            var moduleName = module.entry.name ? module.entry.name : metadata.name;
            var defaultExecute = module.entry.execute;
            module.entry.execute = function () {
                var module = defaultExecute.apply(this, arguments);
                if (module && moduleIds[moduleName]) {
                    module.__moduleId__ = moduleIds[moduleName];
                }
                return module;
            };
        }
        return systemReduceRegister.apply(this, arguments);
    };

    // for disable caching
    var systemLocate = System.locate;
    System.locate = function () {
        return systemLocate.apply(this, arguments).then(function(address) {
            return address + System.cacheBust;
        });
    }

})();