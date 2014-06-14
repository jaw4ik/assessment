define(['synchronization/handlers/course/eventHandlers/templateUpdated'], function (handler) {
    "use strict";

    var
        dataContext = require('dataContext'),
        app = require('durandal/app')
    ;

    describe('synchronization course [templateUpdated]', function () {

        var course = { Id: 'courseId' },
            mappedCourse = { id: course.Id, collaborators: [] };

        beforeEach(function () {
            spyOn(app, 'trigger');
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
                    handler(undefined, templateId, modifiedOn.toISOString());
                };

                expect(f).toThrow('CourseId is not a string');
            });
        });

        describe('when templateId is not a string', function () {
            it('should throw an exception', function () {
                var f = function () {
                    handler(mappedCourse.id, undefined, modifiedOn.toISOString());
                };

                expect(f).toThrow('TemplateId content is not a string');
            });
        });

        describe('when modifiedOn is not a date', function () {
            it('should throw an exception', function () {
                var f = function () {
                    handler(mappedCourse.id, templateId, undefined);
                };

                expect(f).toThrow('ModifiedOn is not a string');
            });
        });

        describe('when course is not found in data context', function () {
            it('should throw an exception', function () {
                dataContext.courses = [];

                var f = function () {
                    handler(mappedCourse.id, templateId, modifiedOn.toISOString());
                };

                expect(f).toThrow('Course has not been found');
            });
        });

        describe('when template is not found in data context', function () {
            it('should throw an exception', function () {
                dataContext.courses = [mappedCourse];
                dataContext.templates = [];

                var f = function () {
                    handler(mappedCourse.id, templateId, modifiedOn.toISOString());
                };

                expect(f).toThrow('Template has not been found');
            });
        });

        it('should update course title', function () {
            mappedCourse.template = {};
            dataContext.courses = [mappedCourse];
            dataContext.templates = [template];

            handler(mappedCourse.id, templateId, modifiedOn.toISOString());
            expect(mappedCourse.template).toBe(template);
        });

        it('should update course modified on date', function () {
            mappedCourse.modifiedOn = "";
            dataContext.courses = [mappedCourse];
            dataContext.templates = [template];
            handler(mappedCourse.id, templateId, modifiedOn.toISOString());

            expect(dataContext.courses[0].modifiedOn.toISOString()).toBe(modifiedOn.toISOString());
        });

        it('should trigger app event', function () {
            dataContext.courses = [mappedCourse];
            dataContext.templates = [template];
            handler(mappedCourse.id, templateId, modifiedOn.toISOString());
            expect(app.trigger).toHaveBeenCalled();
        });
    });

})