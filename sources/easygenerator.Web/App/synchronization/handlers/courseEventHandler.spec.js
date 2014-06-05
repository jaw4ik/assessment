define(['synchronization/handlers/courseEventHandler'], function (handler) {
    "use strict";

    var
        dataContext = require('dataContext'),
        app = require('durandal/app'),
        collaboratorModelMapper = require('mappers/collaboratorModelMapper'),
        courseModelMapper = require('mappers/courseModelMapper'),
        objectiveModelMapper = require('mappers/objectiveModelMapper'),
        constants = require('constants')
    ;

    describe('synchronization [courseEventHandler]', function () {

        var course = { Id: 'courseId' },
            user = { Email: 'mail', FullName: 'fullName' },
            mappedCourse = { id: course.Id, collaborators: [] };

        beforeEach(function () {
            spyOn(app, 'trigger');
            spyOn(collaboratorModelMapper, 'map');
            spyOn(courseModelMapper, 'map').and.returnValue(mappedCourse);
            spyOn(objectiveModelMapper, 'map');
        });

        describe('courseCollaborationStarted', function () {

            it('should be function', function () {
                expect(handler.courseCollaborationStarted).toBeFunction();
            });

            describe('when course is not an object', function () {
                it('should throw an exception', function () {
                    var f = function () {
                        handler.courseCollaborationStarted(undefined, [], user);
                    };

                    expect(f).toThrow('Course is not an object');
                });
            });

            describe('when objectives is not an array', function () {
                it('should throw an exception', function () {
                    var f = function () {
                        handler.courseCollaborationStarted(course, undefined, user);
                    };

                    expect(f).toThrow('Objectives is not an array');
                });
            });

            describe('when user is not an object', function () {
                it('should throw an exception', function () {
                    var f = function () {
                        handler.courseCollaborationStarted(course, [], undefined);
                    };

                    expect(f).toThrow('User is not an object');
                });
            });

            describe('when course is found in dataContext', function () {

                it('should add collaborator to course', function () {
                    var existingCourse = { id: course.Id, collaborators: [] };
                    dataContext.courses = [existingCourse];

                    handler.courseCollaborationStarted(course, [], user);

                    expect(existingCourse.collaborators.length).toBe(1);
                });

            });

            describe('when course is not found in dataContext', function () {

                it('should add mapped course to data context', function () {
                    dataContext.courses = [];
                    handler.courseCollaborationStarted(course, [], user);

                    expect(dataContext.courses.length).toBe(1);
                });

            });

            describe('when objective is not found in dataContext', function () {

                var objective = { Id: 'id' };

                it('should add objective to data context', function () {
                    var existingCourse = { id: course.Id, collaborators: [], objectives: [] };
                    dataContext.courses = [existingCourse];
                    dataContext.objectives = [];

                    handler.courseCollaborationStarted(course, [objective], user);

                    expect(dataContext.objectives.length).toBe(1);
                });

            });

            describe('when objective is found in dataContext', function () {

                var objective = { Id: 'id' };

                it('should not add objective to data context', function () {
                    var existingCourse = { id: course.Id, collaborators: [], objectives: [] };
                    dataContext.courses = [existingCourse];
                    dataContext.objectives = [{ id: objective.Id }];

                    handler.courseCollaborationStarted(course, [objective], user);

                    expect(dataContext.objectives.length).toBe(1);
                });

            });

            it('should trigger app event', function () {
                handler.courseCollaborationStarted(course, [], user);
                expect(app.trigger).toHaveBeenCalled();
            });
        });

        describe('courseCollaboratorAdded:', function () {

            it('should be function', function () {
                expect(handler.courseCollaboratorAdded).toBeFunction();
            });

            describe('when courseId is not a string', function () {
                it('should throw an exception', function () {
                    var f = function () {
                        handler.courseCollaboratorAdded(undefined, user);
                    };

                    expect(f).toThrow('courseId is not a string');
                });
            });

            describe('when user is not an object', function () {
                it('should throw an exception', function () {
                    var f = function () {
                        handler.courseCollaboratorAdded(course.Id, undefined);
                    };

                    expect(f).toThrow('User is not an object');
                });
            });

            describe('when course is found in dataContext', function () {

                it('should throw an exception', function () {
                    dataContext.courses = [];
                    var f = function () {
                        handler.courseCollaboratorAdded(course.Id, user);
                    };

                    expect(f).toThrow('Course is not an object');
                });

            });

            it('should add collaborator to course in data context', function () {
                dataContext.courses = [mappedCourse];
                handler.courseCollaboratorAdded(mappedCourse.id, user);

                expect(dataContext.courses[0].collaborators.length).toBe(1);
            });

            it('should trigger app event', function () {
                handler.courseCollaboratorAdded(course.Id, user);
                expect(app.trigger).toHaveBeenCalled();
            });
        });

        describe('courseTitleUpdated:', function () {

            var title = "title",
                modifiedOn = new Date();

            it('should be function', function () {
                expect(handler.courseTitleUpdated).toBeFunction();
            });

            describe('when courseId is not a string', function () {
                it('should throw an exception', function () {
                    var f = function () {
                        handler.courseTitleUpdated(undefined, title, modifiedOn.toISOString());
                    };

                    expect(f).toThrow('CourseId is not a string');
                });
            });

            describe('when title is not a string', function () {
                it('should throw an exception', function () {
                    var f = function () {
                        handler.courseTitleUpdated(mappedCourse.id, undefined, modifiedOn.toISOString());
                    };

                    expect(f).toThrow('Title is not a string');
                });
            });

            describe('when modifiedOn is not a date', function () {
                it('should throw an exception', function () {
                    var f = function () {
                        handler.courseTitleUpdated(mappedCourse.id, title, undefined);
                    };

                    expect(f).toThrow('ModifiedOn is not a string');
                });
            });

            describe('when course is not found in data context', function () {
                it('should throw an exception', function () {
                    dataContext.courses = [];

                    var f = function () {
                        handler.courseTitleUpdated(mappedCourse.id, title, modifiedOn.toISOString());
                    };

                    expect(f).toThrow('Course has not been found');
                });
            });

            it('should update course title', function () {
                mappedCourse.title = "";
                dataContext.courses = [mappedCourse];
                handler.courseTitleUpdated(mappedCourse.id, title, modifiedOn.toISOString());

                expect(dataContext.courses[0].title).toBe(title);
            });

            it('should update course modified on date', function () {
                mappedCourse.modifiedOn = "";
                dataContext.courses = [mappedCourse];
                handler.courseTitleUpdated(mappedCourse.id, title, modifiedOn.toISOString());

                expect(dataContext.courses[0].modifiedOn.toISOString()).toBe(modifiedOn.toISOString());
            });

            it('should trigger app event', function () {
                dataContext.courses = [mappedCourse];
                handler.courseTitleUpdated(mappedCourse.id, title, modifiedOn.toISOString());
                expect(app.trigger).toHaveBeenCalled();
            });
        });

        describe('courseIntroducationContentUpdated:', function () {

            var introductionContent = "introductionContent",
                modifiedOn = new Date();

            it('should be function', function () {
                expect(handler.courseIntroducationContentUpdated).toBeFunction();
            });

            describe('when courseId is not a string', function () {
                it('should throw an exception', function () {
                    var f = function () {
                        handler.courseIntroducationContentUpdated(undefined, introductionContent, modifiedOn.toISOString());
                    };

                    expect(f).toThrow('CourseId is not a string');
                });
            });

            describe('when introductionContent is not a string', function () {
                it('should throw an exception', function () {
                    var f = function () {
                        handler.courseIntroducationContentUpdated(mappedCourse.id, undefined, modifiedOn.toISOString());
                    };

                    expect(f).toThrow('Introduction content is not a string');
                });
            });

            describe('when modifiedOn is not a date', function () {
                it('should throw an exception', function () {
                    var f = function () {
                        handler.courseIntroducationContentUpdated(mappedCourse.id, introductionContent, undefined);
                    };

                    expect(f).toThrow('ModifiedOn is not a string');
                });
            });

            describe('when course is not found in data context', function () {
                it('should throw an exception', function () {
                    dataContext.courses = [];

                    var f = function () {
                        handler.courseIntroducationContentUpdated(mappedCourse.id, introductionContent, modifiedOn.toISOString());
                    };

                    expect(f).toThrow('Course has not been found');
                });
            });

            it('should update course introductionContent', function () {
                mappedCourse.title = "";
                dataContext.courses = [mappedCourse];
                handler.courseIntroducationContentUpdated(mappedCourse.id, introductionContent, modifiedOn.toISOString());

                expect(dataContext.courses[0].introductionContent).toBe(introductionContent);
            });

            it('should update course modified on date', function () {
                mappedCourse.modifiedOn = "";
                dataContext.courses = [mappedCourse];
                handler.courseIntroducationContentUpdated(mappedCourse.id, introductionContent, modifiedOn.toISOString());

                expect(dataContext.courses[0].modifiedOn.toISOString()).toBe(modifiedOn.toISOString());
            });

            it('should trigger app event', function () {
                dataContext.courses = [mappedCourse];
                handler.courseIntroducationContentUpdated(mappedCourse.id, introductionContent, modifiedOn.toISOString());
                expect(app.trigger).toHaveBeenCalled();
            });
        });

    });

})