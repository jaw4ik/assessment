import viewEngine from 'durandal/viewEngine';
import system from 'durandal/system';

viewEngine.convertViewIdToRequirePath = function (viewId) {
    var plugin = this.viewPlugin ? '!' + this.viewPlugin : '';
    return viewId + this.viewExtension + plugin;
};

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
        system.setModuleId(module, moduleName);
        return module;
    });
};

var systemReduceRegister = System.reduceRegister_;
System.reduceRegister_ = function (metadata, module) {
    if (moduleIds[metadata.address]) {
        var defaultExecute = module.entry.execute;
        module.entry.execute = function () {
            var module = defaultExecute.apply(this, arguments);
            system.setModuleId(module, moduleIds[metadata.address]);
            return module;
        };
    }
    return systemReduceRegister.apply(this, arguments);
};

window.define = System.amdDefine;
window.require = window.requirejs = System.amdRequire;

export * from 'main';