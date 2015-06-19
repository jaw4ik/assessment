define(['viewmodels/learningPaths/learningPath/courseBrief'], function (ctor) {
    "use strict";

    var app = require('durandal/app'),
        constants = require('constants')
    ;

    describe('viewModel learning path [courseBrief]', function () {
        var course = {
            id: 'id',
            title: 'title',
            modifiedOn: new Date(),
            template: {
                thumbnail: 'img'
            }
        },
            lang = 'en',
            viewModel;

        beforeEach(function () {
            spyOn(app, 'trigger');
            viewModel = ctor(course);
        });

        describe('title:', function () {
            it('should be defined', function () {
                expect(viewModel.title()).toBe(course.title);
            });
        });

        describe('currentLanguage:', function () {
            it('should be defined', function () {
                expect(viewModel.currentLanguage).toBeDefined();
            });
        });

        describe('id:', function () {
            it('should be defined', function () {
                expect(viewModel.id).toBe(course.id);
            });
        });

        describe('modifiedOn:', function () {
            it('should be defined', function () {
                expect(viewModel.modifiedOn()).toBe(course.modifiedOn);
            });
        });

        describe('thumbnail:', function () {
            it('should be defined', function () {
                expect(viewModel.thumbnail()).toBe(course.template.thumbnail);
            });
        });

        describe('activate:', function () {
            it('should set currentLanguage', function () {
                viewModel.currentLanguage = null;
                viewModel.activate(lang);
                expect(viewModel.currentLanguage).toBe(lang);
            });
        });

        describe('remove:', function() {
            it('should trigger learningPath.removeCourse app event', function () {
                viewModel.remove();
                expect(app.trigger).toHaveBeenCalledWith(constants.messages.learningPath.removeCourse, course.id);
            });
        });

    });

});