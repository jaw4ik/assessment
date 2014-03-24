ko.bindingHandlers.fixedPanel = {
    init: function (element) {

        var $element = $(element);

        _.defer(function () {
            var topPosition = element.offsetTop;

            $element.parent().parent().on('scroll', function () {
                $element.css('top', (topPosition - $element.parent().position().top) + 'px');
            });

            culculateHeight($element);
        });

        $(window).on('resize', function () {
            culculateHeight($element);
        });
    },
    update: function (element, valueAccessor) {

        valueAccessor();
        culculateHeight($(element));
    }
};

function culculateHeight($element) {
    $element.height(this.innerHeight - $element.offset().top);
}