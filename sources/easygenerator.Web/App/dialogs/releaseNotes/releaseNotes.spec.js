define(['dialogs/releaseNotes/releaseNotes'], function (dialog) {
    'use strict';

    var dialogWidget = require('widgets/dialog/viewmodel'),
        constants = require('constants'),
        getReleaseNoteCommand = require('dialogs/releaseNotes/commands/getReleaseNote'),
        updateLastReadReleaseNote = require('dialogs/releaseNotes/commands/updateLastReadReleaseNote'),
        localizationManager = require('localization/localizationManager');

    describe('dialog [releaseNotes]', function () {
        var dfd = Q.defer();

        describe('show', function () {

            it('should be function', function () {
                expect(dialog.show).toBeFunction();
            });



        });

        describe('submit', function () {

            it('should be function', function () {
                expect(dialog.submit).toBeFunction();
            });

            it('should close dialogWidget', function () {
                spyOn(dialogWidget, 'close');
                dialog.submit();
                expect(dialogWidget.close).toHaveBeenCalled();
            })

        });

        describe('closed', function () {

            beforeEach(function () {
                spyOn(updateLastReadReleaseNote, 'execute').and.returnValue(dfd.promise);
                spyOn(dialogWidget, 'off');
            });

            it('should be function', function () {
                expect(dialog.closed).toBeFunction();
            });

            describe('when callbackAfterClose is function', function () {
                
                beforeEach(function () {
                    spyOn(dialog, 'callbackAfterClose');
                });

                it('should call callback', function () {
                    dialog.closed();
                    expect(dialog.callbackAfterClose).toHaveBeenCalled();
                });

            });

            it('should update last read release note for user', function () {
                dialog.closed();
                expect(updateLastReadReleaseNote.execute).toHaveBeenCalled();
            });

            it('should unsubscribe event dialog close', function () {
                dialog.closed();
                expect(dialogWidget.off).toHaveBeenCalled();
            });

        });

        describe('callbackAfterClose', function () {

            it('should be defined', function () {
                expect(dialog.callbackAfterClose).toBeDefined();
            })

        });

        describe('releaseNotes', function () {

            it('should be observable', function () {
                expect(dialog.releaseNotes).toBeObservable();
            })

        });

    });
});