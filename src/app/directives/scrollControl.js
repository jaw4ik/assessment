(function () {

    angular.module('quiz')
        .directive('scrollControl', scrollControl)
        .directive('fixedContainer', fixedContainer)
        .directive('secondaryContainer', secondaryContainer);

    function isMobileDevice() {
        var ua = navigator.userAgent.toLowerCase();
        return ua.indexOf('ipod') !== -1 || ua.indexOf('iphone') !== -1 || ua.indexOf('ipad') !== -1 || ua.indexOf('android') !== -1;
    }

    function scrollControl() {
        return {
            restrict: 'E',
            controller: function () {
                var scrollPauseValue = 700; //700px - scroll height pause

                this.scrollableHeight = 0;
                this.scrollWithPause = false;

                this.setScrollableHeight = function (height) {
                    this.scrollableHeight = height;
                };

                this.getScrollableHeight = function () {
                    return this.scrollWithPause ? this.scrollableHeight + scrollPauseValue : this.scrollableHeight;
                };

                this.isMobileDevice = isMobileDevice();
            }
        };
    }

    function fixedContainer() {
        return {
            restrict: 'E',
            require: "^^scrollControl",
            link: function ($scope, $element, attrs, scrollCtrl) {
                var $window = $(window),
                    $fixedBlock = $('[fixed-block]', $element),
                    $scrollableBlock = $('[scrollable-block]', $element),
                    $headerBlock = $('[header]', $element);

                $scope.scrollToSecondContainer = function () {
                    $('html, body').animate({ scrollTop: $window.height() + scrollCtrl.getScrollableHeight() - $headerBlock.height() });
                };

                if (scrollCtrl.isMobileDevice) {
                    return;
                }

                $element.height($window.height());
                $window.resize(function () {
                    $element.height($window.height());
                });

                setPositionFixed($fixedBlock);

                $window.scroll(function () {
                    var scrollableHeight = scrollCtrl.getScrollableHeight(),
                        windowScrollTop = $window.scrollTop();

                    if (windowScrollTop >= scrollableHeight) {
                        setTopPosition($fixedBlock, scrollableHeight);
                        setPositionRelative($fixedBlock);
                    } else {
                        setTopPosition($fixedBlock, 0);
                        setPositionFixed($fixedBlock);
                    }

                    $scrollableBlock.scrollTop(windowScrollTop);

                    //Header logo appearance
                    $headerBlock.toggleClass('overlapping', windowScrollTop >= ($window.height() + scrollCtrl.getScrollableHeight() - $headerBlock.height()));
                });

                //----------------
                var topPositionClass = 'at-top-position',
                    bottomPositionClass = 'at-bottom-position',

                    $scrollableBlockParent = $scrollableBlock.parent();

                $scrollableBlockParent.addClass(topPositionClass).addClass(bottomPositionClass);

                $scope.contentLoaded = function () {
                    var scrollableBlockHeight = $scrollableBlock.height(),
                        scrollableBlockOuterHeight = $scrollableBlock.outerHeight(),
                        scrollableBlockScrollHeight = $scrollableBlock[0].scrollHeight;

                    $scope.$watch(function () {
                        return $scrollableBlock[0].scrollHeight;
                    }, function () {
                        scrollableBlockHeight = $scrollableBlock.height();
                        scrollableBlockOuterHeight = $scrollableBlock.outerHeight();
                        scrollableBlockScrollHeight = $scrollableBlock[0].scrollHeight;

                        scrollCtrl.setScrollableHeight(scrollableBlockScrollHeight - scrollableBlockOuterHeight);
                    });

                    var $showOnBottom = $('[show-on-bottom]');
                    $showOnBottom.hide();

                    if (scrollableBlockHeight < scrollableBlockScrollHeight - scrollableBlockOuterHeight + scrollableBlockHeight) {
                        scrollCtrl.scrollWithPause = true;

                        $scrollableBlockParent.removeClass(bottomPositionClass);

                        $scrollableBlock.scroll(function () {
                            var scrollTop = Math.round($scrollableBlock.scrollTop()),
                                isTopPosition = scrollTop === 0,
                                isBottomPosition = scrollableBlockScrollHeight - scrollTop <= scrollableBlockOuterHeight;

                            $scrollableBlockParent.toggleClass(topPositionClass, isTopPosition).toggleClass(bottomPositionClass, isBottomPosition);

                            if (!$showOnBottom.is(':visible') && isBottomPosition) {
                                $('html, body').finish().animate({ scrollTop: $window.scrollTop() + $showOnBottom.height() }, 300);
                                $showOnBottom.fadeIn(300);
                            }
                        });
                    } else {
                        $showOnBottom.show();
                    }
                };
            }
        };
    }

    function secondaryContainer() {
        return {
            restrict: 'E',
            require: "^^scrollControl",
            link: function ($scope, $element, attrs, scrollCtrl) {
                if (scrollCtrl.isMobileDevice) {
                    return;
                }

                $scope.$watch(function () {
                    return scrollCtrl.getScrollableHeight();
                }, function () {
                    setTopPosition($element, scrollCtrl.getScrollableHeight());
                });
            }
        };
    }

    function setPositionFixed($element) {
        $element.css('position', 'fixed');
    }

    function setPositionRelative($element) {
        $element.css('position', 'relative');
    }

    function setTopPosition($element, top) {
        $element.css('top', top);
    }

})();