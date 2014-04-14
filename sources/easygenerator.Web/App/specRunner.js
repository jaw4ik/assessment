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
            'errorHandling/httpErrorHandlers/defaultHttpErrorHandler.spec',
            'errorHandling/httpErrorHandlers/forbiddenHttpErrorHandler.spec',
            'errorHandling/httpErrorHandlers/serviceUnavailableHttpErrorHandler.spec',
            'errorHandling/httpErrorHandlers/unauthorizedHttpErrorHandler.spec',
            'errorHandling/errorHandlingConfiguration.spec',
            'errorHandling/globalErrorHandler.spec',
            'errorHandling/httpErrorHandlerRegistrator.spec',
            'help/helpHint.spec',
            'localization/localizationManager.spec',
            'userContext.spec',
            'models/course.spec',
            'models/user.spec',
            'notifications/subscriptionExpirationNotificationController.spec',
            'notifications/notification.spec',
            'widgets/backButton/viewmodel.spec',
            'dialogs/createCourse.spec',

            'repositories/answerRepository.spec',
            'repositories/commentRepository.spec',
            'repositories/courseRepository.spec',
            'repositories/learningContentRepository.spec',
            'repositories/objectiveRepository.spec',
            'repositories/templateRepository.spec',

            'guard.spec',
            'httpWrapper.spec',
            'notify.spec',
            'routing/routerExtender.spec',
            'services/publishService.spec',
            'services/aim4YouService.spec',

            'viewmodels/shell.spec',
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

            'viewmodels/objectives/objectives.spec',
            'viewmodels/objectives/objective.spec',
            'viewmodels/objectives/createObjective.spec',
            'viewmodels/objectives/objectiveBrief.spec',

            'viewmodels/questions/question.spec',
            'viewmodels/questions/answers.spec',
            'viewmodels/questions/learningContents.spec',

            'viewmodels/common/contentField.spec',
            'viewmodels/panels/sidePanel.spec',
            'viewmodels/panels/tabs/reviewTab.spec',
            'viewmodels/panels/tabs/feedbackTab.spec',

            'viewmodels/courses/courseComments.spec',

            'synchronization/handlers/userDowngraded.spec',
            'synchronization/handlers/userUpgradedToStarter.spec',

            'bootstrapper.spec',
            'uiLocker.spec',
            'widgets/notifyViewer/viewmodel.spec',
            'widgets/uiLockViewer/viewmodel.spec',


            'viewmodels/courses/courseNavigation/items/create.spec',
            'viewmodels/courses/courseNavigation/items/design.spec',
            'viewmodels/courses/courseNavigation/items/publish.spec',
            'viewmodels/courses/courseNavigation/items/navigationItem.spec',
            'viewmodels/courses/courseNavigation/navigation.spec',

            'treeOfContent/CourseTreeNode.spec',
            'treeOfContent/RelatedObjectiveTreeNode.spec',
            'treeOfContent/QuestionTreeNode.spec',
            'treeOfContent/commands/createQuestionCommand.spec',
            'treeOfContent/handlers/treeOfContentEventHandler.spec',
            'treeOfContent/handlers/treeOfContentAutoExpandHandler.spec',
            'treeOfContent/queries/getCourseByIdQuery.spec',
            'treeOfContent/queries/getObjectiveByIdQuery.spec',

            /* NOT MIGRATED SPECS */
            /*
            'repositories/questionRepository.spec',
       
            */

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