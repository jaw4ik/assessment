define(['durandal/app', 'constants', 'notify', 'localization/localizationManager', 'userContext', 'repositories/questionRepository', 'dialogs/branchtrack/branchtrack'],
    function (app, constants, notify, localizationManager, userContext, questionRepository, branchtrackDialog) {
        "use strict";

        var viewModel = {
            initialize: initialize,

            questionId: null,

            isExpanded: ko.observable(true),
            toggleExpand: toggleExpand,

            simulation: null,

            content: ko.observable(''),
            branchTrackDashboardUrl: '',

            createSimulation: createSimulation,
            editSimulation: editSimulation,
            changeSimulation: changeSimulation,

            branchtrackProjectSelected: branchtrackProjectSelected,
            branchtrackDialogClosed: branchtrackDialogClosed
        };

        app.on(constants.messages.branchtrack.projectSelected, viewModel.branchtrackProjectSelected);
        app.on(constants.messages.branchtrack.dialogClosed, viewModel.branchtrackDialogClosed);

        return viewModel;

        function initialize(objectiveId, question) {
            viewModel.questionId = question.id;

            return questionRepository.getById(objectiveId, question.id).then(function (question) {
                viewModel.content(question.content);

                return userContext.identify().then(function () {
                    var branchTrackRequestUrl = '//apps.branchtrack.rocks/api/1/clients/' + userContext.identity.id + '/request_url';

                    secureBranckTrackRequest(branchTrackRequestUrl).done(function (response) {
                        viewModel.branchTrackDashboardUrl = response.url;
                    });

                    return {
                        viewCaption: localizationManager.localize('branchtrackEditor'),
                        hasQuestionView: true,
                        hasFeedback: false
                    };
                });
            });
        }

        function toggleExpand() {
            viewModel.isExpanded(!viewModel.isExpanded());
        }

        function createSimulation() {
            branchtrackDialog.show(viewModel.branchTrackDashboardUrl);
        }

        function editSimulation() {
            var permalink = viewModel.simulation
                ? viewModel.simulation.permalink
                : /projects\/(.*?)\/embed/.exec(viewModel.content())[1];

            branchtrackDialog.show(viewModel.branchTrackDashboardUrl + '/' + permalink + '/edit');
        }

        function changeSimulation() {
            branchtrackDialog.show(viewModel.branchTrackDashboardUrl);
        }

        function branchtrackProjectSelected(projectId) {
            getProjectInfo(projectId).done(function (projectInfo) {
                var embedCode = '<iframe width="100%" height="650px" src="' + projectInfo.embed_url + '" frameborder="0" allowfullscreen></iframe>';

                questionRepository.updateContent(viewModel.questionId, embedCode).then(function () {
                    viewModel.content(embedCode);
                    viewModel.simulation = projectInfo;
                    notify.saved();
                });
            });
        }

        function getProjectInfo(projectId) {
            var getProjectInfoUrl = '//apps.branchtrack.rocks/api/1/projects/' + projectId + '.json';

            return secureBranckTrackRequest(getProjectInfoUrl);
        }

        function branchtrackDialogClosed() {
            viewModel.content.valueHasMutated();
        }

        function secureBranckTrackRequest(url) {
            return $.ajax(url, {
                headers: { 'X-BranchTrack-App-Token': 'bpqlk5896jdw1i2u0rty3znx7cfhvgos' }
            });
        }

    }
);