define(function (require) {
    "use strict";

    var
        viewModel = require('viewModels/learningObjects'),
        router = require('durandal/plugins/router'),
        context = require('context'),
        http = require('durandal/http');

    describe('viewModel [learningObjects]', function () {

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
                    "learningObjects": [{
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

            it('should be set learning objects', function () {
                viewModel.activate({ objectiveId: 0, questionId: 0 });
                expect(viewModel.learningObjects).toNotBe([]);
            });

            describe('when routeData incorrect', function () {

                beforeEach(function () {
                    spyOn(router, 'navigateTo');
                });

                describe('when objectiveId is undefined', function () {

                    it('should navigate to #/400', function () {
                        viewModel.activate({ objectiveId: undefined, questionId: '0' });
                        expect(router.navigateTo).toHaveBeenCalledWith('#/400');
                    });

                });

                describe('when questionId is undefined', function () {

                    it('should navigate to #/400', function () {
                        viewModel.activate({ objectiveId: '0', questionId: undefined });
                        expect(router.navigateTo).toHaveBeenCalledWith('#/400');
                    });

                });

                describe('when objectiveId is null', function () {

                    it('should navigate to #/400', function () {
                        viewModel.activate({ objectiveId: null, questionId: '0' });
                        expect(router.navigateTo).toHaveBeenCalledWith('#/400');
                    });

                });

                describe('when questionId is null', function () {

                    it('should navigate to #/400', function () {
                        viewModel.activate({ objectiveId: '0', questionId: null });
                        expect(router.navigateTo).toHaveBeenCalledWith('#/400');
                    });

                });

                describe('when objectiveId incorrect', function () {

                    it('should navigate to #/404', function () {
                        viewModel.activate({ objectiveId: 'Some incorrect id', questionId: '0' });
                        expect(router.navigateTo).toHaveBeenCalledWith('#/404');
                    });

                });

                describe('when questionId incorrect', function () {

                    it('should navigate to #/404', function () {
                        viewModel.activate({ objectiveId: '0', questionId: 'Some incorrect id' });
                        expect(router.navigateTo).toHaveBeenCalledWith('#/404');
                    });

                });
            });

            it('should scroll window to 0, 0', function () {
                viewModel.activate({ objectiveId: '0', questionId: '0' });
                expect(window.scroll).toHaveBeenCalledWith(0, 0);
            });

            it('should load learning objects', function () {
                var objectiveId = '0';
                var questionId = '0';
                var itemId = '0';
                var learningObjectUrl = 'content/' + objectiveId + '/' + questionId + '/' + itemId + '.html';

                viewModel.activate({ objectiveId: objectiveId, questionId: questionId });

                expect(http.get).toHaveBeenCalledWith(learningObjectUrl);
            });
            
            it('should push loaded learning objects to viewmodel', function () {
                var objectiveId = '0';
                var questionId = '0';
                var responseText = 'some response text';

                var promise = viewModel.activate({ objectiveId: objectiveId, questionId: questionId });

                deferred.resolve(responseText);

                waitsFor(function () {
                    return promise.state() == 'resolved';
                });
                runs(function () {
                    expect(viewModel.learningObjects[0].learningObject).toEqual(responseText);
                });
            });

        });

        describe('backToQuestions:', function () {

            it('should be function', function () {
                expect(viewModel.backToQuestions).toBeFunction();
            });

            it('should navigate to #/', function () {
                spyOn(router, 'navigateTo');
                viewModel.backToQuestions();
                expect(router.navigateTo).toHaveBeenCalledWith('#/');
            });

        });
    });

});