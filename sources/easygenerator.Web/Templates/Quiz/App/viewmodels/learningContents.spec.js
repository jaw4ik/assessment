define(function (require) {
    "use strict";

    var
        viewModel = require('viewModels/learningContents'),
        router = require('plugins/router'),
        context = require('context'),
        http = require('plugins/http');

    describe('viewModel [learningContents]', function () {

        it('should be defined', function () {
            expect(viewModel).toBeDefined();
        });

        beforeEach(function () {
            context.objectives = [{
                "id": 0,
                "title": "The learner is able to appreciate the easy and powerful features of easygenerator",
                "image": "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcSquMn3u84SWcQvKAbmrlUicfv2bYY3197JsNsilftexOQYce-Z",
                "questions": [{
                    "id": 0,
                    "title": "Which of the following statements fits the WYSIWYG feature best?",
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
                    }]
                }]
            }];
            context.title = "titleOfExperience";

            spyOn(window, 'scroll');
        });

        describe('activate:', function () {

            var deferred = null;

            beforeEach(function() {
                deferred = $.Deferred();
                spyOn(http, 'get').andReturn(deferred.promise());
            });

            it('should be function', function () {
                expect(viewModel.activate).toBeFunction();
            });

            it('should be set learning content', function () {
                viewModel.activate(0, 0);
                expect(viewModel.learningContents).toNotBe([]);
            });

            describe('when routeData incorrect', function () {

                beforeEach(function () {
                    spyOn(router, 'navigate');
                });

                describe('when objectiveId is empty', function () {

                    it('should navigate to 400', function () {
                        viewModel.activate('','0');
                        expect(router.navigate).toHaveBeenCalledWith('400');
                    });

                });

                describe('when questionId is empty', function () {

                    it('should navigate to 400', function () {
                        viewModel.activate('0', '');
                        expect(router.navigate).toHaveBeenCalledWith('400');
                    });

                });

                describe('when objectiveId incorrect', function () {

                    it('should navigate to 404', function () {
                        viewModel.activate('Some incorrect id', '0');
                        expect(router.navigate).toHaveBeenCalledWith('404');
                    });

                });

                describe('when questionId incorrect', function () {

                    it('should navigate to 404', function () {
                        viewModel.activate('0', 'Some incorrect id');
                        expect(router.navigate).toHaveBeenCalledWith('404');
                    });

                });
            });

            it('should scroll window to 0, 0', function () {
                viewModel.activate('0', '0');
                expect(window.scroll).toHaveBeenCalledWith(0, 0);
            });

            it('should load learning content', function () {
                var objectiveId = '0';
                var questionId = '0';
                var itemId = '0';
                var learningContentUrl = 'content/' + objectiveId + '/' + questionId + '/' + itemId + '.html';

                viewModel.activate(objectiveId, questionId);

                expect(http.get).toHaveBeenCalledWith(learningContentUrl);
            });
            
            it('should push loaded learning content to viewmodel', function () {
                var objectiveId = '0';
                var questionId = '0';
                var responseText = 'some response text';

                var promise = viewModel.activate(objectiveId, questionId);

                deferred.resolve(responseText);

                waitsFor(function () {
                    return promise.state() == 'resolved';
                });
                runs(function () {
                    expect(viewModel.learningContents[0].learningContent).toEqual(responseText);
                });
            });

        });

        describe('backToQuestions:', function () {

            it('should be function', function () {
                expect(viewModel.backToQuestions).toBeFunction();
            });

            it('should navigate to \'home\'', function () {
                spyOn(router, 'navigate');
                viewModel.backToQuestions();
                expect(router.navigate).toHaveBeenCalledWith('home');
            });

        });
    });

});