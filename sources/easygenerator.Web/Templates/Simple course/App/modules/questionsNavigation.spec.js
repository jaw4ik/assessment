define(['modules/questionsNavigation'], function (navigationModule) {
    var objectiveRepository = require('repositories/objectiveRepository');

    describe('[navigationModule]', function () {

        it('should be defined', function () {
            expect(navigationModule).toBeDefined();
        });


        describe('getNavigationContext:', function () {
            
            it('should be function', function () {
                expect(navigationModule.getNavigationContext).toBeFunction();
            });

            it('should return undefined if there is no objective with specified id', function () {
                spyOn(objectiveRepository, "get").andReturn(null);
                var result = navigationModule.getNavigationContext('objectiveId', 'questionId', function () { });
                expect(result).toBeUndefined();
            });

            describe('when objective with specified id exists', function () {
                var objective = {
                    id: "1",
                    questions: ko.observableArray([{ id: "1" }, { id: "2" }, { id: "3" }])
                };

                beforeEach(function () {
                    spyOn(objectiveRepository, "get").andReturn(objective);
                });
                
                it('should return undefined if question with specified id doesn\'t exist', function () {
                    var result = navigationModule.getNavigationContext('1', 'questionId', function () { });
                    expect(result).toBeUndefined();
                });

                describe('and objective and question were found, should return navigation context', function () {
                    var questionUrlBuilder = function (objectiveId, questionId) {
                        return objectiveId + '/' + questionId;
                    };

                    it('and should set previousQuestionUrl to undefined if there is no previous question', function () {
                        var navigationContext = navigationModule.getNavigationContext("1", "1", questionUrlBuilder);
                        expect(navigationContext.previousQuestionUrl).toBeUndefined();
                    });
                    
                    it('and should set previousQuestionUrl to previous question url if there is previous question', function () {
                        var navigationContext = navigationModule.getNavigationContext("1", "2", questionUrlBuilder);
                        expect(navigationContext.previousQuestionUrl).toBe('1/1');
                    });
                    

                    it('and should set nextQuestionUrl to undefined if there is no next question', function () {
                        var navigationContext = navigationModule.getNavigationContext("1", "3", questionUrlBuilder);
                        expect(navigationContext.nextQuestionUrl).toBeUndefined();
                    });

                    it('and should set nextQuestionUrl to previous question url if there is next question', function () {
                        var navigationContext = navigationModule.getNavigationContext("1", "2", questionUrlBuilder);
                        expect(navigationContext.nextQuestionUrl).toBe('1/3');
                    });
                    
                    it('and should set questionsCount to questions count', function () {
                        var navigationContext = navigationModule.getNavigationContext("1", "2", questionUrlBuilder);
                        expect(navigationContext.questionsCount).toBe(3);
                    });
                    
                    it('and should set currentQuestionIndex to current question\'s index plus one', function () {
                        var navigationContext = navigationModule.getNavigationContext("1", "2", questionUrlBuilder);
                        expect(navigationContext.currentQuestionIndex).toBe(2);
                    });
                });
            });
        });
    });
});