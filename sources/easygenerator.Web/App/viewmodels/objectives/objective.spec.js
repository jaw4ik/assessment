define(['viewmodels/objectives/objective'],
    function (viewModel) {
        "use strict";

        var router = require('plugins/router'),
            eventTracker = require('eventTracker'),
            constants = require('constants'),
            repository = require('repositories/objectiveRepository');

        var eventsCategory = 'Learning Objective';

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
                spyOn(router, 'navigate');
            });

            it('is object', function () {
                expect(viewModel).toBeObject();
            });

            describe('activate:', function () {

                var deferred;

                beforeEach(function () {
                    deferred = Q.defer();
                    spyOn(repository, 'getCollection').andReturn(deferred.promise);
                });

                it('should be a function', function () {
                    expect(viewModel.activate).toBeFunction();
                });

                it('should return promise', function () {
                    expect(viewModel.activate('id')).toBePromise();
                });

                it('should set objective title', function () {
                    viewModel.title(null);

                    var promise = viewModel.activate(objective.id);
                    deferred.resolve([objective]);


                    waitsFor(function () {
                        return promise.isFulfilled();
                    });
                    runs(function () {
                        expect(viewModel.title()).toBe(objective.title);
                    });
                });

                it('should set objective createdOn', function () {
                    viewModel.createdOn = null;

                    var promise = viewModel.activate(objective.id);
                    deferred.resolve([objective]);


                    waitsFor(function () {
                        return promise.isFulfilled();
                    });
                    runs(function () {
                        expect(viewModel.createdOn).toBe(objective.createdOn);
                    });
                });

                it('should set objective modifiedOn', function () {
                    viewModel.modifiedOn(null);

                    var promise = viewModel.activate(objective.id);
                    deferred.resolve([objective]);


                    waitsFor(function () {
                        return promise.isFulfilled();
                    });
                    runs(function () {
                        expect(viewModel.modifiedOn()).toBe(objective.modifiedOn);
                    });
                });

                it('should set current objective image', function () {
                    viewModel.image(null);

                    var promise = viewModel.activate(objective.id);
                    deferred.resolve([objective]);

                    waitsFor(function () {
                        return promise.isFulfilled();
                    });
                    runs(function () {
                        expect(viewModel.image()).toBe(objective.image);
                    });
                });

                it('should initialize questions collection', function () {
                    viewModel.questions([]);

                    var promise = viewModel.activate(objective.id);
                    deferred.resolve([objective]);

                    waitsFor(function () {
                        return promise.isFulfilled();
                    });
                    runs(function () {
                        expect(viewModel.questions().length).toBe(objective.questions.length);
                    });
                });

                describe('when objectiveId is not a string', function () {

                    it('should navigate to #400', function () {
                        viewModel.activate();
                        expect(router.navigate).toHaveBeenCalledWith('400');
                    });

                    it('should return undefined', function () {
                        var result = viewModel.activate();
                        expect(result).toBeUndefined();
                    });

                });

                describe('when objective not found', function () {

                    it('should navigate to #404', function () {
                        var promise = viewModel.activate('id');
                        deferred.resolve(null);

                        waitsFor(function () {
                            return promise.isFulfilled();
                        });
                        runs(function () {
                            expect(router.navigate).toHaveBeenCalledWith('404');
                        });

                    });

                    it('should resolve promise with undefined', function () {
                        var promise = viewModel.activate('id');
                        deferred.resolve(null);

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(promise).toBeResolvedWith(undefined);
                        });
                    });

                });
                
                describe('when currentSortingOption is asc', function () {

                    it('should sort questions asc', function () {
                        viewModel.currentSortingOption(constants.sortingOptions.byTitleAsc);

                        var promise = viewModel.activate(objective.id);
                        deferred.resolve([objective]);

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

                        var promise = viewModel.activate(objective.id);
                        deferred.resolve([objective]);

                        waitsFor(function () {
                            return promise.isFulfilled();
                        });
                        runs(function () {
                            expect(viewModel.questions).toBeSortedDesc('title');
                        });
                    });

                });

                describe('when previous objective exists in sorted by title objectives collection', function () {

                    it('should set previousObjectiveId', function () {
                        var previousObjectiveId = '0';
                        var promise = viewModel.activate(objective.id);
                        deferred.resolve([{ id: previousObjectiveId, title: 'B' }, { id: '0', title: 'a' }, objective]);

                        waitsFor(function () {
                            return promise.isFulfilled();
                        });
                        runs(function () {
                            expect(viewModel.previousObjectiveId).toBe(previousObjectiveId);
                        });
                    });

                });

                describe('when previous objective does not exist in sorted by title objectives collection', function () {

                    it('should set previousObjectiveId to null', function () {
                        var promise = viewModel.activate(objective.id);
                        deferred.resolve([{ id: '0', title: 'z' }, { id: '5', title: 'Z' }, objective]);

                        waitsFor(function () {
                            return promise.isFulfilled();
                        });
                        runs(function () {
                            expect(viewModel.previousObjectiveId).toBeNull();
                        });
                    });

                });

                describe('when next objective exists in sorted by title objectives collection', function () {

                    it('should set nextObjectiveId', function () {
                        var nextObjectiveId = '2';
                        var promise = viewModel.activate(objective.id);
                        deferred.resolve([objective, { id: nextObjectiveId, title: 'z' }, { id: '5', title: 'Z' }]);

                        waitsFor(function () {
                            return promise.isFulfilled();
                        });
                        runs(function () {
                            expect(viewModel.nextObjectiveId).toBe(nextObjectiveId);
                        });
                    });

                });

                describe('when next objective does not exist in sorted by title objectives collection', function () {

                    it('should set nextObjectiveId to null', function () {
                        var promise = viewModel.activate(objective.id);
                        deferred.resolve([objective, { id: '0', title: 'a' }, { id: '5', title: 'B' }]);

                        waitsFor(function () {
                            return promise.isFulfilled();
                        });
                        runs(function () {
                            expect(viewModel.nextObjectiveId).toBeNull();
                        });
                    });

                });
            });
            
            describe('title:', function () {

                it('should be observable', function () {
                    expect(viewModel.title).toBeObservable();
                });

                describe('isEditing', function () {

                    it('should be observable', function () {
                        expect(viewModel.title.isEditing).toBeObservable();
                    });

                });

                describe('isValid', function () {

                    it('should be observable', function () {
                        expect(viewModel.title.isValid).toBeObservable();
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

                    describe('when title is not empty and not longer than 255', function () {

                        it('should be true', function () {
                            viewModel.title(utils.createString(viewModel.titleMaxLength - 1));
                            expect(viewModel.title.isValid()).toBeTruthy();
                        });

                    });
                });
            });
            
            describe('showErrorTitleValidation', function () {

                it('should be defined', function () {
                    expect(viewModel.showErrorTitleValidation).toBeDefined();
                });

                describe('when title is empty', function () {

                    it('should be false', function () {
                        viewModel.title('');
                        expect(viewModel.showErrorTitleValidation()).toBeFalsy();
                    });

                });

                describe('when title is longer than 255', function () {

                    it('should be true', function () {
                        viewModel.title(utils.createString(viewModel.titleMaxLength + 1));
                        expect(viewModel.showErrorTitleValidation()).toBeTruthy();
                    });

                });

                describe('when title is not empty and not longer than 255', function () {

                    it('should be false', function () {
                        viewModel.title(utils.createString(viewModel.titleMaxLength - 1));
                        expect(viewModel.showErrorTitleValidation()).toBeFalsy();
                    });

                });
            });

            describe('language:', function () {

                it('should be defined', function () {
                    expect(viewModel.language).toBeDefined();
                });

            });

            describe('modifiedOn:', function () {
                it('should be observable', function () {
                    expect(viewModel.modifiedOn).toBeObservable();
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

                    spyOn(repository, 'update').andReturn(updateDeferred.promise);
                    spyOn(repository, 'getById').andReturn(getByIdDeferred.promise);

                    spyOn(viewModel.notification, 'update');
                });

                it('should be function', function () {
                    expect(viewModel.endEditTitle).toBeFunction();
                });

                it('should set title.isEditing to false', function () {
                    viewModel.title.isEditing(true);
                    viewModel.endEditTitle();
                    expect(viewModel.title.isEditing()).toBeFalsy();
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
                            expect(viewModel.notification.update).not.toHaveBeenCalled();
                        });
                    });

                    it('should not update question in repository', function () {
                        viewModel.endEditTitle();
                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(promise).toBeResolved();
                            expect(repository.update).not.toHaveBeenCalled();
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
                            expect(eventTracker.publish).toHaveBeenCalledWith('Update objective title', eventsCategory);
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
                                expect(repository.update).toHaveBeenCalled();
                                expect(repository.update.mostRecentCall.args[0].title).toEqual(newTitle);
                            });
                        });

                        describe('and when objective updated successfully', function () {

                            it('should update notificaion', function () {
                                viewModel.endEditTitle();

                                var promise = updateDeferred.promise.finally(function () { });
                                updateDeferred.resolve(objective);

                                waitsFor(function () {
                                    return !getPromise.isPending() && !promise.isPending();
                                });
                                runs(function () {
                                    expect(promise).toBeResolved();
                                    expect(viewModel.notification.update).toHaveBeenCalled();
                                });
                            });

                            it('should update modifiedOn', function () {
                                viewModel.endEditTitle();

                                var modificationDate = new Date();
                                objective.modifiedOn = modificationDate;

                                var promise = updateDeferred.promise.finally(function () { });
                                updateDeferred.resolve(objective);

                                waitsFor(function () {
                                    return !getPromise.isPending() && !promise.isPending();
                                });
                                runs(function () {
                                    expect(promise).toBeResolved();
                                    expect(viewModel.modifiedOn()).toEqual(objective.modifiedOn);
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

            describe('notification:', function () {

                it('should be object', function () {
                    expect(viewModel.notification).toBeObject();
                });

                it('should have text observable', function () {
                    expect(viewModel.notification.text).toBeDefined();
                    expect(viewModel.notification.text).toBeObservable();
                });

                it('should have visibility observable', function () {
                    expect(viewModel.notification.visibility).toBeDefined();
                    expect(viewModel.notification.visibility).toBeObservable();
                });

                describe('close', function () {

                    it('should be function', function () {
                        expect(viewModel.notification.close).toBeFunction();
                    });

                    describe('when called', function () {

                        describe('and visibility is true', function () {

                            it('should set visibility to false', function () {
                                viewModel.notification.visibility(true);
                                viewModel.notification.close();

                                expect(viewModel.notification.visibility()).toBeFalsy();
                            });

                        });

                    });

                });

                describe('update', function () {

                    it('should be function', function () {
                        expect(viewModel.notification.update).toBeFunction();
                    });

                    describe('when called', function () {

                        describe('and visibility is false', function () {

                            it('should set visibility to true', function () {
                                viewModel.notification.visibility(false);
                                viewModel.notification.update();

                                expect(viewModel.notification.visibility()).toBeTruthy();
                            });

                        });

                    });

                });

            });

            describe('navigateToObjectives', function () {

                it('should navigate to #objectives', function () {
                    viewModel.navigateToObjectives();
                    expect(router.navigate).toHaveBeenCalledWith('objectives');
                });

                it('should send event \"Navigate to Learning Objectives\"', function () {
                    viewModel.navigateToObjectives();
                    expect(eventTracker.publish).toHaveBeenCalledWith('Navigate to Learning Objectives', eventsCategory);
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

                    expect(router.navigate).toHaveBeenCalledWith('objective/' + objective.id + '/question/' + objective.questions[0].id);
                });

                it('should send event \"Navigate to edit question\"', function () {
                    viewModel.objectiveId = objective.id;

                    viewModel.navigateToEditQuestion(objective.questions[0]);

                    expect(eventTracker.publish).toHaveBeenCalledWith('Navigate to edit question', eventsCategory);
                });

            });

            describe('navigateToNextObjective:', function () {
                var nextObjectiveId = 1;

                it('should be a function', function () {
                    expect(viewModel.navigateToNextObjective).toBeFunction();
                });

                it('should send event \'Navigate to next objective\'', function () {
                    viewModel.navigateToNextObjective();
                    expect(eventTracker.publish).toHaveBeenCalledWith('Navigate to next objective', eventsCategory);
                });

                describe('when nextObjectiveId is undefined', function () {

                    it('should navigate to #404', function () {
                        viewModel.nextObjectiveId = undefined;
                        viewModel.navigateToNextObjective();
                        expect(router.navigate).toHaveBeenCalledWith('404');
                    });

                });

                describe('when nextObjectiveId is null', function () {

                    it('should navigate to #404', function () {
                        viewModel.nextObjectiveId = null;
                        viewModel.navigateToNextObjective();
                        expect(router.navigate).toHaveBeenCalledWith('404');
                    });

                });

                describe('when nextObjectiveId is not null or undefined', function () {

                    it('should navigate to #objective/{nextObjectiveId}', function () {
                        viewModel.nextObjectiveId = nextObjectiveId;
                        viewModel.navigateToNextObjective();
                        expect(router.navigate).toHaveBeenCalledWith('objective/' + nextObjectiveId);
                    });

                });
            });

            describe('navigateToCreateQuestion:', function () {

                it('should be a function', function () {
                    expect(viewModel.navigateToCreateQuestion).toBeFunction();
                });

                it('should send event \'Navigate to create question\'', function () {
                    viewModel.navigateToCreateQuestion();

                    expect(eventTracker.publish).toHaveBeenCalledWith('Navigate to create question', eventsCategory);
                });

                it('should navigate to #objective/{objectiveId}/question/create', function () {
                    viewModel.objectiveId = '0';

                    viewModel.navigateToCreateQuestion();

                    expect(router.navigate).toHaveBeenCalledWith('objective/' + viewModel.objectiveId + '/question/create');
                });

            });

            describe('navigateToPreviousObjective:', function () {
                var previousObjectiveId = 0;

                it('should be a function', function () {
                    expect(viewModel.navigateToPreviousObjective).toBeFunction();
                });

                it('should send event \'Navigate to previous objective\'', function () {
                    viewModel.navigateToPreviousObjective();
                    expect(eventTracker.publish).toHaveBeenCalledWith('Navigate to previous objective', eventsCategory);
                });

                describe('when previousObjectiveId is null', function () {

                    it('should navigate to #404', function () {
                        viewModel.previousObjectiveId = null;
                        viewModel.navigateToPreviousObjective();
                        expect(router.navigate).toHaveBeenCalledWith('404');
                    });

                });

                describe('when previousObjectiveId is undefined', function () {

                    it('should navigate to #404', function () {
                        viewModel.previousExperienceId = undefined;
                        viewModel.navigateToPreviousObjective();
                        expect(router.navigate).toHaveBeenCalledWith('404');
                    });

                });

                describe('when previousObjectiveId is not null', function () {

                    it('should navigate to #experience/{previousObjectiveId}', function () {
                        viewModel.previousObjectiveId = previousObjectiveId;
                        viewModel.navigateToPreviousObjective();
                        expect(router.navigate).toHaveBeenCalledWith('objective/' + previousObjectiveId);
                    });

                });

            });

            describe('sortByTitleAsc', function () {

                it('should send event \"Sort questions by title ascending\"', function () {
                    viewModel.sortByTitleAsc();
                    expect(eventTracker.publish).toHaveBeenCalledWith('Sort questions by title ascending', eventsCategory);
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
                    expect(eventTracker.publish).toHaveBeenCalledWith('Sort questions by title descending', eventsCategory);
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

                var getDeferred;
                var updateDeferred;

                beforeEach(function () {
                    getDeferred = Q.defer();
                    updateDeferred = Q.defer();
                    spyOn(repository, 'getById').andReturn(getDeferred.promise);
                    spyOn(repository, 'update').andReturn(updateDeferred.promise);
                });

                it('should be a function', function () {
                    expect(viewModel.deleteSelectedQuestions).toBeFunction();
                });

                it('should send event \'Delete question\'', function () {
                    viewModel.questions([{ isSelected: ko.observable(true) }]);
                    viewModel.deleteSelectedQuestions();
                    expect(eventTracker.publish).toHaveBeenCalledWith('Delete question', eventsCategory);
                });

                describe('when no selected questions', function () {

                    it('should throw exception', function () {
                        viewModel.questions([]);
                        var f = function () { viewModel.deleteSelectedQuestions(); };
                        expect(f).toThrow();
                    });

                });

                describe('when there are selected questions', function () {

                    it('should delete selected question from viewModel', function () {
                        viewModel.questions([{ id: '0', isSelected: ko.observable(true) }]);
                        var promise = viewModel.deleteSelectedQuestions();

                        getDeferred.resolve({ id: '0', qurstions: [{ id: '0' }] });
                        updateDeferred.resolve(true);

                        waitsFor(function () {
                            return promise.isFulfilled();
                        });
                        runs(function () {
                            expect(viewModel.questions().length).toBe(0);
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
                        expect(eventTracker.publish).toHaveBeenCalledWith('Select question', eventsCategory);
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
                        expect(eventTracker.publish).toHaveBeenCalledWith('Unselect question', eventsCategory);
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
        });
    }
);