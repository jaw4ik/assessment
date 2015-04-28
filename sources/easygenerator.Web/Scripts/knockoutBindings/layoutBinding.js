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
    return getIEVersion() !== -1;
}

function getIEVersion()
{
    var agent = window.navigator.userAgent;
    if (agent.match(/MSIE 9/i)) {
        return 9;
    } else if (agent.match(/MSIE 10/i)) {
        return 10;
    } else if (agent.match(/Trident.*rv\:11\./)) {
        return 11;
    }
    return -1;
}

function resizeArea(element, resizeChild) {
    var
        $element = $(element),
        contentAreaHeight = window.innerHeight - $('.header').height();

    $element.height(contentAreaHeight);

    if (resizeChild) {
        var $child = $element.children();

        $child.css('height', 'auto');

        var childHeight = (getIEVersion() === 11)
            ? contentAreaHeight
            : contentAreaHeight - $child.height();
        
        $child.height(childHeight);
    }
}