"bundle";
System.registerDynamic("libs/jquery.js", [], true, function(req, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  module.exports = jQuery;
  global.define = __define;
  return module.exports;
});

(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("libs/durandal/system.js", ["require", "libs/jquery.js"], function(require, $) {
  var isDebugging = false,
      nativeKeys = Object.keys,
      hasOwnProperty = Object.prototype.hasOwnProperty,
      toString = Object.prototype.toString,
      system,
      treatAsIE8 = false,
      nativeIsArray = Array.isArray,
      slice = Array.prototype.slice;
  if (!String.prototype.trim) {
    String.prototype.trim = function() {
      return this.replace(/^\s+|\s+$/g, '');
    };
  }
  if (Function.prototype.bind && (typeof console === 'object' || typeof console === 'function') && typeof console.log == 'object') {
    try {
      ['log', 'info', 'warn', 'error', 'assert', 'dir', 'clear', 'profile', 'profileEnd'].forEach(function(method) {
        console[method] = this.call(console[method], console);
      }, Function.prototype.bind);
    } catch (ex) {
      treatAsIE8 = true;
    }
  }
  if (require.on) {
    require.on("moduleLoaded", function(module, mid) {
      system.setModuleId(module, mid);
    });
  }
  if (typeof requirejs !== 'undefined') {
    requirejs.onResourceLoad = function(context, map, depArray) {
      system.setModuleId(context.defined[map.id], map.id);
    };
  }
  var noop = function() {};
  var log = function() {
    try {
      if (typeof console != 'undefined' && typeof console.log == 'function') {
        if (window.opera) {
          var i = 0;
          while (i < arguments.length) {
            console.log('Item ' + (i + 1) + ': ' + arguments[i]);
            i++;
          }
        } else if ((slice.call(arguments)).length == 1 && typeof slice.call(arguments)[0] == 'string') {
          console.log((slice.call(arguments)).toString());
        } else {
          console.log.apply(console, slice.call(arguments));
        }
      } else if ((!Function.prototype.bind || treatAsIE8) && typeof console != 'undefined' && typeof console.log == 'object') {
        Function.prototype.call.call(console.log, console, slice.call(arguments));
      }
    } catch (ignore) {}
  };
  var logError = function(error, err) {
    var exception;
    if (error instanceof Error) {
      exception = error;
    } else {
      exception = new Error(error);
    }
    exception.innerError = err;
    try {
      if (typeof console != 'undefined' && typeof console.error == 'function') {
        console.error(exception);
      } else if ((!Function.prototype.bind || treatAsIE8) && typeof console != 'undefined' && typeof console.error == 'object') {
        Function.prototype.call.call(console.error, console, exception);
      }
    } catch (ignore) {}
    throw exception;
  };
  system = {
    version: "2.1.0",
    noop: noop,
    getModuleId: function(obj) {
      if (!obj) {
        return null;
      }
      if (typeof obj == 'function' && obj.prototype) {
        return obj.prototype.__moduleId__;
      }
      if (typeof obj == 'string') {
        return null;
      }
      return obj.__moduleId__;
    },
    setModuleId: function(obj, id) {
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
    },
    resolveObject: function(module) {
      if (system.isFunction(module)) {
        return new module();
      } else {
        return module;
      }
    },
    debug: function(enable) {
      if (arguments.length == 1) {
        isDebugging = enable;
        if (isDebugging) {
          this.log = log;
          this.error = logError;
          this.log('Debug:Enabled');
        } else {
          this.log('Debug:Disabled');
          this.log = noop;
          this.error = noop;
        }
      }
      return isDebugging;
    },
    log: noop,
    error: noop,
    assert: function(condition, message) {
      if (!condition) {
        system.error(new Error(message || 'Assert:Failed'));
      }
    },
    defer: function(action) {
      return $.Deferred(action);
    },
    guid: function() {
      var d = new Date().getTime();
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16);
      });
    },
    acquire: function() {
      var modules,
          first = arguments[0],
          arrayRequest = false;
      if (system.isArray(first)) {
        modules = first;
        arrayRequest = true;
      } else {
        modules = slice.call(arguments, 0);
      }
      return this.defer(function(dfd) {
        require(modules, function() {
          var args = arguments;
          setTimeout(function() {
            if (args.length > 1 || arrayRequest) {
              dfd.resolve(slice.call(args, 0));
            } else {
              dfd.resolve(args[0]);
            }
          }, 1);
        }, function(err) {
          dfd.reject(err);
        });
      }).promise();
    },
    extend: function(obj) {
      var rest = slice.call(arguments, 1);
      for (var i = 0; i < rest.length; i++) {
        var source = rest[i];
        if (source) {
          for (var prop in source) {
            obj[prop] = source[prop];
          }
        }
      }
      return obj;
    },
    wait: function(milliseconds) {
      return system.defer(function(dfd) {
        setTimeout(dfd.resolve, milliseconds);
      }).promise();
    }
  };
  system.keys = nativeKeys || function(obj) {
    if (obj !== Object(obj)) {
      throw new TypeError('Invalid object');
    }
    var keys = [];
    for (var key in obj) {
      if (hasOwnProperty.call(obj, key)) {
        keys[keys.length] = key;
      }
    }
    return keys;
  };
  system.isElement = function(obj) {
    return !!(obj && obj.nodeType === 1);
  };
  system.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) == '[object Array]';
  };
  system.isObject = function(obj) {
    return obj === Object(obj);
  };
  system.isBoolean = function(obj) {
    return typeof(obj) === "boolean";
  };
  system.isPromise = function(obj) {
    return obj && system.isFunction(obj.then);
  };
  var isChecks = ['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp'];
  function makeIsFunction(name) {
    var value = '[object ' + name + ']';
    system['is' + name] = function(obj) {
      return toString.call(obj) == value;
    };
  }
  for (var i = 0; i < isChecks.length; i++) {
    makeIsFunction(isChecks[i]);
  }
  return system;
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("libs/durandal/viewEngine.js", ["libs/durandal/system.js", "libs/jquery.js"], function(system, $) {
  var parseMarkup;
  if ($.parseHTML) {
    parseMarkup = function(html) {
      return $.parseHTML(html);
    };
  } else {
    parseMarkup = function(html) {
      return $(html).get();
    };
  }
  return {
    cache: {},
    viewExtension: '.html',
    viewPlugin: 'text',
    viewPluginParameters: '',
    isViewUrl: function(url) {
      return url.indexOf(this.viewExtension, url.length - this.viewExtension.length) !== -1;
    },
    convertViewUrlToViewId: function(url) {
      return url.substring(0, url.length - this.viewExtension.length);
    },
    convertViewIdToRequirePath: function(viewId) {
      var plugin = this.viewPlugin ? this.viewPlugin + '!' : '';
      return plugin + viewId + this.viewExtension + this.viewPluginParameters;
    },
    parseMarkup: parseMarkup,
    processMarkup: function(markup) {
      var allElements = this.parseMarkup(markup);
      return this.ensureSingleElement(allElements);
    },
    ensureSingleElement: function(allElements) {
      if (allElements.length == 1) {
        return allElements[0];
      }
      var withoutCommentsOrEmptyText = [];
      for (var i = 0; i < allElements.length; i++) {
        var current = allElements[i];
        if (current.nodeType != 8) {
          if (current.nodeType == 3) {
            var result = /\S/.test(current.nodeValue);
            if (!result) {
              continue;
            }
          }
          withoutCommentsOrEmptyText.push(current);
        }
      }
      if (withoutCommentsOrEmptyText.length > 1) {
        return $(withoutCommentsOrEmptyText).wrapAll('<div class="durandal-wrapper"></div>').parent().get(0);
      }
      return withoutCommentsOrEmptyText[0];
    },
    tryGetViewFromCache: function(id) {
      return this.cache[id];
    },
    putViewInCache: function(id, view) {
      this.cache[id] = view;
    },
    createView: function(viewId) {
      var that = this;
      var requirePath = this.convertViewIdToRequirePath(viewId);
      var existing = this.tryGetViewFromCache(requirePath);
      if (existing) {
        return system.defer(function(dfd) {
          dfd.resolve(existing.cloneNode(true));
        }).promise();
      }
      return system.defer(function(dfd) {
        system.acquire(requirePath).then(function(markup) {
          var element = that.processMarkup(markup);
          element.setAttribute('data-view', viewId);
          that.putViewInCache(requirePath, element);
          dfd.resolve(element.cloneNode(true));
        }).fail(function(err) {
          that.createFallbackView(viewId, requirePath, err).then(function(element) {
            element.setAttribute('data-view', viewId);
            that.cache[requirePath] = element;
            dfd.resolve(element.cloneNode(true));
          });
        });
      }).promise();
    },
    createFallbackView: function(viewId, requirePath, err) {
      var that = this,
          message = 'View Not Found. Searched for "' + viewId + '" via path "' + requirePath + '".';
      return system.defer(function(dfd) {
        dfd.resolve(that.processMarkup('<div class="durandal-view-404">' + message + '</div>'));
      }).promise();
    }
  };
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("libs/durandal/viewLocator.js", ["libs/durandal/system.js", "libs/durandal/viewEngine.js"], function(system, viewEngine) {
  function findInElements(nodes, url) {
    for (var i = 0; i < nodes.length; i++) {
      var current = nodes[i];
      var existingUrl = current.getAttribute('data-view');
      if (existingUrl == url) {
        return current;
      }
    }
  }
  function escape(str) {
    return (str + '').replace(/([\\\.\+\*\?\[\^\]\$\(\)\{\}\=\!\<\>\|\:])/g, "\\$1");
  }
  return {
    useConvention: function(modulesPath, viewsPath, areasPath) {
      modulesPath = modulesPath || 'viewmodels';
      viewsPath = viewsPath || 'views';
      areasPath = areasPath || viewsPath;
      var reg = new RegExp(escape(modulesPath), 'gi');
      this.convertModuleIdToViewId = function(moduleId) {
        return moduleId.replace(reg, viewsPath);
      };
      this.translateViewIdToArea = function(viewId, area) {
        if (!area || area == 'partial') {
          return areasPath + '/' + viewId;
        }
        return areasPath + '/' + area + '/' + viewId;
      };
    },
    locateViewForObject: function(obj, area, elementsToSearch) {
      var view;
      if (obj.getView) {
        view = obj.getView();
        if (view) {
          return this.locateView(view, area, elementsToSearch);
        }
      }
      if (obj.viewUrl) {
        return this.locateView(obj.viewUrl, area, elementsToSearch);
      }
      var id = system.getModuleId(obj);
      if (id) {
        return this.locateView(this.convertModuleIdToViewId(id), area, elementsToSearch);
      }
      return this.locateView(this.determineFallbackViewId(obj), area, elementsToSearch);
    },
    convertModuleIdToViewId: function(moduleId) {
      return moduleId;
    },
    determineFallbackViewId: function(obj) {
      var funcNameRegex = /function (.{1,})\(/;
      var results = (funcNameRegex).exec((obj).constructor.toString());
      var typeName = (results && results.length > 1) ? results[1] : "";
      typeName = typeName.trim();
      return 'views/' + typeName;
    },
    translateViewIdToArea: function(viewId, area) {
      return viewId;
    },
    locateView: function(viewOrUrlOrId, area, elementsToSearch) {
      if (typeof viewOrUrlOrId === 'string') {
        var viewId;
        if (viewEngine.isViewUrl(viewOrUrlOrId)) {
          viewId = viewEngine.convertViewUrlToViewId(viewOrUrlOrId);
        } else {
          viewId = viewOrUrlOrId;
        }
        if (area) {
          viewId = this.translateViewIdToArea(viewId, area);
        }
        if (elementsToSearch) {
          var existing = findInElements(elementsToSearch, viewId);
          if (existing) {
            return system.defer(function(dfd) {
              dfd.resolve(existing);
            }).promise();
          }
        }
        return viewEngine.createView(viewId);
      }
      return system.defer(function(dfd) {
        dfd.resolve(viewOrUrlOrId);
      }).promise();
    }
  };
});

_removeDefine();
})();
System.registerDynamic("libs/knockout.js", [], true, function(req, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  module.exports = ko;
  global.define = __define;
  return module.exports;
});

(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("libs/durandal/binder.js", ["libs/durandal/system.js", "libs/knockout.js"], function(system, ko) {
  var binder,
      insufficientInfoMessage = 'Insufficient Information to Bind',
      unexpectedViewMessage = 'Unexpected View Type',
      bindingInstructionKey = 'durandal-binding-instruction',
      koBindingContextKey = '__ko_bindingContext__';
  function normalizeBindingInstruction(result) {
    if (result === undefined) {
      return {applyBindings: true};
    }
    if (system.isBoolean(result)) {
      return {applyBindings: result};
    }
    if (result.applyBindings === undefined) {
      result.applyBindings = true;
    }
    return result;
  }
  function doBind(obj, view, bindingTarget, data) {
    if (!view || !bindingTarget) {
      if (binder.throwOnErrors) {
        system.error(insufficientInfoMessage);
      } else {
        system.log(insufficientInfoMessage, view, data);
      }
      return;
    }
    if (!view.getAttribute) {
      if (binder.throwOnErrors) {
        system.error(unexpectedViewMessage);
      } else {
        system.log(unexpectedViewMessage, view, data);
      }
      return;
    }
    var viewName = view.getAttribute('data-view');
    try {
      var instruction;
      if (obj && obj.binding) {
        instruction = obj.binding(view);
      }
      instruction = normalizeBindingInstruction(instruction);
      binder.binding(data, view, instruction);
      if (instruction.applyBindings) {
        system.log('Binding', viewName, data);
        ko.applyBindings(bindingTarget, view);
      } else if (obj) {
        ko.utils.domData.set(view, koBindingContextKey, {$data: obj});
      }
      binder.bindingComplete(data, view, instruction);
      if (obj && obj.bindingComplete) {
        obj.bindingComplete(view);
      }
      ko.utils.domData.set(view, bindingInstructionKey, instruction);
      return instruction;
    } catch (e) {
      e.message = e.message + ';\nView: ' + viewName + ";\nModuleId: " + system.getModuleId(data);
      if (binder.throwOnErrors) {
        system.error(e);
      } else {
        system.log(e.message);
      }
    }
  }
  return binder = {
    binding: system.noop,
    bindingComplete: system.noop,
    throwOnErrors: false,
    getBindingInstruction: function(view) {
      return ko.utils.domData.get(view, bindingInstructionKey);
    },
    bindContext: function(bindingContext, view, obj, dataAlias) {
      if (obj && bindingContext) {
        bindingContext = bindingContext.createChildContext(obj, typeof(dataAlias) === 'string' ? dataAlias : null);
      }
      return doBind(obj, view, bindingContext, obj || (bindingContext ? bindingContext.$data : null));
    },
    bind: function(obj, view) {
      return doBind(obj, view, obj, obj);
    }
  };
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("libs/durandal/activator.js", ["libs/durandal/system.js", "libs/knockout.js"], function(system, ko) {
  var activator;
  var defaultOptions = {canDeactivate: true};
  function ensureSettings(settings) {
    if (settings == undefined) {
      settings = {};
    }
    if (!system.isBoolean(settings.closeOnDeactivate)) {
      settings.closeOnDeactivate = activator.defaults.closeOnDeactivate;
    }
    if (!settings.beforeActivate) {
      settings.beforeActivate = activator.defaults.beforeActivate;
    }
    if (!settings.afterDeactivate) {
      settings.afterDeactivate = activator.defaults.afterDeactivate;
    }
    if (!settings.affirmations) {
      settings.affirmations = activator.defaults.affirmations;
    }
    if (!settings.interpretResponse) {
      settings.interpretResponse = activator.defaults.interpretResponse;
    }
    if (!settings.areSameItem) {
      settings.areSameItem = activator.defaults.areSameItem;
    }
    if (!settings.findChildActivator) {
      settings.findChildActivator = activator.defaults.findChildActivator;
    }
    return settings;
  }
  function invoke(target, method, data) {
    if (system.isArray(data)) {
      return target[method].apply(target, data);
    }
    return target[method](data);
  }
  function deactivate(item, close, settings, dfd, setter) {
    if (item && item.deactivate) {
      system.log('Deactivating', item);
      var result;
      try {
        result = item.deactivate(close);
      } catch (error) {
        system.log('ERROR: ' + error.message, error);
        dfd.resolve(false);
        return;
      }
      if (result && result.then) {
        result.then(function() {
          settings.afterDeactivate(item, close, setter);
          dfd.resolve(true);
        }, function(reason) {
          system.log(reason);
          dfd.resolve(false);
        });
      } else {
        settings.afterDeactivate(item, close, setter);
        dfd.resolve(true);
      }
    } else {
      if (item) {
        settings.afterDeactivate(item, close, setter);
      }
      dfd.resolve(true);
    }
  }
  function activate(newItem, activeItem, callback, activationData) {
    var result;
    if (newItem && newItem.activate) {
      system.log('Activating', newItem);
      try {
        result = invoke(newItem, 'activate', activationData);
      } catch (error) {
        system.log('ERROR: ' + error.message, error);
        callback(false);
        return;
      }
    }
    if (result && result.then) {
      result.then(function() {
        activeItem(newItem);
        callback(true);
      }, function(reason) {
        system.log('ERROR: ' + reason.message, reason);
        callback(false);
      });
    } else {
      activeItem(newItem);
      callback(true);
    }
  }
  function canDeactivateItem(item, close, settings, options) {
    options = system.extend({}, defaultOptions, options);
    settings.lifecycleData = null;
    return system.defer(function(dfd) {
      function continueCanDeactivate() {
        if (item && item.canDeactivate && options.canDeactivate) {
          var resultOrPromise;
          try {
            resultOrPromise = item.canDeactivate(close);
          } catch (error) {
            system.log('ERROR: ' + error.message, error);
            dfd.resolve(false);
            return;
          }
          if (resultOrPromise.then) {
            resultOrPromise.then(function(result) {
              settings.lifecycleData = result;
              dfd.resolve(settings.interpretResponse(result));
            }, function(reason) {
              system.log('ERROR: ' + reason.message, reason);
              dfd.resolve(false);
            });
          } else {
            settings.lifecycleData = resultOrPromise;
            dfd.resolve(settings.interpretResponse(resultOrPromise));
          }
        } else {
          dfd.resolve(true);
        }
      }
      var childActivator = settings.findChildActivator(item);
      if (childActivator) {
        childActivator.canDeactivate().then(function(result) {
          if (result) {
            continueCanDeactivate();
          } else {
            dfd.resolve(false);
          }
        });
      } else {
        continueCanDeactivate();
      }
    }).promise();
  }
  ;
  function canActivateItem(newItem, activeItem, settings, activeData, newActivationData) {
    settings.lifecycleData = null;
    return system.defer(function(dfd) {
      if (settings.areSameItem(activeItem(), newItem, activeData, newActivationData)) {
        dfd.resolve(true);
        return;
      }
      if (newItem && newItem.canActivate) {
        var resultOrPromise;
        try {
          resultOrPromise = invoke(newItem, 'canActivate', newActivationData);
        } catch (error) {
          system.log('ERROR: ' + error.message, error);
          dfd.resolve(false);
          return;
        }
        if (resultOrPromise.then) {
          resultOrPromise.then(function(result) {
            settings.lifecycleData = result;
            dfd.resolve(settings.interpretResponse(result));
          }, function(reason) {
            system.log('ERROR: ' + reason.message, reason);
            dfd.resolve(false);
          });
        } else {
          settings.lifecycleData = resultOrPromise;
          dfd.resolve(settings.interpretResponse(resultOrPromise));
        }
      } else {
        dfd.resolve(true);
      }
    }).promise();
  }
  ;
  function createActivator(initialActiveItem, settings) {
    var activeItem = ko.observable(null);
    var activeData;
    settings = ensureSettings(settings);
    var computed = ko.computed({
      read: function() {
        return activeItem();
      },
      write: function(newValue) {
        computed.viaSetter = true;
        computed.activateItem(newValue);
      }
    });
    computed.__activator__ = true;
    computed.settings = settings;
    settings.activator = computed;
    computed.isActivating = ko.observable(false);
    computed.forceActiveItem = function(item) {
      activeItem(item);
    };
    computed.canDeactivateItem = function(item, close, options) {
      return canDeactivateItem(item, close, settings, options);
    };
    computed.deactivateItem = function(item, close) {
      return system.defer(function(dfd) {
        computed.canDeactivateItem(item, close).then(function(canDeactivate) {
          if (canDeactivate) {
            deactivate(item, close, settings, dfd, activeItem);
          } else {
            computed.notifySubscribers();
            dfd.resolve(false);
          }
        });
      }).promise();
    };
    computed.canActivateItem = function(newItem, activationData) {
      return canActivateItem(newItem, activeItem, settings, activeData, activationData);
    };
    computed.activateItem = function(newItem, newActivationData, options) {
      var viaSetter = computed.viaSetter;
      computed.viaSetter = false;
      return system.defer(function(dfd) {
        if (computed.isActivating()) {
          dfd.resolve(false);
          return;
        }
        computed.isActivating(true);
        var currentItem = activeItem();
        if (settings.areSameItem(currentItem, newItem, activeData, newActivationData)) {
          computed.isActivating(false);
          dfd.resolve(true);
          return;
        }
        computed.canDeactivateItem(currentItem, settings.closeOnDeactivate, options).then(function(canDeactivate) {
          if (canDeactivate) {
            computed.canActivateItem(newItem, newActivationData).then(function(canActivate) {
              if (canActivate) {
                system.defer(function(dfd2) {
                  deactivate(currentItem, settings.closeOnDeactivate, settings, dfd2);
                }).promise().then(function() {
                  newItem = settings.beforeActivate(newItem, newActivationData);
                  activate(newItem, activeItem, function(result) {
                    activeData = newActivationData;
                    computed.isActivating(false);
                    dfd.resolve(result);
                  }, newActivationData);
                });
              } else {
                if (viaSetter) {
                  computed.notifySubscribers();
                }
                computed.isActivating(false);
                dfd.resolve(false);
              }
            });
          } else {
            if (viaSetter) {
              computed.notifySubscribers();
            }
            computed.isActivating(false);
            dfd.resolve(false);
          }
        });
      }).promise();
    };
    computed.canActivate = function() {
      var toCheck;
      if (initialActiveItem) {
        toCheck = initialActiveItem;
        initialActiveItem = false;
      } else {
        toCheck = computed();
      }
      return computed.canActivateItem(toCheck);
    };
    computed.activate = function() {
      var toActivate;
      if (initialActiveItem) {
        toActivate = initialActiveItem;
        initialActiveItem = false;
      } else {
        toActivate = computed();
      }
      return computed.activateItem(toActivate);
    };
    computed.canDeactivate = function(close) {
      return computed.canDeactivateItem(computed(), close);
    };
    computed.deactivate = function(close) {
      return computed.deactivateItem(computed(), close);
    };
    computed.includeIn = function(includeIn) {
      includeIn.canActivate = function() {
        return computed.canActivate();
      };
      includeIn.activate = function() {
        return computed.activate();
      };
      includeIn.canDeactivate = function(close) {
        return computed.canDeactivate(close);
      };
      includeIn.deactivate = function(close) {
        return computed.deactivate(close);
      };
    };
    if (settings.includeIn) {
      computed.includeIn(settings.includeIn);
    } else if (initialActiveItem) {
      computed.activate();
    }
    computed.forItems = function(items) {
      settings.closeOnDeactivate = false;
      settings.determineNextItemToActivate = function(list, lastIndex) {
        var toRemoveAt = lastIndex - 1;
        if (toRemoveAt == -1 && list.length > 1) {
          return list[1];
        }
        if (toRemoveAt > -1 && toRemoveAt < list.length - 1) {
          return list[toRemoveAt];
        }
        return null;
      };
      settings.beforeActivate = function(newItem) {
        var currentItem = computed();
        if (!newItem) {
          newItem = settings.determineNextItemToActivate(items, currentItem ? items.indexOf(currentItem) : 0);
        } else {
          var index = items.indexOf(newItem);
          if (index == -1) {
            items.push(newItem);
          } else {
            newItem = items()[index];
          }
        }
        return newItem;
      };
      settings.afterDeactivate = function(oldItem, close) {
        if (close) {
          items.remove(oldItem);
        }
      };
      var originalCanDeactivate = computed.canDeactivate;
      computed.canDeactivate = function(close) {
        if (close) {
          return system.defer(function(dfd) {
            var list = items();
            var results = [];
            function finish() {
              for (var j = 0; j < results.length; j++) {
                if (!results[j]) {
                  dfd.resolve(false);
                  return;
                }
              }
              dfd.resolve(true);
            }
            for (var i = 0; i < list.length; i++) {
              computed.canDeactivateItem(list[i], close).then(function(result) {
                results.push(result);
                if (results.length == list.length) {
                  finish();
                }
              });
            }
          }).promise();
        } else {
          return originalCanDeactivate();
        }
      };
      var originalDeactivate = computed.deactivate;
      computed.deactivate = function(close) {
        if (close) {
          return system.defer(function(dfd) {
            var list = items();
            var results = 0;
            var listLength = list.length;
            function doDeactivate(item) {
              setTimeout(function() {
                computed.deactivateItem(item, close).then(function() {
                  results++;
                  items.remove(item);
                  if (results == listLength) {
                    dfd.resolve();
                  }
                });
              }, 1);
            }
            for (var i = 0; i < listLength; i++) {
              doDeactivate(list[i]);
            }
          }).promise();
        } else {
          return originalDeactivate();
        }
      };
      return computed;
    };
    return computed;
  }
  var activatorSettings = {
    closeOnDeactivate: true,
    affirmations: ['yes', 'ok', 'true'],
    interpretResponse: function(value) {
      if (system.isObject(value)) {
        value = value.can || false;
      }
      if (system.isString(value)) {
        return ko.utils.arrayIndexOf(this.affirmations, value.toLowerCase()) !== -1;
      }
      return value;
    },
    areSameItem: function(currentItem, newItem, currentActivationData, newActivationData) {
      return currentItem == newItem;
    },
    beforeActivate: function(newItem) {
      return newItem;
    },
    afterDeactivate: function(oldItem, close, setter) {
      if (close && setter) {
        setter(null);
      }
    },
    findChildActivator: function(item) {
      return null;
    }
  };
  activator = {
    defaults: activatorSettings,
    create: createActivator,
    isActivator: function(object) {
      return object && object.__activator__;
    }
  };
  return activator;
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("libs/durandal/composition.js", ["libs/durandal/system.js", "libs/durandal/viewLocator.js", "libs/durandal/binder.js", "libs/durandal/viewEngine.js", "libs/durandal/activator.js", "libs/jquery.js", "libs/knockout.js"], function(system, viewLocator, binder, viewEngine, activator, $, ko) {
  var dummyModel = {},
      activeViewAttributeName = 'data-active-view',
      composition,
      compositionCompleteCallbacks = [],
      compositionCount = 0,
      compositionDataKey = 'durandal-composition-data',
      partAttributeName = 'data-part',
      bindableSettings = ['model', 'view', 'transition', 'area', 'strategy', 'activationData', 'onError'],
      visibilityKey = "durandal-visibility-data",
      composeBindings = ['compose:'];
  function onError(context, error, element) {
    try {
      if (context.onError) {
        try {
          context.onError(error, element);
        } catch (e) {
          system.error(e);
        }
      } else {
        system.error(error);
      }
    } finally {
      endComposition(context, element, true);
    }
  }
  function getHostState(parent) {
    var elements = [];
    var state = {
      childElements: elements,
      activeView: null
    };
    var child = ko.virtualElements.firstChild(parent);
    while (child) {
      if (child.nodeType == 1) {
        elements.push(child);
        if (child.getAttribute(activeViewAttributeName)) {
          state.activeView = child;
        }
      }
      child = ko.virtualElements.nextSibling(child);
    }
    if (!state.activeView) {
      state.activeView = elements[0];
    }
    return state;
  }
  function endComposition(context, element, error) {
    compositionCount--;
    if (compositionCount === 0) {
      var callBacks = compositionCompleteCallbacks;
      compositionCompleteCallbacks = [];
      if (!error) {
        setTimeout(function() {
          var i = callBacks.length;
          while (i--) {
            try {
              callBacks[i]();
            } catch (e) {
              onError(context, e, element);
            }
          }
        }, 1);
      }
    }
    cleanUp(context);
  }
  function cleanUp(context) {
    delete context.activeView;
    delete context.viewElements;
  }
  function tryActivate(context, successCallback, skipActivation, element) {
    if (skipActivation) {
      successCallback();
    } else if (context.activate && context.model && context.model.activate) {
      var result;
      try {
        if (system.isArray(context.activationData)) {
          result = context.model.activate.apply(context.model, context.activationData);
        } else {
          result = context.model.activate(context.activationData);
        }
        if (result && result.then) {
          result.then(successCallback, function(reason) {
            onError(context, reason, element);
            successCallback();
          });
        } else if (result || result === undefined) {
          successCallback();
        } else {
          endComposition(context, element);
        }
      } catch (e) {
        onError(context, e, element);
      }
    } else {
      successCallback();
    }
  }
  function triggerAttach(context, element) {
    var context = this;
    if (context.activeView) {
      context.activeView.removeAttribute(activeViewAttributeName);
    }
    if (context.child) {
      try {
        if (context.model && context.model.attached) {
          if (context.composingNewView || context.alwaysTriggerAttach) {
            context.model.attached(context.child, context.parent, context);
          }
        }
        if (context.attached) {
          context.attached(context.child, context.parent, context);
        }
        context.child.setAttribute(activeViewAttributeName, true);
        if (context.composingNewView && context.model && context.model.detached) {
          ko.utils.domNodeDisposal.addDisposeCallback(context.child, function() {
            try {
              context.model.detached(context.child, context.parent, context);
            } catch (e2) {
              onError(context, e2, element);
            }
          });
        }
      } catch (e) {
        onError(context, e, element);
      }
    }
    context.triggerAttach = system.noop;
  }
  function shouldTransition(context) {
    if (system.isString(context.transition)) {
      if (context.activeView) {
        if (context.activeView == context.child) {
          return false;
        }
        if (!context.child) {
          return true;
        }
        if (context.skipTransitionOnSameViewId) {
          var currentViewId = context.activeView.getAttribute('data-view');
          var newViewId = context.child.getAttribute('data-view');
          return currentViewId != newViewId;
        }
      }
      return true;
    }
    return false;
  }
  function cloneNodes(nodesArray) {
    for (var i = 0,
        j = nodesArray.length,
        newNodesArray = []; i < j; i++) {
      var clonedNode = nodesArray[i].cloneNode(true);
      newNodesArray.push(clonedNode);
    }
    return newNodesArray;
  }
  function replaceParts(context) {
    var parts = cloneNodes(context.parts);
    var replacementParts = composition.getParts(parts);
    var standardParts = composition.getParts(context.child);
    for (var partId in replacementParts) {
      var toReplace = standardParts[partId];
      if (!toReplace) {
        toReplace = $('[data-part="' + partId + '"]', context.child).get(0);
        if (!toReplace) {
          system.log('Could not find part to override: ' + partId);
          continue;
        }
      }
      toReplace.parentNode.replaceChild(replacementParts[partId], toReplace);
    }
  }
  function removePreviousView(context) {
    var children = ko.virtualElements.childNodes(context.parent),
        i,
        len;
    if (!system.isArray(children)) {
      var arrayChildren = [];
      for (i = 0, len = children.length; i < len; i++) {
        arrayChildren[i] = children[i];
      }
      children = arrayChildren;
    }
    for (i = 1, len = children.length; i < len; i++) {
      ko.removeNode(children[i]);
    }
  }
  function hide(view) {
    ko.utils.domData.set(view, visibilityKey, view.style.display);
    view.style.display = 'none';
  }
  function show(view) {
    var displayStyle = ko.utils.domData.get(view, visibilityKey);
    view.style.display = displayStyle === 'none' ? 'block' : displayStyle;
  }
  function hasComposition(element) {
    var dataBind = element.getAttribute('data-bind');
    if (!dataBind) {
      return false;
    }
    for (var i = 0,
        length = composeBindings.length; i < length; i++) {
      if (dataBind.indexOf(composeBindings[i]) > -1) {
        return true;
      }
    }
    return false;
  }
  var compositionTransaction = {complete: function(callback) {
      compositionCompleteCallbacks.push(callback);
    }};
  composition = {
    composeBindings: composeBindings,
    convertTransitionToModuleId: function(name) {
      return 'transitions/' + name;
    },
    defaultTransitionName: null,
    current: compositionTransaction,
    addBindingHandler: function(name, config, initOptionsFactory) {
      var key,
          dataKey = 'composition-handler-' + name,
          handler;
      config = config || ko.bindingHandlers[name];
      initOptionsFactory = initOptionsFactory || function() {
        return undefined;
      };
      handler = ko.bindingHandlers[name] = {
        init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
          if (compositionCount > 0) {
            var data = {trigger: ko.observable(null)};
            composition.current.complete(function() {
              if (config.init) {
                config.init(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext);
              }
              if (config.update) {
                ko.utils.domData.set(element, dataKey, config);
                data.trigger('trigger');
              }
            });
            ko.utils.domData.set(element, dataKey, data);
          } else {
            ko.utils.domData.set(element, dataKey, config);
            if (config.init) {
              config.init(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext);
            }
          }
          return initOptionsFactory(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext);
        },
        update: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
          var data = ko.utils.domData.get(element, dataKey);
          if (data.update) {
            return data.update(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext);
          }
          if (data.trigger) {
            data.trigger();
          }
        }
      };
      for (key in config) {
        if (key !== "init" && key !== "update") {
          handler[key] = config[key];
        }
      }
    },
    getParts: function(elements, parts) {
      parts = parts || {};
      if (!elements) {
        return parts;
      }
      if (elements.length === undefined) {
        elements = [elements];
      }
      for (var i = 0,
          length = elements.length; i < length; i++) {
        var element = elements[i],
            id;
        if (element.getAttribute) {
          id = element.getAttribute(partAttributeName);
          if (id) {
            parts[id] = element;
          }
          if (element.hasChildNodes() && !hasComposition(element)) {
            composition.getParts(element.childNodes, parts);
          }
        }
      }
      return parts;
    },
    cloneNodes: cloneNodes,
    finalize: function(context, element) {
      if (context.transition === undefined) {
        context.transition = this.defaultTransitionName;
      }
      if (!context.child && !context.activeView) {
        if (!context.cacheViews) {
          ko.virtualElements.emptyNode(context.parent);
        }
        context.triggerAttach(context, element);
        endComposition(context, element);
      } else if (shouldTransition(context)) {
        var transitionModuleId = this.convertTransitionToModuleId(context.transition);
        system.acquire(transitionModuleId).then(function(transition) {
          context.transition = transition;
          transition(context).then(function() {
            if (!context.cacheViews) {
              if (!context.child) {
                ko.virtualElements.emptyNode(context.parent);
              } else {
                removePreviousView(context);
              }
            } else if (context.activeView) {
              var instruction = binder.getBindingInstruction(context.activeView);
              if (instruction && instruction.cacheViews != undefined && !instruction.cacheViews) {
                ko.removeNode(context.activeView);
              } else {
                hide(context.activeView);
              }
            }
            if (context.child) {
              show(context.child);
            }
            context.triggerAttach(context, element);
            endComposition(context, element);
          });
        }).fail(function(err) {
          onError(context, 'Failed to load transition (' + transitionModuleId + '). Details: ' + err.message, element);
        });
      } else {
        if (context.child != context.activeView) {
          if (context.cacheViews && context.activeView) {
            var instruction = binder.getBindingInstruction(context.activeView);
            if (!instruction || (instruction.cacheViews != undefined && !instruction.cacheViews)) {
              ko.removeNode(context.activeView);
            } else {
              hide(context.activeView);
            }
          }
          if (!context.child) {
            if (!context.cacheViews) {
              ko.virtualElements.emptyNode(context.parent);
            }
          } else {
            if (!context.cacheViews) {
              removePreviousView(context);
            }
            show(context.child);
          }
        }
        context.triggerAttach(context, element);
        endComposition(context, element);
      }
    },
    bindAndShow: function(child, element, context, skipActivation) {
      context.child = child;
      context.parent.__composition_context = context;
      if (context.cacheViews) {
        context.composingNewView = (ko.utils.arrayIndexOf(context.viewElements, child) == -1);
      } else {
        context.composingNewView = true;
      }
      tryActivate(context, function() {
        if (context.parent.__composition_context == context) {
          delete context.parent.__composition_context;
          if (context.binding) {
            context.binding(context.child, context.parent, context);
          }
          if (context.preserveContext && context.bindingContext) {
            if (context.composingNewView) {
              if (context.parts) {
                replaceParts(context);
              }
              hide(child);
              ko.virtualElements.prepend(context.parent, child);
              binder.bindContext(context.bindingContext, child, context.model, context.as);
            }
          } else if (child) {
            var modelToBind = context.model || dummyModel;
            var currentModel = ko.dataFor(child);
            if (currentModel != modelToBind) {
              if (!context.composingNewView) {
                ko.removeNode(child);
                viewEngine.createView(child.getAttribute('data-view')).then(function(recreatedView) {
                  composition.bindAndShow(recreatedView, element, context, true);
                });
                return;
              }
              if (context.parts) {
                replaceParts(context);
              }
              hide(child);
              ko.virtualElements.prepend(context.parent, child);
              binder.bind(modelToBind, child);
            }
          }
          composition.finalize(context, element);
        } else {
          endComposition(context, element);
        }
      }, skipActivation, element);
    },
    defaultStrategy: function(context) {
      return viewLocator.locateViewForObject(context.model, context.area, context.viewElements);
    },
    getSettings: function(valueAccessor, element) {
      var value = valueAccessor(),
          settings = ko.utils.unwrapObservable(value) || {},
          activatorPresent = activator.isActivator(value),
          moduleId;
      if (system.isString(settings)) {
        if (viewEngine.isViewUrl(settings)) {
          settings = {view: settings};
        } else {
          settings = {
            model: settings,
            activate: !activatorPresent
          };
        }
        return settings;
      }
      moduleId = system.getModuleId(settings);
      if (moduleId) {
        settings = {
          model: settings,
          activate: !activatorPresent
        };
        return settings;
      }
      if (!activatorPresent && settings.model) {
        activatorPresent = activator.isActivator(settings.model);
      }
      for (var attrName in settings) {
        if (ko.utils.arrayIndexOf(bindableSettings, attrName) != -1) {
          settings[attrName] = ko.utils.unwrapObservable(settings[attrName]);
        } else {
          settings[attrName] = settings[attrName];
        }
      }
      if (activatorPresent) {
        settings.activate = false;
      } else if (settings.activate === undefined) {
        settings.activate = true;
      }
      return settings;
    },
    executeStrategy: function(context, element) {
      context.strategy(context).then(function(child) {
        composition.bindAndShow(child, element, context);
      });
    },
    inject: function(context, element) {
      if (!context.model) {
        this.bindAndShow(null, element, context);
        return;
      }
      if (context.view) {
        viewLocator.locateView(context.view, context.area, context.viewElements).then(function(child) {
          composition.bindAndShow(child, element, context);
        });
        return;
      }
      if (!context.strategy) {
        context.strategy = this.defaultStrategy;
      }
      if (system.isString(context.strategy)) {
        system.acquire(context.strategy).then(function(strategy) {
          context.strategy = strategy;
          composition.executeStrategy(context, element);
        }).fail(function(err) {
          onError(context, 'Failed to load view strategy (' + context.strategy + '). Details: ' + err.message, element);
        });
      } else {
        this.executeStrategy(context, element);
      }
    },
    compose: function(element, settings, bindingContext, fromBinding) {
      compositionCount++;
      if (!fromBinding) {
        settings = composition.getSettings(function() {
          return settings;
        }, element);
      }
      if (settings.compositionComplete) {
        compositionCompleteCallbacks.push(function() {
          settings.compositionComplete(settings.child, settings.parent, settings);
        });
      }
      compositionCompleteCallbacks.push(function() {
        if (settings.composingNewView && settings.model && settings.model.compositionComplete) {
          settings.model.compositionComplete(settings.child, settings.parent, settings);
        }
      });
      var hostState = getHostState(element);
      settings.activeView = hostState.activeView;
      settings.parent = element;
      settings.triggerAttach = triggerAttach;
      settings.bindingContext = bindingContext;
      if (settings.cacheViews && !settings.viewElements) {
        settings.viewElements = hostState.childElements;
      }
      if (!settings.model) {
        if (!settings.view) {
          this.bindAndShow(null, element, settings);
        } else {
          settings.area = settings.area || 'partial';
          settings.preserveContext = true;
          viewLocator.locateView(settings.view, settings.area, settings.viewElements).then(function(child) {
            composition.bindAndShow(child, element, settings);
          });
        }
      } else if (system.isString(settings.model)) {
        system.acquire(settings.model).then(function(module) {
          settings.model = system.resolveObject(module);
          composition.inject(settings, element);
        }).fail(function(err) {
          onError(settings, 'Failed to load composed module (' + settings.model + '). Details: ' + err.message, element);
        });
      } else {
        composition.inject(settings, element);
      }
    }
  };
  ko.bindingHandlers.compose = {
    init: function() {
      return {controlsDescendantBindings: true};
    },
    update: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
      var settings = composition.getSettings(valueAccessor, element);
      if (settings.mode) {
        var data = ko.utils.domData.get(element, compositionDataKey);
        if (!data) {
          var childNodes = ko.virtualElements.childNodes(element);
          data = {};
          if (settings.mode === 'inline') {
            data.view = viewEngine.ensureSingleElement(childNodes);
          } else if (settings.mode === 'templated') {
            data.parts = cloneNodes(childNodes);
          }
          ko.virtualElements.emptyNode(element);
          ko.utils.domData.set(element, compositionDataKey, data);
        }
        if (settings.mode === 'inline') {
          settings.view = data.view.cloneNode(true);
        } else if (settings.mode === 'templated') {
          settings.parts = data.parts;
        }
        settings.preserveContext = true;
      }
      composition.compose(element, settings, bindingContext, true);
    }
  };
  ko.virtualElements.allowedBindings.compose = true;
  return composition;
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("libs/durandal/events.js", ["libs/durandal/system.js"], function(system) {
  var eventSplitter = /\s+/;
  var Events = function() {};
  var Subscription = function(owner, events) {
    this.owner = owner;
    this.events = events;
  };
  Subscription.prototype.then = function(callback, context) {
    this.callback = callback || this.callback;
    this.context = context || this.context;
    if (!this.callback) {
      return this;
    }
    this.owner.on(this.events, this.callback, this.context);
    return this;
  };
  Subscription.prototype.on = Subscription.prototype.then;
  Subscription.prototype.off = function() {
    this.owner.off(this.events, this.callback, this.context);
    return this;
  };
  Events.prototype.on = function(events, callback, context) {
    var calls,
        event,
        list;
    if (!callback) {
      return new Subscription(this, events);
    } else {
      calls = this.callbacks || (this.callbacks = {});
      events = events.split(eventSplitter);
      while (event = events.shift()) {
        list = calls[event] || (calls[event] = []);
        list.push(callback, context);
      }
      return this;
    }
  };
  Events.prototype.off = function(events, callback, context) {
    var event,
        calls,
        list,
        i;
    if (!(calls = this.callbacks)) {
      return this;
    }
    if (!(events || callback || context)) {
      delete this.callbacks;
      return this;
    }
    events = events ? events.split(eventSplitter) : system.keys(calls);
    while (event = events.shift()) {
      if (!(list = calls[event]) || !(callback || context)) {
        delete calls[event];
        continue;
      }
      for (i = list.length - 2; i >= 0; i -= 2) {
        if (!(callback && list[i] !== callback || context && list[i + 1] !== context)) {
          list.splice(i, 2);
        }
      }
    }
    return this;
  };
  Events.prototype.trigger = function(events) {
    var event,
        calls,
        list,
        i,
        length,
        args,
        all,
        rest;
    if (!(calls = this.callbacks)) {
      return this;
    }
    rest = [];
    events = events.split(eventSplitter);
    for (i = 1, length = arguments.length; i < length; i++) {
      rest[i - 1] = arguments[i];
    }
    while (event = events.shift()) {
      if (all = calls.all) {
        all = all.slice();
      }
      if (list = calls[event]) {
        list = list.slice();
      }
      if (list) {
        for (i = 0, length = list.length; i < length; i += 2) {
          list[i].apply(list[i + 1] || this, rest);
        }
      }
      if (all) {
        args = [event].concat(rest);
        for (i = 0, length = all.length; i < length; i += 2) {
          all[i].apply(all[i + 1] || this, args);
        }
      }
    }
    return this;
  };
  Events.prototype.proxy = function(events) {
    var that = this;
    return (function(arg) {
      that.trigger(events, arg);
    });
  };
  Events.includeIn = function(targetObject) {
    targetObject.on = Events.prototype.on;
    targetObject.off = Events.prototype.off;
    targetObject.trigger = Events.prototype.trigger;
    targetObject.proxy = Events.prototype.proxy;
  };
  return Events;
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("libs/durandal/app.js", ["libs/durandal/system.js", "libs/durandal/viewEngine.js", "libs/durandal/composition.js", "libs/durandal/events.js", "libs/jquery.js"], function(system, viewEngine, composition, Events, $) {
  var app,
      allPluginIds = [],
      allPluginConfigs = [];
  function loadPlugins() {
    return system.defer(function(dfd) {
      if (allPluginIds.length == 0) {
        dfd.resolve();
        return;
      }
      system.acquire(allPluginIds).then(function(loaded) {
        for (var i = 0; i < loaded.length; i++) {
          var currentModule = loaded[i];
          if (currentModule.install) {
            var config = allPluginConfigs[i];
            if (!system.isObject(config)) {
              config = {};
            }
            currentModule.install(config);
            system.log('Plugin:Installed ' + allPluginIds[i]);
          } else {
            system.log('Plugin:Loaded ' + allPluginIds[i]);
          }
        }
        dfd.resolve();
      }).fail(function(err) {
        system.error('Failed to load plugin(s). Details: ' + err.message);
      });
    }).promise();
  }
  app = {
    title: 'Application',
    configurePlugins: function(config, baseUrl) {
      var pluginIds = system.keys(config);
      baseUrl = baseUrl || 'plugins/';
      if (baseUrl.indexOf('/', baseUrl.length - 1) === -1) {
        baseUrl += '/';
      }
      for (var i = 0; i < pluginIds.length; i++) {
        var key = pluginIds[i];
        allPluginIds.push(baseUrl + key);
        allPluginConfigs.push(config[key]);
      }
    },
    start: function() {
      system.log('Application:Starting');
      if (this.title) {
        document.title = this.title;
      }
      return system.defer(function(dfd) {
        $(function() {
          loadPlugins().then(function() {
            dfd.resolve();
            system.log('Application:Started');
          });
        });
      }).promise();
    },
    setRoot: function(root, transition, applicationHost) {
      var hostElement,
          settings = {
            activate: true,
            transition: transition
          };
      if (!applicationHost || system.isString(applicationHost)) {
        hostElement = document.getElementById(applicationHost || 'applicationHost');
      } else {
        hostElement = applicationHost;
      }
      if (system.isString(root)) {
        if (viewEngine.isViewUrl(root)) {
          settings.view = root;
        } else {
          settings.model = root;
        }
      } else {
        settings.model = root;
      }
      function finishComposition() {
        if (settings.model) {
          if (settings.model.canActivate) {
            try {
              var result = settings.model.canActivate();
              if (result && result.then) {
                result.then(function(actualResult) {
                  if (actualResult) {
                    composition.compose(hostElement, settings);
                  }
                }).fail(function(err) {
                  system.error(err);
                });
              } else if (result) {
                composition.compose(hostElement, settings);
              }
            } catch (er) {
              system.error(er);
            }
          } else {
            composition.compose(hostElement, settings);
          }
        } else {
          composition.compose(hostElement, settings);
        }
      }
      if (system.isString(settings.model)) {
        system.acquire(settings.model).then(function(module) {
          settings.model = system.resolveObject(module);
          finishComposition();
        }).fail(function(err) {
          system.error('Failed to load root module (' + settings.model + '). Details: ' + err.message);
        });
      } else {
        finishComposition();
      }
    }
  };
  Events.includeIn(app);
  return app;
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("errorHandling/httpErrorHandlerRegistrator.js", [], function() {
  "use strict";
  var registeredHandlers = {};
  var registerHandler = function(status, handler) {
    if (!_.isNullOrUndefined(this.registeredHandlers[status])) {
      throw 'Error handler for status code ' + status + ' has already been registered.';
    }
    if (!_.isFunction(handler.handleError)) {
      throw 'Error handler has to expose \'handleError()\' method';
    }
    this.registeredHandlers[status] = handler;
  };
  return {
    registerHandler: registerHandler,
    registeredHandlers: registeredHandlers
  };
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("libs/durandal/plugins/history.js", ["libs/durandal/system.js", "libs/jquery.js"], function(system, $) {
  var routeStripper = /^[#\/]|\s+$/g;
  var rootStripper = /^\/+|\/+$/g;
  var isExplorer = /msie [\w.]+/;
  var trailingSlash = /\/$/;
  function updateHash(location, fragment, replace) {
    if (replace) {
      var href = location.href.replace(/(javascript:|#).*$/, '');
      if (history.history.replaceState) {
        history.history.replaceState({}, document.title, href + '#' + fragment);
      } else {
        location.replace(href + '#' + fragment);
      }
    } else {
      location.hash = '#' + fragment;
    }
  }
  ;
  var history = {
    interval: 50,
    active: false
  };
  if (typeof window !== 'undefined') {
    history.location = window.location;
    history.history = window.history;
  }
  history.getHash = function(window) {
    var match = (window || history).location.href.match(/#(.*)$/);
    return match ? match[1] : '';
  };
  history.getFragment = function(fragment, forcePushState) {
    if (fragment == null) {
      if (history._hasPushState || !history._wantsHashChange || forcePushState) {
        fragment = history.location.pathname + history.location.search;
        var root = history.root.replace(trailingSlash, '');
        if (!fragment.indexOf(root)) {
          fragment = fragment.substr(root.length);
        }
      } else {
        fragment = history.getHash();
      }
    }
    return fragment.replace(routeStripper, '');
  };
  history.activate = function(options) {
    if (history.active) {
      system.error("History has already been activated.");
    }
    history.active = true;
    history.options = system.extend({}, {root: '/'}, history.options, options);
    history.root = history.options.root;
    history._wantsHashChange = history.options.hashChange !== false;
    history._wantsPushState = !!history.options.pushState;
    history._hasPushState = !!(history.options.pushState && history.history && history.history.pushState);
    var fragment = history.getFragment();
    var docMode = document.documentMode;
    var oldIE = (isExplorer.exec(navigator.userAgent.toLowerCase()) && (!docMode || docMode <= 7));
    history.root = ('/' + history.root + '/').replace(rootStripper, '/');
    if (oldIE && history._wantsHashChange) {
      history.iframe = $('<iframe src="javascript:0" tabindex="-1" />').hide().appendTo('body')[0].contentWindow;
      history.navigate(fragment, false);
    }
    if (history._hasPushState) {
      $(window).on('popstate', history.checkUrl);
    } else if (history._wantsHashChange && ('onhashchange' in window) && !oldIE) {
      $(window).on('hashchange', history.checkUrl);
    } else if (history._wantsHashChange) {
      history._checkUrlInterval = setInterval(history.checkUrl, history.interval);
    }
    history.fragment = fragment;
    var loc = history.location;
    var atRoot = loc.pathname.replace(/[^\/]$/, '$&/') === history.root;
    if (history._wantsHashChange && history._wantsPushState) {
      if (!history._hasPushState && !atRoot) {
        history.fragment = history.getFragment(null, true);
        history.location.replace(history.root + history.location.search + '#' + history.fragment);
        return true;
      } else if (history._hasPushState && atRoot && loc.hash) {
        this.fragment = history.getHash().replace(routeStripper, '');
        this.history.replaceState({}, document.title, history.root + history.fragment + loc.search);
      }
    }
    if (!history.options.silent) {
      return history.loadUrl(options.startRoute);
    }
  };
  history.deactivate = function() {
    $(window).off('popstate', history.checkUrl).off('hashchange', history.checkUrl);
    clearInterval(history._checkUrlInterval);
    history.active = false;
  };
  history.checkUrl = function() {
    var current = history.getFragment();
    if (current === history.fragment && history.iframe) {
      current = history.getFragment(history.getHash(history.iframe));
    }
    if (current === history.fragment) {
      return false;
    }
    if (history.iframe) {
      history.navigate(current, false);
    }
    history.loadUrl();
  };
  history.loadUrl = function(fragmentOverride) {
    var fragment = history.fragment = history.getFragment(fragmentOverride);
    return history.options.routeHandler ? history.options.routeHandler(fragment) : false;
  };
  history.navigate = function(fragment, options) {
    if (!history.active) {
      return false;
    }
    if (options === undefined) {
      options = {trigger: true};
    } else if (system.isBoolean(options)) {
      options = {trigger: options};
    }
    fragment = history.getFragment(fragment || '');
    if (history.fragment === fragment) {
      return;
    }
    history.fragment = fragment;
    var url = history.root + fragment;
    if (fragment === '' && url !== '/') {
      url = url.slice(0, -1);
    }
    if (history._hasPushState) {
      history.history[options.replace ? 'replaceState' : 'pushState']({}, document.title, url);
    } else if (history._wantsHashChange) {
      updateHash(history.location, fragment, options.replace);
      if (history.iframe && (fragment !== history.getFragment(history.getHash(history.iframe)))) {
        if (!options.replace) {
          history.iframe.document.open().close();
        }
        updateHash(history.iframe.location, fragment, options.replace);
      }
    } else {
      return history.location.assign(url);
    }
    if (options.trigger) {
      return history.loadUrl(fragment);
    }
  };
  history.navigateBack = function() {
    history.history.back();
  };
  return history;
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("libs/durandal/plugins/router.js", ["libs/durandal/system.js", "libs/durandal/app.js", "libs/durandal/activator.js", "libs/durandal/events.js", "libs/durandal/composition.js", "libs/durandal/plugins/history.js", "libs/knockout.js", "libs/jquery.js"], function(system, app, activator, events, composition, history, ko, $) {
  var optionalParam = /\((.*?)\)/g;
  var namedParam = /(\(\?)?:\w+/g;
  var splatParam = /\*\w+/g;
  var escapeRegExp = /[\-{}\[\]+?.,\\\^$|#\s]/g;
  var startDeferred,
      rootRouter;
  var trailingSlash = /\/$/;
  var routesAreCaseSensitive = false;
  var lastUrl = '/',
      lastTryUrl = '/';
  function routeStringToRegExp(routeString) {
    routeString = routeString.replace(escapeRegExp, '\\$&').replace(optionalParam, '(?:$1)?').replace(namedParam, function(match, optional) {
      return optional ? match : '([^\/]+)';
    }).replace(splatParam, '(.*?)');
    return new RegExp('^' + routeString + '$', routesAreCaseSensitive ? undefined : 'i');
  }
  function stripParametersFromRoute(route) {
    var colonIndex = route.indexOf(':');
    var length = colonIndex > 0 ? colonIndex - 1 : route.length;
    return route.substring(0, length);
  }
  function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
  }
  function compareArrays(first, second) {
    if (!first || !second) {
      return false;
    }
    if (first.length != second.length) {
      return false;
    }
    for (var i = 0,
        len = first.length; i < len; i++) {
      if (first[i] != second[i]) {
        return false;
      }
    }
    return true;
  }
  function reconstructUrl(instruction) {
    if (!instruction.queryString) {
      return instruction.fragment;
    }
    return instruction.fragment + '?' + instruction.queryString;
  }
  var createRouter = function() {
    var queue = [],
        isProcessing = ko.observable(false),
        currentActivation,
        currentInstruction,
        activeItem = activator.create();
    var router = {
      handlers: [],
      routes: [],
      navigationModel: ko.observableArray([]),
      activeItem: activeItem,
      isNavigating: ko.computed(function() {
        var current = activeItem();
        var processing = isProcessing();
        var currentRouterIsProcesing = current && current.router && current.router != router && current.router.isNavigating() ? true : false;
        return processing || currentRouterIsProcesing;
      }),
      activeInstruction: ko.observable(null),
      __router__: true
    };
    events.includeIn(router);
    activeItem.settings.areSameItem = function(currentItem, newItem, currentActivationData, newActivationData) {
      if (currentItem == newItem) {
        return compareArrays(currentActivationData, newActivationData);
      }
      return false;
    };
    activeItem.settings.findChildActivator = function(item) {
      if (item && item.router && item.router.parent == router) {
        return item.router.activeItem;
      }
      return null;
    };
    function hasChildRouter(instance, parentRouter) {
      return instance.router && instance.router.parent == parentRouter;
    }
    function setCurrentInstructionRouteIsActive(flag) {
      if (currentInstruction && currentInstruction.config.isActive) {
        currentInstruction.config.isActive(flag);
      }
    }
    function completeNavigation(instance, instruction, mode) {
      system.log('Navigation Complete', instance, instruction);
      var fromModuleId = system.getModuleId(currentActivation);
      if (fromModuleId) {
        router.trigger('router:navigation:from:' + fromModuleId);
      }
      currentActivation = instance;
      setCurrentInstructionRouteIsActive(false);
      currentInstruction = instruction;
      setCurrentInstructionRouteIsActive(true);
      var toModuleId = system.getModuleId(currentActivation);
      if (toModuleId) {
        router.trigger('router:navigation:to:' + toModuleId);
      }
      if (!hasChildRouter(instance, router)) {
        router.updateDocumentTitle(instance, instruction);
      }
      switch (mode) {
        case 'rootRouter':
          lastUrl = reconstructUrl(currentInstruction);
          break;
        case 'rootRouterWithChild':
          lastTryUrl = reconstructUrl(currentInstruction);
          break;
        case 'lastChildRouter':
          lastUrl = lastTryUrl;
          break;
      }
      rootRouter.explicitNavigation = false;
      rootRouter.navigatingBack = false;
      router.trigger('router:navigation:complete', instance, instruction, router);
    }
    function cancelNavigation(instance, instruction) {
      system.log('Navigation Cancelled');
      router.activeInstruction(currentInstruction);
      router.navigate(lastUrl, false);
      isProcessing(false);
      rootRouter.explicitNavigation = false;
      rootRouter.navigatingBack = false;
      router.trigger('router:navigation:cancelled', instance, instruction, router);
    }
    function redirect(url) {
      system.log('Navigation Redirecting');
      isProcessing(false);
      rootRouter.explicitNavigation = false;
      rootRouter.navigatingBack = false;
      router.navigate(url, {
        trigger: true,
        replace: true
      });
    }
    function activateRoute(activator, instance, instruction) {
      rootRouter.navigatingBack = !rootRouter.explicitNavigation && currentActivation != instruction.fragment;
      router.trigger('router:route:activating', instance, instruction, router);
      var options = {canDeactivate: !router.parent};
      activator.activateItem(instance, instruction.params, options).then(function(succeeded) {
        if (succeeded) {
          var previousActivation = currentActivation;
          var withChild = hasChildRouter(instance, router);
          var mode = '';
          if (router.parent) {
            if (!withChild) {
              mode = 'lastChildRouter';
            }
          } else {
            if (withChild) {
              mode = 'rootRouterWithChild';
            } else {
              mode = 'rootRouter';
            }
          }
          completeNavigation(instance, instruction, mode);
          if (withChild) {
            instance.router.trigger('router:route:before-child-routes', instance, instruction, router);
            var fullFragment = instruction.fragment;
            if (instruction.queryString) {
              fullFragment += "?" + instruction.queryString;
            }
            instance.router.loadUrl(fullFragment);
          }
          if (previousActivation == instance) {
            router.attached();
            router.compositionComplete();
          }
        } else if (activator.settings.lifecycleData && activator.settings.lifecycleData.redirect) {
          redirect(activator.settings.lifecycleData.redirect);
        } else {
          cancelNavigation(instance, instruction);
        }
        if (startDeferred) {
          startDeferred.resolve();
          startDeferred = null;
        }
      }).fail(function(err) {
        system.error(err);
      });
    }
    function handleGuardedRoute(activator, instance, instruction) {
      var resultOrPromise = router.guardRoute(instance, instruction);
      if (resultOrPromise || resultOrPromise === '') {
        if (resultOrPromise.then) {
          resultOrPromise.then(function(result) {
            if (result) {
              if (system.isString(result)) {
                redirect(result);
              } else {
                activateRoute(activator, instance, instruction);
              }
            } else {
              cancelNavigation(instance, instruction);
            }
          });
        } else {
          if (system.isString(resultOrPromise)) {
            redirect(resultOrPromise);
          } else {
            activateRoute(activator, instance, instruction);
          }
        }
      } else {
        cancelNavigation(instance, instruction);
      }
    }
    function ensureActivation(activator, instance, instruction) {
      if (router.guardRoute) {
        handleGuardedRoute(activator, instance, instruction);
      } else {
        activateRoute(activator, instance, instruction);
      }
    }
    function canReuseCurrentActivation(instruction) {
      return currentInstruction && currentInstruction.config.moduleId == instruction.config.moduleId && currentActivation && ((currentActivation.canReuseForRoute && currentActivation.canReuseForRoute.apply(currentActivation, instruction.params)) || (!currentActivation.canReuseForRoute && currentActivation.router && currentActivation.router.loadUrl));
    }
    function dequeueInstruction() {
      if (isProcessing()) {
        return;
      }
      var instruction = queue.shift();
      queue = [];
      if (!instruction) {
        return;
      }
      isProcessing(true);
      router.activeInstruction(instruction);
      router.trigger('router:navigation:processing', instruction, router);
      if (canReuseCurrentActivation(instruction)) {
        var tempActivator = activator.create();
        tempActivator.forceActiveItem(currentActivation);
        tempActivator.settings.areSameItem = activeItem.settings.areSameItem;
        tempActivator.settings.findChildActivator = activeItem.settings.findChildActivator;
        ensureActivation(tempActivator, currentActivation, instruction);
      } else if (!instruction.config.moduleId) {
        ensureActivation(activeItem, {
          viewUrl: instruction.config.viewUrl,
          canReuseForRoute: function() {
            return true;
          }
        }, instruction);
      } else {
        system.acquire(instruction.config.moduleId).then(function(m) {
          var instance = system.resolveObject(m);
          if (instruction.config.viewUrl) {
            instance.viewUrl = instruction.config.viewUrl;
          }
          ensureActivation(activeItem, instance, instruction);
        }).fail(function(err) {
          system.error('Failed to load routed module (' + instruction.config.moduleId + '). Details: ' + err.message, err);
        });
      }
    }
    function queueInstruction(instruction) {
      queue.unshift(instruction);
      dequeueInstruction();
    }
    function createParams(routePattern, fragment, queryString) {
      var params = routePattern.exec(fragment).slice(1);
      for (var i = 0; i < params.length; i++) {
        var current = params[i];
        params[i] = current ? decodeURIComponent(current) : null;
      }
      var queryParams = router.parseQueryString(queryString);
      if (queryParams) {
        params.push(queryParams);
      }
      return {
        params: params,
        queryParams: queryParams
      };
    }
    function configureRoute(config) {
      router.trigger('router:route:before-config', config, router);
      if (!system.isRegExp(config.route)) {
        config.title = config.title || router.convertRouteToTitle(config.route);
        if (!config.viewUrl) {
          config.moduleId = config.moduleId || router.convertRouteToModuleId(config.route);
        }
        config.hash = config.hash || router.convertRouteToHash(config.route);
        if (config.hasChildRoutes) {
          config.route = config.route + '*childRoutes';
        }
        config.routePattern = routeStringToRegExp(config.route);
      } else {
        config.routePattern = config.route;
      }
      config.isActive = config.isActive || ko.observable(false);
      router.trigger('router:route:after-config', config, router);
      router.routes.push(config);
      router.route(config.routePattern, function(fragment, queryString) {
        var paramInfo = createParams(config.routePattern, fragment, queryString);
        queueInstruction({
          fragment: fragment,
          queryString: queryString,
          config: config,
          params: paramInfo.params,
          queryParams: paramInfo.queryParams
        });
      });
    }
    ;
    function mapRoute(config) {
      if (system.isArray(config.route)) {
        var isActive = config.isActive || ko.observable(false);
        for (var i = 0,
            length = config.route.length; i < length; i++) {
          var current = system.extend({}, config);
          current.route = config.route[i];
          current.isActive = isActive;
          if (i > 0) {
            delete current.nav;
          }
          configureRoute(current);
        }
      } else {
        configureRoute(config);
      }
      return router;
    }
    router.parseQueryString = function(queryString) {
      var queryObject,
          pairs;
      if (!queryString) {
        return null;
      }
      pairs = queryString.split('&');
      if (pairs.length == 0) {
        return null;
      }
      queryObject = {};
      for (var i = 0; i < pairs.length; i++) {
        var pair = pairs[i];
        if (pair === '') {
          continue;
        }
        var parts = pair.split(/=(.+)?/),
            key = parts[0],
            value = parts[1] && decodeURIComponent(parts[1].replace(/\+/g, ' '));
        var existing = queryObject[key];
        if (existing) {
          if (system.isArray(existing)) {
            existing.push(value);
          } else {
            queryObject[key] = [existing, value];
          }
        } else {
          queryObject[key] = value;
        }
      }
      return queryObject;
    };
    router.route = function(routePattern, callback) {
      router.handlers.push({
        routePattern: routePattern,
        callback: callback
      });
    };
    router.loadUrl = function(fragment) {
      var handlers = router.handlers,
          queryString = null,
          coreFragment = fragment,
          queryIndex = fragment.indexOf('?');
      if (queryIndex != -1) {
        coreFragment = fragment.substring(0, queryIndex);
        queryString = fragment.substr(queryIndex + 1);
      }
      if (router.relativeToParentRouter) {
        var instruction = this.parent.activeInstruction();
        coreFragment = queryIndex == -1 ? instruction.params.join('/') : instruction.params.slice(0, -1).join('/');
        if (coreFragment && coreFragment.charAt(0) == '/') {
          coreFragment = coreFragment.substr(1);
        }
        if (!coreFragment) {
          coreFragment = '';
        }
        coreFragment = coreFragment.replace('//', '/').replace('//', '/');
      }
      coreFragment = coreFragment.replace(trailingSlash, '');
      for (var i = 0; i < handlers.length; i++) {
        var current = handlers[i];
        if (current.routePattern.test(coreFragment)) {
          current.callback(coreFragment, queryString);
          return true;
        }
      }
      system.log('Route Not Found', fragment, currentInstruction);
      router.trigger('router:route:not-found', fragment, router);
      if (router.parent) {
        lastUrl = lastTryUrl;
      }
      history.navigate(lastUrl, {
        trigger: false,
        replace: true
      });
      rootRouter.explicitNavigation = false;
      rootRouter.navigatingBack = false;
      return false;
    };
    var titleSubscription;
    function setTitle(value) {
      var appTitle = ko.unwrap(app.title);
      if (appTitle) {
        document.title = value + " | " + appTitle;
      } else {
        document.title = value;
      }
    }
    if (ko.isObservable(app.title)) {
      app.title.subscribe(function() {
        var instruction = router.activeInstruction();
        var title = instruction != null ? ko.unwrap(instruction.config.title) : '';
        setTitle(title);
      });
    }
    router.updateDocumentTitle = function(instance, instruction) {
      var appTitle = ko.unwrap(app.title),
          title = instruction.config.title;
      if (titleSubscription) {
        titleSubscription.dispose();
      }
      if (title) {
        if (ko.isObservable(title)) {
          titleSubscription = title.subscribe(setTitle);
          setTitle(title());
        } else {
          setTitle(title);
        }
      } else if (appTitle) {
        document.title = appTitle;
      }
    };
    router.navigate = function(fragment, options) {
      if (fragment && fragment.indexOf('://') != -1) {
        window.location.href = fragment;
        return true;
      }
      if (options === undefined || (system.isBoolean(options) && options) || (system.isObject(options) && options.trigger)) {
        rootRouter.explicitNavigation = true;
      }
      if ((system.isBoolean(options) && !options) || (options && options.trigger != undefined && !options.trigger)) {
        lastUrl = fragment;
      }
      return history.navigate(fragment, options);
    };
    router.navigateBack = function() {
      history.navigateBack();
    };
    router.attached = function() {
      router.trigger('router:navigation:attached', currentActivation, currentInstruction, router);
    };
    router.compositionComplete = function() {
      isProcessing(false);
      router.trigger('router:navigation:composition-complete', currentActivation, currentInstruction, router);
      dequeueInstruction();
    };
    router.convertRouteToHash = function(route) {
      route = route.replace(/\*.*$/, '');
      if (router.relativeToParentRouter) {
        var instruction = router.parent.activeInstruction(),
            hash = route ? instruction.config.hash + '/' + route : instruction.config.hash;
        if (history._hasPushState) {
          hash = '/' + hash;
        }
        hash = hash.replace('//', '/').replace('//', '/');
        return hash;
      }
      if (history._hasPushState) {
        return route;
      }
      return "#" + route;
    };
    router.convertRouteToModuleId = function(route) {
      return stripParametersFromRoute(route);
    };
    router.convertRouteToTitle = function(route) {
      var value = stripParametersFromRoute(route);
      return value.substring(0, 1).toUpperCase() + value.substring(1);
    };
    router.map = function(route, config) {
      if (system.isArray(route)) {
        for (var i = 0; i < route.length; i++) {
          router.map(route[i]);
        }
        return router;
      }
      if (system.isString(route) || system.isRegExp(route)) {
        if (!config) {
          config = {};
        } else if (system.isString(config)) {
          config = {moduleId: config};
        }
        config.route = route;
      } else {
        config = route;
      }
      return mapRoute(config);
    };
    router.buildNavigationModel = function(defaultOrder) {
      var nav = [],
          routes = router.routes;
      var fallbackOrder = defaultOrder || 100;
      for (var i = 0; i < routes.length; i++) {
        var current = routes[i];
        if (current.nav) {
          if (!system.isNumber(current.nav)) {
            current.nav = ++fallbackOrder;
          }
          nav.push(current);
        }
      }
      nav.sort(function(a, b) {
        return a.nav - b.nav;
      });
      router.navigationModel(nav);
      return router;
    };
    router.mapUnknownRoutes = function(config, replaceRoute) {
      var catchAllRoute = "*catchall";
      var catchAllPattern = routeStringToRegExp(catchAllRoute);
      router.route(catchAllPattern, function(fragment, queryString) {
        var paramInfo = createParams(catchAllPattern, fragment, queryString);
        var instruction = {
          fragment: fragment,
          queryString: queryString,
          config: {
            route: catchAllRoute,
            routePattern: catchAllPattern
          },
          params: paramInfo.params,
          queryParams: paramInfo.queryParams
        };
        if (!config) {
          instruction.config.moduleId = fragment;
        } else if (system.isString(config)) {
          instruction.config.moduleId = config;
          if (replaceRoute) {
            history.navigate(replaceRoute, {
              trigger: false,
              replace: true
            });
          }
        } else if (system.isFunction(config)) {
          var result = config(instruction);
          if (result && result.then) {
            result.then(function() {
              router.trigger('router:route:before-config', instruction.config, router);
              router.trigger('router:route:after-config', instruction.config, router);
              queueInstruction(instruction);
            });
            return;
          }
        } else {
          instruction.config = config;
          instruction.config.route = catchAllRoute;
          instruction.config.routePattern = catchAllPattern;
        }
        router.trigger('router:route:before-config', instruction.config, router);
        router.trigger('router:route:after-config', instruction.config, router);
        queueInstruction(instruction);
      });
      return router;
    };
    router.reset = function() {
      currentInstruction = currentActivation = undefined;
      router.handlers = [];
      router.routes = [];
      router.off();
      delete router.options;
      return router;
    };
    router.makeRelative = function(settings) {
      if (system.isString(settings)) {
        settings = {
          moduleId: settings,
          route: settings
        };
      }
      if (settings.moduleId && !endsWith(settings.moduleId, '/')) {
        settings.moduleId += '/';
      }
      if (settings.route && !endsWith(settings.route, '/')) {
        settings.route += '/';
      }
      if (settings.fromParent) {
        router.relativeToParentRouter = true;
      }
      router.on('router:route:before-config').then(function(config) {
        if (settings.moduleId) {
          config.moduleId = settings.moduleId + config.moduleId;
        }
        if (settings.route) {
          if (config.route === '') {
            config.route = settings.route.substring(0, settings.route.length - 1);
          } else {
            config.route = settings.route + config.route;
          }
        }
      });
      if (settings.dynamicHash) {
        router.on('router:route:after-config').then(function(config) {
          config.routePattern = routeStringToRegExp(config.route ? settings.dynamicHash + '/' + config.route : settings.dynamicHash);
          config.dynamicHash = config.dynamicHash || ko.observable(config.hash);
        });
        router.on('router:route:before-child-routes').then(function(instance, instruction, parentRouter) {
          var childRouter = instance.router;
          for (var i = 0; i < childRouter.routes.length; i++) {
            var route = childRouter.routes[i];
            var params = instruction.params.slice(0);
            route.hash = childRouter.convertRouteToHash(route.route).replace(namedParam, function(match) {
              return params.length > 0 ? params.shift() : match;
            });
            route.dynamicHash(route.hash);
          }
        });
      }
      return router;
    };
    router.createChildRouter = function() {
      var childRouter = createRouter();
      childRouter.parent = router;
      return childRouter;
    };
    return router;
  };
  rootRouter = createRouter();
  rootRouter.explicitNavigation = false;
  rootRouter.navigatingBack = false;
  rootRouter.makeRoutesCaseSensitive = function() {
    routesAreCaseSensitive = true;
  };
  rootRouter.targetIsThisWindow = function(event) {
    var targetWindow = $(event.target).attr('target');
    if (!targetWindow || targetWindow === window.name || targetWindow === '_self' || (targetWindow === 'top' && window === window.top)) {
      return true;
    }
    return false;
  };
  rootRouter.activate = function(options) {
    return system.defer(function(dfd) {
      startDeferred = dfd;
      rootRouter.options = system.extend({routeHandler: rootRouter.loadUrl}, rootRouter.options, options);
      history.activate(rootRouter.options);
      if (history._hasPushState) {
        var routes = rootRouter.routes,
            i = routes.length;
        while (i--) {
          var current = routes[i];
          current.hash = current.hash.replace('#', '/');
        }
      }
      var rootStripper = rootRouter.options.root && new RegExp("^" + rootRouter.options.root + "/");
      $(document).delegate("a", 'click', function(evt) {
        if (history._hasPushState) {
          if (!evt.altKey && !evt.ctrlKey && !evt.metaKey && !evt.shiftKey && rootRouter.targetIsThisWindow(evt)) {
            var href = $(this).attr("href");
            if (href != null && !(href.charAt(0) === "#" || /^[a-z]+:/i.test(href))) {
              rootRouter.explicitNavigation = true;
              evt.preventDefault();
              if (rootStripper) {
                href = href.replace(rootStripper, "");
              }
              history.navigate(href);
            }
          }
        } else {
          rootRouter.explicitNavigation = true;
        }
      });
      if (history.options.silent && startDeferred) {
        startDeferred.resolve();
        startDeferred = null;
      }
    }).promise();
  };
  rootRouter.deactivate = function() {
    history.deactivate();
  };
  rootRouter.install = function() {
    ko.bindingHandlers.router = {
      init: function() {
        return {controlsDescendantBindings: true};
      },
      update: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var settings = ko.utils.unwrapObservable(valueAccessor()) || {};
        if (settings.__router__) {
          settings = {
            model: settings.activeItem(),
            attached: settings.attached,
            compositionComplete: settings.compositionComplete,
            activate: false
          };
        } else {
          var theRouter = ko.utils.unwrapObservable(settings.router || viewModel.router) || rootRouter;
          settings.model = theRouter.activeItem();
          settings.attached = theRouter.attached;
          settings.compositionComplete = theRouter.compositionComplete;
          settings.activate = false;
        }
        composition.compose(element, settings, bindingContext);
      }
    };
    ko.virtualElements.allowedBindings.router = true;
  };
  return rootRouter;
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("errorHandling/httpErrorHandlers/serviceUnavailableHttpErrorHandler.js", ["libs/durandal/plugins/router.js"], function(router) {
  "use strict";
  var handleError = function() {
    router.reset();
    router.reloadLocation();
  };
  return {handleError: handleError};
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("localization/resources.js", [], {
  save: {
    'en': 'Save',
    'zh-cn': '保存',
    'uk': 'Зберегти',
    'pt-br': 'Salvar'
  },
  cancel: {
    'en': 'Cancel',
    'zh-cn': '取消',
    'uk': 'Скасувати',
    'pt-br': 'Cancelar'
  },
  back: {
    'en': 'Back',
    'zh-cn': '返回',
    'uk': 'Назад',
    'pt-br': 'Voltar'
  },
  open: {
    'en': 'Open',
    'zh-cn': '打开',
    'uk': 'Відкрити',
    'pt-br': 'Abrir'
  },
  select: {
    'en': 'Select',
    'zh-cn': '选择',
    'uk': 'Вибрати',
    'pt-br': 'Selecionar'
  },
  unselect: {
    'en': 'Unselect',
    'zh-cn': '取消选择',
    'uk': 'Скасувати вибір',
    'pt-br': 'De-selecionar'
  },
  goBack: {
    'en': 'Go back',
    'zh-cn': 'Go back[zh-cn]',
    'uk': 'Назад',
    'pt-br': 'Volte'
  },
  remove: {
    'en': 'Remove',
    'zh-cn': '移除',
    'uk': 'Видалити',
    'pt-br': 'Remover'
  },
  expand: {
    'en': 'Expand',
    'zh-cn': '展开',
    'uk': 'Показати більше',
    'pt-br': 'Expandir'
  },
  collapse: {
    'en': 'Collapse',
    'zh-cn': '收起',
    'uk': 'Згорнути',
    'pt-br': 'Minimizar'
  },
  createdOn: {
    'en': 'Created on',
    'zh-cn': '创建于',
    'uk': 'Створено',
    'pt-br': 'Criado em'
  },
  modifiedOn: {
    'en': 'Modified on',
    'zh-cn': '修改于',
    'uk': 'Змінено:',
    'pt-br': 'Modificado em'
  },
  builtOn: {
    'en': 'Built on',
    'zh-cn': '搭建于',
    'uk': 'Побудовано',
    'pt-br': 'Cunstruido em'
  },
  delete: {
    'en': 'Delete',
    'zh-cn': '删除',
    'uk': 'Видалити',
    'pt-br': 'Excluir'
  },
  materials: {
    'en': 'My Library',
    'zh-cn': '我的素材库',
    'uk': 'Мої матеріали',
    'pt-br': 'Minha biblioteca'
  },
  lastEdited: {
    'en': 'Last edited:',
    'zh-cn': '最近编辑',
    'uk': 'Остання зміна:',
    'pt-br': 'Última edição:'
  },
  deleteSelected: {
    'en': 'Delete selected',
    'zh-cn': '删除选中',
    'uk': 'Видалити вибране',
    'pt-br': 'Excluir seleção'
  },
  deleteSeveralCoursesError: {
    'en': 'Please delete your courses one by one. Multi-delete is not implemented yet.',
    'zh-cn': '请逐个删除您的课程，暂不支持批量删除',
    'uk': 'Будь ласка, видаляйте курси по одному. Видалення декількох курсів поки що неможливе.',
    'pt-br': 'Favor excluir seus cursos um a um. Multi-exclusão não está implementada ainda.'
  },
  deleteSeveralObjectivesError: {
    'en': 'Please delete your learning objectives one by one. Multi-delete is not implemented yet.',
    'zh-cn': '请逐个删除您的学习目标，暂不支持批量删除',
    'uk': 'Будь ласка, видаляйте розділи / цілі по одному. Видалення декількох розділів / цілей поки що неможливе.',
    'pt-br': 'Favor excluir seus objetivos de ensino um a um. Multi-exclusão não está implementada ainda.'
  },
  allChangesAreSaved: {
    'en': 'All changes are saved',
    'zh-cn': '已保存所有修改',
    'uk': 'Всі зміни збережено',
    'pt-br': 'Todas as alterações salvas'
  },
  changeOrderTooltip: {
    'en': 'Reorder by dragging',
    'zh-cn': '拖动后重新排序',
    'uk': 'Перетягніть, щоб змінити порядок',
    'pt-br': 'Reordene arrastando'
  },
  title: {
    'en': 'Title',
    'zh-cn': '名称',
    'uk': 'Назва',
    'pt-br': 'Título'
  },
  previewCourse: {
    'en': 'Preview course',
    'zh-cn': '预览课程',
    'uk': 'Перегляд',
    'pt-br': 'Prever curso'
  },
  publish: {
    'en': 'Publish',
    'zh-cn': '发布',
    'uk': 'Публікація',
    'pt-br': 'Publicar'
  },
  update: {
    'en': 'Update',
    'zh-cn': 'Update[zh-cn]',
    'uk': 'Оновити',
    'pt-br': 'Update[pt-br]'
  },
  upgradeNow: {
    'en': 'Upgrade now',
    'zh-cn': '立即升级',
    'uk': 'Змінити план',
    'pt-br': 'Faça upgrade agora'
  },
  renewMyPlan: {
    'en': 'Renew my plan',
    'zh-cn': '续约我的服务',
    'uk': 'Змінити план',
    'pt-br': 'Renove meu plano'
  },
  changeBackgroundImage: {
    'en': 'Change background image',
    'zh-cn': '更换背景图片',
    'uk': 'Змінити фонове зображення',
    'pt-br': 'Troque imagem de fundo'
  },
  imageSizeIsTooLarge: {
    'en': 'Image file cannot be larger than 10 MB. Please reduce the size or use another image',
    'zh-cn': '图片文件不能超过10MB，请缩减大小或者换一张图片',
    'uk': 'Розмір зображення не може перевищувати 10 MB.  Будь ласка, зменшіть розмір або використайте інше зображення.',
    'pt-br': 'arquivo de imagem não pode ser maior que 10 MB. Reduza o tamanho ou use outra imagem'
  },
  imageUploadError: {
    'en': 'Something went wrong uploading the image. Please try again.',
    'zh-cn': '上传图片过程出错，请重试',
    'uk': 'Помилка при завантаженні зображення. Будь ласка спробуйте знову.',
    'pt-br': 'Algo deu errado na carga da imagem. Tente novamente.'
  },
  imageIsNotSupported: {
    'en': 'This file format is not supported. Please use jpg, jpeg, png, gif or bmp',
    'zh-cn': '不支持的文件格式，请使用jpg、jpeg、png、gif或者bmp格式的文件',
    'uk': 'Формат файла не підтримується. Використовуйте такі формати файлів: jpg, jpeg, png, gif чи bmp.',
    'pt-br': 'Este formato de arquivo não é suportado. Favor usar jpg, jpeg, png, gif ou bmp'
  },
  youHaveTo: {
    'en': 'You have to ',
    'zh-cn': '您必须',
    'uk': 'Вам необхідно',
    'pt-br': 'Você deve'
  },
  upgradeYourAccount: {
    'en': 'upgrade your account ',
    'zh-cn': '升级您的账号',
    'uk': 'змінити свій тарифний план',
    'pt-br': 'fazer upgrade da sua conta'
  },
  spellCheckerWindows: {
    'en': '&quot;Ctrl&quot; + &quot;right click&quot; for a spell-checker',
    'zh-cn': '同时按下&quot;Ctrl&quot; + &quot;鼠标右键&quot; 进行拼写检查',
    'uk': '&quot;Ctrl&quot; + &quot;права кнопка миші&quot; для запуску програми перевірки орфографії',
    'pt-br': '&quot;Ctrl&quot; + &quot;clique direito&quot; para verificar ortografia'
  },
  spellCheckerMac: {
    'en': '&quot;Cmd&quot; + &quot;right click&quot; for a spell-checker',
    'zh-cn': '同时按下&quot;Cmd&quot; + &quot;鼠标右键&quot; 进行拼写检查',
    'uk': '&quot;Cmd&quot; + &quot;права кнопка миші&quot; для запуску програми перевірки орфографії',
    'pt-br': '&quot;Cmd&quot; + &quot;clique direito&quot; para verificar ortografia'
  },
  pptxSizeIsTooLarge: {
    'en': 'Presentation file cannot be larger than 10 MB. Please reduce the size or use another presentation.',
    'zh-cn': '演示文件不能超过10MB，请缩减大小或者换另一个演示文件',
    'uk': 'Файл презентації не може перевищувати 10 MB.  Будь ласка, зменшіть розмір або використайте іншу презентацію.',
    'pt-br': 'Arquivo de apresentação não pode exceder 10 MB. Reduza o tamanho ou use outra apresentação.'
  },
  pptxUploadError: {
    'en': 'Something went wrong uploading the presentation. Please try again.',
    'zh-cn': '上传演示文件出错，请重试',
    'uk': 'Помилка при завантаженні презентації. Будь ласка, спробуйте знову.',
    'pt-br': 'Algo deu errado na carga da apresentação. Tente novamente.'
  },
  presentationIsNotSupported: {
    'en': 'This file format is not supported. Please use pptx.',
    'zh-cn': '不支持的文件格式，请使用pptx',
    'uk': 'Формат файла не підтримується. Використовуйте такі формати файлів: pptx.',
    'pt-br': 'Este formatode arquivo não é suportado. Favor usar pptx.'
  },
  uploading: {
    'en': 'Uploading...',
    'zh-cn': 'Uploading...[zh-cn]',
    'uk': 'Завантаження...',
    'pt-br': 'Carregando...'
  },
  chooseBackgroundImage: {
    'en': 'Choose background image',
    'zh-cn': '选择背景图片',
    'uk': 'Виберіть фонове зображення',
    'pt-br': 'Selecione imagem de fundo'
  },
  chooseImage: {
    'en': '&#43; Choose background image',
    'zh-cn': '&#43; 选择背景图片',
    'uk': '&#43; Виберіть фонове зображення',
    'pt-br': '&#43; Selecione imagem de fundo'
  },
  signOutButton: {
    'en': 'Sign out',
    'zh-cn': '退出',
    'uk': 'Вийти',
    'pt-br': 'Sair'
  },
  help: {
    'en': 'Help',
    'zh-cn': '帮助',
    'uk': 'Допомога',
    'pt-br': 'Ajuda'
  },
  link: {
    'en': 'Link',
    'zh-cn': '链接',
    'uk': 'Посилання',
    'pt-br': 'Link'
  },
  embed: {
    'en': 'Embed',
    'zh-cn': '插入',
    'uk': 'HTML-код',
    'pt-br': 'Anexo'
  },
  privateLink: {
    'en': 'Private link',
    'zh-cn': '私人链接',
    'uk': 'Посилання на курс',
    'pt-br': 'Link privado'
  },
  openInNewWindow: {
    'en': 'Open in new window',
    'zh-cn': '在新窗口中打开',
    'uk': 'Відкрити у новій вкладці',
    'pt-br': 'Abrir em nova janela'
  },
  code: {
    'en': 'Code',
    'zh-cn': '代码',
    'uk': 'Код',
    'pt-br': 'Código'
  },
  copy: {
    'en': 'Copy',
    'zh-cn': '拷贝',
    'uk': 'Копіювати',
    'pt-br': 'Copiar'
  },
  copied: {
    'en': 'Copied',
    'zh-cn': '已拷贝',
    'uk': 'Готово',
    'pt-br': 'Copiado'
  },
  move: {
    'en': 'Move',
    'zh-cn': 'Move[zh-cn]',
    'uk': 'Перемістити',
    'pt-br': 'Mover'
  },
  frameSize: {
    'en': 'Frame size:',
    'zh-cn': '框架尺寸',
    'uk': 'Розмір вікна:',
    'pt-br': 'Tamanho do quadro:'
  },
  croppedWidth: {
    'en': 'W:',
    'zh-cn': '宽',
    'uk': 'Ш:',
    'pt-br': 'L:'
  },
  croppedHeight: {
    'en': 'H:',
    'zh-cn': '高',
    'uk': 'В:',
    'pt-br': 'A:'
  },
  width: {
    'en': 'Width:',
    'zh-cn': 'Width:[zh-cn]',
    'uk': 'Ширина:',
    'pt-br': 'Largura:'
  },
  height: {
    'en': 'Height:',
    'zh-cn': 'Height:[zh-cn]',
    'uk': 'Висота:',
    'pt-br': 'Altura:'
  },
  croppedPixels: {
    'en': 'px',
    'zh-cn': '像素',
    'uk': 'пк.',
    'pt-br': 'px'
  },
  getEmbedCode: {
    'en': 'Get embed code',
    'zh-cn': '获取嵌入代码',
    'uk': 'Отримати HTML-код',
    'pt-br': 'Obter código embutido'
  },
  getPrivateLink: {
    'en': 'Get private link',
    'zh-cn': '获取私人链接',
    'uk': 'Отримати посилання для курсу',
    'pt-br': 'Obter link privado'
  },
  updating: {
    'en': 'updating...',
    'zh-cn': '正在更新',
    'uk': 'оновлюється...',
    'pt-br': 'atualizando...'
  },
  updateCourseDescription: {
    'en': 'Apply the latest changes to the published course by clicking this button',
    'zh-cn': '点击此按钮让最新的变更在已发布的课程中生效',
    'uk': 'Натисніть цю кнопку, щоб застосувати останні зміни для опублікованого курсу',
    'pt-br': 'Aplicar últimas alterações ao curso publicado clicando neste botão'
  },
  plus: {
    'en': '&#43;',
    'zh-cn': '&#43;',
    'uk': '&#43;',
    'pt-br': '&#43;'
  },
  minus: {
    'en': '&#8211;',
    'zh-cn': '&#8211;',
    'uk': '&#8211;',
    'pt-br': '&#8211;'
  },
  preview: {
    'en': 'Preview',
    'zh-cn': '预览',
    'uk': 'Переглянути',
    'pt-br': 'Pré-visualização'
  },
  share: {
    'en': 'Share',
    'zh-cn': 'Share[zh-cn]',
    'uk': 'Поділитися',
    'pt-br': 'Compartilhar'
  },
  or: {
    'en': 'Or',
    'zh-cn': 'Or[zh-cn]',
    'uk': 'Або',
    'pt-br': 'Ou'
  },
  soon: {
    'en': 'Soon',
    'zh-cn': 'Soon[zh-cn]',
    'uk': 'незабаром',
    'pt-br': 'Em breve'
  },
  updateChangedCourseDescription: {
    'en': 'This course has been changed since it was last published. Please click on \'Update course\' to apply the latest changes',
    'zh-cn': 'This course has been changed since it was last published. Please click on \'Update course\' to apply the latest changes[zh-cn]',
    'uk': 'Курс було змінено з часу останньої публікації. Натисніть \"Оновити курс\" щоб застосувати зміни',
    'pt-br': 'Este curso foi alterado desde desde que foi publicado a última vez. Clique em \'Atualizar curso\' para aplicar últimas alterações'
  },
  toCourse: {
    'en': 'To course:',
    'zh-cn': 'To course:[zh-cn]',
    'uk': 'В курс:',
    'pt-br': 'Ao curso:'
  },
  toObjective: {
    'en': 'To objective:',
    'zh-cn': 'To objective:[zh-cn]',
    'uk': 'В розділ / ціль:',
    'pt-br': 'Ao objetivo:'
  },
  current: {
    'en': 'Current',
    'zh-cn': 'Current[zh-cn]',
    'uk': 'Поточний',
    'pt-br': 'Corrente'
  },
  duplicate: {
    'en': 'Duplicate',
    'zh-cn': 'Duplicate[zh-cn]',
    'uk': 'Дублювати',
    'pt-br': 'Duplicar'
  },
  email: {
    'en': 'E-mail',
    'zh-cn': 'E-mail',
    'uk': 'E-mail',
    'pt-br': 'E-mail'
  },
  password: {
    'en': 'Password',
    'zh-cn': '密码',
    'uk': 'Пароль',
    'pt-br': 'Senha'
  },
  continue: {
    'en': 'Continue',
    'zh-cn': '继续',
    'uk': 'Продовжити',
    'pt-br': 'Continuar'
  },
  gb: {
    'en': 'Gb',
    'zh-cn': 'Gb[zh-cn]',
    'uk': 'Гб',
    'pt-br': 'Gb'
  },
  mb: {
    'en': 'Mb',
    'zh-cn': 'Mb[zh-cn]',
    'uk': 'Мб',
    'pt-br': 'Mb'
  },
  copyrightText: {
    'en': 'Copyright © 2015 easygenerator. All rights reserved.',
    'zh-cn': 'Copyright © 2015 easygenerator. All rights reserved.',
    'uk': '© 2015 easygenerator. Всі права захищені.',
    'pt-br': 'Copyright © 2015 easygenerator. Todos direitos reservados.'
  },
  termsOfUse: {
    'en': 'Terms of use',
    'zh-cn': '使用说明',
    'uk': 'Умови користування',
    'pt-br': 'Termos de uso'
  },
  privacyPolicy: {
    'en': 'Privacy policy',
    'zh-cn': '隐私条例',
    'uk': 'Політика конфіденційності',
    'pt-br': 'Política de privacidade'
  },
  undo: {
    'en': 'Undo',
    'zh-cn': 'Undo[zh-cn]',
    'uk': 'Відновити',
    'pt-br': 'Desfazer'
  },
  template: {
    'en': 'Template',
    'zh-cn': 'Template[zh-cn]',
    'uk': 'Шаблон',
    'pt-br': 'Modelo'
  },
  settings: {
    'en': 'Settings',
    'zh-cn': 'Settings[zh-cn]',
    'uk': 'Опції',
    'pt-br': 'Configurações'
  },
  PleaseWaitFewMinutes: {
    'en': 'Please wait, it may take few minutes',
    'zh-cn': 'Please wait, it may take few minutes[zh-cn]',
    'uk': 'Будь ласка зачекайте кілька хвилин',
    'pt-br': 'Favor aguardar, isto pode demorar alguns minutos'
  },
  added: {
    'en': 'Added',
    'zh-cn': 'Added[zh-cn]',
    'uk': 'Додано',
    'pt-br': 'Added[pt-br]'
  },
  fixed: {
    'en': 'Fixed',
    'zh-cn': 'Fixed[zh-cn]',
    'uk': 'Виправленно',
    'pt-br': 'Fixed[pt-br]'
  },
  futureFeatures: {
    'en': 'What we are working on',
    'zh-cn': 'What we are working on[zh-cn]',
    'uk': 'Над чим ми працюємо',
    'pt-br': 'What we are working on[pt-br]'
  },
  storageFailed: {
    'en': 'Something went wrong, storage is currently unavailable.',
    'zh-cn': 'Something went wrong, storage is currently unavailable.[zh-cn]',
    'uk': 'Помилка при завантаженні медіа.',
    'pt-br': 'Algo deu errado, armazenamento está indisponível.'
  },
  freeSpace: {
    'en': 'Free space',
    'zh-cn': 'Free space[zh-cn]',
    'uk': 'Вільне місце',
    'pt-br': 'Espaço disponível'
  },
  videoLibrary: {
    'en': 'Video library',
    'zh-cn': 'Video library[zh-cn]',
    'uk': 'Відео бібліотека',
    'pt-br': 'Biblioteca de vídeos'
  },
  uploadVideoDescription: {
    'en': 'Upload your own video by clicking this button',
    'zh-cn': 'Upload your own video by clicking this button[zh-cn]',
    'uk': 'Завантажте своє власне відео натиснувши на кнопку',
    'pt-br': 'Carregue seu proprio video clicando neste botao'
  },
  videoEmbedCodeTitle: {
    'en': 'Embed this code into your content',
    'zh-cn': 'Embed this code into your content[zh-cn]',
    'uk': 'Вставте цей код в ваш контент',
    'pt-br': 'Embuta este código no seu conteúdo'
  },
  videoUpgradeToUpload: {
    'en': 'To upload video to easygenerator',
    'zh-cn': 'To upload video to easygenerator[zh-cn]',
    'uk': 'Для завантаження відео в easygenerator',
    'pt-br': 'para carregar vídeo para o Easygenerator'
  },
  videoUploadShortError: {
    'en': 'Upload failed',
    'zh-cn': 'Upload failed[zh-cn]',
    'uk': 'Помилка завантаження',
    'pt-br': 'Carga falhou'
  },
  videoUpgradeToUploadHtml: {
    'en': '<ul><li>Unlimited storage space (fair use policy)</li><li>Beautiful HD playback</li><li>Unlimited HD plays</li></ul>',
    'zh-cn': '<ul><li>Unlimited storage space (fair use policy)</li><li>Beautiful HD playback</li><li>Unlimited HD plays</li></ul>[zh-cn]',
    'uk': '<ul><li>Необмежений обсяг завантаження</li><li>Відео у високій роздільній здатності</li><li>Необмежена кількість переглядів</li></ul>',
    'pt-br': '<ul><li>Espaço de armazenamento ilimitado (Política de uso justo)</li><li>Linda reprodução em HD</li><li>Reproduções ilimitadas em HD</li></ul>'
  },
  videoUpgradeDialogMaybeLater: {
    'en': 'Maybe later',
    'zh-cn': 'Maybe later[zh-cn]',
    'uk': 'Я зроблю це потім',
    'pt-br': 'Talvez mais tarde'
  },
  videoUploadError: {
    'en': 'Something went wrong while uploading the video. Please try again.',
    'zh-cn': 'Something went wrong while uploading the video. Please try again.[zh-cn]',
    'uk': 'Помилка при завантаженні відео. Будь ласка, спробуйте знову.',
    'pt-br': 'Algo deu errado durante a carga do vídeo. Tente novamente.'
  },
  videoUploadNotAnoughSpace: {
    'en': 'File size exceeds available free space in your plan',
    'zh-cn': 'File size exceeds available free space in your plan[zh-cn]',
    'uk': 'Розмір файлу перевищує доступний вільний простір',
    'pt-br': 'Tamanho de arquivo excede espaço disponível no seu plano'
  },
  audioLibrary: {
    'en': 'Audio library',
    'zh-cn': 'Audio library[zh-cn]',
    'uk': 'Аудіо бібліотека',
    'pt-br': 'Biblioteca de audio'
  },
  uploadAudioDescription: {
    'en': 'Upload your own audio by clicking this button',
    'zh-cn': 'Upload your own audio by clicking this button[zh-cn]',
    'uk': 'Завантажте своє власне аудіо натиснувши на кнопку',
    'pt-br': 'Carregue seu próprio audio clicando este botão'
  },
  audioUploadError: {
    'en': 'Upload failed',
    'zh-cn': 'Upload failed[zh-cn]',
    'uk': 'Помилка завантаження',
    'pt-br': 'Carga falhou'
  },
  audioUploadUpgradeSubtitle: {
    'en': 'to upload audio to easygenerator',
    'zh-cn': 'to upload audio to easygenerator[zh-cn]',
    'uk': 'Для завантаження аудіо в easygenerator',
    'pt-br': 'para carregar audio para o Easygenerator'
  },
  audioUploadUpgradeText: {
    'en': '<ul><li>Unlimited storage space (fair use policy)</li><li>Unlimited number of plays</li><li>HTML5 player: play anywhere on any device</li></ul>',
    'zh-cn': '<ul><li>Unlimited storage space (fair use policy)</li><li>Unlimited number of plays</li><li>HTML5 player: play anywhere on any device</li></ul>[zh-cn]',
    'uk': '<ul><li>Необмежений обсяг завантаження</li><li>Необмежена кількість програвань</li><li>HTML5 програвач: аудіо можна прослухати на будь-якому пристрої</li></ul>',
    'pt-br': '<ul><li>Espaço de armazenagem ilimitado (política de uso justo)</li><li>Bela reprodução</li><li>Ilimitadas reproduções</li></ul>'
  },
  learningObjectives: {
    'en': 'Learning objectives',
    'zh-cn': '学习目标',
    'uk': 'Розділи / Цілі',
    'pt-br': 'Objetivos de aprendizado'
  },
  learningObjective: {
    'en': 'Learning objective',
    'zh-cn': '学习目标',
    'uk': 'Розділ / Ціль',
    'pt-br': 'Objetivo de aprendizado'
  },
  learningObjectiveListIsEmpty: {
    'en': 'Objective list is empty',
    'zh-cn': '空的目标清单',
    'uk': 'Список розділів / цілей порожній',
    'pt-br': 'Lista de objetivos está vazia'
  },
  letsCreateLearningObjective: {
    'en': 'What are your course objectives?',
    'zh-cn': 'What are your course objectives?[zh-cn]',
    'uk': 'Які цілі вашого курсу?',
    'pt-br': 'Quais são seus objetivos de curso?'
  },
  objectiveCannnotBeDeleted: {
    'en': 'Learning objective cannot be deleted when it contains questions or is connected to a course',
    'zh-cn': '不能删除含有问题或者关联了课程的学习目标',
    'uk': 'Неможливо видалити розділ / ціль, так як у ньому є питання чи він входить до курсу',
    'pt-br': 'Objetivo de aprendizado não pode ser excluído quando contém questões ou está conectado a um curso'
  },
  dragLOHere: {
    'en': 'Drag objective here',
    'zh-cn': '拖动学习目标到这',
    'uk': 'Перемістіть розділи / цілі сюди',
    'pt-br': 'Arraste o objetivo para cá'
  },
  dropHere: {
    'en': 'Drop here',
    'zh-cn': '放到这里',
    'uk': 'Перемістити сюди',
    'pt-br': 'Solte aquí'
  },
  allObjectives: {
    'en': 'All objectives',
    'zh-cn': 'All objectives[zh-cn]',
    'uk': 'Усі розділи / цілі',
    'pt-br': 'Todos os objetivos'
  },
  objectivesListEmpty: {
    'en': 'Objectives list is empty...',
    'zh-cn': 'Objectives list is empty...[zh-cn]',
    'uk': 'Список розділей / цілей порожній...',
    'pt-br': 'Lista de objetivos vazia…'
  },
  learningPaths: {
    'en': 'Learning paths',
    'zh-cn': 'Learning paths[zh-cn]',
    'uk': 'Навчальні шляхи',
    'pt-br': 'Caminhos de aprendizado'
  },
  learningPath: {
    'en': 'Learning path',
    'zh-cn': 'Learning path[zh-cn]',
    'uk': 'Навчальний шлях',
    'pt-br': 'Caminho de aprendizado'
  },
  learningPathProperties: {
    'en': 'Learning path properties',
    'zh-cn': 'Learning path properties[zh-cn]',
    'uk': 'Властивості навчального шляху',
    'pt-br': 'Propriedades do caminhos de aprendizado'
  },
  newLaerningPath: {
    'en': 'New learning path',
    'zh-cn': 'New learning path[zh-cn]',
    'uk': 'Новий навчальний шлях',
    'pt-br': 'Novo caminhos de aprendizado'
  },
  createFirstLearningPathHint: {
    'en': 'Create learning path by clicking here',
    'zh-cn': 'Create learning path by clicking here[zh-cn]',
    'uk': 'Створіть навчальний шлях натиснувши цю кнопку',
    'pt-br': 'Criar caminho de aprendizado clicando aquí'
  },
  learningPathTitle: {
    'en': 'Learning path title',
    'zh-cn': 'Learning path title[zh-cn]',
    'uk': 'Назва навчального шляху',
    'pt-br': 'Título do caminho de aprendizado'
  },
  coursesInThePath: {
    'en': 'Courses in the path:',
    'zh-cn': 'Courses in the path:[zh-cn]',
    'uk': 'Курси навчального шляху:',
    'pt-br': 'Cursos no caminho:'
  },
  noCoursesInTheLearningPath: {
    'en': 'No courses in the learning path',
    'zh-cn': 'No courses in the learning path[zh-cn]',
    'uk': 'Навчальний шлях не містить жодного курсу',
    'pt-br': 'Nenhum curso no caminho de aprendizado'
  },
  tooltipLearningPathTitle: {
    'en': 'Learning path',
    'zh-cn': 'Learning path[zh-cn]',
    'uk': 'Навчальний шлях',
    'pt-br': 'Caminho de aprendizado'
  },
  tooltipLearningPathDescription: {
    'en': '<p>A learning path is a sequence of courses, quizzes and exams. It allows the learner to master a topic in small steps, over time.</p>',
    'zh-cn': '<p>A learning path is a sequence of courses, quizzes and exams. It allows the learner to master a topic in small steps, over time.</p>[zh-cn]',
    'uk': '<p>Навчальний шлях - це послідовність курсів та екзаменів, які допоможуть учням освоїти навчальний матеріал крок за кроком.</p>',
    'pt-br': '<p>Um caminho de aprendizado é uma sequência de cursos, testes e exames. Ele permite que o aluno domine um tópico em pequenos passos, ao longo do tempo.</p>'
  },
  tooltipLearningPathLink: {
    'en': '<a style=\"display:none;\" href=\"http://help.easygenerator.com/en-us/starter-and-plus-edition/easygenerator/user-guide/content-and-questions#Content\">read more</a>',
    'zh-cn': '<a style=\"display:none;\" href=\"http://help.easygenerator.com/en-us/starter-and-plus-edition/easygenerator/user-guide/content-and-questions#Content\">read more</a>[zh-cn]',
    'uk': '<a style=\"display:none;\" href=\"http://help.easygenerator.com/en-us/starter-and-plus-edition/easygenerator/user-guide/content-and-questions#Content\">Більше тут</a>',
    'pt-br': '<a style=\"display:none;\" href=\"http://help.easygenerator.com/en-us/starter-and-plus-edition/easygenerator/user-guide/content-and-questions#Content\">leia mais</a>'
  },
  learningPathDefaultTitle: {
    'en': 'Untitled learning path',
    'zh-cn': 'Untitled learning path[zh-cn]',
    'uk': 'Навчальний шлях без назви',
    'pt-br': 'Caminho de aprendizado sem título'
  },
  searchCourses: {
    'en': 'Search courses...',
    'zh-cn': 'Search courses...[zh-cn]',
    'uk': 'Пошук курсів...',
    'pt-br': 'Pesquisar cursos...'
  },
  selectCoursesHint: {
    'en': 'Select courses to add them to the learning path',
    'zh-cn': 'Select courses to add them to the learning path[zh-cn]',
    'uk': 'Оберіть курси, які бажаєте додати до навчального шляху',
    'pt-br': 'Selecionar cursos para adicioná-los ao caminho de aprendizado'
  },
  addCourses: {
    'en': 'Add courses',
    'zh-cn': 'Add courses[zh-cn]',
    'uk': 'Додати курси',
    'pt-br': 'Adicionar cursos'
  },
  done: {
    'en': 'Done',
    'zh-cn': 'Done[zh-cn]',
    'uk': 'Готово',
    'pt-br': 'Feito'
  },
  removeFromPath: {
    'en': 'Remove from path',
    'zh-cn': 'Remove from path[zh-cn]',
    'uk': 'Видалити зі шляху',
    'pt-br': 'Remover do caminho'
  },
  learningPathBuildFailed: {
    'en': 'Something went wrong. Try again. Contact support@easygenerator.com if the problem persists. ',
    'zh-cn': '出错了，请重试。如果问题依然存在，请联系support@easygenerator.com解决。',
    'uk': 'Щось пішло не так. Спробуйте знову. Якщо проблема не зникне - надішліть нам електронного листа на адресу support@easygenerator.com',
    'pt-br': 'Algo não funcionou corretamente. Tente novamente. Contate support@easygenerator.com se o problema persistir.'
  },
  deleteLearningPath: {
    'en': 'Delete learning path',
    'zh-cn': 'Delete learning path[zh-cn]',
    'uk': 'Видалити навчальний шлях',
    'pt-br': 'Excluir caminho de aprendizado'
  },
  learningPathUrl: {
    'en': 'Learning path URL',
    'zh-cn': 'Learning path URL[zh-cn]',
    'uk': 'URL навчального шляху',
    'pt-br': 'URL do caminho de aprendizado'
  },
  learningPathCopyLinkDescription: {
    'en': 'Copy and paste the URL of your learning path to share or view.',
    'zh-cn': 'Copy and paste the URL of your learning path to share or view.[zh-cn]',
    'uk': 'Скопіюйте та вставте URL навчального шляху, щоб поділитись чи продивитись його.',
    'pt-br': 'Copie e cole a URL do seu caminho de aprendizado para compartilhar ou ver.'
  },
  getLearningPathLink: {
    'en': 'Get learning path link',
    'zh-cn': 'Get learning path link[zh-cn]',
    'uk': 'Отримати посилання на навчальний шлях',
    'pt-br': 'Obter link do caminho de aprendizado'
  },
  learningPathCopyEmbedCodeDescription: {
    'en': 'Paste this code into your HTML page where you want the learning path to appear',
    'zh-cn': 'Paste this code into your HTML page where you want the learning path to appear[zh-cn]',
    'uk': 'Якщо ви хочете, щоб навчальний шлях з\'явився на вашому сайті, вставте цей код у Вашу HTML сторінку',
    'pt-br': 'Cole este código para sua página HTML onde você deseja onde deseja que o caminho de aprendizado apareça'
  },
  updateLearningPathDescription: {
    'en': 'The learning path might have been changed since it was last published. Click \"Update path\" to apply last changes.',
    'zh-cn': 'The learning path might have been changed since it was last published. Click \"Update path\" to apply last changes.[zh-cn]',
    'uk': 'Навчальний шлях може містити зміни з часу останньої публікації. Натисніть \"Оновити шлях\" щоб застосувати зміни',
    'pt-br': 'O caminho de aprendizado pode ter sido alterado desde que foi publicado a última vez. Clique \"Atualizar caminho\" para aplicar as últimas alterações.'
  },
  updateLearningPath: {
    'en': 'Update path',
    'zh-cn': 'Update path[zh-cn]',
    'uk': 'Оновити шлях',
    'pt-br': 'Atualizar caminho'
  },
  downloadAsHtml: {
    'en': 'Download as HTML',
    'zh-cn': '下载为HTML格式',
    'uk': 'Завантажити пакет HTML',
    'pt-br': 'Baixar como HTML'
  },
  downloadAsHtmlDescription: {
    'en': 'Publish to your webserver or cloud storage',
    'zh-cn': '在您的网站或者云存储上发布',
    'uk': 'Опублікуйте на своєму веб-сервері чи хмарній системі зберігання даних',
    'pt-br': 'Publicar para o seu servidor web ou armazenamento na nuvem'
  },
  learningPathDownloadAsHtmlHint1: {
    'en': 'Want to run your learning path offline on your desktop or on your own server?',
    'zh-cn': 'Want to run your learning path offline on your desktop or on your own server?[zh-cn]',
    'uk': 'Хочете запустити свій навчальний шлях в режимі офлайн чи на власному сервері?',
    'pt-br': 'Deseja executar seu caminho de aprendizado offline em seu desktop ou em seu próprio servidor?'
  },
  learningPathDownloadAsHtmlHint2: {
    'en': 'We package up all the HTML, CSS and JS of your learning path for you to download.',
    'zh-cn': 'We package up all the HTML, CSS and JS of your learning path for you to download.[zh-cn]',
    'uk': 'Ми створимо HTML, CSS,  JS пакет для Вас.',
    'pt-br': 'Empacotamos todos os HTML, CSS e JS do seu caminho de aprendizado para você baixar.'
  },
  shareLearningPathTitle: {
    'en': 'Get an easygenerator link and share',
    'zh-cn': '获取easygenerator链接并分享',
    'uk': 'Опублікувати навчальний шлях та поділитися ним',
    'pt-br': 'Obter um link easygenerator e compartilhar'
  },
  courses: {
    'en': 'Courses',
    'zh-cn': '课程',
    'uk': 'Курси',
    'pt-br': 'Cursos'
  },
  course: {
    'en': 'Course',
    'zh-cn': '课程',
    'uk': 'Курс',
    'pt-br': 'Curso'
  },
  existingCourse: {
    'en': 'Existing course',
    'zh-cn': 'Existing course[zh-cn]',
    'uk': 'Існуючий курс',
    'pt-br': 'Existing course[pt-br]'
  },
  courseIsDuplicating: {
    'en': 'Course is duplicating...',
    'zh-cn': 'Course is duplicating...[zh-cn]',
    'uk': 'Курс дублюється...',
    'pt-br': 'Curso sendo duplicado...'
  },
  coursesUpgradeToHaveMore: {
    'en': 'To have more courses',
    'zh-cn': 'To have more courses[zh-cn]',
    'uk': 'Щоб мати більше курсів',
    'pt-br': 'Para ter mais cursos'
  },
  coursesUpgradeToHaveMoreHtml: {
    'en': '<ul><li>Unlimited number of courses</li><li>Unlimited storage space (fair use policy)</li><li>Unlimited number of duplicates</li></ul>',
    'zh-cn': '<ul><li>Unlimited number of courses</li><li>Unlimited storage space (fair use policy)</li><li>Unlimited number of duplicates</li></ul>[zh-cn]',
    'uk': '<ul><li>Необмежена кількість курсів</li><li>Необмежений обсяг інформації</li><li>Необмежена кількість дублікацій</li></ul>',
    'pt-br': '<ul><li>Ilimitado número de cursos</li><li>Espaço ilimitado de armazenamento (política de uso justo)</li><li>Quantidade ilimitada de duplicaçoes</li></ul>'
  },
  courseDownloadAction: {
    'en': 'Download as HTML',
    'zh-cn': '下载为HTML格式',
    'uk': 'Завантажити пакет HTML',
    'pt-br': 'Download como HTML'
  },
  courseDownloadScormAction: {
    'en': 'Download as SCORM 1.2',
    'zh-cn': '下载为SCORM 1.2格式',
    'uk': 'Завантажити пакет SCORM 1.2',
    'pt-br': 'Download como SCORM 1.2'
  },
  courseCannotBeDeleted: {
    'en': 'Course cannot be deleted when it has learning objective(s)',
    'zh-cn': '不能删除有学习目标的课程',
    'uk': 'Неможливо видалити курс, так як в ньому є розділ(и) / цілі',
    'pt-br': 'Curso não pode ser excluído quando ele tem objetivo(s) de aprendizado'
  },
  courseCannotBeDeletedErrorMessage: {
    'en': 'Course cannot be deleted if it has learning objective(s) or connected to learning path(s)',
    'zh-cn': 'Course cannot be deleted if it has learning objective(s) or connected to learning path(s)[zh-cn]',
    'uk': 'Course cannot be deleted if it has learning objective(s) or connected to learning path(s)[uk]',
    'pt-br': 'Curso não pode ser excluido se tiver objetivo(s) de aprendizado ou estiver conectado a caminho(s) de aprendizado'
  },
  courseCreateItem: {
    'en': 'Create',
    'zh-cn': '创建',
    'uk': 'Створення',
    'pt-br': 'Criar'
  },
  courseDesignItem: {
    'en': 'Design',
    'zh-cn': '设计',
    'uk': 'Дизайн',
    'pt-br': 'Desenvolver'
  },
  courseConfigureItem: {
    'en': 'Configure',
    'zh-cn': 'Configure[zh-cn]',
    'uk': 'Конфігурація',
    'pt-br': 'Configurar'
  },
  coursePublishItem: {
    'en': 'Publish',
    'zh-cn': '发布',
    'uk': 'Публікація',
    'pt-br': 'Publicar'
  },
  courseResultsItem: {
    'en': 'Results',
    'zh-cn': '结果',
    'uk': 'Результати',
    'pt-br': 'Resultados'
  },
  currentTemplate: {
    'en': 'Current template',
    'zh-cn': '现有课程模板',
    'uk': 'Поточний шаблон',
    'pt-br': 'Modelo atual'
  },
  templateChanged: {
    'en': 'Template has been changed',
    'zh-cn': 'Template has been changed[zh-cn]',
    'uk': 'Шаблон змінено',
    'pt-br': 'Modelo foi modificado'
  },
  templateSettingsError: {
    'en': 'Changes have NOT been saved. Please reload the page and change the settings again. Contact support@easygenerator.com if problem persists.',
    'zh-cn': 'Changes have NOT been saved. Please reload the page and change the settings again. Contact support@easygenerator.com if problem persists.[zh-cn]',
    'uk': 'Зміни не були збережені. Будь ласка перезавантажте сторінку і змініть налаштування знову. Зв\'яжіться з support@easygenerator.com якщо проблема повторюється.',
    'pt-br': 'Modificações NÃO foram salvas. Favor recarregar a página e alterar as configurações novamente. Contate support@easygenerator.com se o problema persistir.'
  },
  republishOnline: {
    'en': 'Update published course',
    'zh-cn': '更新已经发布的课程',
    'uk': 'Оновити опублікований курс',
    'pt-br': 'Atualizar curso publicado'
  },
  publishing: {
    'en': 'Publishing...',
    'zh-cn': '发布中…',
    'uk': 'Публікація...',
    'pt-br': 'Publicando...'
  },
  publishFailed: {
    'en': 'Something went wrong. Try again. Contact support@easygenerator.com if the problem persists. ',
    'zh-cn': '出错了，请重试。如果问题依然存在，请联系support@easygenerator.com解决。',
    'uk': 'Щось пішло не так. Спробуйте знову. Якщо проблема не зникне - надішліть нам електронного листа на адресу support@easygenerator.com',
    'pt-br': 'Algo deu errado. Tente novamente. Contate support@easygenerator.com se o problema persistir.'
  },
  publishCourse: {
    'en': 'Get an easygenerator link and share',
    'zh-cn': '获取easygenerator链接并分享',
    'uk': 'Опублікувати курс та поділитися ним',
    'pt-br': 'Obter um link easygenerator e compartilhar'
  },
  downloadCourse: {
    'en': 'Publish to your webserver or cloud storage',
    'zh-cn': '在您的网站或者云存储上发布',
    'uk': 'Опублікуйте на своєму веб-сервері чи хмарній системі зберігання даних',
    'pt-br': 'Publicar para o seu servidor web ou armazenamento na nuvem'
  },
  downloadScorm12Package: {
    'en': 'Publish to LMS',
    'zh-cn': '发布到LMS',
    'uk': 'Публікація у LMS',
    'pt-br': 'Publicar para um LMS (SGA)'
  },
  assembling: {
    'en': 'Publishing...',
    'zh-cn': '发布中…',
    'uk': 'Публікація...',
    'pt-br': 'Publicando...'
  },
  upgradeToStarterPlanToUseScormErrorMessage: {
    'en': 'Upgrade your account to \"Starter plan\" to download a SCORM course',
    'zh-cn': '升级账户到“Starter服务”以便下载SCORM课程',
    'uk': 'Оновіть свій тарифний план до \"Starter plan\", щоб завантажити пакет SCORM',
    'pt-br': 'Faça upgrade da sua conta para \"Plano iniciante\" para fazer download de um curso SCORM'
  },
  upgradeToStarterPlanToUseScormMessage: {
    'en': 'in order to download SCORM 1.2 package',
    'zh-cn': '以便 下载 SCORM 1.2 数据包',
    'uk': 'для того щоб завантажити пакет SCORM 1.2 ',
    'pt-br': 'para download de um pacote SCORM 1.2'
  },
  publishToAim4You: {
    'en': 'Publish to Aim4You',
    'zh-cn': '发布到Aim 4 You',
    'uk': 'Публікація в Aim4You',
    'pt-br': 'Publicar para Aim4You'
  },
  publishToAim4YouPublishDescription: {
    'en': 'with our partner Aim 4 You',
    'zh-cn': '使用我们的合作伙伴Aim 4 You',
    'uk': 'з нашим партнером Aim 4 You',
    'pt-br': 'com nosso parceiro Aim 4 You'
  },
  publishToAim4YouSuccessMessage: {
    'en': 'Your course is successfully uploaded. You will receive an email with more details after the publication is finished.',
    'zh-cn': '您的课程已经上传成功，您会在发布完成后收到一封带有详细内容的邮件。',
    'uk': 'Ваш курс успішно завантажено. Після того як публікація буде завершена, Ви отримаєте листа на свою електронну скриньку.',
    'pt-br': 'Seu curso foi carregado com sucesso. Você receberá um e-mail com mais detalhes após a publicação terminar.'
  },
  register: {
    'en': 'Register',
    'zh-cn': '注册',
    'uk': 'Реєстрація',
    'pt-br': 'Registrar'
  },
  publishToStore: {
    'en': 'Publish to Aim 4 You',
    'zh-cn': '发布到Aim 4 You',
    'uk': 'Публікація в Aim 4 You',
    'pt-br': 'Publicar para Aim 4 You'
  },
  publishToCatalog: {
    'en': 'Publish and Sell your online course',
    'zh-cn': '发布并出售您的在线课程',
    'uk': 'Публікуй і продавай свої курси онлайн',
    'pt-br': 'Publicar e vender curso online'
  },
  editIntroduction: {
    'en': 'Edit introduction',
    'zh-cn': 'Edit introduction[zh-cn]',
    'uk': 'Редагувати',
    'pt-br': 'Editar introdução'
  },
  addCourseIntroduction: {
    'en': 'Add course introduction',
    'zh-cn': 'Add course introduction[zh-cn]',
    'uk': 'Додати інформацію про курс',
    'pt-br': 'Acrescentar introdução de curso'
  },
  startFromHere: {
    'en': 'Start from here',
    'zh-cn': '从这里开始',
    'uk': 'Почніть звідси',
    'pt-br': 'Comecar aqui'
  },
  courseListIsEmpty: {
    'en': 'Course list is empty',
    'zh-cn': '清单中没有课程',
    'uk': 'Список курсів порожній',
    'pt-br': 'Lista de cursos está vazia'
  },
  upgradeNowBtn: {
    'en': 'Upgrade now',
    'zh-cn': '立即升级',
    'uk': 'Оновити план',
    'pt-br': 'Upgrade agora'
  },
  limitCoursesInformerTextForStarter: {
    'en': 'You have reached the limit of ',
    'zh-cn': '受限',
    'uk': 'Ви досягли дозволеної кількості у ',
    'pt-br': 'Você atingiu o limite de'
  },
  limitCoursesInformerTextForFreeUser: {
    'en': 'You have reached the limit of ',
    'zh-cn': '受限',
    'uk': 'Ви досягли дозволеної кількості у ',
    'pt-br': 'Você atingiu o limite de'
  },
  limitCoursesInformerTextEnd: {
    'en': 'courses.',
    'zh-cn': '课程',
    'uk': 'курсів.',
    'pt-br': 'cursos.'
  },
  upgradeToNextPlanToCreateMoreCoursesErrorMessage: {
    'en': 'Please upgrade your account to the next plan to be able to create more courses.',
    'zh-cn': '请将您的账户升级到更高级别来创建更多课程',
    'uk': 'Змініть Ваш тарифний план, щоб продовжити створювати курси.',
    'pt-br': 'Por favor faça upgrade da sua conta para o próximo plano para poder criar mais cursos.'
  },
  relatedLearningObjectives: {
    'en': 'Course objectives',
    'zh-cn': '课程目标',
    'uk': 'Розділи / цілі курсу',
    'pt-br': 'Objetivos de curso'
  },
  sharedCourses: {
    'en': 'Shared courses',
    'zh-cn': '共享的课程',
    'uk': 'Спільні курси',
    'pt-br': 'Cursos compartilhados'
  },
  courseDefaultTitle: {
    'en': 'Untitled course',
    'zh-cn': '没有命名的课程',
    'uk': 'Курс без назви',
    'pt-br': 'Curso sem título'
  },
  import: {
    'en': 'Import',
    'zh-cn': '导入',
    'uk': 'Імпортувати',
    'pt-br': 'Importar'
  },
  publishNow: {
    'en': 'Publish now',
    'zh-cn': '现在发布',
    'uk': 'Публікація',
    'pt-br': 'Publicar agora'
  },
  learnersResults: {
    'en': 'Learners results',
    'zh-cn': '学习者成绩',
    'uk': 'Результати',
    'pt-br': 'Resultados do aluno'
  },
  downloadLearnersResults: {
    'en': 'Download results',
    'zh-cn': 'Download results[zh-cn]',
    'uk': 'Завантажити результати',
    'pt-br': 'Baixar resultados'
  },
  nameAndEmail: {
    'en': 'Name (E-mail)',
    'zh-cn': '姓名（Email）',
    'uk': 'Ім\'я (e-mail)',
    'pt-br': 'Nome (E-mail)'
  },
  result: {
    'en': 'Result',
    'zh-cn': '结果',
    'uk': 'Результат',
    'pt-br': 'Resultado'
  },
  score: {
    'en': 'Score',
    'zh-cn': '分数',
    'uk': 'Оцінка',
    'pt-br': 'Pontuação'
  },
  dateTime: {
    'en': 'Date Time',
    'zh-cn': '日期时间',
    'uk': 'Дата Час',
    'pt-br': 'Data Hora'
  },
  date: {
    'en': 'Date',
    'zh-cn': 'Date[zh-cn]',
    'uk': 'Дата',
    'pt-br': 'Data'
  },
  time: {
    'en': 'Time',
    'zh-cn': 'Time[zh-cn]',
    'uk': 'Час',
    'pt-br': 'Hora'
  },
  showMoreResults: {
    'en': 'Show more results',
    'zh-cn': 'Show more results[zh-cn]',
    'uk': 'Показати більше результатів',
    'pt-br': 'Mostrar mais resultados'
  },
  noReportedResults: {
    'en': 'No reported results yet...',
    'zh-cn': '尚未报告结果',
    'uk': 'Результати відсутні',
    'pt-br': 'Ainda sem resultados...'
  },
  makeSureTrackingResultsIsEnabled: {
    'en': 'Make sure that \"results tracking\" is enabled for this course:',
    'zh-cn': '确保此课程启用了“结果跟踪”',
    'uk': 'Переконайтеся, що \"звітування про результати\" дозволене для даного курсу:',
    'pt-br': 'Certifique-se que \"acompanhar resultados\" está habilitado para este curso:'
  },
  goToConfigureStep: {
    'en': '1. Go to the \"Configure\" step',
    'zh-cn': '1. Go to the \"Configure\" step[zh-cn]',
    'uk': '1. Перейти до \"Конфігурації\"',
    'pt-br': '1. Vá para o passo \"Configurar\"'
  },
  resultTrackingShouldBeEnabled: {
    'en': '2. Enable results tracking',
    'zh-cn': '启用结果跟踪和通过点击“应用”确认',
    'uk': '2. Увімкнути звітування',
    'pt-br': '2. Habilite \"acompanhar resultado\"'
  },
  confirmByApply: {
    'en': '3. Go to the \"Publish\" step and update the course',
    'zh-cn': '去到“发布”环节及更新课程',
    'uk': '3. Перейти до кроку \"Публікація\" і оновити курс',
    'pt-br': '3. Vá para o passo \"Publicar\" e atualize o curso'
  },
  loadingReportedResults: {
    'en': 'Loading data...',
    'zh-cn': '载入数据',
    'uk': 'Завантаження даних...',
    'pt-br': 'Carregando dados...'
  },
  showMore: {
    'en': 'Show More',
    'zh-cn': '显示更多',
    'uk': 'Показати більше',
    'pt-br': 'Mostrar mais'
  },
  passed: {
    'en': 'Passed',
    'zh-cn': '已通过',
    'uk': 'Пройдено',
    'pt-br': 'Passou'
  },
  failed: {
    'en': 'Failed',
    'zh-cn': '失败',
    'uk': 'Не пройдено',
    'pt-br': 'Falhou'
  },
  courseStartedAt: {
    'en': 'Course started at',
    'zh-cn': 'Course started at[zh-cn]',
    'uk': 'Курс почато',
    'pt-br': 'Curso iniciado em'
  },
  courseFinishedAt: {
    'en': 'and finished at',
    'zh-cn': 'and finished at[zh-cn]',
    'uk': 'та закінчено',
    'pt-br': 'e finalizado em'
  },
  reportingObjectiveTitle: {
    'en': 'objective:',
    'zh-cn': 'objective:[zh-cn]',
    'uk': 'розділ / ціль:',
    'pt-br': 'objetivo:'
  },
  repotingNoQuestions: {
    'en': 'No questions have been answered yet or results are not available for this objective',
    'zh-cn': 'No questions have been answered yet or results are not available for this objective[zh-cn]',
    'uk': 'Немає жодного пройденого питання або інформація про цей розділ недоступна',
    'pt-br': 'Nenhuma questão foi respondida ainda ou resultados não estão disponíveis para este objetivo'
  },
  reportingQuestionTitle: {
    'en': 'question:',
    'zh-cn': 'question:[zh-cn]',
    'uk': 'питання:',
    'pt-br': 'questão:'
  },
  reportingScoreNotAvailable: {
    'en': 'N/A',
    'zh-cn': 'N/A[zh-cn]',
    'uk': 'Н/Д',
    'pt-br': 'N/A'
  },
  reportingShowDetails: {
    'en': 'Show details >>',
    'zh-cn': 'Show details >>[zh-cn]',
    'uk': 'Детальніше >>',
    'pt-br': 'Mostrar detalhes >>'
  },
  reportingHideDetails: {
    'en': 'Hide details >>',
    'zh-cn': 'Hide details >>[zh-cn]',
    'uk': 'Приховати >>',
    'pt-br': 'Esconder detalhes >>'
  },
  reportingLearnersAnswer: {
    'en': 'Learners answer',
    'zh-cn': 'Learners answer[zh-cn]',
    'uk': 'Відповідь учня',
    'pt-br': 'Resposta do aluno'
  },
  publishToCompany: {
    'en': 'Publish to {companyName}',
    'zh-cn': 'Publish to {companyName}[zh-cn]',
    'uk': 'Опублікувати в {companyName}',
    'pt-br': 'Publish to {companyName}[pt-br]'
  },
  updateInCompany: {
    'en': 'Update in {companyName}',
    'zh-cn': 'Update in {companyName}[zh-cn]',
    'uk': 'Оновити в {companyName}',
    'pt-br': 'Update in {companyName}[pt-br]'
  },
  publishedCourseIsUpToDate: {
    'en': 'Published course is up-to-date',
    'zh-cn': 'Published course is up-to-date[zh-cn]',
    'uk': 'Опублікований курс є актуальним',
    'pt-br': 'Published course is up-to-date[pt-br]'
  },
  sharePrivateLink: {
    'en': 'Share private link',
    'zh-cn': 'Share private link[zh-cn]',
    'uk': 'Поділитись',
    'pt-br': 'Compartilhar link privado'
  },
  insideAWebsite: {
    'en': 'Inside a website',
    'zh-cn': 'Inside a website[zh-cn]',
    'uk': 'Вставка в сайт',
    'pt-br': 'Dentro de site privado'
  },
  toYourLMS: {
    'en': 'To your LMS',
    'zh-cn': 'To your LMS[zh-cn]',
    'uk': 'До LMS',
    'pt-br': 'Para o seu LMS (SGA)'
  },
  toYourHosting: {
    'en': 'To your hosting',
    'zh-cn': 'To your hosting[zh-cn]',
    'uk': 'До хоcтингу',
    'pt-br': 'Para sua hospedagem'
  },
  sellTheCourse: {
    'en': 'Sell the course',
    'zh-cn': 'Sell the course[zh-cn]',
    'uk': 'Продайте курс',
    'pt-br': 'Venda o curso'
  },
  scormCaptionFirst: {
    'en': 'Want to run your course on LMS or on your SCORM cloud?',
    'zh-cn': 'Want to run your course on LMS or on your SCORM cloud?[zh-cn]',
    'uk': 'Хочете запустити свій курс в LMS або Вашому SCORM сховищі?',
    'pt-br': 'Deseja executar o curso no seu LMS (SGA) em sua nuvem SCORM?'
  },
  scormCaptionSecond: {
    'en': 'We package up all the SCORM 1.2 package.',
    'zh-cn': 'We package up all the SCORM 1.2 package.[zh-cn]',
    'uk': 'Ми створимо SCORM 1.2 пакет.',
    'pt-br': 'Empacotamos todo o pacote SCORM 1.2.'
  },
  publishHtmlCaptionFirst: {
    'en': 'Want to run your course offline on your desktop or on your own server?',
    'zh-cn': 'Want to run your course offline on your desktop or on your own server?[zh-cn]',
    'uk': 'Хочете запустити свій курс в режимі офлайн чи на власному сервері?',
    'pt-br': 'Deseja executar seu curso offline em seu computador ou seu próprio servidor?'
  },
  publishHtmlCaptionSecond: {
    'en': 'We package up all the HTML, CSS and JS of your course for you to download.',
    'zh-cn': 'We package up all the HTML, CSS and JS of your course for you to download.[zh-cn]',
    'uk': 'Ми створимо HTML, CSS,  JS пакет для Вас.',
    'pt-br': 'Empacotamos todos arquivos HTML, CSS e JS do seu curso para você fazer download.'
  },
  embedAsAWidget: {
    'en': 'Embed as a widget',
    'zh-cn': 'Embed as a widget[zh-cn]',
    'uk': 'Вставити як віджет',
    'pt-br': 'Anexado como um widget'
  },
  embedCaption: {
    'en': 'Paste this code into your HTML page where you want the course to appear',
    'zh-cn': 'Paste this code into your HTML page where you want the course to appear[zh-cn]',
    'uk': 'Якщо ви хочете, щоб курс з\'явився на вашому сайті, вставте цей код у Вашу HTML сторінку',
    'pt-br': 'Cole este código na sua página HTML onde você deseja que o curso apareça'
  },
  courseUrl: {
    'en': 'Course URL',
    'zh-cn': 'Course URL[zh-cn]',
    'uk': 'URL курсу',
    'pt-br': 'URL do curso'
  },
  privateLinkCaption: {
    'en': 'Copy and paste the URL of your course to share or view.',
    'zh-cn': 'Copy and paste the URL of your course to share or view.[zh-cn]',
    'uk': 'Скопіюйте та вставте URL курсу, щоб поділитись чи продивитись його.',
    'pt-br': 'Copie e cole a URL do seu curso para compartilhar ou ver.'
  },
  updateCourseCaption: {
    'en': 'Apply the latest changes to the published course by clicking this button',
    'zh-cn': 'Apply the latest changes to the published course by clicking this button[zh-cn]',
    'uk': 'Щоб застосувати останні зміни до Вашого опублікованого курсу, натисніть на цю кнопку',
    'pt-br': 'Aplicar as últimas alterações do curso publicado clicando este botão'
  },
  getCourseLink: {
    'en': 'Get course link',
    'zh-cn': 'Get course link[zh-cn]',
    'uk': 'Отримати посилання на курс',
    'pt-br': 'Obter link de curso'
  },
  change: {
    'en': 'Change',
    'zh-cn': 'Change[zh-cn]',
    'uk': 'Зміна',
    'pt-br': 'Change[pt-br]'
  },
  changeYourCourseTemplate: {
    'en': 'Change your course template',
    'zh-cn': 'Change your course template[zh-cn]',
    'uk': 'Зміна шаблону курсу',
    'pt-br': 'Change your course template[pt-br]'
  },
  createNewObjective: {
    'en': 'Add new course objective',
    'zh-cn': '加入新的课程目标',
    'uk': 'Додати новий розділ / ціль',
    'pt-br': 'Adicionar novo objetivo de curso'
  },
  objectiveDefaultTitle: {
    'en': 'Untitled objective',
    'zh-cn': 'Untitled objective[zh-cn]',
    'uk': 'Розділ / ціль без назви',
    'pt-br': 'Objetivo sem título'
  },
  filter: {
    'en': 'Filter',
    'zh-cn': '筛选',
    'uk': 'Фільтр',
    'pt-br': 'Filtro'
  },
  createAndConnectLearningObjective: {
    'en': 'New objective / section',
    'zh-cn': '新的目标/章节',
    'uk': 'Новий розділ / ціль',
    'pt-br': 'Novo objetivo / seção'
  },
  connectSelected: {
    'en': 'Connect selected',
    'zh-cn': '选择了关联',
    'uk': 'Приєднати вибрані',
    'pt-br': 'Conectar o selecionado'
  },
  disconnectSelected: {
    'en': 'Remove selected',
    'zh-cn': '删除选中',
    'uk': 'Від\'єднати',
    'pt-br': 'Remover o selecionado'
  },
  moreOptions: {
    'en': 'More options',
    'zh-cn': 'More options[zh-cn]',
    'uk': 'Більше можливостей',
    'pt-br': 'Mais opções'
  },
  connectExistingLearningObjectives: {
    'en': 'Add existing objectives',
    'zh-cn': '加入已有目标',
    'uk': 'Додати існуючий розділ / ціль',
    'pt-br': 'Adicionar objetivos existentes'
  },
  connectExisting: {
    'en': 'Connect existing',
    'zh-cn': 'Connect existing[zh-cn]',
    'uk': 'Додати існуючі',
    'pt-br': 'Conectar existente'
  },
  finishConnectingLearningObjectives: {
    'en': 'Confirm',
    'zh-cn': '确认',
    'uk': 'Підтвердити',
    'pt-br': 'Confirmar'
  },
  otherObjectives: {
    'en': 'Available objectives',
    'zh-cn': '可用的目标',
    'uk': 'Наявні розділи / цілі',
    'pt-br': 'Objetivos disponíveis'
  },
  connectedObjectives: {
    'en': 'Course objectives',
    'zh-cn': '课程目标',
    'uk': 'Розділи / цілі курсу',
    'pt-br': 'Objetivos de curso'
  },
  allObjectivesConnected: {
    'en': 'All objectives are used',
    'zh-cn': '所有目标都已经使用',
    'uk': 'Всі розділи / цілі вже використані',
    'pt-br': 'Todos os objetivos estão usados'
  },
  dragAndDropObjectivesHere: {
    'en': '<b>Drop objectives here</b>',
    'zh-cn': '<b>在这里放下目标</b>',
    'uk': 'Перемістіть розділи / цілі сюди',
    'pt-br': '<b>Soltar objetivos aqui</b>'
  },
  howToCreateObjectiveTipHeader: {
    'en': 'Do you know how to create learning objectives?',
    'zh-cn': '您知道怎样创建学习目标吗?',
    'uk': 'Чи знаєте Ви як створювати розділи / цілі?',
    'pt-br': 'Você sabe como criar objetivos de aprendizagem?'
  },
  howToCreateObjectiveTipExamplesHeader: {
    'en': 'Examples',
    'zh-cn': '示例',
    'uk': 'Приклади',
    'pt-br': 'Exemplos'
  },
  howToCreateObjectiveTipExample1: {
    'en': 'Sales executives can assess the likelihood of closing client bid within 10 minutes of first prospect meeting.',
    'zh-cn': '销售团队可以在10分钟内完成出价决策的前期会议',
    'uk': 'Відділ продажів зможе оцінити ймовірність закриття заявки клієнта протягом 10 хвилин з моменту першої зустрічі.',
    'pt-br': 'Executivos de vendas podem avaliar a probabilidade de fechar a oferta do cliente dentro de 10 minutos da primeira reunião de prospecção.'
  },
  howToCreateObjectiveTipExample2: {
    'en': 'HR managers can identify most effective use of gamification in their organization within a month of finishing this course.',
    'zh-cn': '人事经理在完成这门课程的一个月内就可以鉴别游戏化在企业当中如何得到极致的应用。',
    'uk': 'Відділ кадрів зможе визначити найбільш ефективний спосіб використання гейміфікації в організації протягом місяця з моменту завершення курсу.',
    'pt-br': 'Gerentes de RH podem identificar o uso mais efetivo da gamificação em sua organização após um mês após finalizar este curso.'
  },
  howToCreateObjectiveTipExample3: {
    'en': 'Engineering students can identify important data connections in a network.',
    'zh-cn': '工程师学员可以识别网络中的重要数据连接',
    'uk': 'Студенти-інженери зможуть виявити важливі з\'єднання для передачі даних у мережі.',
    'pt-br': 'Estudantes de engenharia podem identificar conexões de dados importantes numa rede.'
  },
  howToCreateObjectiveTipLink: {
    'en': 'Read more',
    'zh-cn': '查看更多',
    'uk': 'Дізнатися більше',
    'pt-br': 'Leia mais'
  },
  howToCreateObjectiveTipText: {
    'en': 'Click here for Help',
    'zh-cn': '点击获取帮助',
    'uk': 'Натисніть для допомоги',
    'pt-br': 'Clique aquí para Ajuda'
  },
  objectiveFromPowerpoint: {
    'en': 'Objective from powerpoint',
    'zh-cn': 'Objective from powerpoint[zh-cn]',
    'uk': 'Розділ з Powerpoint',
    'pt-br': 'Objetivo do powerpoint'
  },
  objectiveHelpText: {
    'en': 'Need help with your objective? Try our new',
    'zh-cn': 'Need help with your objective? Try our new[zh-cn]',
    'uk': 'Потрібна допомога з вашою ціллю? Спробуйте наш новий',
    'pt-br': 'Nescessita ajuda com seu objetivo? Experimente nosso novo'
  },
  objectiveHelpLink: {
    'en': '<a href=\"https://www.easygenerator.com/elearning-learning-objective-maker/\" target=\"_blank\">learning objective maker here</a>',
    'zh-cn': '<a href=\"https://www.easygenerator.com/elearning-learning-objective-maker/\" target=\"_blank\">learning objective maker here</a>[zh-cn]',
    'uk': '<a href=\"https://www.easygenerator.com/elearning-learning-objective-maker/\" target=\"_blank\">генератор навчальних цілей тут</a>',
    'pt-br': '<a href=\"https://www.easygenerator.com/elearning-learning-objective-maker/\" target=\"_blank\">gerador de objetivos de aprendizagem aquí</a>'
  },
  createNewCourse: {
    'en': 'New course',
    'zh-cn': '新课程',
    'uk': 'Новий курс',
    'pt-br': 'Novo curso'
  },
  createCourseButtonTitle: {
    'en': 'Create new course',
    'zh-cn': '创建新课程',
    'uk': 'Створити новий курс',
    'pt-br': 'Criar novo curso'
  },
  createCourseButtonDescription: {
    'en': 'Start a new course from scratch',
    'zh-cn': '创建一个全新课程',
    'uk': 'Створити новий курс з нуля',
    'pt-br': 'Começar novo curso do zero'
  },
  createCourse: {
    'en': 'Create course',
    'zh-cn': '创建课程',
    'uk': 'Створити курс',
    'pt-br': 'Criar curso'
  },
  chooseTemplate: {
    'en': 'Choose template',
    'zh-cn': '选择课程模板',
    'uk': 'Оберіть шаблон',
    'pt-br': 'Selecione modelo'
  },
  defineTemplateDesignSettings: {
    'en': 'Define template design settings',
    'zh-cn': 'Define template design settings[zh-cn]',
    'uk': 'Налаштуйте дизайн шаблону',
    'pt-br': 'Defina configurações de desenho de modelo'
  },
  templateDesignSettingsNotAvailable: {
    'en': 'Sorry, but the selected template doesn\'t contain design settings',
    'zh-cn': 'Sorry, but the selected template doesn\'t contain design settings[zh-cn]',
    'uk': 'Вибачте, але вибраний вами шаблон не підтримує налаштування дизайну',
    'pt-br': 'Descuple, mas o modelo selecionado não contém configurações de desenho'
  },
  templateConfigureSettingsNotAvailable: {
    'en': 'Sorry, but the selected template doesn\'t contain settings',
    'zh-cn': 'Sorry, but the selected template doesn\'t contain settings[zh-cn]',
    'uk': 'Вибачте, але вибраний вами шаблон не підтримує налаштування',
    'pt-br': 'Desculpe, mas o modelo selecionado não contém configurações'
  },
  powerPointImport: {
    'en': 'From PowerPoint',
    'zh-cn': 'From PowerPoint[zh-cn]',
    'uk': 'на базі PowerPoint',
    'pt-br': 'From PowerPoint[pt-br]'
  },
  uploadingPresentation: {
    'en': 'uploading presentation...',
    'zh-cn': '正在上传演示课程',
    'uk': 'завантаження презентації...',
    'pt-br': 'carregando apresentação...'
  },
  importCourseButtonTitle: {
    'en': 'Create from PowerPoint',
    'zh-cn': '从PowerPoint导入',
    'uk': 'Створити курс на базі PowerPoint',
    'pt-br': 'Criar de PowerPoint'
  },
  importCourseButtonDescription: {
    'en': 'Import slides from PowerPoint and use them as your course content',
    'zh-cn': '把PowerPoint导入的幻灯片做为你的课程内容',
    'uk': 'Використайте PowerPoint слайди як контент до курсу',
    'pt-br': 'Importar slides do PowerPoint e usá-los como seu conteudo de curso'
  },
  examTemplateHintText: {
    'en': '<p>Exam will be a part of the Assessment after Aug 28th</p>',
    'zh-cn': '<p>Exam will be a part of the Assessment after Aug 28th</p>[zh-cn]',
    'uk': '<p>Exam will be a part of the Assessment after Aug 28th</p>[uk]',
    'pt-br': '<p>Exam will be a part of the Assessment after Aug 28th</p>[pt-br]'
  },
  examTemplateHintLink: {
    'en': '<a style=\"display:none;\" target=\"_blank\" href=\"http://help.easygenerator.com/en-us/starter-and-plus-edition/easygenerator/user-guide/content-and-questions#Content\">Learn more >></a>',
    'zh-cn': '<a style=\"display:none;\" target=\"_blank\" href=\"http://help.easygenerator.com/en-us/starter-and-plus-edition/easygenerator/user-guide/content-and-questions#Content\">Learn more >></a>[zh-cn]',
    'uk': '<a style=\"display:none;\" target=\"_blank\" href=\"http://help.easygenerator.com/en-us/starter-and-plus-edition/easygenerator/user-guide/content-and-questions#Content\">Learn more >></a>[uk]',
    'pt-br': '<a style=\"display:none;\" target=\"_blank\" href=\"http://help.easygenerator.com/en-us/starter-and-plus-edition/easygenerator/user-guide/content-and-questions#Content\">Learn more >></a>[pt-br]'
  },
  createYourCourse: {
    'en': 'Create your course',
    'zh-cn': 'Create your course[zh-cn]',
    'uk': 'Створення курсу',
    'pt-br': 'Crie seu curso'
  },
  createYourFirstCourse: {
    'en': 'Create your first course',
    'zh-cn': 'Create your first course[zh-cn]',
    'uk': 'Створення Вашого першого курсу',
    'pt-br': 'Crie seu primeiro curso'
  },
  giveNameToYourCourse: {
    'en': 'Give a name to your course...',
    'zh-cn': 'Give a name to your course...[zh-cn]',
    'uk': 'Дайте ім\'я курсу...',
    'pt-br': 'Dê um nome para seu curso...'
  },
  whatDoYouWantToCreate: {
    'en': 'What do you want to create?',
    'zh-cn': 'What do you want to create?[zh-cn]',
    'uk': 'Який курс бажаєте створити?',
    'pt-br': 'O que você deseja criar?'
  },
  templateDescriptionCaption: {
    'en': 'Description:',
    'zh-cn': 'Description:[zh-cn]',
    'uk': 'Опис:',
    'pt-br': 'Descrição:'
  },
  templateDidacticalStructureCaption: {
    'en': 'Didactical structure:',
    'zh-cn': 'Didactical structure:[zh-cn]',
    'uk': 'Дидактична структура:',
    'pt-br': 'Estrutura didática:'
  },
  nextStep: {
    'en': 'Next',
    'zh-cn': 'Next[zh-cn]',
    'uk': 'Далі',
    'pt-br': 'Próximo'
  },
  previous: {
    'en': 'Previous',
    'zh-cn': '前一个',
    'uk': 'Попереднє',
    'pt-br': 'Prévio'
  },
  next: {
    'en': 'Next',
    'zh-cn': '下一个',
    'uk': 'Наступне',
    'pt-br': 'Próximo'
  },
  answerOption: {
    'en': 'Answer option',
    'zh-cn': '答案选项',
    'uk': 'Варіант відповіді',
    'pt-br': 'Opção de resposta'
  },
  answerOptions: {
    'en': 'Answer options',
    'zh-cn': '答案选项',
    'uk': 'Варіанти відповідей',
    'pt-br': 'Opções de resposta'
  },
  questionProperties: {
    'en': 'Question Properties',
    'zh-cn': '问题属性',
    'uk': 'Властивості питання',
    'pt-br': 'Propriedades da questão'
  },
  addAnswerOption: {
    'en': 'Add answer option',
    'zh-cn': '添加答案选项',
    'uk': 'Додати варіант відповіді',
    'pt-br': 'Adicionar opção de resposta'
  },
  deleteAnswerOption: {
    'en': 'Delete answer',
    'zh-cn': '删除答案',
    'uk': 'Видалити варіант відповіді',
    'pt-br': 'Excluir resposta'
  },
  learningContent: {
    'en': 'Content',
    'zh-cn': '内容',
    'uk': 'Навчальний матеріал',
    'pt-br': 'Conteúdo'
  },
  hotspotOnAnImage: {
    'en': 'Add hotspot on an image',
    'zh-cn': 'Add hotspot on an image[zh-cn]',
    'uk': 'Додати підказки на зображення',
    'pt-br': 'Adicionar hotspot em uma imagem'
  },
  clickToAddLearningContent: {
    'en': 'Click to add content',
    'zh-cn': '点击添加内容',
    'uk': 'Натисніть тут, щоб додати ще один навчальний матеріал',
    'pt-br': 'Clique para adicionbar conteúdo'
  },
  addNewAnswerOption: {
    'en': 'Add new answer option',
    'zh-cn': '添加新的答案选项',
    'uk': 'Додати ще один варіант відповіді',
    'pt-br': 'Adicionar nova opção de resposta'
  },
  markAsCorrect: {
    'en': 'Mark as correct',
    'zh-cn': '标记为正确',
    'uk': 'Позначити як правильну',
    'pt-br': 'Marcar como correto'
  },
  markAsIncorrect: {
    'en': 'Mark as incorrect',
    'zh-cn': '标记为错误',
    'uk': 'Позначити як неправильну',
    'pt-br': 'Marcar como incorreto'
  },
  questionContent: {
    'en': 'Question instruction',
    'zh-cn': '问题说明',
    'uk': 'Пояснення',
    'pt-br': 'Instrução de questão'
  },
  addExtraQuestionContent: {
    'en': 'Add  question instruction',
    'zh-cn': '添加问题说明',
    'uk': 'Додати пояснення',
    'pt-br': 'Adicionar instrução de questão'
  },
  hideQuestionContent: {
    'en': 'Hide question instruction',
    'zh-cn': '隐藏问题说明',
    'uk': 'Приховати пояснення',
    'pt-br': 'Esconder instrução de questão'
  },
  showQuestionConent: {
    'en': 'Show question instruction',
    'zh-cn': '显示问题说明',
    'uk': 'Показати пояснення',
    'pt-br': 'Exibir instrução de questão'
  },
  noAnswerOptionsYet: {
    'en': 'No answer options yet',
    'zh-cn': '还没有答案选项',
    'uk': 'Жодного варiанту вiдповiдi ще не створено',
    'pt-br': 'Ainda sem opções de resposta'
  },
  questionTitle: {
    'en': 'Question',
    'zh-cn': '问题',
    'uk': 'Питання',
    'pt-br': 'Questão'
  },
  loadingImage: {
    'en': 'Loading image...',
    'zh-cn': '载入图片中…',
    'uk': 'Завантаження малюнка...',
    'pt-br': 'Carregando imagem...'
  },
  addTextMatchingAnswer: {
    'en': 'New Term/Match',
    'zh-cn': '新的题干/答案',
    'uk': 'Новий термiн/пояснення',
    'pt-br': 'Novo Termo/casado'
  },
  moveCopyQuestion: {
    'en': 'Move/Copy current question',
    'zh-cn': 'Move/Copy current question[zh-cn]',
    'uk': 'Перемістити/Скопіювати дане питання',
    'pt-br': 'Mover/Copiar questão corrente'
  },
  moveCopyQuestionTo: {
    'en': 'Move/Copy question to...',
    'zh-cn': 'Move/Copy question to...[zh-cn]',
    'uk': 'Перемістити/Скопіювати питання в...',
    'pt-br': 'Mover/Copiar questão para...'
  },
  moveCopyErrorMessage: {
    'en': 'There are no objectives in the course. Please choose a course that contains at least one objective.',
    'zh-cn': 'There are no objectives in the course. Please choose a course that contains at least one objective.[zh-cn]',
    'uk': 'Курс не містить розділів/цілей. Будь ласка виберіть курс, що включає в себе хоча б один розділ/ціль.',
    'pt-br': 'Não existem objetivos no curso. Favor selecionar um curso que contenha pelo menos um objetivo.'
  },
  learningContentRemoved: {
    'en': 'Content was removed',
    'zh-cn': 'Content was removed[zh-cn]',
    'uk': 'Навчальний матеріал видалено',
    'pt-br': 'Conteúdo foi removido'
  },
  edit: {
    'en': 'Edit',
    'zh-cn': '编辑',
    'uk': 'Редагувати',
    'pt-br': 'Editar'
  },
  relatedContents: {
    'en': 'Related items',
    'zh-cn': '相关知识点',
    'uk': 'Зв\'язані елементи',
    'pt-br': 'Itens relacionados'
  },
  objectiveProperties: {
    'en': 'Learning objective properties',
    'zh-cn': '学习目标的属性',
    'uk': 'Властивості розділу',
    'pt-br': 'Propriedades do objetivo de aprendizado'
  },
  correctAnswer: {
    'en': 'Correct answer',
    'zh-cn': '正确答案',
    'uk': 'Правильна вiдповiдь',
    'pt-br': 'Resposta correta'
  },
  incorrectAnswer: {
    'en': 'Incorrect answer',
    'zh-cn': '错误答案',
    'uk': 'Неправильна вiдповiдь',
    'pt-br': 'Resposta incorreta'
  },
  itemListIsEmpty: {
    'en': 'Item list is empty',
    'zh-cn': '没有新的知识点',
    'uk': 'Список елементiв порожнiй',
    'pt-br': 'Lista de itens está vazia'
  },
  createNewQuestion: {
    'en': 'New item',
    'zh-cn': '新的知识点',
    'uk': 'Додати',
    'pt-br': 'Nova pergunta'
  },
  newQuestionTitle: {
    'en': 'Untitled question',
    'zh-cn': '未命名的问题',
    'uk': 'Питання без назви',
    'pt-br': 'Questão sem título'
  },
  newInformationContentTitle: {
    'en': 'Untitled content',
    'zh-cn': '未命名的内容',
    'uk': 'Матеріал без назви',
    'pt-br': 'Conteúdo sem título'
  },
  multipleSelect: {
    'en': 'Multiple choice',
    'zh-cn': '多选',
    'uk': 'Декілька з багатьох',
    'pt-br': 'Multipla opção'
  },
  fillInTheBlank: {
    'en': 'Fill in the blanks',
    'zh-cn': '填空',
    'uk': 'Текст з пропусками',
    'pt-br': 'Preencha os espaços'
  },
  addDropdown: {
    'en': 'Add dropdown',
    'zh-cn': '添加下拉表',
    'uk': 'Додати список відповідей',
    'pt-br': 'Adicionar lista suspensa'
  },
  addBlank: {
    'en': 'Add blank',
    'zh-cn': '添加填空处',
    'uk': 'Додати відповідь',
    'pt-br': 'Adicionar espaço'
  },
  fillInTheBlankWatermark: {
    'en': 'Type or paste your content with <span class=\"blankField\"><span class=\"blankValue\">blanks</span><span class=\"close\">&nbsp;</span></span> and <span class=\"\"><span class=\"blankField blankSelect\"><span class=\"blankValue\">dropdowns</span><span class=\"dropDownIndicator\">&nbsp;</span><span class=\"close\">&nbsp;</span></span></span> here...',
    'zh-cn': '在<span class=\"blankField\"><span class=\"blankValue\">空格</span><span class=\"close\">&nbsp;</span></span> 和 <span class=\"\"><span class=\"blankField blankSelect\"><span class=\"blankValue\">下拉表</span><span class=\"dropDownIndicator\">&nbsp;</span><span class=\"close\">&nbsp;</span></span></span>键入或粘贴你的内容',
    'uk': 'Додайте текст з <span class=\"blankField\"><span class=\"blankValue\">відповідями</span><span class=\"close\">&nbsp;</span></span> і <span class=\"\"><span class=\"blankField blankSelect\"><span class=\"blankValue\">списками відповідей</span><span class=\"dropDownIndicator\">&nbsp;</span><span class=\"close\">&nbsp;</span></span></span> тут...',
    'pt-br': 'Digite ou cole seu conteúdo com <span class=\"blankField\"><span class=\"blankValue\">espaços</span><span class=\"close\">&nbsp;</span></span> and <span class=\"\"><span class=\"blankField blankSelect\"><span class=\"blankValue\">Listas suspensas</span><span class=\"dropDownIndicator\">&nbsp;</span><span class=\"close\">&nbsp;</span></span></span> aquí...'
  },
  upgradeAccountToCreateAdvancedQuestionTypes: {
    'en': 'Please upgrade your account to be able to create or copy such question types',
    'zh-cn': '升级您的账户来创建高等问题类别',
    'uk': 'Будь ласка, оновіть свій тарифний план, щоб створювати або копіювати такі типи питань',
    'pt-br': 'Favor fazer upgrade da sua conta para habilitar a criação ou cópia deste tipo de questão'
  },
  dragAndDropText: {
    'en': 'Drag and drop text',
    'zh-cn': '拖拽',
    'uk': 'Тексти на зображенні',
    'pt-br': 'Copiar e colar texto'
  },
  dragAndDropTextDesigner: {
    'en': 'Drag and drop designer',
    'zh-cn': '拖拽设计器',
    'uk': 'Розміщення текстів на зображенні',
    'pt-br': 'Copiar e colar designer'
  },
  dragAndDropTextEmptyBackgroundDescription: {
    'en': 'No background image yet',
    'zh-cn': '还没有背景图片',
    'uk': 'Фонове зображення відсутнє',
    'pt-br': 'Ainda sem imagem de fundo'
  },
  browse: {
    'en': '&#43; Choose background image',
    'zh-cn': '&#43; 选择背景图片',
    'uk': '&#43; Виберіть фонове зображення',
    'pt-br': '&#43; Selecione imagem de fundo'
  },
  addDropspotText: {
    'en': 'Add drop text',
    'zh-cn': '加入拖拽文字',
    'uk': 'Додати текст',
    'pt-br': 'Adicionar texto para soltar'
  },
  singleSelectText: {
    'en': 'Single choice',
    'zh-cn': '单选',
    'uk': 'Один з багатьох',
    'pt-br': 'Seleção símples'
  },
  singleSelectTextEditor: {
    'en': '\"Single choice\" question editor',
    'zh-cn': '“单选”问题编辑',
    'uk': 'Редагування питання \"Один з багатьох\"',
    'pt-br': 'Editor de questão \"Seleção simples\"'
  },
  multipleSelectEditor: {
    'en': '\"Multiple choice\" question editor',
    'zh-cn': '“多选”问题编辑',
    'uk': 'Редагування питання  \"Декілька з багатьох\"',
    'pt-br': 'Editor de questão \"Seleção múltipla\"'
  },
  singleSelectImageEditor: {
    'en': '\"Single choice image\" question editor',
    'zh-cn': '“单选图片”问题编辑',
    'uk': 'Редагування питання \"Вибір зображення\"',
    'pt-br': 'Editor de questão \"Seleção de imagem simples\"'
  },
  fillInTheBlanksEditor: {
    'en': '\"Fill in the blanks\" question editor',
    'zh-cn': '“填空”问题编辑',
    'uk': 'Редагування питання \"Текст з пропусками\"',
    'pt-br': 'Editor de questão \"Preencha os espaços\"'
  },
  DragAndDropTextEditor: {
    'en': '\"Drag and drop text\" question editor',
    'zh-cn': '“拖拽”问题编辑',
    'uk': 'Редагування питання \"Тексти на зображенні\"',
    'pt-br': 'Editor de questão \"Arrastar e soltar texto\"'
  },
  hotSpotTextEditor: {
    'en': '\"Hotspot\" question editor',
    'zh-cn': '“热点”问题编辑器',
    'uk': 'Редагування питання \"Область відповіді\"',
    'pt-br': 'Editor de questão \"Hotspot\"'
  },
  textMatchingEditor: {
    'en': '\"Text matching\" question editor',
    'zh-cn': '“匹配文字”编辑问题',
    'uk': 'Редагування питання \"Вибір відповідності\"',
    'pt-br': 'Editor de questão \"Casar texto\"'
  },
  informationContentEditor: {
    'en': 'Content editor',
    'zh-cn': '内容编辑',
    'uk': 'Редагування матеріалу',
    'pt-br': 'Editor de conteúdo'
  },
  singleSelectImage: {
    'en': 'Single choice image',
    'zh-cn': '单选图像',
    'uk': 'Вибір зображення',
    'pt-br': 'Seleção de imagem simples'
  },
  informationContent: {
    'en': 'Content',
    'zh-cn': '内容',
    'uk': 'Матеріал',
    'pt-br': 'Conteúdo'
  },
  textMatching: {
    'en': 'Text matching',
    'zh-cn': '匹配文字',
    'uk': 'Вибір відповідності',
    'pt-br': 'Casar texto'
  },
  hotspot: {
    'en': 'Hotspot',
    'zh-cn': '热点',
    'uk': 'Область відповіді',
    'pt-br': 'Hotspot'
  },
  keysTitle: {
    'en': 'Term',
    'zh-cn': '题干',
    'uk': 'Термін',
    'pt-br': 'Termo'
  },
  answersTitle: {
    'en': 'Match',
    'zh-cn': '答案',
    'uk': 'Визначення',
    'pt-br': 'Casar'
  },
  addImage: {
    'en': 'Add image',
    'zh-cn': '添加图片',
    'uk': 'Додати ',
    'pt-br': 'Adicionar imagem'
  },
  removeAnswer: {
    'en': 'Remove answer',
    'zh-cn': '移除答案',
    'uk': 'Видалити відповідь',
    'pt-br': 'Remover resposta'
  },
  processing: {
    'en': 'Processing...',
    'zh-cn': '处理中…',
    'uk': 'Обробка...',
    'pt-br': 'Processando...'
  },
  typeDescription: {
    'en': 'Type description...',
    'zh-cn': 'Type description...[zh-cn]',
    'uk': 'Введіть опис...',
    'pt-br': 'Digite a descrição...'
  },
  hotspotOnAnImageEmptyTooltip: {
    'en': 'Click and drag on image to create the hotspot',
    'zh-cn': 'Click and drag on image to create the hotspot[zh-cn]',
    'uk': 'Щоб додати підказку натисніть та потягніть на картинці',
    'pt-br': 'Clique e arraste sobre a imagem para criar hotspot'
  },
  changeImage: {
    'en': 'Change image',
    'zh-cn': '更换图片',
    'uk': 'Змінити ',
    'pt-br': 'Trocar imagem'
  },
  newMultipleChoiceQuestionTitle: {
    'en': 'Untitled multiple choice question',
    'zh-cn': 'Untitled multiple choice question[zh-cn]',
    'uk': 'Питання \"Декілька з багатьох\" без назви',
    'pt-br': 'Questão múltipla seleção sem título'
  },
  newSingleChoiceTextQuestionTitle: {
    'en': 'Untitled single choice question',
    'zh-cn': 'Untitled single choice question[zh-cn]',
    'uk': 'Питання \"Один з багатьох\" без назви',
    'pt-br': 'Questão seleção simples sem título'
  },
  newFillInTheBlanksQuestionTitle: {
    'en': 'Untitled fill in the blanks question',
    'zh-cn': 'Untitled fill in the blanks question[zh-cn]',
    'uk': 'Питання \"Текст з пропусками\" без назви',
    'pt-br': 'Questão preencha os espaços sem título'
  },
  newDragAndDropTextQuestionTitle: {
    'en': 'Untitled drag and drop text question',
    'zh-cn': 'Untitled drag and drop text question[zh-cn]',
    'uk': 'Питання \"Тексти на зображенні\" без назви',
    'pt-br': 'Questão arrastar e soltar sem título'
  },
  newSingleChoiceImageQuestionTitle: {
    'en': 'Untitled single choice image question',
    'zh-cn': 'Untitled single choice image question[zh-cn]',
    'uk': 'Питання \"Вибір зображення\" без назви',
    'pt-br': 'Questão seleção de imagem simples sem título'
  },
  newTextMatchingQuestionTitle: {
    'en': 'Untitled text matching question',
    'zh-cn': 'Untitled text matching question[zh-cn]',
    'uk': 'Питання \"Вибір відповідності\" без назви',
    'pt-br': 'Questão casamento de textos sem título'
  },
  newHotspotQuestionTitle: {
    'en': 'Untitled hotspot question',
    'zh-cn': '未命名的热点问题',
    'uk': 'Питання \"Область відповіді\" без назви',
    'pt-br': 'Questão hotspot sem título'
  },
  hotSpotDesigner: {
    'en': 'Hotspot designer',
    'zh-cn': '热点设计器',
    'uk': 'Конструктор областей відповідей',
    'pt-br': 'Editor de Hotspot'
  },
  singleResponse: {
    'en': 'Single response',
    'zh-cn': '单个响应',
    'uk': 'Одна відповідь',
    'pt-br': 'Resposta simples'
  },
  multipleResponse: {
    'en': 'Multiple response',
    'zh-cn': '多个响应',
    'uk': 'Декілька відповідей',
    'pt-br': 'Resposta múltipla'
  },
  defineHotspots: {
    'en': 'and define hotspots',
    'zh-cn': '并且定义热点',
    'uk': 'та визначіть області відповіді',
    'pt-br': 'e definir hotspots'
  },
  hotspotHasBeenDeletedByCollaborator: {
    'en': 'Hotspot has been deleted by co-author.',
    'zh-cn': '该热点已被共同编辑人删除',
    'uk': 'Область відповіді було видалено співавтором курсу',
    'pt-br': 'Hotspot foi excluído por co-autor.'
  },
  hotSpotTooltipCreate: {
    'en': 'Click and drag to create hotspots',
    'zh-cn': '单击并拖动以创建热点',
    'uk': 'Клікніть і потягніть для створення області відповіді',
    'pt-br': 'Clique e arraste para criar hotspots'
  },
  hotSpotTooltipDrag: {
    'en': 'Click to select hotspot',
    'zh-cn': '单击选中热点',
    'uk': 'Клікніть, щоб вибрати область відповіді',
    'pt-br': 'Clique para selecionar hotspot'
  },
  hotSpotTooltipActive: {
    'en': 'Press \"Delete\" key to remove hotspot',
    'zh-cn': '按“Delete”键删除热点',
    'uk': 'Натисніть клавішу \"Delete\", щоб видалити область відповіді',
    'pt-br': 'Pressione tecla \"Delete\" para remover hotspot'
  },
  hotSpotTooltipResize: {
    'en': 'Drag to change size of hotspot',
    'zh-cn': '拖动改变热点的大小',
    'uk': 'Потягніть за край, щоб змінити розмір області відповіді',
    'pt-br': 'Arraste para alterar tamanho do hotspot'
  },
  statement: {
    'en': 'Statement',
    'zh-cn': '判断',
    'uk': 'Твердження',
    'pt-br': 'Afirmação'
  },
  statementQuestionEditor: {
    'en': '\"Statement\" question editor',
    'zh-cn': '“判断”题编辑器',
    'uk': 'Редактор питання типу \"Твердження\"',
    'pt-br': 'Editor de questão tipo \"Afirmação\"'
  },
  statementsEditor: {
    'en': 'Statements editor',
    'zh-cn': '判断编辑器',
    'uk': 'Редактор тверджень',
    'pt-br': 'Editor de afirmações'
  },
  correctness: {
    'en': 'True / False',
    'zh-cn': '对/错',
    'uk': 'Так / Ні',
    'pt-br': 'Verdadeiro / Falso'
  },
  statements: {
    'en': 'Statement',
    'zh-cn': '判断',
    'uk': 'Твердження',
    'pt-br': 'Afirmação'
  },
  addStatement: {
    'en': 'Add statement',
    'zh-cn': '增加判断',
    'uk': 'Додати твердження',
    'pt-br': 'Adicionar afirmação'
  },
  newStatementQuestionTitle: {
    'en': 'Untitled statement question',
    'zh-cn': '未命名的判断题',
    'uk': 'Питання \"Твердження\" без назви',
    'pt-br': 'Questão tipo afirmação sem título'
  },
  statementTrue: {
    'en': 'TRUE',
    'zh-cn': '对',
    'uk': 'Так',
    'pt-br': 'V'
  },
  statementFalse: {
    'en': 'FALSE',
    'zh-cn': '错',
    'uk': 'Ні',
    'pt-br': 'F'
  },
  newOpenQuestionTitle: {
    'en': 'Untitled open question',
    'zh-cn': 'Untitled open question[zh-cn]',
    'uk': 'Питання \"Розгорнута відповідь\" без назви',
    'pt-br': 'Questão aberta sem título'
  },
  openQuestion: {
    'en': 'Open question',
    'zh-cn': 'Open question[zh-cn]',
    'uk': 'Розгорнута відповідь',
    'pt-br': 'Questão aberta'
  },
  openQuestionEditor: {
    'en': '\"Open question\" editor',
    'zh-cn': '\"Open question\" editor[zh-cn]',
    'uk': 'Редактор питання типу \"Розгорнута відповідь\"',
    'pt-br': 'Editor \"Questão aberta\"'
  },
  createResponseForProvidedAnswer: {
    'en': 'Create response for provided answer',
    'zh-cn': 'Create response for provided answer[zh-cn]',
    'uk': 'При наявності відповіді',
    'pt-br': 'Criar mensagem para pergunta fornecida'
  },
  responseForProvidedAnswer: {
    'en': 'Response for provided answer',
    'zh-cn': 'Response for provided answer[zh-cn]',
    'uk': 'Відгук на дану відповідь',
    'pt-br': 'Mensagem para pergunta fornecida'
  },
  createResponseForEmptyAnswer: {
    'en': 'Create response for empty answer',
    'zh-cn': 'Create response for empty answer[zh-cn]',
    'uk': 'При відсутності відповіді',
    'pt-br': 'Criar mensagem para pergunta vazia'
  },
  responseForEmptyAnswer: {
    'en': 'Response for empty answer',
    'zh-cn': 'Response for empty answer[zh-cn]',
    'uk': 'Відповідь відсутня',
    'pt-br': 'Mensagem para pergunta vazia'
  },
  putYourPositiveFeedback: {
    'en': 'Create response for correct answer',
    'zh-cn': '答对时回应',
    'uk': 'Додайте відгук на правильну відповідь',
    'pt-br': 'Criar mensagem para resposta correta'
  },
  putYourNegativeFeedback: {
    'en': 'Create response for incorrect answer',
    'zh-cn': '答错时回应',
    'uk': 'Додайте відгук на неправильну відповідь',
    'pt-br': 'Criar mensagem para resposta incorreta'
  },
  correctFeedback: {
    'en': 'Response for correct answer',
    'zh-cn': '正确答案的回应',
    'uk': 'Відгук на правильну відповідь',
    'pt-br': 'Mensagem para resposta correta'
  },
  incorrectFeedback: {
    'en': 'Response for incorrect answer',
    'zh-cn': '错误答案的回应',
    'uk': 'Відгук на неправильну відповідь',
    'pt-br': 'Mensagem para resposta incorreta'
  },
  finish: {
    'en': 'Finish',
    'zh-cn': '完成',
    'uk': 'Finish',
    'pt-br': 'Finalizar'
  },
  connectObjectives: {
    'en': 'Use objectives',
    'zh-cn': '使用目标',
    'uk': 'Use objectives',
    'pt-br': 'Usar objetivos'
  },
  connectSelectedObjectives: {
    'en': 'Use as course objectives',
    'zh-cn': '用作课程目标',
    'uk': 'Use as course objectives',
    'pt-br': 'Usar como objetivos de curso'
  },
  disconnectSelectedObjectives: {
    'en': 'Remove selected objectives from course',
    'zh-cn': '从课程中移除选中的目标',
    'uk': 'Remove selected objectives from course',
    'pt-br': 'Remover objetivos selecionados do curso'
  },
  viewCourse: {
    'en': 'View course',
    'zh-cn': '查看课程',
    'uk': 'View course',
    'pt-br': 'Ver curso'
  },
  templateSettings: {
    'en': 'Course template settings:',
    'zh-cn': '课程模板设置',
    'uk': 'Course template settings:',
    'pt-br': 'Configurações do modelo de curso:'
  },
  courseTitle: {
    'en': 'Course title',
    'zh-cn': 'Course title[zh-cn]',
    'uk': 'Назва курсу',
    'pt-br': 'Título do curso'
  },
  pageNotFound: {
    'en': 'The page you requested cannot be found',
    'zh-cn': '找不到要打开的页面',
    'uk': 'Сторінку не знайдено',
    'pt-br': 'A página requisitada não foi encontrada'
  },
  pageNotFoundDescription: {
    'en': 'Click on Home. Open the course and try again. Contact support@easygenerator.com if the problem persists. ',
    'zh-cn': '点击主页，打开课程重试。如果问题依然存在，请联系support@easygenerator.com解决。',
    'uk': 'Перейдіть на домашню сторінку. Натисніть \"Курси\", відкрийте курс та спробуйте ще раз. Якщо проблема не зникне, надішліть нам електронного листа на адресу support@easygenerator.com.',
    'pt-br': 'Clique em Início. Abra o curso e tente novamente. Contate support@easygenerator.com se o problema persistir.'
  },
  homeLink: {
    'en': 'Home',
    'zh-cn': '主页',
    'uk': 'Домашня сторінка',
    'pt-br': 'Início'
  },
  courseNotFoundError: {
    'en': 'There is a problem opening the course.  Click on Courses. Open the course and try again. Contact support@easygenerator.com if the problem persists. ',
    'zh-cn': '打开课程时出现故障。请重试。如果问题依然存在，请联系support@easygenerator.com解决。',
    'uk': 'Виникла проблема в процессі відкриття курсу. Спробуйте відкрити курс ще раз. Якщо проблема не зникне, надішліть нам електронного листа на адресу support@easygenerator.com.',
    'pt-br': 'Houve um problema na abertura do curso. Clique em Cursos. Abra o curso e tente novamente. Contate support@easygenerator.com se o problema persistir.'
  },
  objectiveNotFoundError: {
    'en': 'There is a problem opening the objective.  Click on Courses. Open the course and try again. Contact support@easygenerator.com if the problem persists. ',
    'zh-cn': '打开目标时出现故障，请重试。如果问题依然存在，请联系support@easygenerator.com解决。',
    'uk': 'Виникла проблема в процесі відкриття розділу. Спробуйте відкрити курс ще раз. Якщо проблема не зникне, надішліть нам електронного листа на адресу support@easygenerator.com.',
    'pt-br': 'Houve um problema na abertura do objetivo. Clique em Cursos. Abra o curso e tente novamente. Contate support@easygenerator.com se o problema persistir.'
  },
  learningPathNotFoundError: {
    'en': 'There is a problem opening the learning path.  Click on Laerning paths. Open the learning path and try again. Contact support@easygenerator.com if the problem persists. ',
    'zh-cn': 'There is a problem opening the learning path.  Click on Laerning paths. Open the learning path and try again. Contact support@easygenerator.com if the problem persists. [zh-cn]',
    'uk': 'Виникла проблема в процесі відкриття навчального шляху. Спробуйте відкрити навчальний шлях ще раз. Якщо проблема не зникне, надішліть нам електронного листа на адресу support@easygenerator.com.',
    'pt-br': 'Houve um problema abrinco o caminho de aprendizado. Clique em Caminho de aprendizado. Abra o Caminho de aprendizado e tente novamente. Contate support@easygenerator.com se o problema persistir. persists.'
  },
  objectivesNotFoundError: {
    'en': 'There is a problem opening the objective.  Click on Courses. Open the course and try again. Contact support@easygenerator.com if the problem persists. ',
    'zh-cn': '打开目标时出现故障，请重试。如果问题依然存在，请联系support@easygenerator.com解决。',
    'uk': 'Виникла проблема в процессі відкриття розділу. Спробуйте відкрити курс ще раз. Якщо проблема не зникне, надішліть нам електронного листа на адресу support@easygenerator.com.',
    'pt-br': 'Houve um problema abrindo o objetivo. Clique em Cursos. Abra o curso e tente novamente. Contate support@easygenerator.com se o problema persistir.'
  },
  answerNotFoundError: {
    'en': 'There is a problem opening the answer option.  Click on Courses. Open the course and try again. Contact support@easygenerator.com if the problem persists. ',
    'zh-cn': '打开答案选项时出现故障，请重试。如果问题依然存在，请联系support@easygenerator.com解决。',
    'uk': 'Виникла проблема в процессі відкриття варіанту відповіді. Спробуйте відкрити варіант відповіді ще раз. Якщо проблема не зникне, надішліть нам електронного листа на адресу support@easygenerator.com.',
    'pt-br': 'Houve um problema abrindo a opção de resposta. Clique em Cursos. Abra o curso e tente novamente. Contate support@easygenerator.com se o problema persistir.'
  },
  questionNotFoundError: {
    'en': 'There is a problem opening this question.  Click on Courses. Open the course and try again. Contact support@easygenerator.com if the problem persists. ',
    'zh-cn': '打开问题时出现故障，请重试。如果问题依然存在，请联系support@easygenerator.com解决。',
    'uk': 'Виникла проблема в процессі відкриття питання. Спробуйте відкрити запитання ще раз. Якщо проблема не зникне, надішліть нам електронного листа на адресу support@easygenerator.com.',
    'pt-br': 'Houve um problema abrindo esta questão. Clique em Cursos. Abra o curso e tente novamente. Contate support@easygenerator.com se o problema persistir.'
  },
  learningContentNotFoundError: {
    'en': 'There is a problem opening this content.  Click on Courses. Open the course and try again. Contact support@easygenerator.com if the problem persists. ',
    'zh-cn': '打开内容时出现故障，请重试。如果问题依然存在，请联系support@easygenerator.com解决。',
    'uk': 'Виникла проблема в процессі відкриття навчального матеріалу. Спробуйте відкрити матеріал ще раз. Якщо проблема не зникне, надішліть нам електронного листа на адресу support@easygenerator.com.',
    'pt-br': 'Houve um problema abrindo este conteúdo. Clique em Cursos. Abra o curso e tente novamente. Contate support@easygenerator.com se o problema persistir.'
  },
  helpHintNotFoundError: {
    'en': 'There is a problem opening the Help.  Try again. Contact support@easygenerator.com if the problem persists. ',
    'zh-cn': '打开帮助时出现故障，请重试。如果问题依然存在，请联系support@easygenerator.com解决。',
    'uk': 'Виникла проблема в процессі відкриття підказки. Спробуйте відкрити допомогу ще раз. Якщо проблема не зникне, надішліть нам електронного листа на адресу support@easygenerator.com.',
    'pt-br': 'Há um problema para abrir a Ajuda. Tente novamente. Contate support@easygenerator.com se o problema persistir.'
  },
  responseFailed: {
    'en': 'We have encountered a problem.  Click on Courses. Open the course and try again. Contact support@easygenerator.com if the problem persists. ',
    'zh-cn': '我们遇到了一个问题，请重试。如果问题依然存在，请联系support@easygenerator.com解决。',
    'uk': 'Виникла проблема. Натисніть \"Курси\", відкрийте курс та спробуйте ще раз. Якщо проблема не зникне, надішліть нам електронного листа на адресу support@easygenerator.com.',
    'pt-br': 'Encontramos um problema. Clique em Cursos. Abra o curso e tente novamente. Contate support@easygenerator.com se o problema persistir.'
  },
  userNotMemberOfAnyCompany: {
    'en': 'You are not a member of any company.',
    'zh-cn': 'You are not a member of any company.[zh-cn]',
    'uk': 'Ви не є членом якої небудь компанії.',
    'pt-br': 'You are not a member of any company.[pt-br]'
  },
  review: {
    'en': 'Review',
    'zh-cn': '评论',
    'uk': 'Огляд',
    'pt-br': 'Revisar'
  },
  reviewTabTitle: {
    'en': 'Comments',
    'zh-cn': '评论',
    'uk': 'Коментарі',
    'pt-br': 'Comentários'
  },
  getReviewTabHelp: {
    'en': 'Click \"Get Link\", copy and share with external reviewers.',
    'zh-cn': '点击“获得链接”，可以复制并分享给外部评论者。',
    'uk': 'Клікніть \"Посилання\", щоб скопіювати і поділитись з іншими оглядачами.',
    'pt-br': 'Clique em \"Obter Link\", copie e compartilhe com revisores externos.'
  },
  updateReviewTabHelp: {
    'en': 'Click \"Update course\", copy and share with external reviewers.',
    'zh-cn': '点击“更新课程”。可以复制并分享给外部评论者。',
    'uk': 'Клікніть \"Оновити курс\", щоб скопіювати і поділитись з іншими оглядачами.',
    'pt-br': 'Clique em \"Atualizar curso\", copie e compartilhe com revisores externos.'
  },
  reviewGetLink: {
    'en': 'Get link',
    'zh-cn': '获得链接',
    'uk': 'Посилання',
    'pt-br': 'Obter link'
  },
  reviewOpenLinkTitle: {
    'en': 'Open link',
    'zh-cn': '打开链接',
    'uk': 'Відкрити посилання',
    'pt-br': 'Abrir link'
  },
  reviewUpdateCourse: {
    'en': 'Update course',
    'zh-cn': '更新课程',
    'uk': 'Оновити курс',
    'pt-br': 'Atualizar curso'
  },
  reviewPublishingCourse: {
    'en': 'Publishing...',
    'zh-cn': '发布中…',
    'uk': 'Публікація',
    'pt-br': 'Publicando...'
  },
  reviewNoComments: {
    'en': 'No comments from external reviewers yet',
    'zh-cn': '还没有外部评论',
    'uk': 'Коментарі відсутні',
    'pt-br': 'Ainda sem comentários de revisores externos'
  },
  reviewNotPaidMessage: {
    'en': 'in order to read external review comments',
    'zh-cn': '以便看到外部评论',
    'uk': 'для того щоб прочитати коментарі',
    'pt-br': 'a fim de ler comentários de revisores externos.'
  },
  upgradeToStarterPlanToUseCommentsErrorMessage: {
    'en': 'upgrade to Starter Plan.',
    'zh-cn': '升级到Starter服务',
    'uk': 'Оновіть до \"Starter Plan\"',
    'pt-br': 'upgrade para Plano Iniciante.'
  },
  feedback: {
    'en': 'Feedback',
    'zh-cn': '反馈',
    'uk': 'Відгуки',
    'pt-br': 'Feedback'
  },
  sendFeedback: {
    'en': 'Send feedback',
    'zh-cn': '发送反馈',
    'uk': 'Надіслати відгук',
    'pt-br': 'Enviar feedback'
  },
  send: {
    'en': 'Send',
    'zh-cn': '发送反馈',
    'uk': 'Надіслати',
    'pt-br': 'Enviar'
  },
  feedBackHelp: {
    'en': 'Help us to improve our application',
    'zh-cn': '帮助我们改进程序',
    'uk': 'Допоможіть нам покращити сервіс',
    'pt-br': 'Ajude-nos a melhorar nossa aplicação'
  },
  yourMessage: {
    'en': 'Your message...',
    'zh-cn': '你的宝贵意见…',
    'uk': 'Ваше повідомлення',
    'pt-br': 'Sua mensagem...'
  },
  successFeedback: {
    'en': 'Feedback was sent',
    'zh-cn': '反馈已经发送',
    'uk': 'Повідомлення надіслано',
    'pt-br': 'Feedback foi enviado'
  },
  feedbackTabTitle: {
    'en': 'Give feedback',
    'zh-cn': '给出反馈',
    'uk': 'Дати відгук',
    'pt-br': 'Dê seu feedback'
  },
  questionFeedback: {
    'en': 'Question response',
    'zh-cn': '答题后回应',
    'uk': 'Відповідь на питання',
    'pt-br': 'Resposta à questão'
  },
  hideNavigationTree: {
    'en': 'Hide navigation',
    'zh-cn': '隐藏导航',
    'uk': 'Дерево курсів',
    'pt-br': 'Inibir navegação'
  },
  openNavigationBar: {
    'en': 'Open navigation',
    'zh-cn': '打开导航',
    'uk': 'Показати дерево курсів',
    'pt-br': 'Abrir navegação'
  },
  noCoursesTitle: {
    'en': 'Course list is empty',
    'zh-cn': '清单中没有课程',
    'uk': 'Список курсів пустий',
    'pt-br': 'Lista de cursos está vazia'
  },
  noOwnCoursesTitle: {
    'en': 'No own courses yet',
    'zh-cn': '还没有课程',
    'uk': 'Список курсів пустий',
    'pt-br': 'Ainda nenhum curso próprio'
  },
  noObjectivesTitle: {
    'en': 'Objective list is empty',
    'zh-cn': '空的目标清单',
    'uk': 'Список розділів / цілей пустий',
    'pt-br': 'Lista de objetivos está vazia'
  },
  owner: {
    'en': 'Owner',
    'zh-cn': '作者',
    'uk': 'Власник',
    'pt-br': 'Proprietário'
  },
  fillInUserEmail: {
    'en': 'Type in email address',
    'zh-cn': '输入电子邮箱地址',
    'uk': 'Введіть електронну адресу',
    'pt-br': 'Digite enderêço de e-mail'
  },
  enterValidEmail: {
    'en': 'Enter valid email address',
    'zh-cn': '输入有效的电子邮箱地址',
    'uk': 'Введіть коректну електронну адресу',
    'pt-br': 'Informe enderêço de e-mail válido'
  },
  enterEmailOfExistingUser: {
    'en': 'Enter an email of existing easygenerator user',
    'zh-cn': '输入一个easygenerator用户的电子邮箱',
    'uk': 'Введіть електронну адресу існуючого користувача easygenerator',
    'pt-br': 'Informe um e-mail de usuário easygenerator existente'
  },
  addPerson: {
    'en': 'Add co-author',
    'zh-cn': '添加共同编辑人',
    'uk': 'Додати співавтора',
    'pt-br': 'Adicione co-autor'
  },
  inviteByEmailAddress: {
    'en': 'Invite users by email...',
    'zh-cn': '通过电子邮箱邀请…',
    'uk': 'Email співавтора',
    'pt-br': 'Convide usuários por e-mail...'
  },
  addPeopleForCollaboration: {
    'en': 'Add co-authors',
    'zh-cn': '添加多个人共同编辑',
    'uk': 'Додати співавтора',
    'pt-br': 'Adicione co-autores'
  },
  addCollaborator: {
    'en': 'Add co-author',
    'zh-cn': '添加共同编辑人',
    'uk': 'Додати співавтора',
    'pt-br': 'Adicione co-autor'
  },
  notEnoughPermissionsErrorMessage: {
    'en': 'Upgrade to Starter Plan to share courses',
    'zh-cn': '升级到Starter服务来共享课程',
    'uk': 'Оновіть свій тарифний план до \"Starter plan\", щоб поділитися курсом',
    'pt-br': 'Faça Upgrade plano Iniciante para compartilhar cursos'
  },
  dataHasBeenChangedErrorMessage: {
    'en': 'Something went wrong. Try again. Contact support@easygenerator.com if the problem persists. ',
    'zh-cn': '出错了，请重试。如果问题依然存在，请联系support@easygenerator.com解决。',
    'uk': 'Щось пішло не так. Спробуте знову. Якщо проблема не зникне надішліть нам електронного листа на адресу support@easygenerator.com',
    'pt-br': 'Algo deu errado. Tente novamente. Contate support@easygenerator.com se o problema persistir.'
  },
  removeCollaborator: {
    'en': 'Remove co-author',
    'zh-cn': '移除共同编辑人',
    'uk': 'Видалити співавтора',
    'pt-br': 'Remover co-autor'
  },
  areYouSureYouWantToDeleteUser: {
    'en': 'Are you sure you want to remove co-author from course?',
    'zh-cn': '是否确认移除课程中的共同编辑人?',
    'uk': 'Ви дійсно бажаєте видалити співавтора з даного курсу?',
    'pt-br': 'Tem certeza que deseja remover co-autor do curso?'
  },
  courseHasBeenDeletedByTheOwner: {
    'en': 'This course has been deleted by owner.   Click on Courses to open another course.',
    'zh-cn': '这个课程已经被作者删除，点击课程来打开另一个。',
    'uk': 'Цей курс був видалений власником. Клікніть на посилання \"Курси\" щоб відкрити інший курс.',
    'pt-br': 'Este curso foi excluido pelo proprietário. Clique em Cursos para abbrir outro curso.'
  },
  learningObjectiveHasBeenDisconnectedByCollaborator: {
    'en': 'Objective has been removed by co-author. Add it again from other objectives list.',
    'zh-cn': '目标已经被共同编辑人移除，从其他目标清单中再次添加。',
    'uk': 'Розділ / ціль були видалені співавтором. Додайте його знову з списку доступних розділів / цілей.',
    'pt-br': 'Objetivo foi removido por co-autor. Adicione-o novamente de outra lista de objetivos.'
  },
  questionHasBeenDeletedByCollaborator: {
    'en': 'Question has been deleted by co-author',
    'zh-cn': '问题已经被共同编辑人删除。',
    'uk': 'Питання було видаленно співавтором',
    'pt-br': 'Questão foi excluida por co-autor'
  },
  answerOptionHasBeenDeletedByCollaborator: {
    'en': 'Answer option has been deleted by co-author',
    'zh-cn': '答案选项已经被共同编辑人删除。',
    'uk': 'Варіант відповіді був видалений співавтором',
    'pt-br': 'Opção de resposta foi excluida por co-autor'
  },
  learningContentHasBeenDeletedByCollaborator: {
    'en': 'Content has been deleted by co-author',
    'zh-cn': '内容已经被共同编辑人删除。',
    'uk': 'Навчальний матеріал був видалений співавтором.',
    'pt-br': 'Conteúdo foi excluido por co-autor'
  },
  dropspotHasBeenDeletedByCollaborator: {
    'en': 'Droptext has been deleted by co-author.',
    'zh-cn': '文本已经被共同编辑人删除。',
    'uk': 'Текст був видалений співавтором',
    'pt-br': 'Arrastar e soltar foi excluida por co-autor'
  },
  courseIsNotAvailableAnyMore: {
    'en': 'Course is no longer shared with you. ',
    'zh-cn': '课程不再分享给您。',
    'uk': 'Цей курс Вам більше не доступний',
    'pt-br': 'Curso não é mais compartilhado com você.'
  },
  waitingForRegistration: {
    'en': 'waiting for registration...',
    'zh-cn': '等待注册中…',
    'uk': 'очікування реєстрації...',
    'pt-br': 'aguardando pelo registro...'
  },
  waitingForAcceptance: {
    'en': 'waiting for acceptance...',
    'zh-cn': 'waiting for acceptance...[zh-cn]',
    'uk': 'очікування підтвердження...',
    'pt-br': 'aguardando ser aceito...'
  },
  addCollaboratorStarterWarning: {
    'en': 'You have reached the maximum of 3 co-authors for this course.  Upgrade to Plus Plan to invite additional co-authors.',
    'zh-cn': '您最多只能邀请4个人共同编辑，升级到Plus服务后可以邀请更多的人。',
    'uk': 'Для вашого тарифного плану максимальна кількість співавторів - 3. Оновіть свій тарифний план до \"Plus Plan\" для додання більшої кількості співавторів.',
    'pt-br': 'Você atingiu o máximo de 3 co-autores para este curso. Faça upgrade to Plano Plus para convidar co-autores adicionais.'
  },
  addCollaboratorFreeWarning: {
    'en': 'Co-authoring is not available in the Free Plan. Upgrade to Starter Plan to invite co-authors.',
    'zh-cn': '免费账号不能邀请他人共同编辑，升级到Starter账号来邀请。',
    'uk': 'Співавторство недоступне для тарифного плану \"Free plan\". Оновіть свій план до \"Starter plan\", щоб запросити співавторів.',
    'pt-br': 'Co-autoria indisponível no Plano Livre. Faça upgrade para o Plano Iniciante para convidar co-autores.'
  },
  manageCoauthors: {
    'en': 'Manage co-authors',
    'zh-cn': 'Manage co-authors[zh-cn]',
    'uk': 'Співавтори',
    'pt-br': 'Gerenciar co-autores'
  },
  loadingCoauthors: {
    'en': 'loading co-authors...',
    'zh-cn': 'loading co-authors...[zh-cn]',
    'uk': 'завантажуємо співавторів...',
    'pt-br': 'carregando co-autores...'
  },
  asCoautor: {
    'en': 'as co-author?',
    'zh-cn': 'as co-author?[zh-cn]',
    'uk': 'як співавтора?',
    'pt-br': 'como co-autor?'
  },
  cannotAddDuplicateCoauthor: {
    'en': 'Co-author with such email has already been added',
    'zh-cn': 'Co-author with such email has already been added[zh-cn]',
    'uk': 'Співавтор з таким е-mail вже доданий до списку',
    'pt-br': 'Co-autor com este e-mail já foi adicionado'
  },
  addCoauthorsToYourCourse: {
    'en': 'Add co-authors to your course',
    'zh-cn': 'Add co-authors to your course[zh-cn]',
    'uk': 'Додайте співавторів до курсу',
    'pt-br': 'Adicionar co-autores de seu curso'
  },
  coAuthor: {
    'en': 'Co-author',
    'zh-cn': 'Co-author[zh-cn]',
    'uk': 'Співавтор',
    'pt-br': 'Co-autor'
  },
  hasBeenRemoved: {
    'en': 'has been removed',
    'zh-cn': 'has been removed[zh-cn]',
    'uk': 'видалений',
    'pt-br': 'foi removido'
  },
  whatNow: {
    'en': 'What now?',
    'zh-cn': '现在呢？',
    'uk': 'Що далі?',
    'pt-br': 'E agora?'
  },
  congratulations: {
    'en': 'Congratulations',
    'zh-cn': '恭喜',
    'uk': 'Вітаємо',
    'pt-br': 'Parabéns'
  },
  helpCenter: {
    'en': 'Help Center',
    'zh-cn': '帮助中心',
    'uk': 'Центр Допомоги',
    'pt-br': 'Centro de suporte'
  },
  congratulationsCaption: {
    'en': 'Look at you. You are now an expert. If you want to know more checkout our',
    'zh-cn': '现在，您已经是一个专家了。如果您想了解得更多，请查看我们的',
    'uk': 'Поглянь! Тепер ти експерт. Якщо хочеш дізнатися більше звернись у наш',
    'pt-br': 'Veja só. Você agora é um especialista. Se você deseja saber mais, saia ou'
  },
  hideHint: {
    'en': 'Hide',
    'zh-cn': '隐藏',
    'uk': 'Сховати',
    'pt-br': 'Inibir'
  },
  createCourseOnboardingTaskTitle: {
    'en': 'Create course',
    'zh-cn': '创建课程',
    'uk': 'Створіть курс',
    'pt-br': 'Criar curso'
  },
  createCourseOnboardingTaskDescription: {
    'en': '<section><header>What for?</header><article>Creating a new course  has never been easier. Do you have a topic? It can be anything - from accounting to business writing to time management. Or, here are some additional suggestions:</article><ul><li>Basic HTML</li><li>Statistics 101</li><li>Pythagorean theorem</li></ul></section><section><header>How to create course?</header><ol><li>Click on <b>\"New course\"</b> on the list of courses</li><li>Type in the title of your first course</li></ol><div class=\"tooltip-buttons-holder\"><a target=\"_blank\" href=\"http://help.easygenerator.com/en-us/starter-and-plus-edition/easygenerator/user-guide/courses#How-to-Create-a-Course\">Read more</a></div></section>',
    'zh-cn': '<section><header>用来做什么？</header><article>创建一个新课程从来没有这么简单过。你有一个主题吗？可以是任何事物 - 从会计到商务写作至时间管理，或者，下面有一些其它的建议：</article><ul><li>HTML基础</li><li>统计学 101</li><li>毕达哥拉斯定理</li></ul></section><section><header>如何创建课程？</header><ol><li>Click on <b>\"New course\"</b> 在课程列表中</li><li>输入你第一个课程的名字</li></ol><div class=\"tooltip-buttons-holder\"><a target=\"_blank\" href=\"http://help.easygenerator.com/en-us/starter-and-plus-edition/easygenerator/user-guide/courses#How-to-Create-a-Course\">了解更多</a></div></section>',
    'uk': '<section><header>Для чого?</header><article>Ніколи не було легко створити новий курс. Ви маєте тему? Це може бути що завгодно - від бухгалтерського обліку, ділового спілкування до тайм-менеджменту. Ось декілька прикладів:</article><ul><li>Основи HTML</li><li>Статистика 101</li><li>Теорема Піфагора</li></ul></section><section><header>Як створити курс?</header><ol><li>Натисніть на <b>\"Новий курс\"</b> на списку курсів.</li><li>Введіть назву курсу.</li></ol><div class=\"tooltip-buttons-holder\"><a target=\"_blank\" href=\"http://help.easygenerator.com/en-us/starter-and-plus-edition/easygenerator/user-guide/courses#How-to-Create-a-Course\">Докладніше</a></div></section>',
    'pt-br': '<section><header>Para que?</header><article>Criar um novo curso nunca foi tão fácil. Você tem um tópico? Pode ser qualquer coisa - de contabilidade a correspondência comercial a gerenciamento de tempo. Ou, aqui temos algumas sugestões adicionais:</article><ul><li>HTML básico</li><li>Estatística 101</li><li>Teorema de Pitágoras</li></ul></section><section><header>Como criar curso?</header><ol><li>Clique em <b>\"Novo curso\"</b> na lista de cursos</li><li>Digite o título de seu primeiro curso</li></ol><div class=\"tooltip-buttons-holder\"><a target=\"_blank\" href=\"http://help.easygenerator.com/en-us/starter-and-plus-edition/easygenerator/user-guide/courses#How-to-Create-a-Course\">Leia mais</a></div></section>'
  },
  defineObjectiveOnboardingTaskTitle: {
    'en': 'Define objective',
    'zh-cn': '定义目标',
    'uk': 'Створіть розділ / ціль',
    'pt-br': 'Definir objetivo'
  },
  defineObjectiveOnboardingTaskDescription: {
    'en': '<section><header>What for?</header><article>Specify exactly what you want students to know or be able to do at the end of the course.</article></section><section><header>How to define objective?</header><ol><li>Click on <b>\"New objective/section\"</b> in the course editor</li></ol><div class=\"tooltip-buttons-holder\"><a target=\"_blank\" href=\"http://help.easygenerator.com/en-us/starter-and-plus-edition/easygenerator/user-guide/courses#Course-Editor\">Read more</a></div></section>',
    'zh-cn': '<section><header>用来做什么？</header><article>清晰地说明你想学生在课程结束后能够了解什么或能够做什么。</article></section><section><header>如何定义课程目标？</header><ol><li>Click on <b>“新目标/部分”</b>在课程编辑器中</li><li>输入你的学习目标或分段标题</li><li>点击<b>“创建并继续”</b></li></ol><div class=\"tooltip-buttons-holder\"><a target=\"_blank\" href=\"http://help.easygenerator.com/en-us/starter-and-plus-edition/easygenerator/user-guide/courses#Course-Editor\">了解更多</a></div></section>',
    'uk': '<section><header>Для чого?</header><article>Вкажіть, що саме Ви хотіли б, щоб студент знав чи вмів робити після проходження даного курсу.</article></section><section><header>Як створити розділ / ціль?</header><ol><li>Натисніть на <b>\"Новий розділ / ціль\"</b> в редакторі курсів</li><li>Введіть назву свого розділу / цілі.</li><li>Натисніть на <b>\"Створити і продовжити\"</b></li></ol><div class=\"tooltip-buttons-holder\"><a target=\"_blank\" href=\"http://help.easygenerator.com/en-us/starter-and-plus-edition/easygenerator/user-guide/courses#Course-Editor\">Докладніше</a></div></section>',
    'pt-br': '<section><header>Para que?</header><article>Especifíque exatamente o que deseja que os estudantes aprendam ou tenham aptidão no final do curso.</article></section><section><header>Como definir o objetivo?</header><ol><li>Clique em <b>\"Novo objetivo/seção\"</b> no editor de curso</li></ol><div class=\"tooltip-buttons-holder\"><a target=\"_blank\" href=\"http://help.easygenerator.com/en-us/starter-and-plus-edition/easygenerator/user-guide/courses#Course-Editor\">Leia mais</a></div></section>'
  },
  addContentOnboardingTaskTitle: {
    'en': 'Add content',
    'zh-cn': '添加内容',
    'uk': 'Створіть матеріал',
    'pt-br': 'Adicionar conteúdo'
  },
  addContentOnboardingTaskDescription: {
    'en': '<section><header>What for?</header><article>Give  learners the information they need to be able to answer the question.  Create visually engaging courses by embedding videos and images.</article></section><section><header>How to add content?</header><ol><li>After you have added (or opened) a learning objective, a new page will be displayed.</li><li>Click on <b>\"New item\"</b> and click on <b>\"Content\"</b> after</li><li>Type in a title and add your content</li></ol><div class=\"tooltip-buttons-holder\"><a target=\"_blank\" href=\"http://help.easygenerator.com/en-us/starter-and-plus-edition/easygenerator/user-guide/content-and-questions#Content\">Read more</a></div></section>',
    'zh-cn': '<section><header>用来做什么？</header><article>给学员提供信息以便他们能够回答问题。通过嵌入录像和图片来创建在视觉上更丰富的课程。</article></section><section><header>如何增加内容？</header><ol><li>在你增加（或打开）一个学习目标时，将会出现一个新的页面。</li><li>点击 <b>“新知识点”</b> 并且点击<b>“内容”</b> 在</li><li>输入一个题目并且增加内容之后</li></ol><div class=\"tooltip-buttons-holder\"><a target=\"_blank\" href=\"http://help.easygenerator.com/en-us/starter-and-plus-edition/easygenerator/user-guide/content-and-questions#Content\">了解更多</a></div></section>',
    'uk': '<section><header>Для чого?</header><article>Дайте учням інформацію, яка їм потрібна для того, щоб відповісти на питання курсу. Створюйте візуально привабливі курси додаючи відео та зображення.</article></section><section><header>Як додати матеріал?</header><ol><li>Після того як ви створили(або відкрили) розділ, Ви побачите нову сторінку.</li><li>Натисніть на <b>\"Додати\"</b>, а потім на <b>\"Матеріал\".</b></li><li>Введіть назву та додайте матеріал.</li></ol><div class=\"tooltip-buttons-holder\"><a target=\"_blank\" href=\"http://help.easygenerator.com/en-us/starter-and-plus-edition/easygenerator/user-guide/content-and-questions#Content\">Докладніше</a></div></section>',
    'pt-br': '<section><header>Para que?</header><article>Dar aos alunos a informação que precisam para estar aptos a responder a questão. Criar cursos visualmente cativantes incluindo vídeos e imagens.</article></section><section><header>Como adicionar conteúdo?</header><ol><li>Após ter adicionado (ou aberto) um objetivo de aprendizado, uma nova página será mostrada.</li><li>Click on <b>\"Novo ítem\"</b> e clique em <b>\"Content\"</b> após</li><li>Digite um título e adicione seu conteúdo</li></ol><div class=\"tooltip-buttons-holder\"><a target=\"_blank\" href=\"http://help.easygenerator.com/en-us/starter-and-plus-edition/easygenerator/user-guide/content-and-questions#Content\">Leia mais</a></div></section>'
  },
  createQuestionsOnboardingTaskTitle: {
    'en': 'Add 3 questions ({0}/3)',
    'zh-cn': '增加3个问题 ({0}/3)',
    'uk': 'Створіть 3 питання ({0}/3)',
    'pt-br': 'Adicione 3 questões ({0}/3)'
  },
  createQuestionsOnboardingTaskDescription: {
    'en': '<section><header>What for?</header><article>Engage users by using multiple question types like: Drag and Drop Text, Text Matching, Single Choice Image and many more.</article></section><section><header>How to add questions?</header><ol><li>Click on <b>\"New item\"</b> (On the Learning objective page, or on the page where you create questions or content)</li><li>Select the question type you want to create</li><li>Type in a question title and other properties</li><li>Create a minimum of 3 different questions</li></ol><div class=\"tooltip-buttons-holder\"><a target=\"_blank\" href=\"http://help.easygenerator.com/en-us/starter-and-plus-edition/easygenerator/user-guide/content-and-questions\">Read more</a></div></section>',
    'zh-cn': '<section><header>用来做什么？</header><article>通过多种问题类型和用户更好的互动：拖拽文本，文本匹配，单选图片及其它很多形式。</article></section><section><header>如何增加问题？</header><ol><li>点击<b>“新知识点”</b> （在学习目标页面，或你创建问题或内容的页面）</li><li>选择你想创建的问题类型</li><li>输入问题题目和其它属性</li><li>创建至少3个不同的问题</li></ol><div class=\"tooltip-buttons-holder\"><a target=\"_blank\" href=\"http://help.easygenerator.com/en-us/starter-and-plus-edition/easygenerator/user-guide/content-and-questions\">了解更多</a></div></section>',
    'uk': '<section><header>Для чого?</header><article>Приваблюйте користувачів різними типами питань, таких як: Перетягнення тексту, Вибір відповідності, Вибір з множини(одна відповідь).</article></section><section><header>Як створювати питання?</header><ol><li>Натисніть на <b>\"Додати\"</b> (На сторінці теми або на сторінці створенного питання чи нотатки)</li><li>Виберіть тип питання, що хочете створити</li><li>Введіть назву питання та інші властивості</li><li>Створіть міннімум три різних питання</li></ol><div class=\"tooltip-buttons-holder\"><a target=\"_blank\" href=\"http://help.easygenerator.com/en-us/starter-and-plus-edition/easygenerator/user-guide/content-and-questions\">Докладніше</a></div></section>',
    'pt-br': '<section><header>Para que?</header><article>Cative os usuários usando multiplos tipos de questão como: Arrastar e soltar texto, Casamento de textos, Seleção de imagem símples e várias outras.</article></section><section><header>Como adicionar questões?</header><ol><li>Clique em <b>\"Novo item\"</b> (Na página de objetivo de aprendizado, ou na página onde você criou questões ou conteúdo)</li><li>Selecione o tipo de questão que deseja criar</li><li>Digite o título da questão e outras propriedades</li><li>Crie um mínimo de 3 questões diferentes</li></ol><div class=\"tooltip-buttons-holder\"><a target=\"_blank\" href=\"http://help.easygenerator.com/en-us/starter-and-plus-edition/easygenerator/user-guide/content-and-questions\">Leia mais</a></div></section>'
  },
  publishOnboardingTaskTitle: {
    'en': 'Publish',
    'zh-cn': '发布',
    'uk': 'Опублікуйте',
    'pt-br': 'Publicar'
  },
  publishOnboardingTaskDescription: {
    'en': '<section><header>What for?</header><article>Publish with one click to the cloud.</article></section><section><header>How to publish?</header><ol><li>Click on <b>\"Publish now\"</b> on any course page</li><li>Click on <b>\"Get link\"</b></li><li>Copy the link and share it via mail, twitter or any other channel</li></ol><div class=\"tooltip-buttons-holder\"><a target=\"_blank\" href=\"http://help.easygenerator.com/en-us/starter-and-plus-edition/easygenerator/user-guide/courses#Course-Editor\">Read more</a></div></section>',
    'zh-cn': '<section><header>用来做什么？</header><article>一键发布至云服务器。</article></section><section><header>如何发布？</header><ol><li>点击 <b>“现在发布”</b> 在任何课程页面</li><li>点击 <b>“获取链接”</b></li><li>拷贝链接并通过邮件或其它渠道分享</li></ol><div class=\"tooltip-buttons-holder\"><a target=\"_blank\" href=\"http://help.easygenerator.com/en-us/starter-and-plus-edition/easygenerator/user-guide/courses#Course-Editor\">了解更多</a></div></section>',
    'uk': '<section><header>Для чого?</header><article>Публікація в один клік до хмарного середовища зберігання даних.</article></section><section><header>Як публікувати?</header><ol><li>Натисніть на  <b>\"Публікація\"</b> на будь якій сторінці курсу</li><li>Натисніть на <b>\"Отримати посилання\"</b></li><li> Скопіюйте посилання і поділіться ним через e-mail, twitter чи інакше.</li></ol><div class=\"tooltip-buttons-holder\"><a target=\"_blank\" href=\"http://help.easygenerator.com/en-us/starter-and-plus-edition/easygenerator/user-guide/courses#Course-Editor\">Докладніше</a></div></section>',
    'pt-br': '<section><header>Para que?</header><article>Publicar com um clique para a núvem.</article></section><section><header>Como publicar?</header><ol><li>Clique em <b>\"Publicar agora\"</b> em qualquer página de curso</li><li>Clique em <b>\"Obter link\"</b></li><li>Copiar o link e compartilhe-o via e-mail, twitter ou qualquer outro canal</li></ol><div class=\"tooltip-buttons-holder\"><a target=\"_blank\" href=\"http://help.easygenerator.com/en-us/starter-and-plus-edition/easygenerator/user-guide/courses#Course-Editor\">Leia mais</a></div></section>'
  },
  tooltipContentTitle: {
    'en': 'Content',
    'zh-cn': '内容',
    'uk': 'Матеріал',
    'pt-br': 'Conteúdo'
  },
  tooltipContentDescription: {
    'en': '<p>Learning content is the content the learner needs to be able to answer a question.</p><p>In easygenerator this content can be added directly to the question.</p><p>The template you choose in the Design step determines how the content and the question will be organized and presented to the learner.</p>',
    'zh-cn': '<p>学习者要能够在学习内容中回答问题。</p><p>在Easygenerator里，内容可以直接添加成问题。</p><p>你选中的模板决定了在设计这个步骤中内容和问题如何被编排及呈现。</p>',
    'uk': '<p>Це інформація, яку повинна знати людина, що навчається, для відповіді на питання.</p><p>В easygenerator ця інформація може бути додана безпосередньо до питання.</p><p>Шаблон відображення курсу, який можна вибрати на кроці \"Дизайн\", визначає, яким чином буде відображено студентові питання і матеріали до них.</p>',
    'pt-br': '<p>Conteúdo de aprendizado é o conteúdo que o aluno necessita para estar apto a responder a questão.</p><p>No easygenerator este conteúdo pode ser adicionado diretamente à questão.</p><p>O modelo que você escolhe no passo de design determina como o conteúdo e a questão será organizada e apresentada ao aluno.</p>'
  },
  tooltipContentLink: {
    'en': '<a style=\"display:none;\" href=\"http://help.easygenerator.com/en-us/starter-and-plus-edition/easygenerator/user-guide/content-and-questions#Content\">read more</a>',
    'zh-cn': '<a style=\"display:none;\" href=\"http://help.easygenerator.com/en-us/starter-and-plus-edition/easygenerator/user-guide/content-and-questions#Content\">了解更多</a>',
    'uk': '<a style=\"display:none;\" href=\"http://help.easygenerator.com/en-us/starter-and-plus-edition/easygenerator/user-guide/content-and-questions#Content\">докладніше</a>',
    'pt-br': '<a style=\"display:none;\" href=\"http://help.easygenerator.com/en-us/starter-and-plus-edition/easygenerator/user-guide/content-and-questions#Content\">leia mais</a>'
  },
  tooltipFibTitle: {
    'en': 'Fill in the blanks',
    'zh-cn': '填空',
    'uk': 'Текст з пропусками',
    'pt-br': 'Preencha os espaços'
  },
  tooltipFibDescription: {
    'en': '<p>Use a fill in the blank to check active knowledge in the context of a text.</p><p>The learner is given text with blank spaces. There are two options -- the learner can type in the text in the blank space, or chose the correct text from a drop down list.</p>',
    'zh-cn': '<p>在上下文中使用填空来检查常用知识点.</p><p>学习者将会看到空格。有两种选项 -- 学习者可以在空格中输入内容，或者从下拉菜单中选择正确的内容。</p>',
    'uk': '<p>Використовуйте цей тип питання, щоб перевірити знання в контексті конкретного фрагменту тексту.</p><p>Учень побачить текст з пропусками. Йому треба буде або вписати текст самостійно, або вибрати правильний зі списку.</p>',
    'pt-br': '<p>Use um preenchimento de espaço em branco para verificar conhecimento ativo no contexto de um texto.</p><p>Ao aluno é apresentado um texto com espaços vazios. Existem duas opções -- o aluno pode digitar um texto no espaço em branco, ou escolher o texto correto de uma lista.</p>'
  },
  tooltipFibLink: {
    'en': '<a href=\"http://youtu.be/mxqA95gW6UE\" target=\"_blank\">watch video</a>',
    'zh-cn': '<span></span>',
    'uk': '<a href=\"http://youtu.be/mxqA95gW6UE\" target=\"_blank\">дивитись відео</a>',
    'pt-br': '<a href=\"http://youtu.be/mxqA95gW6UE\" target=\"_blank\">assita um vídeo</a>'
  },
  tooltipTextMatchingTitle: {
    'en': 'Text Matching',
    'zh-cn': '匹配文字',
    'uk': 'Вибір відповідності',
    'pt-br': 'Casar textos'
  },
  tooltipTextMatchingDescription: {
    'en': '<p>A text matching question tests the ability to match corresponding terms to each other.</p><p>The learner is given a question with two lists, and is asked to drag the provided terms to the correct match or definition.</p>',
    'zh-cn': '<p>文本匹配问题用来测试学习者搭配术语的能力。</p><p>一个问题包含两列，学习者需要把术语拖动到匹配的定义上。</p>',
    'uk': '<p>Використовуйте цей тип питання, щоб перевірити здатність співставити термін та його визначення.</p><p>Учень побачить питання з двома списками і йому треба буде співставити та перетягнути визначення до відповідного терміну.</p>',
    'pt-br': '<p>Uma pergunta de correspondência de texto testa a habilidade de casar termos correspondentes um ao outro.</p><p>Ao aluno é apresentada uma questão com duas listas, e é solicitado arrastar os termos providos para um casamento ou definição correto .</p>'
  },
  tooltipTextMatchingLink: {
    'en': '<a href=\"http://youtu.be/4VhGiuHNlbc\" target=\"_blank\">watch video</a>',
    'zh-cn': '<span></span>',
    'uk': '<a href=\"http://youtu.be/4VhGiuHNlbc\" target=\"_blank\">дивитись відео</a>',
    'pt-br': '<a href=\"http://youtu.be/4VhGiuHNlbc\" target=\"_blank\">assita um vídeo</a>'
  },
  tooltipDragAndDropTitle: {
    'en': 'Drag and Drop Text',
    'zh-cn': '拖拽',
    'uk': 'Тексти на зображенні',
    'pt-br': 'Arrastar e soltar texto'
  },
  tooltipDragAndDropDescription: {
    'en': '<p>Use Drag and Drop when the user needs to recognize and name parts of an image.</p><p>A question with a background image is provided and the leaner needs to drop the correct text label to its corresponding spot.</p>',
    'zh-cn': '<p>当用户需要识别并命名图像的一部分时请使用拖拽。</p><p>背景图问题出现时，学习者需要把正确的文字标签拖放到对应的位置。</p>',
    'uk': '<p>Використовуйте це питання, щоб перевірити здатність впізнати та назвати конкретні частини зображення.</p><p>Учень побачить питання з зображенням та підсвіченими місцями на цьому зображенні. Йому треба буде співставити та перетягнути тексти у відповідні підсвічені місця.</p>',
    'pt-br': '<p>Use arrastar e soltar quando o usuário precisa reconhecer e nomear partes de uma imagem.</p><p>Uma questão com uma imagem de fundo é apresentada e o aluno deve soltar a etiqueta com texto correto ao local correspondente.</p>'
  },
  tooltipDragAndDropLink: {
    'en': '<a href=\"http://youtu.be/7L9O6nhc1Ls\" target=\"_blank\">watch video</a>',
    'zh-cn': '<span></span>',
    'uk': '<a href=\"http://youtu.be/7L9O6nhc1Ls\" target=\"_blank\">дивитись відео</a>',
    'pt-br': '<a href=\"http://youtu.be/7L9O6nhc1Ls\" target=\"_blank\">assista um vídeo</a>'
  },
  tooltipCourseTemplateTitle: {
    'en': 'Course template',
    'zh-cn': '课程模板',
    'uk': 'Шаблон курсу',
    'pt-br': 'Modelo de curso'
  },
  tooltipCourseTemplateDescription: {
    'en': '<p>A course template determines how a course is organized and functions.</p><p>Easygenerator is flexible, allowing content to be presented in different formats.</p><p>Click on ‘preview course template’ to see what each template is. Select the correct template before publishing.</p>',
    'zh-cn': '<p>课程模板决定课程如何被编排及运作。</p><p>Easygenerator非常灵活，允许内容以不同的形式呈现。</p><p>点击“预览课程模板”查看模板样式。在发布前选择合适的模板。</p>',
    'uk': '<p>Шаблон визначає функціональність та організацію курсу. </p><p>Easygenerator гнучкий і дозволяє організовувати ваш контент в різних форматах</p><p>Клікніть на ‘Переглянути’, щоб побачити кожний шаблон. Виберіть коректний шаблон до публікації.</p>',
    'pt-br': '<p>Um modelo de curso determina como um curso é organizado e funciona.</p><p>Easygenerator é flexivel, permitindo que um conteúdo seja apresentado em diferentes formatos.</p><p>Clique em ‘prever modelo de curso’ para ver como cada modelo é. Selecione o modelo correto antes de publicar.</p>'
  },
  tooltipCourseTemplateLink: {
    'en': '<a href=\"http://help.easygenerator.com/en-us/starter-and-plus-edition/easygenerator/user-guide/course-templates\" target=\"_blank\">read more</a>',
    'zh-cn': '<a href=\"http://help.easygenerator.com/en-us/starter-and-plus-edition/easygenerator/user-guide/course-templates\" target=\"_blank\">了解更多</a>',
    'uk': '<a href=\"http://help.easygenerator.com/en-us/starter-and-plus-edition/easygenerator/user-guide/course-templates\" target=\"_blank\">докладніше</a>',
    'pt-br': '<a href=\"http://help.easygenerator.com/en-us/starter-and-plus-edition/easygenerator/user-guide/course-templates\" target=\"_blank\">leia mais</a>'
  },
  tooltipStatementTitle: {
    'en': 'Statement',
    'zh-cn': '判断',
    'uk': 'Твердження',
    'pt-br': 'Afirmação'
  },
  tooltipStatementDescription: {
    'en': '<p>The learner gets a list of statements and has to indicate if they are true or false.</p><p><b>Examples:</b></p><p>[True] Five is a Prime number<br>[False] The Atlantic Ocean is the biggest ocean on Earth.</p><p><b>How to</b>:<ul><ol>1. Define the title (Question)</ol><ol>2. Type statements</ol><ol>3. Select true or false for all the statements</ol></ul><p>',
    'zh-cn': '<p>学习者需要对一系列的描述判断对错。</p><p><b>例如：</b></p><p>[正确] 5是素数<br>[错误] 大西洋是地球最大的海洋。</p><p><b>如何做</b>:<ul><ol>1. 定义题目</ol><ol>2. 输入描述</ol><ol>3. 为所有的描述选择对或错</ol></ul><p>',
    'uk': '<p>Учень побачить список тверджень, по кожному з яких йому треба буде сказати, погоджується він з цим твердженням чи ні.</p><p><b>Наприклад:</b></p><p>[Так] 5 є простим числом<br>[Ні] Атлантичний океан є найбільшим океаном на землі.</p>',
    'pt-br': '<p>Ao aluno é apresentada uma lista de afirmações e este deve indicar se elas são verdadeiras ou falsas.</p><p><b>Exemplos:</b></p><p>[Verdadeiro] Cinco é um número primo<br>[Falso] O Oceano Atlântico é o maior oceano da Terra.</p><p><b>Como</b>:<ul><ol>1. Defina o título (Questão)</ol><ol>2. Digite afirmações</ol><ol>3. Selecione verdadeiro ou falso para todas as afirmações</ol></ul><p>'
  },
  tooltipStatementLink: {
    'en': '<a href=\"http://help.easygenerator.com/en-us/starter-and-plus-edition/easygenerator/user-guide/content-and-questions#Statement\" target=\"_blank\">read more</a>',
    'zh-cn': '<a href=\"http://help.easygenerator.com/en-us/starter-and-plus-edition/easygenerator/user-guide/content-and-questions#Statement\" target=\"_blank\">了解更多</a>',
    'uk': '<a href=\"http://help.easygenerator.com/en-us/starter-and-plus-edition/easygenerator/user-guide/content-and-questions#Statement\" target=\"_blank\">докладніше</a>',
    'pt-br': '<a href=\"http://help.easygenerator.com/en-us/starter-and-plus-edition/easygenerator/user-guide/content-and-questions#Statement\" target=\"_blank\">leia mais</a>'
  },
  tooltipHotspotTitle: {
    'en': 'Hotspot',
    'zh-cn': '热点',
    'uk': 'Область відповіді',
    'pt-br': 'Hotspot'
  },
  tooltipHotspotDescription: {
    'en': '<p>The learner sees an image and has to click on one or more places in order to give an answer:</p><p><b>Example:</b> \"Geography: Locate areas on a map\".</p><p>Options:<ul><li style=\"padding-bottom: 8px;\">Single response – learners are able to select only one area. If there are several hotspots to choose, the question is answered correctly when the learner clicks on ANY of the hotspots.</li><li>Multiple response – learners are able to select multiple areas. The question is answered correctly when the learner clicks ALL hotspots without choosing any wrong places.</li></ul></p><p><strong>How to:</strong><ul><ol>1. Define the title (Question)</ol><ol>2. Upload the image</ol><ol>3. Choose between single and multiple response</ol><ol>4. Create your hotspots</ol></ul></p>',
    'zh-cn': '<p>学习者将会看到一张图片，需要点击图片中一个或多个地方并给出答案：</p><p><b>例如：</b> “地理：在地图上定位某区域”。</p><p>选项：<ul><li style=\"padding-bottom: 8px;\">单个响应 – 学习者只能选择一个热点。如果有多个热点都正确，学习者点击其中任何一个都正确。</li><li>多个响应 – 学习者可以选择多个热点。 只有学习者选对所有热点后问题才算回答正确。</li></ul></p><p><strong>如何做：</strong><ul><ol>1. 定义题目</ol><ol>2. 上传图片</ol><ol>3. 选择单个响应或多个响应</ol><ol>4. 创建你的热点</ol></ul></p>',
    'uk': '<p>Учень бачить зображення, на якому йому треба клікнути в одному чи декількох місцях, позначивши таким чином свою відповідь.</p><p><b>Наприклад:</b> \"Географія: визначіть місця на картах\".</p><p>Типи запитання:<ul><li style=\"padding-bottom: 8px;\">Одна відповідь – учень може вибрати тільки одну область. Якщо створено декілька областей, учню для правильної відповіді достатньо вибрати будь-яку з них.</li><li>Декілька відповідей – учень може виділити декілька областей. Для правильної відповіді на питання йому треба вибрати всі області і не вибрати лишнього.</li></ul></p>',
    'pt-br': '<p>Ao aluno é apresentada uma imagem e este deve clicar em um ou mais lugares para dar uma resposta:</p><p><b>Exemplo:</b> \"Geografia: Localizar áreas em um mapa\".</p><p>Opções:<ul><li style=\"padding-bottom: 8px;\">Resposta simples – o aluno só pode selecionar uma área. Se existirem vários hotspots a escolher, a questão é respondida corretamente quando o aluno clica em QUALQUER dos hotspots.</li><li>Múltipla resposta – alunos podem selecionar múltiplas áreas. A questão é respondida corretamente quando quando o aluno clica TODOS os hotspots sem escolher nenhum lugar errado.</li></ul></p><p><strong>Como:</strong><ul><ol>1. Defina o título (Questão)</ol><ol>2. Carregue a imagem</ol><ol>3. Selecione entre resposta simples e múltipla</ol><ol>4. Crie seus hotspots</ol></ul></p>'
  },
  tooltipHotspotLink: {
    'en': '<a href=\"http://help.easygenerator.com/en-us/starter-and-plus-edition/easygenerator/user-guide/content-and-questions#Hot-Spot\" target=\"_blank\">read more</a>',
    'zh-cn': '<a href=\"http://help.easygenerator.com/en-us/starter-and-plus-edition/easygenerator/user-guide/content-and-questions#Hot-Spot\">了解更多</a>',
    'uk': '<a href=\"http://help.easygenerator.com/en-us/starter-and-plus-edition/easygenerator/user-guide/content-and-questions#Hot-Spot\" target=\"_blank\">докладніше</a>',
    'pt-br': '<a href=\"http://help.easygenerator.com/en-us/starter-and-plus-edition/easygenerator/user-guide/content-and-questions#Hot-Spot\" target=\"_blank\">leia mais</a>'
  },
  upgradeDialogBoldTitle: {
    'en': 'Upgrade now',
    'zh-cn': 'Upgrade now[zh-cn]',
    'uk': 'Оновити',
    'pt-br': 'Upgrade agora'
  },
  resultsUpgradeDialogTitle2: {
    'en': 'to get full list of results',
    'zh-cn': 'to get full list of results[zh-cn]',
    'uk': 'для повного списку результатів',
    'pt-br': 'para capturar lista completa de resultados'
  },
  resultsUpgradeForDownloadCSVDialogTitle2: {
    'en': 'to download results as CSV-file',
    'zh-cn': 'to download results as CSV-file[zh-cn]',
    'uk': 'для завантаження списку результатів у вигляді CSV-файлу',
    'pt-br': 'para baixar resultados em arquivo CSV'
  },
  resultsUpgradeForExtendedResultsTitle2: {
    'en': 'to get detailed results',
    'zh-cn': 'to get detailed results[zh-cn]',
    'uk': 'для завантаження детального списку результатів',
    'pt-br': 'para ter resultados detalhados'
  },
  resultsUpgradeDialogText: {
    'en': 'On the Free Plan you can only see the last 10 results',
    'zh-cn': 'On the Free Plan you can only see the last 10 results[zh-cn]',
    'uk': 'Ви можете бачити лише перші 10 результатів при тарифному плані \"Free plan\"',
    'pt-br': 'No Plano Livre você pode ver apenas os últimos 10 resultados'
  },
  resultsUpgradeForDownloadCSVDialogHtml: {
    'en': '<ul><li>Download your learners results</li><li>Export your results in a spreadsheet</li><li>Or any program that supports CSV</li></ul>',
    'zh-cn': '<ul><li>Download your learners results</li><li>Export your results in a spreadsheet</li><li>Or any program that supports CSV</li></ul>[zh-cn]',
    'uk': '<ul><li>Завантажте результати учнів</li><li>Відкрийте їх в таблицях spreadsheet</li><li>Або в будь-якій іншій програмі, яка підтримує формат CSV</li></ul>',
    'pt-br': '<ul><li>Baixe os resultados de ensino</li><li>Exporte seus resultados em uma planilha</li><li>Ou qualquer programa que suporte CSV</li></ul>'
  },
  resultsUpgradeForExtendedResultsHtml: {
    'en': '<ul><li>Get results per objective</li><li>Get results per question</li><li>Check start and finish date of each attempt</li></ul>',
    'zh-cn': '<ul><li>Get results per objective</li><li>Get results per question</li><li>Check start and finish date of each attempt</li></ul>[zh-cn]',
    'uk': '<ul><li>Отримати результати за кожною ціллю</li><li>Отримати результати за кожним питанням</li><li>Перевірити час початку і час закінчення кожної спроби</li></ul>',
    'pt-br': '<ul><li>Obter resultados por objetivo</li><li>Obter resultados por questão</li><li>Verifique data de início e fim de cada tentativa</li></ul>'
  },
  upgradeDialogUpgradeNow: {
    'en': 'Upgrade now',
    'zh-cn': 'Upgrade now[zh-cn]',
    'uk': 'Оновити',
    'pt-br': 'Upgrade agora'
  },
  upgradeDialogMaybeLater: {
    'en': 'Maybe later',
    'zh-cn': 'Maybe later[zh-cn]',
    'uk': 'Не зараз',
    'pt-br': 'Talvez mais tarde'
  },
  upgradeNotificationTitle: {
    'en': 'Easygenerator license notification',
    'zh-cn': '温馨提示',
    'uk': 'Повідомлення про ліцензію easygenerator',
    'pt-br': 'Notificação de licença Easygenerator'
  },
  upgradeNotificationSender: {
    'en': 'From: easygenerator team',
    'zh-cn': '来自easygenerator团队',
    'uk': 'Від кого: команда easygenerator',
    'pt-br': 'De: time easygenerator'
  },
  upgradeNotificationHi: {
    'en': 'Hi',
    'zh-cn': '您好',
    'uk': 'Добрий день',
    'pt-br': 'Olá'
  },
  upgradeNotificationToday: {
    'en': 'today',
    'zh-cn': '今天',
    'uk': 'сьогодні',
    'pt-br': 'hoje'
  },
  upgradeNotificationIn1day: {
    'en': 'in 1 day',
    'zh-cn': '1天后',
    'uk': 'за 1 день',
    'pt-br': 'em 1 dia'
  },
  upgradeNotificationInSeveralDays: {
    'en': 'in {0} days',
    'zh-cn': '{0}天后',
    'uk': 'за {0} дні(в)',
    'pt-br': 'em {0} dias'
  },
  upgradeNotificationNote: {
    'en': 'Please note, you will be automatically downgraded to the Free Plan, if you don’t make the payment in time. More info on pricing plans',
    'zh-cn': '如果没有及时续费，您的使用权限将会自动回到基础级别。更多关于使用权限的价格信息在',
    'uk': 'Зверніть увагу, якщо Ви вчасно не здійсните платіж, тарифний план буде змінено на \"Free Plan\". Більше про тарифні плани',
    'pt-br': 'Note que, você será automáticamente reduzido ao plano livre, se não fizer o pagamente em tempo. Mais informações sobre nossos planos'
  },
  upgradeNotificationHere: {
    'en': 'here',
    'zh-cn': '这里',
    'uk': 'тут',
    'pt-br': 'aquí'
  },
  upgradePayNow: {
    'en': 'Pay Now',
    'zh-cn': '立即续费',
    'uk': 'Сплатити зараз',
    'pt-br': 'Pague agora'
  },
  upgradeMail: {
    'en': 'Any issues with your credit card and need more time?',
    'zh-cn': '若信用卡有问题导致需延后支付。',
    'uk': 'Виникли проблеми?',
    'pt-br': 'Problemas com seu cartão de crédito e precisa de mais tempo?'
  },
  upgradePleaseContact: {
    'en': 'Please contact:',
    'zh-cn': '请联系:',
    'uk': 'Будь-ласка, зверніться:',
    'pt-br': 'Favor contatar:'
  },
  upgradeStarterPlan: {
    'en': 'Starter Plan',
    'zh-cn': '初级使用权限',
    'uk': 'Starter Plan',
    'pt-br': 'Plano Iniciante'
  },
  upgradePlusPlan: {
    'en': 'Plus Plan',
    'zh-cn': '高级使用权限',
    'uk': 'Plus Plan',
    'pt-br': 'Plano Plus'
  },
  upgradeTrialPlan: {
    'en': 'Trial Plan',
    'zh-cn': 'Trial Plan[zh-cn]',
    'uk': 'Trial Plan',
    'pt-br': 'Trial Plan[pt-br]'
  },
  upgradeNotificationContent: {
    'en': 'Your {0} expires {1}.',
    'zh-cn': '您的 {0} {1} 到期。',
    'uk': 'Ваш {0} закінчиться {1}.',
    'pt-br': 'Seu {0} expira {1}.'
  },
  сonfirmСoauthoring: {
    'en': 'Confirm co-authoring',
    'zh-cn': 'Confirm co-authoring[zh-cn]',
    'uk': 'Підтвержденя співавторства',
    'pt-br': 'Confirmar co-autoria'
  },
  сonfirmСoauthoringFrom: {
    'en': 'From',
    'zh-cn': 'From[zh-cn]',
    'uk': 'Від',
    'pt-br': 'De'
  },
  pleaseConformMyInvitation: {
    'en': 'Please confirm my invitation to work with you on',
    'zh-cn': 'Please confirm my invitation to work with you on[zh-cn]',
    'uk': 'Будь-ласка, прийміть моє запрошення працювати разом з Вами над',
    'pt-br': 'Favor confirmar meu convite para trabalhar com você em'
  },
  сonfirmСoauthoringCourse: {
    'en': 'course',
    'zh-cn': 'course[zh-cn]',
    'uk': 'курсом',
    'pt-br': 'curso'
  },
  accept: {
    'en': 'Accept',
    'zh-cn': 'Accept[zh-cn]',
    'uk': 'Прийняти',
    'pt-br': 'Aceitar'
  },
  decline: {
    'en': 'Decline',
    'zh-cn': 'Decline[zh-cn]',
    'uk': 'Відхилити',
    'pt-br': 'Recusar'
  },
  confirmCoauthoringInfo: {
    'en': 'The course will appear in your course list after accepting.',
    'zh-cn': 'The course will appear in your course list after accepting.[zh-cn]',
    'uk': 'Даний курс з\'явиться у Вашому списку курсів після підтверждення.',
    'pt-br': 'O curso aparecerá em sua lista de cursos após aceitação.'
  },
  signUp: {
    'en': 'Sign up',
    'zh-cn': '注册',
    'uk': 'Зареєструватись',
    'pt-br': 'Assinar'
  },
  createAccountTitle: {
    'en': 'Start creating courses now!',
    'zh-cn': '现在开始创建课程',
    'uk': 'Почни створювати курси зараз!',
    'pt-br': 'Inicie a criação de cursos agora!'
  },
  signUpSecondStepTitle: {
    'en': 'Almost there...',
    'zh-cn': '将要完成',
    'uk': 'Майже все...',
    'pt-br': 'Quase lá'
  },
  emailCaption: {
    'en': 'E-mail',
    'zh-cn': 'E-mail',
    'uk': 'E-mail',
    'pt-br': 'E-mail'
  },
  passwordCaption: {
    'en': 'Password',
    'zh-cn': '密码',
    'uk': 'Пароль',
    'pt-br': 'Senha'
  },
  signUpButton: {
    'en': 'Sign up',
    'zh-cn': '注册',
    'uk': 'Зареєструватись',
    'pt-br': 'Assinar'
  },
  pleaseUse: {
    'en': 'Please use:',
    'zh-cn': 'Please use:[zh-cn]',
    'uk': 'Правила:',
    'pt-br': 'Favor usar:'
  },
  noSpaces: {
    'en': 'No spaces',
    'zh-cn': '密码不能含有空格',
    'uk': 'Немає пробілів',
    'pt-br': 'Sem espaços'
  },
  notLessThan7Symbols: {
    'en': 'Not less than 7 symbols',
    'zh-cn': '至少7个字符长度',
    'uk': 'Не менше 7 символів',
    'pt-br': 'Não menos de 7 símbolos'
  },
  showPassword: {
    'en': 'Show password',
    'zh-cn': '显示密码',
    'uk': 'Показати пароль',
    'pt-br': 'Mostrar senha'
  },
  hidePassword: {
    'en': 'Hide password',
    'zh-cn': '隐藏密码',
    'uk': 'Сховати пароль',
    'pt-br': 'Inibir senha'
  },
  finishSignup: {
    'en': 'Start authoring!',
    'zh-cn': '开始编写！',
    'uk': 'Почніть створювати!',
    'pt-br': 'Iniciar autoria!'
  },
  notContainWhitespaceCharacters: {
    'en': 'The password cannot contain spaces',
    'zh-cn': '密码不能含有空格',
    'uk': 'Пароль не може містити пробіли',
    'pt-br': 'A senha não pode conter espaços'
  },
  enterValidFirstName: {
    'en': 'Fill in your first name',
    'zh-cn': '输入姓',
    'uk': 'Введіть ім\'я',
    'pt-br': 'Preencha com seu primeiro nome'
  },
  enterValidLastName: {
    'en': 'Fill in your last name',
    'zh-cn': '输入名',
    'uk': 'Введіть прізвище',
    'pt-br': 'Preencha com seu último nome'
  },
  enterValidOrganization: {
    'en': 'Fill in your organization name',
    'zh-cn': '输入组织名称',
    'uk': 'Введіть назву організації',
    'pt-br': 'Preencha com nome da sua organização'
  },
  enterValidPhoneNumber: {
    'en': 'Fill in your phone number',
    'zh-cn': '输入电话号码',
    'uk': 'Введіть свій номер телефону',
    'pt-br': 'Preencha com seu telefone'
  },
  enterValidCountry: {
    'en': 'Fill in your country',
    'zh-cn': '输入国家',
    'uk': 'Виберіть свою країну',
    'pt-br': 'Preencha com seu país'
  },
  accountAlreadyExists: {
    'en': 'This account already exists. Click on Sign in and try again.',
    'zh-cn': '此账号已存在。点击登录重试。',
    'uk': 'Такий акаунт вже існує. Клікніть Авторизуватись і спробуйте знову',
    'pt-br': 'Esta conta já existe. Clique em ENTRAR e tente novamente.'
  },
  passwordIsStrongEnough: {
    'en': 'Password meets requirements',
    'zh-cn': '密码符合要求',
    'uk': 'Пароль відповідає вимогам',
    'pt-br': 'Senha atende os requisitos'
  },
  passwordDoesNotMeetRequirements: {
    'en': 'Password does not meet requirements',
    'zh-cn': '密码不符合要求',
    'uk': 'Пароль не відповідає вимогам',
    'pt-br': 'Senha não atende os requisitos'
  },
  licenseAgreeCaption: {
    'en': 'By clicking \"Sign up\" I agree to the easygenerator\'s  <a href=\"/terms.html\"  target=”_blank”>Terms</a> and <a href=\"/privacypolicy.html\"  target=”_blank”>Privacy policy</a>',
    'zh-cn': '点击“注册”表示我同意easygenerator的 <a href=\"/terms.html\"  target=”_blank”>Terms</a> 和 <a href=\"/privacypolicy.html\" target=”_blank”>隐私条例</a>',
    'uk': 'Натискаючи на \"Зареєструватись\", я погоджуюсь з  <a href=\"/terms.html\"  target=”_blank”>умовами</a> та <a href=\"/privacypolicy.html\"  target=”_blank”>політикою конфіденційності</a>',
    'pt-br': 'Clicando em \"Assinar\" eu concordo com o <a href=\"/terms.html\" target=”_blank”>Termo Easygenerator\'s </a> e <a href=\"/privacypolicy.html\" target=”_blank”>Política de Privacidade</a>'
  },
  checking: {
    'en': 'Checking...',
    'zh-cn': '正在检查…',
    'uk': 'Перевірка...',
    'pt-br': 'Verificando...'
  },
  firstNameCaption: {
    'en': 'First name',
    'zh-cn': '姓',
    'uk': 'Ім\'я',
    'pt-br': 'Primeiro nome'
  },
  lastNameCaption: {
    'en': 'Last name',
    'zh-cn': '名',
    'uk': 'Прізвище',
    'pt-br': 'ùltimo nome'
  },
  phoneNumberCaption: {
    'en': 'Phone number',
    'zh-cn': '电话号码',
    'uk': 'Номер телефону',
    'pt-br': 'Telefone'
  },
  countryCaption: {
    'en': 'Country',
    'zh-cn': '国家',
    'uk': 'Країна',
    'pt-br': 'País'
  },
  roleQuestion: {
    'en': 'What is your role?',
    'zh-cn': '你的角色？',
    'uk': 'Яка ваша роль?',
    'pt-br': 'Qual sua função?'
  },
  teacherOption: {
    'en': 'Teacher',
    'zh-cn': '教师',
    'uk': 'Вчитель',
    'pt-br': 'Professor'
  },
  trainerOption: {
    'en': 'Trainer',
    'zh-cn': '培训师',
    'uk': 'Тренер',
    'pt-br': 'Educador'
  },
  smeOption: {
    'en': 'Subject matter expert',
    'zh-cn': '业务专家',
    'uk': 'Експерт предметної області',
    'pt-br': 'Especialista'
  },
  expertOption: {
    'en': 'eLearning expert',
    'zh-cn': 'eLearning专家',
    'uk': 'Експерт з електронного навчання',
    'pt-br': 'Especialista em EAD'
  },
  designerOption: {
    'en': 'Instructional designer',
    'zh-cn': '课程设计人员',
    'uk': 'Instructional designer[uk]',
    'pt-br': 'Instructional designer'
  },
  managerOption: {
    'en': 'eLearning manager',
    'zh-cn': 'eLearning管理人员',
    'uk': 'Менеджер з електронного навчання',
    'pt-br': 'Gerente de EAD'
  },
  studentOption: {
    'en': 'Student',
    'zh-cn': 'Student[zh-cn]',
    'uk': 'Студент',
    'pt-br': 'Estudante'
  },
  otherOption: {
    'en': 'Other',
    'zh-cn': '其它',
    'uk': 'Інше',
    'pt-br': 'Outro'
  },
  wouldYouLikeAnIntroductionDemo: {
    'en': 'I would like an introduction demo!',
    'zh-cn': '请给我一个介绍性演示样本',
    'uk': 'I would like an introduction demo![uk]',
    'pt-br': 'Eu desejo uma demosntração introdutória'
  },
  chooseYourCountry: {
    'en': 'Select your country...',
    'zh-cn': '选择国家',
    'uk': 'Виберіть свою країну...',
    'pt-br': 'Selecione seu país...'
  },
  startAuthoring: {
    'en': 'Start authoring!',
    'zh-cn': '开始编写！',
    'uk': 'Почніть створювати!',
    'pt-br': 'Iniciar autoria!'
  },
  signIn: {
    'en': 'Sign in',
    'zh-cn': '登录',
    'uk': 'Авторизуватись',
    'pt-br': 'ENTRAR'
  },
  forgotPassword: {
    'en': 'Forgot password?',
    'zh-cn': '忘记密码？',
    'uk': 'Забули пароль?',
    'pt-br': 'Esqueceu senha?'
  },
  forgotPasswordSent: {
    'en': 'We\'ve sent you an e-mail with instructions on how to reset your password.',
    'zh-cn': '我们已经给你发送一封邮件说明如何重设密码',
    'uk': 'На ваш e-mail було надіслано листа з інструкціями для відновлення пароля.',
    'pt-br': 'Foi enviado um e-mail com instruções de, como resetar sua senha.'
  },
  passwordRecovery: {
    'en': 'Reset password',
    'zh-cn': '重置密码',
    'uk': 'Скинути пароль',
    'pt-br': 'Resetar senha'
  },
  requestError: {
    'en': 'Something went wrong. Try again. Contact support@easygenerator.com if the problem persists. ',
    'zh-cn': '出错了。请重试。如果问题仍然存在请联系support@easygenerator.com',
    'uk': 'Щось пішло не так. Спробуте знову. Якщо проблема не зникне, надішліть нам електронного листа на адресу support@easygenerator.com',
    'pt-br': 'Algo deu errado. Tente novamente. Contate support@easygenerator.com se o problema persistir.'
  },
  couldNotVerifyPasswordRecovery: {
    'en': 'Something went wrong. Try again. Contact support@easygenerator.com if the problem persists. ',
    'zh-cn': '出错了。请重试。如果问题仍然存在请联系support@easygenerator.com',
    'uk': 'Щось пішло не так. Спробуте знову. Якщо проблема не зникне, надішліть нам електронного листа на адресу support@easygenerator.com',
    'pt-br': 'Algo deu errado. Tente novamente. Contate support@easygenerator.com se o problema persistir.'
  },
  restorePasswordCaption: {
    'en': 'Enter your new password',
    'zh-cn': '输入新密码',
    'uk': 'Введіть новий пароль',
    'pt-br': 'Entre com sua nova senha'
  }
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("localization/localizationManager.js", ["localization/resources.js"], function(resources) {
  "use strict";
  var defaultCulture = "en",
      supportedCultures = ["en", "en-US", 'uk', 'zh-cn', 'pt-br'],
      currentCulture = defaultCulture,
      currentLanguage = '',
      localize = function(key, culture) {
        var item = resources[key];
        if (_.isNullOrUndefined(item)) {
          throw new Error('A resource with key "' + key + '" was not found');
        }
        var cultureInfo = _.contains(supportedCultures, culture) ? culture : this.currentCulture;
        return item[cultureInfo] || item[this.currentLanguage] || item[defaultCulture];
      },
      hasKey = function(key) {
        return resources.hasOwnProperty(key);
      },
      addLangTagToHtml = function(lang) {
        $('html').attr('lang', lang);
      },
      initialize = function(userCultures) {
        userCultures = userCultures || [];
        var match = null,
            i = 0,
            j = 0,
            uclength = userCultures.length,
            sclength = supportedCultures.length;
        for (i = 0; i < uclength; i++) {
          if (_.isString(match)) {
            break;
          }
          for (j = 0; j < sclength; j++) {
            if (userCultures[i].toLowerCase() == supportedCultures[j].toLowerCase()) {
              match = supportedCultures[j];
              break;
            }
          }
        }
        this.currentCulture = _.isString(match) ? match : defaultCulture;
        this.currentLanguage = this.currentCulture.substring(0, 2);
        addLangTagToHtml(this.currentCulture);
      };
  (function() {
    ko.bindingHandlers.localize = {update: function(element, valueAccessor) {
        localizeValue(element, valueAccessor);
      }};
    function localizeValue(element, valueAccessor) {
      var value = valueAccessor();
      if (_.isEmpty(value)) {
        return;
      }
      var localizationManager = require("localization/localizationManager");
      if (_.isDefined(value['text'])) {
        $(element).text(getLocalizedText(value['text']));
      }
      if (_.isDefined(value['placeholder'])) {
        $(element).attr('placeholder', getLocalizedText(value['placeholder']));
      }
      if (_.isDefined(value['value'])) {
        $(element).prop('value', getLocalizedText(value['value']));
      }
      if (_.isDefined(value['title'])) {
        $(element).prop('title', getLocalizedText(value['title']));
      }
      if (_.isDefined(value['html'])) {
        $(element).html(getLocalizedText(value['html']));
      }
      if (_.isDefined(value['data-text'])) {
        $(element).attr('data-text', getLocalizedText(value['data-text']));
      }
      function getLocalizedText(value) {
        if (_.isString(value)) {
          return localizationManager.localize(value);
        } else if (_.isObject(value)) {
          var text = localizationManager.localize(value.key);
          for (var replacement in value.replace) {
            text = text.replace('{' + replacement + '}', value.replace[replacement]);
          }
          return text;
        }
      }
    }
    ;
  })();
  return {
    initialize: initialize,
    currentCulture: currentCulture,
    currentLanguage: currentLanguage,
    localize: localize,
    defaultCulture: defaultCulture,
    supportedCultures: supportedCultures,
    hasKey: hasKey
  };
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("constants.js", [], function() {
  return {
    accessType: {
      free: 0,
      starter: 1,
      plus: 2,
      trial: 100
    },
    questionType: {
      multipleSelect: {
        type: 'multipleSelect',
        image: '/Content/images/multiselect-question.png'
      },
      fillInTheBlank: {
        type: 'fillInTheBlank',
        image: '/Content/images/fillintheblank-question.png'
      },
      dragAndDropText: {
        type: 'dragAndDropText',
        image: '/Content/images/draganddroptext-question.png'
      },
      singleSelectText: {
        type: 'singleSelectText',
        image: '/Content/images/singleselecttext-question.png'
      },
      informationContent: {
        type: 'informationContent',
        image: '/Content/images/info-question.png'
      },
      singleSelectImage: {
        type: 'singleSelectImage',
        image: '/Content/images/singleselectimage-question.png'
      },
      textMatching: {
        type: 'textMatching',
        image: '/Content/images/textmatching-question.png'
      },
      hotspot: {
        type: 'hotspot',
        image: '/Content/images/hotspot-question.png'
      },
      statement: {
        type: 'statement',
        image: '/Content/images/statement-question.png'
      },
      openQuestion: {
        type: 'openQuestion',
        image: '/Content/images/open-question.png'
      }
    },
    questionFeedback: {
      correct: 'correct',
      incorrect: 'incorrect'
    },
    learningContentsTypes: {
      content: 'content',
      hotspot: 'hotspot'
    },
    sortingOptions: {
      byTitleAsc: 'byTitleAsc',
      byTitleDesc: 'byTitleDesc'
    },
    publishingStates: {
      building: 'building',
      publishing: 'publishing',
      succeed: 'succeed',
      failed: 'failed'
    },
    collaboratorStates: {deleting: 'deleting'},
    registerOnAim4YouStates: {
      inProgress: 'registerInProgress',
      success: 'registerSuccess',
      fail: 'registerFail'
    },
    autosaveTimersInterval: {
      answerOption: 60000,
      learningContent: 60000,
      entityContent: 60000,
      questionTitle: 5000,
      feedbackText: 60000
    },
    validation: {
      objectiveTitleMaxLength: 255,
      courseTitleMaxLength: 255,
      questionTitleMaxLength: 255,
      textMatchingKeyMaxLength: 255,
      textMatchingValueMaxLength: 255,
      learningPathTitleMaxLength: 255
    },
    messages: {
      user: {
        identified: 'user:identified',
        downgraded: 'user:downgraded',
        upgradedToStarter: 'user:upgradedToStarter',
        upgradedToPlus: 'user:upgradedToPlus'
      },
      course: {
        created: 'course:created',
        deleted: 'course:deleted',
        deletedByCollaborator: 'course:deletedByCollaborator',
        titleUpdated: 'course:titleUpdated',
        titleUpdatedByCollaborator: 'course:titleUpdatedByCollaborator',
        introductionContentUpdated: 'course:introductionContentUpdated',
        introductionContentUpdatedByCollaborator: 'course:introductionContentUpdatedByCollaborator',
        objectiveRelated: 'course:objectiveRelated',
        objectiveRelatedByCollaborator: 'course:objectiveRelatedByCollaborator',
        objectivesUnrelated: 'course:objectivesUnrelated',
        objectivesUnrelatedByCollaborator: 'course:objectivesUnrelatedByCollaborator',
        objectivesReordered: 'course:objectivesReordered',
        objectivesReorderedByCollaborator: 'course:objectivesReorderedByCollaborator',
        templateUpdatedByCollaborator: 'course:templateUpdatedByCollaborator',
        templateUpdated: 'course:templateUpdated',
        stateChanged: 'course:stateChanged',
        build: {
          started: 'course:build-started',
          completed: 'course:build-completed',
          failed: 'course:build-failed'
        },
        scormBuild: {
          started: 'course:scormBuild-started',
          completed: 'course:scormBuild-completed',
          failed: 'course:scormBuild-failed'
        },
        publish: {
          started: 'course:publish-started',
          completed: 'course:publish-completed',
          failed: 'course:publish-failed'
        },
        publishForReview: {
          started: 'course:review-publish-started',
          completed: 'course:review-publish-completed',
          failed: 'course:review-publish-failed'
        },
        publishToAim4You: {
          started: 'course:publishToAim4You-started',
          completed: 'course:publishToAim4You-comleted',
          failed: 'course:publishToAim4You-failed'
        },
        publishToCustomLms: {
          started: 'course:publishToCustomLms-started',
          completed: 'course:publishToCustomLms-comleted',
          failed: 'course:publishToCustomLms-failed'
        },
        delivering: {
          started: 'course:delivering-started',
          finished: 'course:delivering-finished'
        },
        collaboration: {
          inviteCreated: 'course:collaboration-invite-created:',
          inviteRemoved: 'course:collaboration-invite-removed:',
          inviteAccepted: 'course:collaboration-invite-accepted',
          inviteCourseTitleUpdated: 'course:collaboration-invite-course-title-updated',
          collaboratorAdded: 'course:collaboration-collaboratorAdded:',
          collaboratorRemoved: 'course:collaboration-collaboratorRemoved',
          collaboratorRegistered: 'course:collaboration-collaboratorRegistered:',
          started: 'course:collaboration-started',
          disabled: 'course:collaboration-disabled',
          finished: 'course:collaboration-finished',
          deleting: {
            started: 'collaborator:deleting-started:',
            completed: 'collaborator:deleting-completed:',
            failed: 'collaborator:deleting-failed:'
          }
        }
      },
      learningPath: {
        courseSelector: {
          courseSelected: 'learningPath:course-selector:course-selected',
          courseDeselected: 'learningPath:course-selector:course-deselected'
        },
        removeCourse: 'learningPath:removeCourse',
        createCourse: 'learningPath:createCourse',
        deleted: 'learningPath:deleted',
        delivering: {
          started: 'learningPath:delivering-started',
          finished: 'learningPath:delivering-finished'
        },
        deleted: 'learningPath:deleted'
      },
      objective: {
        createdInCourse: 'objective:createdInCourse',
        titleUpdated: 'objective:titleUpdated',
        titleUpdatedByCollaborator: 'objective:titleUpdatedByCollaborator',
        imageUrlUpdated: 'objective:imageUrlUpdated',
        imageUrlUpdatedByCollaborator: 'objective:imageUrlUpdatedByCollaborator',
        questionsReordered: 'objective:questionsReordered',
        questionsReorderedByCollaborator: 'objective:questionsReorderedByCollaborator'
      },
      question: {
        created: 'question:created',
        createdByCollaborator: 'question:createdByCollaborator',
        deleted: 'questions:deleted',
        titleUpdated: 'question:titleUpdated',
        titleUpdatedByCollaborator: 'question:titleUpdatedByCollaborator',
        contentUpdatedByCollaborator: 'question:contentUpdatedByCollaborator',
        backgroundChangedByCollaborator: 'question:backgroundChangedByCollaborator',
        correctFeedbackUpdatedByCollaborator: 'question:correctFeedbackUpdatedByCollaborator',
        incorrectFeedbackUpdatedByCollaborator: 'question:incorrectFeedbackUpdatedByCollaborator',
        deletedByCollaborator: 'question:deletedByCollaborator',
        learningContentsReorderedByCollaborator: 'question:learningContentsReorderedByCollaborator',
        answer: {
          addedByCollaborator: 'question:answer:addedByCollaborator',
          deletedByCollaborator: 'question:answer:deletedByCollaborator',
          textUpdatedByCollaborator: 'question:answer:textUpdatedByCollaborator',
          answerCorrectnessUpdatedByCollaborator: 'question:answer:answerCorrectnessUpdatedByCollaborator',
          singleSelectTextDeleteByCollaborator: 'question:answer:singleSelectTextDeletedByCollaborator'
        },
        learningContent: {
          createdByCollaborator: 'learningContent:createdByCollaborator',
          deletedByCollaborator: 'learningContent:deletedByCollaborator',
          textUpdatedByCollaborator: 'learningContent:textUpdatedByCollaborator',
          remove: 'learningContent:remove',
          updateText: 'learningContent:updateText',
          restore: 'learningContent:restore'
        },
        fillInTheBlank: {updatedByCollaborator: 'question:fillInTheBlank:updatedByCollaborator'},
        dragAndDropText: {
          dropspotCreatedByCollaborator: 'question:dragAndDrop:dropspotCreatedByCollaborator',
          dropspotPositionChangedByCollaborator: 'question:dragAndDrop:dropspotPositionChangedByCollaborator',
          dropspotTextChangedByCollaborator: 'question:dragAndDrop:dropspotTextChangedByCollaborator',
          dropspotDeletedByCollaborator: 'question:dragAndDrop:dropspotDeletedByCollaborator'
        },
        hotSpot: {
          polygonCreatedByCollaborator: 'question:hotSpot:polygonCreatedByCollaborator',
          polygonUpdatedByCollaborator: 'question:hotSpot:polygonUpdatedByCollaborator',
          polygonDeletedByCollaborator: 'question:hotSpot:polygonDeletedByCollaborator',
          isMultipleUpdatedByCollaborator: 'question:hotSpot:isMultipleUpdatedByCollaborator'
        },
        textMatching: {
          answerCreatedByCollaborator: 'question:textMatching:answerCreatedByCollaborator',
          answerDeletedByCollaborator: 'question:textMatching:answerDeletedByCollaborator',
          answerKeyChangedByCollaborator: 'question:textMatching:answerKeyChangedByCollaborator',
          answerValueChangedByCollaborator: 'question:textMatching:answerValueChangedByCollaborator'
        },
        singleSelectImage: {
          answerCreatedByCollaborator: 'question:singleSelectImage:answerCreatedByCollaborator',
          answerDeletedByCollaborator: 'question:singleSelectImage:answerDeletedByCollaborator',
          answerImageUpdatedByCollaborator: 'question:singleSelectImage:answerImageUpdatedByCollaborator',
          correctAnswerChangedByCollaborator: 'question:singleSelectImage:correctAnswerChangedByCollaborator'
        }
      },
      helpHint: {
        shown: 'helphint:shown',
        hidden: 'helphint:hidden'
      },
      treeOfContent: {
        expanded: 'treeOfContent:expanded',
        collapsed: 'treeOfContent:collapsed'
      },
      onboarding: {closed: 'onboarding:closed'},
      sidePanel: {
        expanded: 'sidePanel:expanded',
        collapsed: 'sidePanel:collapsed'
      },
      notification: {}
    },
    patterns: {email: /^([\w\.\-]+)@([\w\-]+)((\.(\w){2,6})+)$/},
    notification: {
      keys: {
        subscriptionExpiration: 'notificationkeys:subscriptionExpiration',
        collaborationInvite: 'notificationkeys:collaborationInvite'
      },
      messages: {
        push: 'notification:push',
        remove: 'notification:remove'
      }
    },
    upgradeEvent: 'Upgrade now',
    upgradeUrl: '/account/upgrade',
    signinUrl: '/signin',
    upgradeCategory: {
      scorm: 'SCORM 1.2',
      changeLogo: 'Change logo',
      externalReview: 'External review',
      header: 'Header',
      userMenuInHeader: 'User menu in header',
      questions: 'Questions',
      expirationNotification: 'Expiration notification',
      courseLimitNotification: 'Course limit notification'
    },
    maxStarterPlanCollaborators: 3,
    eventCategories: {
      header: 'Header',
      informationContent: 'Information'
    },
    clientContextKeys: {
      lastCreatedQuestionId: 'lastCreatedQuestionId',
      lastCreatedCourseId: 'lastCreatedCourseId',
      lastCreatedLearningPathId: 'lastCreatedLearningPathId',
      lastCreatedObjectiveId: 'lastCreatedObjectiveId',
      lastVistedCourse: 'lastVistedCourse',
      lastVisitedObjective: 'lastVisitedObjective',
      showCreateCoursePopup: 'showCreateCoursePopup'
    },
    reporting: {
      xApiVerbIds: {
        started: 'http://adlnet.gov/expapi/verbs/launched',
        passed: 'http://adlnet.gov/expapi/verbs/passed',
        failed: 'http://adlnet.gov/expapi/verbs/failed',
        answered: 'http://adlnet.gov/expapi/verbs/answered',
        mastered: 'http://adlnet.gov/expapi/verbs/mastered'
      },
      filterKeys: {
        courseId: 'context.extensions.http://easygenerator/expapi/course/id',
        learningPathId: 'context.extensions.http://easygenerator/expapi/learningpath/id',
        verb: 'verb',
        limit: 'limit',
        skip: 'skip',
        agent: 'agent',
        attemptId: 'registration',
        parentId: 'parent'
      }
    },
    frameSize: {
      width: {
        name: 'frameWidth',
        value: 930
      },
      height: {
        name: 'frameHeight',
        value: 700
      }
    },
    embedCode: '<iframe width="{W}" height="{H}" src="{src}" frameborder="0" allowfullscreen></iframe>',
    copyToClipboardWait: 5000,
    results: {pageSize: 10},
    storage: {
      host: window.storageServiceUrl ? "//" + window.storageServiceUrl : '//localhost:888',
      mediaUrl: '/media',
      userUrl: '/user',
      changesInQuota: 'storage:changesInQuota',
      video: {
        vimeoToken: 'bearer a6b8a8d804e9044f9aa091b6687e70c1',
        vimeoApiVideosUrl: 'https://api.vimeo.com/videos/',
        videoUrl: '/video',
        ticketUrl: '/api/media/video/upload',
        finishUrl: '/api/media/video/upload/finish',
        progressUrl: '/api/media/video/upload/progress',
        defaultThumbnailUrl: '//i.vimeocdn.com/video/default_200x150.jpg',
        cancelUrl: '/api/media/video/upload/cancel',
        statuses: {
          loaded: 'loaded',
          failed: 'failed',
          inProgress: 'inProgress'
        },
        vimeoVerifyStatus: 308,
        changesInUpload: 'video:changesInUpload',
        trackChangesInUploadTimeout: 500,
        iframeWidth: 600,
        iframeHeight: 335,
        updateUploadTimeout: 60000,
        removeVideoAfterErrorTimeout: 5000
      },
      audio: {
        convertionUrl: window.convertionServiceUrl ? "//" + window.convertionServiceUrl : '//staging.easygenerator.com/convertion',
        pullUrl: '/api/media/audio/pull',
        ticketUrl: '/api/media/audio/ticket',
        trackerTimeout: 25000,
        statuses: {
          available: 'available',
          notAvailable: 'notAvailable',
          notStarted: 'notStarted',
          loaded: 'loaded',
          failed: 'failed',
          inProgress: 'inProgress'
        },
        changesInUpload: 'video:changesInUpload'
      }
    },
    dialogs: {
      stepSubmitted: 'dialog:step-submitted',
      dialogClosed: 'dialog:dialogClosed',
      deleteLearningPath: {settings: {containerCss: 'delete-learning-path'}},
      createCourse: {settings: {containerCss: 'create-course'}},
      changeCourseTemplate: {settings: {containerCss: 'change-course-template'}},
      releaseNote: {settings: {containerCss: 'release-note'}},
      moveCopyQuestion: {settings: {containerCss: 'move-copy-question'}},
      upgrade: {settings: {
          default: {
            titleKey: 'upgradeDialogBoldTitle',
            subtitleKey: '',
            descriptionKey: '',
            upgradeBtnTextKey: 'upgradeDialogUpgradeNow',
            skipBtnTextKey: 'upgradeDialogMaybeLater',
            containerCss: 'upgrade-dialog-empty',
            eventCategory: ''
          },
          downloadResults: {
            containerCss: 'upgrade-dialog-download-results',
            eventCategory: 'Download results CSV',
            subtitleKey: 'resultsUpgradeForDownloadCSVDialogTitle2',
            descriptionKey: 'resultsUpgradeForDownloadCSVDialogHtml'
          },
          loadMoreResults: {
            containerCss: 'upgrade-dialog-all-results',
            eventCategory: 'Load more results',
            subtitleKey: 'resultsUpgradeDialogTitle2',
            descriptionKey: 'resultsUpgradeDialogText'
          },
          extendedResults: {
            containerCss: 'upgrade-dialog-extended-results',
            eventCategory: 'Load extended results',
            subtitleKey: 'resultsUpgradeForExtendedResultsTitle2',
            descriptionKey: 'resultsUpgradeForExtendedResultsHtml'
          },
          videoUpload: {
            containerCss: 'upgrade-dialog-video-upload',
            eventCategory: 'Video library',
            subtitleKey: 'videoUpgradeToUpload',
            descriptionKey: 'videoUpgradeToUploadHtml'
          },
          duplicateCourse: {
            containerCss: 'upgrade-dialog-duplicate-course',
            eventCategory: 'Duplicate course',
            subtitleKey: 'coursesUpgradeToHaveMore',
            descriptionKey: 'coursesUpgradeToHaveMoreHtml'
          },
          audioUpload: {
            containerCss: 'upgrade-dialog-audio-upload',
            eventCategory: 'Audio library',
            subtitleKey: 'audioUploadUpgradeSubtitle',
            descriptionKey: 'audioUploadUpgradeText'
          }
        }}
    }
  };
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("widgets/notifyViewer/viewmodel.js", ["libs/durandal/app.js", "constants.js"], function(app, constants) {
  "use strict";
  var noticelifeTime = 7000,
      noticefadeOutLifetime = 2000,
      nodeTypeContent = 1;
  var notifyViewer = {
    notifications: ko.observableArray([]),
    enabled: ko.observable(true),
    moved: ko.observable(false),
    addNotice: addNotice
  };
  app.on(constants.messages.sidePanel.expanded, function() {
    notifyViewer.moved(true);
  });
  app.on(constants.messages.sidePanel.collapsed, function() {
    notifyViewer.moved(false);
  });
  return notifyViewer;
  function addNotice(notice) {
    if (notice.nodeType !== nodeTypeContent) {
      return;
    }
    $(notice).hide().fadeIn().delay(noticelifeTime).fadeOut(noticefadeOutLifetime, function() {
      $(this).remove();
    });
  }
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("notify.js", ["widgets/notifyViewer/viewmodel.js", "localization/localizationManager.js"], function(notifyViewer, localizationManager) {
  "use strict";
  var noticeTypes = {
    info: "info",
    error: "error",
    success: "success"
  },
      success = function(message) {
        showNotification(message, noticeTypes.success);
      },
      info = function(message) {
        showNotification(message, noticeTypes.info);
      },
      error = function(message) {
        showNotification(message, noticeTypes.error);
      },
      saved = function() {
        var message = localizationManager.localize('allChangesAreSaved');
        showNotification(message, noticeTypes.success);
      },
      showNotification = function(message, type) {
        var notificationItem = {
          text: message,
          type: type
        };
        notifyViewer.notifications.remove(function(item) {
          return item.text == message && item.type == type;
        });
        notifyViewer.notifications.push(notificationItem);
      },
      hide = function() {
        notifyViewer.notifications.removeAll();
      };
  return {
    success: success,
    info: info,
    error: error,
    saved: saved,
    hide: hide
  };
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("errorHandling/httpErrorHandlers/forbiddenHttpErrorHandler.js", ["localization/localizationManager.js", "notify.js"], function(localizationManager, notify) {
  "use strict";
  return {handleError: handleError};
  function handleError(response) {
    var responseKey = response.getResponseHeader('ErrorMessageResourceKey');
    notify.error(localizationManager.localize(responseKey));
  }
  ;
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("errorHandling/httpErrorHandlers/unauthorizedHttpErrorHandler.js", ["libs/durandal/plugins/router.js"], function(router) {
  "use strict";
  var handleError = function() {
    router.setLocation('/signin');
  };
  return {handleError: handleError};
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("errorHandling/errorHandlingConfiguration.js", ["errorHandling/httpErrorHandlerRegistrator.js", "errorHandling/httpErrorHandlers/serviceUnavailableHttpErrorHandler.js", "errorHandling/httpErrorHandlers/forbiddenHttpErrorHandler.js", "errorHandling/httpErrorHandlers/unauthorizedHttpErrorHandler.js"], function(httpErrorHandlerRegistrator, serviceUnavailableHttpErrorHandler, forbiddenHttpErrorHandler, unauthorizedHttpErrorHandler) {
  "use strict";
  var configure = function() {
    httpErrorHandlerRegistrator.registerHandler(401, unauthorizedHttpErrorHandler);
    httpErrorHandlerRegistrator.registerHandler(403, forbiddenHttpErrorHandler);
    httpErrorHandlerRegistrator.registerHandler(503, serviceUnavailableHttpErrorHandler);
  };
  return {configure: configure};
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("errorHandling/httpErrorHandlers/defaultHttpErrorHandler.js", ["localization/localizationManager.js", "notify.js"], function(localizationManager, notify) {
  "use strict";
  var handleError = function(response) {
    if (!_.isNullOrUndefined(response) && _.isString(response)) {
      notify.error(response);
    } else {
      notify.error(localizationManager.localize("responseFailed"));
    }
  };
  return {handleError: handleError};
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("errorHandling/globalErrorHandler.js", ["errorHandling/httpErrorHandlerRegistrator.js", "errorHandling/httpErrorHandlers/defaultHttpErrorHandler.js"], function(errorHandlerRegistrator, defaultHttpErrorHandler) {
  "use strict";
  var subscribeOnAjaxErrorEvents = function() {
    $(document).ajaxError(function(event, response) {
      if (!_.isNullOrUndefined(response) && !_.isNullOrUndefined(response.status)) {
        var handler = errorHandlerRegistrator.registeredHandlers[response.status];
        if (!_.isNullOrUndefined(handler)) {
          handler.handleError(response);
          return;
        }
      }
      defaultHttpErrorHandler.handleError(response);
    });
  };
  return {subscribeOnAjaxErrorEvents: subscribeOnAjaxErrorEvents};
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("bootstrapping/errorHandlingTask.js", ["errorHandling/errorHandlingConfiguration.js", "errorHandling/globalErrorHandler.js"], function(errorHandlingConfiguration, globalErrorHandler) {
  "use strict";
  var task = {execute: execute};
  return task;
  function execute() {
    errorHandlingConfiguration.configure();
    globalErrorHandler.subscribeOnAjaxErrorEvents();
  }
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("bootstrapping/localizationTask.js", ["localization/localizationManager.js"], function(localizationManager) {
  "use strict";
  var task = {execute: execute};
  return task;
  function execute() {
    localizationManager.initialize(window.userCultures);
  }
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("routing/routerExtender.js", ["libs/durandal/app.js", "libs/durandal/plugins/router.js", "localization/localizationManager.js"], function(app, router, localizationManager) {
  "use strict";
  function execute() {
    router.openUrl = function(url) {
      window.open(url, '_blank');
    };
    router.replace = function(url) {
      router.navigate(url, {
        replace: true,
        trigger: true
      });
    };
    router.reloadLocation = function() {
      document.location.reload(true);
    };
    router.setLocation = function(url) {
      document.location = url;
    };
    router.navigateWithQueryString = function(url) {
      var queryString = router.activeInstruction().queryString;
      router.navigate(_.isNullOrUndefined(queryString) ? url : url + '?' + queryString);
    };
    router.download = function(url) {
      var hash = window.location.hash,
          href = window.location.href;
      var downloadUrl = hash == '' ? href + '/' + url : href.replace(hash, url);
      window.open(downloadUrl);
    };
    router.setDefaultLocationHash = function(hash) {
      var locationHash = router.getLocationHash();
      if (hash && hash.hash && hash.hash.length && !locationHash.length) {
        locationHash = hash.hash;
      }
      if (locationHash == '#404') {
        locationHash = 'courses';
      }
      return router.setLocationHash(locationHash);
    };
    router.getLocationHash = function() {
      return window.location.hash;
    };
    router.setLocationHash = function(hash) {
      return window.location.hash = hash;
    };
    var defaultRouteData = {
      courseId: null,
      moduleName: null
    };
    router.routeData = ko.observable(defaultRouteData);
    router.activeInstruction.subscribe(function(instruction) {
      var url = instruction.fragment;
      var context = {moduleName: getModuleName(instruction.config.moduleId)};
      var parts = url.split('/');
      var i = 0,
          len = parts.length;
      for (; i < len; i++) {
        if (parts[i] === 'courses' && parts[i + 1]) {
          context.courseId = parts[i + 1];
          i++;
        }
        if (parts[i] === 'objectives' && parts[i + 1]) {
          context.objectiveId = parts[i + 1];
          i++;
        }
        if (parts[i] === 'questions' && parts[i + 1]) {
          context.questionId = parts[i + 1];
          i++;
        }
      }
      router.routeData(context);
    });
    function getModuleName(moduleIdValue) {
      return moduleIdValue && moduleIdValue.slice(moduleIdValue.lastIndexOf('/') + 1);
    }
    ;
  }
  return {execute: execute};
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("bootstrapping/routingTask.js", ["routing/routerExtender.js"], function(extender) {
  "use strict";
  var task = {execute: execute};
  return task;
  function execute() {
    extender.execute();
  }
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("bootstrapping/compositionTask.js", ["libs/durandal/composition.js"], function(composition) {
  "use strict";
  var task = {execute: execute};
  return task;
  function execute() {
    composition.addBindingHandler('autofocus');
    composition.addBindingHandler('scrollToElement');
    composition.addBindingHandler('dialog');
    composition.addBindingHandler('ckeditor');
    composition.addBindingHandler('editableText');
    composition.addBindingHandler('autosize');
    composition.addBindingHandler('introAnimate');
    composition.addBindingHandler('publishTabs');
    composition.addBindingHandler('dialogBindingHandler');
    composition.addBindingHandler('dialogWizardBindingHandler');
  }
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("bootstrapping/viewLocatorTask.js", ["libs/durandal/viewLocator.js"], function(viewLocator) {
  "use strict";
  var task = {execute: execute};
  return task;
  function execute() {
    viewLocator.useConvention();
  }
});

_removeDefine();
})();
System.registerDynamic("components/tooltip/view.html!libs/text.js", [], true, function(req, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  module.exports = "<div class=\"tooltip-content-holder\">\r\n</div>\r\n<div class=\"tooltip-background\">\r\n</div>\r\n<a class=\"tooltip-close-button\">\r\n</a>\r\n<span class=\"tooltip-pointer\">\r\n</span>";
  global.define = __define;
  return module.exports;
});

(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("components/bindingHandlers/tooltipBindingHandler.js", ["libs/durandal/app.js", "libs/durandal/composition.js", "constants.js", "components/tooltip/view.html!libs/text.js"], function(app, composition, constants, view) {
  "use strict";
  return {install: install};
  function install() {
    var containerSelector = '.shell';
    var animationDuration = 200;
    var tooltipHolderClass = 'tooltip-holder';
    app.on(constants.messages.treeOfContent.expanded, closeAllTooltips);
    app.on(constants.messages.treeOfContent.collapsed, closeAllTooltips);
    ko.bindingHandlers.tooltip = {
      init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
        ko.applyBindingsToDescendants(bindingContext, element);
        initTooltip(element, valueAccessor() || 'top');
        return {controlsDescendantBindings: true};
      },
      update: function(element, valueAccessor) {}
    };
    function closeAllTooltips() {
      $('.' + tooltipHolderClass).finish().fadeOut(animationDuration);
    }
    function initTooltip(element, preferredVerticalAligment) {
      var $element = $(element);
      var elementContent = $element.html();
      $element.empty();
      var $tooltipContainer = addTooltipContainer(elementContent);
      function addTooltipContainer(elementContent) {
        var $tooltipContainer = $('<div/>', {'class': tooltipHolderClass});
        $(containerSelector).append($tooltipContainer);
        ko.utils.setHtml($tooltipContainer, view);
        $('.tooltip-content-holder', $tooltipContainer).html(elementContent);
        $('.tooltip-close-button', $tooltipContainer).click(closeHandler);
        return $tooltipContainer;
      }
      $(window).on('keypress', closeOnEscHandler);
      $(window).on('resize', closeHandler);
      ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
        $tooltipContainer.remove();
        $(window).unbind('keypress', closeOnEscHandler);
        $(window).unbind('resize', closeHandler);
      });
      function closeOnEscHandler(e) {
        if (e.keyCode == 27) {
          hide($tooltipContainer);
        }
      }
      function closeHandler() {
        hide($tooltipContainer);
      }
      function hide($container) {
        $container.finish().fadeOut(animationDuration);
      }
      $element.click(function() {
        if (!$tooltipContainer.is(':visible')) {
          var $container = $(containerSelector);
          var position = getPosition(preferredVerticalAligment, $element, $container, $tooltipContainer);
          var resultStyles = {
            opacity: '1',
            top: position.vertical.top + 'px'
          };
          var tooltipStyles = {
            left: position.horizontal.left,
            top: position.vertical.top + (position.vertical.aligment == 'top' ? (-20) : 20),
            display: 'block',
            opacity: '0'
          };
          $tooltipContainer.css(tooltipStyles).removeClass('top bottom').addClass(position.vertical.aligment);
          $('.tooltip-pointer', $tooltipContainer).removeClass('right middle left').addClass(position.horizontal.aligment);
          $tooltipContainer.finish().animate(resultStyles, animationDuration);
        } else {
          hide($tooltipContainer);
        }
      });
    }
    function getPosition(preferredVerticalAligment, $pointer, $container, $tooltip) {
      var tooltipHeight = $tooltip.height();
      var tooltipWidth = $tooltip.width();
      var pointerOffset = $pointer.offset();
      var containerOffset = $container.offset();
      var position = {};
      position.vertical = getVerticalPosition(preferredVerticalAligment, pointerOffset.top, containerOffset.top, tooltipHeight);
      position.horizontal = getHorizontalPosition(pointerOffset.left, containerOffset.left, $container.width(), tooltipWidth);
      function getVerticalPosition(preferredVerticalAligment, pointerTopOffset, containerTopOffset, tooltipHeight) {
        var vertical = {};
        vertical.aligment = getVerticalAligment(preferredVerticalAligment, pointerTopOffset, tooltipHeight);
        vertical.top = pointerTopOffset - containerTopOffset;
        if (vertical.aligment == 'top') {
          vertical.top -= tooltipHeight + 20;
        }
        if (vertical.aligment == 'bottom') {
          vertical.top += 20;
        }
        function getVerticalAligment(preferredVerticalAligment, pointerTopOffset, tooltipHeight) {
          if (preferredVerticalAligment == 'top' && (pointerTopOffset - 100) < tooltipHeight) {
            return 'bottom';
          }
          if (preferredVerticalAligment == 'bottom' && pointerTopOffset + tooltipHeight > $('#view_content').height()) {
            return 'top';
          }
          return preferredVerticalAligment;
        }
        return vertical;
      }
      function getHorizontalPosition(pointerLeftOffset, containerLeftOffset, containerWidth, tooltipWidth) {
        var horizontal = {};
        horizontal.aligment = '';
        horizontal.left = pointerLeftOffset - containerLeftOffset;
        var leftLimit = containerLeftOffset;
        var rightLimit = leftLimit + containerWidth;
        if (pointerLeftOffset + tooltipWidth < rightLimit) {
          horizontal.left -= 21;
          horizontal.aligment = 'left';
        } else if (pointerLeftOffset - tooltipWidth + 23 > leftLimit) {
          horizontal.left -= (tooltipWidth - 23);
          horizontal.aligment = 'right';
        } else {
          horizontal.left -= (tooltipWidth / 2);
          horizontal.aligment = 'middle';
        }
        return horizontal;
      }
      return position;
    }
  }
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("components/bindingHandlers/backgroundBindingHandler.js", ["libs/knockout.js"], function(ko) {
  ko.bindingHandlers.background = {
    init: function(element) {
      $(element).css('background-position', '0 0').css('background-repeat', 'no-repeat');
    },
    update: function(element, valueAccessor) {
      var value = valueAccessor();
      if (value) {
        var src = value();
        var image = new Image();
        image.onload = function() {
          $(element).animate({opacity: 0}, 200, function() {
            $(element).css('background-image', 'url(' + src + ')').css('width', image.width).animate({height: image.height}, 200, function() {
              if (_.isFunction(value.onload)) {
                value.onload(image.width, image.height);
              }
              $(element).animate({opacity: 1}, 300);
            });
          });
          if (ko.isWriteableObservable(value.width)) {
            value.width(image.width);
          }
          if (ko.isWriteableObservable(value.height)) {
            value.height(image.height);
          }
        };
        image.src = src;
      }
    }
  };
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("browse.js", [], function() {
  function Browse() {
    var that = this;
    that.open = open;
    that.accept = accept;
    that.on = on;
    that.off = off;
    that.dispose = dispose;
    var collection = [];
    var settings = {
      selected: null,
      accept: null
    };
    function open() {
      var input = create();
      input.click();
      collection.push(input);
      return that;
    }
    function accept(value) {
      settings.accept = value;
      return that;
    }
    function on(eventName, callback) {
      if (eventName === 'selected') {
        settings.selected = callback;
      }
      return that;
    }
    function off(eventName) {
      if (eventName === 'selected') {
        settings.selected = null;
      }
      return that;
    }
    function create() {
      var input = document.createElement('input');
      input.setAttribute('type', 'file');
      input.style.position = 'absolute';
      input.style.left = '-9999px';
      input.style.top = '-9999px';
      if (settings.accept) {
        input.setAttribute('accept', settings.accept);
      }
      input.addEventListener('change', function(e) {
        if (_.isFunction(settings.selected) && this.files.length) {
          settings.selected.apply(null, this.files);
        }
      });
      document.body.appendChild(input);
      return input;
    }
    function dispose() {
      _.each(collection, function(input) {
        document.body.removeChild(input);
      });
    }
  }
  return Browse;
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("components/bindingHandlers/fileBrowserBindingHandler.js", ["libs/knockout.js", "browse.js"], function(ko, Browse) {
  ko.bindingHandlers.browse = {init: function(element, valueAccessor) {
      var value = valueAccessor();
      var browse = new Browse();
      browse.on('selected', value.callback).accept('audio/*');
      $(element).on('click', function() {
        if (_.isFunction(value.before)) {
          if (value.before()) {
            browse.open();
          }
        } else {
          browse.open();
        }
      });
      ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
        browse.dispose();
      });
    }};
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("components/bindingHandlers/customScrollbarBindingHandler.js", ["libs/knockout.js", "libs/durandal/composition.js"], function(ko, composition) {
  ko.bindingHandlers.scrollbar = {init: function(element, valueAccessor) {
      var byClass = valueAccessor().byClass,
          checkDOMChanges = valueAccessor().checkDOMChanges,
          scrollToEndAfterDOMChanged = valueAccessor().scrollToEndAfterDOMChanged,
          customScroll = null,
          scrollOptions = {
            mouseWheel: true,
            disableMouse: true,
            scrollbars: 'custom',
            interactiveScrollbars: true,
            probeType: 2
          },
          cssClasses = {
            scrollStarted: 'cs-scroll-started',
            scrollFinished: 'cs-scroll-finished',
            scrollEnabled: 'cs-scroll-enabled'
          };
      var customScrollbarContainer = byClass ? element.getElementsByClassName(byClass)[0] : element;
      customScroll = new IScroll(customScrollbarContainer, scrollOptions);
      if (checkDOMChanges) {
        refreshScrollAfterDomChanged();
      }
      customScroll.on('scroll', function() {
        customScrollbarContainer.classList.toggle(cssClasses.scrollStarted, this.y < 0);
        customScrollbarContainer.classList.toggle(cssClasses.scrollFinished, this.y === customScroll.maxScrollY);
      });
      scrollEnabled();
      ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
        customScroll.destroy();
        customScroll = null;
      });
      document.addEventListener('touchmove', function(e) {
        e.preventDefault();
      }, false);
      function refreshScrollAfterDomChanged() {
        var scrollHeight = customScroll.scroller.clientHeight;
        var interval = setInterval(function() {
          if (scrollHeight === customScroll.scroller.clientHeight) {
            return;
          }
          scrollHeight = customScroll.scroller.clientHeight;
          customScroll.refresh();
          if (scrollToEndAfterDOMChanged) {
            customScroll.scrollTo(0, customScroll.maxScrollY);
          }
          scrollEnabled();
        }, 500);
        ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
          clearInterval(interval);
        });
      }
      function scrollEnabled() {
        customScrollbarContainer.classList.toggle(cssClasses.scrollEnabled, customScroll.hasVerticalScroll);
      }
    }};
  composition.addBindingHandler('scrollbar');
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("viewmodels/questions/dragAndDropText/bindingHandlers/draggableTextBindingHandler.js", ["libs/knockout.js"], function(ko) {
  ko.bindingHandlers.draggableText = {
    init: function(element, valueAccessor) {
      var value = valueAccessor();
      $(element).draggable({
        containment: "parent",
        cursor: "move",
        scroll: false,
        start: function() {
          if (_.isFunction(value.startMove)) {
            value.startMove();
          }
        },
        drag: _.debounce(function(event, ui) {
          var x = ui.position.left,
              y = ui.position.top;
          if (ko.isWriteableObservable(value.x)) {
            value.x(x);
          }
          if (ko.isWriteableObservable(value.y)) {
            value.y(y);
          }
          if (_.isFunction(value.endMove)) {
            value.endMove(x, y);
          }
        }, 500)
      });
      return {'controlsDescendantBindings': true};
    },
    update: function(element, valueAccessor) {
      var value = valueAccessor();
      ko.bindingHandlers.text.update(element, function() {
        return value.text;
      });
      if (value.text()) {
        $(element).show();
      } else {
        $(element).hide();
      }
      if (value.x) {
        $(element).css('left', ko.unwrap(value.x) + 'px');
      }
      if (value.y) {
        $(element).css('top', ko.unwrap(value.y) + 'px');
      }
      setTimeout(function() {
        if (ko.isWriteableObservable(value.width)) {
          value.width($(element).outerWidth());
        }
        if (ko.isWriteableObservable(value.height)) {
          value.height($(element).outerHeight());
        }
      }, 0);
    }
  };
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("components/polygonsEditor/polygonShape.js", [], function() {
  var settings = {
    fillColor: '#66b963',
    strokeColor: '#559b53',
    selectedColor: 'green'
  };
  function PolygonShape(id, points, needUpdatePoints) {
    var that = this;
    this.id = id;
    this.path = null;
    this.isDirty = false;
    this.isUpdatePoints = needUpdatePoints || true;
    this.settings = settings;
    this.removePath = function() {
      if (that.path) {
        that.path.remove();
      }
    };
    this.markAsDirty = function() {
      that.isDirty = true;
    };
    this.markAsClean = function() {
      that.isDirty = false;
    };
    this.updatePoints = function(data) {
      if (data) {
        var selected = false;
        if (that.path) {
          selected = that.path.selected;
          that.path.remove();
        }
        if (data instanceof paper.Rectangle) {
          that.path = new paper.Path.Rectangle(data);
        } else if (data instanceof Array) {
          that.path = new paper.Path({
            segments: data,
            closed: true
          });
        }
        that.path.fillColor = that.settings.fillColor;
        that.path.fillColor.alpha = 0.6;
        that.path.strokeColor = that.settings.strokeColor;
        that.path.strokeColor.alpha = 0.7;
        that.path.selectedColor = that.settings.selectedColor;
        that.path.selected = selected;
      }
    };
    if (this.isUpdatePoints) {
      this.updatePoints(points);
    }
  }
  return PolygonShape;
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("components/polygonsEditor/polygonsEditor.js", ["localization/localizationManager.js", "constants.js", "components/polygonsEditor/polygonShape.js"], function(localizationManager, constants, PolygonShape) {
  "use strict";
  var Editor = function() {
    this.minSize = 10;
    this.hitOptions = {
      segments: true,
      stroke: false,
      fill: true,
      tolerance: 5
    };
    this.polygonToAdd = null;
    this.polygons = [];
    this.selectedPath = null;
    this.selectedSegment = null;
  };
  var PolygonEditor = function($element, domActions, polygonShape) {
    this._paper = new paper.PaperScope();
    this._editor = new Editor();
    this._PolygonShape = polygonShape || PolygonShape;
    this.$element = null;
    this.updateCanvasSize = updateCanvasSize;
    this.canvas = null;
    this.polygons = null;
    this.domActions = null;
    this.updatePolygons = updatePolygons;
    this.deselectAllElements = deselectAllElements;
    this.events = {
      polygonBeforeAdded: 'polygon:beforeAdded',
      polygonAfterAdded: 'polygon:afterAdded',
      polygonDeleted: 'polygon:deleted',
      polygonUpdated: 'polygon:updated'
    };
    var eventsQueue = [];
    this.on = function(event, callback) {
      if (typeof eventsQueue[event] === 'undefined') {
        eventsQueue[event] = [];
      }
      eventsQueue[event].push(callback);
    };
    this.fire = function(event) {
      var queue = eventsQueue[event];
      if (_.isNullOrUndefined(queue)) {
        return;
      }
      var args = [];
      for (var i = 1; i < arguments.length; i++) {
        args.push(arguments[i]);
      }
      for (var j = 0; j < queue.length; j++) {
        queue[j].apply(this, args);
      }
    };
    init.call(this, $element, domActions);
  };
  return PolygonEditor;
  function init($element, domActions) {
    var that = this;
    that.$element = $element;
    that.domActions = domActions;
    that.canvas = generateCanvas();
    $element.prepend(that.canvas);
    that._paper.setup(that.canvas);
    that._paper.settings.handleSize = 10;
    that.domActions.setCreateState(that.canvas);
    that._editor.selectedPath = null;
    that._editor.selectedSegment = null;
    var rectangleTool = new that._paper.Tool();
    rectangleTool.onMouseDown = function(event) {
      if (event.event.button === 0) {
        that.deselectAllElements();
        var hitResult = that._paper.project.hitTest(event.point, that._editor.hitOptions);
        if (hitResult) {
          if (hitResult.type === 'segment') {
            that._editor.selectedSegment = hitResult.segment;
            that.domActions.setResizingState();
          } else if (hitResult.type === 'fill' && hitResult.item != that._editor.selectedPath) {
            var path = that._editor.selectedPath = hitResult.item;
            path.selected = true;
            path.bringToFront();
            if (!(path.parent instanceof paper.Layer)) {
              var raster = path.parent.getItem({class: paper.Raster});
              if (raster) {
                raster.bringToFront();
              }
            }
            that.domActions.setDraggingState();
          }
        } else {
          addPolygonStart(event.point);
          that.domActions.setCreatingState();
        }
      }
    };
    rectangleTool.onMouseUp = function(event) {
      if (event.item instanceof that._paper.Path) {
        that.domActions.setHoverOnActiveState();
      } else if (event.item instanceof that._paper.Segment) {
        that.domActions.setResizeState();
      }
      if (that._editor.selectedPath) {
        updatePolygonEnd(that._editor.selectedPath);
      } else if (that._editor.selectedSegment) {
        var sizeIsValid = pathSizeIsValid(that._editor.selectedSegment.path);
        if (that._editor.polygonToAdd) {
          if (sizeIsValid) {
            addPolygonEnd();
          } else {
            that._editor.selectedSegment.path.remove();
            that._editor.selectedSegment = null;
            that._paper.view.draw();
            that.domActions.setCreateState();
          }
          that._editor.polygonToAdd = null;
        } else {
          if (sizeIsValid) {
            updatePolygonEnd(that._editor.selectedSegment.path);
          } else {
            removePolygonByPath(that._editor.selectedSegment.path);
          }
        }
      }
    };
    rectangleTool.onMouseMove = function(event) {
      var hitResult = that._paper.project.hitTest(event.point, that._editor.hitOptions);
      if (hitResult) {
        if (hitResult.type === 'segment') {
          that.domActions.setResizeState();
        } else if (hitResult.type === 'fill') {
          if (hitResult.item.selected) {
            that.domActions.setHoverOnActiveState();
          } else {
            that.domActions.setDragState();
          }
        }
      } else {
        that.domActions.setCreateState();
      }
    };
    rectangleTool.onMouseDrag = function(event) {
      var raster;
      var size = that._paper.view.size;
      var viewRect = new that._paper.Rectangle(0, 0, size.width, size.height);
      var deltaX = event.delta.x;
      var deltaY = event.delta.y;
      if (that._editor.selectedSegment) {
        var segment = that._editor.selectedSegment;
        if (!(segment.path.parent instanceof paper.Layer)) {
          raster = segment.path.parent.getItem({class: paper.Raster});
          if (raster) {
            raster.remove();
          }
        }
        var point = segment.point.clone();
        point.x += deltaX;
        point.y += deltaY;
        if (viewRect.contains(point)) {
          if (segment.path.segments.length === 4) {
            var prev = segment.previous;
            var next = segment.next;
            if (prev.point.x === segment.point.x && next.point.y === segment.point.y) {
              prev.point.x += deltaX;
              next.point.y += deltaY;
            } else if (prev.point.y === segment.point.y && next.point.x === segment.point.x) {
              prev.point.y += deltaY;
              next.point.x += deltaX;
            }
          }
          segment.point.x += deltaX;
          segment.point.y += deltaY;
          segment.path.selected = true;
          markPolygonAsDitryByPath(segment.path);
        }
      } else if (that._editor.selectedPath) {
        var path = that._editor.selectedPath;
        if (!(path.parent instanceof paper.Layer)) {
          raster = path.parent.getItem({class: paper.Raster});
          if (raster) {
            raster.remove();
          }
        }
        var bounds = path.bounds.clone();
        bounds.x += deltaX;
        bounds.y += deltaY;
        if (viewRect.contains(bounds)) {
          path.position.x += deltaX;
          path.position.y += deltaY;
          markPolygonAsDitryByPath(path);
        }
      }
    };
    rectangleTool.onKeyDown = function(event) {
      if (event.key === 'delete' && that._paper.project.selectedItems.length > 0) {
        while (that._paper.project.selectedItems.length > 0) {
          var selectedItem = that._paper.project.selectedItems[0];
          if (selectedItem instanceof that._paper.Path) {
            removePolygonByPath(selectedItem);
          } else {
            selectedItem.remove();
          }
        }
        return false;
      }
    };
    that.on(that.events.polygonAfterAdded, function(id) {
      var polygon = findPolygonById.call(that, id);
      polygon.path.selected = true;
      that._paper.view.draw();
    });
    return that.canvas;
    function addPolygonStart(startPoint) {
      var rectangle = new that._paper.Rectangle(startPoint, new that._paper.Size(1, 1));
      that._editor.polygonToAdd = new that._PolygonShape(null, rectangle);
      that._editor.polygonToAdd.path.selected = true;
      that._editor.selectedSegment = that._editor.polygonToAdd.path.segments[2];
    }
    function addPolygonEnd() {
      that._editor.polygons.push(that._editor.polygonToAdd);
      addPolygon(that._editor.polygonToAdd);
    }
    function addPolygon(polygonToAdd) {
      var points = getPointsFromPath(polygonToAdd.path);
      that.fire(that.events.polygonBeforeAdded, points);
    }
    function markPolygonAsDitryByPath(path) {
      var polygon = findPolygonByPath.call(that, path);
      if (polygon && !polygon.isDirty) {
        polygon.markAsDirty();
      }
    }
    function updatePolygonEnd(path) {
      updatePolygonByPath(path);
    }
    function updatePolygonByPath(path) {
      var polygon = findPolygonByPath.call(that, path);
      if (polygon && polygon.isDirty) {
        polygon.markAsClean();
        var polygonViewModel = findPolygonViewModelById.call(that, polygon.id);
        if (polygonViewModel) {
          var points = getPointsFromPath(path);
          that.fire(that.events.polygonUpdated, polygonViewModel, points);
        } else {
          throw 'Polygon ViewModel in null';
        }
      }
    }
    function removePolygonByPath(path) {
      var polygon = findPolygonByPath.call(that, path);
      if (polygon) {
        var polygonViewModel = findPolygonViewModelById.call(that, polygon.id);
        that._editor.polygons.splice(that._editor.polygons.indexOf(polygon), 1);
        if (polygonViewModel) {
          that.fire(that.events.polygonDeleted, polygonViewModel);
        }
        polygon.removePath();
      } else {
        path.remove();
      }
    }
    function pathSizeIsValid(path) {
      return path.bounds.width > that._editor.minSize && path.bounds.height > that._editor.minSize;
    }
    function generateCanvas() {
      var canvas = document.createElement('canvas');
      canvas.className = "hotspot-area";
      return canvas;
    }
  }
  function deselectAllElements() {
    this._paper.project.activeLayer.selected = false;
    this._editor.selectedPath = null;
    this._editor.selectedSegment = null;
    this._paper.view.draw();
  }
  function getPointsFromPath(path) {
    return _.map(path.segments, function(segment) {
      var point = segment.point;
      return {
        x: Math.round(point.x),
        y: Math.round(point.y)
      };
    });
  }
  function findPolygonByPath(path) {
    return _.find(this._editor.polygons, function(polygon) {
      return polygon.path === path;
    });
  }
  function findPolygonById(id) {
    return _.find(this._editor.polygons, function(polygon) {
      return polygon.id === id;
    });
  }
  function findPolygonViewModelById(id) {
    return _.find(this.polygons(), function(polygonViewModel) {
      return polygonViewModel.id === id;
    });
  }
  function updateCanvasSize(width, height) {
    var $canvas = $(this.canvas);
    if ($canvas[0].width != width || $canvas[0].height != height) {
      this._paper.view.viewSize = new this._paper.Size(width, height);
      this._paper.view.draw();
    }
  }
  function updatePolygons(polygons) {
    var that = this;
    that.polygons = polygons;
    paper = that._paper.view._scope;
    _.each(polygons(), function(polygon) {
      var polygonInEditor = _.find(that._editor.polygons, function(polygonShape) {
        return polygon.id === polygonShape.id;
      });
      if (polygonInEditor) {
        polygonInEditor.updatePoints(polygon.points(), polygon.onClick);
      } else {
        that._editor.polygons.push(new that._PolygonShape(polygon.id, polygon.points(), polygon.onClick));
      }
    });
    that._editor.polygons = _.filter(that._editor.polygons, function(polygonShape) {
      if (polygonShape.id != null && _.find(polygons(), function(polygon) {
        return polygon.id === polygonShape.id;
      })) {
        return true;
      } else {
        polygonShape.removePath();
        return false;
      }
    });
    that._paper.view.draw();
  }
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("widgets/cursorTooltip/bindingHadlers/cursorTooltipBindingHandler.js", [], function() {
  'use strict';
  return {install: install};
  function install() {
    ko.bindingHandlers.cursorTooltip = {update: function(element, valueAccessor) {
        var $element = $(element),
            isVisible = valueAccessor();
        if (isVisible()) {
          $element.show();
          $('html').bind('mousemove', updateTooltipPosition);
        } else {
          $element.hide();
          $('html').unbind('mousemove', updateTooltipPosition);
        }
        function updateTooltipPosition(evt) {
          $element.css('top', evt.pageY + 5).css('left', evt.pageX + 5);
        }
      }};
  }
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("widgets/cursorTooltip/viewmodel.js", ["widgets/cursorTooltip/bindingHadlers/cursorTooltipBindingHandler.js", "localization/localizationManager.js"], function(cursorTooltipBindingHandler, localizationManager) {
  'use strict';
  var cursorTolltip = {
    isVisible: ko.observable(false),
    show: show,
    hide: hide,
    changeText: changeText,
    text: ko.observable(''),
    activate: activate
  };
  return cursorTolltip;
  function activate() {
    cursorTooltipBindingHandler.install();
  }
  function changeText(resourseKey) {
    if (localizationManager.hasKey(resourseKey)) {
      cursorTolltip.text(localizationManager.localize(resourseKey));
    } else {
      cursorTolltip.text('');
    }
  }
  function show() {
    cursorTolltip.isVisible(true);
  }
  function hide() {
    cursorTolltip.isVisible(false);
  }
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("viewmodels/questions/hotSpot/bindingHandlers/polygonsEditorBindingHandler.js", ["libs/durandal/composition.js", "components/polygonsEditor/polygonsEditor.js", "widgets/cursorTooltip/viewmodel.js"], function(composition, PolygonsEditor, cursorTooltip) {
  return {install: install};
  function install() {
    ko.bindingHandlers.polygonsEditor = {
      init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
        var value = valueAccessor();
        var actions = value.actions;
        var $element = $(element);
        var $designer = $element.closest('.hotspot-designer');
        var domActions = {
          setCreateState: setCreateState,
          setCreatingState: setCreatingState,
          setResizeState: setResizeState,
          setResizingState: setResizingState,
          setDragState: setDragState,
          setDraggingState: setDraggingState,
          setHoverOnActiveState: setHoverOnActiveState
        };
        var polygonsEditor = new PolygonsEditor($element, domActions);
        ko.utils.domData.set(element, 'ko_polygonEditor', polygonsEditor);
        polygonsEditor.on(polygonsEditor.events.polygonUpdated, function(polygonViewModel, points) {
          actions.updatePolygon.end(polygonViewModel, points);
        });
        polygonsEditor.on(polygonsEditor.events.polygonDeleted, function(polygonViewModel) {
          actions.removePolygon(polygonViewModel);
        });
        polygonsEditor.on(polygonsEditor.events.polygonBeforeAdded, function(points) {
          actions.addPolygon(points).then(function(id) {
            polygonsEditor.fire(polygonsEditor.events.polygonAfterAdded, id);
          });
        });
        ko.applyBindingsToDescendants(bindingContext, element);
        setUpHoverOnCanvas($designer);
        ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
          $('html').unbind('click', blurHandler);
          cursorTooltip.hide();
          ko.utils.domData.clear(element);
        });
        return {'controlsDescendantBindings': true};
        function setUpHoverOnCanvas($element) {
          $('canvas', $element).hover(function() {
            cursorTooltip.show();
            $element.addClass('hover');
          }, function() {
            cursorTooltip.hide();
            $element.removeClass('hover');
          }).click(function() {
            document.activeElement.blur();
            $('html').bind('click', blurHandler);
          });
        }
        function blurHandler(event) {
          if (event.target !== polygonsEditor.canvas) {
            polygonsEditor.deselectAllElements();
            $('html').unbind('click', blurHandler);
          }
        }
        function removeState() {
          $designer.removeClass('create creating resize resizing drag dragging active');
        }
        function setCreateState() {
          removeState();
          cursorTooltip.changeText('hotSpotTooltipCreate');
          $designer.addClass('create');
        }
        function setCreatingState() {
          removeState();
          cursorTooltip.changeText('');
          $designer.addClass('creating');
        }
        function setResizeState() {
          removeState();
          cursorTooltip.changeText('hotSpotTooltipResize');
          $designer.addClass('resize');
        }
        function setResizingState() {
          removeState();
          cursorTooltip.changeText('');
          $designer.addClass('resizing');
        }
        function setDragState() {
          removeState();
          cursorTooltip.changeText('hotSpotTooltipDrag');
          $designer.addClass('drag');
        }
        function setDraggingState() {
          removeState();
          cursorTooltip.changeText('');
          $designer.addClass('dragging');
        }
        function setHoverOnActiveState() {
          removeState();
          cursorTooltip.changeText('hotSpotTooltipActive');
          $designer.addClass('active');
        }
      },
      update: function(element, valueAccessor) {
        var value = valueAccessor();
        var background = value.background;
        var polygons = value.polygons;
        var polygonsEditor = ko.utils.domData.get(element, 'ko_polygonEditor');
        polygonsEditor.updateCanvasSize(background.width(), background.height());
        polygonsEditor.updatePolygons(polygons);
      }
    };
    composition.addBindingHandler('polygonsEditor');
  }
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("viewmodels/questions/fillInTheBlank/bindingHandlers/fillInTheBlankBindingHandler.js", ["libs/knockout.js"], function(ko) {
  ko.bindingHandlers.fillInTheBlank = {init: function(element, valueAccessor) {
      var editorName = valueAccessor().name,
          createButtonSelectors = valueAccessor().createButtonSelectors,
          language = valueAccessor().language || 'en',
          eventTracker = valueAccessor().eventTracker || null;
      if (!_.isNullOrUndefined(createButtonSelectors.addBlank)) {
        $(createButtonSelectors.addBlank, element).click(function() {
          createBlank(CKEDITOR.plugins.fillintheblank.commands.addBlank);
        });
      }
      if (!_.isNullOrUndefined(createButtonSelectors.addDropDownBlank)) {
        $(createButtonSelectors.addDropDownBlank, element).click(function() {
          createBlank(CKEDITOR.plugins.fillintheblank.commands.addDropDownBlank);
        });
      }
      function createBlank(command) {
        var editor = CKEDITOR.instances[editorName];
        if (!editor.focusManager.hasFocus) {
          var range = editor.createRange();
          range.moveToElementEditablePosition(editor.editable(), true);
          editor.getSelection().selectRanges([range]);
        }
        editor.execCommand(command);
      }
    }};
});

_removeDefine();
})();
System.register("viewmodels/questions/singleSelectImage/bindingHandlers/answerImageBindingHandler.js", ["libs/knockout.js"], function($__export) {
  "use strict";
  var __moduleName = "viewmodels/questions/singleSelectImage/bindingHandlers/answerImageBindingHandler.js";
  var ko;
  return {
    setters: [function($__m) {
      ko = $__m.default;
    }],
    execute: function() {
      ko.bindingHandlers.answerImage = {
        init: function() {},
        update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
          var image = ko.unwrap(valueAccessor().answer.image),
              onload = ko.unwrap(valueAccessor().onload),
              isImageLoading = ko.unwrap(valueAccessor().answer.isImageLoading),
              imageUrl = (image && !_.isNullOrUndefined(image)) ? image + '?width=150&height=150&scaleBySmallerSide=true' : '/Content/images/singleSelectImageAnswer.png';
          if (isImageLoading) {
            $(element).css('background-image', 'url(' + '' + ')');
            return;
          }
          var img = new Image();
          img.src = imageUrl;
          img.onload = function() {
            $(element).css('background-image', ("url(" + imageUrl + ")"));
            if (onload) {
              onload.call(this, bindingContext.$data);
            }
          };
        }
      };
    }
  };
});

(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("widgets/imagePreview/bindingHandlers/fadeBindingHandler.js", ["libs/durandal/composition.js"], function(composition) {
  ko.bindingHandlers.fade = {
    init: function(element, valueAccessor) {
      var $element = $(element),
          data = valueAccessor() || {},
          value = ko.utils.unwrapObservable(data);
      if (value) {
        $element.stop().show();
      } else {
        $element.stop().hide();
      }
    },
    update: function(element, valueAccessor) {
      var $element = $(element),
          data = valueAccessor() || {},
          value = ko.utils.unwrapObservable(data);
      if (value) {
        $element.stop().fadeIn();
      } else {
        $element.stop().fadeOut();
      }
    }
  };
  composition.addBindingHandler('fade');
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("widgets/imagePreview/bindingHandlers/imageLoaderBindingHandler.js", ["libs/durandal/composition.js"], function(composition) {
  var image = new Image();
  image.className = 'image';
  image.style.display = 'none';
  image.style.width = 'auto';
  image.style.height = 'auto';
  ko.bindingHandlers.imageLoader = {
    init: function(element, valueAccessor) {
      var $element = $(element),
          data = valueAccessor() || {},
          isLoaded = data.isLoaded;
      var resizeHandler = $(window).on('resize', function() {
        if (isLoaded()) {
          updatePreviewImageSize($element);
        }
      });
      var orientationChangeHandler = $(window).on("orientationchange", function() {
        if (isLoaded()) {
          updatePreviewImageSize($element);
        }
      });
      ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
        $(window).unbind('resize', resizeHandler);
        $(window).unbind('orientationchange', orientationChangeHandler);
      });
      $element.append(image);
    },
    update: function(element, valueAccessor) {
      var $element = $(element),
          data = valueAccessor() || {},
          isLoaded = data.isLoaded,
          imageUrl = data.imageUrl();
      $(image).hide();
      isLoaded(false);
      var browserWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
      var browserHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
      var maxSize = browserWidth > browserHeight ? browserWidth : browserHeight;
      var resizedImageUrl = imageUrl + '?height=' + maxSize + '&width=' + maxSize;
      image.onload = function() {
        if (data.imageUrl() === imageUrl) {
          updatePreviewImageSize($element);
          isLoaded(true);
          $(image).fadeIn();
        }
      };
      image.src = resizedImageUrl;
    }
  };
  function updatePreviewImageSize($element) {
    var browserWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0) - 46;
    var browserHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0) - 46;
    $('.image', $element).css('maxWidth', browserWidth - 46 + 'px').css('maxHeight', browserHeight - 46 + 'px');
  }
  composition.addBindingHandler('imageLoader');
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("viewmodels/courses/bindingHandlers/elementCollapseBinding.js", ["libs/knockout.js"], function(ko) {
  ko.bindingHandlers.elementCollapse = {update: function(element, valueAccessor) {
      var $container = $(element),
          value = ko.unwrap(valueAccessor());
      var $elemForCollapse = $container.find("[data-animate]");
      if (value) {
        $container.animate({height: 'hide'});
        $elemForCollapse.animate({top: $container.height() * -1});
      } else {
        $container.animate({height: 'show'});
        $elemForCollapse.animate({top: 0});
      }
    }};
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("viewmodels/courses/bindingHandlers/windowMessageListenerBinding.js", ["libs/knockout.js"], function(ko) {
  ko.bindingHandlers.windowMessageListener = {init: function(element, valueAccessor) {
      var callBack = valueAccessor();
      if (!_.isFunction(callBack)) {
        return;
      }
      var listener = function(event) {
        var sender = event.source,
            templateWindow = element.contentWindow;
        if (sender && templateWindow && sender === templateWindow) {
          callBack(event.data);
        }
      };
      window.addEventListener('message', listener, false);
      ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
        window.removeEventListener('message', listener, false);
      });
    }};
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("viewmodels/courses/bindingHandlers/courseIntroductionAnimationBinding.js", ["libs/knockout.js"], function(ko) {
  ko.bindingHandlers.introAnimate = {
    init: function(element) {
      var $element = $(element),
          minHeight = 150,
          contentHeight = $element.find('[data-content]').outerHeight(true);
      $element.css('height', contentHeight <= minHeight ? contentHeight : minHeight);
    },
    update: function(element, valueAccessor) {
      var $element = $(element),
          minHeight = 150,
          contentHeight = $element.find('[data-content]').outerHeight(true),
          isEdititng = ko.unwrap(valueAccessor().isEditing),
          overlayHideClass = 'overlay-hide',
          duration = 400;
      if (isEdititng) {
        $element.animate({height: contentHeight}, duration, function() {
          $element.css('height', 'auto');
        });
      } else {
        contentHeight < minHeight ? $element.addClass(overlayHideClass) : $element.removeClass(overlayHideClass);
        $element.animate({height: contentHeight <= minHeight ? contentHeight : minHeight}, duration);
      }
    }
  };
});

_removeDefine();
})();
System.registerDynamic("viewmodels/courses/bindingHandlers/publishTabBinding.js", [], false, function(__require, __exports, __module) {
  var _retrieveGlobal = System.get("@@global-helpers").prepareGlobal(__module.id, null, null);
  (function() {
    ko.bindingHandlers.publishTabs = {init: function(element) {
        var $element = $(element),
            dataTabLink = 'data-tab-link',
            dataTabContent = 'data-tab-content',
            $tabLinks = $element.find('[' + dataTabLink + ']'),
            $contents = $element.find('[' + dataTabContent + ']'),
            activeClass = 'active',
            duration = 200;
        $tabLinks.first().addClass(activeClass);
        $contents.first().show().addClass(activeClass);
        $tabLinks.each(function(index, item) {
          var $item = $(item);
          $item.on('click', function() {
            if ($item.hasClass(activeClass)) {
              return;
            }
            var key = $item.attr(dataTabLink),
                $previousContentTab = $element.find('.' + activeClass + '[' + dataTabContent + ']'),
                $currentContentTab = $element.find('[' + dataTabContent + '="' + key + '"]');
            $tabLinks.removeClass(activeClass);
            $item.addClass(activeClass);
            $previousContentTab.fadeOut(duration, function() {
              $currentContentTab.fadeIn(duration).addClass(activeClass);
              $previousContentTab.removeClass(activeClass);
            });
          });
        });
      }};
  })();
  return _retrieveGlobal();
});

(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("viewmodels/learningContents/components/hotspotParser.js", ["libs/durandal/system.js", "constants.js"], function(system, constants) {
  'use strict';
  var templates = {
    hotspotWrapper: '<span data-type="' + constants.learningContentsTypes.hotspot + '" class="hotspotOnImage" style="position: relative;display: inline-block;max-width: 100%"><img src="{url}" alt="" style="max-width:100%" /></span>',
    spotWrapper: '<span class="spot" style="position: absolute; display: inline-block;" data-text=""></span>'
  },
      attributes = {
        dataId: 'data-id',
        dataText: 'data-text',
        src: 'src'
      };
  return {
    getViewModelData: getViewModelData,
    updateHotspotOnAnImage: updateHotspotOnAnImage,
    getMinMaxCoords: getMinMaxCoords
  };
  function updateHotspotOnAnImage(data, background, polygons) {
    if (_.isEmpty(data())) {
      return templates.hotspotWrapper.replace('{url}', background());
    }
    var $newData = $(templates.hotspotWrapper.replace('{url}', background()));
    _.each(polygons(), function(polygon) {
      var id = polygon.id,
          text = polygon.text,
          minMaxCoords = getMinMaxCoords(polygon.points()),
          width = minMaxCoords.maxX - minMaxCoords.minX,
          height = minMaxCoords.maxY - minMaxCoords.minY,
          top = minMaxCoords.minY,
          left = minMaxCoords.minX,
          $spot = $(templates.spotWrapper);
      $spot.attr(attributes.dataId, id).attr(attributes.dataText, text).width(width).height(height).css('top', top).css('left', left);
      $newData.append($spot);
    });
    return $('<div>').append($newData).html();
  }
  function getViewModelData(data) {
    var $data = $(data),
        $spots = $data.find('[' + attributes.dataId + ']'),
        background = $data.find('img').attr(attributes.src),
        polygons = [];
    $spots.each(function(index, element) {
      var $spot = $(element),
          id = $spot.attr(attributes.dataId),
          points = getPoints($spot[0]),
          text = $spot.attr(attributes.dataText);
      var polygon = {
        id: id,
        points: points,
        text: text
      };
      polygons.push(polygon);
    });
    return {
      background: background,
      polygons: polygons
    };
  }
  function getPoints(element) {
    var width = parseInt(element.style.width),
        height = parseInt(element.style.height),
        top = parseInt(element.style.top),
        left = parseInt(element.style.left),
        points = [];
    points.push({
      x: left,
      y: top
    });
    points.push({
      x: left + width,
      y: top
    });
    points.push({
      x: left + width,
      y: top + height
    });
    points.push({
      x: left,
      y: top + height
    });
    return points;
  }
  function getMinMaxCoords(points) {
    var minX = _.min(points, function(point) {
      return point.x;
    }),
        minY = _.min(points, function(point) {
          return point.y;
        }),
        maxX = _.max(points, function(point) {
          return point.x;
        }),
        maxY = _.max(points, function(point) {
          return point.y;
        });
    return {
      minX: minX.x,
      minY: minY.y,
      maxX: maxX.x,
      maxY: maxY.y
    };
  }
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("components/polygonsEditor/hotspotOnImageShapeModel.js", ["components/polygonsEditor/polygonShape.js"], function(PolygonShape) {
  'use strict';
  var informationIcon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDE0IDc5LjE1Njc5NywgMjAxNC8wOC8yMC0wOTo1MzowMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjJDQUU2NzIwRTc2MjExRTRCMUY5QUU4MjNFMzcyOUU1IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjJDQUU2NzIxRTc2MjExRTRCMUY5QUU4MjNFMzcyOUU1Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MkNBRTY3MUVFNzYyMTFFNEIxRjlBRTgyM0UzNzI5RTUiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MkNBRTY3MUZFNzYyMTFFNEIxRjlBRTgyM0UzNzI5RTUiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6BgWwaAAAHd0lEQVR42sxZWWyUVRQ+M11npttsbWfa6UoXKliR1iUxCsXExEATESmiCcoS2RVfFKM+uD+hiRCtEdCkRIUICQjxAcrywA6ylGJbSls7bYfpvnem7Yznu/x30hZKZyhYT/LRO/dfzvefc++55xxUNI6oVCqBoKAgCgkJodDQUNJoNKTVamnO4nVqviWfMZeRx8hkJDB0yuO9jAZGJeM84yjjXPmxPZ7e3l4C+vr6qL+/n9rb2+leohqPnFqtpuDgYAoLCxOkIiIi6LlX1iby5XWM1xg2CkzqGbsY226ePmDv7Oykrq4uqqqqCowgiAGwWHh4OEVGRtLzS9828qVPGCsZobgvNIhIrwshc4yODFE6io7QkiY8TDw7ODxMPX0uauvqI2d7Dzk7eqnfPSxVuBk/Mj5moq2lpaX3JBg8lhxcCnI6HSuNjqZnF61ZjK9mmHCPXqOmaQl6SrKYBXm4HVbGMsCzeAfE4/HQMBMdHBwkl8tFtY3NVHajgezNXaFeorV8y+K0pxas57+/+WVBSQ7KQG7+8vdA/lvGalxnY9HMVBOlJFooJiZGuPxu5LA8IF6v9w6SWHP1jU46dqGCbrFlFfmeseHHLzYNjUtQbgYog2Imp1W+bL6KvJRsDKdZ2clkNptHkYOlsU7lspAbSxKUJIGhoSFyu92CZE9PD5386zqdulpDwx4vbv+DUcQk++6yH25vCEluwYr3YbnfGYVqlZdyk2JoekYKxcbGCnKwLtYmiOGjRpIaTyRZWBNEBwYGxE7+u7qO9pVeJNegMN5+xstjLRmMl8NFUIo1x7IV5IKYXF66ibKmpVBcXBzp9Xqxm6XV/CE2NmRJT8nQ9eh0XuuacNp16CQNuIcKFd2rRz4bBGWS3Nyi9UU89xXcmpscQzlZaWSxWMhgMAjLwcrSpf6SuxtRud6BqAgdR4IIKq+2k8frzdt/5HRl4byny3x7A18CyyihBF9AKaZw4VZpOUlOunQ8aW3rEC70h+jIDflIZioVPJEjL29d+cHXZh9BuAxrj+UzhJIIjnKPZSWLNTfSrRNZ7ciJU1S0ahNt3Py539aU8RYk5zyZS7Y4Ay7hn099BLEb+YRI4vEKTMxMNft2q7/kII0Op9gIjuaWgFyOd0svFhbkk/q2nuVsxSSxSXCBZQ0jxKBVU3JCvG+3gtxEbpVS9NKLZDYZKDsjLeB1KQ8HxNjsNCuvx4YQhdNm1YrNWxD66xiJeelGysvNIavVKtyLNSJPhoctiJUI5peuVdL2veL4szOSZVaSGMJna7LV7AvCMpT8VwJd0JmVnsTnugZTSEzyEZQLxMrks0yerYG4FtJ0q5kuXikXazAjLZljZ+p9ERQ7m3WnJ8XTxfIaTM8FwdkYISuRZ2ug1vum+Gc6f+l26NJpNbS/5LtJWTHd5iOYBxdnCQtG6XwHf6CBeOnC+bTghbm3M9W+/km5GbqtsUY5lQWCFoyQz41NmfyV3BnZ9M5byx7IWoRuY0yU/GkBk0iMkGyOTZmmQqAbXBSJVI/NpANJAh4WwZH6QbAbA6Tp/xdxuQflsBsEmzBCDYFgKXO3qRLobuvs9kUwEKzACAUOEkpJcioJNjW3yZ8VIHgBI1RfqB0kyakS6L5Z75A/z6uVolqUhjgLQXKqrCjKAtZdUdMop46C4FkczKhb67g0BEkknYEQxEkyb+Ebvt8YY+5+CFbV2qm9q0cmC+fUaEfwoAQzZdUNoupC9QVX+0syOiqSIjl1HwnMBWw91nn8zFU5VcIFlCcY1ZVSmL9bz0V1fZOToqKiRJ3ib8Lw5qsLBSbrXrujmS5X1MruwzYRB0EQvRK0I2Cw41xUo25FaRioqydDDrp2Hzoh9e1g69kFQXSZ0MhBrwR1j6Oth05fqhB1a6Cuvu+NAdeevUJVdSIktzI+HFV2wpWebke/PjHrH55bZHe2U5xeRwY+tEeWmQ/6CJSdh6raBvpp7xEZ3lax9c76CErloph2d5TpYlMs/FxeVf0tspmjecFrRyURD4qkJIdezdaSA1y4Y9nRD0zuy1HZDeIe3NzR0UFOpxNzG9GGcLmHqOTgSSqvqnng7pZuRUjZsnMf9fYPyNbHhrH3Bo18SCQNHY3DBls2bn6cg2ZG2Q07ZxQespj1o1oYMvMIlJjcEMfPXKadew/LxOAgYwlbb+CuBCU53ws6mwb1iZm7eSqWf+dV1zupktcJWhQ6TdgdBANpHiGMbd/zJ504f41dLPQWM5YxOZff7Tej0Ujx8fFks9ko2Jq7ROkTmsAjO8VKz8zOoczURL/bb8NiI9hFEEacUwyCCn8jE/tlwg6rfBHWmRK4fV9sdbt/1abkH0Y7gqeWX69pDGVQdKSWptniKM1m4RrCINJ0jWLdAdcgtXPK5Ghup+r6JnG2KseXDMI7GB/NiFVN2IZQTdQChjXRp4FFh43ZqFXRtn1d6eoHIg3Kkbp1VkKoHRvS4XBQcXHx5JvoaIWgBWcymQTcMRmy4C9QytZMpdCOUF7Toxz2lUo6h1bBuRyT14P/dmhtbaWWlhaBiZro/wowAFlxX6TKGmkMAAAAAElFTkSuQmCC',
      settings = {
        minRasterWidth: 0,
        minRasterHeight: 0
      };
  var HotspotOnImageShapeModel = function(id, points, onClick) {
    PolygonShape.call(this, id, points, false);
    var that = this,
        mouseDownPoint = null;
    this.group = null;
    this.onClick = null;
    this.raster = null;
    this.removePath = function() {
      if (that.raster) {
        that.raster.remove();
      }
      if (that.group) {
        that.group.removeChildren();
        that.group.remove();
      } else if (that.path) {
        that.path.remove();
      }
    };
    this.updatePoints = function(data, onClick) {
      if (data) {
        var selected = false;
        if (that.group) {
          that.group.removeChildren();
          that.group.remove();
        }
        if (that.path) {
          selected = that.path.selected;
          that.path.remove();
        }
        if (data instanceof paper.Rectangle) {
          that.path = new paper.Path.Rectangle(data);
        } else if (data instanceof Array) {
          that.path = new paper.Path({
            segments: data,
            closed: true
          });
        }
        that.path.fillColor = that.settings.fillColor;
        that.path.fillColor.alpha = 0.6;
        that.path.strokeColor = that.settings.strokeColor;
        that.path.strokeColor.alpha = 0.7;
        that.path.selectedColor = that.settings.selectedColor;
        that.path.selected = selected;
        that.onClick = onClick;
        if (canDrawRaster()) {
          var centerPoint = getShapeCenter(that.path);
          that.raster = new paper.Raster(informationIcon, centerPoint);
          settings.minRasterHeight = that.raster.height + 5;
          settings.minRasterWidth = that.raster.width + 5;
          that.group = new paper.Group([that.path, that.raster]);
          if (that.group) {
            that.group.on('mousedown', onMouseDown);
            that.group.on('mouseup', onMouseUp);
          }
        } else {
          that.path.onMouseDown = onMouseDown;
          that.path.onMouseUp = onMouseUp;
        }
      }
    };
    this.updatePoints(points, onClick);
    function onMouseDown(evt) {
      mouseDownPoint = evt.point;
    }
    function onMouseUp(evt) {
      if (mouseDownPoint && mouseDownPoint.x === evt.point.x && mouseDownPoint.y === evt.point.y) {
        that.onClick(evt, points);
      }
    }
    function canDrawRaster() {
      return that.path.bounds.width > settings.minRasterWidth && that.path.bounds.height > settings.minRasterHeight;
    }
  };
  return HotspotOnImageShapeModel;
  function getShapeCenter(path) {
    var position = path.getPosition();
    return new paper.Point(position.x, position.y);
  }
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("viewmodels/learningContents/bindingHandlers/hotspotOnImageBindingHandler.js", ["libs/durandal/composition.js", "components/polygonsEditor/polygonsEditor.js", "viewmodels/learningContents/components/hotspotParser.js", "widgets/cursorTooltip/viewmodel.js", "components/polygonsEditor/hotspotOnImageShapeModel.js"], function(composition, PolygonsEditor, parser, cursorTooltip, PolygonShape) {
  'use strict';
  ko.bindingHandlers.hotspotOnImage = {
    init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
      var $element = $(element),
          isEditing = valueAccessor().isEditing,
          saveHandler = valueAccessor().save,
          actions = valueAccessor().actions,
          that = bindingContext.$root;
      var domActions = {
        setCreateState: setCreateState,
        setCreatingState: setCreatingState,
        setResizeState: setResizeState,
        setResizingState: setResizingState,
        setDragState: setDragState,
        setDraggingState: setDraggingState,
        setHoverOnActiveState: setHoverOnActiveState
      };
      var editor = new PolygonsEditor($element, domActions, PolygonShape);
      ko.utils.domData.set(element, 'ko_polygonEditor', editor);
      if (isEditing()) {
        startEditing();
      }
      setUpHoverOnCanvas($element);
      editor.on(editor.events.polygonUpdated, function(polygonViewModel, points) {
        actions.update(polygonViewModel.id, points);
        saveData();
      });
      editor.on(editor.events.polygonDeleted, function(polygonViewModel) {
        actions.delete(polygonViewModel.id);
        saveData();
      });
      editor.on(editor.events.polygonBeforeAdded, function(points) {
        var polygon = actions.add(points);
        editor.fire(editor.events.polygonAfterAdded, polygon.id);
        saveData();
        polygon.onClick($('canvas', $element)[0]);
      });
      function removeState() {
        $element.removeClass('create creating resize resizing drag dragging active');
      }
      function setCreateState() {
        removeState();
        cursorTooltip.changeText('hotSpotTooltipCreate');
        $element.addClass('create');
      }
      function setCreatingState() {
        removeState();
        cursorTooltip.changeText('');
        $element.addClass('creating');
      }
      function setResizeState() {
        removeState();
        cursorTooltip.changeText('hotSpotTooltipResize');
        $element.addClass('resize');
      }
      function setResizingState() {
        removeState();
        cursorTooltip.changeText('');
        $element.addClass('resizing');
      }
      function setDragState() {
        removeState();
        cursorTooltip.changeText('hotSpotTooltipDrag');
        $element.addClass('drag');
      }
      function setDraggingState() {
        removeState();
        cursorTooltip.changeText('');
        $element.addClass('dragging');
      }
      function setHoverOnActiveState() {
        removeState();
        cursorTooltip.changeText('hotSpotTooltipActive');
        $element.addClass('active');
      }
      function saveData() {
        if (!!saveHandler) {
          saveHandler.call(that, viewModel);
        }
      }
      function setUpHoverOnCanvas($element) {
        $('canvas', $element).hover(function() {
          cursorTooltip.show();
          $element.addClass('hover');
        }, function() {
          cursorTooltip.hide();
          $element.removeClass('hover');
        }).click(function() {
          if (!isEditing()) {
            startEditing();
          }
          document.activeElement.blur();
        });
      }
      function startEditing() {
        if (!isEditing())
          isEditing(true);
        $('html').bind('click', blurEvent);
      }
      function endEditing() {
        isEditing(false);
      }
      function blurEvent(event) {
        if (event.target !== editor.canvas) {
          endEditing();
          editor.deselectAllElements();
          $('html').unbind('click', blurEvent);
        }
      }
      ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
        $('html').unbind('click', blurEvent);
        cursorTooltip.hide();
        ko.utils.domData.clear(element);
      });
    },
    update: function(element, valueAccessor) {
      var $element = $(element),
          editor = ko.utils.domData.get(element, 'ko_polygonEditor'),
          value = valueAccessor(),
          background = value.background,
          polygons = value.polygons;
      if (polygons().length) {
        $element.removeClass('empty');
      } else {
        $element.addClass('empty');
      }
      if (_.isNullOrUndefined(background.width()) || _.isNullOrUndefined(background.height())) {
        return;
      }
      editor.updateCanvasSize(background.width(), background.height());
      editor.updatePolygons(polygons);
    }
  };
  composition.addBindingHandler('hotspotOnImage');
});

_removeDefine();
})();
System.registerDynamic("widgets/dialog/bindingHandlers/dialogBindingHandler.js", [], false, function(__require, __exports, __module) {
  var _retrieveGlobal = System.get("@@global-helpers").prepareGlobal(__module.id, null, null);
  (function() {
    ko.bindingHandlers.dialog = {
      init: function() {},
      update: function(element, valueAccessor) {
        var $element = $(element),
            $html = $('html'),
            $container = $('body'),
            scrollableClassName = '.scrollable',
            $scrollable = $(scrollableClassName, $element),
            speed = 200,
            isShown = valueAccessor().isShown,
            autoclose = ko.unwrap(valueAccessor().autoclose) || false,
            onHide = valueAccessor().onHide,
            scrollLocker = createScrollLocker();
        if (isShown()) {
          show();
        } else {
          hide();
        }
        function show() {
          if ($element.data('isShown'))
            return;
          $element.data('isShown', true);
          var $blockout = $('<div class="modal-dialog-blockout" style="display:none;"></div>').appendTo($container);
          $.when($blockout).done(function() {
            $blockout.fadeIn(speed);
            $element.fadeIn(speed, function() {
              $element.find('.autofocus').focus();
              scrollLocker.lockScroll();
            });
          });
          if (autoclose) {
            $blockout.click(function() {
              hide();
            });
          }
          $html.on('keyup', closeOnEscape);
          $container.css({overflowY: 'hidden'});
        }
        function hide() {
          if (!$element.data('isShown'))
            return;
          isShown(false);
          $element.data('isShown', false);
          $('.modal-dialog-blockout').fadeOut(speed, function() {
            $(this).remove();
          });
          $element.fadeOut(speed, function() {
            scrollLocker.releaseScroll();
            $html.off('keyup', closeOnEscape);
            $container.css({overflowY: 'visible'});
            if (_.isFunction(onHide)) {
              onHide();
            }
          });
        }
        function closeOnEscape(evt) {
          if (evt.keyCode === 27) {
            hide();
          }
        }
        function createScrollLocker() {
          var eventNames = 'DOMMouseScroll mousewheel';
          return {
            lockScroll: lockScroll,
            releaseScroll: releaseScroll
          };
          function lockScroll() {
            $scrollable.on(eventNames, trapScroll);
            $element.on(eventNames, preventOuterScroll);
          }
          function releaseScroll() {
            $scrollable.off(eventNames, trapScroll);
            $element.off(eventNames, preventOuterScroll);
          }
          function trapScroll(ev) {
            var $this = $(this),
                scrollTop = this.scrollTop,
                scrollHeight = this.scrollHeight,
                height = $this.height(),
                delta = (ev.type == 'DOMMouseScroll' ? ev.originalEvent.detail * -40 : ev.originalEvent.wheelDelta),
                up = delta > 0;
            if (scrollHeight === 0 || height === 0) {
              return 0;
            }
            var scrollCount = Math.ceil(scrollHeight / 120) - 1;
            if (scrollCount <= 0)
              return preventScroll(ev);
            var scrollDist = Math.ceil(scrollHeight / scrollCount),
                scrollDelta = up ? scrollDist * -1 : scrollDist;
            ev.data = {isProcessed: true};
            $this.scrollTop(scrollTop + scrollDelta);
            return preventScroll(ev);
          }
          function preventOuterScroll(ev) {
            if (ev.target && !(ev.data && ev.data.isProcessed)) {
              var $target = $(ev.target),
                  $scrollableParent = $target.parents(scrollableClassName);
              if ($scrollableParent.length > 0) {
                trapScroll.call($scrollableParent[0], ev);
              }
            }
            return preventScroll(ev);
          }
          function preventScroll(ev) {
            ev.data = {isProcessed: false};
            ev.stopPropagation();
            ev.preventDefault();
            ev.returnValue = false;
            return false;
          }
        }
        ;
        ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
          hide();
          isShown(false);
        });
      }
    };
  })();
  return _retrieveGlobal();
});

System.registerDynamic("widgets/dialog/bindingHandlers/dialogWizardBindingHandler.js", [], false, function(__require, __exports, __module) {
  var _retrieveGlobal = System.get("@@global-helpers").prepareGlobal(__module.id, null, null);
  (function() {
    ko.bindingHandlers.dialogWizard = {
      init: function(element) {
        var $element = $(element),
            stepClassSelector = '.dialog-wizard-step';
        $element.find(stepClassSelector).each(function() {
          $(this).hide();
        });
      },
      update: function(element, valueAccessor) {
        var $element = $(element),
            activeStepViewModel = ko.unwrap(valueAccessor().activeStep),
            stepClassSelector = '.dialog-wizard-step',
            $currentStep = $element.find(stepClassSelector + '.active'),
            $currentStepDialogBody = $currentStep.find('.dialog-body').height('100%'),
            $targetStep = getTargetStep();
        if (!$targetStep) {
          return;
        }
        navigate();
        function getTargetStep() {
          var step;
          $element.find(stepClassSelector).each(function() {
            var $step = $(this);
            var context = ko.contextFor($step[0]).$data;
            if (context === activeStepViewModel) {
              step = $step;
              return;
            }
          });
          return step;
        }
        function navigate() {
          if (!$currentStep || $currentStep.length === 0) {
            $targetStep.show();
            setFocus();
            return;
          }
          var targetHeight = $targetStep.outerHeight(),
              currentHeight = $currentStep.outerHeight();
          $element.height(currentHeight);
          $currentStep.height('100%');
          $targetStep.height('100%');
          $currentStepDialogBody.height('100%');
          $element.animate({height: targetHeight}, 200, function() {
            $targetStep.height('auto');
            $element.removeAttr('style');
          });
          $currentStep.fadeOut(100, function() {
            $currentStep.height('auto');
            $targetStep.fadeIn(100, function() {
              $currentStepDialogBody.height('auto');
              setFocus();
            });
          });
        }
        function setFocus() {
          _.defer(function() {
            $element.find('.autofocus').focus();
          });
        }
      }
    };
  })();
  return _retrieveGlobal();
});

(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("bootstrapping/knockoutBindingsTask.js", ["require", "components/bindingHandlers/tooltipBindingHandler.js", "components/bindingHandlers/backgroundBindingHandler.js", "components/bindingHandlers/fileBrowserBindingHandler.js", "components/bindingHandlers/customScrollbarBindingHandler.js", "viewmodels/questions/dragAndDropText/bindingHandlers/draggableTextBindingHandler.js", "viewmodels/questions/hotSpot/bindingHandlers/polygonsEditorBindingHandler.js", "viewmodels/questions/fillInTheBlank/bindingHandlers/fillInTheBlankBindingHandler.js", "viewmodels/questions/singleSelectImage/bindingHandlers/answerImageBindingHandler.js", "widgets/imagePreview/bindingHandlers/fadeBindingHandler.js", "widgets/imagePreview/bindingHandlers/imageLoaderBindingHandler.js", "viewmodels/courses/bindingHandlers/elementCollapseBinding.js", "viewmodels/courses/bindingHandlers/windowMessageListenerBinding.js", "viewmodels/courses/bindingHandlers/courseIntroductionAnimationBinding.js", "viewmodels/courses/bindingHandlers/publishTabBinding.js", "viewmodels/learningContents/bindingHandlers/hotspotOnImageBindingHandler.js", "widgets/dialog/bindingHandlers/dialogBindingHandler.js", "widgets/dialog/bindingHandlers/dialogWizardBindingHandler.js"], function(require) {
  "use strict";
  require('components/bindingHandlers/tooltipBindingHandler.js').install();
  require('components/bindingHandlers/backgroundBindingHandler.js');
  require('components/bindingHandlers/fileBrowserBindingHandler.js');
  require('components/bindingHandlers/customScrollbarBindingHandler.js');
  require('viewmodels/questions/dragAndDropText/bindingHandlers/draggableTextBindingHandler.js');
  require('viewmodels/questions/hotSpot/bindingHandlers/polygonsEditorBindingHandler.js').install();
  require('viewmodels/questions/fillInTheBlank/bindingHandlers/fillInTheBlankBindingHandler.js');
  require('viewmodels/questions/singleSelectImage/bindingHandlers/answerImageBindingHandler.js');
  require('widgets/imagePreview/bindingHandlers/fadeBindingHandler.js');
  require('widgets/imagePreview/bindingHandlers/imageLoaderBindingHandler.js');
  require('viewmodels/courses/bindingHandlers/elementCollapseBinding.js');
  require('viewmodels/courses/bindingHandlers/windowMessageListenerBinding.js');
  require('viewmodels/courses/bindingHandlers/courseIntroductionAnimationBinding.js');
  require('viewmodels/courses/bindingHandlers/publishTabBinding.js');
  require('viewmodels/learningContents/bindingHandlers/hotspotOnImageBindingHandler.js');
  require('widgets/dialog/bindingHandlers/dialogBindingHandler.js');
  require('widgets/dialog/bindingHandlers/dialogWizardBindingHandler.js');
  var task = {execute: execute};
  return task;
  function execute() {
    ko.bindingHandlers.sortable.options = {
      opacity: 0.7,
      placeholder: 'sortable-list-placeholder',
      forcePlaceholderSize: true,
      containment: 'body',
      tolerance: 'pointer',
      cursor: 'move',
      start: function(e, ui) {
        if (/MSIE/i.test(navigator.userAgent)) {
          ui.placeholder.height(ui.item.height());
        }
      },
      sort: function(event, ui) {
        var $target = $(event.target);
        if (!/html|body/i.test($target.offsetParent()[0].tagName)) {
          var top = event.pageY - $target.offsetParent().offset().top - (ui.helper.outerHeight(true) / 2);
          ui.helper.css({'top': top + 'px'});
        }
      }
    };
    ko.validation.init({insertMessages: false});
  }
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("bootstrapping/addWindowEventsTask.js", ["libs/jquery.js"], function($) {
  var task = {execute: execute};
  return task;
  function execute() {
    $(window).on("hashchange", function() {
      var $activeElement = $(':focus');
      if ($activeElement.length) {
        $activeElement.blur();
      }
    });
  }
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("libs/durandal/plugins/http.js", ["libs/jquery.js", "libs/knockout.js"], function($, ko) {
  return {
    callbackParam: 'callback',
    toJSON: function(data) {
      return ko.toJSON(data);
    },
    get: function(url, query, headers) {
      return $.ajax(url, {
        data: query,
        headers: ko.toJS(headers)
      });
    },
    jsonp: function(url, query, callbackParam, headers) {
      if (url.indexOf('=?') == -1) {
        callbackParam = callbackParam || this.callbackParam;
        if (url.indexOf('?') == -1) {
          url += '?';
        } else {
          url += '&';
        }
        url += callbackParam + '=?';
      }
      return $.ajax({
        url: url,
        dataType: 'jsonp',
        data: query,
        headers: ko.toJS(headers)
      });
    },
    put: function(url, data, headers) {
      return $.ajax({
        url: url,
        data: this.toJSON(data),
        type: 'PUT',
        contentType: 'application/json',
        dataType: 'json',
        headers: ko.toJS(headers)
      });
    },
    post: function(url, data, headers) {
      return $.ajax({
        url: url,
        data: this.toJSON(data),
        type: 'POST',
        contentType: 'application/json',
        dataType: 'json',
        headers: ko.toJS(headers)
      });
    },
    remove: function(url, query, headers) {
      return $.ajax({
        url: url,
        data: query,
        type: 'DELETE',
        headers: ko.toJS(headers)
      });
    }
  };
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("http/httpRequestSender.js", ["libs/durandal/plugins/http.js", "localization/localizationManager.js"], function(http, localizationManager) {
  "use strict";
  return {
    post: post,
    get: get
  };
  function post(url, data, headers) {
    var deferred = Q.defer();
    http.post(url, data, headers).done(function(response) {
      if (!_.isObject(response)) {
        deferred.reject('Response data is not an object');
        return;
      }
      if (response.success) {
        deferred.resolve(response);
        return;
      }
      var errorMessage;
      if (response.resourceKey) {
        errorMessage = localizationManager.localize(response.resourceKey);
      } else if (response.message) {
        errorMessage = response.message;
      } else {
        errorMessage = localizationManager.localize('responseFailed');
      }
      deferred.resolve({
        success: false,
        errorMessage: errorMessage
      });
    }).fail(function(reason) {
      deferred.reject(reason);
    });
    return deferred.promise;
  }
  function get(url, query, headers) {
    var deferred = Q.defer();
    $.ajax(url, {
      data: query,
      headers: headers
    }).done(function(response) {
      deferred.resolve(response);
    }).fail(function(reason) {
      deferred.reject(reason);
    });
    return deferred.promise;
  }
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("http/apiHttpWrapper.js", ["notify.js", "http/httpRequestSender.js", "libs/durandal/app.js"], function(notify, httpRequestSender, app) {
  "use strict";
  return {post: post};
  function post(url, data) {
    app.trigger('apiHttpWrapper:post-begin');
    var headers = window.auth.getHeader('api');
    _.extend(headers, {"cache-control": "no-cache"});
    return httpRequestSender.post(url, data, headers).then(function(response) {
      if (!_.isObject(response)) {
        throw 'Response data is not an object';
      }
      if (!response.success) {
        notify.error(response.errorMessage);
        throw response.errorMessage;
      }
      return response.data;
    }).fin(function() {
      app.trigger('apiHttpWrapper:post-end');
    });
  }
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("http/storageHttpRequestSender.js", [], function() {
  "use strict";
  return {
    post: post,
    get: get
  };
  function post(url, data, headers) {
    var deferred = Q.defer();
    $.ajax({
      url: url,
      data: data,
      method: 'POST',
      headers: headers,
      global: false
    }).then(function(response) {
      deferred.resolve(response);
    }).fail(function(reason) {
      deferred.reject(reason.status);
    });
    return deferred.promise;
  }
  function get(url, query, headers) {
    var deferred = Q.defer();
    $.ajax(url, {
      data: query,
      headers: headers,
      global: false,
      cache: false
    }).then(function(response) {
      deferred.resolve(response);
    }).fail(function(reason) {
      deferred.reject(reason.status);
    });
    return deferred.promise;
  }
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("http/storageHttpWrapper.js", ["http/storageHttpRequestSender.js", "libs/durandal/app.js"], function(storageHttpRequestSender, app) {
  "use strict";
  return {
    post: post,
    get: get
  };
  function post(url, data) {
    app.trigger('storageHttpWrapper:post-begin');
    return storageHttpRequestSender.post(url, data, window.auth.getHeader('storage')).fin(function() {
      app.trigger('storageHttpWrapper:post-end');
    });
  }
  function get(url, query) {
    app.trigger('storageHttpWrapper:get-begin');
    return storageHttpRequestSender.get(url, query, window.auth.getHeader('storage')).fin(function() {
      app.trigger('storageHttpWrapper:get-end');
    });
  }
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("models/entity.js", [], function() {
  "use strict";
  function Entity(spec) {
    if (typeof spec == typeof undefined) {
      throw 'You should provide a specification to create an Entity';
    }
    this.id = spec.id;
    this.createdOn = spec.createdOn;
    this.modifiedOn = spec.modifiedOn;
  }
  return Entity;
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("http/publishHttpWrapper.js", ["http/httpRequestSender.js"], function(httpRequestSender) {
  "use strict";
  return {post: post};
  function post(url, data) {
    var headers = window.auth.getHeader('api');
    _.extend(headers, {"cache-control": "no-cache"});
    return httpRequestSender.post(url, data, headers).then(function(response) {
      if (!_.isObject(response)) {
        throw 'Response data is not an object';
      }
      if (!response.success) {
        throw response.errorMessage;
      }
      return response.data;
    });
  }
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("services/publishService.js", ["http/publishHttpWrapper.js"], function(publishHttpWrapper) {
  "use strict";
  function buildCourse(courseId) {
    return publishHttpWrapper.post('api/course/build', {courseId: courseId}).then(function(data) {
      return {
        packageUrl: data.PackageUrl,
        builtOn: new Date(data.BuildOn)
      };
    });
  }
  ;
  function publishCourse(courseId) {
    return publishHttpWrapper.post('api/course/publish', {courseId: courseId}).then(function(data) {
      return {publishedPackageUrl: data.PublishedPackageUrl};
    });
  }
  ;
  function scormBuildCourse(courseId) {
    return publishHttpWrapper.post('api/course/scormbuild', {courseId: courseId}).then(function(data) {
      return {scormPackageUrl: data.ScormPackageUrl};
    });
  }
  ;
  function publishCourseToCustomLms(courseId) {
    return publishHttpWrapper.post('api/course/publishToCustomLms', {courseId: courseId});
  }
  ;
  function publishCourseToStore(courseId) {
    return publishHttpWrapper.post('api/aim4you/publish', {courseId: courseId});
  }
  ;
  function publishCourseForReview(courseId) {
    return publishHttpWrapper.post('api/course/publishForReview', {courseId: courseId}).then(function(data) {
      return {reviewUrl: data.ReviewUrl};
    });
  }
  ;
  function buildLearningPath(learningPathId) {
    return publishHttpWrapper.post('api/learningpath/build', {learningPathId: learningPathId}).then(function(data) {
      return {packageUrl: data.PackageUrl};
    });
  }
  ;
  function publishLearningPath(learningPathId) {
    return publishHttpWrapper.post('api/learningpath/publish', {learningPathId: learningPathId}).then(function(data) {
      return {publicationUrl: data.PublicationUrl};
    });
  }
  ;
  return {
    buildCourse: buildCourse,
    publishCourse: publishCourse,
    scormBuildCourse: scormBuildCourse,
    publishCourseToCustomLms: publishCourseToCustomLms,
    publishCourseToStore: publishCourseToStore,
    publishCourseForReview: publishCourseForReview,
    buildLearningPath: buildLearningPath,
    publishLearningPath: publishLearningPath
  };
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("models/course.js", ["models/entity.js", "libs/durandal/app.js", "constants.js", "services/publishService.js"], function(EntityModel, app, constants, publishService) {
  "use strict";
  function Course(spec) {
    EntityModel.call(this, spec);
    this.title = spec.title;
    this.objectives = spec.objectives;
    this.createdBy = spec.createdBy;
    this.createdOn = spec.createdOn;
    this.builtOn = spec.builtOn;
    this.template = spec.template;
    this.introductionContent = spec.introductionContent;
    this.collaborators = spec.collaborators;
    this.isDirty = spec.isDirty;
    this.isPublishedToExternalLms = spec.isPublishedToExternalLms;
    this.build = deliveringAction.call(this, buildActionHandler, spec.packageUrl);
    this.scormBuild = buildingAction.call(this, scormBuildActionHandler, spec.scormPackageUrl);
    this.publish = deliveringAction.call(this, publishActionHandler, spec.publishedPackageUrl);
    this.publishForReview = deliveringAction.call(this, publishForReviewActionHandler, spec.reviewUrl);
    this.publishToStore = deliveringAction.call(this, publishToStoreActionHandler);
    this.publishToCustomLms = publishToCustomLms;
    this.getState = getState;
    this.isDelivering = false;
  }
  return Course;
  function buildingAction(actionHandler, packageUrl) {
    var course = this;
    var self = function() {
      course.isDelivering = true;
      app.trigger(constants.messages.course.delivering.started, course);
      return actionHandler.call(course, self).fin(function() {
        course.isDelivering = false;
        app.trigger(constants.messages.course.delivering.finished, course);
      });
    };
    self.packageUrl = packageUrl;
    self.state = constants.publishingStates.notStarted;
    self.setState = function(value) {
      this.state = course._lastState = value;
    };
    return self;
  }
  function deliveringAction(actionHandler, packageUrl) {
    var course = this;
    return buildingAction.call(course, function(action) {
      return buildPackage.call(course, action).then(function(buildInfo) {
        return actionHandler.call(course, action, buildInfo);
      });
    }, packageUrl);
  }
  function getState() {
    return this._lastState;
  }
  function buildPackage(action) {
    var that = this;
    return Q.fcall(function() {
      if (action.state === constants.publishingStates.building) {
        throw 'Course is already building.';
      }
      action.setState(constants.publishingStates.building);
      app.trigger(constants.messages.course.build.started, that);
      return publishService.buildCourse(that.id).then(function(buildInfo) {
        that.builtOn = buildInfo.builtOn;
        action.setState(constants.publishingStates.succeed);
        app.trigger(constants.messages.course.build.completed, that);
        return buildInfo;
      }).fail(function(message) {
        action.setState(constants.publishingStates.failed);
        app.trigger(constants.messages.course.build.failed, that, message);
        throw message;
      });
    });
  }
  function buildActionHandler(action, buildInfo) {
    var that = this;
    return Q.fcall(function() {
      if (action.state === constants.publishingStates.building) {
        throw 'Course is already building.';
      }
      action.packageUrl = buildInfo.packageUrl;
      return that;
    });
  }
  function scormBuildActionHandler(action) {
    var that = this;
    return Q.fcall(function() {
      if (action.state === constants.publishingStates.building) {
        throw 'Course is already building.';
      }
      action.setState(constants.publishingStates.building);
      app.trigger(constants.messages.course.scormBuild.started, that);
      return publishService.scormBuildCourse(that.id).then(function(buildInfo) {
        action.packageUrl = buildInfo.scormPackageUrl;
        action.setState(constants.publishingStates.succeed);
        app.trigger(constants.messages.course.scormBuild.completed, that);
        return that;
      }).fail(function(message) {
        action.packageUrl = '';
        action.setState(constants.publishingStates.failed);
        app.trigger(constants.messages.course.scormBuild.failed, that, message);
        throw message;
      });
    });
  }
  function publishActionHandler(action) {
    var that = this;
    return Q.fcall(function() {
      if (action.state === constants.publishingStates.publishing) {
        throw 'Course is already publishing.';
      }
      action.setState(constants.publishingStates.publishing);
      app.trigger(constants.messages.course.publish.started, that);
      return publishService.publishCourse(that.id).then(function(publishInfo) {
        action.packageUrl = publishInfo.publishedPackageUrl;
        action.setState(constants.publishingStates.succeed);
        app.trigger(constants.messages.course.publish.completed, that);
        return that;
      }).fail(function(message) {
        action.packageUrl = '';
        action.setState(constants.publishingStates.failed);
        app.trigger(constants.messages.course.publish.failed, that, message);
        throw message;
      });
    });
  }
  function publishForReviewActionHandler(action) {
    var that = this;
    return Q.fcall(function() {
      if (action.state === constants.publishingStates.publishing) {
        throw 'Course is already publishing.';
      }
      action.setState(constants.publishingStates.publishing);
      app.trigger(constants.messages.course.publishForReview.started, that);
      return publishService.publishCourseForReview(that.id).then(function(publishInfo) {
        action.packageUrl = publishInfo.reviewUrl;
        action.setState(constants.publishingStates.succeed);
        app.trigger(constants.messages.course.publishForReview.completed, that);
        return that;
      }).fail(function(message) {
        action.packageUrl = '';
        action.setState(constants.publishingStates.failed);
        app.trigger(constants.messages.course.publishForReview.failed, that, message);
        throw message;
      });
    });
  }
  function publishToStoreActionHandler(action) {
    var that = this;
    return Q.fcall(function() {
      if (action.state === constants.publishingStates.publishing) {
        throw 'Course is already publishing to Aim4You.';
      }
      action.setState(constants.publishingStates.publishing);
      app.trigger(constants.messages.course.publishToAim4You.started, that);
      return publishService.publishCourseToStore(that.id).then(function() {
        action.setState(constants.publishingStates.succeed);
        app.trigger(constants.messages.course.publishToAim4You.completed, that);
        return that;
      }).fail(function(message) {
        action.setState(constants.publishingStates.failed);
        app.trigger(constants.messages.course.publishToAim4You.failed, that, message);
        throw message;
      });
    });
  }
  function publishToCustomLms() {
    var that = this;
    return Q.fcall(function() {
      app.trigger(constants.messages.course.publishToCustomLms.started, that);
      return publishService.publishCourseToCustomLms(that.id).then(function() {
        that.isPublishedToExternalLms = true;
        app.trigger(constants.messages.course.publishToCustomLms.completed, that);
        return that;
      }).fail(function(message) {
        app.trigger(constants.messages.course.publishToCustomLms.failed, that, message);
        throw message;
      });
    });
  }
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("mappers/courseModelMapper.js", ["models/course.js"], function(CourseModel) {
  "use strict";
  var map = function(item, objectives, templates) {
    return new CourseModel({
      id: item.Id,
      title: item.Title,
      createdBy: item.CreatedBy,
      createdOn: new Date(item.CreatedOn),
      modifiedOn: new Date(item.ModifiedOn),
      objectives: _.map(item.RelatedObjectives, function(relatedObjective) {
        return _.find(objectives, function(objective) {
          return objective.id == relatedObjective.Id;
        });
      }),
      publishedPackageUrl: item.PublishedPackageUrl,
      isDirty: item.IsDirty,
      builtOn: _.isNullOrUndefined(item.builtOn) ? null : new Date(item.builtOn),
      packageUrl: item.PackageUrl,
      reviewUrl: item.ReviewUrl,
      template: _.find(templates, function(tItem) {
        return tItem.id === item.Template.Id;
      }),
      introductionContent: item.IntroductionContent,
      isPublishedToExternalLms: item.IsPublishedToExternalLms
    });
  };
  return {map: map};
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("models/objective.js", ["models/entity.js"], function(EntityModel) {
  "use strict";
  var Objective = function(spec) {
    EntityModel.call(this, spec);
    this.title = spec.title;
    this.image = spec.image;
    this.questions = spec.questions;
    this.createdBy = spec.createdBy;
  };
  return Objective;
});

_removeDefine();
})();
System.register("models/entityClass.js", [], function($__export) {
  "use strict";
  var __moduleName = "models/entityClass.js";
  var Entity;
  return {
    setters: [],
    execute: function() {
      Entity = function() {
        function Entity(spec) {
          if (typeof spec == typeof undefined) {
            throw 'You should provide a specification to create an Entity';
          }
          this.id = spec.id;
          this.createdOn = spec.createdOn;
          this.modifiedOn = spec.modifiedOn;
        }
        return ($traceurRuntime.createClass)(Entity, {}, {});
      }();
      $__export("Entity", Entity);
    }
  };
});

System.register("models/question.js", ["models/entityClass.js"], function($__export) {
  "use strict";
  var __moduleName = "models/question.js";
  var Entity,
      __useDefault;
  return {
    setters: [function($__m) {
      Entity = $__m.Entity;
    }],
    execute: function() {
      $__export('default', function($__super) {
        function Question(spec) {
          $traceurRuntime.superConstructor(Question).call(this, spec);
          this.title = spec.title;
          this.content = spec.content;
          this.type = spec.type;
        }
        return ($traceurRuntime.createClass)(Question, {}, {}, $__super);
      }(Entity));
      __useDefault = true;
      $__export("__useDefault", __useDefault);
    }
  };
});

(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("mappers/questionModelMapper.js", ["models/question.js"], function(QuestionModel) {
  "use strict";
  var map = function(question) {
    return new QuestionModel({
      id: question.Id,
      title: question.Title,
      content: question.Content,
      createdOn: new Date(question.CreatedOn),
      modifiedOn: new Date(question.ModifiedOn),
      type: question.Type
    });
  };
  return {map: map};
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("mappers/objectiveModelMapper.js", ["models/objective.js", "models/question.js", "constants.js", "mappers/questionModelMapper.js"], function(ObjectiveModel, QuestionModel, constants, questionModelMapper) {
  "use strict";
  var map = function(item) {
    return new ObjectiveModel({
      id: item.Id,
      title: item.Title,
      createdBy: item.CreatedBy,
      createdOn: new Date(item.CreatedOn),
      modifiedOn: new Date(item.ModifiedOn),
      image: item.ImageUrl,
      questions: _.map(item.Questions, questionModelMapper.map)
    });
  };
  return {map: map};
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("models/template.js", ["models/entity.js"], function(Entity) {
  "use strict";
  var template = function(spec) {
    var obj = new Entity(spec);
    obj.name = spec.name;
    obj.thumbnail = spec.thumbnail;
    obj.previewImages = spec.previewImages;
    obj.shortDescription = spec.shortDescription;
    obj.settingsUrls = spec.settingsUrls;
    obj.previewDemoUrl = spec.previewDemoUrl;
    obj.order = spec.order;
    obj.isCustom = spec.isCustom;
    obj.isNew = spec.isNew;
    obj.isDeprecated = spec.isDeprecated;
    return obj;
  };
  return template;
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("mappers/templateModelMapper.js", ["models/template.js"], function(TemplateModel) {
  "use strict";
  var map = function(item) {
    var templateData = {
      id: item.Id,
      previewDemoUrl: item.PreviewDemoUrl,
      order: item.Order,
      isNew: item.IsNew,
      isDeprecated: item.IsDeprecated,
      isCustom: item.IsCustom
    };
    var manifestData = getManifestData(JSON.parse(item.Manifest), item.TemplateUrl);
    return new TemplateModel(_.extend(templateData, manifestData));
  };
  return {map: map};
  function getManifestData(manifest, templateUrl) {
    if (_.isNullOrUndefined(manifest.settingsUrls)) {
      manifest.settingsUrls = {design: manifest.settingsUrl};
    }
    return {
      name: manifest.name,
      thumbnail: templateUrl + manifest.thumbnail + '?v=' + window.appVersion,
      previewImages: _.map(manifest.previewImages, function(img) {
        return templateUrl + img + '?v=' + window.appVersion;
      }),
      settingsUrls: {
        design: (manifest.settingsUrls && manifest.settingsUrls.design) ? templateUrl + manifest.settingsUrls.design : null,
        configure: (manifest.settingsUrls && manifest.settingsUrls.configure) ? templateUrl + manifest.settingsUrls.configure : null
      },
      shortDescription: manifest.shortDescription
    };
  }
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("models/video.js", ["models/entity.js", "constants.js"], function(Entity, constants) {
  "use strict";
  var video = function(spec) {
    var obj = new Entity(spec);
    obj.title = spec.title;
    obj.vimeoId = spec.vimeoId;
    obj.thumbnailUrl = spec.thumbnailUrl;
    obj.progress = spec.progress;
    obj.status = spec.status || constants.storage.video.statuses.loaded;
    return obj;
  };
  return video;
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("mappers/videoModelMapper.js", ["models/video.js"], function(VideoModel) {
  "use strict";
  var map = function(item) {
    return new VideoModel({
      id: item.Id,
      createdOn: item.CreatedOn,
      modifiedOn: item.ModifiedOn,
      title: item.Title,
      vimeoId: item.VimeoId
    });
  };
  return {map: map};
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("models/audio.js", ["models/entity.js", "constants.js"], function(Entity) {
  "use strict";
  var Audio = function(spec) {
    var obj = new Entity(spec);
    obj.title = spec.title;
    obj.duration = spec.duration;
    obj.vimeoId = spec.vimeoId;
    obj.source = spec.source;
    obj.status = spec.status;
    obj.available = spec.available;
    return obj;
  };
  return Audio;
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("mappers/audioModelMapper.js", ["models/audio.js"], function(Audio) {
  "use strict";
  var map = function(item) {
    return new Audio({
      id: item.Id,
      createdOn: item.CreatedOn,
      modifiedOn: item.ModifiedOn,
      title: item.Title,
      duration: item.Duration,
      vimeoId: item.VimeoId,
      available: !!item.Status,
      source: item.Source
    });
  };
  return {map: map};
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("models/learningPath.js", ["models/entity.js", "services/publishService.js", "libs/durandal/app.js", "constants.js"], function(EntityModel, publishService, app, constants) {
  "use strict";
  var LearningPath = function(spec) {
    var obj = new EntityModel(spec);
    obj.title = spec.title;
    obj.publicationUrl = spec.publicationUrl;
    obj.courses = spec.courses;
    obj.isBuilding = false;
    obj.isPublishing = false;
    obj.isDelivering = isDelivering;
    obj.build = build;
    obj.publish = publish;
    return obj;
    function isDelivering() {
      return obj.isBuilding || obj.isPublishing;
    }
    function build() {
      return Q.fcall(function() {
        if (obj.isDelivering()) {
          return;
        }
        obj.isBuilding = true;
        app.trigger(constants.messages.learningPath.delivering.started + obj.id, obj);
        return publishService.buildLearningPath(obj.id).then(function(buildInfo) {
          return buildInfo.packageUrl;
        }).fail(function(message) {
          throw message;
        }).fin(function() {
          obj.isBuilding = false;
          app.trigger(constants.messages.learningPath.delivering.finished + obj.id, obj);
        });
      });
    }
    function publish() {
      return Q.fcall(function() {
        if (obj.isDelivering()) {
          return;
        }
        obj.isPublishing = true;
        app.trigger(constants.messages.learningPath.delivering.started + obj.id, obj);
        return publishService.buildLearningPath(obj.id).then(function() {
          return publishService.publishLearningPath(obj.id).then(function(buildInfo) {
            obj.publicationUrl = buildInfo.publicationUrl;
            return buildInfo.publicationUrl;
          }).fail(function(message) {
            obj.publicationUrl = null;
            throw message;
          });
        }).fail(function(message) {
          throw message;
        }).fin(function() {
          obj.isPublishing = false;
          app.trigger(constants.messages.learningPath.delivering.finished + obj.id, obj);
        });
      });
    }
  };
  return LearningPath;
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("mappers/learningPathModelMapper.js", ["models/learningPath.js"], function(LearningPath) {
  "use strict";
  var map = function(learningPath, courses) {
    return new LearningPath({
      id: learningPath.Id,
      title: learningPath.Title,
      publicationUrl: learningPath.PublicationUrl,
      createdBy: learningPath.CreatedBy,
      createdOn: new Date(learningPath.CreatedOn),
      modifiedOn: new Date(learningPath.ModifiedOn),
      courses: _.map(learningPath.Courses, function(item) {
        return _.find(courses, function(course) {
          return course.id == item.Id;
        });
      })
    });
  };
  return {map: map};
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("dataContext.js", ["libs/durandal/app.js", "constants.js", "notify.js", "localization/localizationManager.js", "http/apiHttpWrapper.js", "http/storageHttpWrapper.js", "mappers/courseModelMapper.js", "mappers/objectiveModelMapper.js", "mappers/templateModelMapper.js", "mappers/videoModelMapper.js", "mappers/audioModelMapper.js", "mappers/learningPathModelMapper.js"], function(app, constants, notify, localizationManager, apiHttpWrapper, storageHttpWrapper, courseModelMapper, objectiveModelMapper, templateModelMapper, videoModelMapper, audioModelMapper, learningPathModelMapper) {
  "use strict";
  var objectives = [],
      courses = [],
      templates = [],
      learningPaths = [],
      videos = [],
      audios = [],
      initialize = function() {
        return Q.fcall(function() {
          return apiHttpWrapper.post('api/templates').then(function(data) {
            _.each(data, function(template) {
              templates.push(templateModelMapper.map(template));
            });
          });
        }).then(function() {
          return apiHttpWrapper.post('api/objectives').then(function(data) {
            _.each(data, function(item) {
              objectives.push(objectiveModelMapper.map(item));
            });
          });
        }).then(function() {
          return apiHttpWrapper.post('api/courses').then(function(data) {
            _.each(data, function(item) {
              if (_.find(templates, function(template) {
                return item.Template.Id === template.id;
              })) {
                courses.push(courseModelMapper.map(item, objectives, templates));
              }
            });
          });
        }).then(function() {
          return apiHttpWrapper.post('api/learningpaths').then(function(data) {
            _.each(data, function(item) {
              learningPaths.push(learningPathModelMapper.map(item, courses));
            });
          });
        }).then(function() {
          return storageHttpWrapper.get(constants.storage.host + constants.storage.mediaUrl).then(function(data) {
            _.each(data.Videos, function(video) {
              videos.push(videoModelMapper.map(video));
            });
            _.each(data.Audios, function(audio) {
              audios.push(audioModelMapper.map(audio));
            });
          }).fail(function() {
            notify.error(localizationManager.localize('storageFailed'));
          });
        }).fail(function() {
          app.showMessage("Failed to initialize datacontext.");
        });
      },
      getQuestions = function() {
        var questions = [];
        _.each(objectives, function(objective) {
          questions.push.apply(questions, objective.questions);
        });
        return questions;
      };
  return {
    initialize: initialize,
    objectives: objectives,
    courses: courses,
    templates: templates,
    learningPaths: learningPaths,
    videos: videos,
    audios: audios,
    getQuestions: getQuestions
  };
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("guard.js", [], function() {
  "use strict";
  return {
    throwIfNotAnObject: function(obj, message) {
      if (!_.isObject(obj)) {
        throw message;
      }
    },
    throwIfNotString: function(str, message) {
      if (!_.isString(str)) {
        throw message;
      }
    },
    throwIfNotBoolean: function(bool, message) {
      if (!_.isBoolean(bool)) {
        throw message;
      }
    },
    throwIfNotArray: function(array, message) {
      if (!_.isArray(array)) {
        throw message;
      }
    },
    throwIfNotDate: function(date, message) {
      if (!_.isDate(date)) {
        throw message;
      }
    },
    throwIfNotNumber: function(number, message) {
      if (!_.isNumber(number)) {
        throw message;
      }
    },
    throwIfNotPositiveNumber: function(number, message) {
      if (!_.isNumber(number) || number < 0) {
        throw message;
      }
    },
    throwIfNotFunction: function(func, message) {
      if (!_.isFunction(func)) {
        throw message;
      }
    }
  };
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("repositories/videoRepository.js", ["dataContext.js", "guard.js"], function(dataContext, guard) {
  var getCollection = function() {
    var deferred = Q.defer();
    deferred.resolve(dataContext.videos);
    return deferred.promise;
  },
      getById = function(id) {
        var deferred = Q.defer();
        guard.throwIfNotString(id, 'Video id (string) was expected');
        var result = _.find(dataContext.videos, function(item) {
          return item.id === id;
        });
        if (_.isUndefined(result)) {
          deferred.reject('Video does not exist');
        } else {
          deferred.resolve(result);
        }
        return deferred.promise;
      },
      addVideo = function(video) {
        guard.throwIfNotAnObject(video, 'Video is not an object');
        guard.throwIfNotString(video.id, 'Video id is not a string');
        dataContext.videos.unshift(video);
      },
      removeVideo = function(id) {
        var videoToRemove = _.find(dataContext.videos, function(video) {
          return video.id == id;
        });
        if (videoToRemove) {
          var index = dataContext.videos.indexOf(videoToRemove);
          dataContext.videos.splice(index, 1);
          return true;
        }
        return false;
      };
  return {
    getCollection: getCollection,
    getById: getById,
    addVideo: addVideo,
    removeVideo: removeVideo
  };
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("videoUpload/commands/vimeo.js", ["constants.js"], function(constants) {
  return {
    putFile: putFile,
    verifyUpload: verifyUpload,
    getThumbnailUrl: getThumbnailUrl,
    getVideoDuration: getVideoDuration
  };
  function putFile(uploadUrl, file) {
    return $.ajax({
      url: uploadUrl,
      method: 'PUT',
      data: file,
      processData: false,
      contentType: false,
      global: false
    });
  }
  function verifyUpload(uploadUrl) {
    var deferred = Q.defer();
    $.ajax({
      url: uploadUrl,
      method: 'PUT',
      headers: {'Content-Range': 'bytes */*'},
      global: false
    }).fail(function(request) {
      if (request.status != constants.storage.video.vimeoVerifyStatus) {
        deferred.reject(request.status);
        return;
      }
      deferred.resolve(request.getResponseHeader('Range'));
    });
    return deferred.promise;
  }
  function getThumbnailUrl(id) {
    var deferred = Q.defer();
    $.ajax({
      url: constants.storage.video.vimeoApiVideosUrl + id + '/pictures',
      headers: {Authorization: constants.storage.video.vimeoToken},
      method: 'GET',
      global: false
    }).then(function(response) {
      try {
        deferred.resolve(_.where(response.data[0].sizes, {
          width: 200,
          height: 150
        })[0].link);
      } catch (exception) {
        deferred.resolve(constants.storage.video.defaultThumbnailUrl);
      }
    }).fail(function() {
      deferred.resolve(constants.storage.video.defaultThumbnailUrl);
    });
    return deferred.promise;
  }
  function getVideoDuration(id) {
    var deferred = Q.defer();
    $.ajax({
      url: constants.storage.video.vimeoApiVideosUrl + id,
      headers: {Authorization: constants.storage.video.vimeoToken},
      method: 'GET',
      global: false
    }).then(function(response) {
      deferred.resolve(response.duration || 0);
    }).fail(function() {
      deferred.resolve(0);
    });
    return deferred.promise;
  }
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("videoUpload/commands/storage.js", ["constants.js", "http/storageHttpWrapper.js"], function(constants, storageHttpWrapper) {
  var storageConstants = constants.storage;
  return {
    getTicket: getTicket,
    finishUpload: finishUpload,
    updateUploadTimeout: updateUploadTimeout,
    cancelUpload: cancelUpload
  };
  function getTicket(size, title) {
    return storageHttpWrapper.get(storageConstants.host + storageConstants.video.ticketUrl, {
      size: size,
      title: title
    }).then(function(data) {
      return {
        videoId: data.VideoId,
        uploadUrl: data.UploadUrl
      };
    });
  }
  function finishUpload(videoId) {
    return storageHttpWrapper.post(storageConstants.host + storageConstants.video.finishUrl, {videoId: videoId});
  }
  function updateUploadTimeout(videoId) {
    return storageHttpWrapper.post(storageConstants.host + storageConstants.video.progressUrl, {videoId: videoId});
  }
  function cancelUpload(videoId) {
    return storageHttpWrapper.post(storageConstants.host + storageConstants.video.cancelUrl, {videoId: videoId});
  }
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("videoUpload/handlers/progress.js", ["videoUpload/commands/vimeo.js", "videoUpload/commands/storage.js", "constants.js"], function(vimeoCommands, storageCommands, constants) {
  return {build: build};
  function build(uploadUrl, fileSize, video, videoFileLoadedCallback) {
    var progressHandler = {
      id: video.id,
      updatedOn: new Date(),
      handler: function() {
        var self = this;
        return vimeoCommands.verifyUpload(uploadUrl).then(function(range) {
          video.progress = getUploadProgress(range, fileSize);
          if (video.progress >= 100) {
            videoFileLoadedCallback(video.id);
          }
          if (new Date() - self.updatedOn > constants.storage.video.updateUploadTimeout) {
            self.updatedOn = new Date();
            storageCommands.updateUploadTimeout(video.id);
          }
        }).fail(function() {
          video.progress = 0;
        });
      }
    };
    return progressHandler;
  }
  function getUploadProgress(range, fileSize) {
    var verifyResponseRegex = /0-([\d]+)/;
    if (!verifyResponseRegex.test(range)) {
      return false;
    }
    var uploadedSize = verifyResponseRegex.exec(range)[0].substring(2);
    return uploadedSize ? Math.round(uploadedSize / fileSize * 100) : 0;
  }
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("videoUpload/uploadDataContext.js", ["constants.js", "repositories/videoRepository.js", "videoUpload/handlers/progress.js", "models/video.js"], function(constants, repository, progressHandler, VideoModel) {
  "use strict";
  var queueUploads = [],
      uploadChanges = false,
      videoConstants = constants.storage.video;
  return {
    queueUploads: queueUploads,
    uploadChanged: uploadChanged,
    saveVideo: saveVideo,
    removeVideo: removeVideo,
    addToUploadQueue: addToUploadQueue,
    removeFromUploadQueue: removeFromUploadQueue
  };
  function uploadChanged(value) {
    if (value !== undefined) {
      uploadChanges = value;
    }
    return uploadChanges;
  }
  function saveVideo(videoId, title) {
    var video = new VideoModel({
      id: videoId,
      title: title,
      thumbnailUrl: videoConstants.defaultThumbnailUrl,
      status: videoConstants.statuses.inProgress,
      progress: 0,
      createdOn: null,
      modifiedOn: null,
      vimeoId: null
    });
    repository.addVideo(video);
    return video;
  }
  function removeVideo(id, timeout) {
    var deferred = $.Deferred();
    setTimeout(function() {
      repository.removeVideo(id);
      deferred.resolve();
    }, timeout);
    return deferred.promise();
  }
  function addToUploadQueue(uploadUrl, fileSize, video) {
    var fileUploadedCallback = removeFromUploadQueue,
        handler = progressHandler.build(uploadUrl, fileSize, video, fileUploadedCallback);
    queueUploads.push(handler);
  }
  function removeFromUploadQueue(videoId) {
    var handlerToRemove = _.find(queueUploads, function(item) {
      return item.id == videoId;
    }),
        index = queueUploads.indexOf(handlerToRemove);
    if (index < 0) {
      return false;
    }
    queueUploads.splice(index, 1);
    return true;
  }
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("videoUpload/uploadTracking.js", ["libs/durandal/app.js", "constants.js", "videoUpload/uploadDataContext.js"], function(app, constants, uploadDataContext) {
  var videoConstants = constants.storage.video;
  return {initialize: function() {
      startTrackUploadProgress();
      startTrackUploadChanges();
    }};
  function startTrackUploadChanges() {
    setTimeout(function() {
      if (uploadDataContext.uploadChanged()) {
        uploadDataContext.uploadChanged(false);
        app.trigger(videoConstants.changesInUpload);
      }
      startTrackUploadChanges();
    }, videoConstants.trackChangesInUploadTimeout);
  }
  function startTrackUploadProgress() {
    setTimeout(function() {
      if (uploadDataContext.queueUploads.length) {
        var arrayPromises = [];
        _.each(uploadDataContext.queueUploads, function(item) {
          arrayPromises.push(item.handler().then(function() {
            uploadDataContext.uploadChanged(true);
          }));
        });
        Q.allSettled(arrayPromises).then(function() {
          startTrackUploadProgress();
        });
      } else {
        startTrackUploadProgress();
      }
    }, videoConstants.trackChangesInUploadTimeout);
  }
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("bootstrapping/trackVideoUploadTask.js", ["videoUpload/uploadTracking.js"], function(uploadTracking) {
  var task = {execute: execute};
  return task;
  function execute() {
    uploadTracking.initialize();
  }
});

_removeDefine();
})();
System.register("bootstrapper.tasks.js", ["bootstrapping/errorHandlingTask.js", "bootstrapping/localizationTask.js", "bootstrapping/routingTask.js", "bootstrapping/compositionTask.js", "bootstrapping/viewLocatorTask.js", "bootstrapping/knockoutBindingsTask.js", "bootstrapping/addWindowEventsTask.js", "bootstrapping/trackVideoUploadTask.js"], function($__export) {
  "use strict";
  var __moduleName = "bootstrapper.tasks.js";
  var errorHandlingTask,
      localizationTask,
      routingTask,
      compositionTask,
      viewLocatorTask,
      knockoutBindingsTask,
      addWindowEventsTask,
      trackVideoUploadTask;
  function getCollection() {
    return [errorHandlingTask, localizationTask, routingTask, compositionTask, viewLocatorTask, knockoutBindingsTask, addWindowEventsTask, trackVideoUploadTask];
  }
  return {
    setters: [function($__m) {
      errorHandlingTask = $__m.default;
    }, function($__m) {
      localizationTask = $__m.default;
    }, function($__m) {
      routingTask = $__m.default;
    }, function($__m) {
      compositionTask = $__m.default;
    }, function($__m) {
      viewLocatorTask = $__m.default;
    }, function($__m) {
      knockoutBindingsTask = $__m.default;
    }, function($__m) {
      addWindowEventsTask = $__m.default;
    }, function($__m) {
      trackVideoUploadTask = $__m.default;
    }],
    execute: function() {
      $__export('default', {getCollection: getCollection});
    }
  };
});

System.register("bootstrapper.js", ["libs/durandal/system.js", "bootstrapper.tasks.js"], function($__export) {
  "use strict";
  var __moduleName = "bootstrapper.js";
  var system,
      tasks;
  function run() {
    _.each(tasks.getCollection(), function(task) {
      if (_.isFunction(task.execute)) {
        task.execute();
      } else {
        system.log('Bootstrapper task ' + system.getModuleId(task) + 'is not executable');
      }
    });
  }
  $__export("run", run);
  return {
    setters: [function($__m) {
      system = $__m.default;
    }, function($__m) {
      tasks = $__m.default;
    }],
    execute: function() {}
  };
});

(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("mappers/companyMapper.js", [], function() {
  "use strict";
  return {map: map};
  function map(item) {
    return {
      id: item.Id,
      name: item.Name,
      logoUrl: item.LogoUrl,
      publishCourseApiUrl: item.PublishCourseApiUrl
    };
  }
  ;
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("models/user.js", ["constants.js", "guard.js", "mappers/companyMapper.js"], function(constants, guard, companyMapper) {
  function User(spec) {
    guard.throwIfNotAnObject(spec, 'You should provide specification to create user');
    guard.throwIfNotString(spec.email, 'You should provide email to create user');
    this.email = spec.email;
    this.role = spec.role;
    this.firstname = spec.firstname;
    this.lastname = spec.lastname;
    this.fullname = spec.firstname + ' ' + spec.lastname;
    this.showReleaseNote = spec.showReleaseNote;
    this.company = spec.company ? companyMapper.map(spec.company) : null;
    guard.throwIfNotAnObject(spec.subscription, 'You should provide subscription to create user');
    switch (spec.subscription.accessType) {
      case 0:
        this.subscription = {accessType: constants.accessType.free};
        break;
      case 1:
        this.subscription = {
          accessType: constants.accessType.starter,
          expirationDate: new Date(spec.subscription.expirationDate)
        };
        break;
      case 2:
        this.subscription = {
          accessType: constants.accessType.plus,
          expirationDate: new Date(spec.subscription.expirationDate)
        };
        break;
      case 100:
        this.subscription = {
          accessType: constants.accessType.trial,
          expirationDate: new Date(spec.subscription.expirationDate)
        };
        break;
      default:
        throw 'Provided subscription is not supported';
    }
  }
  ;
  User.prototype.downgrade = function() {
    this.subscription = {accessType: constants.accessType.free};
  };
  User.prototype.upgradeToStarter = function(expirationDate) {
    guard.throwIfNotString(expirationDate, 'Expiration date is not specified');
    this.subscription = {
      accessType: constants.accessType.starter,
      expirationDate: new Date(expirationDate)
    };
  };
  User.prototype.upgradeToPlus = function(expirationDate) {
    guard.throwIfNotString(expirationDate, 'Expiration date is not specified');
    this.subscription = {
      accessType: constants.accessType.plus,
      expirationDate: new Date(expirationDate)
    };
  };
  return User;
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("http/authHttpWrapper.js", ["notify.js", "http/httpRequestSender.js", "libs/durandal/app.js"], function(notify, httpRequestSender, app) {
  "use strict";
  return {post: post};
  function post(url, data) {
    app.trigger('authHttpWrapper:post-begin');
    var headers = window.auth.getHeader('auth');
    _.extend(headers, {"cache-control": "no-cache"});
    return httpRequestSender.post(url, data, headers).then(function(response) {
      if (!_.isObject(response)) {
        throw 'Response data is not an object';
      }
      return response.data;
    }).fin(function() {
      app.trigger('authHttpWrapper:post-end');
    });
  }
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("userContext.js", ["libs/durandal/app.js", "constants.js", "notify.js", "localization/localizationManager.js", "models/user.js", "http/authHttpWrapper.js", "http/storageHttpWrapper.js"], function(app, constants, notify, localizationManager, User, authHttpWrapper, storageHttpWrapper) {
  var userContext = {
    identity: null,
    hasStarterAccess: hasStarterAccess,
    hasPlusAccess: hasPlusAccess,
    hasTrialAccess: hasTrialAccess,
    identify: identify,
    storageIdentity: null,
    identifyStoragePermissions: identifyStoragePermissions
  };
  return userContext;
  function identify() {
    return Q(authHttpWrapper.post('auth/identity').then(function(user) {
      userContext.identity = _.isString(user.email) ? new User(user) : null;
      app.trigger(constants.messages.user.identified, userContext.identity);
    }));
  }
  function identifyStoragePermissions() {
    return Q(storageHttpWrapper.get(constants.storage.host + constants.storage.userUrl).then(function(data) {
      userContext.storageIdentity = {
        availableStorageSpace: data.AvailableStorageSpace,
        totalStorageSpace: data.TotalStorageSpace
      };
    }).fail(function() {
      userContext.storageIdentity = {
        availableStorageSpace: 0,
        totalStorageSpace: 0
      };
      notify.error(localizationManager.localize('storageFailed'));
    }));
  }
  function hasStarterAccess() {
    return hasAccess(constants.accessType.starter);
  }
  function hasPlusAccess() {
    return hasAccess(constants.accessType.plus);
  }
  function hasTrialAccess() {
    return hasAccess(constants.accessType.trial);
  }
  function hasAccess(accessType) {
    if (accessType === constants.accessType.free) {
      return true;
    }
    var identity = userContext.identity;
    if (_.isNullOrUndefined(identity) || _.isNullOrUndefined(identity.subscription)) {
      return false;
    }
    var subscription = identity.subscription;
    return subscription.accessType >= accessType && subscription.expirationDate >= new Date();
  }
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("synchronization/handlers/user/eventHandlers/upgradedToStarter.js", ["guard.js", "userContext.js", "libs/durandal/app.js", "constants.js"], function(guard, userContext, app, constants) {
  "use strict";
  return function(expirationDate) {
    guard.throwIfNotAnObject(userContext.identity, "User identity is not an object");
    userContext.identity.upgradeToStarter(expirationDate);
    app.trigger(constants.messages.user.upgradedToStarter);
  };
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("synchronization/handlers/user/eventHandlers/upgradedToPlus.js", ["guard.js", "userContext.js", "libs/durandal/app.js", "constants.js"], function(guard, userContext, app, constants) {
  "use strict";
  return function(expirationDate) {
    guard.throwIfNotAnObject(userContext.identity, "User identity is not an object");
    userContext.identity.upgradeToPlus(expirationDate);
    app.trigger(constants.messages.user.upgradedToPlus);
  };
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("synchronization/handlers/user/eventHandlers/downgraded.js", ["guard.js", "userContext.js", "libs/durandal/app.js", "constants.js"], function(guard, userContext, app, constants) {
  "use strict";
  return function() {
    guard.throwIfNotAnObject(userContext.identity, "User identity is not an object");
    userContext.identity.downgrade();
    app.trigger(constants.messages.user.downgraded);
  };
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("synchronization/handlers/user/handler.js", ["synchronization/handlers/user/eventHandlers/upgradedToStarter.js", "synchronization/handlers/user/eventHandlers/upgradedToPlus.js", "synchronization/handlers/user/eventHandlers/downgraded.js"], function(upgradedToStarter, upgradedToPlus, downgraded) {
  "use strict";
  return {
    upgradedToStarter: upgradedToStarter,
    upgradedToPlus: upgradedToPlus,
    downgraded: downgraded
  };
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("synchronization/handlers/course/eventHandlers/deleted.js", ["guard.js", "libs/durandal/app.js", "constants.js", "dataContext.js"], function(guard, app, constants, dataContext) {
  "use strict";
  return function(courseId) {
    guard.throwIfNotString(courseId, 'CourseId is not a string');
    var course = _.find(dataContext.courses, function(item) {
      return item.id == courseId;
    });
    if (_.isNullOrUndefined(course)) {
      return;
    }
    dataContext.courses = _.reject(dataContext.courses, function(item) {
      return item.id === courseId;
    });
    app.trigger(constants.messages.course.deletedByCollaborator, course.id);
  };
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("synchronization/handlers/course/eventHandlers/introductionContentUpdated.js", ["guard.js", "libs/durandal/app.js", "constants.js", "dataContext.js"], function(guard, app, constants, dataContext) {
  "use strict";
  return function(courseId, introductionContent, modifiedOn) {
    guard.throwIfNotString(courseId, 'CourseId is not a string');
    guard.throwIfNotString(modifiedOn, 'ModifiedOn is not a string');
    var course = _.find(dataContext.courses, function(item) {
      return item.id == courseId;
    });
    guard.throwIfNotAnObject(course, 'Course has not been found');
    course.introductionContent = introductionContent;
    course.modifiedOn = new Date(modifiedOn);
    app.trigger(constants.messages.course.introductionContentUpdatedByCollaborator, course);
  };
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("synchronization/handlers/course/eventHandlers/objectiveRelated.js", ["guard.js", "libs/durandal/app.js", "constants.js", "dataContext.js", "mappers/objectiveModelMapper.js"], function(guard, app, constants, dataContext, objectiveModelMapper) {
  "use strict";
  return function(courseId, objectiveData, targetIndex, modifiedOn) {
    guard.throwIfNotString(courseId, 'CourseId is not a string');
    guard.throwIfNotAnObject(objectiveData, 'Objective is not an object');
    guard.throwIfNotString(modifiedOn, 'ModifiedOn is not a string');
    var course = _.find(dataContext.courses, function(item) {
      return item.id == courseId;
    });
    guard.throwIfNotAnObject(course, 'Course has not been found');
    var objective = objectiveModelMapper.map(objectiveData);
    var objectiveExists = _.some(dataContext.objectives, function(item) {
      return item.id === objective.id;
    });
    if (!objectiveExists) {
      dataContext.objectives.push(objective);
    }
    course.objectives = _.reject(course.objectives, function(item) {
      return item.id == objective.id;
    });
    if (!_.isNullOrUndefined(targetIndex)) {
      course.objectives.splice(targetIndex, 0, objective);
    } else {
      course.objectives.push(objective);
    }
    course.modifiedOn = new Date(modifiedOn);
    app.trigger(constants.messages.course.objectiveRelatedByCollaborator, courseId, objective, targetIndex);
  };
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("synchronization/handlers/course/eventHandlers/objectivesReordered.js", ["guard.js", "libs/durandal/app.js", "constants.js", "dataContext.js"], function(guard, app, constants, dataContext) {
  "use strict";
  return function(courseId, objectiveIds, modifiedOn) {
    guard.throwIfNotString(courseId, 'CourseId is not a string');
    guard.throwIfNotArray(objectiveIds, 'ObjectiveIds is not an array');
    guard.throwIfNotString(modifiedOn, 'ModifiedOn is not a string');
    var course = _.find(dataContext.courses, function(item) {
      return item.id == courseId;
    });
    guard.throwIfNotAnObject(course, 'Course has not been found');
    course.objectives = _.map(objectiveIds, function(id) {
      return _.find(course.objectives, function(objective) {
        return objective.id == id;
      });
    });
    course.modifiedOn = new Date(modifiedOn);
    app.trigger(constants.messages.course.objectivesReorderedByCollaborator, course);
  };
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("synchronization/handlers/course/eventHandlers/objectivesUnrelated.js", ["guard.js", "libs/durandal/app.js", "constants.js", "dataContext.js", "userContext.js"], function(guard, app, constants, dataContext, userContext) {
  "use strict";
  return function objectivesUnrelated(courseId, objectiveIds, modifiedOn) {
    guard.throwIfNotString(courseId, 'CourseId is not a string');
    guard.throwIfNotArray(objectiveIds, 'ObjectiveIds is not an array');
    guard.throwIfNotString(modifiedOn, 'ModifiedOn is not a string');
    var course = _.find(dataContext.courses, function(item) {
      return item.id == courseId;
    });
    guard.throwIfNotAnObject(course, 'Course has not been found');
    var unrelatedObjectives = _.filter(course.objectives, function(item) {
      return _.some(objectiveIds, function(id) {
        return item.id == id;
      });
    });
    unrelatedObjectives = _.map(unrelatedObjectives, function(item) {
      return item.id;
    });
    course.objectives = _.reject(course.objectives, function(objective) {
      return _.some(objectiveIds, function(item) {
        return item == objective.id;
      });
    });
    dataContext.objectives = _.reject(dataContext.objectives, function(objective) {
      return _.some(objectiveIds, function(item) {
        return item == objective.id && objective.createdBy !== userContext.identity.email;
      });
    });
    course.modifiedOn = new Date(modifiedOn);
    app.trigger(constants.messages.course.objectivesUnrelatedByCollaborator, course.id, unrelatedObjectives);
  };
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("synchronization/handlers/course/eventHandlers/published.js", ["guard.js", "libs/durandal/app.js", "constants.js", "dataContext.js"], function(guard, app, constants, dataContext) {
  "use strict";
  return function(courseId, publicationUrl) {
    guard.throwIfNotString(courseId, 'CourseId is not a string');
    guard.throwIfNotString(publicationUrl, 'PublicationUrl is not a string');
    var course = _.find(dataContext.courses, function(item) {
      return item.id == courseId;
    });
    guard.throwIfNotAnObject(course, 'Course has not been found');
    course.publish.packageUrl = publicationUrl;
    app.trigger(constants.messages.course.publish.completed, course);
  };
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("repositories/templateRepository.js", ["dataContext.js"], function(dataContext) {
  var getCollection = function() {
    var deferred = Q.defer();
    deferred.resolve(dataContext.templates);
    return deferred.promise;
  },
      getById = function(id) {
        var deferred = Q.defer();
        if (_.isNullOrUndefined(id)) {
          throw 'Invalid argument';
        }
        var result = _.find(dataContext.templates, function(item) {
          return item.id === id;
        });
        if (_.isUndefined(result)) {
          deferred.reject('Template does not exist');
        } else {
          deferred.resolve(result);
        }
        return deferred.promise;
      },
      add = function(template) {
        if (!_.isObject(template)) {
          throw 'Template is not an object.';
        }
        dataContext.templates.push(template);
      };
  return {
    getCollection: getCollection,
    getById: getById,
    add: add
  };
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("synchronization/handlers/course/eventHandlers/templateUpdated.js", ["guard.js", "libs/durandal/app.js", "constants.js", "dataContext.js", "repositories/templateRepository.js", "mappers/templateModelMapper.js"], function(guard, app, constants, dataContext, templateRepository, templateModelMapper) {
  "use strict";
  return function(courseId, courseTemplate, modifiedOn) {
    guard.throwIfNotString(courseId, 'CourseId is not a string');
    guard.throwIfNotString(modifiedOn, 'ModifiedOn is not a string');
    guard.throwIfNotAnObject(courseTemplate, 'Template is not an object');
    var course = _.find(dataContext.courses, function(item) {
      return item.id == courseId;
    });
    guard.throwIfNotAnObject(course, 'Course has not been found');
    var template = _.find(dataContext.templates, function(item) {
      return item.id == courseTemplate.Id;
    });
    if (_.isNullOrUndefined(template)) {
      template = templateModelMapper.map(courseTemplate);
      templateRepository.add(template);
    }
    guard.throwIfNotAnObject(template, 'Template has not been found');
    course.template = template;
    course.modifiedOn = new Date(modifiedOn);
    app.trigger(constants.messages.course.templateUpdatedByCollaborator, course);
  };
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("synchronization/handlers/course/eventHandlers/titleUpdated.js", ["guard.js", "libs/durandal/app.js", "constants.js", "dataContext.js"], function(guard, app, constants, dataContext) {
  "use strict";
  return function(courseId, title, modifiedOn) {
    guard.throwIfNotString(courseId, 'CourseId is not a string');
    guard.throwIfNotString(title, 'Title is not a string');
    guard.throwIfNotString(modifiedOn, 'ModifiedOn is not a string');
    var course = _.find(dataContext.courses, function(item) {
      return item.id == courseId;
    });
    guard.throwIfNotAnObject(course, 'Course has not been found');
    course.title = title;
    course.modifiedOn = new Date(modifiedOn);
    app.trigger(constants.messages.course.titleUpdatedByCollaborator, course);
  };
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("synchronization/handlers/course/eventHandlers/objectivesReplaced.js", ["guard.js", "libs/durandal/app.js", "constants.js", "dataContext.js", "mappers/objectiveModelMapper.js"], function(guard, app, constants, dataContext, objectiveModelMapper) {
  "use strict";
  return function objectivesReplaced(courseId, replacedObjectivesInfo, modifiedOn) {
    guard.throwIfNotString(courseId, 'CourseId is not a string');
    guard.throwIfNotAnObject(replacedObjectivesInfo, 'ReplacedObjectivesInfo is not an object');
    guard.throwIfNotString(modifiedOn, 'ModifiedOn is not a string');
    var course = _.find(dataContext.courses, function(item) {
      return item.id == courseId;
    });
    guard.throwIfNotAnObject(course, 'Course has not been found');
    var replacedObjectives = [];
    var clonedObjective;
    var i;
    if (course.objectives) {
      for (i = 0; i < course.objectives.length; i++) {
        var objectiveId = course.objectives[i].id;
        if (replacedObjectivesInfo[objectiveId]) {
          clonedObjective = objectiveModelMapper.map(replacedObjectivesInfo[objectiveId]);
          course.objectives[i] = clonedObjective;
          replacedObjectives.push({
            oldId: objectiveId,
            newObjective: clonedObjective
          });
          app.trigger(constants.messages.course.objectiveRelatedByCollaborator, courseId, clonedObjective, i);
        }
      }
      for (i = 0; i < dataContext.objectives.length; i++) {
        clonedObjective = _.find(replacedObjectives, function(replacedObjective) {
          return replacedObjective.oldId == dataContext.objectives[i].id;
        });
        if (clonedObjective) {
          dataContext.objectives[i] = clonedObjective.newObjective;
        }
      }
    }
    course.modifiedOn = new Date(modifiedOn);
    app.trigger(constants.messages.course.objectivesUnrelatedByCollaborator, courseId, _.map(replacedObjectives, function(relatedObjective) {
      return relatedObjective.oldId;
    }));
  };
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("synchronization/handlers/course/eventHandlers/stateChanged.js", ["guard.js", "libs/durandal/app.js", "constants.js", "dataContext.js"], function(guard, app, constants, dataContext) {
  "use strict";
  return function(courseId, state) {
    guard.throwIfNotString(courseId, 'CourseId is not a string');
    guard.throwIfNotAnObject(state, 'State is not an object');
    guard.throwIfNotBoolean(state.isDirty, 'State isDirty is not a boolean');
    var course = _.find(dataContext.courses, function(item) {
      return item.id == courseId;
    });
    guard.throwIfNotAnObject(course, 'Course has not been found');
    if (course.isDirty === state.isDirty)
      return;
    course.isDirty = state.isDirty;
    app.trigger(constants.messages.course.stateChanged + courseId, state);
  };
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("synchronization/handlers/course/handler.js", ["synchronization/handlers/course/eventHandlers/deleted.js", "synchronization/handlers/course/eventHandlers/introductionContentUpdated.js", "synchronization/handlers/course/eventHandlers/objectiveRelated.js", "synchronization/handlers/course/eventHandlers/objectivesReordered.js", "synchronization/handlers/course/eventHandlers/objectivesUnrelated.js", "synchronization/handlers/course/eventHandlers/published.js", "synchronization/handlers/course/eventHandlers/templateUpdated.js", "synchronization/handlers/course/eventHandlers/titleUpdated.js", "synchronization/handlers/course/eventHandlers/objectivesReplaced.js", "synchronization/handlers/course/eventHandlers/stateChanged.js"], function(deleted, introductionContentUpdated, objectiveRelated, objectivesReordered, objectivesUnrelated, published, templateUpdated, titleUpdated, objectivesReplaced, stateChanged) {
  "use strict";
  return {
    titleUpdated: titleUpdated,
    introductionContentUpdated: introductionContentUpdated,
    templateUpdated: templateUpdated,
    objectivesReordered: objectivesReordered,
    published: published,
    deleted: deleted,
    objectiveRelated: objectiveRelated,
    objectivesUnrelated: objectivesUnrelated,
    objectivesReplaced: objectivesReplaced,
    stateChanged: stateChanged
  };
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("synchronization/handlers/objective/eventHandlers/questionsReordered.js", ["guard.js", "libs/durandal/app.js", "constants.js", "dataContext.js"], function(guard, app, constants, dataContext) {
  "use strict";
  return function(objectiveId, questionIds, modifiedOn) {
    guard.throwIfNotArray(questionIds, 'QuestionIds is not an array');
    guard.throwIfNotString(objectiveId, 'ObjectiveId is not a string');
    guard.throwIfNotString(modifiedOn, 'ModifiedOn is not a string');
    var objective = _.find(dataContext.objectives, function(item) {
      return item.id == objectiveId;
    });
    if (!_.isObject(objective)) {
      guard.throwIfNotAnObject(objective, 'Objective has not been found');
    }
    objective.questions = _.map(questionIds, function(id) {
      return _.find(objective.questions, function(question) {
        return question.id == id;
      });
    });
    objective.modifiedOn = new Date(modifiedOn);
    app.trigger(constants.messages.objective.questionsReorderedByCollaborator, objective);
  };
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("synchronization/handlers/objective/eventHandlers/titleUpdated.js", ["guard.js", "libs/durandal/app.js", "constants.js", "dataContext.js"], function(guard, app, constants, dataContext) {
  "use strict";
  return function(objectiveId, title, modifiedOn) {
    guard.throwIfNotString(title, 'Title is not a string');
    guard.throwIfNotString(objectiveId, 'ObjectiveId is not a string');
    guard.throwIfNotString(modifiedOn, 'ModifiedOn is not a string');
    var objective = _.find(dataContext.objectives, function(item) {
      return item.id == objectiveId;
    });
    if (!_.isObject(objective)) {
      guard.throwIfNotAnObject(objective, 'Objective has not been found');
    }
    objective.title = title;
    objective.modifiedOn = new Date(modifiedOn);
    app.trigger(constants.messages.objective.titleUpdatedByCollaborator, objective);
  };
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("synchronization/handlers/objective/eventHandlers/imageUrlUpdated.js", ["guard.js", "libs/durandal/app.js", "constants.js", "dataContext.js"], function(guard, app, constants, dataContext) {
  "use strict";
  return function(objectiveId, imageUrl, modifiedOn) {
    guard.throwIfNotString(objectiveId, 'ObjectiveId is not a string');
    guard.throwIfNotString(imageUrl, 'ImageUrl is not a string');
    guard.throwIfNotString(modifiedOn, 'ModifiedOn is not a string');
    var objective = _.find(dataContext.objectives, function(item) {
      return item.id == objectiveId;
    });
    if (!_.isObject(objective)) {
      guard.throwIfNotAnObject(objective, 'Objective has not been found');
    }
    objective.image = imageUrl;
    objective.modifiedOn = new Date(modifiedOn);
    app.trigger(constants.messages.objective.imageUrlUpdatedByCollaborator, objective);
  };
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("synchronization/handlers/objective/handler.js", ["synchronization/handlers/objective/eventHandlers/questionsReordered.js", "synchronization/handlers/objective/eventHandlers/titleUpdated.js", "synchronization/handlers/objective/eventHandlers/imageUrlUpdated.js"], function(questionsReordered, titleUpdated, imageUrlUpdated) {
  "use strict";
  return {
    questionsReordered: questionsReordered,
    titleUpdated: titleUpdated,
    imageUrlUpdated: imageUrlUpdated
  };
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("synchronization/handlers/questions/dragAndDropText/eventHandlers/dropspotCreated.js", ["guard.js", "libs/durandal/app.js", "constants.js", "dataContext.js"], function(guard, app, constants, dataContext) {
  "use strict";
  return function(questionId, dropspot, modifiedOn) {
    guard.throwIfNotString(questionId, 'QuestionId is not a string');
    guard.throwIfNotAnObject(dropspot, 'Dropspot is not an object');
    guard.throwIfNotString(modifiedOn, 'ModifiedOn is not a string');
    var question = _.find(dataContext.getQuestions(), function(item) {
      return item.id == questionId;
    });
    guard.throwIfNotAnObject(question, 'Question has not been found');
    question.modifiedOn = new Date(modifiedOn);
    app.trigger(constants.messages.question.dragAndDropText.dropspotCreatedByCollaborator, questionId, dropspot.Id, dropspot.Text);
  };
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("synchronization/handlers/questions/dragAndDropText/eventHandlers/dropspotDeleted.js", ["guard.js", "libs/durandal/app.js", "constants.js", "dataContext.js"], function(guard, app, constants, dataContext) {
  "use strict";
  return function(questionId, dropspotId, modifiedOn) {
    guard.throwIfNotString(questionId, 'QuestionId is not a string');
    guard.throwIfNotString(dropspotId, 'DropspotId is not a string');
    guard.throwIfNotString(modifiedOn, 'ModifiedOn is not a string');
    var question = _.find(dataContext.getQuestions(), function(item) {
      return item.id == questionId;
    });
    guard.throwIfNotAnObject(question, 'Question has not been found');
    question.modifiedOn = new Date(modifiedOn);
    app.trigger(constants.messages.question.dragAndDropText.dropspotDeletedByCollaborator, questionId, dropspotId);
  };
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("synchronization/handlers/questions/dragAndDropText/eventHandlers/dropspotTextChanged.js", ["guard.js", "libs/durandal/app.js", "constants.js", "dataContext.js"], function(guard, app, constants, dataContext) {
  "use strict";
  return function(questionId, dropspot, modifiedOn) {
    guard.throwIfNotString(questionId, 'QuestionId is not a string');
    guard.throwIfNotAnObject(dropspot, 'Dropspot is not an object');
    guard.throwIfNotString(modifiedOn, 'ModifiedOn is not a string');
    var question = _.find(dataContext.getQuestions(), function(item) {
      return item.id == questionId;
    });
    guard.throwIfNotAnObject(question, 'Question has not been found');
    question.modifiedOn = new Date(modifiedOn);
    app.trigger(constants.messages.question.dragAndDropText.dropspotTextChangedByCollaborator, questionId, dropspot.Id, dropspot.Text);
  };
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("synchronization/handlers/questions/dragAndDropText/eventHandlers/dropspotPositionChanged.js", ["guard.js", "libs/durandal/app.js", "constants.js", "dataContext.js"], function(guard, app, constants, dataContext) {
  "use strict";
  return function(questionId, dropspot, modifiedOn) {
    guard.throwIfNotString(questionId, 'QuestionId is not a string');
    guard.throwIfNotAnObject(dropspot, 'Dropspot is not an object');
    guard.throwIfNotString(modifiedOn, 'ModifiedOn is not a string');
    var question = _.find(dataContext.getQuestions(), function(item) {
      return item.id == questionId;
    });
    guard.throwIfNotAnObject(question, 'Question has not been found');
    question.modifiedOn = new Date(modifiedOn);
    app.trigger(constants.messages.question.dragAndDropText.dropspotPositionChangedByCollaborator, questionId, dropspot.Id, dropspot.X, dropspot.Y);
  };
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("synchronization/handlers/questions/dragAndDropText/handler.js", ["synchronization/handlers/questions/dragAndDropText/eventHandlers/dropspotCreated.js", "synchronization/handlers/questions/dragAndDropText/eventHandlers/dropspotDeleted.js", "synchronization/handlers/questions/dragAndDropText/eventHandlers/dropspotTextChanged.js", "synchronization/handlers/questions/dragAndDropText/eventHandlers/dropspotPositionChanged.js"], function(dropspotCreated, dropspotDeleted, dropspotTextChanged, dropspotPositionChanged) {
  "use strict";
  return {
    dropspotCreated: dropspotCreated,
    dropspotDeleted: dropspotDeleted,
    dropspotTextChanged: dropspotTextChanged,
    dropspotPositionChanged: dropspotPositionChanged
  };
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("synchronization/handlers/questions/fillInTheBlank/eventHandlers/updated.js", ["guard.js", "libs/durandal/app.js", "constants.js", "dataContext.js"], function(guard, app, constants, dataContext) {
  "use strict";
  return function(questionId, content, answers, modifiedOn) {
    guard.throwIfNotString(questionId, 'QuestionId is not a string');
    guard.throwIfNotArray(answers, 'Answers is not an array');
    guard.throwIfNotString(modifiedOn, 'ModifiedOn is not a string');
    var question = _.find(dataContext.getQuestions(), function(item) {
      return item.id == questionId;
    });
    guard.throwIfNotAnObject(question, 'Question has not been found');
    question.content = content;
    question.modifiedOn = new Date(modifiedOn);
    var questionData = {
      content: content,
      answers: _.map(answers, function(answer) {
        return {
          text: answer.Text,
          isCorrect: answer.IsCorrect,
          groupId: answer.GroupId
        };
      })
    };
    app.trigger(constants.messages.question.fillInTheBlank.updatedByCollaborator, questionId, questionData);
  };
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("synchronization/handlers/questions/fillInTheBlank/handler.js", ["synchronization/handlers/questions/fillInTheBlank/eventHandlers/updated.js"], function(updated) {
  "use strict";
  return {updated: updated};
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("synchronization/handlers/questions/question/eventHandlers/titleUpdated.js", ["guard.js", "libs/durandal/app.js", "constants.js", "dataContext.js"], function(guard, app, constants, dataContext) {
  "use strict";
  return function(questionId, title, modifiedOn) {
    guard.throwIfNotString(questionId, 'QuestionId is not a string');
    guard.throwIfNotString(title, 'Title is not a string');
    guard.throwIfNotString(modifiedOn, 'ModifiedOn is not a string');
    var question = _.find(dataContext.getQuestions(), function(item) {
      return item.id == questionId;
    });
    guard.throwIfNotAnObject(question, 'Question has not been found');
    question.title = title;
    question.modifiedOn = new Date(modifiedOn);
    app.trigger(constants.messages.question.titleUpdatedByCollaborator, question);
  };
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("synchronization/handlers/questions/question/eventHandlers/contentUpdated.js", ["guard.js", "libs/durandal/app.js", "constants.js", "dataContext.js"], function(guard, app, constants, dataContext) {
  "use strict";
  return function(questionId, content, modifiedOn) {
    guard.throwIfNotString(questionId, 'QuestionId is not a string');
    guard.throwIfNotString(modifiedOn, 'ModifiedOn is not a string');
    var question = _.find(dataContext.getQuestions(), function(item) {
      return item.id == questionId;
    });
    guard.throwIfNotAnObject(question, 'Question has not been found');
    question.content = content;
    question.modifiedOn = new Date(modifiedOn);
    app.trigger(constants.messages.question.contentUpdatedByCollaborator, question);
  };
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("synchronization/handlers/questions/question/eventHandlers/backgroundChanged.js", ["guard.js", "libs/durandal/app.js", "constants.js", "dataContext.js"], function(guard, app, constants, dataContext) {
  "use strict";
  return function(questionId, background, modifiedOn) {
    guard.throwIfNotString(questionId, 'QuestionId is not a string');
    guard.throwIfNotString(background, 'Background is not a string');
    guard.throwIfNotString(modifiedOn, 'ModifiedOn is not a string');
    var question = _.find(dataContext.getQuestions(), function(item) {
      return item.id == questionId;
    });
    guard.throwIfNotAnObject(question, 'Question has not been found');
    question.background = background;
    question.modifiedOn = new Date(modifiedOn);
    app.trigger(constants.messages.question.backgroundChangedByCollaborator, question);
  };
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("synchronization/handlers/questions/question/eventHandlers/correctFeedbackUpdated.js", ["guard.js", "libs/durandal/app.js", "constants.js", "dataContext.js"], function(guard, app, constants, dataContext) {
  "use strict";
  return function(questionId, feedbackText, modifiedOn) {
    guard.throwIfNotString(questionId, 'QuestionId is not a string');
    guard.throwIfNotString(feedbackText, 'FeedbackText is not a string');
    guard.throwIfNotString(modifiedOn, 'ModifiedOn is not a string');
    var question = _.find(dataContext.getQuestions(), function(item) {
      return item.id == questionId;
    });
    guard.throwIfNotAnObject(question, 'Question has not been found');
    question.modifiedOn = new Date(modifiedOn);
    app.trigger(constants.messages.question.correctFeedbackUpdatedByCollaborator, question, feedbackText);
  };
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("synchronization/handlers/questions/question/eventHandlers/incorrectFeedbackUpdated.js", ["guard.js", "libs/durandal/app.js", "constants.js", "dataContext.js"], function(guard, app, constants, dataContext) {
  "use strict";
  return function(questionId, feedbackText, modifiedOn) {
    guard.throwIfNotString(questionId, 'QuestionId is not a string');
    guard.throwIfNotString(feedbackText, 'FeedbackText is not a string');
    guard.throwIfNotString(modifiedOn, 'ModifiedOn is not a string');
    var question = _.find(dataContext.getQuestions(), function(item) {
      return item.id == questionId;
    });
    guard.throwIfNotAnObject(question, 'Question has not been found');
    question.modifiedOn = new Date(modifiedOn);
    app.trigger(constants.messages.question.incorrectFeedbackUpdatedByCollaborator, question, feedbackText);
  };
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("synchronization/handlers/questions/question/eventHandlers/created.js", ["guard.js", "libs/durandal/app.js", "constants.js", "dataContext.js", "mappers/questionModelMapper.js"], function(guard, app, constants, dataContext, questionModelMapper) {
  "use strict";
  return function(objectiveId, newQuestion, modifiedOn) {
    guard.throwIfNotString(objectiveId, 'ObjectiveId is not a string');
    guard.throwIfNotAnObject(newQuestion, 'Question is not an object');
    guard.throwIfNotString(modifiedOn, 'ModifiedOn is not a string');
    var objective = _.find(dataContext.objectives, function(item) {
      return item.id == objectiveId;
    });
    if (!_.isObject(objective)) {
      guard.throwIfNotAnObject(objective, 'Objective has not been found');
    }
    var question = _.find(objective.questions, function(item) {
      return item.id == newQuestion.Id;
    });
    if (!_.isNullOrUndefined(question))
      return;
    var mappedQuestion = questionModelMapper.map(newQuestion);
    objective.questions.push(mappedQuestion);
    objective.modifiedOn = new Date(modifiedOn);
    app.trigger(constants.messages.question.createdByCollaborator, objectiveId, mappedQuestion);
  };
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("synchronization/handlers/questions/question/eventHandlers/deleted.js", ["guard.js", "libs/durandal/app.js", "constants.js", "dataContext.js"], function(guard, app, constants, dataContext) {
  "use strict";
  return function(objectiveId, questionIds, modifiedOn) {
    guard.throwIfNotArray(questionIds, 'QuestionIds is not an array');
    guard.throwIfNotString(objectiveId, 'ObjectiveId is not a string');
    guard.throwIfNotString(modifiedOn, 'ModifiedOn is not a string');
    var objective = _.find(dataContext.objectives, function(item) {
      return item.id == objectiveId;
    });
    if (!_.isObject(objective)) {
      guard.throwIfNotAnObject(objective, 'Objective has not been found');
    }
    objective.questions = _.reject(objective.questions, function(item) {
      return _.indexOf(questionIds, item.id) != -1;
    });
    objective.modifiedOn = new Date(modifiedOn);
    app.trigger(constants.messages.question.deletedByCollaborator, objectiveId, questionIds);
  };
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("synchronization/handlers/questions/question/eventHandlers/learningContentsReordered.js", ["guard.js", "libs/durandal/app.js", "constants.js", "dataContext.js"], function(guard, app, constants, dataContext) {
  "use strict";
  return function(questionId, learningContentsIds, modifiedOn) {
    guard.throwIfNotString(questionId, 'QuestionId is not a string');
    guard.throwIfNotArray(learningContentsIds, 'learningContents is not array');
    guard.throwIfNotString(modifiedOn, 'ModifiedOn is not a string');
    var question = _.find(dataContext.getQuestions(), function(item) {
      return item.id == questionId;
    });
    guard.throwIfNotAnObject(question, 'Question has not been found');
    question.modifiedOn = new Date(modifiedOn);
    app.trigger(constants.messages.question.learningContentsReorderedByCollaborator, question, learningContentsIds);
  };
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("synchronization/handlers/questions/question/handler.js", ["synchronization/handlers/questions/question/eventHandlers/titleUpdated.js", "synchronization/handlers/questions/question/eventHandlers/contentUpdated.js", "synchronization/handlers/questions/question/eventHandlers/backgroundChanged.js", "synchronization/handlers/questions/question/eventHandlers/correctFeedbackUpdated.js", "synchronization/handlers/questions/question/eventHandlers/incorrectFeedbackUpdated.js", "synchronization/handlers/questions/question/eventHandlers/created.js", "synchronization/handlers/questions/question/eventHandlers/deleted.js", "synchronization/handlers/questions/question/eventHandlers/learningContentsReordered.js"], function(titleUpdated, contentUpdated, backgroundChanged, correctFeedbackUpdated, incorrectFeedbackUpdated, created, deleted, learningContentsReordered) {
  "use strict";
  return {
    titleUpdated: titleUpdated,
    contentUpdated: contentUpdated,
    backgroundChanged: backgroundChanged,
    correctFeedbackUpdated: correctFeedbackUpdated,
    incorrectFeedbackUpdated: incorrectFeedbackUpdated,
    created: created,
    deleted: deleted,
    learningContentsReordered: learningContentsReordered
  };
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("synchronization/handlers/questions/textMatching/eventHandlers/answerCreated.js", ["guard.js", "libs/durandal/app.js", "constants.js", "dataContext.js"], function(guard, app, constants, dataContext) {
  "use strict";
  return function(questionId, answer, modifiedOn) {
    guard.throwIfNotString(questionId, 'QuestionId is not a string');
    guard.throwIfNotAnObject(answer, 'Answer is not an object');
    guard.throwIfNotString(modifiedOn, 'ModifiedOn is not a string');
    var question = _.find(dataContext.getQuestions(), function(item) {
      return item.id == questionId;
    });
    guard.throwIfNotAnObject(question, 'Question has not been found');
    question.modifiedOn = new Date(modifiedOn);
    app.trigger(constants.messages.question.textMatching.answerCreatedByCollaborator, questionId, answer.Id, answer.Key, answer.Value);
  };
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("synchronization/handlers/questions/textMatching/eventHandlers/answerDeleted.js", ["guard.js", "libs/durandal/app.js", "constants.js", "dataContext.js"], function(guard, app, constants, dataContext) {
  "use strict";
  return function(questionId, answerId, modifiedOn) {
    guard.throwIfNotString(questionId, 'QuestionId is not a string');
    guard.throwIfNotString(answerId, 'AnswerId is not a string');
    guard.throwIfNotString(modifiedOn, 'ModifiedOn is not a string');
    var question = _.find(dataContext.getQuestions(), function(item) {
      return item.id == questionId;
    });
    guard.throwIfNotAnObject(question, 'Question has not been found');
    question.modifiedOn = new Date(modifiedOn);
    app.trigger(constants.messages.question.textMatching.answerDeletedByCollaborator, questionId, answerId);
  };
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("synchronization/handlers/questions/textMatching/eventHandlers/answerKeyChanged.js", ["guard.js", "libs/durandal/app.js", "constants.js", "dataContext.js"], function(guard, app, constants, dataContext) {
  "use strict";
  return function(questionId, answer, modifiedOn) {
    guard.throwIfNotString(questionId, 'QuestionId is not a string');
    guard.throwIfNotAnObject(answer, 'Answer is not an object');
    guard.throwIfNotString(modifiedOn, 'ModifiedOn is not a string');
    var question = _.find(dataContext.getQuestions(), function(item) {
      return item.id == questionId;
    });
    guard.throwIfNotAnObject(question, 'Question has not been found');
    question.modifiedOn = new Date(modifiedOn);
    app.trigger(constants.messages.question.textMatching.answerKeyChangedByCollaborator, questionId, answer.Id, answer.Key);
  };
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("synchronization/handlers/questions/textMatching/eventHandlers/answerValueChanged.js", ["guard.js", "libs/durandal/app.js", "constants.js", "dataContext.js"], function(guard, app, constants, dataContext) {
  "use strict";
  return function(questionId, answer, modifiedOn) {
    guard.throwIfNotString(questionId, 'QuestionId is not a string');
    guard.throwIfNotAnObject(answer, 'Answer is not an object');
    guard.throwIfNotString(modifiedOn, 'ModifiedOn is not a string');
    var question = _.find(dataContext.getQuestions(), function(item) {
      return item.id == questionId;
    });
    guard.throwIfNotAnObject(question, 'Question has not been found');
    question.modifiedOn = new Date(modifiedOn);
    app.trigger(constants.messages.question.textMatching.answerValueChangedByCollaborator, questionId, answer.Id, answer.Value);
  };
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("synchronization/handlers/questions/textMatching/handler.js", ["synchronization/handlers/questions/textMatching/eventHandlers/answerCreated.js", "synchronization/handlers/questions/textMatching/eventHandlers/answerDeleted.js", "synchronization/handlers/questions/textMatching/eventHandlers/answerKeyChanged.js", "synchronization/handlers/questions/textMatching/eventHandlers/answerValueChanged.js"], function(answerCreated, answerDeleted, answerKeyChanged, answerValueChanged) {
  "use strict";
  return {
    answerCreated: answerCreated,
    answerDeleted: answerDeleted,
    answerKeyChanged: answerKeyChanged,
    answerValueChanged: answerValueChanged
  };
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("models/singleSelectImageAnswer.js", ["models/entity.js"], function(entityModel) {
  "use strict";
  var learningContent = function(spec) {
    var obj = new entityModel(spec);
    obj.image = spec.image;
    return obj;
  };
  return learningContent;
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("mappers/singleSelectImageAnswerMapper.js", ["models/singleSelectImageAnswer.js"], function(SingleSelectImageAnswerModel) {
  "use strict";
  var map = function(answer) {
    return new SingleSelectImageAnswerModel({
      id: answer.Id,
      image: answer.Image,
      createdOn: new Date(answer.CreatedOn),
      modifiedOn: new Date(answer.ModifiedOn)
    });
  };
  return {map: map};
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("synchronization/handlers/questions/singleSelectImage/eventHandlers/answerCreated.js", ["guard.js", "libs/durandal/app.js", "constants.js", "dataContext.js", "mappers/singleSelectImageAnswerMapper.js"], function(guard, app, constants, dataContext, mapper) {
  "use strict";
  return function(questionId, answer, modifiedOn) {
    guard.throwIfNotString(questionId, 'QuestionId is not a string');
    guard.throwIfNotAnObject(answer, 'Answer is not an object');
    guard.throwIfNotString(modifiedOn, 'ModifiedOn is not a string');
    var question = _.find(dataContext.getQuestions(), function(item) {
      return item.id == questionId;
    });
    guard.throwIfNotAnObject(question, 'Question has not been found');
    question.modifiedOn = new Date(modifiedOn);
    app.trigger(constants.messages.question.singleSelectImage.answerCreatedByCollaborator, questionId, mapper.map(answer));
  };
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("synchronization/handlers/questions/singleSelectImage/eventHandlers/answerDeleted.js", ["guard.js", "libs/durandal/app.js", "constants.js", "dataContext.js"], function(guard, app, constants, dataContext) {
  "use strict";
  return function(questionId, answerId, correctAnswerId, modifiedOn) {
    guard.throwIfNotString(questionId, 'QuestionId is not a string');
    guard.throwIfNotString(answerId, 'AnswerId is not a string');
    guard.throwIfNotString(correctAnswerId, 'CorrectAnswerId is not a string');
    guard.throwIfNotString(modifiedOn, 'ModifiedOn is not a string');
    var question = _.find(dataContext.getQuestions(), function(item) {
      return item.id == questionId;
    });
    guard.throwIfNotAnObject(question, 'Question has not been found');
    question.modifiedOn = new Date(modifiedOn);
    app.trigger(constants.messages.question.singleSelectImage.answerDeletedByCollaborator, questionId, answerId, correctAnswerId);
  };
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("synchronization/handlers/questions/singleSelectImage/eventHandlers/answerImageUpdated.js", ["guard.js", "libs/durandal/app.js", "constants.js", "dataContext.js", "mappers/singleSelectImageAnswerMapper.js"], function(guard, app, constants, dataContext, mapper) {
  "use strict";
  return function(questionId, answer, modifiedOn) {
    guard.throwIfNotString(questionId, 'QuestionId is not a string');
    guard.throwIfNotAnObject(answer, 'Answer is not an object');
    guard.throwIfNotString(modifiedOn, 'ModifiedOn is not a string');
    var question = _.find(dataContext.getQuestions(), function(item) {
      return item.id == questionId;
    });
    guard.throwIfNotAnObject(question, 'Question has not been found');
    question.modifiedOn = new Date(modifiedOn);
    app.trigger(constants.messages.question.singleSelectImage.answerImageUpdatedByCollaborator, questionId, mapper.map(answer));
  };
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("synchronization/handlers/questions/singleSelectImage/eventHandlers/correctAnswerChanged.js", ["guard.js", "libs/durandal/app.js", "constants.js", "dataContext.js"], function(guard, app, constants, dataContext) {
  "use strict";
  return function(questionId, answerId, modifiedOn) {
    guard.throwIfNotString(questionId, 'QuestionId is not a string');
    guard.throwIfNotString(answerId, 'AnswerId is not a string');
    guard.throwIfNotString(modifiedOn, 'ModifiedOn is not a string');
    var question = _.find(dataContext.getQuestions(), function(item) {
      return item.id == questionId;
    });
    guard.throwIfNotAnObject(question, 'Question has not been found');
    question.modifiedOn = new Date(modifiedOn);
    app.trigger(constants.messages.question.singleSelectImage.correctAnswerChangedByCollaborator, questionId, answerId);
  };
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("synchronization/handlers/questions/singleSelectImage/handler.js", ["synchronization/handlers/questions/singleSelectImage/eventHandlers/answerCreated.js", "synchronization/handlers/questions/singleSelectImage/eventHandlers/answerDeleted.js", "synchronization/handlers/questions/singleSelectImage/eventHandlers/answerImageUpdated.js", "synchronization/handlers/questions/singleSelectImage/eventHandlers/correctAnswerChanged.js"], function(answerCreated, answerDeleted, answerImageUpdated, correctAnswerChanged) {
  "use strict";
  return {
    answerCreated: answerCreated,
    answerDeleted: answerDeleted,
    answerImageUpdated: answerImageUpdated,
    correctAnswerChanged: correctAnswerChanged
  };
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("synchronization/handlers/questions/hotSpot/eventHandlers/polygonCreated.js", ["guard.js", "libs/durandal/app.js", "constants.js", "dataContext.js"], function(guard, app, constants, dataContext) {
  "use strict";
  return function(questionId, polygon, modifiedOn) {
    guard.throwIfNotString(questionId, 'QuestionId is not a string');
    guard.throwIfNotAnObject(polygon, 'Polygon is not an object');
    guard.throwIfNotString(modifiedOn, 'ModifiedOn is not a string');
    var question = _.find(dataContext.getQuestions(), function(item) {
      return item.id == questionId;
    });
    guard.throwIfNotAnObject(question, 'Question has not been found');
    question.modifiedOn = new Date(modifiedOn);
    app.trigger(constants.messages.question.hotSpot.polygonCreatedByCollaborator, questionId, polygon.Id, JSON.parse(polygon.Points));
  };
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("synchronization/handlers/questions/hotSpot/eventHandlers/polygonDeleted.js", ["guard.js", "libs/durandal/app.js", "constants.js", "dataContext.js"], function(guard, app, constants, dataContext) {
  "use strict";
  return function(questionId, polygonId, modifiedOn) {
    guard.throwIfNotString(questionId, 'QuestionId is not a string');
    guard.throwIfNotString(polygonId, 'PolygonId is not a string');
    guard.throwIfNotString(modifiedOn, 'ModifiedOn is not a string');
    var question = _.find(dataContext.getQuestions(), function(item) {
      return item.id == questionId;
    });
    guard.throwIfNotAnObject(question, 'Question has not been found');
    question.modifiedOn = new Date(modifiedOn);
    app.trigger(constants.messages.question.hotSpot.polygonDeletedByCollaborator, questionId, polygonId);
  };
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("synchronization/handlers/questions/hotSpot/eventHandlers/polygonChanged.js", ["guard.js", "libs/durandal/app.js", "constants.js", "dataContext.js"], function(guard, app, constants, dataContext) {
  "use strict";
  return function(questionId, polygon, modifiedOn) {
    guard.throwIfNotString(questionId, 'QuestionId is not a string');
    guard.throwIfNotAnObject(polygon, 'Polygon is not an object');
    guard.throwIfNotString(modifiedOn, 'ModifiedOn is not a string');
    var question = _.find(dataContext.getQuestions(), function(item) {
      return item.id == questionId;
    });
    guard.throwIfNotAnObject(question, 'Question has not been found');
    question.modifiedOn = new Date(modifiedOn);
    app.trigger(constants.messages.question.hotSpot.polygonUpdatedByCollaborator, questionId, polygon.Id, JSON.parse(polygon.Points));
  };
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("synchronization/handlers/questions/hotSpot/eventHandlers/isMultipleChanged.js", ["guard.js", "libs/durandal/app.js", "constants.js", "dataContext.js"], function(guard, app, constants, dataContext) {
  "use strict";
  return function(questionId, isMultiple, modifiedOn) {
    guard.throwIfNotString(questionId, 'QuestionId is not a string');
    guard.throwIfNotBoolean(isMultiple, 'isMultiple is not an boolean');
    guard.throwIfNotString(modifiedOn, 'ModifiedOn is not a string');
    var question = _.find(dataContext.getQuestions(), function(item) {
      return item.id == questionId;
    });
    guard.throwIfNotAnObject(question, 'Question has not been found');
    question.modifiedOn = new Date(modifiedOn);
    app.trigger(constants.messages.question.hotSpot.isMultipleUpdatedByCollaborator, questionId, isMultiple);
  };
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("synchronization/handlers/questions/hotSpot/handler.js", ["synchronization/handlers/questions/hotSpot/eventHandlers/polygonCreated.js", "synchronization/handlers/questions/hotSpot/eventHandlers/polygonDeleted.js", "synchronization/handlers/questions/hotSpot/eventHandlers/polygonChanged.js", "synchronization/handlers/questions/hotSpot/eventHandlers/isMultipleChanged.js"], function(polygonCreated, polygonDeleted, polygonChanged, isMultipleChanged) {
  "use strict";
  return {
    polygonCreated: polygonCreated,
    polygonDeleted: polygonDeleted,
    polygonChanged: polygonChanged,
    isMultipleChanged: isMultipleChanged
  };
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("synchronization/handlers/questions/handler.js", ["synchronization/handlers/questions/dragAndDropText/handler.js", "synchronization/handlers/questions/fillInTheBlank/handler.js", "synchronization/handlers/questions/question/handler.js", "synchronization/handlers/questions/textMatching/handler.js", "synchronization/handlers/questions/singleSelectImage/handler.js", "synchronization/handlers/questions/hotSpot/handler.js"], function(dragAndDropText, fillInTheBlank, question, textMatching, singleSelectImage, hotSpot) {
  "use strict";
  return {
    dragAndDropText: dragAndDropText,
    fillInTheBlank: fillInTheBlank,
    question: question,
    textMatching: textMatching,
    singleSelectImage: singleSelectImage,
    hotSpot: hotSpot
  };
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("models/answerOption.js", ["models/entity.js"], function(EntityModel) {
  "use strict";
  var AnswerOption = function(spec) {
    var obj = new EntityModel(spec);
    obj.text = spec.text;
    obj.isCorrect = spec.isCorrect;
    return obj;
  };
  return AnswerOption;
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("mappers/answerModelMapper.js", ["models/answerOption.js"], function(AnswerModel) {
  "use strict";
  var map = function(answer) {
    return new AnswerModel({
      id: answer.Id,
      text: answer.Text,
      isCorrect: answer.IsCorrect,
      createdOn: answer.CreatedOn
    });
  };
  return {map: map};
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("synchronization/handlers/answer/eventHandlers/created.js", ["guard.js", "libs/durandal/app.js", "constants.js", "dataContext.js", "mappers/answerModelMapper.js"], function(guard, app, constants, dataContext, answerMapper) {
  "use strict";
  return function(questionId, answerData) {
    guard.throwIfNotString(questionId, 'QuestionId is not a string');
    guard.throwIfNotAnObject(answerData, 'Answer is not an object');
    var question = _.find(dataContext.getQuestions(), function(item) {
      return item.id == questionId;
    });
    guard.throwIfNotAnObject(question, 'Question has not been found');
    question.modifiedOn = new Date(answerData.createdOn);
    var answer = answerMapper.map(answerData);
    app.trigger(constants.messages.question.answer.addedByCollaborator, question, answer);
  };
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("synchronization/handlers/answer/eventHandlers/deleted.js", ["guard.js", "libs/durandal/app.js", "constants.js", "dataContext.js"], function(guard, app, constants, dataContext) {
  "use strict";
  return function(questionId, answerId, modifiedOn) {
    guard.throwIfNotString(questionId, 'QuestionId is not a string');
    guard.throwIfNotString(answerId, 'AnswerId is not a string');
    guard.throwIfNotString(modifiedOn, 'ModifiedOn is not a string');
    var question = _.find(dataContext.getQuestions(), function(item) {
      return item.id == questionId;
    });
    guard.throwIfNotAnObject(question, 'Question has not been found');
    question.modifiedOn = new Date(modifiedOn);
    if (question.type == constants.questionType.singleSelectText.type) {
      app.trigger(constants.messages.question.answer.singleSelectTextDeleteByCollaborator, question, answerId);
    } else {
      app.trigger(constants.messages.question.answer.deletedByCollaborator, question, answerId);
    }
  };
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("synchronization/handlers/answer/eventHandlers/textUpdated.js", ["guard.js", "libs/durandal/app.js", "constants.js", "dataContext.js"], function(guard, app, constants, dataContext) {
  "use strict";
  return function(questionId, answerId, text, modifiedOn) {
    guard.throwIfNotString(questionId, 'QuestionId is not a string');
    guard.throwIfNotString(text, 'Text is not a string');
    guard.throwIfNotString(answerId, 'AnswerId is not a string');
    guard.throwIfNotString(modifiedOn, 'ModifiedOn is not a string');
    var question = _.find(dataContext.getQuestions(), function(item) {
      return item.id == questionId;
    });
    guard.throwIfNotAnObject(question, 'Question has not been found');
    question.modifiedOn = new Date(modifiedOn);
    app.trigger(constants.messages.question.answer.textUpdatedByCollaborator, question, answerId, text);
  };
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("synchronization/handlers/answer/eventHandlers/answerCorrectnessUpdated.js", ["guard.js", "libs/durandal/app.js", "constants.js", "dataContext.js"], function(guard, app, constants, dataContext) {
  "use strict";
  return function(questionId, answerId, isCorrect, modifiedOn) {
    guard.throwIfNotString(questionId, 'QuestionId is not a string');
    guard.throwIfNotString(answerId, 'AnswerId is not a string');
    guard.throwIfNotBoolean(isCorrect, 'IsCorrect is not boolean');
    guard.throwIfNotString(modifiedOn, 'ModifiedOn is not a string');
    var question = _.find(dataContext.getQuestions(), function(item) {
      return item.id == questionId;
    });
    guard.throwIfNotAnObject(question, 'Question has not been found');
    question.modifiedOn = new Date(modifiedOn);
    app.trigger(constants.messages.question.answer.answerCorrectnessUpdatedByCollaborator, question, answerId, isCorrect);
  };
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("synchronization/handlers/answer/handler.js", ["synchronization/handlers/answer/eventHandlers/created.js", "synchronization/handlers/answer/eventHandlers/deleted.js", "synchronization/handlers/answer/eventHandlers/textUpdated.js", "synchronization/handlers/answer/eventHandlers/answerCorrectnessUpdated.js"], function(created, deleted, textUpdated, answerCorrectnessUpdated) {
  "use strict";
  return {
    created: created,
    deleted: deleted,
    textUpdated: textUpdated,
    answerCorrectnessUpdated: answerCorrectnessUpdated
  };
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("models/learningContent.js", ["models/entity.js"], function(entityModel) {
  "use strict";
  var learningContent = function(spec) {
    var obj = new entityModel(spec);
    obj.text = spec.text;
    obj.type = spec.type;
    return obj;
  };
  return learningContent;
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("mappers/learningContentModelMapper.js", ["models/learningContent.js", "constants.js"], function(LearningContentModel, constants) {
  "use strict";
  var map = function(learningContent) {
    return new LearningContentModel({
      id: learningContent.Id,
      text: learningContent.Text,
      type: getLearningContentType(learningContent.Text),
      createdOn: learningContent.CreatedOn
    });
  };
  return {map: map};
  function getLearningContentType(text) {
    var $output = $('<output>');
    $output.html(text);
    var dataType = $('[data-type]', $output).attr('data-type');
    switch (dataType) {
      case constants.learningContentsTypes.hotspot:
        return constants.learningContentsTypes.hotspot;
      default:
        return constants.learningContentsTypes.content;
    }
  }
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("synchronization/handlers/learningContent/eventHandlers/created.js", ["guard.js", "libs/durandal/app.js", "constants.js", "dataContext.js", "mappers/learningContentModelMapper.js"], function(guard, app, constants, dataContext, learningContentModelMapper) {
  "use strict";
  return function(questionId, learningContent, modifiedOn) {
    guard.throwIfNotString(questionId, 'QuestionId is not a string');
    guard.throwIfNotAnObject(learningContent, 'LearningContent is not an object');
    guard.throwIfNotString(modifiedOn, 'ModifiedOn is not a string');
    var question = _.find(dataContext.getQuestions(), function(item) {
      return item.id == questionId;
    });
    guard.throwIfNotAnObject(question, 'Question has not been found');
    question.modifiedOn = new Date(modifiedOn);
    app.trigger(constants.messages.question.learningContent.createdByCollaborator, question, learningContentModelMapper.map(learningContent));
  };
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("synchronization/handlers/learningContent/eventHandlers/textUpdated.js", ["guard.js", "libs/durandal/app.js", "constants.js", "dataContext.js", "mappers/learningContentModelMapper.js"], function(guard, app, constants, dataContext, learningContentModelMapper) {
  "use strict";
  return function(questionId, learningContent, modifiedOn) {
    guard.throwIfNotString(questionId, 'QuestionId is not a string');
    guard.throwIfNotAnObject(learningContent, 'LearningContent is not an object');
    guard.throwIfNotString(modifiedOn, 'ModifiedOn is not a string');
    var question = _.find(dataContext.getQuestions(), function(item) {
      return item.id == questionId;
    });
    guard.throwIfNotAnObject(question, 'Question has not been found');
    question.modifiedOn = new Date(modifiedOn);
    app.trigger(constants.messages.question.learningContent.textUpdatedByCollaborator, question, learningContentModelMapper.map(learningContent));
  };
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("synchronization/handlers/learningContent/eventHandlers/deleted.js", ["guard.js", "libs/durandal/app.js", "constants.js", "dataContext.js"], function(guard, app, constants, dataContext) {
  "use strict";
  return function(questionId, learningContentId, modifiedOn) {
    guard.throwIfNotString(questionId, 'QuestionId is not a string');
    guard.throwIfNotString(learningContentId, 'LearningContentId is not a string');
    guard.throwIfNotString(modifiedOn, 'ModifiedOn is not a string');
    var question = _.find(dataContext.getQuestions(), function(item) {
      return item.id == questionId;
    });
    guard.throwIfNotAnObject(question, 'Question has not been found');
    question.modifiedOn = new Date(modifiedOn);
    app.trigger(constants.messages.question.learningContent.deletedByCollaborator, question, learningContentId);
  };
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("synchronization/handlers/learningContent/handler.js", ["synchronization/handlers/learningContent/eventHandlers/created.js", "synchronization/handlers/learningContent/eventHandlers/textUpdated.js", "synchronization/handlers/learningContent/eventHandlers/deleted.js"], function(created, textUpdated, deleted) {
  "use strict";
  return {
    created: created,
    textUpdated: textUpdated,
    deleted: deleted
  };
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("synchronization/handlers/collaboration/eventHandlers/started.js", ["guard.js", "libs/durandal/app.js", "constants.js", "dataContext.js", "mappers/courseModelMapper.js", "mappers/objectiveModelMapper.js", "repositories/templateRepository.js", "mappers/templateModelMapper.js"], function(guard, app, constants, dataContext, courseModelMapper, objectiveModelMapper, templateRepository, templateModelMapper) {
  "use strict";
  return function(course, objectives, courseTemplate) {
    guard.throwIfNotAnObject(course, 'Course is not an object');
    guard.throwIfNotArray(objectives, 'Objectives is not an array');
    guard.throwIfNotAnObject(courseTemplate, 'Template is not an object');
    _.each(objectives, function(objective) {
      var objectiveExists = _.some(dataContext.objectives, function(obj) {
        return obj.id === objective.Id;
      });
      if (!objectiveExists) {
        dataContext.objectives.push(objectiveModelMapper.map(objective));
      }
    });
    var existingCourse = _.find(dataContext.courses, function(item) {
      return item.id == course.Id;
    });
    var template = _.find(dataContext.templates, function(item) {
      return item.id == courseTemplate.Id;
    });
    if (_.isNullOrUndefined(template)) {
      templateRepository.add(templateModelMapper.map(courseTemplate));
    }
    if (_.isNullOrUndefined(existingCourse)) {
      existingCourse = courseModelMapper.map(course, dataContext.objectives, dataContext.templates);
      dataContext.courses.push(existingCourse);
    }
    app.trigger(constants.messages.course.collaboration.started, existingCourse);
  };
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("synchronization/handlers/collaboration/eventHandlers/finished.js", ["guard.js", "libs/durandal/app.js", "constants.js", "dataContext.js", "userContext.js"], function(guard, app, constants, dataContext, userContext) {
  "use strict";
  return function(courseId) {
    guard.throwIfNotString(courseId, 'CourseId is not a string');
    var username = _.isObject(userContext.identity) ? userContext.identity.email : '';
    dataContext.courses = _.reject(dataContext.courses, function(course) {
      return course.id == courseId;
    });
    dataContext.objectives = _.reject(dataContext.objectives, function(objective) {
      return objective.createdBy !== username && !objectiveRelatedToAvailableCourses(objective.id);
    });
    app.trigger(constants.messages.course.collaboration.finished, courseId);
  };
  function objectiveRelatedToAvailableCourses(objectiveId) {
    return _.some(dataContext.courses, function(course) {
      return _.some(course.objectives, function(objective) {
        return objective.id === objectiveId;
      });
    });
  }
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("models/collaborator.js", ["models/entity.js"], function(EntityModel) {
  "use strict";
  function Collaborator(spec) {
    EntityModel.call(this, spec);
    this.email = spec.email;
    this.registered = spec.registered;
    this.fullName = spec.fullName;
    this.state = '';
    this.isAccepted = spec.isAccepted;
  }
  ;
  return Collaborator;
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("mappers/collaboratorModelMapper.js", ["models/collaborator.js"], function(CollaboratorModel) {
  "use strict";
  var map = function(item) {
    return new CollaboratorModel({
      id: item.Id,
      email: item.Email,
      registered: item.Registered,
      fullName: item.FullName,
      isAccepted: item.IsAccepted,
      createdOn: new Date(item.CreatedOn)
    });
  };
  return {map: map};
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("synchronization/handlers/collaboration/eventHandlers/collaboratorAdded.js", ["guard.js", "libs/durandal/app.js", "constants.js", "dataContext.js", "mappers/courseModelMapper.js", "mappers/collaboratorModelMapper.js"], function(guard, app, constants, dataContext, courseModelMapper, collaboratorModelMapper) {
  "use strict";
  return function(courseId, user) {
    guard.throwIfNotString(courseId, 'courseId is not a string');
    guard.throwIfNotAnObject(user, 'User is not an object');
    var collaborator = collaboratorModelMapper.map(user);
    var course = _.find(dataContext.courses, function(item) {
      return item.id == courseId;
    });
    guard.throwIfNotAnObject(course, 'Course is not an object');
    if (!_.isNullOrUndefined(course.collaborators)) {
      course.collaborators.push(collaborator);
    }
    app.trigger(constants.messages.course.collaboration.collaboratorAdded + courseId, collaborator);
  };
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("synchronization/handlers/collaboration/eventHandlers/collaboratorRemoved.js", ["guard.js", "libs/durandal/app.js", "constants.js", "dataContext.js"], function(guard, app, constants, dataContext) {
  "use strict";
  return function(courseId, collaboratorEmail) {
    guard.throwIfNotString(courseId, 'courseId is not a string');
    guard.throwIfNotString(collaboratorEmail, 'collaboratorEmail is not a string');
    var course = _.find(dataContext.courses, function(item) {
      return item.id == courseId;
    });
    guard.throwIfNotAnObject(course, 'Course is not an object');
    if (!_.isNullOrUndefined(course.collaborators)) {
      course.collaborators = _.reject(course.collaborators, function(item) {
        return item.email == collaboratorEmail;
      });
    }
    app.trigger(constants.messages.course.collaboration.collaboratorRemoved + courseId, collaboratorEmail);
  };
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("synchronization/handlers/collaboration/eventHandlers/collaboratorRegistered.js", ["guard.js", "libs/durandal/app.js", "constants.js", "dataContext.js"], function(guard, app, constants, dataContext) {
  'use strict';
  return function(email, fullName) {
    guard.throwIfNotString(email, 'email is not a string');
    guard.throwIfNotString(fullName, 'fullName is not a string');
    _.each(dataContext.courses, function(course) {
      if (_.isNullOrUndefined(course.collaborators)) {
        return;
      }
      var registeredCollaborator = _.find(course.collaborators, function(item) {
        return item.email == email;
      });
      if (_.isNullOrUndefined(registeredCollaborator)) {
        return;
      }
      registeredCollaborator.registered = true;
      registeredCollaborator.fullName = fullName;
    });
    app.trigger(constants.messages.course.collaboration.collaboratorRegistered + email, {fullName: fullName});
  };
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("synchronization/handlers/collaboration/eventHandlers/inviteCreated.js", ["guard.js", "libs/durandal/app.js", "constants.js"], function(guard, app, constants) {
  "use strict";
  return function(invite) {
    guard.throwIfNotAnObject(invite, 'Invite is not an object');
    app.trigger(constants.messages.course.collaboration.inviteCreated, invite);
  };
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("synchronization/handlers/collaboration/eventHandlers/inviteRemoved.js", ["guard.js", "libs/durandal/app.js", "constants.js"], function(guard, app, constants) {
  "use strict";
  return function(inviteId) {
    guard.throwIfNotString(inviteId, 'InviteId is not a string');
    app.trigger(constants.messages.course.collaboration.inviteRemoved, inviteId);
  };
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("synchronization/handlers/collaboration/eventHandlers/inviteAccepted.js", ["guard.js", "libs/durandal/app.js", "constants.js", "dataContext.js"], function(guard, app, constants, dataContext) {
  "use strict";
  return function(courseId, collaboratorEmail) {
    guard.throwIfNotString(courseId, 'CourseId is not a string');
    guard.throwIfNotString(collaboratorEmail, 'CollaboratorEmail is not a string');
    var course = _.find(dataContext.courses, function(item) {
      return item.id == courseId;
    });
    guard.throwIfNotAnObject(course, 'Course is not an object');
    if (!_.isNullOrUndefined(course.collaborators)) {
      var collaborator = _.find(course.collaborators, function(item) {
        return item.email == collaboratorEmail;
      });
      guard.throwIfNotAnObject(collaborator, 'Collaborator is not an object');
      collaborator.isAccepted = true;
      app.trigger(constants.messages.course.collaboration.inviteAccepted + collaborator.id);
    }
  };
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("synchronization/handlers/collaboration/eventHandlers/inviteCourseTitleUpdated.js", ["guard.js", "libs/durandal/app.js", "constants.js"], function(guard, app, constants) {
  "use strict";
  return function(courseId, title) {
    guard.throwIfNotString(courseId, 'CourseId is not a string');
    guard.throwIfNotString(title, 'Title is not a string');
    app.trigger(constants.messages.course.collaboration.inviteCourseTitleUpdated + courseId, title);
  };
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("synchronization/handlers/collaboration/handler.js", ["synchronization/handlers/collaboration/eventHandlers/started.js", "synchronization/handlers/collaboration/eventHandlers/finished.js", "synchronization/handlers/collaboration/eventHandlers/collaboratorAdded.js", "synchronization/handlers/collaboration/eventHandlers/collaboratorRemoved.js", "synchronization/handlers/collaboration/eventHandlers/collaboratorRegistered.js", "synchronization/handlers/collaboration/eventHandlers/inviteCreated.js", "synchronization/handlers/collaboration/eventHandlers/inviteRemoved.js", "synchronization/handlers/collaboration/eventHandlers/inviteAccepted.js", "synchronization/handlers/collaboration/eventHandlers/inviteCourseTitleUpdated.js"], function(started, finished, collaboratorAdded, collaboratorRemoved, collaboratorRegistered, inviteCreated, inviteRemoved, inviteAccepted, inviteCourseTitleUpdated) {
  "use strict";
  return {
    started: started,
    finished: finished,
    collaboratorAdded: collaboratorAdded,
    collaboratorRemoved: collaboratorRemoved,
    collaboratorRegistered: collaboratorRegistered,
    inviteCreated: inviteCreated,
    inviteRemoved: inviteRemoved,
    inviteAccepted: inviteAccepted,
    inviteCourseTitleUpdated: inviteCourseTitleUpdated
  };
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("synchronization/listener.js", ["libs/durandal/system.js", "synchronization/handlers/user/handler.js", "synchronization/handlers/course/handler.js", "synchronization/handlers/objective/handler.js", "synchronization/handlers/questions/handler.js", "synchronization/handlers/answer/handler.js", "synchronization/handlers/learningContent/handler.js", "synchronization/handlers/collaboration/handler.js"], function(system, userEventHandler, courseEventHandler, objectiveEventHandler, questionEventHandler, answerEventHandler, learningContentEventHandler, collaborationEventHandler) {
  "use strict";
  return {start: function() {
      var dfd = Q.defer();
      var hub = $.connection.eventHub;
      $.connection.hub.qs = {'access_token': window.auth.getToken('signalr')};
      hub.client = {
        userDowngraded: userEventHandler.downgraded,
        userUpgradedToStarter: userEventHandler.upgradedToStarter,
        userUpgradedToPlus: userEventHandler.upgradedToPlus,
        courseCollaboratorAdded: collaborationEventHandler.collaboratorAdded,
        courseCollaborationStarted: collaborationEventHandler.started,
        collaboratorRegistered: collaborationEventHandler.collaboratorRegistered,
        courseCollaborationFinished: collaborationEventHandler.finished,
        collaboratorRemoved: collaborationEventHandler.collaboratorRemoved,
        collaborationInviteRemoved: collaborationEventHandler.inviteRemoved,
        collaborationInviteCreated: collaborationEventHandler.inviteCreated,
        collaborationInviteAccepted: collaborationEventHandler.inviteAccepted,
        collaborationInviteCourseTitleUpdated: collaborationEventHandler.inviteCourseTitleUpdated,
        courseStateChanged: courseEventHandler.stateChanged,
        courseTitleUpdated: courseEventHandler.titleUpdated,
        courseIntroductionContentUpdated: courseEventHandler.introductionContentUpdated,
        courseTemplateUpdated: courseEventHandler.templateUpdated,
        courseObjectivesReordered: courseEventHandler.objectivesReordered,
        coursePublished: courseEventHandler.published,
        courseDeleted: courseEventHandler.deleted,
        courseObjectiveRelated: courseEventHandler.objectiveRelated,
        courseObjectivesUnrelated: courseEventHandler.objectivesUnrelated,
        courseObjectivesReplaced: courseEventHandler.objectivesReplaced,
        objectiveTitleUpdated: objectiveEventHandler.titleUpdated,
        objectiveImageUrlUpdated: objectiveEventHandler.imageUrlUpdated,
        objectiveQuestionsReordered: objectiveEventHandler.questionsReordered,
        questionCreated: questionEventHandler.question.created,
        questionsDeleted: questionEventHandler.question.deleted,
        questionTitleUpdated: questionEventHandler.question.titleUpdated,
        questionContentUpdated: questionEventHandler.question.contentUpdated,
        questionCorrectFeedbackUpdated: questionEventHandler.question.correctFeedbackUpdated,
        questionIncorrectFeedbackUpdated: questionEventHandler.question.incorrectFeedbackUpdated,
        questionBackgroundChanged: questionEventHandler.question.backgroundChanged,
        learningContentsReordered: questionEventHandler.question.learningContentsReordered,
        fillInTheBlankUpdated: questionEventHandler.fillInTheBlank.updated,
        dragAndDropDropspotCreated: questionEventHandler.dragAndDropText.dropspotCreated,
        dragAndDropDropspotDeleted: questionEventHandler.dragAndDropText.dropspotDeleted,
        dragAndDropDropspotTextChanged: questionEventHandler.dragAndDropText.dropspotTextChanged,
        dragAndDropDropspotPositionChanged: questionEventHandler.dragAndDropText.dropspotPositionChanged,
        textMatchingAnswerCreated: questionEventHandler.textMatching.answerCreated,
        textMatchingAnswerDeleted: questionEventHandler.textMatching.answerDeleted,
        textMatchingAnswerKeyChanged: questionEventHandler.textMatching.answerKeyChanged,
        textMatchingAnswerValueChanged: questionEventHandler.textMatching.answerValueChanged,
        singleSelectImageAnswerCreated: questionEventHandler.singleSelectImage.answerCreated,
        singleSelectImageAnswerDeleted: questionEventHandler.singleSelectImage.answerDeleted,
        singleSelectImageAnswerImageUpdated: questionEventHandler.singleSelectImage.answerImageUpdated,
        singleSelectImageCorrectAnswerChanged: questionEventHandler.singleSelectImage.correctAnswerChanged,
        answerCreated: answerEventHandler.created,
        answerDeleted: answerEventHandler.deleted,
        answerTextUpdated: answerEventHandler.textUpdated,
        answerCorrectnessUpdated: answerEventHandler.answerCorrectnessUpdated,
        learningContentCreated: learningContentEventHandler.created,
        learningContentUpdated: learningContentEventHandler.textUpdated,
        learningContentDeleted: learningContentEventHandler.deleted,
        hotSpotPolygonCreated: questionEventHandler.hotSpot.polygonCreated,
        hotSpotPolygonDeleted: questionEventHandler.hotSpot.polygonDeleted,
        hotSpotPolygonChanged: questionEventHandler.hotSpot.polygonChanged,
        hotSpotIsMultipleChanged: questionEventHandler.hotSpot.isMultipleChanged
      };
      $.connection.hub.disconnected(function() {
        $.ajax({
          type: 'get',
          url: '/ping.ashx'
        }).error(function(error) {
          if (error.status == 503) {
            window.location.reload(true);
          }
        });
      });
      $.connection.hub.start().done(function() {
        system.log("Synchronization with server was established");
        dfd.resolve();
      }).fail(function() {
        dfd.reject('Could not establish synchronization with server');
      });
      return dfd.promise;
    }};
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("onboarding/tasks.js", ["http/apiHttpWrapper.js", "constants.js", "libs/durandal/app.js", "localization/localizationManager.js"], function(apiHttpWrapper, constants, app, localizationManager) {
  "use strict";
  var tasks = [createCourse, defineObjective, addContent, createQuestions, publishCourse];
  return tasks;
  function createCourse(states) {
    var task = {
      isCompleted: ko.observable(states.courseCreated),
      title: localizationManager.localize('createCourseOnboardingTaskTitle'),
      description: localizationManager.localize('createCourseOnboardingTaskDescription'),
      handler: function() {
        return apiHttpWrapper.post('api/onboarding/coursecreated').then(function() {
          app.off(constants.messages.course.created, task.handler);
          task.isCompleted(true);
        });
      }
    };
    if (!task.isCompleted()) {
      app.on(constants.messages.course.created, task.handler);
    }
    return task;
  }
  function defineObjective(states) {
    var task = {
      isCompleted: ko.observable(states.objectiveCreated),
      title: localizationManager.localize('defineObjectiveOnboardingTaskTitle'),
      description: localizationManager.localize('defineObjectiveOnboardingTaskDescription'),
      handler: function() {
        return apiHttpWrapper.post('api/onboarding/objectivecreated').then(function() {
          app.off(constants.messages.objective.createdInCourse, task.handler);
          task.isCompleted(true);
        });
      }
    };
    if (!task.isCompleted()) {
      app.on(constants.messages.objective.createdInCourse, task.handler);
    }
    return task;
  }
  function addContent(states) {
    var task = {
      isCompleted: ko.observable(states.contentCreated),
      title: localizationManager.localize('addContentOnboardingTaskTitle'),
      description: localizationManager.localize('addContentOnboardingTaskDescription'),
      handler: function(objectiveId, createdQuestion) {
        if (createdQuestion.type !== constants.questionType.informationContent.type) {
          return;
        }
        return apiHttpWrapper.post('api/onboarding/contentcreated').then(function() {
          app.off(constants.messages.question.created, task.handler);
          task.isCompleted(true);
        });
      }
    };
    if (!task.isCompleted()) {
      app.on(constants.messages.question.created, task.handler);
    }
    return task;
  }
  function createQuestions(states) {
    var titleTemplate = localizationManager.localize('createQuestionsOnboardingTaskTitle'),
        questionsCountToComplete = 3,
        getCurrentTitle = function(count) {
          return titleTemplate.replace('{0}', count);
        };
    var task = {
      createdQuestionsCount: ko.observable(states.createdQuestionsCount),
      title: ko.observable(getCurrentTitle(states.createdQuestionsCount)),
      description: localizationManager.localize('createQuestionsOnboardingTaskDescription'),
      handler: function(objectiveId, createdQuestion) {
        if (createdQuestion.type === constants.questionType.informationContent.type) {
          return;
        }
        return apiHttpWrapper.post('api/onboarding/questioncreated').then(function() {
          task.createdQuestionsCount(task.createdQuestionsCount() + 1);
          if (task.isCompleted()) {
            app.off(constants.messages.question.created, task.handler);
          }
        });
      }
    };
    task.isCompleted = ko.computed(function() {
      return task.createdQuestionsCount() >= questionsCountToComplete;
    });
    task.createdQuestionsCount.subscribe(function(newValue) {
      if (task.isCompleted()) {
        this.dispose();
      }
      task.title(getCurrentTitle(newValue));
    });
    if (!task.isCompleted()) {
      app.on(constants.messages.question.created, task.handler);
    }
    return task;
  }
  function publishCourse(states) {
    var task = {
      isCompleted: ko.observable(states.coursePublished),
      title: localizationManager.localize('publishOnboardingTaskTitle'),
      description: localizationManager.localize('publishOnboardingTaskDescription'),
      handler: function() {
        return apiHttpWrapper.post('api/onboarding/coursepublished').then(function() {
          app.off(constants.messages.course.delivering.finished, task.handler);
          task.isCompleted(true);
        });
      }
    };
    if (!task.isCompleted()) {
      app.on(constants.messages.course.delivering.finished, task.handler);
    }
    return task;
  }
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("onboarding/initialization.js", ["libs/durandal/app.js", "constants.js", "http/apiHttpWrapper.js", "onboarding/tasks.js"], function(app, constants, apiHttpWrapper, tasks) {
  "use strict";
  var tasksList = [];
  var onboarding = {
    getTasksList: getTasksList,
    isClosed: ko.observable(false),
    closeOnboarding: closeOnboarding,
    closeAllHints: closeAllHints,
    initialize: initialize
  };
  return onboarding;
  function initialize() {
    return apiHttpWrapper.post('api/onboarding').then(function(onboardingStates) {
      onboarding.isClosed(!_.isNullOrUndefined(onboardingStates) ? onboardingStates.isClosed : true);
      if (onboarding.isClosed()) {
        return;
      }
      _.each(tasks, function(taskInitializer) {
        var task = taskInitializer(onboardingStates);
        task.isHintVisible = ko.observable(false);
        task.showHint = function() {
          closeAllHints();
          task.isHintVisible(true);
        };
        task.closeHint = function() {
          task.isHintVisible(false);
        };
        task.markedAsNext = ko.observable(false);
        task.markAsNext = function() {
          _.each(tasksList, function(item) {
            item.markedAsNext(false);
          });
          task.markedAsNext(true);
        };
        task.isCompleted.subscribe(function(newValue) {
          if (newValue) {
            this.dispose();
            openFirstUncompletedTaskHint();
            markFirstUncompletedTaskAsNext();
          }
        });
        tasksList.push(task);
      });
      markFirstUncompletedTaskAsNext();
    });
  }
  function openFirstUncompletedTaskHint() {
    _.every(tasksList, function(task) {
      if (!task.isCompleted()) {
        task.showHint();
        return false;
      }
      return true;
    });
  }
  function markFirstUncompletedTaskAsNext() {
    _.every(tasksList, function(task) {
      if (!task.isCompleted()) {
        task.markAsNext();
        return false;
      }
      return true;
    });
  }
  function closeAllHints() {
    _.each(tasksList, function(task) {
      task.closeHint(task);
    });
  }
  function closeOnboarding() {
    return apiHttpWrapper.post('api/onboarding/close').then(function() {
      onboarding.isClosed(true);
      app.trigger(constants.messages.onboarding.closed);
    });
  }
  function getTasksList() {
    return tasksList;
  }
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("Query.js", [], function() {
  return function Command(func) {
    this.execute = func;
  };
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("audio/queries/getNotAvailable.js", ["Query.js", "dataContext.js"], function(Query, dataContext) {
  return new Query(function() {
    var dfd = Q.defer();
    dfd.resolve(dataContext.audios.filter(function(audio) {
      return !audio.available;
    }));
    return dfd.promise;
  });
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("vimeo/queries/getVideo.js", ["libs/durandal/plugins/http.js", "constants.js"], function(http, constants) {
  return {execute: execute};
  function execute(vimeoId) {
    var dfd = Q.defer();
    if (!_.isString(vimeoId)) {
      dfd.reject('vimeoId is not a string');
    }
    http.get(constants.storage.video.vimeoApiVideosUrl + vimeoId, null, {Authorization: constants.storage.video.vimeoToken}).done(function(result) {
      dfd.resolve(result);
    }).fail(function() {
      dfd.reject();
    });
    return dfd.promise;
  }
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("vimeo/queries/checkAvailability.js", ["Query.js", "vimeo/queries/getVideo.js"], function(Query, getVideo) {
  return new Query(function(obj) {
    return getVideo.execute(obj.vimeoId).then(function(video) {
      return video.status === 'available';
    });
  });
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("Command.js", [], function() {
  return function Command(func) {
    this.execute = func;
  };
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("audio/commands/markAvailable.js", ["Command.js", "constants.js", "http/storageHttpWrapper.js"], function(Command, constants, storageHttpWrapper) {
  'use strict';
  return new Command(function(audio) {
    return storageHttpWrapper.post(constants.storage.host + '/api/media/audio/update', {id: audio.id}).then(function() {
      audio.available = true;
    });
  });
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("audio/convertion/commands/getTicket.js", ["Command.js", "constants.js", "http/storageHttpWrapper.js"], function(Command, constants, storageHttpWrapper) {
  return new Command(function() {
    return storageHttpWrapper.post(constants.storage.host + constants.storage.audio.ticketUrl);
  });
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("audio/convertion/commands/finalize.js", ["Command.js", "libs/durandal/plugins/http.js", "audio/convertion/commands/getTicket.js"], function(Command, http, getTicket) {
  return new Command(function(audio) {
    return getTicket.execute().then(function(ticket) {
      var dfd = Q.defer();
      http.remove(audio.source, null, {ticket: ticket}).done(function() {
        dfd.resolve();
      }).fail(function() {
        dfd.reject();
      });
      return dfd.promise;
    });
  });
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("audio/finishUpload.js", ["constants.js", "audio/commands/markAvailable.js", "audio/convertion/commands/finalize.js"], function(constants, markAvailable, finalize) {
  return {execute: execute};
  function execute(model) {
    return finalize.execute(model).then(function() {
      return markAvailable.execute(model);
    });
  }
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("audio/vimeo/availabilityTracker.js", ["libs/durandal/system.js", "audio/queries/getNotAvailable.js", "vimeo/queries/checkAvailability.js", "audio/finishUpload.js"], function(system, getNotAvailable, checkAvailability, finishUpload) {
  return {track: track};
  function track() {
    return getNotAvailable.execute().then(function(audios) {
      return Q.allSettled(audios.map(function(audio) {
        system.log('Checking audio ' + audio.id);
        return checkAvailability.execute(audio).then(function(result) {
          if (result) {
            return finishUpload.execute(audio);
          }
        });
      }));
    });
  }
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("audio/index.js", ["libs/durandal/system.js", "audio/vimeo/availabilityTracker.js", "constants.js"], function(system, availabilityTracker, constants) {
  return {initialize: initialize};
  function initialize() {
    (function schedule() {
      system.log('Tracking audios..');
      availabilityTracker.track().finally(function() {
        _.delay(schedule, constants.storage.audio.trackerTimeout);
      });
    })();
  }
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("libs/durandal/plugins/dialog.js", ["libs/durandal/system.js", "libs/durandal/app.js", "libs/durandal/composition.js", "libs/durandal/activator.js", "libs/durandal/viewEngine.js", "libs/jquery.js", "libs/knockout.js"], function(system, app, composition, activator, viewEngine, $, ko) {
  var contexts = {},
      dialogCount = ko.observable(0),
      dialog;
  var MessageBox = function(message, title, options, autoclose, settings) {
    this.message = message;
    this.title = title || MessageBox.defaultTitle;
    this.options = options || MessageBox.defaultOptions;
    this.autoclose = autoclose || false;
    this.settings = $.extend({}, MessageBox.defaultSettings, settings);
  };
  MessageBox.prototype.selectOption = function(dialogResult) {
    dialog.close(this, dialogResult);
  };
  MessageBox.prototype.getView = function() {
    return viewEngine.processMarkup(MessageBox.defaultViewMarkup);
  };
  MessageBox.setViewUrl = function(viewUrl) {
    delete MessageBox.prototype.getView;
    MessageBox.prototype.viewUrl = viewUrl;
  };
  MessageBox.defaultTitle = app.title || 'Application';
  MessageBox.defaultOptions = ['Ok'];
  MessageBox.defaultSettings = {
    buttonClass: "btn btn-default",
    primaryButtonClass: "btn-primary autofocus",
    secondaryButtonClass: "",
    "class": "modal-content messageBox",
    style: null
  };
  MessageBox.setDefaults = function(settings) {
    $.extend(MessageBox.defaultSettings, settings);
  };
  MessageBox.prototype.getButtonClass = function($index) {
    var c = "";
    if (this.settings) {
      if (this.settings.buttonClass) {
        c = this.settings.buttonClass;
      }
      if ($index() === 0 && this.settings.primaryButtonClass) {
        if (c.length > 0) {
          c += " ";
        }
        c += this.settings.primaryButtonClass;
      }
      if ($index() > 0 && this.settings.secondaryButtonClass) {
        if (c.length > 0) {
          c += " ";
        }
        c += this.settings.secondaryButtonClass;
      }
    }
    return c;
  };
  MessageBox.prototype.getClass = function() {
    if (this.settings) {
      return this.settings["class"];
    }
    return "messageBox";
  };
  MessageBox.prototype.getStyle = function() {
    if (this.settings) {
      return this.settings.style;
    }
    return null;
  };
  MessageBox.prototype.getButtonText = function(stringOrObject) {
    var t = $.type(stringOrObject);
    if (t === "string") {
      return stringOrObject;
    } else if (t === "object") {
      if ($.type(stringOrObject.text) === "string") {
        return stringOrObject.text;
      } else {
        system.error('The object for a MessageBox button does not have a text property that is a string.');
        return null;
      }
    }
    system.error('Object for a MessageBox button is not a string or object but ' + t + '.');
    return null;
  };
  MessageBox.prototype.getButtonValue = function(stringOrObject) {
    var t = $.type(stringOrObject);
    if (t === "string") {
      return stringOrObject;
    } else if (t === "object") {
      if ($.type(stringOrObject.text) === "undefined") {
        system.error('The object for a MessageBox button does not have a value property defined.');
        return null;
      } else {
        return stringOrObject.value;
      }
    }
    system.error('Object for a MessageBox button is not a string or object but ' + t + '.');
    return null;
  };
  MessageBox.defaultViewMarkup = ['<div data-view="plugins/messageBox" data-bind="css: getClass(), style: getStyle()">', '<div class="modal-header">', '<h3 data-bind="html: title"></h3>', '</div>', '<div class="modal-body">', '<p class="message" data-bind="html: message"></p>', '</div>', '<div class="modal-footer">', '<!-- ko foreach: options -->', '<button data-bind="click: function () { $parent.selectOption($parent.getButtonValue($data)); }, text: $parent.getButtonText($data), css: $parent.getButtonClass($index)"></button>', '<!-- /ko -->', '<div style="clear:both;"></div>', '</div>', '</div>'].join('\n');
  function ensureDialogInstance(objOrModuleId) {
    return system.defer(function(dfd) {
      if (system.isString(objOrModuleId)) {
        system.acquire(objOrModuleId).then(function(module) {
          dfd.resolve(system.resolveObject(module));
        }).fail(function(err) {
          system.error('Failed to load dialog module (' + objOrModuleId + '). Details: ' + err.message);
        });
      } else {
        dfd.resolve(objOrModuleId);
      }
    }).promise();
  }
  dialog = {
    MessageBox: MessageBox,
    currentZIndex: 1050,
    getNextZIndex: function() {
      return ++this.currentZIndex;
    },
    isOpen: ko.computed(function() {
      return dialogCount() > 0;
    }),
    getContext: function(name) {
      return contexts[name || 'default'];
    },
    addContext: function(name, dialogContext) {
      dialogContext.name = name;
      contexts[name] = dialogContext;
      var helperName = 'show' + name.substr(0, 1).toUpperCase() + name.substr(1);
      this[helperName] = function(obj, activationData) {
        return this.show(obj, activationData, name);
      };
    },
    createCompositionSettings: function(obj, dialogContext) {
      var settings = {
        model: obj,
        activate: false,
        transition: false
      };
      if (dialogContext.binding) {
        settings.binding = dialogContext.binding;
      }
      if (dialogContext.attached) {
        settings.attached = dialogContext.attached;
      }
      if (dialogContext.compositionComplete) {
        settings.compositionComplete = dialogContext.compositionComplete;
      }
      return settings;
    },
    getDialog: function(obj) {
      if (obj) {
        return obj.__dialog__;
      }
      return undefined;
    },
    close: function(obj) {
      var theDialog = this.getDialog(obj);
      if (theDialog) {
        var rest = Array.prototype.slice.call(arguments, 1);
        theDialog.close.apply(theDialog, rest);
      }
    },
    show: function(obj, activationData, context) {
      var that = this;
      var dialogContext = contexts[context || 'default'];
      return system.defer(function(dfd) {
        ensureDialogInstance(obj).then(function(instance) {
          var dialogActivator = activator.create();
          dialogActivator.activateItem(instance, activationData).then(function(success) {
            if (success) {
              var theDialog = instance.__dialog__ = {
                owner: instance,
                context: dialogContext,
                activator: dialogActivator,
                close: function() {
                  var args = arguments;
                  dialogActivator.deactivateItem(instance, true).then(function(closeSuccess) {
                    if (closeSuccess) {
                      dialogCount(dialogCount() - 1);
                      dialogContext.removeHost(theDialog);
                      delete instance.__dialog__;
                      if (args.length === 0) {
                        dfd.resolve();
                      } else if (args.length === 1) {
                        dfd.resolve(args[0]);
                      } else {
                        dfd.resolve.apply(dfd, args);
                      }
                    }
                  });
                }
              };
              theDialog.settings = that.createCompositionSettings(instance, dialogContext);
              dialogContext.addHost(theDialog);
              dialogCount(dialogCount() + 1);
              composition.compose(theDialog.host, theDialog.settings);
            } else {
              dfd.resolve(false);
            }
          });
        });
      }).promise();
    },
    showMessage: function(message, title, options, autoclose, settings) {
      if (system.isString(this.MessageBox)) {
        return dialog.show(this.MessageBox, [message, title || MessageBox.defaultTitle, options || MessageBox.defaultOptions, autoclose || false, settings || {}]);
      }
      return dialog.show(new this.MessageBox(message, title, options, autoclose, settings));
    },
    install: function(config) {
      app.showDialog = function(obj, activationData, context) {
        return dialog.show(obj, activationData, context);
      };
      app.closeDialog = function() {
        return dialog.close.apply(dialog, arguments);
      };
      app.showMessage = function(message, title, options, autoclose, settings) {
        return dialog.showMessage(message, title, options, autoclose, settings);
      };
      if (config.messageBox) {
        dialog.MessageBox = config.messageBox;
      }
      if (config.messageBoxView) {
        dialog.MessageBox.prototype.getView = function() {
          return viewEngine.processMarkup(config.messageBoxView);
        };
      }
      if (config.messageBoxViewUrl) {
        dialog.MessageBox.setViewUrl(config.messageBoxViewUrl);
      }
    }
  };
  dialog.addContext('default', {
    blockoutOpacity: 0.2,
    removeDelay: 200,
    addHost: function(theDialog) {
      var body = $('body');
      var blockout = $('<div class="modalBlockout"></div>').css({
        'z-index': dialog.getNextZIndex(),
        'opacity': this.blockoutOpacity
      }).appendTo(body);
      var host = $('<div class="modalHost"></div>').css({'z-index': dialog.getNextZIndex()}).appendTo(body);
      theDialog.host = host.get(0);
      theDialog.blockout = blockout.get(0);
      if (!dialog.isOpen()) {
        theDialog.oldBodyMarginRight = body.css("margin-right");
        theDialog.oldInlineMarginRight = body.get(0).style.marginRight;
        var html = $("html");
        var oldBodyOuterWidth = body.outerWidth(true);
        var oldScrollTop = html.scrollTop();
        $("html").css("overflow-y", "hidden");
        var newBodyOuterWidth = $("body").outerWidth(true);
        body.css("margin-right", (newBodyOuterWidth - oldBodyOuterWidth + parseInt(theDialog.oldBodyMarginRight, 10)) + "px");
        html.scrollTop(oldScrollTop);
      }
    },
    removeHost: function(theDialog) {
      $(theDialog.host).css('opacity', 0);
      $(theDialog.blockout).css('opacity', 0);
      setTimeout(function() {
        ko.removeNode(theDialog.host);
        ko.removeNode(theDialog.blockout);
      }, this.removeDelay);
      if (!dialog.isOpen()) {
        var html = $("html");
        var oldScrollTop = html.scrollTop();
        html.css("overflow-y", "").scrollTop(oldScrollTop);
        if (theDialog.oldInlineMarginRight) {
          $("body").css("margin-right", theDialog.oldBodyMarginRight);
        } else {
          $("body").css("margin-right", '');
        }
      }
    },
    attached: function(view) {
      $(view).css("visibility", "hidden");
    },
    compositionComplete: function(child, parent, context) {
      var theDialog = dialog.getDialog(context.model);
      var $child = $(child);
      var loadables = $child.find("img").filter(function() {
        var $this = $(this);
        return !(this.style.width && this.style.height) && !($this.attr("width") && $this.attr("height"));
      });
      $child.data("predefinedWidth", $child.get(0).style.width);
      var setDialogPosition = function(childView, objDialog) {
        setTimeout(function() {
          var $childView = $(childView);
          objDialog.context.reposition(childView);
          $(objDialog.host).css('opacity', 1);
          $childView.css("visibility", "visible");
          $childView.find('.autofocus').first().focus();
        }, 1);
      };
      setDialogPosition(child, theDialog);
      loadables.load(function() {
        setDialogPosition(child, theDialog);
      });
      if ($child.hasClass('autoclose') || context.model.autoclose) {
        $(theDialog.blockout).click(function() {
          theDialog.close();
        });
      }
    },
    reposition: function(view) {
      var $view = $(view),
          $window = $(window);
      if (!$view.data("predefinedWidth")) {
        $view.css({width: ''});
      }
      var width = $view.outerWidth(false),
          height = $view.outerHeight(false),
          windowHeight = $window.height() - 10,
          windowWidth = $window.width() - 10,
          constrainedHeight = Math.min(height, windowHeight),
          constrainedWidth = Math.min(width, windowWidth);
      $view.css({
        'margin-top': (-constrainedHeight / 2).toString() + 'px',
        'margin-left': (-constrainedWidth / 2).toString() + 'px'
      });
      if (height > windowHeight) {
        $view.css("overflow-y", "auto").outerHeight(windowHeight);
      } else {
        $view.css({
          "overflow-y": "",
          "height": ""
        });
      }
      if (width > windowWidth) {
        $view.css("overflow-x", "auto").outerWidth(windowWidth);
      } else {
        $view.css("overflow-x", "");
        if (!$view.data("predefinedWidth")) {
          $view.outerWidth(constrainedWidth);
        } else {
          $view.css("width", $view.data("predefinedWidth"));
        }
      }
    }
  });
  return dialog;
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("libs/durandal/plugins/widget.js", ["libs/durandal/system.js", "libs/durandal/composition.js", "libs/jquery.js", "libs/knockout.js"], function(system, composition, $, ko) {
  var kindModuleMaps = {},
      kindViewMaps = {},
      bindableSettings = ['model', 'view', 'kind'],
      widgetDataKey = 'durandal-widget-data';
  function extractParts(element, settings) {
    var data = ko.utils.domData.get(element, widgetDataKey);
    if (!data) {
      data = {parts: composition.cloneNodes(ko.virtualElements.childNodes(element))};
      ko.virtualElements.emptyNode(element);
      ko.utils.domData.set(element, widgetDataKey, data);
    }
    settings.parts = data.parts;
  }
  var widget = {
    getSettings: function(valueAccessor) {
      var settings = ko.utils.unwrapObservable(valueAccessor()) || {};
      if (system.isString(settings)) {
        return {kind: settings};
      }
      for (var attrName in settings) {
        if (ko.utils.arrayIndexOf(bindableSettings, attrName) != -1) {
          settings[attrName] = ko.utils.unwrapObservable(settings[attrName]);
        } else {
          settings[attrName] = settings[attrName];
        }
      }
      return settings;
    },
    registerKind: function(kind) {
      ko.bindingHandlers[kind] = {
        init: function() {
          return {controlsDescendantBindings: true};
        },
        update: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
          var settings = widget.getSettings(valueAccessor);
          settings.kind = kind;
          extractParts(element, settings);
          widget.create(element, settings, bindingContext, true);
        }
      };
      ko.virtualElements.allowedBindings[kind] = true;
      composition.composeBindings.push(kind + ':');
    },
    mapKind: function(kind, viewId, moduleId) {
      if (viewId) {
        kindViewMaps[kind] = viewId;
      }
      if (moduleId) {
        kindModuleMaps[kind] = moduleId;
      }
    },
    mapKindToModuleId: function(kind) {
      return kindModuleMaps[kind] || widget.convertKindToModulePath(kind);
    },
    convertKindToModulePath: function(kind) {
      return 'widgets/' + kind + '/viewmodel';
    },
    mapKindToViewId: function(kind) {
      return kindViewMaps[kind] || widget.convertKindToViewPath(kind);
    },
    convertKindToViewPath: function(kind) {
      return 'widgets/' + kind + '/view';
    },
    createCompositionSettings: function(element, settings) {
      if (!settings.model) {
        settings.model = this.mapKindToModuleId(settings.kind);
      }
      if (!settings.view) {
        settings.view = this.mapKindToViewId(settings.kind);
      }
      settings.preserveContext = true;
      settings.activate = true;
      settings.activationData = settings;
      settings.mode = 'templated';
      return settings;
    },
    create: function(element, settings, bindingContext, fromBinding) {
      if (!fromBinding) {
        settings = widget.getSettings(function() {
          return settings;
        }, element);
      }
      var compositionSettings = widget.createCompositionSettings(element, settings);
      composition.compose(element, compositionSettings, bindingContext);
    },
    install: function(config) {
      config.bindingName = config.bindingName || 'widget';
      if (config.kinds) {
        var toRegister = config.kinds;
        for (var i = 0; i < toRegister.length; i++) {
          widget.registerKind(toRegister[i]);
        }
      }
      ko.bindingHandlers[config.bindingName] = {
        init: function() {
          return {controlsDescendantBindings: true};
        },
        update: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
          var settings = widget.getSettings(valueAccessor);
          extractParts(element, settings);
          widget.create(element, settings, bindingContext, true);
        }
      };
      composition.composeBindings.push(config.bindingName + ':');
      ko.virtualElements.allowedBindings[config.bindingName] = true;
    }
  };
  return widget;
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("main.js", ["libs/durandal/system.js", "libs/durandal/app.js", "bootstrapper.js", "userContext.js", "synchronization/listener.js", "onboarding/initialization.js", "audio/index.js", "libs/durandal/plugins/router.js", "libs/durandal/plugins/dialog.js", "libs/durandal/plugins/http.js", "libs/durandal/plugins/widget.js"], function(system, app, bootstrapper, userContext, synchronization, onboarding, audio) {
  if (!has('release')) {
    system.debug(true);
  }
  app.title = "easygenerator";
  app.configurePlugins({
    router: true,
    dialog: true,
    http: true,
    widget: true
  });
  var ltiAuthDefer;
  if (window.auth.isLogoutKeyPresentInHash()) {
    window.auth.logout();
    window.location.replace('/#');
  }
  if (window.auth.isAuthTokenPresentInHash()) {
    window.auth.logout();
    ltiAuthDefer = window.auth.loginByAuthToken().then(function() {
      window.location.replace('/#');
    });
  } else {
    ltiAuthDefer = Q.fcall(function() {});
  }
  ltiAuthDefer.then(function() {
    console.log('pre app.start');
    app.start().then(function() {
      console.log('pre bootstrapper.run');
      bootstrapper.run();
      console.log('after bootstrapper.run');
      return Q.all([userContext.identify(), userContext.identifyStoragePermissions(), synchronization.start(), onboarding.initialize(), audio.initialize()]).spread(function() {
        console.log('app.setRoot called');
        debugger;
        app.setRoot('viewmodels/shell', null, document.getElementById('app'));
      });
    }).done();
  });
});

_removeDefine();
})();
System.register("index.js", ["libs/durandal/viewEngine.js", "libs/durandal/system.js", "libs/jquery.js", "libs/durandal/viewLocator.js", "main.js"], function($__export) {
  "use strict";
  var __moduleName = "index.js";
  var viewEngine,
      system,
      moduleIds,
      systemNormalize,
      systemImport,
      systemReduceRegister,
      $,
      viewLocator;
  var $__exportNames = {};
  return {
    setters: [function($__m) {
      viewEngine = $__m.default;
    }, function($__m) {
      system = $__m.default;
    }, function($__m) {
      $ = $__m.default;
    }, function($__m) {
      viewLocator = $__m.default;
    }, function($__m) {
      var exportObj = Object.create(null);
      Object.keys($__m).forEach(function(p) {
        if (p !== 'default' && !$__exportNames[p])
          exportObj[p] = $__m[p];
      });
      $__export(exportObj);
    }],
    execute: function() {
      debugger;
      viewEngine.convertViewIdToRequirePath = function(viewId) {
        var plugin = this.viewPlugin ? '!' + this.viewPlugin : '';
        return viewId + this.viewExtension + plugin;
      };
      moduleIds = [];
      systemNormalize = System.normalize;
      System.normalize = function(moduleName) {
        return systemNormalize.apply(this, arguments).then(function(normalizedName) {
          moduleIds[normalizedName] = moduleName;
          return normalizedName;
        });
      };
      systemImport = System.import;
      System.import = function(moduleName) {
        return systemImport.apply(this, arguments).then(function(module) {
          system.setModuleId(module, moduleName);
          return module;
        });
      };
      systemReduceRegister = System.reduceRegister_;
      System.reduceRegister_ = function(metadata, module) {
        if (moduleIds[metadata.address]) {
          var defaultExecute = module.entry.execute;
          module.entry.execute = function() {
            var module = defaultExecute.apply(this, arguments);
            system.setModuleId(module, moduleIds[metadata.address]);
            return module;
          };
        }
        return systemReduceRegister.apply(this, arguments);
      };
      window.define = System.amdDefine;
      window.require = window.requirejs = System.amdRequire;
    }
  };
});
