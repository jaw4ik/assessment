﻿define(['dialogs/moveCopyQuestion/moveCopyQuestion'], function (viewModel) {
    'use strict';

    var
        router = require('plugins/router'),
        eventTracker = require('eventTracker'),
        dataContext = require('dataContext'),
        localizationManager = require('localization/localizationManager'),
        questionRepository =require('repositories/questionRepository'),
        notify = require('notify');

    describe('moveCopyQuestionDialog', function () {

        var ids = {
                courseId: 'courseId',
                objectiveId: 'objectiveId',
                questionId: 'questionId'
            },
            moveQuestionDefer,
            copyQuestionDefer,
            allObjectivesTitle = 'title';

        beforeEach(function () {
            moveQuestionDefer = Q.defer();
            copyQuestionDefer = Q.defer();
            spyOn(questionRepository, 'moveQuestion').and.returnValue(moveQuestionDefer.promise);
            spyOn(questionRepository, 'copyQuestion').and.returnValue(copyQuestionDefer.promise);
            spyOn(eventTracker, 'publish');
            spyOn(router, 'navigate');
            spyOn(localizationManager, 'localize').and.returnValue(allObjectivesTitle);
            spyOn(notify, 'error');
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
                expect(viewModel.selectedObjectiveId()).toBe(ids.objectiveId);
            });

            it('should set object allObjectives', function () {
                viewModel.allObjectives({});
                viewModel.show();
                expect(viewModel.allObjectives().title).toBe(allObjectivesTitle);
                expect(viewModel.allObjectives().objectives).toBe(dataContext.objectives);
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
                    expect(viewModel.selectedCourse().title).toBe(allObjectivesTitle);
                    expect(viewModel.selectedCourse().objectives).toBe(dataContext.objectives);
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

            it('should select course', function () {
                viewModel.selectedCourse(null);
                viewModel.selectCourse({ id: 'This is id!', objectives: [], objectvesListEmpty: true });
                expect(viewModel.selectedCourse().id).toBe('This is id!');
            });

            describe('when selected course has objectives', function() {

                it('should set selected objective id', function() {
                    viewModel.selectedObjectiveId(null);
                    viewModel.selectCourse({ id: 'This is id!', objectives: [{id: 1}], objectvesListEmpty: false });
                    expect(viewModel.selectedObjectiveId()).toBe(1);
                });

            });

            describe('when selected course has objectives', function () {

                it('should set selected objective id to null', function () {
                    viewModel.selectedObjectiveId(1);
                    viewModel.selectCourse({ id: 'This is id!', objectives: [], objectvesListEmpty: true });
                    expect(viewModel.selectedObjectiveId()).toBe(null);
                });

            });

        });

        describe('selectedObjectiveId', function () {

            it('should be observable', function() {
                expect(viewModel.selectedObjectiveId).toBeObservable();
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
                viewModel.selectedObjectiveId('');
                viewModel.selectObjective(objective);
                expect(viewModel.selectedObjectiveId()).toBe(objective.id);
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
            var objectiveId = 'selectedObjectiveId';

            beforeEach(function() {
                viewModel.selectedObjectiveId(objectiveId);
            });

            it('should be function', function() {
                expect(viewModel.moveQuestion).toBeFunction();
            });

            describe('when selected objective is not valid', function () {

                describe('when objective is not selected', function () {

                    beforeEach(function() {
                        viewModel.selectedObjectiveId(null);
                    });

                    it('should show notify error', function () {
                        viewModel.moveQuestion();
                        expect(localizationManager.localize).toHaveBeenCalledWith('moveCopyErrorMessage');
                        expect(notify.error).toHaveBeenCalledWith(allObjectivesTitle);
                    });

                });

                describe('when objective is selected', function() {

                    describe('and when objective is not found in course', function() {

                        beforeEach(function() {
                            dataContext.courses = [{
                                    id: 1,
                                    objectives: [{
                                            id: 1
                                        }, {
                                            id: 2
                                        }
                                    ]
                                }
                            ];
                            viewModel.selectedCourse(dataContext.courses[0]);
                            viewModel.selectedObjectiveId(3);
                        });

                        it('should show notify error', function () {
                            viewModel.moveQuestion();
                            expect(localizationManager.localize).toHaveBeenCalledWith('learningObjectiveHasBeenDisconnectedByCollaborator');
                            expect(notify.error).toHaveBeenCalledWith(allObjectivesTitle);
                        });

                    });

                    describe('and when objective is not found dataContext objectives', function () {

                        beforeEach(function () {
                            var allobjs = [
                                {
                                    id: 1
                                }, {
                                    id: 2
                                }
                            ];
                            dataContext.objectives = allobjs;
                            viewModel.allObjectives(allobjs);
                            viewModel.selectedObjectiveId(3);
                            viewModel.selectedCourse(allobjs);
                        });

                        it('should show notify error', function () {
                            viewModel.moveQuestion();
                            expect(localizationManager.localize).toHaveBeenCalledWith('learningObjectiveHasBeenDisconnectedByCollaborator');
                            expect(notify.error).toHaveBeenCalledWith(allObjectivesTitle);
                        });

                    });

                });

            });

            describe('when selected objective is valid', function () {

                beforeEach(function() {
                    var allobjs = [
                        {
                            id: 1
                        }, {
                            id: 2
                        }
                    ];
                    dataContext.objectives = allobjs;
                    viewModel.allObjectives(allobjs);
                    viewModel.selectedObjectiveId(2);
                    viewModel.selectedCourse(allobjs);
                });

                it('should send event \'Move item\'', function () {
                    viewModel.moveQuestion();
                    expect(eventTracker.publish).toHaveBeenCalledWith('Move item');
                });

                describe('when current objective id equal selected objective id', function () {

                    it('should hide popup', function() {
                        viewModel.objectiveId = 1;
                        viewModel.selectedObjectiveId(1);
                        viewModel.moveQuestion();
                        expect(viewModel.isShown()).toBeFalsy();
                    });

                });

                describe('when current objective id not equal selected objective id', function () {
                    var currentObjectiveId = 1,
                        selectedObjectiveId = 2;

                    beforeEach(function () {
                        viewModel.questionId = 'questionId';
                        viewModel.courseId = 'courseId';
                        viewModel.objectiveId = currentObjectiveId;
                        viewModel.selectedObjectiveId(selectedObjectiveId);
                    });

                    it('should call moveQuestion from repository', function () {
                        viewModel.moveQuestion();
                        expect(questionRepository.moveQuestion).toHaveBeenCalledWith(viewModel.questionId, viewModel.objectiveId, viewModel.selectedObjectiveId());
                    });

                    describe('when question was move', function () {
                        var newQuestionId;
                        beforeEach(function () {
                            newQuestionId = 'newQuestionId';
                            moveQuestionDefer.resolve({ id: newQuestionId });
                        });

                        it('should hide popup', function (done) {
                            viewModel.moveQuestion();

                            moveQuestionDefer.promise.fin(function () {
                                expect(viewModel.isShown()).toBeFalsy();
                                done();
                            });
                        });

                        describe('when course is undefined', function () {

                            beforeEach(function () {
                                viewModel.courseId = null;
                            });

                            it('should navigate to current objective', function (done) {
                                viewModel.moveQuestion();

                                moveQuestionDefer.promise.fin(function () {
                                    expect(router.navigate).toHaveBeenCalledWith('objective/' + viewModel.objectiveId);
                                    done();
                                });
                            });

                        });

                        describe('when course is not undefined', function () {

                            beforeEach(function () {
                                viewModel.courseId = 'courseid';
                            });

                            it('should navigate to current objective', function (done) {
                                viewModel.moveQuestion();

                                moveQuestionDefer.promise.fin(function () {
                                    expect(router.navigate).toHaveBeenCalledWith('objective/' + viewModel.objectiveId + '?courseId=' + viewModel.courseId);
                                    done();
                                });
                            });

                        });

                    });

                });

            });

        });

        describe('copyQuestion:', function () {

            var currentObjectiveId = 1,
                selectedObjectiveId = 2;

            beforeEach(function () {
                viewModel.questionId = 'questionId';
                viewModel.courseId = 1;
                viewModel.objectiveId = currentObjectiveId;
                viewModel.selectedObjectiveId(selectedObjectiveId);
            });

            it('should be function', function() {
                expect(viewModel.copyQuestion).toBeFunction();
            });

            describe('when selected objective is not valid', function () {

                describe('when objective is not selected', function () {

                    beforeEach(function () {
                        viewModel.selectedObjectiveId(null);
                    });

                    it('should show notify error', function () {
                        viewModel.copyQuestion();
                        expect(localizationManager.localize).toHaveBeenCalledWith('moveCopyErrorMessage');
                        expect(notify.error).toHaveBeenCalledWith(allObjectivesTitle);
                    });

                });

                describe('when objective is selected', function () {

                    describe('and when course not found in dataContext', function() {
                        
                        beforeEach(function () {
                            dataContext.courses = [];
                            var course = {
                                id: 1,
                                objectives: [
                                    {
                                        id: 1
                                    }, {
                                        id: 2
                                    }
                                ]
                            };
                            viewModel.selectedCourse(course);
                            viewModel.selectedObjectiveId(3);
                        });

                        it('should show notify error', function () {
                            viewModel.copyQuestion();
                            expect(localizationManager.localize).toHaveBeenCalledWith('courseIsNotAvailableAnyMore');
                            expect(notify.error).toHaveBeenCalledWith(allObjectivesTitle);
                        });

                    });

                    describe('and when objective is not found in course', function () {

                        beforeEach(function () {
                            dataContext.courses = [{
                                id: 1,
                                objectives: [{
                                    id: 1
                                }, {
                                    id: 2
                                }
                                ]
                            }
                            ];
                            viewModel.selectedCourse(dataContext.courses[0]);
                            viewModel.selectedObjectiveId(3);
                        });

                        it('should show notify error', function () {
                            viewModel.copyQuestion();
                            expect(localizationManager.localize).toHaveBeenCalledWith('learningObjectiveHasBeenDisconnectedByCollaborator');
                            expect(notify.error).toHaveBeenCalledWith(allObjectivesTitle);
                        });

                    });

                    describe('and when objective is not found dataContext objectives', function () {

                        beforeEach(function () {
                            var allobjs = [
                                {
                                    id: 1
                                }, {
                                    id: 2
                                }
                            ];
                            dataContext.objectives = allobjs;
                            viewModel.allObjectives(allobjs);
                            viewModel.selectedObjectiveId(3);
                            viewModel.selectedCourse(allobjs);
                        });

                        it('should show notify error', function () {
                            viewModel.copyQuestion();
                            expect(localizationManager.localize).toHaveBeenCalledWith('learningObjectiveHasBeenDisconnectedByCollaborator');
                            expect(notify.error).toHaveBeenCalledWith(allObjectivesTitle);
                        });

                    });

                });

            });

            describe('when selected objective is valid', function () {
                var allobjs;
                beforeEach(function () {
                    allobjs = [{ id: 1 }, { id: 2 }];
                    dataContext.courses = [{
                        id: 1,
                        objectives: [{
                            id: 1
                        }, {
                            id: 2
                        }]
                    }];
                    dataContext.objectives = allobjs;
                    viewModel.allObjectives(allobjs);
                    viewModel.selectedObjectiveId(1);
                    viewModel.selectedCourse(dataContext.courses[0]);
                });

                it('should send event \'Copy item\'', function () {
                    viewModel.copyQuestion();
                    expect(eventTracker.publish).toHaveBeenCalledWith('Copy item');
                });

                it('should call copyQuestion from repository', function () {
                    viewModel.copyQuestion();
                    expect(questionRepository.copyQuestion).toHaveBeenCalledWith(viewModel.questionId, viewModel.selectedObjectiveId());
                });

                describe('and when question was copy', function () {
                    var newQuestionId;

                    beforeEach(function () {
                        newQuestionId = 'newQuestionId';
                        copyQuestionDefer.resolve({ id: newQuestionId });
                    });

                    it('should hide popup', function (done) {
                        viewModel.copyQuestion();

                        copyQuestionDefer.promise.fin(function () {
                            expect(viewModel.isShown()).toBeFalsy();
                            done();
                        });
                    });

                    describe('when course is undefined', function () {

                        beforeEach(function () {
                            viewModel.selectedCourse(allobjs);
                        });

                        it('should navigate to new question', function (done) {
                            viewModel.copyQuestion();

                            copyQuestionDefer.promise.fin(function () {
                                expect(router.navigate).toHaveBeenCalledWith('objective/' + viewModel.selectedObjectiveId() + '/question/' + newQuestionId);
                                done();
                            });
                        });

                    });

                    describe('when course is not undefined', function (done) {

                        beforeEach(function () {
                            viewModel.courseId = 'courseid';
                        });

                        it('should navigate to new question in course', function () {
                            viewModel.moveQuestion();

                            copyQuestionDefer.promise.fin(function () {
                                expect(router.navigate).toHaveBeenCalledWith('objective/' + viewModel.selectedObjectiveId() + '/question/' + newQuestionId + '?courseId=' + viewModel.courseId);
                                done();
                            });
                        });

                    });
                });

            });
            
        });

    });
});