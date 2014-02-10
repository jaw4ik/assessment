define(['durandal/composition'], function (composition) {

    return {
        execute: function () {
            composition.addBindingHandler('autofocus');
            composition.addBindingHandler('scrollToElement');
            composition.addBindingHandler('placeholder');
        }
    };

})