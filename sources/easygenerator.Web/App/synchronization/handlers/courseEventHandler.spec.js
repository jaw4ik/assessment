define(['synchronization/handlers/courseEventHandler'], function (handler) {
    "use strict";

    var
        dataContext = require('dataContext'),
        app = require('durandal/app'),
        collaboratorModelMapper = require('mappers/collaboratorModelMapper'),
        courseModelMapper = require('mappers/courseModelMapper'),
        objectiveModelMapper = require('mappers/objectiveModelMapper')
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

        describe('collaborationStarted', function () {

            it('should be function', function () {
                expect(handler.collaborationStarted).toBeFunction();
            });

            describe('when course is not an object', function () {
                it('should throw an exception', function () {
                    var f = function () {
                        handler.collaborationStarted(undefined, [], user);
                    };

                    expect(f).toThrow('Course is not an object');
                });
            });

            describe('when objectives is not an array', function () {
                it('should throw an exception', function () {
                    var f = function () {
                        handler.collaborationStarted(course, undefined, user);
                    };

                    expect(f).toThrow('Objectives is not an array');
                });
            });

            describe('when user is not an object', function () {
                it('should throw an exception', function () {
                    var f = function () {
                        handler.collaborationStarted(course, [], undefined);
                    };

                    expect(f).toThrow('User is not an object');
                });
            });

            describe('when course is found in dataContext', function () {

                it('should add collaborator to course', function () {
                    var existingCourse = { id: course.Id, collaborators: [] };
                    dataContext.courses = [existingCourse];

                    handler.collaborationStarted(course, [], user);

                    expect(existingCourse.collaborators.length).toBe(1);
                });

            });

            describe('when course is not found in dataContext', function () {

                it('should add mapped course to data context', function () {
                    dataContext.courses = [];
                    handler.collaborationStarted(course, [], user);

                    expect(dataContext.courses.length).toBe(1);
                });

            });

            describe('when objective is not found in dataContext', function () {

                var objective = { Id: 'id' };

                it('should add objective to data context', function () {
                    var existingCourse = { id: course.Id, collaborators: [], objectives: [] };
                    dataContext.courses = [existingCourse];
                    dataContext.objectives = [];

                    handler.collaborationStarted(course, [objective], user);

                    expect(dataContext.objectives.length).toBe(1);
                });

            });

            describe('when objective is found in dataContext', function () {

                var objective = { Id: 'id' };

                it('should not add objective to data context', function () {
                    var existingCourse = { id: course.Id, collaborators: [], objectives: [] };
                    dataContext.courses = [existingCourse];
                    dataContext.objectives = [{ id: objective.Id }];

                    handler.collaborationStarted(course, [objective], user);

                    expect(dataContext.objectives.length).toBe(1);
                });

            });

            it('should trigger app event', function () {
                handler.collaborationStarted(course, [], user);
                expect(app.trigger).toHaveBeenCalled();
            });
        });

        describe('collaboratorAdded:', function () {

            it('should be function', function () {
                expect(handler.collaboratorAdded).toBeFunction();
            });

            describe('when courseId is not a string', function () {
                it('should throw an exception', function () {
                    var f = function () {
                        handler.collaboratorAdded(undefined, user);
                    };

                    expect(f).toThrow('courseId is not a string');
                });
            });

            describe('when user is not an object', function () {
                it('should throw an exception', function () {
                    var f = function () {
                        handler.collaboratorAdded(course.Id, undefined);
                    };

                    expect(f).toThrow('User is not an object');
                });
            });

            describe('when course is found in dataContext', function () {

                it('should throw an exception', function () {
                    dataContext.courses = [];
                    var f = function () {
                        handler.collaboratorAdded(course.Id, user);
                    };

                    expect(f).toThrow('Course is not an object');
                });

            });

            it('should add collaborator to course in data context', function () {
                dataContext.courses = [mappedCourse];
                handler.collaboratorAdded(mappedCourse.id, user);

                expect(dataContext.courses[0].collaborators.length).toBe(1);
            });

            it('should trigger app event', function () {
                handler.collaboratorAdded(course.Id, user);
                expect(app.trigger).toHaveBeenCalled();
            });
        });

        describe('titleUpdated:', function () {

            var title = "title",
                modifiedOn = new Date();

            it('should be function', function () {
                expect(handler.titleUpdated).toBeFunction();
            });

            describe('when courseId is not a string', function () {
                it('should throw an exception', function () {
                    var f = function () {
                        handler.titleUpdated(undefined, title, modifiedOn.toISOString());
                    };

                    expect(f).toThrow('CourseId is not a string');
                });
            });

            describe('when title is not a string', function () {
                it('should throw an exception', function () {
                    var f = function () {
                        handler.titleUpdated(mappedCourse.id, undefined, modifiedOn.toISOString());
                    };

                    expect(f).toThrow('Title is not a string');
                });
            });

            describe('when modifiedOn is not a date', function () {
                it('should throw an exception', function () {
                    var f = function () {
                        handler.titleUpdated(mappedCourse.id, title, undefined);
                    };

                    expect(f).toThrow('ModifiedOn is not a string');
                });
            });

            describe('when course is not found in data context', function () {
                it('should throw an exception', function () {
                    dataContext.courses = [];

                    var f = function () {
                        handler.titleUpdated(mappedCourse.id, title, modifiedOn.toISOString());
                    };

                    expect(f).toThrow('Course has not been found');
                });
            });

            it('should update course title', function () {
                mappedCourse.title = "";
                dataContext.courses = [mappedCourse];
                handler.titleUpdated(mappedCourse.id, title, modifiedOn.toISOString());

                expect(dataContext.courses[0].title).toBe(title);
            });

            it('should update course modified on date', function () {
                mappedCourse.modifiedOn = "";
                dataContext.courses = [mappedCourse];
                handler.titleUpdated(mappedCourse.id, title, modifiedOn.toISOString());

                expect(dataContext.courses[0].modifiedOn.toISOString()).toBe(modifiedOn.toISOString());
            });

            it('should trigger app event', function () {
                dataContext.courses = [mappedCourse];
                handler.titleUpdated(mappedCourse.id, title, modifiedOn.toISOString());
                expect(app.trigger).toHaveBeenCalled();
            });
        });

        describe('introducationContentUpdated:', function () {

            var introductionContent = "introductionContent",
                modifiedOn = new Date();

            it('should be function', function () {
                expect(handler.introducationContentUpdated).toBeFunction();
            });

            describe('when courseId is not a string', function () {
                it('should throw an exception', function () {
                    var f = function () {
                        handler.introducationContentUpdated(undefined, introductionContent, modifiedOn.toISOString());
                    };

                    expect(f).toThrow('CourseId is not a string');
                });
            });

            describe('when introductionContent is not a string', function () {
                it('should throw an exception', function () {
                    var f = function () {
                        handler.introducationContentUpdated(mappedCourse.id, undefined, modifiedOn.toISOString());
                    };

                    expect(f).toThrow('Introduction content is not a string');
                });
            });

            describe('when modifiedOn is not a date', function () {
                it('should throw an exception', function () {
                    var f = function () {
                        handler.introducationContentUpdated(mappedCourse.id, introductionContent, undefined);
                    };

                    expect(f).toThrow('ModifiedOn is not a string');
                });
            });

            describe('when course is not found in data context', function () {
                it('should throw an exception', function () {
                    dataContext.courses = [];

                    var f = function () {
                        handler.introducationContentUpdated(mappedCourse.id, introductionContent, modifiedOn.toISOString());
                    };

                    expect(f).toThrow('Course has not been found');
                });
            });

            it('should update course introductionContent', function () {
                mappedCourse.title = "";
                dataContext.courses = [mappedCourse];
                handler.introducationContentUpdated(mappedCourse.id, introductionContent, modifiedOn.toISOString());

                expect(dataContext.courses[0].introductionContent).toBe(introductionContent);
            });

            it('should update course modified on date', function () {
                mappedCourse.modifiedOn = "";
                dataContext.courses = [mappedCourse];
                handler.introducationContentUpdated(mappedCourse.id, introductionContent, modifiedOn.toISOString());

                expect(dataContext.courses[0].modifiedOn.toISOString()).toBe(modifiedOn.toISOString());
            });

            it('should trigger app event', function () {
                dataContext.courses = [mappedCourse];
                handler.introducationContentUpdated(mappedCourse.id, introductionContent, modifiedOn.toISOString());
                expect(app.trigger).toHaveBeenCalled();
            });
        });

        describe('templateUpdated:', function () {
            var templateId = "templateId",
                modifiedOn = new Date(),
                template = { id: templateId };

            it('should be function', function () {
                expect(handler.templateUpdated).toBeFunction();
            });

            describe('when courseId is not a string', function () {
                it('should throw an exception', function () {
                    var f = function () {
                        handler.templateUpdated(undefined, templateId, modifiedOn.toISOString());
                    };

                    expect(f).toThrow('CourseId is not a string');
                });
            });

            describe('when templateId is not a string', function () {
                it('should throw an exception', function () {
                    var f = function () {
                        handler.templateUpdated(mappedCourse.id, undefined, modifiedOn.toISOString());
                    };

                    expect(f).toThrow('TemplateId content is not a string');
                });
            });

            describe('when modifiedOn is not a date', function () {
                it('should throw an exception', function () {
                    var f = function () {
                        handler.templateUpdated(mappedCourse.id, templateId, undefined);
                    };

                    expect(f).toThrow('ModifiedOn is not a string');
                });
            });

            describe('when course is not found in data context', function () {
                it('should throw an exception', function () {
                    dataContext.courses = [];

                    var f = function () {
                        handler.templateUpdated(mappedCourse.id, templateId, modifiedOn.toISOString());
                    };

                    expect(f).toThrow('Course has not been found');
                });
            });

            describe('when template is not found in data context', function () {
                it('should throw an exception', function () {
                    dataContext.courses = [mappedCourse];
                    dataContext.templates = [];

                    var f = function () {
                        handler.templateUpdated(mappedCourse.id, templateId, modifiedOn.toISOString());
                    };

                    expect(f).toThrow('Template has not been found');
                });
            });

            it('should update course title', function () {
                mappedCourse.template = {};
                dataContext.courses = [mappedCourse];
                dataContext.templates = [template];

                handler.templateUpdated(mappedCourse.id, templateId, modifiedOn.toISOString());
                expect(mappedCourse.template).toBe(template);
            });

            it('should update course modified on date', function () {
                mappedCourse.modifiedOn = "";
                dataContext.courses = [mappedCourse];
                dataContext.templates = [template];
                handler.templateUpdated(mappedCourse.id, templateId, modifiedOn.toISOString());

                expect(dataContext.courses[0].modifiedOn.toISOString()).toBe(modifiedOn.toISOString());
            });

            it('should trigger app event', function () {
                dataContext.courses = [mappedCourse];
                dataContext.templates = [template];
                handler.templateUpdated(mappedCourse.id, templateId, modifiedOn.toISOString());
                expect(app.trigger).toHaveBeenCalled();
            });
        });

        describe('objectivesReordered:', function () {

            var modifiedOn = new Date(),
                objectiveId1 = 'obj1',
                objectiveId2 = 'obj2',
                objectivesOrder = [objectiveId2, objectiveId1],
                objectives = [{ id: objectiveId1 }, { id: objectiveId2 }];

            it('should be function', function () {
                expect(handler.objectivesReordered).toBeFunction();
            });

            describe('when courseId is not a string', function () {
                it('should throw an exception', function () {
                    var f = function () {
                        handler.objectivesReordered(undefined, objectivesOrder, modifiedOn.toISOString());
                    };

                    expect(f).toThrow('CourseId is not a string');
                });
            });

            describe('when templateId is not a string', function () {
                it('should throw an exception', function () {
                    var f = function () {
                        handler.objectivesReordered(mappedCourse.id, undefined, modifiedOn.toISOString());
                    };

                    expect(f).toThrow('ObjectiveIds is not an array');
                });
            });

            describe('when modifiedOn is not a date', function () {
                it('should throw an exception', function () {
                    var f = function () {
                        handler.objectivesReordered(mappedCourse.id, objectivesOrder, undefined);
                    };

                    expect(f).toThrow('ModifiedOn is not a string');
                });
            });

            describe('when course is not found in data context', function () {
                it('should throw an exception', function () {
                    dataContext.courses = [];

                    var f = function () {
                        handler.objectivesReordered(mappedCourse.id, objectivesOrder, modifiedOn.toISOString());
                    };

                    expect(f).toThrow('Course has not been found');
                });
            });

            it('should update course objectives order', function () {
                mappedCourse.objectives = objectives;
                dataContext.courses = [mappedCourse];

                handler.objectivesReordered(mappedCourse.id, objectivesOrder, modifiedOn.toISOString());
                expect(dataContext.courses[0].objectives[0].id).toBe(objectiveId2);
                expect(dataContext.courses[0].objectives[1].id).toBe(objectiveId1);
            });

            it('should update course modified on date', function () {
                mappedCourse.modifiedOn = "";
                dataContext.courses = [mappedCourse];
                mappedCourse.objectives = objectives;

                handler.objectivesReordered(mappedCourse.id, objectivesOrder, modifiedOn.toISOString());
                expect(dataContext.courses[0].modifiedOn.toISOString()).toBe(modifiedOn.toISOString());
            });

            it('should trigger app event', function () {
                dataContext.courses = [mappedCourse];
                mappedCourse.objectives = objectives;

                handler.objectivesReordered(mappedCourse.id, objectivesOrder, modifiedOn.toISOString());
                expect(app.trigger).toHaveBeenCalled();
            });

        });

        describe('published:', function() {

            var url = 'url';

            it('should be function', function() {
                expect(handler.published).toBeFunction();
            });

            describe('when courseId is not a string', function () {
                it('should throw an exception', function () {
                    var f = function () {
                        handler.published(undefined, url);
                    };

                    expect(f).toThrow('CourseId is not a string');
                });
            });

            describe('when publicationUrl is not a string', function () {
                it('should throw an exception', function () {
                    var f = function () {
                        handler.published(mappedCourse.id, undefined);
                    };

                    expect(f).toThrow('PublicationUrl is not a string');
                });
            });

            describe('when course is not found in data context', function () {
                it('should throw an exception', function () {
                    dataContext.courses = [];

                    var f = function () {
                        handler.published(mappedCourse.id, url);
                    };

                    expect(f).toThrow('Course has not been found');
                });
            });

            it('should update course package url', function () {
                mappedCourse.publish = {};
                mappedCourse.publish.packageUrl = '';
                dataContext.courses = [mappedCourse];

                handler.published(mappedCourse.id, url);
                expect(mappedCourse.publish.packageUrl).toBe(url);
            });

            it('should trigger app event', function () {
                mappedCourse.packageUrl = '';
                dataContext.courses = [mappedCourse];
                handler.published(mappedCourse.id, url);
                expect(app.trigger).toHaveBeenCalled();
            });
        });

        describe('deleted:', function() {
            it('should be function', function() {
                expect(handler.deleted).toBeFunction();
            });

            describe('when courseId is not a string', function () {
                it('should throw an exception', function () {
                    var f = function () {
                        handler.deleted(undefined);
                    };

                    expect(f).toThrow('CourseId is not a string');
                });
            });

            describe('when course is not found', function() {
                it('should not trigger app event', function () {
                    dataContext.courses = [];
                    handler.deleted(mappedCourse.id);
                    expect(app.trigger).not.toHaveBeenCalled();
                });
            });

            it('should update course package url', function () {
                dataContext.courses = [mappedCourse];

                handler.deleted(mappedCourse.id);
                expect(dataContext.courses.length).toBe(0);
            });

            it('should trigger app event', function () {
                dataContext.courses = [mappedCourse];
                handler.deleted(mappedCourse.id);
                expect(app.trigger).toHaveBeenCalled();
            });

        });

    });

})