define(['commands/createQuestionCommand'], function (command) {

    var
        questionRepository = require('repositories/questionRepository'),
        localizationManager = require('localization/localizationManager'),
        router = require('plugins/router'),
        uiLocker = require('uiLocker'),
        clientContext = require('clientContext'),
        eventTracker = require('eventTracker'),
        constants = require('constants')
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
                spyOn(eventTracker, 'publish');
            });

            it('should be function', function () {
                expect(command.execute).toBeFunction();
            });

            it('should return promise', function () {
                expect(command.execute()).toBePromise();
            });

            describe('when event category is defined', function () {

                describe('and when question type is multipleSelect', function () {

                    it('should send event \'Create new question (multiple select)\' with defined event category ', function () {
                        command.execute('objectiveId', 'courseId', constants.questionType.multipleSelect.type, 'Event category');
                        expect(eventTracker.publish).toHaveBeenCalledWith('Create new question (multiple select)', 'Event category');
                    });

                });

                describe('and when question type is fillInTheBlank', function () {

                    it('should send event \'Create new question (fill in the blanks)\' with defined event category ', function () {
                        command.execute('objectiveId', 'courseId', constants.questionType.fillInTheBlank.type, 'Event category');
                        expect(eventTracker.publish).toHaveBeenCalledWith('Create new question (fill in the blanks)', 'Event category');
                    });

                });

                describe('and when question type is dragAndDrop', function () {

                    it('should send event \'Create new question (drag and drop)\' with defined event category ', function () {
                        command.execute('objectiveId', 'courseId', constants.questionType.dragAndDrop.type, 'Event category');
                        expect(eventTracker.publish).toHaveBeenCalledWith('Create new question (drag and drop)', 'Event category');
                    });

                });

                describe('and when question type is multipleChoice', function () {

                    it('should send event \'Create new question (multiple choice)\' with defined event category ', function () {
                        command.execute('objectiveId', 'courseId', constants.questionType.multipleChoice.type, 'Event category');
                        expect(eventTracker.publish).toHaveBeenCalledWith('Create new question (multiple choice)', 'Event category');
                    });

                });
            });

            describe('when event category is undefined', function () {

                describe('when question type is multipleSelect', function () {

                    it('should send event \'Create new question (multiple select)\' with defined event category ', function () {
                        command.execute('objectiveId', 'courseId', constants.questionType.multipleSelect.type);
                        expect(eventTracker.publish).toHaveBeenCalledWith('Create new question (multiple select)', undefined);
                    });

                });

                describe('when question type is fillInTheBlank', function () {

                    it('should send event \'Create new question (fill in the blanks)\' with defined event category ', function () {
                        command.execute('objectiveId', 'courseId', constants.questionType.fillInTheBlank.type);
                        expect(eventTracker.publish).toHaveBeenCalledWith('Create new question (fill in the blanks)', undefined);
                    });

                });

                describe('when question type is dragAndDrop', function () {

                    it('should send event \'Create new question (drag and drop)\' with defined event category ', function () {
                        command.execute('objectiveId', 'courseId', constants.questionType.dragAndDrop.type);
                        expect(eventTracker.publish).toHaveBeenCalledWith('Create new question (drag and drop)', undefined);
                    });

                });

                describe('when question type is multipleChoice', function () {

                    it('should send event \'Create new question (multiple choice)\' with defined event category ', function () {
                        command.execute('objectiveId', 'courseId', constants.questionType.multipleChoice.type);
                        expect(eventTracker.publish).toHaveBeenCalledWith('Create new question (multiple choice)', undefined);
                    });

                });

            });

            it('should lock content', function () {
                command.execute('objectiveId');
                expect(uiLocker.lock).toHaveBeenCalled();
            });

            describe('when question type is multipleSelect', function () {

                it('should add question to repository', function () {
                    spyOn(localizationManager, 'localize').and.returnValue('title');
                    command.execute('objectiveId', 'title', constants.questionType.multipleSelect.type);
                    expect(questionRepository.addQuestion).toHaveBeenCalledWith('objectiveId', { title: 'title' }, constants.questionType.multipleSelect.type);
                });

            });

            describe('when question type is fillInTheBlank', function () {

                it('should add question to repository', function () {
                    spyOn(localizationManager, 'localize').and.returnValue('title');
                    command.execute('objectiveId', 'title', constants.questionType.fillInTheBlank.type);
                    expect(questionRepository.addQuestion).toHaveBeenCalledWith('objectiveId', { title: 'title' }, constants.questionType.fillInTheBlank.type);
                });

            });

            describe('when question type is multipleChoice', function () {

                it('should add question to repository', function () {
                    spyOn(localizationManager, 'localize').and.returnValue('title');
                    command.execute('objectiveId', 'title', constants.questionType.multipleChoice.type);
                    expect(questionRepository.addQuestion).toHaveBeenCalledWith('objectiveId', { title: 'title' }, constants.questionType.multipleChoice.type);
                });

            });

            describe('when question added', function () {

                beforeEach(function () {
                    addQuestion.resolve({ id: 'questionId' });
                });

                it('should navigate to this question', function () {
                    command.execute('objectiveId').fin(function () {
                        expect(router.navigate).toHaveBeenCalledWith('#objective/objectiveId/question/questionId');
                        done();
                    });
                });

                describe('and courseId is defined', function () {
                    it('should navigate to this question with courseId in query string', function (done) {
                        command.execute('objectiveId', 'courseId').fin(function () {
                            expect(router.navigate).toHaveBeenCalledWith('#objective/objectiveId/question/questionId?courseId=courseId');
                            done();
                        });
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
