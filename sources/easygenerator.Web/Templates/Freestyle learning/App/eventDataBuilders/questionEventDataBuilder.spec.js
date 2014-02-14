define(['eventDataBuilders/questionEventDataBuilder'], function (eventDataBuilder) {

    var objectiveRepository = require('repositories/objectiveRepository');

    describe('[questionEventDataBuilder]', function () {

        var answers = [{
            id: '0',
            isCorrect: true,
            isChecked: true,
            text: 'a0'
        },
        {
            id: '1',
            isCorrect: false,
            isChecked: false,
            text: 'a1'
        }, {
            id: '2',
            isCorrect: true,
            isChecked: false,
            text: 'a2'
        },
        {
            id: '3',
            isCorrect: false,
            isChecked: true,
            text: 'a3'
        }];

        var question = {
            id: 'id',
            objectiveId: 'objId',
            title: 'title',
            hasContent: false,
            score: 0,
            answers: answers,
            learningContents: []
        };

        var objective = {
            id: 'id',
            title: 'title'
        };

        describe('buildAnswersSubmittedEventData:', function () {
            it('should be function', function () {
                expect(eventDataBuilder.buildAnswersSubmittedEventData).toBeFunction();
            });

            describe('when question is not an object', function () {
                it('should throw exception with \'Question is not an object\'', function () {
                    var f = function () {
                        eventDataBuilder.buildAnswersSubmittedEventData(null);
                    };
                    expect(f).toThrow('Question is not an object');
                });
            });

            describe('when question is an object', function () {

                describe('when objective is not found', function () {
                    beforeEach(function () {
                        spyOn(objectiveRepository, 'get').andReturn(null);
                    });

                    it('should throw exception with \'Objective is not found\'', function () {
                        var f = function () {
                            eventDataBuilder.buildAnswersSubmittedEventData(question);
                        };
                        expect(f).toThrow('Objective is not found');
                    });
                });

                describe('when objective is found', function () {
                    beforeEach(function () {
                        spyOn(objectiveRepository, 'get').andReturn(objective);
                    });

                    it('should return object', function () {
                        var data = eventDataBuilder.buildAnswersSubmittedEventData(question);

                        expect(data.objective.id).toBe(objective.id);
                        expect(data.objective.title).toBe(objective.title);

                        expect(data.question.id).toBe(question.id);
                        expect(data.question.title).toBe(question.title);
                        expect(data.question.answers.length).toBe(4);
                        expect(data.question.answers[0].id).toBe(answers[0].id);
                        expect(data.question.answers[0].text).toBe(answers[0].text);
                        expect(data.question.answers[1].id).toBe(answers[1].id);
                        expect(data.question.answers[1].text).toBe(answers[1].text);
                        expect(data.question.answers[2].id).toBe(answers[2].id);
                        expect(data.question.answers[2].text).toBe(answers[2].text);
                        expect(data.question.answers[3].id).toBe(answers[3].id);
                        expect(data.question.answers[3].text).toBe(answers[3].text);

                        expect(data.question.score).toBe(question.score);
                        expect(data.question.selectedAnswersIds[0]).toBe('0');
                        expect(data.question.selectedAnswersIds[1]).toBe('3');
                        expect(data.question.correctAnswersIds[0]).toBe('0');
                        expect(data.question.correctAnswersIds[1]).toBe('2');
                    });
                });

            });
        });

        describe('buildLearningContentExperiencedEventData:', function () {
            it('should be function', function () {
                expect(eventDataBuilder.buildLearningContentExperiencedEventData).toBeFunction();
            });

            describe('when question is not an object', function () {
                it('should throw exception with \'Question is not an object\'', function () {
                    var f = function () {
                        eventDataBuilder.buildLearningContentExperiencedEventData(null);
                    };
                    expect(f).toThrow('Question is not an object');
                });
            });

            describe('when question is an object', function () {

                describe('when spentTime is not an object', function () {
                    it('should throw exception with \'SpentTime is not and object\'', function () {
                        var f = function () {
                            eventDataBuilder.buildLearningContentExperiencedEventData({}, null);
                        };
                        expect(f).toThrow('SpentTime is not and object');
                    });
                });

                describe('when spentTime is an object', function () {

                    describe('when objective is not found', function () {
                        beforeEach(function () {
                            spyOn(objectiveRepository, 'get').andReturn(null);
                        });

                        it('should throw exception with \'Objective is not found\'', function () {
                            var f = function () {
                                eventDataBuilder.buildLearningContentExperiencedEventData(question, {});
                            };
                            expect(f).toThrow('Objective is not found');
                        });
                    });

                    describe('when objective is found', function () {
                        beforeEach(function () {
                            spyOn(objectiveRepository, 'get').andReturn(objective);
                        });

                        it('should return object', function () {
                            var data = eventDataBuilder.buildLearningContentExperiencedEventData(question, {});

                            expect(data.objective.id).toBe(objective.id);
                            expect(data.objective.title).toBe(objective.title);
                            expect(data.question.id).toBe(question.id);
                            expect(data.question.title).toBe(question.title);
                            expect(data.spentTime).toBeObject();
                        });
                    });

                });

            });
        });

    });
});