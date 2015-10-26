define(function (require) {
    "use strict";

    var viewModel = require('viewmodels/questions/scenario/scenario'),
        eventTracker = require('eventTracker'),
        notify = require('notify'),
        branchtrackDialog = require('dialogs/branchtrack/branchtrack'),
        questionRepository = require('repositories/questionRepository'),
        updateDataCommand = require('./commands/updateData'),
        updateMasteryScoreCommand = require('./commands/updateMasteryScore'),
        getProjectInfoByIdQuerie = require('./queries/getProjectInfoById'),
        getProjectEditingInfoByIdQuerie = require('./queries/getProjectEditingInfoById'),
        getQuestionDataByIdQuerie = require('./queries/getQuestionDataById'),
        getDashboardInfoQuerie = require('./queries/getDashboardInfo'),
        localizationManager = require('localization/localizationManager');


    describe('question [scenario]', function () {

        var
            updateDataCommandDefer,
            updateMasteryScoreCommandDefer,
            getProjectInfoByIdQuerieDefer,
            getProjectEditingInfoByIdQuerieDefer,
            getQuestionDataByIdQuerieDefer,
            getDashboardInfoQuerieDefer,
            questionRepositoryGetByIdDefer;

        beforeEach(function () {
            spyOn(eventTracker, 'publish');
            spyOn(notify, 'saved');

            questionRepositoryGetByIdDefer = Q.defer();
            spyOn(questionRepository, 'getById').and.returnValue(questionRepositoryGetByIdDefer.promise);

            updateDataCommandDefer = Q.defer();
            spyOn(updateDataCommand, 'execute').and.returnValue(updateDataCommandDefer.promise);

            updateMasteryScoreCommandDefer = Q.defer();
            spyOn(updateMasteryScoreCommand, 'execute').and.returnValue(updateMasteryScoreCommandDefer.promise);

            getProjectInfoByIdQuerieDefer = Q.defer();
            spyOn(getProjectInfoByIdQuerie, 'execute').and.returnValue(getProjectInfoByIdQuerieDefer.promise);

            getProjectEditingInfoByIdQuerieDefer = Q.defer();
            spyOn(getProjectEditingInfoByIdQuerie, 'execute').and.returnValue(getProjectEditingInfoByIdQuerieDefer.promise);

            getQuestionDataByIdQuerieDefer = Q.defer();
            spyOn(getQuestionDataByIdQuerie, 'execute').and.returnValue(getQuestionDataByIdQuerieDefer.promise);

            getDashboardInfoQuerieDefer = Q.defer();
            spyOn(getDashboardInfoQuerie, 'execute').and.returnValue(getDashboardInfoQuerieDefer.promise);
        });

        it('should be defined', function () {
            expect(viewModel).toBeDefined();
        });

        describe('initialize:', function () {
            var objectiveId = 'objectiveId';
            var question = { id: 'questionId' };
            var dfd;

            beforeEach(function () {
                dfd = Q.defer();
                spyOn(localizationManager, 'localize').and.callFake(function (arg) {
                    return arg;
                });
            });

            it('should return promise', function () {
                var promise = viewModel.initialize(objectiveId, question);
                expect(promise).toBePromise();
            });

            it('should set questionId', function () {
                viewModel.initialize(objectiveId, question);

                expect(viewModel.questionId).toBe(question.id);
            });

            it('should call questionRepository getById', function () {
                viewModel.initialize(objectiveId, question);

                expect(questionRepository.getById).toHaveBeenCalledWith(objectiveId, question.id);
            });

            describe('when questionRepository resolved', function () {

                beforeEach(function () {
                    questionRepositoryGetByIdDefer.resolve(question);
                });

                it('should execute getQuestionDataById query', function (done) {
                    viewModel.initialize(objectiveId, question);

                    questionRepositoryGetByIdDefer.promise.fin(function () {
                        expect(getQuestionDataByIdQuerie.execute).toHaveBeenCalledWith(question.id);
                        done();
                    });
                });

                describe('and when getQuestionDataById query executed', function () {

                    var questionData = { embedUrl: 'embed_url', projectId: 'project_id', masteryScore: 10 };
                    beforeEach(function () {
                        getQuestionDataByIdQuerieDefer.resolve(questionData);
                    });

                    it('should update embedUrl', function (done) {
                        viewModel.initialize(objectiveId, question);

                        questionRepositoryGetByIdDefer.promise.fin(function () {
                            getQuestionDataByIdQuerieDefer.promise.fin(function () {
                                expect(viewModel.embedUrl()).toBe(questionData.embedUrl);
                                done();
                            });
                        });
                    });

                    it('should update masteryScore', function (done) {
                        viewModel.initialize(objectiveId, question);

                        questionRepositoryGetByIdDefer.promise.fin(function () {
                            getQuestionDataByIdQuerieDefer.promise.fin(function () {
                                expect(viewModel.masteryScore()).toBe(questionData.masteryScore);
                                done();
                            });
                        });
                    });

                    it('should update lastSavedMasteryScore', function (done) {
                        viewModel.initialize(objectiveId, question);

                        questionRepositoryGetByIdDefer.promise.fin(function () {
                            getQuestionDataByIdQuerieDefer.promise.fin(function () {
                                expect(viewModel.lastSavedMasteryScore).toBe(questionData.masteryScore);
                                done();
                            });
                        });
                    });

                    it('should execute getProjectEditingInfoById query', function (done) {
                        viewModel.initialize(objectiveId, question);

                        questionRepositoryGetByIdDefer.promise.fin(function () {
                            getQuestionDataByIdQuerieDefer.promise.fin(function () {
                                expect(getProjectEditingInfoByIdQuerie.execute).toHaveBeenCalledWith(questionData.projectId);
                                done();
                            });
                        });
                    });

                    describe('and when getProjectEditingInfoById query resolved', function () {

                        var editProjectInfo = { url: 'edit_project_url' };
                        beforeEach(function () {
                            getProjectEditingInfoByIdQuerieDefer.resolve(editProjectInfo);
                        });

                        it('should set editProjectUrl', function (done) {
                            viewModel.initialize(objectiveId, question);

                            questionRepositoryGetByIdDefer.promise.fin(function () {
                                getQuestionDataByIdQuerieDefer.promise.fin(function () {
                                    getProjectEditingInfoByIdQuerieDefer.promise.fin(function () {
                                        expect(viewModel.editProjectUrl()).toBe(editProjectInfo.url);
                                        done();
                                    });
                                });
                            });
                        });

                        it('should execute getDashboardInfo query', function (done) {
                            viewModel.initialize(objectiveId, question);

                            questionRepositoryGetByIdDefer.promise.fin(function () {
                                getQuestionDataByIdQuerieDefer.promise.fin(function () {
                                    getProjectEditingInfoByIdQuerieDefer.promise.fin(function () {
                                        expect(getDashboardInfoQuerie.execute).toHaveBeenCalled();
                                        done();
                                    });
                                });
                            });
                        });

                        describe('and when getDashboardInfo query executed', function () {

                            var dashboardInfo = { url: 'some_url' };
                            beforeEach(function() {
                                getDashboardInfoQuerieDefer.resolve(dashboardInfo);
                            });

                            it('should update dashboardUrl', function (done) {
                                viewModel.initialize(objectiveId, question);

                                questionRepositoryGetByIdDefer.promise.fin(function () {
                                    getQuestionDataByIdQuerieDefer.promise.fin(function () {
                                        getProjectEditingInfoByIdQuerieDefer.promise.fin(function () {
                                            getDashboardInfoQuerieDefer.promise.fin(function() {
                                                expect(viewModel.dashboardUrl).toBe(dashboardInfo.url);
                                                done();
                                            });
                                        });
                                    });
                                });
                            });

                            it('should return object', function (done) {
                                var promise = viewModel.initialize(objectiveId, question);
                                promise.then(function (result) {
                                    expect(result).toBeObject();
                                    done();
                                });
                            });

                            describe('and result object', function () {

                                it('should contain \'scenarioEditor\' viewCaption', function (done) {
                                    var promise = viewModel.initialize(objectiveId, question);
                                    promise.then(function (result) {
                                        expect(result.viewCaption).toBe('scenarioEditor');
                                        done();
                                    });
                                });

                                it('should have hasQuestionView property with true value', function (done) {
                                    var promise = viewModel.initialize(objectiveId, question);
                                    promise.then(function (result) {
                                        expect(result.hasQuestionView).toBeTruthy();
                                        done();
                                    });
                                });

                                it('should have hasQuestionContent property with true value', function (done) {
                                    var promise = viewModel.initialize(objectiveId, question);
                                    promise.then(function (result) {
                                        expect(result.hasQuestionContent).toBeTruthy();
                                        done();
                                    });
                                });

                                it('should have hasFeedback property with true value', function (done) {
                                    var promise = viewModel.initialize(objectiveId, question);
                                    promise.then(function (result) {
                                        expect(result.hasFeedback).toBeTruthy();
                                        done();
                                    });
                                });

                            });

                        });

                    });

                });

            });
        });

        describe('isExpanded:', function () {

            it('should be observable', function () {
                expect(viewModel.isExpanded).toBeObservable();
            });

        });

        describe('toggleExpand:', function () {

            it('should be function', function () {
                expect(viewModel.toggleExpand).toBeFunction();
            });

            describe('when isExpanded true', function () {

                it('should set isExpanded to false', function () {
                    viewModel.isExpanded(true);
                    viewModel.toggleExpand();
                    expect(viewModel.isExpanded()).toBeFalsy();
                });

            });

            describe('when isExpanded false', function () {

                it('should set isExpanded to true', function () {
                    viewModel.isExpanded(false);
                    viewModel.toggleExpand();
                    expect(viewModel.isExpanded()).toBeTruthy();
                });

            });

        });

        describe('masteryScore:', function () {

            it('should be observable', function () {
                expect(viewModel.masteryScore).toBeObservable();
            });

        });

        describe('lastSavedMasteryScore:', function () {

            it('should be defined', function () {
                expect(viewModel.lastSavedMasteryScore).toBeDefined();
            });

        });

        describe('masteryScoreVisibility:', function () {

            it('should be observable', function () {
                expect(viewModel.masteryScoreVisibility).toBeObservable();
            });

        });

        describe('toggleMasteryScoreVisibility:', function () {

            it('should be function', function () {
                expect(viewModel.toggleMasteryScoreVisibility).toBeFunction();
            });

            describe('when masteryScoreVisibility true', function () {

                it('should set masteryScoreVisibility to false', function () {
                    viewModel.masteryScoreVisibility(true);
                    viewModel.toggleMasteryScoreVisibility();
                    expect(viewModel.masteryScoreVisibility()).toBeFalsy();
                });

            });

            describe('when masteryScoreVisibility false', function () {

                it('should set masteryScoreVisibility to true', function () {
                    viewModel.masteryScoreVisibility(false);
                    viewModel.toggleMasteryScoreVisibility();
                    expect(viewModel.masteryScoreVisibility()).toBeTruthy();
                });

            });

        });

        describe('showMasteryScore:', function () {

            it('should be function', function () {
                expect(viewModel.showMasteryScore).toBeFunction();
            });

            it('should set masteryScoreVisibility to true', function () {
                viewModel.masteryScoreVisibility(false);
                viewModel.showMasteryScore();
                expect(viewModel.masteryScoreVisibility()).toBeTruthy();
            });

        });

        describe('closeMasteryScore:', function () {

            it('should be function', function () {
                expect(viewModel.closeMasteryScore).toBeFunction();
            });

            it('should set masteryScoreVisibility to false', function () {
                viewModel.masteryScoreVisibility(true);
                viewModel.closeMasteryScore();
                expect(viewModel.masteryScoreVisibility()).toBeFalsy();
            });

            describe('when masteryScore not equal lastSavedMasteryScore', function () {

                beforeEach(function () {
                    viewModel.masteryScore(100);
                    viewModel.lastSavedMasteryScore = 50;
                });

                it('should send event \'Change scenario mastery score\'', function () {
                    viewModel.closeMasteryScore();
                    expect(eventTracker.publish).toHaveBeenCalledWith('Change scenario mastery score');
                });

                it('should execute updateMasteryScore command', function () {
                    viewModel.closeMasteryScore();
                    expect(updateMasteryScoreCommand.execute).toHaveBeenCalled();
                });

                describe('and when command was executed', function () {

                    beforeEach(function () {
                        updateMasteryScoreCommandDefer.resolve();
                    });

                    it('should equalize masteryScore and lastSavedMasteryScore', function (done) {
                        viewModel.closeMasteryScore();
                        updateMasteryScoreCommandDefer.promise.fin(function () {
                            expect(viewModel.lastSavedMasteryScore).toBe(viewModel.masteryScore());
                            done();
                        });
                    });

                    it('should notify user', function (done) {
                        viewModel.closeMasteryScore();
                        updateMasteryScoreCommandDefer.promise.fin(function () {
                            expect(notify.saved).toHaveBeenCalled();
                            done();
                        });
                    });

                });

            });

        });

        describe('embedUrl:', function () {

            it('should be observable', function () {
                expect(viewModel.embedUrl).toBeObservable();
            });

        });

        describe('editProjectUrl:', function () {

            it('should be observable', function () {
                expect(viewModel.editProjectUrl).toBeObservable();
            });

        });

        describe('dashboardUrl:', function () {

            it('should be defined', function () {
                expect(viewModel.dashboardUrl).toBeDefined();
            });

        });

        describe('chooseScenario:', function () {

            beforeEach(function () {
                spyOn(branchtrackDialog, 'show');
            });

            it('should be function', function () {
                expect(viewModel.chooseScenario).toBeFunction();
            });

            it('should send event \'Open \'Choose scenario\' dialog\'', function () {
                viewModel.chooseScenario();
                expect(eventTracker.publish).toHaveBeenCalledWith('Open \'Choose scenario\' dialog');
            });

            it('should show branchtrack dialog', function () {
                viewModel.dashboardUrl = 'some/url';

                viewModel.chooseScenario();
                expect(branchtrackDialog.show).toHaveBeenCalledWith(viewModel.dashboardUrl);
            });

        });

        describe('editScenario:', function () {

            beforeEach(function () {
                spyOn(branchtrackDialog, 'show');
            });

            it('should be function', function () {
                expect(viewModel.editScenario).toBeFunction();
            });

            it('should send event \'Edit scenario\'', function () {
                viewModel.editScenario();
                expect(eventTracker.publish).toHaveBeenCalledWith('Edit scenario');
            });

            describe('when editProjectUrl exists', function () {

                beforeEach(function () {
                    viewModel.editProjectUrl('url');
                });

                it('should show branchtrack dialog', function () {
                    viewModel.editScenario();
                    expect(branchtrackDialog.show).toHaveBeenCalledWith(viewModel.editProjectUrl());
                });

            });

        });

        describe('projectSelected:', function () {

            var projectId = 'project_id';

            it('should be function', function () {
                expect(viewModel.projectSelected).toBeFunction();
            });

            it('should send event \'Insert scenario\'', function () {
                viewModel.projectSelected();
                expect(eventTracker.publish).toHaveBeenCalledWith('Insert scenario');
            });

            it('should execute getProjectInfoById query', function () {
                viewModel.projectSelected(projectId);

                expect(getProjectInfoByIdQuerie.execute).toHaveBeenCalledWith(projectId);
            });

            describe('when getProjectInfoById query resolved', function () {

                var projectInfo = { projectId: 'some_id' };
                beforeEach(function () {
                    getProjectInfoByIdQuerieDefer.resolve(projectInfo);
                });

                it('should call updateData command', function (done) {
                    viewModel.projectSelected(projectId);

                    getProjectInfoByIdQuerieDefer.promise.fin(function () {
                        expect(updateDataCommand.execute).toHaveBeenCalledWith(viewModel.questionId, projectInfo);
                        done();
                    });
                });

                describe('and when updateData command resolved', function () {

                    var questionData = { embedUrl: 'some_embed_url', projectId: 'some_project_id' };
                    beforeEach(function () {
                        updateDataCommandDefer.resolve(questionData);
                    });

                    it('should set embedUrl', function (done) {
                        viewModel.embedUrl(null);

                        viewModel.projectSelected(projectId);

                        getProjectInfoByIdQuerieDefer.promise.fin(function () {
                            updateDataCommandDefer.promise.fin(function () {
                                expect(viewModel.embedUrl()).toBe(questionData.embedUrl);
                                done();
                            });
                        });
                    });

                    it('should execute getProjectEditingInfoById query', function (done) {
                        viewModel.projectSelected(projectId);

                        getProjectInfoByIdQuerieDefer.promise.fin(function () {
                            updateDataCommandDefer.promise.fin(function () {
                                expect(getProjectEditingInfoByIdQuerie.execute).toHaveBeenCalledWith(questionData.projectId);
                                done();
                            });
                        });
                    });

                    describe('and when getProjectEditingInfoById query resolved', function () {

                        var editProjectInfo = { url: 'edit_project_url' };
                        beforeEach(function () {
                            getProjectEditingInfoByIdQuerieDefer.resolve(editProjectInfo);
                        });

                        it('should set editProjectUrl', function (done) {
                            viewModel.projectSelected(projectId);

                            getProjectInfoByIdQuerieDefer.promise.fin(function () {
                                updateDataCommandDefer.promise.fin(function () {
                                    getProjectEditingInfoByIdQuerieDefer.promise.fin(function () {
                                        expect(viewModel.editProjectUrl()).toBe(editProjectInfo.url);
                                        done();
                                    });
                                });
                            });
                        });

                        it('should notify user', function (done) {
                            viewModel.projectSelected(projectId);

                            getProjectInfoByIdQuerieDefer.promise.fin(function () {
                                updateDataCommandDefer.promise.fin(function () {
                                    getProjectEditingInfoByIdQuerieDefer.promise.fin(function () {
                                        expect(notify.saved).toHaveBeenCalled();
                                        done();
                                    });
                                });
                            });
                        });

                    });

                });

            });

        });

        describe('dialogClosed:', function () {

            it('should be function', function () {
                expect(viewModel.dialogClosed).toBeFunction();
            });

            it('should send event \'Close \'Choose scenario\' dialog\'', function () {
                viewModel.dialogClosed();
                expect(eventTracker.publish).toHaveBeenCalledWith('Close \'Choose scenario\' dialog');
            });

            it('should call embedUrl.valueHasMutated', function () {
                spyOn(viewModel.embedUrl, 'valueHasMutated');

                viewModel.dialogClosed();

                expect(viewModel.embedUrl.valueHasMutated).toHaveBeenCalled();
            });

        });

        describe('dataUpdated:', function () {

            it('should be function', function () {
                expect(viewModel.dataUpdated).toBeFunction();
            });

            describe('when it is current question', function () {

                var questionId = 'some_question_id', projectId = 'some_project_id', embedUrl = 'some_url';
                beforeEach(function () {
                    viewModel.questionId = questionId;
                });

                it('should update embedUrl', function () {
                    viewModel.dataUpdated(questionId, projectId, embedUrl);
                    expect(viewModel.embedUrl()).toBe(embedUrl);
                });

                it('should call embedUrl.valueHasMutated', function () {
                    spyOn(viewModel.embedUrl, 'valueHasMutated');

                    viewModel.dataUpdated(questionId, projectId, embedUrl);

                    expect(viewModel.embedUrl.valueHasMutated).toHaveBeenCalled();
                });

                describe('and when getProjectEditingInfoById query resolved', function () {

                    var editProjectInfo = { url: 'edit_project_url' };
                    beforeEach(function () {
                        getProjectEditingInfoByIdQuerieDefer.resolve(editProjectInfo);
                    });

                    it('should set editProjectUrl', function (done) {
                        viewModel.dataUpdated(questionId, projectId, embedUrl);

                        getProjectEditingInfoByIdQuerieDefer.promise.fin(function () {
                            expect(viewModel.editProjectUrl()).toBe(editProjectInfo.url);
                            done();
                        });
                    });

                });

            });

        });

        describe('masteryScoreUpdated:', function () {

            it('should be function', function () {
                expect(viewModel.masteryScoreUpdated).toBeFunction();
            });

            describe('when it is current question', function () {

                var questionId = 'some_question_id', masteryScore = 60;
                beforeEach(function () {
                    viewModel.questionId = questionId;
                });

                it('should update masteryScore', function () {
                    viewModel.masteryScoreUpdated(questionId, masteryScore);
                    expect(viewModel.masteryScore()).toBe(masteryScore);
                });

                it('should update lastSavedMasteryScore', function () {
                    viewModel.masteryScoreUpdated(questionId, masteryScore);
                    expect(viewModel.lastSavedMasteryScore).toBe(masteryScore);
                });

            });

        });

    });

});