define(['dialogs/learningPath/shareLearningPath'], function (viewModel) {
    'use strict';

    var userContext = require('userContext'),
        defaultPublishModel = require('dialogs/learningPath/defaultPublish'),
        customPublishModel = require('dialogs/learningPath/customPublish');

    describe('dialog [shareLearningPath]', function () {

        it('should be object', function () {
            expect(viewModel).toBeObject();
        });

        describe('learningPathId', function () {
            it('should be defined', function () {
                expect(viewModel.learningPathId).toBeDefined();
            });
        });

        describe('publishModel', function () {
            it('should be defined', function () {
                expect(viewModel.publishModel).toBeDefined();
            });
        });

        describe('isShown:', function () {
            it('should be observable', function () {
                expect(viewModel.isShown).toBeObservable();
            });
        });

        describe('show:', function () {
            it('should be function', function () {
                expect(viewModel.show).toBeFunction();
            });

            it('should show dialog', function () {
                viewModel.isShown(null);
                viewModel.show();
                expect(viewModel.isShown()).toBeTruthy();
            });
        });

        describe('hide:', function () {
            it('should be function', function () {
                expect(viewModel.hide).toBeFunction();
            });

            it('should hide dialog', function () {
                viewModel.isShown(null);
                viewModel.hide();
                expect(viewModel.isShown()).toBeFalsy();
            });
        });

        describe('activate:', function () {
            var learningPathId = 'learningPathId';

            beforeEach(function () {
                userContext.identity = {};
            });

            it('should be function', function () {
                expect(viewModel.activate).toBeFunction();
            });

            it('should set learningPathId', function () {
                viewModel.learningPathId = '';
                viewModel.activate(learningPathId);
                expect(viewModel.learningPathId).toBe(learningPathId);
            });

            describe('when user has company', function () {
                beforeEach(function () {
                    userContext.identity.company = {};
                });

                it('should set custom publish model', function () {
                    viewModel.activate(learningPathId);
                    expect(viewModel.publishModel).toBe(customPublishModel);
                });
            });

            describe('when user has no company', function () {
                beforeEach(function () {
                    userContext.identity.company = null;
                });

                it('should set default publish model', function () {
                    viewModel.activate(learningPathId);
                    expect(viewModel.publishModel).toBe(defaultPublishModel);
                });
            });
        });

    });
});