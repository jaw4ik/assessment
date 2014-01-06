define(['viewmodels/courses/deliveringActions/scormBuild', 'constants'], function (scormBuildDeliveringAction, constants) {

	describe('delivering action [scormBuild]', function () {

		it('should be object', function () {
			expect(scormBuildDeliveringAction).toBeObject();
		});

		describe('isDelivering', function () {
			it('should be computed', function () {
				expect(scormBuildDeliveringAction.isDelivering).toBeComputed();
			});

			describe('when state is \'building\'', function () {
				beforeEach(function () {
					scormBuildDeliveringAction.state(constants.deliveringStates.building);
				});

				it('should return true', function () {
					expect(scormBuildDeliveringAction.isDelivering()).toBeTruthy();
				});
			});

			describe('when state is not \'building\'', function () {
				beforeEach(function () {
					scormBuildDeliveringAction.state('');
				});

				it('should return true', function () {
					expect(scormBuildDeliveringAction.isDelivering()).toBeFalsy();
				});
			});
		});

	});
})