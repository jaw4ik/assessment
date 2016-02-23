import viewModel from 'dialogs/learningPath/customPublish';

describe('dialog learningPath model [customPublish]', function () {

    it('should be object', function () {
        expect(viewModel).toBeObject();
    });

    describe('publishAction:', function() {
        it('should be defined', function() {
            expect(viewModel.publishAction).toBeDefined();
        });
    });

    describe('activate:', function() {
        beforeEach(function() {
            viewModel.publishAction = { activate: function() {} };
            spyOn(viewModel.publishAction, 'activate').and.returnValue(Q.defer().promise);
        });

        it('should be function', function() {
            expect(viewModel.activate).toBeFunction();
        });

        it('should return promise', function() {
            expect(viewModel.activate()).toBePromise();
        });

        it('should activate publishAction', function () {
            var data = {};
            viewModel.activate(data);
            expect(viewModel.publishAction.activate).toHaveBeenCalledWith(data);
        });
    });
        
    describe('deactivate:', function () {
        beforeEach(function () {
            viewModel.publishAction = { deactivate: function () { } };
            spyOn(viewModel.publishAction, 'deactivate').and.returnValue(Q.defer().promise);
        });

        it('should be function', function () {
            expect(viewModel.deactivate).toBeFunction();
        });

        it('should return promise', function () {
            expect(viewModel.deactivate()).toBePromise();
        });

        it('should deactivate publishAction', function () {
            viewModel.deactivate();
            expect(viewModel.publishAction.deactivate).toHaveBeenCalled();
        });
    });
});