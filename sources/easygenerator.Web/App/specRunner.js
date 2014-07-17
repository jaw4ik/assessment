function runSpecs(env) {

    Q.stopUnhandledRejectionTracking();

    require.config({
        paths: {
            'text': '../Scripts/text',
            'durandal': '../Scripts/durandal',
            'plugins': '../Scripts/durandal/plugins',
            'transitions': '../Scripts/durandal/transitions'
        },
        urlArgs: 'v=' + Math.random()
    });

    define('jquery', function () {
        return jQuery;
    });

    define('knockout', function () {
        return ko;
    });

    require(['bootstrapper'], function (bootstrapper) {
        bootstrapper.run();


        var specs = [
            'authorization/limitCoursesAmount.spec',
            'commands/createQuestionCommand.spec',
            'dialogs/createCourse.spec',
            'dialogs/collaboration/addCollaborator.spec',
            'dialogs/collaboration/removeCollaborator.spec',
            'errorHandling/httpErrorHandlers/defaultHttpErrorHandler.spec',
            'errorHandling/httpErrorHandlers/forbiddenHttpErrorHandler.spec',
            'errorHandling/httpErrorHandlers/serviceUnavailableHttpErrorHandler.spec',
            'errorHandling/httpErrorHandlers/unauthorizedHttpErrorHandler.spec',
            'errorHandling/errorHandlingConfiguration.spec',
            'errorHandling/globalErrorHandler.spec',
            'errorHandling/httpErrorHandlerRegistrator.spec',
            'help/helpHint.spec',
            'localization/localizationManager.spec',
            'models/course.spec',
            'models/user.spec',
            'notifications/notification.spec',
            'notifications/subscriptionExpirationNotificationController.spec',
            'notifications/subscriptionExpirationNotification.spec',
            'repositories/answerRepository.spec',
            'repositories/commentRepository.spec',
            'repositories/collaboratorRepository.spec',
            'repositories/courseRepository.spec',
            'repositories/learningContentRepository.spec',
            'repositories/objectiveRepository.spec',
            'repositories/templateRepository.spec',
            'repositories/questionRepository.spec',
            'routing/routerExtender.spec',
            'services/publishService.spec',

            //#region synchronization

            'synchronization/handlers/objective/handler.spec',
            'synchronization/handlers/objective/eventHandlers/titleUpdated.spec',
            'synchronization/handlers/objective/eventHandlers/questionsReordered.spec',

            'synchronization/handlers/collaboration/handler.spec',
            'synchronization/handlers/collaboration/eventHandlers/started.spec',
            'synchronization/handlers/collaboration/eventHandlers/finished.spec',
            'synchronization/handlers/collaboration/eventHandlers/collaboratorAdded.spec',
            'synchronization/handlers/collaboration/eventHandlers/collaboratorRemoved.spec',
            'synchronization/handlers/collaboration/eventHandlers/collaboratorRegistered.spec',

            'synchronization/handlers/course/handler.spec',
            'synchronization/handlers/course/eventHandlers/deleted.spec',
            'synchronization/handlers/course/eventHandlers/introductionContentUpdated.spec',
            'synchronization/handlers/course/eventHandlers/objectiveRelated.spec',
            'synchronization/handlers/course/eventHandlers/objectivesReordered.spec',
            'synchronization/handlers/course/eventHandlers/objectivesReplaced.spec',
            'synchronization/handlers/course/eventHandlers/objectivesUnrelated.spec',
            'synchronization/handlers/course/eventHandlers/published.spec',
            'synchronization/handlers/course/eventHandlers/templateUpdated.spec',
            'synchronization/handlers/course/eventHandlers/titleUpdated.spec',

            'synchronization/handlers/question/handler.spec',
            'synchronization/handlers/question/eventHandlers/titleUpdated.spec',
            'synchronization/handlers/question/eventHandlers/created.spec',
            'synchronization/handlers/question/eventHandlers/deleted.spec',
            'synchronization/handlers/question/eventHandlers/contentUpdated.spec',
            'synchronization/handlers/question/eventHandlers/correctFeedbackUpdated.spec',
            'synchronization/handlers/question/eventHandlers/incorrectFeedbackUpdated.spec',

            'synchronization/handlers/question/eventHandlers/fillInTheBlankUpdated.spec',

            'synchronization/handlers/question/eventHandlers/dragAndDrop/backgroundChanged.spec',
            'synchronization/handlers/question/eventHandlers/dragAndDrop/dropspotCreated.spec',
            'synchronization/handlers/question/eventHandlers/dragAndDrop/dropspotDeleted.spec',
            'synchronization/handlers/question/eventHandlers/dragAndDrop/dropspotPositionChanged.spec',
            'synchronization/handlers/question/eventHandlers/dragAndDrop/dropspotTextChanged.spec',

            'synchronization/handlers/learningContent/handler.spec',
            'synchronization/handlers/learningContent/eventHandlers/created.spec',
            'synchronization/handlers/learningContent/eventHandlers/deleted.spec',
            'synchronization/handlers/learningContent/eventHandlers/textUpdated.spec',

            'synchronization/handlers/answer/handler.spec',
            'synchronization/handlers/answer/eventHandlers/created.spec',
            'synchronization/handlers/answer/eventHandlers/deleted.spec',
            'synchronization/handlers/answer/eventHandlers/textUpdated.spec',
            'synchronization/handlers/answer/eventHandlers/multipleSelectAnswerCorrectnessUpdated.spec',
            'synchronization/handlers/answer/eventHandlers/singleSelectTextAnswerCorrectnessUpdated.spec',

            'synchronization/handlers/user/handler.spec',
            'synchronization/handlers/user/eventHandlers/upgradedToStarter.spec',
            'synchronization/handlers/user/eventHandlers/upgradedToPlus.spec',
            'synchronization/handlers/user/eventHandlers/downgraded.spec',

            //#endregion

            'treeOfContent/handlers/treeOfContentEventHandler.spec',
            'treeOfContent/handlers/treeOfContentAutoExpandHandler.spec',
            'treeOfContent/queries/getCourseByIdQuery.spec',
            'treeOfContent/queries/getObjectiveByIdQuery.spec',
            'treeOfContent/CourseTreeNode.spec',
            'treeOfContent/RelatedObjectiveTreeNode.spec',
            'treeOfContent/QuestionTreeNode.spec',
            'viewmodels/common/contentField.spec',
            'viewmodels/courses/createCourse.spec',
            'viewmodels/courses/courses.spec',
            'viewmodels/courses/course.spec',
            'viewmodels/courses/design.spec',
            'viewmodels/courses/publish.spec',
            'viewmodels/courses/publishingActions/publishingAction.spec',
            'viewmodels/courses/publishingActions/build.spec',
            'viewmodels/courses/publishingActions/publish.spec',
            'viewmodels/courses/publishingActions/scormBuild.spec',
            'viewmodels/courses/publishingActions/publishToAim4You.spec',
            'viewmodels/courses/courseComments.spec',
            'viewmodels/courses/courseNavigation/items/create.spec',
            'viewmodels/courses/courseNavigation/items/design.spec',
            'viewmodels/courses/courseNavigation/items/publish.spec',
            'viewmodels/courses/courseNavigation/items/navigationItem.spec',
            'viewmodels/courses/courseNavigation/navigation.spec',
            'viewmodels/courses/collaboration/collaborator.spec',
            'viewmodels/courses/collaboration/collaborators.spec',
            'viewmodels/objectives/objectives.spec',
            'viewmodels/objectives/objective.spec',
            'viewmodels/objectives/createObjective.spec',
            'viewmodels/objectives/objectiveBrief.spec',
            'viewmodels/panels/sidePanel.spec',
            'viewmodels/panels/tabs/reviewTab.spec',
            'viewmodels/panels/tabs/feedbackTab.spec',
            'viewmodels/questions/question.spec',
            'viewmodels/questions/answers.spec',
            'viewmodels/questions/multipleSelect/multipleSelectAnswers.spec',
            'viewmodels/questions/multipleSelect/multipleSelect.spec',
            'viewmodels/questions/singleSelectText/singleSelectTextAnswers.spec',
            'viewmodels/questions/singleSelectText/singleSelectText.spec',
            'viewmodels/questions/fillInTheBlank/fillInTheBlank.spec',
            'viewmodels/questions/fillInTheBlank/fibControl.spec',

            'viewmodels/questions/dragAndDrop/dragAndDrop.spec',
            'viewmodels/questions/dragAndDrop/designer.spec',
            'viewmodels/questions/dragAndDrop/dropspot.spec',
            'viewmodels/questions/dragAndDrop/dropspotToAdd.spec',
            'viewmodels/questions/dragAndDrop/commands/addDropspot.spec',
            'viewmodels/questions/dragAndDrop/commands/removeDropspot.spec',
            'viewmodels/questions/dragAndDrop/commands/changeDropspotText.spec',
            'viewmodels/questions/dragAndDrop/commands/changeDropspotPosition.spec',
            'viewmodels/questions/dragAndDrop/commands/changeBackground.spec',
            'viewmodels/questions/dragAndDrop/queries/getQuestionContentById.spec',

            'viewmodels/questions/singleSelectImage/singleSelectImage.spec',

            'viewmodels/questions/textMatching/textMatching.spec',
            'viewmodels/questions/textMatching/queries/getTextMatchingAnswersById.spec',
            'viewmodels/questions/textMatching/commands/addAnswer.spec',
            'viewmodels/questions/textMatching/commands/removeAnswer.spec',
            'viewmodels/questions/textMatching/commands/changeAnswerKey.spec',
            'viewmodels/questions/textMatching/commands/changeAnswerValue.spec',
            
            'viewmodels/questions/questionTitle.spec',
            'viewmodels/questions/learningContents.spec',
            'viewmodels/questions/feedback.spec',
            'viewmodels/user/userMenu.spec',
            'viewmodels/shell.spec',
            'widgets/backButton/viewmodel.spec',
            'widgets/notifyViewer/viewmodel.spec',
            'widgets/uiLockViewer/viewmodel.spec',
            'widgets/createQuestion/viewmodel.spec',
            'bootstrapper.spec',
            'guard.spec',
            'http/httpWrapper.spec',
            'http/httpRequestSender.spec',
            'notify.spec',
            'ping.spec',
            'uiLocker.spec',
            'userContext.spec',
            '../Scripts/account/signup.spec',
            '../Scripts/account/signin.spec',
            '../Scripts/account/passwordrecovery.spec',
            '../Scripts/account/signupsecondstep.spec',
            '../Scripts/review/review.spec',
            '../Scripts/common/serviceUnavailableAjaxErrorHandler.spec'
        ];

        require(specs, function () {
            env.execute();
        });
    });

}