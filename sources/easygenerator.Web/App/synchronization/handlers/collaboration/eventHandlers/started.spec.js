import handler from './started';

import dataContext from 'dataContext';
import app from 'durandal/app';
import courseModelMapper from 'mappers/courseModelMapper';
import templateRepository from 'repositories/templateRepository';
import templateModelMapper from 'mappers/templateModelMapper';
var emptyTemplate = { Manifest: '{ "name": "TemplateName" }' };

describe('synchronization collaboration [started]', function () {

    var course = { Id: 'courseId' };

    beforeEach(function () {
        emptyTemplate = { Manifest: '{ "name": "TemplateName" }' };
        spyOn(app, 'trigger');
        spyOn(courseModelMapper, 'map').and.returnValue(course);
        spyOn(templateModelMapper, 'map').and.returnValue(emptyTemplate);
        spyOn(templateRepository, 'add').and.returnValue(emptyTemplate);
    });

    it('should be function', function () {
        expect(handler).toBeFunction();
    });

    describe('when course is not an object', function () {
        it('should throw an exception', function () {
            var f = function () {
                handler(undefined, []);
            };

            expect(f).toThrow('Course is not an object');
        });
    });

    describe('when objectives is not an array', function () {
        it('should throw an exception', function () {
            var f = function () {
                handler(course, undefined);
            };

            expect(f).toThrow('Objectives is not an array');
        });
    });

    describe('when course is not found in dataContext', function () {

        it('should add mapped course to data context', function () {
            dataContext.courses = [];
            handler(course, [], emptyTemplate);

            expect(dataContext.courses.length).toBe(1);
        });

    });

    describe('when objective is not found in dataContext', function () {

        var objective = { Id: 'id' };

        it('should add objective to data context', function () {
            var existingCourse = { id: course.Id, collaborators: [], objectives: [] };
            dataContext.courses = [existingCourse];
            dataContext.objectives = [];

            handler(course, [objective], emptyTemplate);

            expect(dataContext.objectives.length).toBe(1);
        });

    });

    describe('when objective is found in dataContext', function () {

        var objective = { Id: 'id' };

        it('should not add objective to data context', function () {
            var existingCourse = { id: course.Id, collaborators: [], objectives: [] };
            dataContext.courses = [existingCourse];
            dataContext.objectives = [{ id: objective.Id }];

            handler(course, [objective], emptyTemplate);

            expect(dataContext.objectives.length).toBe(1);
        });

    });

    it('should add template to repository if not exist', function () {
        dataContext.templates = [];
        handler(course, [], emptyTemplate);
        expect(templateModelMapper.map).toHaveBeenCalledWith(emptyTemplate);
        expect(templateRepository.add).toHaveBeenCalledWith(emptyTemplate);
    });

    it('should trigger app event', function () {
        handler(course, [], emptyTemplate);
        expect(app.trigger).toHaveBeenCalled();
    });
});
