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
            score: 0,
            objectives: [
                { score: 0, calculateScore: function () { } },
                { score: 100, calculateScore: function () { } }
            ]
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

        describe('score:', function () {
            it('should be defined', function () {
                expect(course.score).toBeDefined();
            });

            it('should be equal to spec score', function () {
                expect(course.score).toBe(spec.score);
            });
        });

        describe('objectives:', function () {
            it('should be defined', function () {
                expect(course.objectives).toBeDefined();
            });

            it('should be equal to spec objectives', function () {
                expect(course.objectives).toBe(spec.objectives);
            });
        });

        describe('calculateScore:', function () {
            it('should be function', function () {
                expect(course.calculateScore).toBeFunction();
            });

            beforeEach(function () {
                spyOn(spec.objectives[0], 'calculateScore');
                spyOn(spec.objectives[1], 'calculateScore');
            });

            it('should call calculate score for each objective', function () {
                course.calculateScore();

                expect(spec.objectives[0].calculateScore).toHaveBeenCalled();
                expect(spec.objectives[0].calculateScore).toHaveBeenCalled();
            });

            it('should set score', function () {
                course.score = 0;

                course.calculateScore();
                expect(course.score).toBe(50);
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