define(['context', 'plugins/router', 'plugins/http'], function (context, router, http) {

    var title = null,
        content = null,

        activate = function () {
            this.title = "\"" + context.course.title + "\"";

            var that = this;
            return Q.fcall(function() {
                if (context.course.hasIntroductionContent == false) {
                    router.navigate('objectives');
                    return;
                }

                return http.get('content/content.html').then(function (response) {
                    that.content = response;
                }).fail(function () {
                    that.content = '';
                });
            });
            
        },

        startCourse = function() {
            router.navigate('objectives');
        };

    return {
        title: title,
        content: content,

        startCourse: startCourse,
        activate: activate
    };
});