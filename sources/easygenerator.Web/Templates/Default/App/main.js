﻿requirejs.config({
    paths: {
        'text': 'durandal/amd/text'
    },
    urlArgs: 'v=' + Math.random()
});

ko.bindingHandlers.context = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
        viewModel.__context__ = element.getContext('2d');
    },
    update: function (element, valueAccessor, allBindingsAccessor, viewModel) {
        var callback = ko.utils.unwrapObservable(allBindingsAccessor().contextCallback);
        callback.call(viewModel, viewModel.__context__);
    }
};

define(['durandal/app', 'durandal/viewLocator', 'durandal/system'],
    function (app, viewLocator, system) {

        //>>excludeStart("build", true);
        system.debug(true);
        //>>excludeEnd("build");

        app.title = 'easygenerator';

        app.start().then(function () {

            viewLocator.useConvention();

            var ie = (function () {

                var undef,
                    v = 3,
                    div = document.createElement('div'),
                    all = div.getElementsByTagName('i');

                while (
                    div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',
                    all[0]
                );

                return v > 4 ? v : undef;

            }());

            app.setRoot(ie < 9 ? 'viewmodels/notsupportedbrowser' : 'viewmodels/shell');
        });
    });