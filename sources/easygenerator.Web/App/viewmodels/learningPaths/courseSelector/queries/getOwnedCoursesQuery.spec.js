define(['viewmodels/learningPaths/courseSelector/queries/getOwnedCoursesQuery'], function (query) {
    "use strict";
    var
        dataContext = require('dataContext'),
        userContext = require('userContext')
    ;

    describe('query [getOwnedCoursesQuery]', function () {

        describe('execute:', function () {
            var userEmail = 'email@mail.com',
                course = {
                    id: 'id',
                    createdBy: userEmail
                },
                course2 = {
                    id: 'id2',
                    createdBy: 'someUser@mail.com'
                };

            beforeEach(function () {
                dataContext.courses = [course, course2];
                userContext.identity = {
                    email: userEmail
                };
            });

            it('should return learning path collection', function (done) {
                query.execute().then(function (data) {
                    expect(data).toBeArray();
                    expect(data.length).toBe(1);
                    expect(data[0]).toBe(course);
                    done();
                });
            });

        });
    });


});