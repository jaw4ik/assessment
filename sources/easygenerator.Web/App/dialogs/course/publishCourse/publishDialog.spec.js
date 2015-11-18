define(['dialogs/course/publishCourse/publishDialog'], function (viewModel) {

    var userContext = require('userContext'),
        defaultPublishModel = require('dialogs/course/publishCourse/defaultPublish'),
        customPublishModel = require('dialogs/course/publishCourse/customPublish');

    describe('dialog [publishDialog]', function () {
        
        it('should be object', function() {
            expect(viewModel).toBeObject();
        });

        describe('courseId:', function() {
            it('should be defined', function() {
                expect(viewModel.courseId).toBeDefined();
            });
        });

        describe('publishModel:', function() {
            it('should be defined', function() {
                expect(viewModel.publishModel).toBeDefined();
            });
        });

        describe('isShown:', function() {
            it('should be defined', function() {
                expect(viewModel.isShown).toBeObservable();
            });
        });

        describe('show:', function() {
            it('should be function', function() {
                expect(viewModel.show).toBeFunction();
            });

            it('should show dilog', function() {
                viewModel.isShown(null);
                viewModel.show();
                expect(viewModel.isShown()).toBeTruthy();
            });
        });

        describe('hide:', function() {
            it('should be function', function() {
                expect(viewModel.hide).toBeFunction();
            });

            it('should hide dilog', function () {
                viewModel.isShown(null);
                viewModel.hide();
                expect(viewModel.isShown()).toBeFalsy();
            });
        });

        describe('activate:', function () {
            beforeEach(function () {
                userContext.identity = {};
            });

            it('should be function', function() {
                expect(viewModel.activate).toBeFunction();
            });

            it('should set courseId', function() {
                var courseId = 'courseId';
                viewModel.courseId = null;
                viewModel.activate(courseId);
                expect(viewModel.courseId).toBe(courseId);
            });

            describe('when user doesn\' have company', function() {
                beforeEach(function() {
                    userContext.identity.company = null;
                });

                it('should set defult publish model', function() {
                    viewModel.publishModel = null;
                    viewModel.activate();
                    expect(viewModel.publishModel).toBe(defaultPublishModel);
                });
            });

            describe('when user has company', function() {
                beforeEach(function () {
                    userContext.identity.company = {};
                });

                it('should set defult publish model', function () {
                    viewModel.publishModel = null;
                    viewModel.activate();
                    expect(viewModel.publishModel).toBe(customPublishModel);
                });
            });
            
        });
    });
});