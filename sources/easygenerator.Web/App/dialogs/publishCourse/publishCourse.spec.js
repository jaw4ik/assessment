define(['dialogs/publishCourse/publishCourse'], function (viewModel) {

    "use strict";

    var eventTracker = require('eventTracker'),
        constants = require('constants'),
        publishAction = require('viewmodels/courses/publishingActions/publish')
    ;

    describe('dialog [publishCourse]', function () {
        publishAction = publishAction();		
        viewModel.publishAction = publishAction;

        beforeEach(function () {
            spyOn(eventTracker, 'publish');
        });

        it('should be defined', function () {
            expect(viewModel).toBeDefined();
        });

        describe('isShown:', function () {
            it('should be observable', function () {
                expect(viewModel.isShown).toBeObservable();
            });
        });

        describe('publishAction:', function () {
            it('should be defined', function () {
                expect(viewModel.publishAction).toBeDefined();
            });
        });

        describe('show:', function () {
            var courseId = 'courseId';

            beforeEach(function () {
                spyOn(publishAction, 'activate');
            });

            it('should be function', function () {
                expect(viewModel.show).toBeFunction();
            });

            it('should set isShown to true', function () {
                viewModel.isShown(false);
                viewModel.show(courseId);
                expect(viewModel.isShown()).toBeTruthy();
            });

            it('should activate publishAction', function () {
                viewModel.show(courseId);
                expect(viewModel.publishAction.activate).toHaveBeenCalledWith(courseId);
            });
        });

        describe('hide:', function () {

            beforeEach(function () {
                spyOn(publishAction, 'deactivate');
            });

            it('should be function', function () {
                expect(viewModel.hide).toBeFunction();
            });

            it('should set isShown to false', function () {
                viewModel.isShown(true);
                viewModel.hide();
                expect(viewModel.isShown()).toBeFalsy();
            });

            it('should deactivate publishAction', function () {
                viewModel.hide();
                expect(viewModel.publishAction.deactivate).toHaveBeenCalled();
            });
        });

        describe('embedTabOpened:', function () {

            it('should be observable', function () {
                expect(viewModel.embedTabOpened).toBeObservable();
            });

        });

        describe('linkTabOpened', function () {

            it('should be observable', function () {
                expect(viewModel.linkTabOpened).toBeObservable();
            });

        });

        describe('openEmbedTab:', function () {

            it('should be function', function () {
                expect(viewModel.openEmbedTab).toBeFunction();
            });

            describe('when embed tab not opened', function () {

                beforeEach(function () {
                    viewModel.embedTabOpened(false);
                });

                it('should send event \'Open embed tab\'', function () {
                    viewModel.openEmbedTab();
                    expect(eventTracker.publish).toHaveBeenCalledWith('Open embed tab', constants.eventCategories.header);
                });

                it('should close link tab', function () {
                    viewModel.linkTabOpened(true);
                    viewModel.openEmbedTab();
                    expect(viewModel.linkTabOpened()).toBeFalsy();
                });

                it('should open embed tab', function () {
                    viewModel.linkTabOpened(true);
                    viewModel.openEmbedTab();
                    expect(viewModel.embedTabOpened()).toBeTruthy();
                });

            });

        });

        describe('openLinkTab:', function () {

            it('should be function', function () {
                expect(viewModel.openLinkTab).toBeFunction();
            });

            describe('when embed tab not opened', function () {

                beforeEach(function () {
                    viewModel.linkTabOpened(false);
                });

                it('should send event \'Open link tab\'', function () {
                    viewModel.openLinkTab();
                    expect(eventTracker.publish).toHaveBeenCalledWith('Open link tab', constants.eventCategories.header);
                });

                it('should open link tab', function () {
                    viewModel.embedTabOpened(true);
                    viewModel.openLinkTab();
                    expect(viewModel.linkTabOpened()).toBeTruthy();
                });

                it('should close embed tab', function () {
                    viewModel.embedTabOpened(true);
                    viewModel.openLinkTab();
                    expect(viewModel.embedTabOpened()).toBeFalsy();
                });

            });
        });

    });

});