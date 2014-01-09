define(['viewmodels/courses/deliveringActions/deliveringAction'], function (deliveringAction) {

    describe('[deliveringAction]', function () {
        var viewModel,
            packageUrl = 'someUrl',
            courseId = 'id';

        beforeEach(function () {
            viewModel = deliveringAction(courseId, packageUrl);
        });

        it('should be object', function () {
            expect(viewModel).toBeObject();
        });

        describe('state:', function () {
            it('should be observable', function () {
                expect(viewModel.state).toBeObservable();
            });
        });

        describe('isDelivering:', function () {
            it('should be observable', function () {
                expect(viewModel.isDelivering).toBeObservable();
            });
        });
        
        describe('isActive:', function () {
            it('should be observable', function () {
                expect(viewModel.isActive).toBeObservable();
            });
        });

        describe('packageUrl:', function () {
            it('should be observable', function () {
                expect(viewModel.packageUrl).toBeObservable();
            });

            it('should be equal to cror parameter', function () {
                expect(viewModel.packageUrl()).toBe(packageUrl);
            });
        });

        describe('courseId:', function () {
            it('should be defined', function () {
                expect(viewModel.courseId).toBeDefined();
            });

            it('should be equal to cror parameter', function () {
                expect(viewModel.courseId).toBe(courseId);
            });
        });

        describe('packageExists:', function () {

            it('should be computed', function () {
                expect(viewModel.packageExists).toBeComputed();
            });

            describe('when packageUrl is not defined', function () {

                it('should be false', function () {
                    viewModel.packageUrl(undefined);
                    expect(viewModel.packageExists()).toBeFalsy();
                });

            });

            describe('when packageUrl is empty', function () {

                it('should be false', function () {
                    viewModel.packageUrl('');
                    expect(viewModel.packageExists()).toBeFalsy();
                });

            });

            describe('when packageUrl is whitespace', function () {

                it('should be false', function () {
                    viewModel.packageUrl("    ");
                    expect(viewModel.packageExists()).toBeFalsy();
                });

            });

            describe('when packageUrl is a non-whitespace string', function () {

                it('should be true', function () {
                    viewModel.packageUrl("packageUrl");
                    expect(viewModel.packageExists()).toBeTruthy();
                });

            });

        });

    });
})