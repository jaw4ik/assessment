import viewEngine from 'durandal/viewEngine';
import system from 'durandal/system';

debugger;
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

import $ from 'jquery';
import viewLocator from 'durandal/viewLocator';

//system.js
/*var acquire = system.acquire;
system.acquire = function(moduleIdOrModule) {
    var moduleType = typeof moduleIdOrModule;

    if(moduleType !== 'string') {
        debugger;
        return system.defer(function(dfd) {
            // If the moduleId is a funcction...
            if(moduleIdOrModule instanceof Function) {
                // Execute the funcction, passing a callback that should be 
                // called when the (possibly) async operation is finished
                var result = moduleIdOrModule(function(err, module) {
                    if(err) { dfd.reject(err); }
                    dfd.resolve(module);
                });

                // Also allow shorthand `return` from the funcction, which 
                // resolves the Promise with whatever was immediately returned
                if(result !== undefined) {
                    dfd.resolve(result);
                }
            }

            // If the moduleId is actually an object, simply resolve with it
            else {
                dfd.resolve(moduleIdOrModule);
            }
        });
    }

    // super()
    return acquire.apply(this, arguments);
};

//viewLocator.js
// Allow using `function` or bare HTML string as a view
var locateView = viewLocator.locateView;
viewLocator.locateView = function(viewOrUrlOrId, area, elementsToSearch) {
    var viewId;
    
    // HTML here will be passed into `processMarkup`
    if('string' === typeof viewOrUrlOrId && $.trim(viewOrUrlOrId).charAt(0) === '<') {
        return system.defer(function(dfd) {
            dfd.resolve(viewOrUrlOrId);
        });
    }

    // super()
    return locateView.apply(this, arguments);
};*/

window.define = System.amdDefine;
window.require = window.requirejs = System.amdRequire;

export * from 'main';
