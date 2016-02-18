import onboarding from './onboarding';

import initialization from './initialization';

describe('viewmodel [onboarding]', function() {

    it('should be defined', function() {
        expect(onboarding).toBeDefined();
    });

    describe('tasks:', function() {

        it('should be observable', function() {
            expect(onboarding.tasks).toBeObservable();
        });

    });

    describe('isMinimized:', function () {

        it('should be observable', function () {
            expect(onboarding.isMinimized).toBeObservable();
        });

    });

    describe('isCompleted:', function () {

        it('should be computed', function () {
            expect(onboarding.isCompleted).toBeComputed();
        });

        describe('when not all tasks completed', function () {

            beforeEach(function () {
                onboarding.tasks([{ isCompleted: ko.observable(true) }, { isCompleted: ko.observable(false) }]);
            });

            it('should return false', function () {
                expect(onboarding.isCompleted()).toBeFalsy();
            });

        });

        describe('when all tasks completed', function () {

            beforeEach(function () {
                onboarding.tasks([{ isCompleted: ko.observable(true) }, { isCompleted: ko.observable(true) }]);
            });

            it('should return true', function () {
                expect(onboarding.isCompleted()).toBeTruthy();
            });

        });

    });

    describe('closeOnboarding:', function () {

        it('should be function', function () {
            expect(onboarding.closeOnboarding).toBeFunction();
        });

        it('should call initialization.closeOnboarding function', function () {
            spyOn(initialization, 'closeOnboarding').and.callFake(function () { });
            onboarding.closeOnboarding();
            expect(initialization.closeOnboarding).toHaveBeenCalled();
        });

    });

    describe('activate:', function () {

        it('should be function', function () {
            expect(onboarding.activate).toBeFunction();
        });

        var tasksList = [{ title: 'task 1', isCompleted: ko.observable(true) }, { title: 'task 2', isCompleted: ko.observable(true) }];
        beforeEach(function () {
            spyOn(initialization, 'getTasksList').and.returnValue(tasksList);
        });

        it('should fill tasks from initialization', function () {
            onboarding.tasks([]);

            onboarding.activate({});
            expect(onboarding.tasks()).toBe(tasksList);
        });

        it('should set isMinimized from argument', function () {
            onboarding.isMinimized(false);

            onboarding.activate({ isMinimized: true });
            expect(onboarding.isMinimized()).toBeTruthy();
        });

    });

});
