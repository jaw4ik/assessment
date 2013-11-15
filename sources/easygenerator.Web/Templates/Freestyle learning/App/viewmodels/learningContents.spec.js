define(['viewmodels/learningContents'],
    function (viewModel) {
        "use strict";

        var app = require('durandal/app'),
            context = require('context'),
            eventManager = require('eventManager');

        describe('viewModel [learningContents]', function () {

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

            describe('deactivate:', function () {

                beforeEach(function () {
                    spyOn(app, 'trigger');
                    context.objectives = objectives;
                    viewModel.activate('1', '1');
                });

                it('should be function', function () {
                    expect(viewModel.deactivate).toBeFunction();
                });

                it('should send \'experienced statement\' to xApi', function () {
                    viewModel.deactivate();
                    expect(app.trigger).toHaveBeenCalledWith(eventManager.events.learningContentExperienced, {
                        objective: objectives[0],
                        question: objectives[0].questions[0],
                        spentTime: new Date() - viewModel.enteredOnPage
                    });
                });

            });
        });
    });