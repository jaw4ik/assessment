define(['viewmodels/courses/course/create/editor', 'editor/index', 'routing/isViewReadyMixin', 'repositories/courseRepository', 'userContext'], function (oldEditor, newEditor, isViewReady, courseRepository, userContext) {

    var childRouter = userContext.identity.newEditor ? newEditor : oldEditor;
    isViewReady.assign(childRouter, true);

    return {
        router: childRouter,
        activate: function () {

        },
        canActivate: canActivate
    };

    function canActivate() {
        return courseRepository.getById(arguments[0]).then(function () {
            return true;
        }).catch(function () {
            return { redirect: '404' };
        });
    }

})