define(['eventDataBuilders/courseEventDataBuilder'], function (eventDataBuilder) {

    describe('[courseEventDataBuilder]', function () {

        var course = {
            score: 100,
            objectives: [{
                id: 'id',
                title: 'title',
                score: 100
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

                    expect(data.result).toBe(1);

                    expect(data.objectives.length).toBe(1);
                    expect(data.objectives[0].id).toBe(course.objectives[0].id);
                    expect(data.objectives[0].title).toBe(course.objectives[0].title);
                    expect(data.objectives[0].score).toBe(course.objectives[0].score);
                });

            });
        });

    });
});