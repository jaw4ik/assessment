(function () {

    angular.module('quiz')
        .directive('scrollControl', scrollControl);

    function isMobileDevice() {
        var ua = navigator.userAgent.toLowerCase();
        return ua.indexOf('ipod') !== -1 || ua.indexOf('iphone') !== -1 || ua.indexOf('ipad') !== -1 || ua.indexOf('android') !== -1;
    }

    scrollControl.$inject = ['$routeParams', '$location', '$timeout'];

    function scrollControl($routeParams, $location, $timeout) {
        return {
            restrict: 'A',
            link: function ($scope, $element) {
                if (isMobileDevice()) {
                    subscribeToMobileEvents($scope, $element);
                } else if ($scope.quiz.hasIntroductionContent) {
                    subscribeToEvents($scope, $element, $timeout);
                }

                if (!$scope.quiz.hasIntroductionContent) {
                    $timeout(function () {
                        broadcastQuizStartedEvent($scope);
                    }, 1000);
                }

                if ($routeParams.tryAgain) {
                    $location.search('tryAgain', null);

                    if ($scope.scrollToQuestions) {
                        $timeout($scope.scrollToQuestions, 1000);
                    }
                }
            }
        };
    }

    function scrollTo(scrollTop) {
        $('html, body').animate({ scrollTop: scrollTop }, 1000);
    }

    function broadcastQuizStartedEvent($scope) {
        if (!$scope.quizStarted) {
            $scope.quizStarted = true;
            $scope.$emit('$quizStarted');
        }
    }

    function subscribeToMobileEvents($scope, $container) {
        var $window = $(window),
            $header = $container.children('header'),
            $questions = $container.children('questions');

        $scope.scrollToQuestions = function () {
            scrollTo($questions.offset().top - $header.height());
        };

        var
            //Events handlers
            windowScrollHandler = function () {
                var questionsReached = $window.scrollTop() >= $questions.offset().top - $window.height();

                if (questionsReached) {
                    broadcastQuizStartedEvent($scope);
                    $container.addClass('questions-reached');
                }
            },

            previousWindowSize = {},
            windowResizeHandler = function () {
                var windowWidth = $window.width(),
                    windowHeight = $window.height() + 250; //250px - reserve for Chrome window height resize

                //Check if mobile device orientation changed
                if (windowWidth !== previousWindowSize.width && windowHeight !== previousWindowSize.height) {
                    $('.main-background', $container).height(windowHeight);
                }

                previousWindowSize.width = windowWidth;
                previousWindowSize.height = windowHeight;
            };

        $window
            .bind('scroll', windowScrollHandler)
            .bind('resize', windowResizeHandler)
            .ready(windowResizeHandler);

        $scope.$on('$destroy', function () {
            $window
                .unbind('scroll', windowScrollHandler)
                .unbind('resize', windowResizeHandler);
        });
    }

    function subscribeToEvents($scope, $container, $timeout) {
        var $window = $(window),
            $introduction = $container.children('introduction'),
            $header = $container.children('header'),
            $questions = $container.children('questions'),
            $introductionContent = $introduction.find('[content]');

        $scope.scrollToQuestions = function () {
            scrollTo($questions.offset().top);
        };

        $questions.css('top', $window.height());

        //Events handlers
        var
            windowScrollHandler = function () {
                var scrollableHeight = $questions.offset().top - $introduction.height(),
                    windowScrollTop = $window.scrollTop(),
                    questionsReached = windowScrollTop >= scrollableHeight,
                    introGone = windowScrollTop >= ($questions.offset().top - $header.height());

                //Fix for browser initial scrolling
                if (scrollableHeight <= 0) {
                    return;
                }

                if (questionsReached) {
                    broadcastQuizStartedEvent($scope);

                    $introduction
                        .css('top', scrollableHeight)
                        .css('position', 'absolute');
                } else {
                    $introduction
                        .css('top', 0)
                        .css('position', 'fixed');
                }

                $introductionContent.scrollTop(windowScrollTop);

                //Header logo appearance
                $container
                    .toggleClass('questions-reached', questionsReached)
                    .toggleClass('intro-gone', introGone);
            },
            windowResizeHandler = function () {
                $introduction.height($window.height());
                $('.main-background', $header).height($window.height());
            },
            introContentScrollHandler = function () {
                var topPositionClass = 'at-top-position',
                    bottomPositionClass = 'at-bottom-position';

                var scrollTop = Math.round($introductionContent.scrollTop()),
                    isTopPosition = scrollTop === 0,
                    isBottomPosition = scrollTop >= ($introductionContent[0].scrollHeight - $introductionContent.outerHeight() - 1);

                $introduction
                    .toggleClass(topPositionClass, isTopPosition)
                    .toggleClass(bottomPositionClass, isBottomPosition);
            },
            introHeightUpdatedHandler = function () {
                var introductionContentOuterHeight = $introductionContent.outerHeight(),
                    introductionContentScrollHeight = $introductionContent[0].scrollHeight;

                if (introductionContentScrollHeight > introductionContentOuterHeight) {
                    $questions.css('top', introductionContentScrollHeight - introductionContentOuterHeight + $introduction.height() + 500); // 500px - scroll pause between intro and questions
                    $introductionContent.bind('scroll', introContentScrollHandler);
                } else {
                    $questions.css('top', $introduction.height());
                }

                introContentScrollHandler();
            };

        $scope.contentLoaded = function () {
            $timeout(introHeightUpdatedHandler, 500);
        };

        $window
            .bind('resize', windowResizeHandler)
            .bind('resize', introHeightUpdatedHandler)
            .bind('scroll resize', windowScrollHandler)
            .ready(windowResizeHandler);

        $scope.$on('$destroy', function () {
            $window
                .unbind('resize', windowResizeHandler)
                .unbind('resize', introHeightUpdatedHandler)
                .unbind('scroll resize', windowScrollHandler);
        });
    }

})();