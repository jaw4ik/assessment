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
        'errorHandling/httpErrorHandlers/defaultHttpErrorHandler.spec',
        'errorHandling/httpErrorHandlers/forbiddenHttpErrorHandler.spec',
        'errorHandling/httpErrorHandlers/serviceUnavailableHttpErrorHandler.spec',
        'errorHandling/httpErrorHandlers/unauthorizedHttpErrorHandler.spec',
        'errorHandling/errorHandlingConfiguration.spec',
        'errorHandling/globalErrorHandler.spec',
        'errorHandling/httpErrorHandlerRegistrator.spec',
        'help/helpHint.spec',
        'introduction/welcome.spec',
        'localization/localizationManager.spec',
        'models/course.spec',
 //       'repositories/answerRepository.spec',

        /* UNSORTED SPECS */

       //  'viewmodels/shell.spec', ajax request
        'guard.spec',
        'httpWrapper.spec',
        'notify.spec',
        'routing/routerExtender.spec',
        'services/deliverService.spec'


        /* NOT MIGRATED SPECS */
       /*'repositories/courseRepository.spec',
       'repositories/objectiveRepository.spec',
       'repositories/questionRepository.spec',
       'repositories/learningContentRepository.spec',
       'repositories/templateRepository.spec',
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
       '../Scripts/account/signup.spec',
       '../Scripts/account/signin.spec',
       '../Scripts/review/review.spec',
       '../Scripts/account/signupsecondstep.spec',
       '../Scripts/account/passwordrecovery.spec',
       '../Scripts/common/serviceUnavailableAjaxErrorHandler.spec',
       'bootstrapper.spec',
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