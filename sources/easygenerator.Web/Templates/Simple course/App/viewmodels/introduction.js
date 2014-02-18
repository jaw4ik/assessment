﻿define(['context', 'plugins/router', 'plugins/http'],
    function (context, router, http) {

        var title = null,
            content = null,

            canActivate = function () {
                if (context.course.hasIntroductionContent == false) {
                    return { redirect: '#objectives' };
                }
                return true;
            },

            activate = function () {
                this.title = "\"" + context.course.title + "\"";

                var that = this;
                return Q.fcall(function () {
                    return http.get('content/content.html').then(function (response) {
                        that.content = response;
                    }).fail(function () {
                        that.content = '';
                    });
                });

            },

            startCourse = function () {
                router.navigate('objectives');
            };

        return {
            title: title,
            content: content,

            startCourse: startCourse,
            canActivate: canActivate,
            activate: activate
        };
    }
);