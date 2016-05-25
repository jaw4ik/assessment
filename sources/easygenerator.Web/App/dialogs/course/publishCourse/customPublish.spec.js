import viewModel from './customPublish';

import PublishToCustomLms from 'viewmodels/courses/publishingActions/publishToCustomLms';

describe('course publish dialog [customPublish]', function () {

    it('should be object', function () {
        expect(viewModel).toBeObject();
    });

    describe('publishAction:', function () {
        it('should be defined', function () {
            expect(viewModel.publishAction).toBeDefined();
        });
    });

    describe('activate:', function () {
        var publishAction,
            activateDfr;

        beforeEach(function () {
            publishAction = new PublishToCustomLms();
            viewModel.publishAction = publishAction;
            activateDfr = Q.defer();
            spyOn(publishAction, 'activate').and.returnValue(activateDfr.promise);
        });

        it('should be function', function() {
            expect(viewModel.activate).toBeFunction();
        });

        it('should return promise', function () {
            expect(viewModel.activate()).toBePromise();
        });

        it('should activate publish action', function () {
            var data = {};
            viewModel.activate(data);

            expect(publishAction.activate).toHaveBeenCalledWith(data);
        });
    });

    describe('deactivate:', function () {
        var publishAction,
            deactivateDfr;

        beforeEach(function () {
            publishAction = new PublishToCustomLms();
            viewModel.publishAction = publishAction;
            deactivateDfr = Q.defer();
            spyOn(publishAction, 'deactivate').and.returnValue(deactivateDfr.promise);
        });

        it('should be function', function () {
            expect(viewModel.deactivate).toBeFunction();
        });

        it('should return promise', function () {
            expect(viewModel.deactivate()).toBePromise();
        });

        it('should activate publish action', function () {
            viewModel.deactivate();
            expect(publishAction.deactivate).toHaveBeenCalled();
        });
    });

});