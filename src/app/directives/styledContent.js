(function () {

    angular.module('assessment')
        .directive('styledContent', styledContent);

    function styledContent() {
        
        return {
            restrict: 'A',
            link: function ($scope, element) {
                var $element = $(element),
                    imageWrapper = '<div class="image-wrapper"></div>',
                    tableWrapper = '<div class="table-wrapper"></div>';
                $element.addClass('styled-content');

                $scope.$on('$includeContentLoaded', function () {

                    $('img', $element).each(function (index, image) {
                        var $image = $(image),
                            $wrapper = $(imageWrapper).css('float', $image.css('float'));
                        $image.css('float', 'none');
                        $image.wrap($wrapper);
                    });

                    $('table', $element).each(function (index, table) {
                        var $table = $(table),
                            $wrapper = $(tableWrapper).css('text-align', $table.attr('align'));
                        $table.attr('align', 'center');
                        $table.wrap($wrapper);
                    });
 
                });
            }
        };
    }
}());