define(['commands/createQuestionCommand'], function (command) {

    var
        questionRepository = require('repositories/questionRepository'),
        localizationManager = require('localization/localizationManager'),
        router = require('plugins/router'),
        uiLocker = require('uiLocker'),
        clientContext = require('clientContext'),
        eventTracker = require('eventTracker'),
        constants = require('constants');

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

                describe('and when question type is dragAndDropText', function () {

                    it('should send event \'Create new question (drag and drop)\' with defined event category ', function () {
                        command.execute('objectiveId', 'courseId', constants.questionType.dragAndDropText.type, 'Event category');
                        expect(eventTracker.publish).toHaveBeenCalledWith('Create new question (drag and drop)', 'Event category');
                    });

                });

                describe('and when question type is hotspot', function () {

                    it('should send event \'Create new question (hotspot)\' with defined event category ', function () {
                        command.execute('objectiveId', 'courseId', constants.questionType.hotspot.type, 'Event category');
                        expect(eventTracker.publish).toHaveBeenCalledWith('Create new question (hotspot)', 'Event category');
                    });

                });

                describe('and when question type is singleSelectText', function () {

                    it('should send event \'Create new question (single select text)\' with defined event category ', function () {
                        command.execute('objectiveId', 'courseId', constants.questionType.singleSelectText.type, 'Event category');
                        expect(eventTracker.publish).toHaveBeenCalledWith('Create new question (single select text)', 'Event category');
                    });

                });

                describe('and when question type is singleSelectImage', function () {

                    it('should send event \'Create new question (single select image)\' with defined event category ', function () {
                        command.execute('objectiveId', 'courseId', constants.questionType.singleSelectImage.type, 'Event category');
                        expect(eventTracker.publish).toHaveBeenCalledWith('Create new question (single select image)', 'Event category');
                    });

                });

                describe('and when question type is textMatching', function () {

                    it('should send event \'Create new question (text matching)\' with defined event category ', function () {
                        command.execute('objectiveId', 'courseId', constants.questionType.textMatching.type, 'Event category');
                        expect(eventTracker.publish).toHaveBeenCalledWith('Create new question (text matching)', 'Event category');
                    });

                });

                describe('and when question type is informationContent', function () {

                    it('should send event \'Create new information content\' with defined event category ', function () {
                        command.execute('objectiveId', 'courseId', constants.questionType.informationContent.type);
                        expect(eventTracker.publish).toHaveBeenCalledWith('Create new information content', 'Information');
                    });

                });

                describe('and when question type is statement', function () {

                    it('should send event \'Create new question (statement)\' with defined event category ', function () {
                        command.execute('objectiveId', 'courseId', constants.questionType.statement.type, 'event category');
                        expect(eventTracker.publish).toHaveBeenCalledWith('Create new question (statement)', 'event category');
                    });

                });

                describe('and when question type is open', function () {

                    it('should send event \'Create new question (open question)\' with defined event category ', function () {
                        command.execute('objectiveId', 'courseId', constants.questionType.openQuestion.type, 'event category');
                        expect(eventTracker.publish).toHaveBeenCalledWith('Create new question (open question)', 'event category');
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

                describe('when question type is dragAndDropText', function () {

                    it('should send event \'Create new question (drag and drop)\' with defined event category ', function () {
                        command.execute('objectiveId', 'courseId', constants.questionType.dragAndDropText.type);
                        expect(eventTracker.publish).toHaveBeenCalledWith('Create new question (drag and drop)', undefined);
                    });

                });

                describe('when question type is singleSelectText', function () {

                    it('should send event \'Create new question (single select text)\' with defined event category ', function () {
                        command.execute('objectiveId', 'courseId', constants.questionType.singleSelectText.type);
                        expect(eventTracker.publish).toHaveBeenCalledWith('Create new question (single select text)', undefined);
                    });

                });

                describe('when question type is textMatching', function () {

                    it('should send event \'Create new question (text matching)\' with undefined event category ', function () {
                        command.execute('objectiveId', 'courseId', constants.questionType.textMatching.type);
                        expect(eventTracker.publish).toHaveBeenCalledWith('Create new question (text matching)', undefined);
                    });

                });

                describe('when question type is informationContent', function () {

                    it('should send event \'Create new information content\' with \'Information\' category ', function () {
                        command.execute('objectiveId', 'courseId', constants.questionType.informationContent.type);
                        expect(eventTracker.publish).toHaveBeenCalledWith('Create new information content', 'Information');
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

            describe('when question type is singleSelectText', function () {

                it('should add question to repository', function () {
                    spyOn(localizationManager, 'localize').and.returnValue('title');
                    command.execute('objectiveId', 'title', constants.questionType.singleSelectText.type);
                    expect(questionRepository.addQuestion).toHaveBeenCalledWith('objectiveId', { title: 'title' }, constants.questionType.singleSelectText.type);
                });

            });

            describe('when question type is scenario', function () {

                it('should add question to repository', function () {
                    spyOn(localizationManager, 'localize').and.returnValue('title');
                    command.execute('objectiveId', 'title', constants.questionType.scenario.type);
                    expect(questionRepository.addQuestion).toHaveBeenCalledWith('objectiveId', { title: 'title' }, constants.questionType.scenario.type);
                });

            });

            describe('when question type is informationContent', function () {

                it('should add question to repository', function () {
                    spyOn(localizationManager, 'localize').and.callFake(function (arg) { return arg === 'newInformationContentTitle' ? 'Information' : ''; });
                    command.execute('objectiveId', 'Information', constants.questionType.informationContent.type);
                    expect(questionRepository.addQuestion).toHaveBeenCalledWith('objectiveId', { title: 'Information' }, constants.questionType.informationContent.type);
                });

            });

            describe('when question added', function () {

                beforeEach(function () {
                    addQuestion.resolve({ id: 'questionId' });
                });

                it('should navigate to this question', function (done) {
                    command.execute('objectiveId').fin(function () {
                        expect(router.navigate).toHaveBeenCalledWith('library/objectives/objectiveId/questions/questionId');
                        done();
                    });
                });

                describe('and courseId is defined', function () {
                    it('should navigate to this question with courseId in query string', function (done) {
                        command.execute('objectiveId', 'courseId').fin(function () {
                            expect(router.navigate).toHaveBeenCalledWith('courses/courseId/objectives/objectiveId/questions/questionId');
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

});