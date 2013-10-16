define(function (require) {
    "use strict";

    var
        viewModel = require('viewmodels/questions/question'),
        router = require('plugins/router'),
        eventTracker = require('eventTracker'),
        questionRepository = require('repositories/questionRepository'),
        objectiveRepository = require('repositories/objectiveRepository'),
        notify = require('notify'),
        http = require('plugins/http');

    var question = {
        id: '1',
        title: 'lalala',
        createdOn: new Date(),
        modifiedOn: new Date(),
        answerOptions: [],
        learningObjects: []
    };

    var objective = {
        id: '0',
        questions: [question]
    };
    var objectiveFull = {
        id: '1',
        title: 'Test Objective',
        image: 'some image url',
        questions: [
            {
                id: '0',
                title: 'Question 1',
                answerOptions: [],
                learningObjects: []
            },
            question,
            {
                id: '2',
                title: 'Question 3',
                answerOptions: [],
                learningObjects: []
            }
        ]
    };

    describe('viewModel [question]', function () {

        beforeEach(function () {
            spyOn(eventTracker, 'publish');
            spyOn(router, 'navigate');
            spyOn(router, 'navigateWithQueryString');
            spyOn(router, 'replace');
        });

        it('is defined', function () {
            expect(viewModel).toBeDefined();
        });

        describe('modifiedOn:', function () {
            it('should be observable', function () {
                expect(viewModel.modifiedOn).toBeObservable();
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
                        viewModel.title(utils.createString(viewModel.questionTitleMaxLength + 1));
                        expect(viewModel.title.isValid()).toBeFalsy();
                    });

                });

                describe('when title is longer than 255 but after trimming is not longer than 255', function () {

                    it('should be true', function () {
                        viewModel.title('   ' + utils.createString(viewModel.questionTitleMaxLength - 1) + '   ');
                        expect(viewModel.title.isValid()).toBeTruthy();
                    });

                });

                describe('when title is not empty and not longer than 255', function () {

                    it('should be true', function () {
                        viewModel.title(utils.createString(viewModel.questionTitleMaxLength - 1));
                        expect(viewModel.title.isValid()).toBeTruthy();
                    });

                });
            });
        });

        describe('questionTitleMaxLength:', function () {

            it('should be defined', function () {
                expect(viewModel.questionTitleMaxLength).toBeDefined();
            });

            it('should be 255', function () {
                expect(viewModel.questionTitleMaxLength).toBe(255);
            });

        });

        describe('startEditQuestionTitle:', function () {

            it('should be function', function () {
                expect(viewModel.startEditQuestionTitle).toBeFunction();
            });

            it('should set title.isEditing to true', function () {
                viewModel.title.isEditing(false);
                viewModel.startEditQuestionTitle();
                expect(viewModel.title.isEditing()).toBeTruthy();
            });

        });

        describe('endEditQuestionTitle:', function () {

            var updateDeferred, getByIdDeferred;

            beforeEach(function () {
                updateDeferred = Q.defer();
                getByIdDeferred = Q.defer();

                spyOn(questionRepository, 'updateTitle').andReturn(updateDeferred.promise);
                spyOn(questionRepository, 'getById').andReturn(getByIdDeferred.promise);
            });

            it('should be function', function () {
                expect(viewModel.endEditQuestionTitle).toBeFunction();
            });

            it('should set title.isEditing to false', function () {
                viewModel.title.isEditing(true);
                viewModel.endEditQuestionTitle();
                expect(viewModel.title.isEditing()).toBeFalsy();
            });

            it('should trim title', function() {
                viewModel.title('    Some title    ');
                viewModel.endEditQuestionTitle();
                expect(viewModel.title()).toEqual('Some title');
            });

            describe('when title is not modified', function () {
                var promise = null;
                beforeEach(function () {
                    viewModel.title(question.title);
                    promise = getByIdDeferred.promise.finally(function () { });
                    getByIdDeferred.resolve(question);
                });

                it('should not send event', function () {
                    viewModel.endEditQuestionTitle();
                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(promise).toBeResolved();
                        expect(eventTracker.publish).not.toHaveBeenCalled();
                    });
                });

                it('should not show notification', function () {
                    spyOn(notify, 'info');
                    viewModel.endEditQuestionTitle();
                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(promise).toBeResolved();
                        expect(notify.info).not.toHaveBeenCalled();
                    });
                });

                it('should not update question in repository', function () {
                    viewModel.endEditQuestionTitle();
                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(promise).toBeResolved();
                        expect(questionRepository.updateTitle).not.toHaveBeenCalled();
                    });
                });
            });

            describe('when title is modified', function () {

                var getPromise = null, newTitle = question.title + 'lala';
                beforeEach(function () {

                    viewModel.title(newTitle);
                    getPromise = getByIdDeferred.promise.finally(function () { });
                    getByIdDeferred.resolve(question);
                });

                it('should send event \'Update question title\'', function () {
                    viewModel.endEditQuestionTitle();
                    waitsFor(function () {
                        return !getPromise.isPending();
                    });
                    runs(function () {
                        expect(getPromise).toBeResolved();
                        expect(eventTracker.publish).toHaveBeenCalledWith('Update question title');
                    });
                });

                describe('and when title is valid', function () {

                    it('should update question in repository', function () {
                        viewModel.endEditQuestionTitle();
                        waitsFor(function () {
                            return !getPromise.isPending();
                        });
                        runs(function () {
                            expect(getPromise).toBeResolved();
                            expect(questionRepository.updateTitle).toHaveBeenCalled();
                            expect(questionRepository.updateTitle.mostRecentCall.args[1]).toEqual(newTitle);
                        });
                    });

                    describe('and when question updated successfully', function () {

                        it('should update notificaion', function () {
                            spyOn(notify, 'info');

                            viewModel.endEditQuestionTitle();

                            var promise = updateDeferred.promise.finally(function () { });
                            updateDeferred.resolve(question);

                            waitsFor(function () {
                                return !getPromise.isPending() && !promise.isPending();
                            });
                            runs(function () {
                                expect(promise).toBeResolved();
                                expect(notify.info).toHaveBeenCalled();
                            });
                        });

                        it('should update modifiedOn', function () {
                            viewModel.endEditQuestionTitle();

                            var modificationDate = new Date();
                            question.modifiedOn = modificationDate;

                            var promise = updateDeferred.promise.finally(function () { });
                            updateDeferred.resolve(modificationDate);

                            waitsFor(function () {
                                return !getPromise.isPending() && !promise.isPending();
                            });
                            runs(function () {
                                expect(promise).toBeResolved();
                                expect(viewModel.modifiedOn()).toEqual(question.modifiedOn);
                            });
                        });
                    });

                });

                describe('and when title is not valid', function () {

                    it('should revert quiestion title value', function () {
                        viewModel.title('');
                        viewModel.endEditQuestionTitle();

                        waitsFor(function () {
                            return !getPromise.isPending();
                        });
                        runs(function () {
                            expect(viewModel.title()).toBe(question.title);
                        });
                    });

                });
            });
        });

        describe('activate:', function () {

            var getQuestionByIdDeferred;
            var getObjectiveByIdDeferred;

            beforeEach(function () {
                getQuestionByIdDeferred = Q.defer();
                getObjectiveByIdDeferred = Q.defer();

                spyOn(questionRepository, 'getById').andReturn(getQuestionByIdDeferred.promise);
                spyOn(objectiveRepository, 'getById').andReturn(getObjectiveByIdDeferred.promise);

                spyOn(http, 'post');
            });

            it('should be a function', function () {
                expect(viewModel.activate).toBeFunction();
            });
            describe('when objective not found', function () {

                it('should navigate to #404', function () {
                    var promise = viewModel.activate('objectiveId', 'questionId');
                    getObjectiveByIdDeferred.reject();

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(router.replace).toHaveBeenCalledWith('404');
                    });
                });

            });

            describe('when question not found', function () {

                it('should navigate to #404', function () {
                    var promise = viewModel.activate('obj1', 'someId');
                    getObjectiveByIdDeferred.resolve(objective);
                    getQuestionByIdDeferred.reject();

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(router.replace).toHaveBeenCalledWith('404');
                    });
                });

            });

            describe('when question is last', function () {

                it('should disable next', function () {
                    var promise = viewModel.activate('obj2', '0');

                    getObjectiveByIdDeferred.resolve(objective);
                    getQuestionByIdDeferred.resolve(question);

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(viewModel.hasNext).toBe(false);
                    });
                });

            });

            describe('when question is first', function () {

                it('should disable previous', function () {
                    var promise = viewModel.activate('obj3', '0');
                    getObjectiveByIdDeferred.resolve(objective);
                    getQuestionByIdDeferred.resolve(question);

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(viewModel.hasPrevious).toBe(false);
                    });
                });

            }); 

            it('should initialize fields', function () {
                var promise = viewModel.activate(objective.id, question.id);

                getObjectiveByIdDeferred.resolve(objectiveFull);
                getQuestionByIdDeferred.resolve(question);

                waitsFor(function () {
                    return !promise.isPending();
                });
                runs(function () {
                    expect(viewModel.objectiveTitle).toBe(objectiveFull.title);
                    expect(viewModel.title()).toBe(question.title);
                    expect(viewModel.createdOn).toBe(question.createdOn);
                    expect(viewModel.modifiedOn()).toBe(question.modifiedOn);

                    expect(viewModel.answers).toBeDefined();
                    expect(viewModel.learningObjects).toBeDefined();
                    
                    expect(viewModel.hasPrevious).toBe(true);
                    expect(viewModel.hasNext).toBe(true);
                });
            });
        });
      
        describe('goToCreateQuestion:', function () {

            it('should be a function', function () {
                expect(viewModel.goToCreateQuestion).toBeFunction();
            });

            it('should track event \"Navigate to create question\"', function () {
                viewModel.goToCreateQuestion();
                expect(eventTracker.publish).toHaveBeenCalledWith('Navigate to create question');
            });

            it('should navigate to #objective/{objectiveId}', function () {
                viewModel.goToCreateQuestion();
                expect(router.navigateWithQueryString).toHaveBeenCalled();
            });

        });

        describe('goToRelatedObjective:', function () {

            it('should be a function', function () {
                expect(viewModel.goToRelatedObjective).toBeFunction();
            });

            it('should track event \"Navigate to related objective\"', function () {
                viewModel.goToRelatedObjective();
                expect(eventTracker.publish).toHaveBeenCalledWith('Navigate to related objective');
            });

            it('should navigate to #objective/{objectiveId}', function () {
                viewModel.goToRelatedObjective();
                expect(router.navigateWithQueryString).toHaveBeenCalled();
            });

        });

        describe('goToPreviousQuestion:', function () {

            it('should be a function', function () {
                expect(viewModel.goToPreviousQuestion).toBeFunction();
            });

            it('should track event \"Navigate to previous question\"', function () {
                viewModel.goToPreviousQuestion();
                expect(eventTracker.publish).toHaveBeenCalledWith('Navigate to previous question');
            });

            it('should navigate to previous question', function () {
                viewModel.goToPreviousQuestion();
                expect(router.navigateWithQueryString).toHaveBeenCalled();
            });

            describe('when previous question doesnt exist', function () {

                it('should navigate to #404 ', function () {
                    viewModel.hasPrevious = false;
                    viewModel.goToPreviousQuestion();
                    expect(router.replace).toHaveBeenCalledWith('404');
                });

            });

        });

        describe('goToNextQuestion:', function () {

            it('should be a function', function () {
                expect(viewModel.goToNextQuestion).toBeFunction();
            });

            it('should track event \'Navigate to next question\'', function () {
                viewModel.goToNextQuestion();
                expect(eventTracker.publish).toHaveBeenCalledWith('Navigate to next question');
            });

            it('should navigate to next question', function () {
                viewModel.hasNext = true;
                viewModel.goToNextQuestion();
                expect(router.navigateWithQueryString).toHaveBeenCalled();
            });

            describe('when next question doesnt exist', function () {

                it('should navigate to #404', function () {
                    viewModel.hasNext = false;
                    viewModel.goToNextQuestion();
                    expect(router.replace).toHaveBeenCalledWith('404');
                });

            });

        });

        describe('language:', function () {

            it('should be observable', function() {
                expect(viewModel.language).toBeObservable();
            });

        });        

        describe('eventTracker:', function () {

            it('should be object', function () {
                expect(viewModel.eventTracker).toBeObject();
            });

        });        

    });

});