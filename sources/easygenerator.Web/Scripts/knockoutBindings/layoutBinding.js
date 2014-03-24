ko.bindingHandlers.cellSize = {
    init: function (element, valueAccessor) {
        if (!isIE()) {
            return;
        }

        var resizeChild = valueAccessor().resizeChild || false;

        $(window).on('resize', function() {
            resizeArea(element, resizeChild);
        });
    },
    update: function (element, valueAccessor) {
        if (!isIE()) {
            return;
        }

        var resizeChild = valueAccessor().resizeChild || false;

        _.defer(function () {
            resizeArea(element, resizeChild);
        });
    }
};

function isIE() {
    var agent = window.navigator.userAgent;
    return agent.match(/MSIE 9/i) || agent.match(/MSIE 10/i);
}

function resizeArea(element, resizeChild) {
    var $element = $(element);
    $element.height(window.innerHeight - $('.header').height());

    if (resizeChild) {
        var $child = $element.children();

        $child.css('height', 'auto');
        $child.height($element.height() - $child.height());
    }
}