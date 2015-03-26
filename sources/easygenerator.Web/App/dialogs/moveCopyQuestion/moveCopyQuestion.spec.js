define(['dialogs/moveCopyQuestion/moveCopyQuestion'], function (viewModel) {
    'use strict';

    var
        router = require('plugins/router'),
        eventTracker = require('eventTracker'),
        dataContext = require('dataContext'),
        localizationManager = require('localization/localizationManager'),
        questionRepository =require('repositories/questionRepository');

    describe('moveCopyQuestionDialog', function () {

        var ids = {
            courseId: 'courseId',
            objectiveId: 'objectiveId',
            questionId: 'questionId'
        };

        beforeEach(function() {
            spyOn(eventTracker, 'publish');
        });

        describe('isShown', function () {

            it('should be observable', function() {
                expect(viewModel.isShown).toBeObservable();
            });

        });

        describe('courseId', function () {

            it('should be string', function() {
                expect(viewModel.courseId).toBeString();
            });

        });

        describe('objectiveId', function () {

            it('should be string', function () {
                expect(viewModel.objectiveId).toBeString();
            });

        });

        describe('questionId', function () {

            it('should be string', function () {
                expect(viewModel.questionId).toBeString();
            });

        });

        describe('show:', function () {

            it('should be function', function() {
                expect(viewModel.show).toBeFunction();
            });

            it('should send event \'Open move/copy question dialog\'', function () {
                viewModel.show();
                expect(eventTracker.publish).toHaveBeenCalledWith('Open move/copy question dialog');
            });

            it('should show dialog', function() {
                viewModel.isShown(false);
                viewModel.show();
                expect(viewModel.isShown()).toBeTruthy();
            });

            it('should set copy mode', function() {
                viewModel.isCopy(false);
                viewModel.show();
                expect(viewModel.isCopy()).toBeTruthy();
            });

            it('should set courseId', function() {
                viewModel.courseId = '';
                viewModel.show(ids.courseId);
                expect(viewModel.courseId).toBe(ids.courseId);
            });

            it('should set objectiveId', function () {
                viewModel.objectiveId = '';
                viewModel.show(ids.courseId, ids.objectiveId);
                expect(viewModel.objectiveId).toBe(ids.objectiveId);
            });

            it('should set questionId', function () {
                viewModel.questionId = '';
                viewModel.show(ids.courseId, ids.objectiveId, ids.questionId);
                expect(viewModel.questionId).toBe(ids.questionId);
            });

            it('should set selected objectiveId', function() {
                viewModel.show(ids.courseId, ids.objectiveId, ids.questionId);
                expect(viewModel.selectedObjective()).toBe(ids.objectiveId);
            });

            it('should set object allObjectives', function () {
                viewModel.allObjectives({});
                viewModel.show();
                expect(viewModel.allObjectives().title).toBe('All objectives');
                expect(viewModel.allObjectives().objectives()).toBe(dataContext.objectives);
                expect(viewModel.allObjectives().isSelected).toBeObservable();
            });

            describe('when courseId is defined', function() {

                it('should select course from dataContext', function() {
                    dataContext.courses = [
                        {
                            id: 'courseId',
                            title: 'courseTitle',
                            objectives: [{}],
                        }
                    ];

                    viewModel.show(ids.courseId, ids.objectiveId, ids.questionId);
                    expect(viewModel.selectedCourse().id).toBe(dataContext.courses[0].id);
                    expect(viewModel.selectedCourse().title).toBe(dataContext.courses[0].title);
                    expect(viewModel.selectedCourse().objectives).toBe(dataContext.courses[0].objectives);
                    expect(viewModel.selectedCourse().objectvesListEmpty).toBe(dataContext.courses[0].objectives === 0);
                });

            });

            describe('when courseId is undefined', function() {

                it('should set select to allObjectives', function () {
                    viewModel.show(null, ids.objectiveId, ids.questionId);
                    expect(viewModel.selectedCourse().title).toBe('All objectives');
                    expect(viewModel.selectedCourse().objectives()).toBe(dataContext.objectives);
                    expect(viewModel.selectedCourse().isSelected()).toBeTruthy();
                });

            });

        });

        describe('hide', function() {

            it('should be function', function() {
                expect(viewModel.hide).toBeFunction();
            });

            it('should hide dialog', function() {
                viewModel.isShown(true);
                viewModel.hide();
                expect(viewModel.isShown()).toBeFalsy();
            });

        });

        describe('changeMoveCopyAction:', function () {

            it('should be function', function() {
                expect(viewModel.changeMoveCopyAction).toBeFunction();
            });

            describe('when action is copy', function () {

                it('should send event \'Switch to "copy" item\'', function () {
                    viewModel.isCopy(true);
                    viewModel.changeMoveCopyAction();
                    expect(eventTracker.publish).toHaveBeenCalledWith('Switch to "copy" item');
                });

            });

            describe('when action is move', function () {

                it('should send event \'Switch to "move" item\'', function () {
                    viewModel.isCopy(false);
                    viewModel.changeMoveCopyAction();
                    expect(eventTracker.publish).toHaveBeenCalledWith('Switch to "move" item');
                });

            });

        });

        describe('selectedCourse', function () {

            it('should be observable', function() {
                expect(viewModel.selectedCourse).toBeObservable();
            });

        });

        describe('selectCourse:', function () {

            it('should be function', function() {
                expect(viewModel.selectCourse).toBeFunction();
            });

            describe('when argument is not course', function() {
                


            });

            describe('when argument is course', function() {
                
            });

        });

        describe('selectedObjective', function () {

            it('should be observable', function() {
                expect(viewModel.selectedObjective).toBeObservable();
            });

        });

        describe('selectObjective:', function () {

            it('should be function', function() {
                expect(viewModel.selectObjective).toBeFunction();
            });

            it('should set selected objective id', function() {
                var objective = {
                    id: 'someid'
                };
                viewModel.selectedObjective('');
                viewModel.selectObjective(objective);
                expect(viewModel.selectedObjective()).toBe(objective.id);
            });

        });

        describe('courses', function () {

            it('should be observable', function() {
                expect(viewModel.courses).toBeObservable();
            });

        });

        describe('allObjectives', function () {

            it('should be observable', function() {
                expect(viewModel.allObjectives).toBeObservable();
            });

        });

        describe('moveQuestion:', function () {

            it('should be function', function() {
                expect(viewModel.moveQuestion).toBeFunction();
            });

            it('should send event \'Move item\'', function () {
                viewModel.moveQuestion();
                expect(eventTracker.publish).toHaveBeenCalledWith('Move item');
            });

        });

        describe('copyQuestion:', function () {

            it('should be function', function() {
                expect(viewModel.copyQuestion).toBeFunction();
            });

            it('should send event \'Copy item\'', function () {
                viewModel.copyQuestion();
                expect(eventTracker.publish).toHaveBeenCalledWith('Copy item');
            });

        });

        /*
        selectCourse: selectCourse,
        
        moveQuestion: moveQuestion,
        copyQuestion: copyQuestion,*/

    });
});