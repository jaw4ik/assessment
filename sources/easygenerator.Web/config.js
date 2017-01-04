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

  meta: {
    "npm:jquery*jquery.js": {
      "format": "cjs"
    }
  },

  map: {
    "babel": "npm:babel-core@5.8.38",
    "babel-runtime": "npm:babel-runtime@5.8.38",
    "clipboard": "npm:clipboard@1.5.15",
    "core-js": "npm:core-js@2.4.1",
    "css": "github:systemjs/plugin-css@0.1.32",
    "dragula": "npm:dragula@3.7.2",
    "durandal": "core/durandal",
    "font-awesome": "npm:font-awesome@4.7.0",
    "froala-editor": "npm:froala-editor@2.4.0",
    "guillotine": "npm:guillotine@1.3.1",
    "has": "npm:has@1.0.1",
    "jquery": "core/jquery",
    "jquery.guillotine": "npm:jquery.guillotine@1.4.3",
    "json": "github:systemjs/plugin-json@0.1.2",
    "knockout": "core/knockout",
    "moment": "npm:moment@2.15.1",
    "perfect-scrollbar": "npm:perfect-scrollbar@0.6.12",
    "plugins": "core/durandal/plugins",
    "spectrum-colorpicker": "npm:spectrum-colorpicker@1.7.1",
    "text": "github:systemjs/plugin-text@0.0.3",
    "transitions": "core/durandal/transitions",
    "underscore": "core/underscore",
    "velocity-animate": "npm:velocity-animate@1.2.3",
    "webfont": "github:components/webfontloader@1.6.3",
    "github:jspm/nodelibs-assert@0.1.0": {
      "assert": "npm:assert@1.4.1"
    },
    "github:jspm/nodelibs-buffer@0.1.0": {
      "buffer": "npm:buffer@3.6.0"
    },
    "github:jspm/nodelibs-path@0.1.0": {
      "path-browserify": "npm:path-browserify@0.0.0"
    },
    "github:jspm/nodelibs-process@0.1.2": {
      "process": "npm:process@0.11.9"
    },
    "github:jspm/nodelibs-util@0.1.0": {
      "util": "npm:util@0.10.3"
    },
    "github:jspm/nodelibs-vm@0.1.0": {
      "vm-browserify": "npm:vm-browserify@0.0.4"
    },
    "npm:assert@1.4.1": {
      "assert": "github:jspm/nodelibs-assert@0.1.0",
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "util": "npm:util@0.10.3"
    },
    "npm:babel-runtime@5.8.38": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:buffer@3.6.0": {
      "base64-js": "npm:base64-js@0.0.8",
      "child_process": "github:jspm/nodelibs-child_process@0.1.0",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "ieee754": "npm:ieee754@1.1.8",
      "isarray": "npm:isarray@1.0.0",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:clipboard@1.5.15": {
      "good-listener": "npm:good-listener@1.2.0",
      "select": "npm:select@1.1.0",
      "tiny-emitter": "npm:tiny-emitter@1.1.0"
    },
    "npm:contra@1.9.4": {
      "atoa": "npm:atoa@1.0.0",
      "ticky": "npm:ticky@1.0.1"
    },
    "npm:core-js@2.4.1": {
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "systemjs-json": "github:systemjs/plugin-json@0.1.2"
    },
    "npm:crossvent@1.5.4": {
      "child_process": "github:jspm/nodelibs-child_process@0.1.0",
      "custom-event": "npm:custom-event@1.0.0",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "systemjs-json": "github:systemjs/plugin-json@0.1.2"
    },
    "npm:dragula@3.7.2": {
      "contra": "npm:contra@1.9.4",
      "crossvent": "npm:crossvent@1.5.4"
    },
    "npm:font-awesome@4.7.0": {
      "css": "github:systemjs/plugin-css@0.1.32"
    },
    "npm:froala-editor@2.4.0": {
      "font-awesome": "npm:font-awesome@4.7.0",
      "jquery": "npm:jquery@3.1.1"
    },
    "npm:good-listener@1.2.0": {
      "delegate": "npm:delegate@3.1.0"
    },
    "npm:guillotine@1.3.1": {
      "jquery": "npm:jquery@3.1.1"
    },
    "npm:has@1.0.1": {
      "function-bind": "npm:function-bind@1.1.0"
    },
    "npm:inherits@2.0.1": {
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:jquery.guillotine@1.4.3": {
      "jquery": "npm:jquery@3.1.1"
    },
    "npm:path-browserify@0.0.0": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:process@0.11.9": {
      "assert": "github:jspm/nodelibs-assert@0.1.0",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "vm": "github:jspm/nodelibs-vm@0.1.0"
    },
    "npm:spectrum-colorpicker@1.7.1": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:ticky@1.0.1": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:util@0.10.3": {
      "inherits": "npm:inherits@2.0.1",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:velocity-animate@1.2.3": {
      "jquery": "npm:jquery@3.1.1",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:vm-browserify@0.0.4": {
      "indexof": "npm:indexof@0.0.1"
    }
  }
});
