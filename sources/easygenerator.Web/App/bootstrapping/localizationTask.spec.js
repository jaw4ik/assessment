define(['bootstrapping/localizationTask'], function (task) {
    "use strict";

    var localizationManager = require('localization/localizationManager');

    describe('task [localizationTask]', function () {

        describe('execute:', function () {

            beforeEach(function() {
                spyOn(localizationManager, 'initialize');
            });

            it('should initialize localizationManager', function () {
                task.execute();

                expect(localizationManager.initialize).toHaveBeenCalled();
            });

        });

    });

});