﻿define(['synchronization/handlers/courseCollaborationStarted'], function (handler) {
    "use strict";

    var
        dataContext = require('dataContext'),
        app = require('durandal/app'),
        collaboratorModelMapper = require('mappers/collaboratorModelMapper'),
        courseModelMapper = require('mappers/courseModelMapper'),
        objectiveModelMapper = require('mappers/objectiveModelMapper')
    ;

    describe('synchronization [courseCollaborationStarted]', function () {

        var course = { Id: 'courseId' },
            user = { Email: 'mail', FullName: 'fullName' },
            mappedCourse = { id: course.Id, collaborators: [] };

        beforeEach(function () {
            spyOn(app, 'trigger');
            spyOn(collaboratorModelMapper, 'map');
            spyOn(courseModelMapper, 'map').and.returnValue(mappedCourse);
            spyOn(objectiveModelMapper, 'map');
        });

        it('should be function', function () {
            expect(handler).toBeFunction();
        });

        describe('when course is not an object', function () {
            it('should throw an exception', function () {
                var f = function () {
                    handler(undefined, [], user);
                };

                expect(f).toThrow('Course is not an object');
            });
        });

        describe('when objectives is not an array', function () {
            it('should throw an exception', function () {
                var f = function () {
                    handler(course, undefined, user);
                };

                expect(f).toThrow('Objectives is not an array');
            });
        });

        describe('when user is not an object', function () {
            it('should throw an exception', function () {
                var f = function () {
                    handler(course, [], undefined);
                };

                expect(f).toThrow('User is not an object');
            });
        });

        describe('when course is found in dataContext', function () {

            it('should add collaborator to course', function () {
                var existingCourse = { id: course.Id, collaborators: [] };
                dataContext.courses = [existingCourse];

                handler(course, [], user);

                expect(existingCourse.collaborators.length).toBe(1);
            });

        });

        describe('when course is not found in dataContext', function () {

            it('should add mapped course to data context', function () {
                dataContext.courses = [];
                handler(course, [], user);

                expect(dataContext.courses.length).toBe(1);
            });

        });

        describe('when objective is not found in dataContext', function () {

            var objective = { Id: 'id' };

            it('should add objective to data context', function () {
                var existingCourse = { id: course.Id, collaborators: [], objectives: [] };
                dataContext.courses = [existingCourse];
                dataContext.objectives = [];

                handler(course, [objective], user);

                expect(dataContext.objectives.length).toBe(1);
            });

        });

        describe('when objective is found in dataContext', function () {

            var objective = { Id: 'id' };

            it('should not add objective to data context', function () {
                var existingCourse = { id: course.Id, collaborators: [], objectives: [] };
                dataContext.courses = [existingCourse];
                dataContext.objectives = [{ id: objective.Id }];

                handler(course, [objective], user);

                expect(dataContext.objectives.length).toBe(1);
            });

        });

        it('should trigger app event', function () {
            handler(course, [], user);
            expect(app.trigger).toHaveBeenCalled();
        });

    });

})