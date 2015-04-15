define(['dialogs/publishCourse/publishCourse'], function (viewModel) {

    "use strict";

    var repository = require('repositories/courseRepository'),
        eventTracker = require('eventTracker'),
        constants = require('constants'),
        Course = require('models/course');

    describe('dialog [publishCourse]', function () {

        beforeEach(function() {
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
            it('should be observable', function () {
                expect(viewModel.publishAction).toBeObservable();
            });
        });

        describe('show:', function () {

            var getCourse,
                courseId = 'courseId';

            beforeEach(function () {
                getCourse = Q.defer();
                spyOn(repository, 'getById').and.returnValue(getCourse.promise);
            });

            it('should be function', function () {
                expect(viewModel.show).toBeFunction();
            });

            describe('and when course is received', function () {

                beforeEach(function () {
                    getCourse.resolve(new Course({ id: courseId }));
                });

                it('should set isShown to true', function (done) {
                    viewModel.isShown(false);
                    viewModel.show(courseId).fin(function () {
                        expect(viewModel.isShown()).toBeTruthy();
                        done();
                    });
                });

                it('should define publishAction', function (done) {
                    viewModel.publishAction(null);

                    viewModel.show(courseId).fin(function () {
                        expect(viewModel.publishAction()).toBeDefined();
                        done();
                    });
                });
            });
        });

        describe('hide:', function () {

            it('should be function', function () {
                expect(viewModel.hide).toBeFunction();
            });

            it('should set isShown to false', function () {
                viewModel.isShown(true);
                viewModel.hide();
                expect(viewModel.isShown()).toBeFalsy();
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