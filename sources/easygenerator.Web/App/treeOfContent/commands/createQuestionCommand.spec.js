define(['treeOfContent/commands/createQuestionCommand'], function (command) {

    var
        questionRepository = require('repositories/questionRepository'),
        localizationManager = require('localization/localizationManager'),
        router = require('plugins/router'),
        uiLocker = require('uiLocker'),
        clientContext = require('clientContext'),
        eventTracker = require('eventTracker')
    ;

    describe('command [createQuestionCommand]', function () {

        describe('execute:', function () {

            var addQuestion;

            beforeEach(function () {
                addQuestion = Q.defer();

                spyOn(router, 'navigate');
                spyOn(questionRepository, 'addQuestion').and.returnValue(addQuestion.promise);
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

            it('should send event \'Create new question\'', function () {
                spyOn(eventTracker, 'publish');
                command.execute();
                expect(eventTracker.publish).toHaveBeenCalledWith('Create new question', 'Tree of content');
            });

            it('should lock content', function () {
                command.execute('objectiveId');
                expect(uiLocker.lock).toHaveBeenCalled();
            });

            it('should add question to repository', function () {
                spyOn(localizationManager, 'localize').and.returnValue('title');
                command.execute('objectiveId');
                expect(questionRepository.addQuestion).toHaveBeenCalledWith('objectiveId', { title: 'title' });
            });

            describe('when question added', function () {

                beforeEach(function () {
                    addQuestion.resolve({ id: 'questionId' });
                });

                it('should navigate to this question', function (done) {
                    command.execute('objectiveId', 'courseId').fin(function () {
                        expect(router.navigate).toHaveBeenCalledWith('#objective/objectiveId/question/questionId?courseId=courseId');
                        done();
                    });
                });

                it('should unlock content', function (done) {
                    command.execute('objectiveId').fin(function () {
                        expect(uiLocker.unlock).toHaveBeenCalled();
                        done();
                    });
                });

                it('should set lastCreatedQuestionId in client context', function (done) {
                    command.execute('objectiveId').fin(function () {
                        expect(clientContext.set).toHaveBeenCalledWith('lastCreatedQuestionId', 'questionId');
                        done();
                    });
                });
            });

            describe('when failed to add question', function () {

                beforeEach(function () {
                    addQuestion.reject();
                });

                it('should unlock content', function (done) {
                    command.execute('objectiveId').fin(function () {
                        expect(uiLocker.unlock).toHaveBeenCalled();
                        done();
                    });
                });

            });

        });


    });

})
