define(['models/question'], function (QuestionModel) {

    var eventManager = require('eventManager'),
        eventDataBuilder = require('eventDataBuilders/questionEventDataBuilder');

    describe('model [question]', function () {

        it('should be defined', function () {
            expect(QuestionModel).toBeDefined();
        });

        it('should return function', function () {
            expect(QuestionModel).toBeFunction();
        });

        var answers = [{
            id: '0',
            isCorrect: true,
            isChecked: false
        },
        {
            id: '1',
            isCorrect: false,
            isChecked: false
        }, {
            id: '2',
            isCorrect: true,
            isChecked: false
        },
        {
            id: '3',
            isCorrect: false,
            isChecked: false
        }];

        var spec = {
            id: 'id',
            objectiveId: 'objId',
            title: 'title',
            hasContent: false,
            score: 0,
            answers: answers,
            learningContents: []
        };
        var question;

        beforeEach(function () {
            question = new QuestionModel(spec);
        });

        describe('id:', function () {
            it('should be defined', function () {
                expect(question.id).toBeDefined();
            });

            it('should be equal to spec id', function () {
                expect(question.id).toBe(spec.id);
            });
        });

        describe('title:', function () {
            it('should be defined', function () {
                expect(question.title).toBeDefined();
            });

            it('should be equal to spec title', function () {
                expect(question.title).toBe(spec.title);
            });
        });

        describe('hasContent:', function () {
            it('should be defined', function () {
                expect(question.hasContent).toBeDefined();
            });

            it('should be equal to spec hasContent', function () {
                expect(question.hasContent).toBe(spec.hasContent);
            });
        });

        describe('score:', function () {
            it('should be defined', function () {
                expect(question.score).toBeDefined();
            });

            it('should be equal to spec score', function () {
                expect(question.score).toBe(spec.score);
            });
        });

        describe('answers:', function () {
            it('should be defined', function () {
                expect(question.answers).toBeDefined();
            });

            it('should be equal to spec answers', function () {
                expect(question.answers).toBe(spec.answers);
            });
        });

        describe('learningContents:', function () {
            it('should be defined', function () {
                expect(question.learningContents).toBeDefined();
            });

            it('should be equal to spec learningContents', function () {
                expect(question.learningContents).toBe(spec.learningContents);
            });
        });

        describe('submitAnswer:', function () {

            var eventData = {};
            beforeEach(function () {
                spyOn(eventManager, 'answersSubmitted');
                spyOn(eventDataBuilder, 'buildAnswersSubmittedEventData').andReturn(eventData);
            });

            it('should be function', function () {
                expect(question.submitAnswer).toBeFunction();
            });

            describe('when checked answers ids is not an array', function () {
                it('should throw exception with \'Checked answer ids is not an array\'', function () {
                    var f = function () {
                        question.submitAnswer(null);
                    };
                    expect(f).toThrow('Checked answer ids is not an array');
                });
            });

            describe('when checked answers ids is an array', function () {

                it('should update answers checked values', function () {
                    question.submitAnswer(['0', '2']);
                    expect(question.answers[0].isChecked).toBeTruthy();
                    expect(question.answers[1].isChecked).toBeFalsy();
                    expect(question.answers[2].isChecked).toBeTruthy();
                    expect(question.answers[3].isChecked).toBeFalsy();
                });

                it('should set isAnswered to true', function () {
                    question.isAnswered = false;
                    question.submitAnswer(['0', '2']);
                    expect(question.isAnswered).toBeTruthy();
                });

                describe('when all answers checked correct', function () {
                    var answersIds = ['0', '2'];
                    it('should set score to 100', function () {
                        question.score = 0;
                        question.submitAnswer(['0', '2']);
                        expect(question.score).toBe(100);
                    });

                    it('should set isCorrectAnswered to true', function () {
                        question.isCorrectAnswered = false;
                        question.submitAnswer(answersIds);
                        expect(question.isCorrectAnswered).toBe(true);
                    });

                    it('should call event data builder buildAnswersSubmittedEventData', function () {
                        question.submitAnswer(answersIds);
                        expect(eventDataBuilder.buildAnswersSubmittedEventData).toHaveBeenCalled();
                    });

                    it('should call event manager answersSubmitted', function () {
                        question.submitAnswer(answersIds);
                        expect(eventManager.answersSubmitted).toHaveBeenCalledWith(eventData);
                    });
                });

                describe('when answers checked partually correct', function () {
                    var answersIds = ['0', '1'];
                    it('should set score to 0', function () {
                        question.score = 0;
                        question.submitAnswer(answersIds);
                        expect(question.score).toBe(0);
                    });

                    it('should set isCorrectAnswered to false', function () {
                        question.isCorrectAnswered = true;
                        question.submitAnswer(answersIds);
                        expect(question.isCorrectAnswered).toBe(false);
                    });

                    it('should call event data builder buildAnswersSubmittedEventData', function () {
                        question.submitAnswer(answersIds);
                        expect(eventDataBuilder.buildAnswersSubmittedEventData).toHaveBeenCalled();
                    });

                    it('should call event manager answersSubmitted', function () {
                        question.submitAnswer(answersIds);
                        expect(eventManager.answersSubmitted).toHaveBeenCalledWith(eventData);
                    });
                });
                
                describe('when answers checked incorrect', function () {
                    var answersIds = ['1', '3'];
                    it('should set score to 0', function () {
                        question.score = 0;
                        question.submitAnswer(answersIds);
                        expect(question.score).toBe(0);
                    });

                    it('should set isCorrectAnswered to false', function () {
                        question.isCorrectAnswered = true;
                        question.submitAnswer(answersIds);
                        expect(question.isCorrectAnswered).toBe(false);
                    });

                    it('should call event data builder buildAnswersSubmittedEventData', function () {
                        question.submitAnswer(answersIds);
                        expect(eventDataBuilder.buildAnswersSubmittedEventData).toHaveBeenCalled();
                    });

                    it('should call event manager answersSubmitted', function () {
                        question.submitAnswer(answersIds);
                        expect(eventManager.answersSubmitted).toHaveBeenCalledWith(eventData);
                    });
                });
            });
        });

        describe('learningContentExperienced:', function () {
            var eventData = {};
            beforeEach(function () {
                spyOn(eventManager, 'learningContentExperienced');
                spyOn(eventDataBuilder, 'buildLearningContentExperiencedEventData').andReturn(eventData);
            });

            it('should be function', function () {
                expect(question.learningContentExperienced).toBeFunction();
            });
            
            it('should call event data builder buildAnswersSubmittedEventData', function () {
                question.learningContentExperienced({});
                expect(eventDataBuilder.buildLearningContentExperiencedEventData).toHaveBeenCalled();
            });

            it('should call event manager learningContentExperienced', function () {
                question.learningContentExperienced({});
                expect(eventManager.learningContentExperienced).toHaveBeenCalledWith(eventData);
            });
        });
    });
});