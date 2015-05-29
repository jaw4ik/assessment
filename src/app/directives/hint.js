(function () {
    'use strict';
    
    angular.module('quiz').directive('hint', directive);

    directive.$inject = ['$compile'];

    function directive($compile) {
        return {
            restrict: 'A',
            link: function ($scope, $element, attrs) {
                var unbind = $scope.$watch(attrs.hint, set);

                function set(newValue) {
                    if (!_.isUndefined(newValue)) {
                        var dataType = getLearningContentType(newValue);
                        switch(dataType){
                            case 'hotspot': 
                                var hotspotOnImage = new HotspotOnImage($(newValue)[0]);
                                $element.html(hotspotOnImage.element);
                                break;
                            default:
                                $element.html(newValue);
                        }
                        $compile($element.contents())($scope);
                        $scope.$emit('$includeContentLoaded');
                        unbind();
                    }
                }
                
                function getLearningContentType(data){
                    var $output = $('<output>').html(data),
                        dataType = $('[data-type]', $output).attr('data-type');

                    return dataType;
                }
            }
        };
    }
}());