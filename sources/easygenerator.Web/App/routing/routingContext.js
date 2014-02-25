define(['plugins/router'], function (router) {
    var moduleId = ko.observable(null),
        moduleName = ko.observable(null),
        courseId = ko.observable(null);

    router.activeInstruction.subscribe(function (insrtuction) {
        moduleId(getModuleId(insrtuction));
        moduleName(getModuleName(moduleId()));
        courseId(getCourseId(insrtuction));
    });

    function getModuleId(instruction) {
        if (_.isObject(instruction) && _.isObject(instruction.config)) {
            return instruction.config.moduleId;
        }

        return null;
    };

    function getModuleName(moduleIdValue) {
        if (moduleIdValue == null)
            return null;

        return moduleIdValue.slice(moduleIdValue.lastIndexOf('/') + 1);
    };

    function getCourseId(instruction) {
        if (!_.isObject(instruction))
            return null;

        if (_.contains(['viewmodels/courses/course', 'viewmodels/courses/design', 'viewmodels/courses/deliver'], moduleId())) {
            return instruction.params.length > 0 ? instruction.params[0] : null;
        }
        else if (!_.isNullOrUndefined(instruction.queryParams) && _.isString(instruction.queryParams.courseId)) {
            return instruction.queryParams.courseId;
        }

        return null;
    };

    return {
        moduleId: moduleId,
        courseId: courseId,
        moduleName: moduleName
    };
});