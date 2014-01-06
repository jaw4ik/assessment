define(['viewmodels/courses/deliveringActions/build', 'constants'], function (buildDeliveringAction, constants) {

    describe('delivering action [build]', function () {

        it('should be object', function () {
            expect(buildDeliveringAction).toBeObject();
        });

        describe('isDelivering', function () {
            it('should be computed', function () {
                expect(buildDeliveringAction.isDelivering).toBeComputed();
            });

            describe('when state is \'building\'', function () {
                beforeEach(function () {
                    buildDeliveringAction.state(constants.deliveringStates.building);
                });

                it('should return true', function() {
                    expect(buildDeliveringAction.isDelivering()).toBeTruthy();
                });
            });
            
            describe('when state is not \'building\'', function () {
                beforeEach(function () {
                    buildDeliveringAction.state('');
                });

                it('should return true', function () {
                    expect(buildDeliveringAction.isDelivering()).toBeFalsy();
                });
            });
        });

    });
})