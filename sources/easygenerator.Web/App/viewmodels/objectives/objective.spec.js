define(['viewmodels/objectives/objective'],
    function (viewModel) {
        "use strict";

        var
            router = require('durandal/plugins/router'),
            eventTracker = require('eventTracker'),
            dataContext = require('dataContext'),
            objectiveModel = require('models/objective'),
            questionModel = require('models/question'),
            images = require('configuration/images'),
            constants = require('constants');

        var
            objectives = (function () {
                return [
                    new objectiveModel({
                        id: '0',
                        title: 'Test Objective 0',
                        image: images[0],
                        questions: [
                            new questionModel({
                                id: '0',
                                title: 'Question 0',
                                answerOptions: [],
                                explanations: []
                            }),
                            new questionModel({
                                id: '1',
                                title: 'Question 1',
                                answerOptions: [],
                                explanations: []
                            })
                        ]
                    })
                ];
            })(),
            eventsCategory = 'Learning Objective';

        describe('viewModel [objective]', function () {

            it('is object', function () {
                expect(viewModel).toEqual(jasmine.any(Object));
            });

            describe('activate', function () {

                beforeEach(function () {
                    spyOn(router, 'replaceLocation');
                });

                describe('should navigate to #/400', function () {

                    it('when route data is not defined', function () {
                        viewModel.activate(undefined);
                        expect(router.replaceLocation).toHaveBeenCalledWith('#/400');
                    });

                    it('when objective is not defined', function () {
                        viewModel.activate({ id: undefined });
                        expect(router.replaceLocation).toHaveBeenCalledWith('#/400');
                    });

                });

                it('should navigate to #/404 when objective not found', function () {
                    viewModel.activate({ id: 'Invalid id' });
                    expect(router.replaceLocation).toHaveBeenCalledWith('#/404');
                });

                it('should initialize fileds with objective values', function () {
                    dataContext.objectives = objectives;

                    viewModel.activate({ id: objectives[0].id });

                    expect(viewModel.title()).toBe(objectives[0].title);
                    expect(viewModel.image()).toBe(objectives[0].image);
                    expect(viewModel.questions().length).toBe(objectives[0].questions.length);
                });

            });

            describe('navigateToObjectives', function () {

                beforeEach(function () {
                    spyOn(eventTracker, 'publish');
                    spyOn(router, 'navigateTo');
                });

                it('should navigate to #/objectives', function () {
                    viewModel.navigateToObjectives();
                    expect(router.navigateTo).toHaveBeenCalledWith('#/objectives');
                });

                it('should send event \"Navigate to Learning Objectives\"', function () {
                    viewModel.navigateToObjectives();
                    expect(eventTracker.publish).toHaveBeenCalledWith('Navigate to Learning Objectives', eventsCategory);
                });

            });

            describe('navigateToDetails', function () {

                beforeEach(function () {
                    spyOn(eventTracker, 'publish');
                    spyOn(router, 'navigateTo');
                });

                it('should navigate to #/objectives', function () {
                    viewModel.objectiveId = objectives[0].id;
                    viewModel.navigateToDetails(objectives[0].questions[0]);
                    expect(router.navigateTo).toHaveBeenCalledWith('#/objective/' + objectives[0].id + '/question/' + objectives[0].questions[0].id);
                });

                it('should send event \"Navigate to question details\"', function () {
                    viewModel.objectiveId = objectives[0].id;
                    viewModel.navigateToDetails(objectives[0].questions[0]);
                    expect(eventTracker.publish).toHaveBeenCalledWith('Navigate to question details', eventsCategory);
                });

            });

            describe('navigateToCreation', function () {
                
                beforeEach(function () {
                    spyOn(eventTracker, 'publish');
                    spyOn(router, 'navigateTo');
                });

                it('should navigate to #/objective/id/question/create', function () {
                    viewModel.objectiveId = objectives[0].id;
                    viewModel.navigateToCreation();
                    expect(router.navigateTo).toHaveBeenCalledWith('#/objective/' + objectives[0].id + '/question/create');
                });

                it('should send event \"Navigate to question creation\"', function () {
                    viewModel.objectiveId = objectives[0].id;
                    viewModel.navigateToCreation();
                    expect(eventTracker.publish).toHaveBeenCalledWith('Navigate to question creation', eventsCategory);
                });

            });

            describe('sortByTitleAsc', function () {

                it('should send event \"Sort questions by title ascending\"', function () {
                    spyOn(eventTracker, 'publish');
                    viewModel.sortByTitleAsc();
                    expect(eventTracker.publish).toHaveBeenCalledWith('Sort questions by title ascending', eventsCategory);
                });

                it('should change sorting option to constants.sortingOptions.byTitleAcs', function () {
                    viewModel.sortByTitleAsc();
                    expect(viewModel.currentSortingOption()).toBe(constants.sortingOptions.byTitleAsc);
                });

                it('should sort questions', function () {
                    viewModel.questions(objectives[0].questions);
                    viewModel.sortByTitleAsc();
                    expect(viewModel.questions()).toBeSortedAsc('title');
                });
            });
            
            describe('sortByTitleDesc', function () {

                it('should send event \"Sort questions by title descending\"', function () {
                    spyOn(eventTracker, 'publish');
                    viewModel.sortByTitleDesc();
                    expect(eventTracker.publish).toHaveBeenCalledWith('Sort questions by title descending', eventsCategory);
                });

                it('should change sorting option to constants.sortingOptions.byTitleDecs', function () {
                    viewModel.sortByTitleDesc();
                    expect(viewModel.currentSortingOption()).toBe(constants.sortingOptions.byTitleDesc);
                });

                it('should sort questions', function () {
                    viewModel.questions(objectives[0].questions);
                    viewModel.sortByTitleDesc();
                    expect(viewModel.questions()).toBeSortedDesc('title');
                });
            });

        });
    }
);