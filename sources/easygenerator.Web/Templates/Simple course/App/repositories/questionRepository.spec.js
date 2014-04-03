define(['repositories/questionRepository'], function (repository) {
    var context = require('context');

    describe('repository [questionRepository]', function () {

        it('should be defined', function () {
            expect(repository).toBeDefined();
        });

        describe('get:', function () {
            it('should return function', function () {
                expect(repository.get).toBeFunction();
            });

            describe('when objectiveId is not string', function () {

                it('should throw exception with \'Objective id is not a string\'', function () {
                    var f = function () {
                        repository.get(null, '');
                    };
                    expect(f).toThrow('Objective id is not a string');
                });

            });

            describe('when objectiveId is a string', function () {

                describe('and when questionId is not string', function () {

                    it('should throw exception with \'Question id is not a string\'', function () {
                        var f = function () {
                            repository.get('', null);
                        };
                        expect(f).toThrow('Question id is not a string');
                    });

                });

                describe('and when questionId is a string', function () {
                    var objectiveId = 'objectiveId';
                    var questionId = 'questionId';

                    describe('and when objective is not found', function () {
                        beforeEach(function () {
                            context.course.objectives = ko.observableArray([]);
                        });

                        it('should return null', function () {
                            var result = repository.get(objectiveId, questionId);
                            expect(result).toBeNull();
                        });
                    });

                    describe('and when objective is found', function () {
                        var objective = { id: objectiveId };
                        beforeEach(function () {
                            context.course.objectives = ko.observableArray([objective]);
                        });

                        describe('and when question is not found', function () {
                            beforeEach(function () {
                                objective.questions = ko.observableArray([]);
                                context.course.objectives = ko.observableArray([objective]);
                            });

                            it('should return null', function () {
                                var result = repository.get(objectiveId, questionId);
                                expect(result).toBeNull();
                            });
                        });

                        describe('and when question is found', function () {
                            var question = { id: questionId };
                            beforeEach(function () {
                                objective.questions = ko.observableArray([question]);
                                context.course.objectives = ko.observableArray([objective]);
                            });

                            it('should return question', function () {
                                var result = repository.get(objectiveId, questionId);
                                expect(result).toBe(question);
                            });
                        });

                    });
                });

            });
        });

    });
});