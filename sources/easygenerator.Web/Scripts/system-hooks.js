(function () {

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

    var systemReduceRegister = System.reduceRegister_;
    System.reduceRegister_ = function (metadata, module) {
        var moduleName = module.entry.name ? module.entry.name : metadata.name;

        // __moduleId__ declaration for AMD modules
        if (module.amd && module.entry.execute) {
            var defaultExecute = module.entry.execute;
            module.entry.execute = function () {
                var module = defaultExecute.apply(this, arguments);
                if (module && moduleIds[moduleName]) {
                    setModuleId(module, moduleIds[moduleName]);
                }
                return module;
            };
        }
        // __moduleId__ declaration for EMS modules
        else if (module.entry.declarative && module.entry.declare) {
            var defaultDeclare = module.entry.declare;
            module.entry.declare = function () {
                var declaration = defaultDeclare.apply(this, arguments);

                var exports = getModuleExports(module);
                if (exports && moduleIds[moduleName]) {
                    var defaultExecute = declaration.execute;
                    declaration.execute = function () {
                        defaultExecute.apply(this, arguments);

                        exports.__useDefault = true;
                        setModuleId(exports.default ? exports.default : exports, moduleIds[moduleName]);
                    };
                }

                return declaration;

                function getModuleExports(module) {
                    return (module.entry.module && module.entry.module.exports) 
                        ? module.entry.module.exports : null;
                }
            };
        }

        return systemReduceRegister.apply(this, arguments);
    };

    // durandal's system function
    function setModuleId(obj, id) {
        if (!obj) {
            return;
        }
        if (typeof obj == 'function' && obj.prototype) {
            obj.prototype.__moduleId__ = id;
            return;
        }
        if (typeof obj == 'string') {
            return;
        }
        obj.__moduleId__ = id;
    }

    // for disable caching
    var systemLocate = System.locate;
    System.locate = function () {
        return systemLocate.apply(this, arguments).then(function (address) {
            return address + System.cacheBust;
        });
    }

})();