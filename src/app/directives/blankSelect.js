(function () {

    angular.module('assessment')
        .directive('blankSelect', blankSelect);

    function blankSelect() {
        return {
            restrict: 'C',
            transclude: 'element',
            replace: true,
            scope: true,
            controller: ['$scope', '$element', function ($scope, $element) {
                var
                    attr = $element.attr('data-group-id'),
                    question = $scope.question,
                    group = _.find(question.groups, function (g) {
                        return g.groupId === attr;
                    });

                if (!group) {
                    throw 'Can\'t find answer group with id' + attr;
                }

                $scope.group = group;
            }],
            link: function ($scope, $element) {
                $element
                    .removeClass('blankSelect')
                    .on('click', function () {
                        show($element, $scope.group.answers, function (newValue) {
                            $scope.group.answer = newValue;
                            $scope.$apply();
                        });
                        //e.preventDefault();
                        //e.stopImmediatePropagation();
                    });
                if ($scope.group.answer) {
                    $element.find('.current').text($scope.group.answer);
                }
            },
            template: '<div class="select-wrapper">' +
                        '<div class="hiden">' +
                            '<div ng-repeat="(key, value) in group.answers">{{ value.text }}</div>' +
                        '</div>' +
                        '<div class="current"><span class="default">{{ "[fill in the blank choose answer]" | translate }}</span></div>' +
                        '<div class="highlight"></div>' +
                      '</div>'
        };
    }

    function show($element, options, callback) {

        if ($element.hasClass('active')) {
            return;
        }

        $element.addClass('active');

        var
            container = $('<div />')
                .addClass('select-container')
                .css({
                    position: 'absolute',
                    left: ($element.offset().left - 10) + 'px',
                    top: ($element.offset().top + $element.outerHeight() + 13) + 'px',
                    width: ($element.outerWidth() + 20) + 'px'
                })
                .append($('<ul/>')
                    .addClass('unstyled')
                    .on('click', 'li', function () {
                        var text = $(this).text();
                        $element.find('.current').text(text);
                        if (callback) {
                            callback(text);
                        }
                    })
                    .append(_.chain(options)
                        .filter(function (option) {
                            return option.text !== $element.find('.current').text();
                        })
                        .map(function (option) {
                            return $('<li/>')
                                .text(option.text);
                        }).value())
                )
                .appendTo('.container')
        //.hide()
        //.slideToggle('fast')
        ;

        var handler = function () {
            container.remove();
            $element.removeClass('active');
            $('html').off('click', handler);
            $(window).off('resize', handler);
        };

        setTimeout(function () {
            $('html').on('click', handler);
            $(window).on('resize', handler);
        }, 0);

    }

}());