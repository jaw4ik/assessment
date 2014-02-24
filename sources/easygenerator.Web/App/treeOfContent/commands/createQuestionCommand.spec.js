define(['treeOfContent/commands/createQuestionCommand'], function (command) {

    var
        questionRepository = require('repositories/questionRepository'),
        localizationManager = require('localization/localizationManager'),
        router = require('plugins/router'),
        uiLocker = require('uiLocker'),
        clientContext = require('clientContext')
    ;

    describe('command [createQuestionCommand]', function () {

        describe('execute:', function () {

            var addQuestion;

            beforeEach(function () {
                addQuestion = Q.defer();

                spyOn(router, 'navigate');
                spyOn(questionRepository, 'addQuestion').andReturn(addQuestion.promise);
                spyOn(uiLocker, 'lock');
                spyOn(uiLocker, 'unlock');
                spyOn(clientContext, 'set');
            });

            it('should be function', function () {
                expect(command.execute).toBeFunction();
            });

            it('should return promise', function () {
                expect(command.execute()).toBePromise();
            });

            it('should lock content', function () {
                command.execute('objectiveId');
                expect(uiLocker.lock).toHaveBeenCalled();
            });

            it('should add question to repository', function () {
                spyOn(localizationManager, 'localize').andReturn('title');
                command.execute('objectiveId');
                expect(questionRepository.addQuestion).toHaveBeenCalledWith('objectiveId', { title: 'title' });
            });

            describe('when question added', function () {

                beforeEach(function () {
                    addQuestion.resolve({ id: 'questionId' });
                });

                it('should navigate to this question', function () {
                    var promise = command.execute('objectiveId', 'courseId');

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(router.navigate).toHaveBeenCalledWith('#objective/objectiveId/question/questionId?courseId=courseId');
                    });
                });

                it('should unlock content', function () {
                    var promise = command.execute('objectiveId');

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(uiLocker.unlock).toHaveBeenCalled();
                    });
                });

                it('should set lastCreatedQuestionId in client context', function () {
                    var promise = command.execute('objectiveId');

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(clientContext.set).toHaveBeenCalledWith('lastCreatedQuestionId', 'questionId');
                    });
                });
            });

            describe('when failed to add question', function () {

                beforeEach(function () {
                    addQuestion.reject();
                });

                it('should unlock content', function () {
                    var promise = command.execute('objectiveId');

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(uiLocker.unlock).toHaveBeenCalled();
                    });
                });

            });

        });


    });

})
