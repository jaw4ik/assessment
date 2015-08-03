(function () {
    'use strict';

    angular
        .module('assessment')
        .factory('HintViewModel', factory);

    factory.$inject = ['$q', '$http', '$templateCache', '$timeout'];

    function factory($q, $http, $templateCache, $timeout) {
        return function HintViewModel(question) {
            var that = this;

            that.learningContents = [];
            that.exists = question.learningContents && question.learningContents.length;
            that.isDisplayed = false;
            that.scrollToQuestion = false;
            that.isLoaded = false;

            that.show = function () {
                that.isDisplayed = true;
                if (!that.isLoaded) {
                    getLearningContents(question.learningContents);
                } else {
                    that.hintStartTime = new Date();
                }
            };

            that.hide = function (scrollToQuestion) {
                that.scrollToQuestion = scrollToQuestion;
                that.isDisplayed = false;
                if (that.isLoaded) {
                    sendLearningContentsExperienced();
                }
            };

            that.deactivate = function () {
                if (that.isDisplayed && that.isLoaded) {
                    sendLearningContentsExperienced();
                }
            };

            function sendLearningContentsExperienced() {
                that.hintEndTime = new Date();
                question.learningContentsExperienced(that.hintEndTime - that.hintStartTime);
            }

            function getLearningContents(learningContents) {
                var promises = [];
                _.each(learningContents, function (learningContent) {
                    promises.push($http.get(learningContent.contentUrl, { dataType: 'html' }).success(function (response) {
                        that.learningContents.push({
                            id: learningContent.id,
                            content: response
                        });
                    }));
                });

                $q.all(promises).then(function () {
                    that.learningContents = _.chain(learningContents).map(function (learningContent) {
                        return _.find(that.learningContents, function (learnCont) {
                            return learningContent.id == learnCont.id;
                        });
                    })
                    .value();

                    $timeout(function () {
                        that.isLoaded = true;
                        that.hintStartTime = new Date();
                    }, 400);
                });
            }
        };

    }

}());