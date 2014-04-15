define(['durandal/composition'], function (composition) {
    "use strict";

    var task = {
        execute: execute
    };

    return task;

    function execute() {
        composition.addBindingHandler('autofocus');
        composition.addBindingHandler('scrollToElement');
        composition.addBindingHandler('placeholder');
        composition.addBindingHandler('dialog');
        composition.addBindingHandler('ckeditor');
    }
})