define(['dialogs/moveCopyQuestion/moveCopyQuestion'], function (moveCopyQuestionDialog) {
    'use strict';

    var
        router = require('plugins/router'),
        eventTracker = require('eventTracker');

    describe('moveCopyQuestionDialog', function () {

        describe('show', function() {

            it('should be function', function() {
                expect(moveCopyQuestionDialog.show).toBeFunction();
            });

        });

    });
});