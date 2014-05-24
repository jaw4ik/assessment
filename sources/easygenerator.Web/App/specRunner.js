﻿function runSpecs(env) {

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
            'synchronization/handlers/userDowngraded.spec',
            'synchronization/handlers/userUpgradedToStarter.spec',
            'synchronization/handlers/courseCollaboratorAdded.spec',
            'synchronization/handlers/courseCollaborationStarted.spec',
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
            'viewmodels/courses/course.read.spec',
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
           // 'viewmodels/objectives/createObjective.spec',
            'viewmodels/objectives/objectiveBrief.spec',
            'viewmodels/panels/sidePanel.spec',
            'viewmodels/panels/tabs/reviewTab.spec',
            'viewmodels/panels/tabs/feedbackTab.spec',
            'viewmodels/questions/question.spec',
            'viewmodels/questions/questionTitle.spec',
            'viewmodels/questions/multipleChoice/answers.spec',
            'viewmodels/questions/multipleChoice/multipleChoice.spec',
            'viewmodels/questions/fillInTheBlank/fillInTheBlank.spec',
            'viewmodels/questions/fillInTheBlank/fibControl.spec',
            'viewmodels/questions/learningContents.spec',
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