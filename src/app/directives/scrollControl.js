(function () {

    angular.module('quiz')
        .directive('scrollControl', scrollControl);

    function isMobileDevice() {
        var ua = navigator.userAgent.toLowerCase();
        return ua.indexOf('ipod') !== -1 || ua.indexOf('iphone') !== -1 || ua.indexOf('ipad') !== -1 || ua.indexOf('android') !== -1;
    }

    scrollControl.$inject = ['$routeParams'];

    function scrollControl($routeParams) {
        return {
            restrict: 'A',
            link: function ($scope, $element) {
                var $questions = $element.children('questions');

                $scope.scrollToQuestions = function () {
                    scrollTo($questions.offset().top);
                };
                //$routeParams.tryAgain

                if (isMobileDevice()) {
                    subscribeToMobileEvents($scope, $element);
                } else if ($scope.quiz.hasIntroductionContent) {
                    subscribeToEvents($scope, $element);
                }
            }
        };
    }

    function scrollTo(scrollTop) {
        $('html, body').animate({ scrollTop: scrollTop }, 1000);
    }

    function subscribeToMobileEvents($scope, $container) {
        var $window = $(window),
            $header = $container.children('header'),
            $questions = $container.children('questions');

        var mobileScrollHandler = function () {
            $header.toggleClass('hide-buttons', $window.scrollTop() >= $questions.offset().top - $header.height());
        };

        $window.bind('scroll', mobileScrollHandler);

        $scope.$on('$destroy', function () {
            $window.unbind('scroll', mobileScrollHandler);
        });
    }

    function subscribeToEvents($scope, $container) {
        var $window = $(window),
            $introduction = $container.children('introduction'),
            $header = $container.children('header'),
            $questions = $container.children('questions'),
            $introductionContent = $introduction.find('[content]'),

            //Events handlers
            windowScrollHandler = function () {
                var scrollableHeight = $questions.offset().top - $introduction.height(),
                    windowScrollTop = $window.scrollTop();

                if (windowScrollTop >= scrollableHeight) {
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
                $container.toggleClass('scrolled-to-questions', windowScrollTop >= ($questions.offset().top - $header.height()));
            },
            windowResizeHandler = function () {
                $introduction.height($window.height());
            },
            introContentScrollHandler = function () {
                var topPositionClass = 'at-top-position',
                    bottomPositionClass = 'at-bottom-position';

                var scrollTop = Math.round($introductionContent.scrollTop()),
                    isTopPosition = scrollTop === 0,
                    isBottomPosition = scrollTop >= $introductionContent[0].scrollHeight - $introductionContent.outerHeight() - 5;

                $introduction
                    .toggleClass(topPositionClass, isTopPosition)
                    .toggleClass(bottomPositionClass, isBottomPosition);
            },
            introHeightUpdatedHandler = function () {
                var introductionContentOuterHeight = $introductionContent.outerHeight(),
                    introductionContentScrollHeight = $introductionContent[0].scrollHeight;

                if (introductionContentScrollHeight > introductionContentOuterHeight) {
                    $questions.css('top', introductionContentScrollHeight - introductionContentOuterHeight + $introduction.height() + 500); // 500px - scroll pause between intro and questions
                    $introductionContent.bind('scroll', introContentScrollHandler).addClass('scrollable');
                } else {
                    $questions.css('top', $introduction.height());
                }
                introContentScrollHandler();
            };

        $scope.$watch(function () {
            return $introductionContent.outerHeight() + $introductionContent[0].scrollHeight;
        }, introHeightUpdatedHandler);

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