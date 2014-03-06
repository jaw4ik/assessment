function runSpecs(env) {

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
       'guard.spec',
       'httpWrapper.spec',
       'notify.spec',
       'models/course.spec',
       'errorHandling/httpErrorHandlerRegistrator.spec',
       'errorHandling/globalErrorHandler.spec',
       'errorHandling/errorHandlingConfiguration.spec',
       'errorHandling/httpErrorHandlers/defaultHttpErrorHandler.spec',
       'errorHandling/httpErrorHandlers/unauthorizedHttpErrorHandler.spec',
       'errorHandling/httpErrorHandlers/forbiddenHttpErrorHandler.spec',
       'errorHandling/httpErrorHandlers/serviceUnavailableHttpErrorHandler.spec',
       'routing/routerExtender.spec',
       'localization/localizationManager.spec'
       /*'services/deliverService.spec',
       'repositories/courseRepository.spec',
       'repositories/objectiveRepository.spec',
       'repositories/questionRepository.spec',
       'repositories/answerRepository.spec',
       'repositories/learningContentRepository.spec',
       'repositories/templateRepository.spec',
       'repositories/helpHintRepository.spec',
       'repositories/commentRepository.spec',
       'viewmodels/objectives/objectives.spec',
       'viewmodels/objectives/objective.spec',
       'viewmodels/objectives/objectiveBrief.spec',
       'viewmodels/objectives/createObjective.spec',
       'viewmodels/questions/question.spec',
       'viewmodels/questions/answers.spec',
       'viewmodels/questions/learningContents.spec',
       'viewmodels/courses/courses.spec',
       'viewmodels/courses/course.spec',
       'viewmodels/courses/design.spec',
       'viewmodels/courses/deliver.spec',
       'viewmodels/courses/deliveringActions/deliveringAction.spec',
       'viewmodels/courses/deliveringActions/build.spec',
       'viewmodels/courses/deliveringActions/publish.spec',
       'viewmodels/courses/deliveringActions/scormBuild.spec',
       'viewmodels/courses/createCourse.spec',
       'viewmodels/shell.spec',
       '../Scripts/account/signup.spec',
       '../Scripts/account/signin.spec',
       '../Scripts/review/review.spec',
       '../Scripts/account/signupsecondstep.spec',
       '../Scripts/account/passwordrecovery.spec',
       '../Scripts/common/serviceUnavailableAjaxErrorHandler.spec',
       'help/helpHint.spec',
       'bootstrapper.spec',
       'introduction/welcome.spec',
       'widgets/notifyViewer/viewmodel.spec',
       'widgets/uiLockViewer/viewmodel.spec',
       'uiLocker.spec',
       'userContext.spec',
       'services/aim4YouService.spec',
       'viewmodels/courses/deliveringActions/publishToAim4You.spec',
       'viewmodels/common/contentField.spec',
       'viewmodels/panels/sidePanel.spec',
       'viewmodels/panels/tabs/reviewTab.spec',
       'viewmodels/panels/tabs/feedbackTab.spec',
       'viewmodels/courses/courseComments.spec',
       'viewmodels/courses/courseNavigation/items/develop.spec',
       'viewmodels/courses/courseNavigation/items/design.spec',
       'viewmodels/courses/courseNavigation/items/deliver.spec',
       'viewmodels/courses/courseNavigation/items/navigationItem.spec',
       'viewmodels/courses/courseNavigation/navigation.spec',
       'treeOfContent/CourseTreeNode.spec',
       'treeOfContent/RelatedObjectiveTreeNode.spec',
       'treeOfContent/QuestionTreeNode.spec',
       'treeOfContent/commands/createQuestionCommand.spec',
       'treeOfContent/handlers/treeOfContentEventHandler.spec',
       'treeOfContent/handlers/treeOfContentAutoExpandHandler.spec',
       'treeOfContent/queries/getCourseByIdQuery.spec',
       'treeOfContent/queries/getObjectiveByIdQuery.spec'*/
        ];

        require(specs, function () {
            env.execute();
        });
    });

}