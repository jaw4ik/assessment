import viewModel from 'dialogs/learningPath/shareLearningPath';

import userContext from 'userContext';
import defaultPublishModel from 'dialogs/learningPath/defaultPublish';
import customPublishModel from 'dialogs/learningPath/customPublish';

describe('dialog [shareLearningPath]', function () {

    it('should be object', function () {
        expect(viewModel).toBeObject();
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
        beforeEach(function () {
            viewModel.publishModel = { activate: function () { } };
            spyOn(viewModel.publishModel, 'activate');
        });

        it('should be function', function () {
            expect(viewModel.show).toBeFunction();
        });

        it('should activate publish model', function () {
            viewModel.show('learningPathId');
            expect(viewModel.publishModel.activate).toHaveBeenCalledWith('learningPathId');
        });

        it('should show dialog', function () {
            viewModel.isShown(null);
            viewModel.show();
            expect(viewModel.isShown()).toBeTruthy();
        });
    });

    describe('hide:', function () {
        beforeEach(function () {
            viewModel.publishModel = { deactivate: function () { } };
            spyOn(viewModel.publishModel, 'deactivate');
        });

        it('should be function', function () {
            expect(viewModel.hide).toBeFunction();
        });

        it('should deactivate publish model', function () {
            viewModel.hide();
            expect(viewModel.publishModel.deactivate).toHaveBeenCalled();
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
