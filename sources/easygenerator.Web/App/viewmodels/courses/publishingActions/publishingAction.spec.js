define(['viewmodels/courses/publishingActions/publishingAction'], function (publishingAction) {

    describe('[publishingAction]', function () {
        var
            viewModel,
            course = { id: 'id' },
            action = { state: 'someState', packageUrl: 'some/package/url' };

        beforeEach(function () {
            viewModel = publishingAction(course, action);
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

        describe('isCourseDelivering:', function () {
            it('should be observable', function () {
                expect(viewModel.isCourseDelivering).toBeObservable();
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
                expect(viewModel.courseId).toBe(course.id);
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

        describe('courseDeliveringStarted:', function () {
            it('should be function', function () {
                expect(viewModel.courseDeliveringStarted).toBeFunction();
            });

            describe('when course is current course', function () {
                it('should set isCourseDelivering to true', function () {
                    viewModel.isCourseDelivering(false);
                    viewModel.courseDeliveringStarted(course);
                    expect(viewModel.isCourseDelivering()).toBeTruthy();
                });
            });

            describe('when course is not current course', function () {
                it('should not change isCourseDelivering', function () {
                    viewModel.isCourseDelivering(false);
                    viewModel.courseDeliveringStarted({ id: 'none' });
                    expect(viewModel.isCourseDelivering()).toBeFalsy();
                });
            });
        });

        describe('courseDeliveringFinished:', function () {
            it('should be function', function () {
                expect(viewModel.courseDeliveringFinished).toBeFunction();
            });

            describe('when course is current course', function () {
                it('should set isCourseDelivering to false', function () {
                    viewModel.isCourseDelivering(true);
                    viewModel.courseDeliveringFinished(course);
                    expect(viewModel.isCourseDelivering()).toBeFalsy();
                });
            });

            describe('when course is not current course', function () {
                it('should not change isCourseDelivering', function () {
                    viewModel.isCourseDelivering(true);
                    viewModel.courseDeliveringFinished({ id: 'none' });
                    expect(viewModel.isCourseDelivering()).toBeTruthy();
                });
            });
        });

    });
})