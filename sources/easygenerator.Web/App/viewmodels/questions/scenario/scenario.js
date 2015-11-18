define(['durandal/app', 'constants', 'eventTracker', 'notify', 'localization/localizationManager', 'repositories/questionRepository', 'dialogs/branchtrack/branchtrack',
    './queries/getDashboardInfo', './queries/getProjectInfoById', './queries/getProjectEditingInfoById', './queries/getQuestionDataById', './commands/updateData', './commands/updateMasteryScore'],
    function (app, constants, eventTracker, notify, localizationManager, questionRepository, branchtrackDialog,
        getDashboardInfoQuerie, getProjectInfoByIdQuerie, getProjectEditingInfoByIdQuerie, getQuestionDataByIdQuerie, updateDataCommand, updateMasteryScoreCommand) {
        "use strict";

        var events = {
            openDialog: 'Open \'Choose scenario\' dialog',
            closeDialog: 'Close \'Choose scenario\' dialog',
            insertScenario: 'Insert scenario',
            editScenario: 'Edit scenario',
            changeMasteryScore: 'Change scenario mastery score'
        };

        var viewModel = {
            questionId: null,

            isExpanded: ko.observable(true),
            toggleExpand: toggleExpand,

            masteryScore: ko.observable(0),
            lastSavedMasteryScore: 0,
            masteryScoreVisibility: ko.observable(false),
            toggleMasteryScoreVisibility: toggleMasteryScoreVisibility,
            showMasteryScore: showMasteryScore,
            closeMasteryScore: closeMasteryScore,

            projectId: null,
            embedUrl: ko.observable(null),
            isEditAvailable: ko.observable(true),

            chooseScenario: chooseScenario,
            editScenario: editScenario,

            projectSelected: projectSelected,
            dialogClosed: dialogClosed,
            dataUpdated: dataUpdated,
            masteryScoreUpdated: masteryScoreUpdated,

            initialize: initialize
        };

        app.on(constants.messages.branchtrack.projectSelected, viewModel.projectSelected);
        app.on(constants.messages.branchtrack.dialogClosed, viewModel.dialogClosed);
        app.on(constants.messages.question.scenario.dataUpdated, viewModel.dataUpdated);
        app.on(constants.messages.question.scenario.masteryScoreUpdated, viewModel.masteryScoreUpdated);

        return viewModel;

        function initialize(objectiveId, question) {
            viewModel.questionId = question.id;

            return questionRepository.getById(objectiveId, question.id).then(function (question) {
                return getQuestionDataByIdQuerie.execute(question.id).then(function (questionData) {
                    viewModel.projectId = questionData.projectId;
                    viewModel.embedUrl(questionData.embedUrl);
                    viewModel.masteryScore(questionData.masteryScore);
                    viewModel.lastSavedMasteryScore = questionData.masteryScore;

                    return getEditProjectUrl(questionData.projectId).then(function (editProjectUrl) {
                        viewModel.isEditAvailable(!_.isNullOrUndefined(editProjectUrl));

                        return {
                            viewCaption: localizationManager.localize('scenarioEditor'),
                            hasQuestionView: true,
                            hasQuestionContent: true,
                            hasFeedback: true
                        };
                    });
                });
            });
        }

        function toggleExpand() {
            viewModel.isExpanded(!viewModel.isExpanded());
        }

        function toggleMasteryScoreVisibility() {
            viewModel.masteryScoreVisibility()
                ? closeMasteryScore()
                : showMasteryScore();
        }

        function showMasteryScore() {
            viewModel.masteryScoreVisibility(true);
        }

        function closeMasteryScore() {
            viewModel.masteryScoreVisibility(false);

            if (viewModel.masteryScore() !== viewModel.lastSavedMasteryScore) {
                eventTracker.publish(events.changeMasteryScore);

                updateMasteryScoreCommand.execute(viewModel.questionId, viewModel.masteryScore()).then(function () {
                    viewModel.lastSavedMasteryScore = viewModel.masteryScore();
                    notify.saved();
                });
            }
        }

        function getEditProjectUrl(projectId) {
            if (_.isNullOrUndefined(projectId)) {
                return Q(null);
            }

            return getProjectEditingInfoByIdQuerie.execute(projectId).then(function (projectEditingInfo) {
                return projectEditingInfo ? projectEditingInfo.url : null;
            });
        }

        function getDashboardUrl() {
            return getDashboardInfoQuerie.execute().then(function (dashboardInfo) {
                return dashboardInfo ? dashboardInfo.url : null;
            });
        }

        function chooseScenario() {
            eventTracker.publish(events.openDialog);

            getDashboardUrl().then(function (dashboardUrl) {
                branchtrackDialog.show(dashboardUrl);
            });
        }

        function editScenario() {
            eventTracker.publish(events.editScenario);

            if (viewModel.isEditAvailable()) {
                getEditProjectUrl(viewModel.projectId).then(function (editProjectUrl) {
                    branchtrackDialog.show(editProjectUrl);
                });
            }
        }

        function projectSelected(projectId) {
            eventTracker.publish(events.insertScenario);

            getProjectInfoByIdQuerie.execute(projectId).then(function (projectInfo) {
                updateDataCommand.execute(viewModel.questionId, projectInfo).then(function (questionData) {
                    viewModel.embedUrl(questionData.embedUrl);

                    getEditProjectUrl(questionData.projectId).then(function (editProjectUrl) {
                        viewModel.isEditAvailable(!_.isNullOrUndefined(editProjectUrl));

                        notify.saved();
                    });
                });
            });
        }

        function dialogClosed() {
            eventTracker.publish(events.closeDialog);

            viewModel.embedUrl.valueHasMutated();
        }

        function dataUpdated(questionId, projectId, embedUrl) {
            if (viewModel.questionId !== questionId) {
                return;
            }

            viewModel.embedUrl(embedUrl);
            viewModel.embedUrl.valueHasMutated();
            getEditProjectUrl(projectId).then(function (editProjectUrl) {
                viewModel.isEditAvailable(!_.isNullOrUndefined(editProjectUrl));
            });
        }

        function masteryScoreUpdated(questionId, masteryScore) {
            if (viewModel.questionId !== questionId) {
                return;
            }

            viewModel.masteryScore(masteryScore);
            viewModel.lastSavedMasteryScore = masteryScore;
        }

    }
);