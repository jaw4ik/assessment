define(function () {

    "use strict";

    var uiLockViewer = function () { };

    uiLockViewer.prototype.visible = ko.observable(false);

    uiLockViewer.lock = function () {
        this.prototype.visible(true);
    };
    
    uiLockViewer.unlock = function () {
        this.prototype.visible(false);
    };

    return uiLockViewer;

});