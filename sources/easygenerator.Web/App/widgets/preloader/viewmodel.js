define(function () {
    "use strict";

    var defaults = {
        type: 'pulsar'
    };

    var viewmodel = {
        type: '',
        settings: '',
        styles: '',

        activate: activate
    };

    return viewmodel;

    function activate(settings) {
        viewmodel.type = settings.type || defaults.type;
        viewmodel.settings = settings.settings;
        viewmodel.styles = settings.styles;
    }

    /*
    PRELOADER TYPES:

    [pulsar]

        settings:

        position:
            {align-center} - aligning preloader to center horizontally

        color:
            {black} - black color
            {white} - white color
            {grey} - grey color

    ----------------------------------------------------------------

    [circular]

        settings:

        position:
            {align-center} - aligning preloader to center horizontally

        color:
            {black} - black color
            {white} - white color
            {grey} - grey color
            {orange} - orange color

        size:
            {small} = size 16 x 16 px.
            {big} = size 32 x 32 px.

    */

});