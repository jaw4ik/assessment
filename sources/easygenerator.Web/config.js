System.config({
  defaultJSExtensions: true,
  transpiler: "babel",
  babelOptions: {
    "compact": false,
    "optional": [
      "optimisation.modules.system",
      "runtime"
    ]
  },
  paths: {
    "*": "app/*",
    "github:*": "Scripts/vendor/github/*",
    "npm:*": "Scripts/vendor/npm/*"
  },

  map: {
    "babel": "npm:babel-core@5.8.38",
    "babel-runtime": "npm:babel-runtime@5.8.38",
    "core-js": "npm:core-js@1.2.6",
    "css": "github:systemjs/plugin-css@0.1.21",
    "dragula": "github:jaw4ik/dragula@3.5.5",
    "durandal": "core/durandal",
    "has": "npm:has@1.0.1",
    "jquery": "core/jquery",
    "knockout": "core/knockout",
    "moment": "npm:moment@2.13.0",
    "perfect-scrollbar": "npm:perfect-scrollbar@0.6.10",
    "plugins": "core/durandal/plugins",
    "spectrum-colorpicker": "npm:spectrum-colorpicker@1.7.1",
    "text": "github:systemjs/plugin-text@0.0.3",
    "transitions": "core/durandal/transitions",
    "underscore": "npm:underscore@1.8.3",
    "velocity-animate": "npm:velocity-animate@1.2.3",
    "webfont": "github:components/webfontloader@1.6.3",
    "github:jaw4ik/dragula@3.5.5": {
      "contra": "npm:contra@1.9.1",
      "crossvent": "npm:crossvent@1.5.4"
    },
    "github:jspm/nodelibs-assert@0.1.0": {
      "assert": "npm:assert@1.3.0"
    },
    "github:jspm/nodelibs-path@0.1.0": {
      "path-browserify": "npm:path-browserify@0.0.0"
    },
    "github:jspm/nodelibs-process@0.1.2": {
      "process": "npm:process@0.11.2"
    },
    "github:jspm/nodelibs-util@0.1.0": {
      "util": "npm:util@0.10.3"
    },
    "npm:assert@1.3.0": {
      "util": "npm:util@0.10.3"
    },
    "npm:babel-runtime@5.8.38": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:contra@1.9.1": {
      "atoa": "npm:atoa@1.0.0",
      "ticky": "npm:ticky@1.0.0"
    },
    "npm:core-js@1.2.6": {
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "systemjs-json": "github:systemjs/plugin-json@0.1.0"
    },
    "npm:crossvent@1.5.4": {
      "child_process": "github:jspm/nodelibs-child_process@0.1.0",
      "custom-event": "npm:custom-event@1.0.0",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "systemjs-json": "github:systemjs/plugin-json@0.1.0"
    },
    "npm:has@1.0.1": {
      "function-bind": "npm:function-bind@1.1.0"
    },
    "npm:inherits@2.0.1": {
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:path-browserify@0.0.0": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:process@0.11.2": {
      "assert": "github:jspm/nodelibs-assert@0.1.0"
    },
    "npm:spectrum-colorpicker@1.7.1": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:ticky@1.0.0": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:util@0.10.3": {
      "inherits": "npm:inherits@2.0.1",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:velocity-animate@1.2.3": {
      "jquery": "npm:jquery@2.2.3",
      "process": "github:jspm/nodelibs-process@0.1.2"
    }
  }
});
