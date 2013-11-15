define(['viewmodels/question'], function (viewModel) {

    var app = require('durandal/app'),
        context = require('context'),
        QuestionResultModel = require('models/questionResult'),
        eventManager = require('eventManager');

    describe('viewModel [question]', function () {

        var objectives = [{
            id: '1',
            title: 'Some objective 1',
            questions: [{
                id: '1',
                title: 'Some question 1',
                answers: [
                    { id: '1', isCorrect: false, text: 'Some answer option 1' },
                    { id: '2', isCorrect: true, text: 'Some answer option 2' }
                ],
                learningContents: [
                    { id: '1' },
                    { id: '2' }
                ]
            }]
        }];

        it('should be defined', function () {
            expect(viewModel).toBeDefined();
        });

        describe('submit:', function () {

            beforeEach(function () {
                spyOn(app, 'trigger');
                context.objectives = objectives;
                viewModel.activate('1', '1');
            });

            it('should be function', function () {
                expect(viewModel.submit).toBeFunction();
            });

            it('should send \'answered statement\' to xApi', function () {
                viewModel.submit();
                expect(app.trigger).toHaveBeenCalledWith(eventManager.events.questionSubmitted, {
                    question: new QuestionResultModel({
                        id: objectives[0].questions[0].id,
                        title: objectives[0].questions[0].title,
                        answers: viewModel.answers,
                        score: objectives[0].questions[0].score,
                        objectiveId: objectives[0].id,
                        objectiveTitle: objectives[0].title
                    })
                });
            });

        });

    });

});