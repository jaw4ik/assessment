define(['viewmodels/courses/course.read'], function (viewModel) {

    var
        userContext = require('userContext'),
        eventTracker = require('eventTracker'),
        router = require('plugins/router');

    describe('viewModel [course.read]', function () {

        it('should be defined', function () {
            expect(viewModel).toBeDefined();
        });

        describe('initialize:', function () {

            var course = {
                id: 'SomeCourseId',
                title: 'Some course title',
                createdBy: 'some@user.com',
                collaborators: [],
                introductionContent: 'Some introduction content',
                objectives: []
            };

            beforeEach(function () {
                userContext.identity = { email: course.createdBy };
            });

            it('should be function', function () {
                expect(viewModel.initialize).toBeFunction();
            });

            it('should initialize viewModel', function () {
                viewModel.initialize(course);

                expect(viewModel.id).toEqual(course.id);
                expect(viewModel.title).toEqual(course.title);
                expect(viewModel.courseIntroductionContent.text()).toEqual(course.introductionContent);
                expect(viewModel.connectedObjectives.length).toEqual(course.objectives.length);
            });

        });

        describe('navigateToObjectiveDetails:', function () {

            beforeEach(function () {
                spyOn(eventTracker, 'publish');
                spyOn(router, 'navigate');
            });

            it('should be function', function () {
                expect(viewModel.navigateToObjectiveDetails).toBeFunction();
            });

            it('should send event \'Navigate to objective details\'', function () {
                viewModel.navigateToObjectiveDetails({ id: 'someId' });
                expect(eventTracker.publish).toHaveBeenCalledWith('Navigate to objective details');
            });

            it('should navigate to \'objective/\' + objective.id + \'?courseId=\' + viewModel.id', function () {
                var objective = { id: 'someId' };
                viewModel.navigateToObjectiveDetails(objective);
                expect(router.navigate).toHaveBeenCalledWith('objective/' + objective.id + '?courseId=' + viewModel.id);
            });

            describe('when objective is undefined', function () {

                it('should throw exception', function () {
                    var action = function () {
                        viewModel.navigateToObjectiveDetails();
                    };

                    expect(action).toThrow('Objective is undefined');
                });

            });

            describe('when objective is null', function () {

                it('should throw exception', function () {
                    var action = function () {
                        viewModel.navigateToObjectiveDetails(null);
                    };

                    expect(action).toThrow('Objective is null');
                });

            });

            describe('when objective does not have id property', function () {

                it('should throw exception', function () {
                    var action = function () {
                        viewModel.navigateToObjectiveDetails({});
                    };

                    expect(action).toThrow('Objective does not have id property');
                });

            });

            describe('when objective id property is null', function () {

                it('should throw exception', function () {
                    var action = function () {
                        viewModel.navigateToObjectiveDetails({ id: null });
                    };

                    expect(action).toThrow('Objective id property is null');
                });

            });

        });

    });

});