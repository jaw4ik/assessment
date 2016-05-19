import PublishingAction from './publishingAction';

import constants from 'constants';
import app from 'durandal/app';

describe('[publishingAction]', function () {
    var
        viewModel,
        course = { id: 'id', isDelivering: true },
        action = { state: 'someState', packageUrl: 'some/package/url' };

    beforeEach(function () {
        spyOn(app, 'on').and.returnValue(Q.defer().promise);
        spyOn(app, 'off');

        viewModel = new PublishingAction();
    });

    it('should be object', function () {
        expect(viewModel).toBeObject();
    });

    describe('state:', function () {

        it('should be observable', function () {
            expect(viewModel.state).toBeObservable();
        });
    });

    describe('states:', function () {

        it('should be equal to allowed publish states', function () {
            expect(viewModel.states).toEqual(constants.publishingStates);
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
    });

    describe('courseId:', function () {
        it('should be defined', function () {
            expect(viewModel.courseId).toBeDefined();
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

    describe('subscriptions:', function () {
        it('should be array', function () {
            expect(viewModel.subscriptions).toBeArray();
        });
    });

    describe('courseDeliveringStarted:', function () {
        it('should be function', function () {
            expect(viewModel.courseDeliveringStarted).toBeFunction();
        });

        describe('when course is current course', function () {
            beforeEach(function () {
                viewModel.courseId = course.id;
            });

            it('should set isCourseDelivering to true', function () {
                viewModel.isCourseDelivering(false);
                viewModel.courseDeliveringStarted(course);
                expect(viewModel.isCourseDelivering()).toBeTruthy();
            });
        });

        describe('when course is not current course', function () {
            beforeEach(function () {
                viewModel.courseId = '';
            });

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
            beforeEach(function () {
                viewModel.courseId = course.id;
            });

            it('should set isCourseDelivering to false', function () {
                viewModel.isCourseDelivering(true);
                viewModel.courseDeliveringFinished(course);
                expect(viewModel.isCourseDelivering()).toBeFalsy();
            });
        });

        describe('when course is not current course', function () {
            beforeEach(function () {
                viewModel.courseId = '';
            });

            it('should not change isCourseDelivering', function () {
                viewModel.isCourseDelivering(true);
                viewModel.courseDeliveringFinished({ id: 'none' });
                expect(viewModel.isCourseDelivering()).toBeTruthy();
            });
        });
    });

    describe('activate:', function () {
        it('should be function', function () {
            expect(viewModel.activate).toBeFunction();
        });

        it('should set state', function () {
            viewModel.state('');
            viewModel.activate(course, action);
            expect(viewModel.state()).toBe(action.state);
        });

        it('should set packageUrl', function () {
            viewModel.packageUrl('');
            viewModel.activate(course, action);
            expect(viewModel.packageUrl()).toBe(action.packageUrl);
        });

        it('should set isCourseDelivering', function () {
            viewModel.isCourseDelivering(false);
            viewModel.activate(course, action);
            expect(viewModel.isCourseDelivering()).toBe(course.isDelivering);
        });

        it('should set courseId', function () {
            viewModel.courseId = '';
            viewModel.activate(course, action);
            expect(viewModel.courseId).toBe(course.id);
        });

        it('should subscribe to course.delivering.started event', function () {
            viewModel.activate(course, action);
            expect(app.on).toHaveBeenCalledWith(constants.messages.course.delivering.started);
        });

        it('should subscribe to course.delivering.finished event', function () {
            viewModel.activate(course, action);
            expect(app.on).toHaveBeenCalledWith(constants.messages.course.delivering.finished);
        });

        it('should fill subscriptions', function () {
            viewModel.activate(course, action);
            expect(viewModel.subscriptions.length).toBe(3);
        });
    });

    describe('deactivate:', function () {
        var subscriptions ;
        beforeEach(function () {
            subscriptions = [{ off: function () { } }, { off: function () { } }];
            spyOn(subscriptions[0], 'off');
            spyOn(subscriptions[1], 'off');

            viewModel.subscriptions = [subscriptions[0], subscriptions[1]];
        });

        it('should be function', function () {
            expect(viewModel.deactivate).toBeFunction();
        });

        it('should call off() for each subsription', function () {
            viewModel.deactivate();
            expect(subscriptions[0].off).toHaveBeenCalled();
            expect(subscriptions[1].off).toHaveBeenCalled();
        });

        it('should clear subscriptions', function () {
            viewModel.deactivate();
            expect(viewModel.subscriptions.length).toBe(0);
        });
    });

});
