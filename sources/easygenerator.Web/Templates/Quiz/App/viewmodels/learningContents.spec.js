define(function (require) {
    "use strict";

    var viewModel = require('viewModels/learningContents'),
        router = require('plugins/router'),
        context = require('context'),
        http = require('plugins/http'),
        questionRepository = require('repositories/questionRepository'),
        learningContentRepository = require('repositories/learningContentRepository');

    describe('viewModel [learningContents]', function () {

        it('should be defined', function () {
            expect(viewModel).toBeDefined();
        });

        var question = {
            id: 0,
            title: "Which of the following statements fits the WYSIWYG feature best?",
            answers: [{
                "id": 0,
                "isCorrect": false,
                "text": "The e-Learning in our platform will look exactly the same to the authors as it will be presented to the learners."
            }, {
                "id": 1,
                "isCorrect": true,
                "text": "You always will see the direct effect of your actions in the editing screen of easygenerator."
            }],
            learningContents: [{
                "id": 0
            }],
            learningContentExperienced: function () { }
        };

        beforeEach(function () {
            spyOn(window, 'scroll');
            spyOn(router, 'navigate');
        });

        describe('activate:', function () {
            var deferred = null;
            beforeEach(function () {
                deferred = Q.defer();
                spyOn(learningContentRepository, 'getCollection').andReturn(deferred.promise);
            });

            it('should be function', function () {
                expect(viewModel.activate).toBeFunction();
            });

            describe('when question is not found', function () {
                beforeEach(function () {
                    spyOn(questionRepository, 'get').andReturn(null);
                });

                it('should navigate to 404', function () {
                    var promise = viewModel.activate('0', '0');
                    deferred.resolve();

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(router.navigate).toHaveBeenCalledWith('404');
                    });
                });
            });

            describe('when question is found', function () {
                beforeEach(function () {
                    spyOn(questionRepository, 'get').andReturn(question);
                });

                it('should return promise', function () {
                    expect(viewModel.activate('0', '0')).toBePromise();
                });

                it('should set questionId', function () {
                    var promise = viewModel.activate('0', '0');
                    deferred.resolve();

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(viewModel.questionId).toBe('0');
                    });
                });

                it('should set objectiveId', function () {
                    var promise = viewModel.activate('0', '0');
                    deferred.resolve();

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(viewModel.objectiveId).toBe('0');
                    });
                });

                it('should scroll window to 0, 0', function () {
                    var promise = viewModel.activate('0', '0');
                    deferred.resolve();

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(window.scroll).toHaveBeenCalledWith(0, 0);
                    });
                });

                it('should load learning content', function () {
                    var promise = viewModel.activate('0', '0');
                    deferred.resolve();

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(learningContentRepository.getCollection).toHaveBeenCalledWith('0', '0');
                    });
                });

                describe('and when learning contents are loaded', function () {
                    var responseText = 'some response text';
                    var contents = [{ index: 1, learningContent: responseText }, { index: 0, learningContent: responseText }];

                    it('should push loaded learning content to viewmodel', function () {
                        var promise = viewModel.activate('0', '0');
                        deferred.resolve(contents);

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(viewModel.learningContents[0].learningContent).toEqual(responseText);
                        });
                    });
                    
                    it('should orders learning contents by index', function () {
                        var promise = viewModel.activate('0', '0');
                        deferred.resolve(contents);

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(viewModel.learningContents[0].index).toBe(0);
                            expect(viewModel.learningContents[1].index).toBe(1);
                        });
                    });
                });

            });
        });

        describe('deactivate:', function () {

            beforeEach(function () {
                spyOn(questionRepository, 'get').andReturn(question);
                spyOn(question, 'learningContentExperienced');
            });

            it('should be function', function () {
                expect(viewModel.deactivate).toBeFunction();
            });

            it('should call question learningContentExperienced', function () {
                viewModel.deactivate();
                expect(question.learningContentExperienced).toHaveBeenCalled();
            });
        });

        describe('backToQuestions:', function () {

            it('should be function', function () {
                expect(viewModel.backToQuestions).toBeFunction();
            });

            it('should navigate to \'home\'', function () {
                viewModel.backToQuestions();
                expect(router.navigate).toHaveBeenCalledWith('home');
            });
        });
    });

});