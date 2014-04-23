define(['viewmodels/courses/publishingActions/publishingAction'], function (publishingAction) {

    describe('[publishingAction]', function () {
        var
            viewModel,
            courseId = 'id',
            action = { state: 'someState', packageUrl: 'some/package/url' };

        beforeEach(function () {
            viewModel = publishingAction(courseId, action);
        });

        it('should be object', function () {
            expect(viewModel).toBeObject();
        });

        describe('state:', function () {

            it('should be observable', function () {
                expect(viewModel.state).toBeObservable();
            });

            it('should be equal to ctor \'state\' parameter', function () {
                expect(viewModel.state()).toBe(action.state);
            });

        });

        describe('isPublishing:', function () {
            it('should be observable', function () {
                expect(viewModel.isPublishing).toBeObservable();
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

            it('should be equal to ctor \'action.packageUrl\' parameter', function () {
                expect(viewModel.packageUrl()).toBe(action.packageUrl);
            });
        });

        describe('courseId:', function () {
            it('should be defined', function () {
                expect(viewModel.courseId).toBeDefined();
            });

            it('should be equal to ctor \'id\' parameter', function () {
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