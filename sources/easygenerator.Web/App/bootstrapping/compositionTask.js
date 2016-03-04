define(['durandal/composition'], function(composition) {
    "use strict";

    var task = {
        execute: execute
    };

    return task;

    function execute() {
        composition.addBindingHandler('autofocus');
        composition.addBindingHandler('scrollToElement');
        composition.addBindingHandler('highlightSection');
        composition.addBindingHandler('dialog');
        composition.addBindingHandler('ckeditor');
        composition.addBindingHandler('editableText');
        composition.addBindingHandler('autosize');
        composition.addBindingHandler('introAnimate');
        composition.addBindingHandler('expandableBlock');
        composition.addBindingHandler('tabs');
        composition.addBindingHandler('dialogBindingHandler');
        composition.addBindingHandler('dialogWizardBindingHandler');
    }

});