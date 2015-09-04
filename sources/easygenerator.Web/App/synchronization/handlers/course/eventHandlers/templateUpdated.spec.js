define(['synchronization/handlers/course/eventHandlers/templateUpdated'], function (handler) {
    "use strict";

    var
        dataContext = require('dataContext'),
        app = require('durandal/app'),
        templateRepository = require('repositories/templateRepository'),
        templateModelMapper = require('mappers/templateModelMapper'),
        emptyTemplate = { Manifest: '{ "name": "TemplateName" }' },
        constants = require('constants')
    ;

    describe('synchronization course [templateUpdated]', function () {

        var course = { Id: 'courseId' },
            mappedCourse = { id: course.Id, collaborators: [] };

        beforeEach(function () {
            spyOn(app, 'trigger');
            emptyTemplate = { Manifest: '{ "name": "TemplateName" }' };
            spyOn(templateModelMapper, 'map').and.returnValue(emptyTemplate);
            spyOn(templateRepository, 'add').and.returnValue(emptyTemplate);
            spyOn(templateRepository, 'getById').and.returnValue(emptyTemplate);
        });

        var templateId = "templateId",
            modifiedOn = new Date(),
            template = { id: templateId };

        it('should be function', function () {
            expect(handler).toBeFunction();
        });

        describe('when courseId is not a string', function () {
            it('should throw an exception', function () {
                var f = function () {
                    handler(undefined, emptyTemplate, modifiedOn.toISOString());
                };

                expect(f).toThrow('CourseId is not a string');
            });
        });

        describe('when templateId is not a string', function () {
            it('should throw an exception', function () {
                var f = function () {
                    handler(mappedCourse.id, undefined, modifiedOn.toISOString());
                };

                expect(f).toThrow('Template is not an object');
            });
        });

        describe('when modifiedOn is not a date', function () {
            it('should throw an exception', function () {
                var f = function () {
                    handler(mappedCourse.id, emptyTemplate, undefined);
                };

                expect(f).toThrow('ModifiedOn is not a string');
            });
        });

        describe('when course is not found in data context', function () {
            it('should throw an exception', function () {
                dataContext.courses = [];

                var f = function () {
                    handler(mappedCourse.id, emptyTemplate, modifiedOn.toISOString());
                };

                expect(f).toThrow('Course has not been found');
            });
        });

        it('should add mapped template to repository if not exists', function () {
            dataContext.courses = [mappedCourse];
            dataContext.templates = [];
            handler(mappedCourse.id, emptyTemplate, modifiedOn.toISOString());
            expect(templateModelMapper.map).toHaveBeenCalledWith(emptyTemplate);
            expect(templateRepository.add).toHaveBeenCalledWith(emptyTemplate);
        });

        it('should update course template', function () {
            mappedCourse.template = {};
            dataContext.courses = [mappedCourse];
            dataContext.templates = [template];

            handler(mappedCourse.id, template, modifiedOn.toISOString());
            expect(mappedCourse.template).toBe(emptyTemplate);
        });

        it('should update course modified on date', function () {
            mappedCourse.modifiedOn = "";
            dataContext.courses = [mappedCourse];
            dataContext.templates = [template];
            handler(mappedCourse.id, emptyTemplate, modifiedOn.toISOString());

            expect(dataContext.courses[0].modifiedOn.toISOString()).toBe(modifiedOn.toISOString());
        });

        it('should trigger app event', function () {
            dataContext.courses = [mappedCourse];
            dataContext.templates = [template];
            handler(mappedCourse.id, emptyTemplate, modifiedOn.toISOString());
            expect(app.trigger).toHaveBeenCalledWith(constants.messages.course.templateUpdatedByCollaborator, mappedCourse);
        });
    });

})