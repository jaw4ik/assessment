import viewModel from './courseFilter';

describe('viewModel learning path course selector [courseFilter]', function () {

    describe('value:', function() {
        it('should be observable', function() {
            expect(viewModel.value).toBeObservable();
        });
    });

    describe('isEditing:', function () {
        it('should be observable', function () {
            expect(viewModel.isEditing).toBeObservable();
        });
    });

    describe('hasValue:', function() {
        describe('when value is set', function() {
            beforeEach(function() {
                viewModel.value('value');
            });

            it('should be true', function() {
                expect(viewModel.hasValue()).toBeTruthy();
            });
        });

        describe('when value is empty string', function () {
            beforeEach(function () {
                viewModel.value('');
            });

            it('should be false', function () {
                expect(viewModel.hasValue()).toBeFalsy();
            });
        });
    });

    describe('clear:', function() {
        it('should set value to empty string', function() {
            viewModel.value('value');
            viewModel.clear();
            expect(viewModel.value()).toBe('');
        });
    });

    describe('activate:', function () {
        it('should set value to empty string', function () {
            viewModel.value('value');
            viewModel.activate();
            expect(viewModel.value()).toBe('');
        });

        it('should set isEditing to false', function () {
            viewModel.isEditing(true);
            viewModel.activate();
            expect(viewModel.isEditing()).toBeFalsy();
        });
    });

});
