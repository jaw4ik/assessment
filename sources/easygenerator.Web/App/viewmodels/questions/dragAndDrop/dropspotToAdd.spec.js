﻿define(['viewmodels/questions/dragAndDrop/dropspotToAdd'], function (dropspotToAdd) {

    describe('[dropspotToAdd]', function () {

        it('should be observable', function () {
            expect(dropspotToAdd).toBeObservable();
        });

        describe('isVisible:', function () {

            it('should be observable', function () {
                expect(dropspotToAdd.isVisible).toBeObservable();
            });

        });

        describe('show:', function () {

            it('should be function', function () {
                expect(dropspotToAdd.show).toBeFunction();
            });

            it('should change isVisible to true', function () {
                dropspotToAdd.isVisible(false);
                dropspotToAdd.show();

                expect(dropspotToAdd.isVisible()).toBeTruthy();
            });

        });

        describe('hide:', function () {

            it('should be function', function () {
                expect(dropspotToAdd.hide).toBeFunction();
            });

            it('should change isVisible to false', function () {
                dropspotToAdd.isVisible(true);
                dropspotToAdd.hide();

                expect(dropspotToAdd.isVisible()).toBeFalsy();
            });

        });

        describe('clear:', function () {

            it('should be function', function () {
                expect(dropspotToAdd.clear).toBeFunction();
            });

            it('should clear dropspotToAdd text', function () {
                dropspotToAdd("dropspot");
                dropspotToAdd.clear();

                expect(dropspotToAdd()).toBeUndefined();
            });

        });

        describe('isValid:', function () {

            describe('when text is undefined', function () {

                it('should be false', function () {
                    dropspotToAdd(undefined);
                    expect(dropspotToAdd.isValid()).toBeFalsy();
                });

            });

            describe('when text is null', function () {

                it('should be false', function () {
                    dropspotToAdd(null);
                    expect(dropspotToAdd.isValid()).toBeFalsy();
                });

            });

            describe('when text is empty', function () {

                it('should be false', function () {
                    dropspotToAdd("");
                    expect(dropspotToAdd.isValid()).toBeFalsy();
                });

            });

            describe('when text is whitespace', function () {

                it('should be false', function () {
                    dropspotToAdd("    ");
                    expect(dropspotToAdd.isValid()).toBeFalsy();
                });

            });

        });

    });


})