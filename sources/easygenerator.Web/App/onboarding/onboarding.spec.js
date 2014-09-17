define(['onboarding/onboarding'], function (onboarding) {
    "use strict";

    var inititalization = require('onboarding/inititalization');

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

        describe('close:', function () {

            it('should be function', function () {
                expect(onboarding.close).toBeFunction();
            });

            it('should call inititalization.close function', function () {
                spyOn(inititalization, 'close').and.callFake(function () { });
                onboarding.close();
                expect(inititalization.close).toHaveBeenCalled();
            });

        });

        describe('activate:', function () {

            it('should be function', function () {
                expect(onboarding.activate).toBeFunction();
            });

            var tasksList = [{ title: 'task 1', isCompleted: ko.observable(true) }, { title: 'task 2', isCompleted: ko.observable(true) }];
            beforeEach(function () {
                spyOn(inititalization, 'getTasksList').and.returnValue(tasksList);
            });

            it('should fill tasks from inititalization', function () {
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
})