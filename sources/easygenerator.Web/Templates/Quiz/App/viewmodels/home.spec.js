define(function (require) {
    "use strict";

    var
        viewModel = require('viewmodels/home'),
        router = require('plugins/router'),
        context = require('context'),
        http = require('plugins/http'),
        app = require('durandal/app'),
        eventManager = require('eventManager'),
        settings = require('configuration/settings');

    describe('viewModel [home]', function () {

        beforeEach(function () {
            context.objectives = [{
                "id": 0,
                "title": "The learner is able to appreciate the easy and powerful features of easygenerator",
                "image": "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcSquMn3u84SWcQvKAbmrlUicfv2bYY3197JsNsilftexOQYce-Z",
                "questions": [
                    {
                        "id": 0,
                        "title": "Which of the following statements fits the WYSIWYG feature best?",
                        "hasContent": true,
                        "answers": [{
                            "id": 0,
                            "isCorrect": false,
                            "text": "The e-Learning in our platform will look exactly the same to the authors as it will be presented to the learners."
                        }, {
                            "id": 1,
                            "isCorrect": true,
                            "text": "You always will see the direct effect of your actions in the editing screen of easygenerator."
                        }],
                        "learningContents": [{
                            "id": 0
                        }, {
                            "id": 1
                        }]
                    },
                    {
                        "id": 1,
                        "title": "Which of the following statements fits the WYSIWYG feature best?",
                        "hasContent": true,
                        "answers": [{
                            "id": 0,
                            "isCorrect": false,
                            "text": "The e-Learning in our platform will look exactly the same to the authors as it will be presented to the learners."
                        }, {
                            "id": 1,
                            "isCorrect": true,
                            "text": "You always will see the direct effect of your actions in the editing screen of easygenerator."
                        }],
                        "learningContents": [{
                            "id": 0
                        }, {
                            "id": 1
                        }]
                    }
                ]
            }];
            context.title = "titleOfExperience";
        });

        it('should be defined', function () {
            expect(viewModel).toBeDefined();
        });

        describe('questions:', function () {

            it('should be observable', function () {
                expect(viewModel.questions).toBeObservable();
            });

        });

        describe('totalQuestionsCount:', function () {

            it('should be defined', function () {
                expect(viewModel.totalQuestionsCount).toBeDefined();
            });

        });

        describe('isFullyLoaded:', function () {

            it('should be observable', function () {
                expect(viewModel.isFullyLoaded).toBeObservable();
            });

        });

        describe('experienceTitle:', function () {

            it('should be defined', function () {
                expect(viewModel.experienceTitle).toBeDefined();
            });

        });

        describe('compositionComplete:', function () {

            it('should be function', function () {
                expect(viewModel.compositionComplete).toBeFunction();
            });

            beforeEach(function () {
                spyOn(jQuery.fn, 'animate');
                spyOn(jQuery.fn, 'offset').andReturn({ top: 100 });
            });

            describe('when redirect from learning content view', function () {

                it('should scroll to active question', function () {
                    viewModel.showLearningContents({ id: 1, objectiveId: 101 });
                    viewModel.compositionComplete();
                    expect(jQuery().animate).toHaveBeenCalled();
                });

            });

            describe('when don\'t redirect from learning content view', function () {

                it('should not scroll', function () {
                    viewModel.compositionComplete();
                    expect(jQuery().animate).not.toHaveBeenCalled();
                });

            });

        });

        describe('submit:', function () {

            it('should be function', function () {
                expect(viewModel.submit).toBeFunction();
            });

            it('should navigate to summary', function () {
                spyOn(router, 'navigate');
                viewModel.submit();
                expect(router.navigate).toHaveBeenCalledWith('summary');
            });

            it('should trigger event \'answersSubmitted\'', function () {
                spyOn(app, 'trigger');

                viewModel.questions(context.objectives[0].questions);

                var Question = require('models/question');
                var mappedQuestions = _.map(viewModel.questions(), function (question) {
                    return new Question(question);
                });

                viewModel.submit();

                expect(app.trigger).toHaveBeenCalledWith(eventManager.events.answersSubmitted, { questions: mappedQuestions });
            });

            it('should set context.testResult', function () {
                context.testResult([]);
                viewModel.submit();
                expect(context.testResult().length).toBeGreaterThan(0);
            });
            
        });

        describe('showLearningContents:', function () {

            it('should be function', function () {
                expect(viewModel.showLearningContents).toBeFunction();
            });

            it('should navigate to objective/:objectiveId/question/:questionid/learningContents', function () {
                spyOn(router, 'navigate');
                var learningContents = { objectiveId: 'obj1', id: 'ques1' };
                viewModel.showLearningContents(learningContents);
                expect(router.navigate).toHaveBeenCalledWith('objective/obj1/question/ques1/learningContents');
            });
        });

        describe('loadQuestions:', function () {

            it('should be function', function () {
                expect(viewModel.loadQuestions).toBeFunction();
            });

            it('should return promise', function () {
                expect(viewModel.loadQuestions()).toBePromise();
            });

            describe('when not all questions are loaded', function () {

                var httpGetDefer;
                beforeEach(function () {
                    context.isTryAgain = true;
                    viewModel.activate();

                    httpGetDefer = $.Deferred();
                    spyOn(http, 'get').andReturn(httpGetDefer.promise());
                });

                it('should load questions', function () {
                    var promise = viewModel.loadQuestions();
                    httpGetDefer.resolve('<html></html>');

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(viewModel.questions().length).toBeGreaterThan(0);
                    });
                });

                it('should set isFullyLoaded to true', function () {
                    var promise = viewModel.loadQuestions();
                    httpGetDefer.resolve('<html></html>');

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(viewModel.isFullyLoaded()).toBeTruthy();
                    });
                });

                describe('when load question content', function() {

                    describe('and content in not found', function() {

                        beforeEach(function() {
                            httpGetDefer.reject();
                        });

                        it('should set error message to content property', function () {
                            var promise = viewModel.loadQuestions();
                            
                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(viewModel.questions()[0].content).toBe(settings.questionContentNonExistError);
                                expect(viewModel.questions()[1].content).toBe(settings.questionContentNonExistError);
                            });
                        });

                        it('should load questions', function() {                            
                            var promise = viewModel.loadQuestions();
                            
                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(viewModel.questions().length).toBe(2);
                            });
                        });

                    });

                    describe('and content exists', function() {

                        beforeEach(function() {
                            httpGetDefer.resolve('<html></html>');
                        });

                        it('should set question content', function() {
                            var promise = viewModel.loadQuestions();

                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(viewModel.questions()[0].content).toBe('<html></html>');
                            });
                        });

                        it('should load questions', function () {
                            var promise = viewModel.loadQuestions();

                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(viewModel.questions().length).toBe(2);
                            });
                        });

                    });

                });

            });

        });

        describe('canActivate:', function() {

            it('should be function', function() {
                expect(viewModel.canActivate).toBeFunction();
            });

            describe('when context.testResult is not empty', function() {

                it('should return false', function() {
                    context.testResult([{}, {}]);
                    expect(viewModel.canActivate()).toBeFalsy();
                });

            });
            
            describe('when context.testResult is empty', function () {

                it('should return true', function () {
                    context.testResult([]);
                    expect(viewModel.canActivate()).toBeTruthy();
                });

            });

        });

        describe('activate:', function () {

            it('should be function', function () {
                expect(viewModel.activate).toBeFunction();
            });

            describe('when objectives exists', function () {

                it('should set totalQuestionsCount', function () {
                    viewModel.activate();
                    expect(viewModel.totalQuestionsCount).toBe(2);
                });

            });

            describe('when context.isTryAgain is true', function () {

                beforeEach(function() {
                    context.isTryAgain = true;
                });

                it('should reset course data', function () {
                    viewModel.questions([{ id: 0 }, { id: 1 }]);
                    viewModel.isFullyLoaded(true);

                    viewModel.activate();
                    expect(viewModel.questions().length).toBe(0);
                    expect(viewModel.isFullyLoaded()).toBeFalsy();
                });

                it('should set context.isTryAgain to false', function() {
                    viewModel.activate();
                    expect(context.isTryAgain).toBeFalsy();
                });

                it('should trigger event \'courseStarted\'', function () {
                    spyOn(app, 'trigger');
                    viewModel.activate();
                    expect(app.trigger).toHaveBeenCalledWith(eventManager.events.courseStarted);
                });

            });

        });

    });
});