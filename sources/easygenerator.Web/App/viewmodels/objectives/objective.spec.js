define(['viewmodels/objectives/objective'],
    function (viewModel) {
        "use strict";

        var router = require('plugins/router'),
            eventTracker = require('eventTracker'),
            constants = require('constants'),
            repository = require('repositories/objectiveRepository'),
            experienceRepository = require('repositories/experienceRepository'),
            questionRepository = require('repositories/questionRepository'),
            localizationManager = require('localization/localizationManager'),
            notify = require('notify'),
            clientContext = require('clientContext');

        describe('viewModel [objective]', function () {

            var objective = {
                id: '1',
                title: 'Test Objective 1',
                createdOn: new Date(),
                modifiedOn: new Date(),
                image: '',
                questions: [
                    { id: 0, title: 'A' },
                    { id: 1, title: 'b' },
                    { id: 2, title: 'B' },
                    { id: 3, title: 'a' }
                ]
            };

            beforeEach(function () {
                spyOn(eventTracker, 'publish');
                spyOn(router, 'navigateWithQueryString');
                spyOn(router, 'navigate');
                spyOn(router, 'replace');
            });

            it('is object', function () {
                expect(viewModel).toBeObject();
            });

            describe('activate:', function () {

                var deferred, getExperienceDeferred;

                beforeEach(function () {
                    deferred = Q.defer();
                    getExperienceDeferred = Q.defer();
                    spyOn(repository, 'getById').andReturn(deferred.promise);
                    spyOn(experienceRepository, 'getById').andReturn(getExperienceDeferred.promise);
                });

                it('should be a function', function () {
                    expect(viewModel.activate).toBeFunction();
                });

                it('should set client context with current objective id', function () {
                    spyOn(clientContext, 'set');
                    var promise = viewModel.activate(objective.id, null);
                    deferred.resolve(null);

                    waitsFor(function () {
                        return promise.isFulfilled();
                    });
                    runs(function () {
                        expect(clientContext.set).toHaveBeenCalledWith('lastVisitedObjective', objective.id);
                    });

                });

                describe('when objective not found', function () {

                    beforeEach(function () {
                        deferred.resolve(null);
                    });

                    it('should navigate to #404', function () {
                        var promise = viewModel.activate(objective.id, null);
                        waitsFor(function () {
                            return promise.isFulfilled();
                        });
                        runs(function () {
                            expect(router.replace).toHaveBeenCalledWith('404');
                        });
                    });

                    it('should resolve promise with undefined', function () {
                        var promise = viewModel.activate(objective.id, null);
                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(promise).toBeResolvedWith(undefined);
                        });
                    });

                });

                describe('when objective exists', function () {
                    beforeEach(function () {
                        deferred.resolve(objective);
                    });

                    it('should return promise', function () {
                        expect(viewModel.activate('id')).toBePromise();
                    });

                    it('should set objective title', function () {
                        viewModel.title('');

                        var promise = viewModel.activate(objective.id, null);

                        waitsFor(function () {
                            return promise.isFulfilled();
                        });
                        runs(function () {
                            expect(viewModel.title()).toBe(objective.title);
                        });
                    });

                    it('should set currentLanguage', function() {
                        viewModel.currentLanguage = null;
                        viewModel.activate(objective.id, null);
                        expect(viewModel.currentLanguage).not.toBeNull();
                    });

                    it('should initialize questions collection', function () {
                        viewModel.questions([]);
                        var promise = viewModel.activate(objective.id, null);
                        waitsFor(function () {
                            return promise.isFulfilled();
                        });
                        runs(function () {
                            expect(viewModel.questions().length).toBe(objective.questions.length);
                        });
                    });

                    describe('when currentSortingOption is asc', function () {

                        it('should sort questions asc', function () {
                            viewModel.currentSortingOption(constants.sortingOptions.byTitleAsc);
                            var promise = viewModel.activate(objective.id, null);
                            waitsFor(function () {
                                return promise.isFulfilled();
                            });
                            runs(function () {
                                expect(viewModel.questions).toBeSortedAsc('title');
                            });
                        });

                    });

                    describe('when currentSortingOption is desc', function () {

                        it('should sort questions desc', function () {
                            viewModel.currentSortingOption(constants.sortingOptions.byTitleDesc);
                            var promise = viewModel.activate(objective.id, null);
                            waitsFor(function () {
                                return promise.isFulfilled();
                            });
                            runs(function () {
                                expect(viewModel.questions).toBeSortedDesc('title');
                            });
                        });

                    });

                });
            });

            describe('title:', function () {

                it('should be observable', function () {
                    expect(viewModel.title).toBeObservable();
                });

                describe('isEditing:', function () {

                    it('should be observable', function () {
                        expect(viewModel.title.isEditing).toBeObservable();
                    });

                });

                describe('isValid:', function () {

                    it('should be computed', function () {
                        expect(viewModel.title.isValid).toBeComputed();
                    });

                    describe('when title is empty', function () {

                        it('should be false', function () {
                            viewModel.title('');
                            expect(viewModel.title.isValid()).toBeFalsy();
                        });

                    });

                    describe('when title is longer than 255', function () {

                        it('should be false', function () {
                            viewModel.title(utils.createString(viewModel.titleMaxLength + 1));
                            expect(viewModel.title.isValid()).toBeFalsy();
                        });

                    });

                    describe('when title is longer than 255 but after trimming is not longer than 255', function () {

                        it('should be true', function () {
                            viewModel.title('   ' + utils.createString(viewModel.titleMaxLength - 1) + '   ');
                            expect(viewModel.title.isValid()).toBeTruthy();
                        });

                    });

                    describe('when title is not empty and not longer than 255', function () {

                        it('should be true', function () {
                            viewModel.title(utils.createString(viewModel.titleMaxLength - 1));
                            expect(viewModel.title.isValid()).toBeTruthy();
                        });

                    });
                });
            });

            describe('titleMaxLength:', function () {

                it('should be defined', function () {
                    expect(viewModel.titleMaxLength).toBeDefined();
                });

                it('should be 255', function () {
                    expect(viewModel.titleMaxLength).toBe(255);
                });

            });

            describe('startEditTitle:', function () {

                it('should be function', function () {
                    expect(viewModel.startEditTitle).toBeFunction();
                });

                it('should set title.isEditing to true', function () {
                    viewModel.title.isEditing(false);
                    viewModel.startEditTitle();
                    expect(viewModel.title.isEditing()).toBeTruthy();
                });

            });

            describe('endEditTitle:', function () {

                var updateDeferred, getByIdDeferred;

                beforeEach(function () {
                    updateDeferred = Q.defer();
                    getByIdDeferred = Q.defer();

                    spyOn(repository, 'updateObjective').andReturn(updateDeferred.promise);
                    spyOn(repository, 'getById').andReturn(getByIdDeferred.promise);

                    spyOn(notify, 'info');
                });

                it('should be function', function () {
                    expect(viewModel.endEditTitle).toBeFunction();
                });

                it('should set title.isEditing to false', function () {
                    viewModel.title.isEditing(true);
                    viewModel.endEditTitle();
                    expect(viewModel.title.isEditing()).toBeFalsy();
                });

                it('should trim title', function () {
                    viewModel.title('    Some title     ');
                    viewModel.endEditTitle();
                    expect(viewModel.title()).toEqual('Some title');
                });

                describe('when title is not modified', function () {
                    var promise = null;
                    beforeEach(function () {
                        viewModel.title(objective.title);
                        promise = getByIdDeferred.promise.finally(function () { });
                        getByIdDeferred.resolve(objective);
                    });

                    it('should not send event', function () {
                        viewModel.endEditTitle();
                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(promise).toBeResolved();
                            expect(eventTracker.publish).not.toHaveBeenCalled();
                        });
                    });

                    it('should not show notification', function () {
                        viewModel.endEditTitle();
                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(promise).toBeResolved();
                            expect(notify.info).not.toHaveBeenCalled();
                        });
                    });

                    it('should not update question in repository', function () {
                        viewModel.endEditTitle();
                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(promise).toBeResolved();
                            expect(repository.updateObjective).not.toHaveBeenCalled();
                        });
                    });
                });

                describe('when title is modified', function () {

                    var getPromise = null, newTitle = objective.title + 'test';
                    beforeEach(function () {

                        viewModel.title(newTitle);
                        getPromise = getByIdDeferred.promise.finally(function () { });
                        getByIdDeferred.resolve(objective);
                    });

                    it('should send event \'Update objective title\'', function () {
                        viewModel.endEditTitle();
                        waitsFor(function () {
                            return !getPromise.isPending();
                        });
                        runs(function () {
                            expect(getPromise).toBeResolved();
                            expect(eventTracker.publish).toHaveBeenCalledWith('Update objective title');
                        });
                    });

                    describe('and when title is valid', function () {

                        it('should update objective in repository', function () {
                            viewModel.endEditTitle();
                            waitsFor(function () {
                                return !getPromise.isPending();
                            });
                            runs(function () {
                                expect(getPromise).toBeResolved();
                                expect(repository.updateObjective).toHaveBeenCalled();
                                expect(repository.updateObjective.mostRecentCall.args[0].title).toEqual(newTitle);
                            });
                        });

                        describe('and when objective updated successfully', function () {

                            it('should update notificaion', function () {
                                viewModel.endEditTitle();

                                var promise = updateDeferred.promise.finally(function () { });
                                updateDeferred.resolve(new Date());

                                waitsFor(function () {
                                    return !getPromise.isPending() && !promise.isPending();
                                });
                                runs(function () {
                                    expect(promise).toBeResolved();
                                    expect(notify.info).toHaveBeenCalled();
                                });
                            });

                        });

                    });

                    describe('and when title is not valid', function () {

                        it('should revert objective title value', function () {
                            viewModel.title('');
                            viewModel.endEditTitle();

                            waitsFor(function () {
                                return !getPromise.isPending();
                            });
                            runs(function () {
                                expect(viewModel.title()).toBe(objective.title);
                            });
                        });

                    });
                });
            });

            describe('navigateToEditQuestion', function () {

                describe('when question is null', function () {

                    it('should throw exception', function () {
                        var f = function () { viewModel.navigateToEditQuestion(null); };
                        expect(f).toThrow();
                    });

                });

                describe('when question is undefined', function () {

                    it('should throw exception', function () {
                        var f = function () { viewModel.navigateToEditQuestion(); };
                        expect(f).toThrow();
                    });

                });

                describe('when question does not have property id', function () {

                    it('should throw exception', function () {
                        var f = function () { viewModel.navigateToEditQuestion({}); };
                        expect(f).toThrow();
                    });

                });

                describe('when question id is null', function () {

                    it('should throw exception', function () {
                        var f = function () { viewModel.navigateToEditQuestion({ id: null }); };
                        expect(f).toThrow();
                    });

                });

                it('should navigate to #objectives', function () {

                    viewModel.objectiveId = objective.id;

                    viewModel.navigateToEditQuestion(objective.questions[0]);

                    expect(router.navigateWithQueryString).toHaveBeenCalledWith('objective/' + objective.id + '/question/' + objective.questions[0].id);
                });

                it('should send event \"Navigate to edit question\"', function () {
                    viewModel.objectiveId = objective.id;

                    viewModel.navigateToEditQuestion(objective.questions[0]);

                    expect(eventTracker.publish).toHaveBeenCalledWith('Navigate to edit question');
                });

            });

            describe('navigateToCreateQuestion:', function () {

                it('should be a function', function () {
                    expect(viewModel.navigateToCreateQuestion).toBeFunction();
                });

                it('should send event \'Navigate to create question\'', function () {
                    viewModel.navigateToCreateQuestion();

                    expect(eventTracker.publish).toHaveBeenCalledWith('Navigate to create question');
                });

                it('should navigate to #objective/{objectiveId}/question/create', function () {
                    viewModel.objectiveId = '0';

                    viewModel.navigateToCreateQuestion();

                    expect(router.navigateWithQueryString).toHaveBeenCalledWith('objective/' + viewModel.objectiveId + '/question/create');
                });

            });

            describe('sortByTitleAsc', function () {

                it('should send event \"Sort questions by title ascending\"', function () {
                    viewModel.sortByTitleAsc();
                    expect(eventTracker.publish).toHaveBeenCalledWith('Sort questions by title ascending');
                });

                it('should change sorting option to constants.sortingOptions.byTitleAcs', function () {
                    viewModel.sortByTitleAsc();
                    expect(viewModel.currentSortingOption()).toBe(constants.sortingOptions.byTitleAsc);
                });

                it('should sort questions', function () {
                    viewModel.questions(ko.observableArray(objective.questions));
                    viewModel.sortByTitleAsc();
                    expect(viewModel.questions()).toBeSortedAsc('title');
                });

            });

            describe('sortByTitleDesc', function () {

                it('should send event \"Sort questions by title descending\"', function () {
                    viewModel.sortByTitleDesc();
                    expect(eventTracker.publish).toHaveBeenCalledWith('Sort questions by title descending');
                });

                it('should change sorting option to constants.sortingOptions.byTitleDecs', function () {
                    viewModel.sortByTitleDesc();
                    expect(viewModel.currentSortingOption()).toBe(constants.sortingOptions.byTitleDesc);
                });

                it('should sort questions', function () {
                    viewModel.questions(ko.observableArray([objective.questions]));
                    viewModel.sortByTitleDesc();
                    expect(viewModel.questions()).toBeSortedDesc('title');
                });

            });

            describe('deleteSelectedQuestions', function () {

                it('should be a function', function () {
                    expect(viewModel.deleteSelectedQuestions).toBeFunction();
                });

                it('should send event \'Delete question\'', function () {
                    viewModel.questions([{ isSelected: ko.observable(true) }]);
                    viewModel.deleteSelectedQuestions();
                    expect(eventTracker.publish).toHaveBeenCalledWith('Delete question');
                });

                describe('when no selected questions', function () {

                    it('should throw exception', function () {
                        viewModel.questions([]);
                        var f = function () { viewModel.deleteSelectedQuestions(); };
                        expect(f).toThrow();
                    });

                });

                describe('when there are selected questions', function () {

                    var removeQuestion;

                    beforeEach(function () {
                        removeQuestion = Q.defer();

                        spyOn(questionRepository, 'removeQuestion').andReturn(removeQuestion.promise);
                        spyOn(notify, 'info');
                    });

                    it('should delete selected question', function () {
                        var objectiveId = 'objectiveId';
                        var questionId = 'questionId';

                        viewModel.objectiveId = objectiveId;
                        viewModel.questions([{ id: questionId, isSelected: ko.observable(true) }]);

                        viewModel.deleteSelectedQuestions();

                        expect(questionRepository.removeQuestion).toHaveBeenCalledWith(objectiveId, questionId);
                    });

                    describe('and when question deleted successfully', function () {

                        it('should delete selected question from viewModel', function () {
                            viewModel.questions([{ id: '0', isSelected: ko.observable(true) }]);
                            var promise = removeQuestion.promise.finally(function () { });
                            removeQuestion.resolve();

                            viewModel.deleteSelectedQuestions();

                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(viewModel.questions().length).toBe(0);
                            });
                        });

                        it('should update notificaion', function () {
                            viewModel.questions([{ id: '0', isSelected: ko.observable(true) }]);

                            var promise = removeQuestion.promise.finally(function () { });
                            removeQuestion.resolve();

                            viewModel.deleteSelectedQuestions();

                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(notify.info).toHaveBeenCalled();
                            });
                        });

                    });
                });

            });

            describe('canDeleteQuestions:', function () {

                it('should be observable', function () {
                    expect(viewModel.canDeleteQuestions).toBeObservable();
                });

                describe('when no question selected', function () {

                    it('should be false', function () {
                        viewModel.questions([]);
                        expect(viewModel.canDeleteQuestions()).toBe(false);
                    });

                });

                describe('when question is selected', function () {

                    it('should be true', function () {
                        viewModel.questions([
                            { isSelected: ko.observable(true) }
                        ]);

                        expect(viewModel.canDeleteQuestions()).toBe(true);
                    });

                });

                describe('when few questions are selected', function () {

                    it('should befalse', function () {
                        viewModel.questions([
                            { isSelected: ko.observable(true) },
                            { isSelected: ko.observable(true) }
                        ]);

                        expect(viewModel.canDeleteQuestions()).toBe(false);
                    });

                });
            });

            describe('toggleQuestionSelection', function () {

                it('should be a function', function () {
                    expect(viewModel.toggleQuestionSelection).toBeFunction();
                });

                describe('when question is null', function () {

                    it('should throw exception', function () {
                        var f = function () { viewModel.toggleQuestionSelection(null); };
                        expect(f).toThrow();
                    });

                });

                describe('when question is undefined', function () {

                    it('should throw exception', function () {
                        var f = function () { viewModel.toggleQuestionSelection(); };
                        expect(f).toThrow();
                    });

                });

                describe('when question does not have isSelected() observable', function () {

                    it('should throw exception', function () {
                        var f = function () { viewModel.toggleQuestionSelection({}); };
                        expect(f).toThrow();
                    });

                });

                describe('when question is not selected', function () {

                    it('should send event \'Select question\'', function () {
                        viewModel.toggleQuestionSelection({ isSelected: ko.observable(false) });
                        expect(eventTracker.publish).toHaveBeenCalledWith('Select question');
                    });

                    it('should set question.isSelected to true', function () {
                        var question = { isSelected: ko.observable(false) };
                        viewModel.toggleQuestionSelection(question);
                        expect(question.isSelected()).toBeTruthy();
                    });

                });

                describe('when question is selected', function () {

                    it('should send event \'Unselect question\'', function () {
                        viewModel.toggleQuestionSelection({ isSelected: ko.observable(true) });
                        expect(eventTracker.publish).toHaveBeenCalledWith('Unselect question');
                    });

                    it('should set question.isSelected to false', function () {
                        var question = { isSelected: ko.observable(true) };
                        viewModel.toggleQuestionSelection(question);
                        expect(question.isSelected()).toBeFalsy();
                    });

                });
            });

            describe('questions', function () {

                it('should be observable', function () {
                    expect(viewModel.questions).toBeObservable();
                });

            });

            describe('currentLanguage:', function() {

                it('should be defined', function () {
                    expect(viewModel.currentLanguage).toBeDefined();
                });

            });

        });
    }
);