define(['durandal/app', 'plugins/http', 'constants', 'mappers/courseModelMapper', 'mappers/objectiveModelMapper', 'mappers/templateModelMapper', 'mappers/videoModelMapper'],
    function (app, http, constants, courseModelMapper, objectiveModelMapper, templateModelMapper, videoModelMapper) {
        "use strict";
        var
            objectives = [],
            courses = [],
            templates = [],
            videos = [],
            /*temporary*/
            videoData = [{
                Id: '3bce4931-6c75-41ab-afe0-2ec108a30860',
                Title: 'video from vimeo',
                VimeoId: '12345468425465',
                ThumbnailUrl: 'http://i.vimeocdn.com/video\/515001984_200x150.jpg',
                VideoIframe: '<iframe src="https://player.vimeo.com/video/125047382?color=ffffff&title=0&byline=0&portrait=0" width="600" height="335" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>',
                Size: 123546545646
            },
            {
                Id: '3bce4931-6c75-41ab-afe0-2ec108a30861',
                Title: 'video from vimeo video from vimeo',
                VimeoId: '12345468425465',
                ThumbnailUrl: 'http://i.vimeocdn.com/video/515255713_200x150.jpg',
                VideoIframe: '<iframe src="https://player.vimeo.com/video/125039309?color=ffffff&title=0&byline=0&portrait=0" width="600" height="335" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>',
                Size: 456484546546
            },
            {
                Id: '3bce4931-6c75-41ab-afe0-2ec108a30860',
                Title: 'video from vimeo',
                VimeoId: '12345468425465',
                ThumbnailUrl: 'http://i.vimeocdn.com/video\/515001984_200x150.jpg',
                VideoIframe: '<iframe src="https://player.vimeo.com/video/125047382?color=ffffff&title=0&byline=0&portrait=0" width="600" height="335" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>',
                Size: 123546545646
            },
            {
                Id: '3bce4931-6c75-41ab-afe0-2ec108a30861',
                Title: 'video from vimeo video from vimeo',
                VimeoId: '12345468425465',
                ThumbnailUrl: 'http://i.vimeocdn.com/video/515255713_200x150.jpg',
                VideoIframe: '<iframe src="https://player.vimeo.com/video/125039309?color=ffffff&title=0&byline=0&portrait=0" width="600" height="335" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>',
                Size: 456484546546
            },
            {
                Id: '3bce4931-6c75-41ab-afe0-2ec108a30860',
                Title: 'video from vimeo',
                VimeoId: '12345468425465',
                ThumbnailUrl: 'http://i.vimeocdn.com/video\/515001984_200x150.jpg',
                VideoIframe: '<iframe src="https://player.vimeo.com/video/125047382?color=ffffff&title=0&byline=0&portrait=0" width="600" height="335" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>',
                Size: 123546545646
            },
            {
                Id: '3bce4931-6c75-41ab-afe0-2ec108a30861',
                Title: 'video from vimeo video from vimeo',
                VimeoId: '12345468425465',
                ThumbnailUrl: 'http://i.vimeocdn.com/video/515255713_200x150.jpg',
                VideoIframe: '<iframe src="https://player.vimeo.com/video/125039309?color=ffffff&title=0&byline=0&portrait=0" width="600" height="335" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>',
                Size: 456484546546
            }],
            /*temporary*/
            initialize = function () {
                return Q.fcall(function () {
                    return $.ajax({
                        url: 'api/templates',
                        type: 'POST',
                        contentType: 'application/json',
                        dataType: 'json'
                    }).then(function (response) {
                        _.each(response.data, function (template) {
                            templates.push(templateModelMapper.map(template));
                        });
                    });
                }).then(function () {
                    return $.ajax({
                        url: 'api/objectives',
                        type: 'POST',
                        contentType: 'application/json',
                        dataType: 'json'
                    }).then(function (response) {
                        _.each(response.data, function (item) {
                            objectives.push(objectiveModelMapper.map(item));
                        });
                    });
                }).then(function () {
                    return $.ajax({
                        /*temporary*/
                        url: 'api/objectives',
                        type: 'POST',
                        contentType: 'application/json',
                        dataType: 'json'
                        /*temporary*/
                    }).then(function (response) {
                        _.each(videoData, function (item) {
                            videos.push(videoModelMapper.map(item));
                        });
                    });
                }).then(function () {
                    return $.ajax({
                        url: 'api/courses',
                        type: 'POST',
                        contentType: 'application/json',
                        dataType: 'json'
                    }).then(function (response) {
                        _.each(response.data, function (item) {
                            // Temporary - do not display courses if user does not have template
                            if (_.find(templates, function (template) {
                                return item.Template.Id === template.id;
                            })) {
                                courses.push(courseModelMapper.map(item, objectives, templates));
                            }
                        });
                    });
                }).fail(function () {
                    app.showMessage("Failed to initialize datacontext.");
                });
            },


            getQuestions = function () {
                var questions = [];
                _.each(objectives, function (objective) {
                    questions.push.apply(questions, objective.questions);
                });
                return questions;
            };

        return {
            initialize: initialize,
            objectives: objectives,
            courses: courses,
            templates: templates,
            getQuestions: getQuestions,
            videos: videos
        };
    });