define(['eventDataBuilders/courseEventDataBuilder'], function (eventDataBuilder) {

    describe('[courseEventDataBuilder]', function () {

        var course = {
            score: ko.observable(100),
            isCompleted: ko.observable(true),
            objectives: [{
                id: 'id',
                title: 'title',
                score: ko.observable(100)
            }]
        };

        describe('buildCourseFinishedEventData:', function () {
            it('should be function', function () {
                expect(eventDataBuilder.buildCourseFinishedEventData).toBeFunction();
            });

            describe('when course is not an object', function () {
                it('should throw exception with \'Course is not an object\'', function () {
                    var f = function () {
                        eventDataBuilder.buildCourseFinishedEventData(null);
                    };
                    expect(f).toThrow('Course is not an object');
                });
            });

            describe('when course is an object', function () {

                it('should return object', function () {
                    var data = eventDataBuilder.buildCourseFinishedEventData(course);

                    expect(data.result).toBe(course.score() / 100);
                    expect(data.isCompleted).toBe(course.isCompleted());

                    expect(data.objectives.length).toBe(1);
                    expect(data.objectives[0].id).toBe(course.objectives[0].id);
                    expect(data.objectives[0].title).toBe(course.objectives[0].title);
                    expect(data.objectives[0].score).toBe(course.objectives[0].score());
                });

            });
        });

    });
});