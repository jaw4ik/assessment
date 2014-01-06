define(['viewmodels/courses/deliveringActions/publish', 'constants'], function (publishDeliveringAction, constants) {

	describe('delivering action [publish]', function () {

		it('should be object', function () {
			expect(publishDeliveringAction).toBeObject();
		});

		describe('isDelivering', function () {
			it('should be computed', function () {
				expect(publishDeliveringAction.isDelivering).toBeComputed();
			});

			describe('when state is \'building\'', function () {
				beforeEach(function () {
					publishDeliveringAction.state(constants.deliveringStates.building);
				});

				it('should return true', function () {
					expect(publishDeliveringAction.isDelivering()).toBeTruthy();
				});
			});

			describe('when state is not \'building\'', function () {

				describe('when state is \'publishing\'', function () {
					beforeEach(function () {
						publishDeliveringAction.state(constants.deliveringStates.publishing);
					});

					it('should return true', function () {
						expect(publishDeliveringAction.isDelivering()).toBeTruthy();
					});
				});

				describe('when state is not \'publishing\'', function () {
					beforeEach(function () {
						publishDeliveringAction.state('');
					});

					it('should return false', function () {
						expect(publishDeliveringAction.isDelivering()).toBeFalsy();
					});
				});

			});
		});
	});
})