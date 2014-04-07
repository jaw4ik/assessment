define(['models/course'], function (CourseModel) {

    var eventManager = require('eventManager'),
        eventDataBuilder = require('eventDataBuilders/courseEventDataBuilder');

    describe('model [course]', function () {

        it('should be defined', function () {
            expect(CourseModel).toBeDefined();
        });

        it('should return function', function () {
            expect(CourseModel).toBeFunction();
        });

        var course;
        var spec = {
            id: 'id',
            title: 'title',
            hasIntroductionContent: false,
            objectives: []
        };

        beforeEach(function () {
            course = new CourseModel(spec);
        });

        describe('id:', function () {
            it('should be defined', function () {
                expect(course.id).toBeDefined();
            });

            it('should be equal to spec id', function () {
                expect(course.id).toBe(spec.id);
            });
        });

        describe('title:', function () {
            it('should be defined', function () {
                expect(course.title).toBeDefined();
            });

            it('should be equal to spec title', function () {
                expect(course.title).toBe(spec.title);
            });
        });

        describe('hasIntroductionContent:', function () {
            it('should be defined', function () {
                expect(course.hasIntroductionContent).toBeDefined();
            });

            it('should be equal to spec hasIntroductionContent', function () {
                expect(course.hasIntroductionContent).toBe(spec.hasIntroductionContent);
            });
        });


        describe('objectives:', function () {
            it('should be defined', function () {
                expect(course.objectives).toBeDefined();
            });

            it('should be equal to spec objectives', function () {
                expect(course.objectives()).toBe(spec.objectives);
            });
        });

        describe('score:', function () {
            it('should be computed', function () {
                expect(course.score).toBeComputed();
            });

            beforeEach(function () {
                course.objectives.removeAll();
            });

            describe('when course has objectives', function () {

                beforeEach(function () {
                    course.objectives.removeAll();
                });

                it('should have value', function () {
                    course.objectives.push({ score: ko.observable(0), isCompleted: ko.observable(false) });
                    course.objectives.push({ score: ko.observable(100), isCompleted: ko.observable(true) });

                    expect(course.score()).toBe(50);
                });

                describe('when value is fraction', function() {
                    it('should round value to floor', function() {
                        course.objectives.push({ score: ko.observable(0), isCompleted: ko.observable(false) });
                        course.objectives.push({ score: ko.observable(100), isCompleted: ko.observable(true) });
                        course.objectives.push({ score: ko.observable(67), isCompleted: ko.observable(true) });

                        expect(course.score()).toBe(55);
                    });
                });
            });

            describe('when course has no objectives', function () {

                beforeEach(function () {
                    course.objectives.removeAll();
                });

                it('should be 0', function () {
                    expect(course.score()).toBe(0);
                });
            });
        });

        describe('isCompleted:', function () {
            it('should be computed', function () {
                expect(course.isCompleted).toBeComputed();
            });

            beforeEach(function () {
                course.objectives.removeAll();
            });

            describe('when course has at least one not passed objective', function () {

                beforeEach(function () {
                    course.objectives.removeAll();
                });

                it('should be false', function () {
                    course.objectives.push({ score: ko.observable(0), isCompleted: ko.observable(false) });
                    course.objectives.push({ score: ko.observable(100), isCompleted: ko.observable(true) });

                    expect(course.isCompleted()).toBeFalsy();
                });
            });

            describe('when all objectives are passed', function () {

                beforeEach(function () {
                    course.objectives.removeAll();
                });

                it('should be true', function () {
                    course.objectives.push({ score: ko.observable(80), isCompleted: ko.observable(true) });
                    course.objectives.push({ score: ko.observable(100), isCompleted: ko.observable(true) });

                    expect(course.isCompleted()).toBeTruthy();
                });
            });
        });

        describe('finish:', function () {
            var eventData = {};
            var obj = {
                callback: function () { }
            };
            beforeEach(function () {
                spyOn(eventDataBuilder, 'buildCourseFinishedEventData').andReturn(eventData);
                spyOn(eventManager, 'turnAllEventsOff');
                spyOn(eventManager, 'courseFinished').andCallFake(function (arg, callbackFunction) {
                    callbackFunction();
                });
            });

            it('should be function', function () {
                expect(course.finish).toBeFunction();
            });

            it('should call eventDataBuilder buildCourseFinishedEventData', function () {
                course.finish(obj.callback);
                expect(eventDataBuilder.buildCourseFinishedEventData).toHaveBeenCalled();
            });

            it('should call event manager course finished event', function () {
                course.finish(obj.callback);
                expect(eventManager.courseFinished).toHaveBeenCalled();
            });

            describe('when course finished', function () {
                it('should call event manager course turnAllEventsOff', function () {
                    course.finish(obj.callback);
                    expect(eventManager.turnAllEventsOff).toHaveBeenCalled();
                });

                it('should call callback function', function () {
                    spyOn(obj, 'callback');
                    course.finish(obj.callback);
                    expect(obj.callback).toHaveBeenCalled();
                });

            });
        });
    });
});