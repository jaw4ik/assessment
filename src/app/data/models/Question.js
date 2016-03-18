(function () {
    'use strict';

    angular
        .module('assessment')
        .factory('Question', factory);

    factory.$inject = ['$q', '$rootScope', 'LearningContent', 'htmlContentLoader'];

    function factory($q, $rootScope, LearningContent, htmlContentLoader) {
        return function Question(sectionId, id, title, hasContent, learningContents, type, _protected) {
            var that = this;
            that.id = id;
            that.sectionId = sectionId;
            that.title = title;

            that.hasContent = hasContent;
            that.content = null;

            that.learningContents = learningContents.map(function (learningContent) {
                var learningContentUrl = 'content/' + that.sectionId + '/' + that.id + '/' + learningContent.id + '.html';
                return new LearningContent(learningContent.id, learningContentUrl);
            });

            that.type = type;
            that.score = 0;

            that.answer = function () {
                _protected.answer.apply(this, arguments);

                $rootScope.$emit('question:answered', {
                    question: that,
                    answers: arguments[0]
                });
            };

            that.learningContentsExperienced = function (time) {
                $rootScope.$emit('learningContent:experienced', {
                    question: that,
                    time: time
                });
            };

            that.loadContent = function () {
                return $q.when(null, function () {
                    if (!that.hasContent || that.content) {
                        return;
                    }

                    return htmlContentLoader.load('content/' + that.sectionId + '/' + that.id + '/content.html').success(function (content) {
                        that.content = content;
                    });
                });
            };
        };
    }

} ());