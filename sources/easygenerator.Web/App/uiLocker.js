define(['widgets/uiLockViewer/viewmodel'], function (uiLockViewer) {

    "use strict";

    var 
        lock = function () {
            uiLockViewer.lock();
        },
        
        unlock = function() {
            uiLockViewer.unlock();
        };

    return {
        lock: lock,
        unlock: unlock
    };

});