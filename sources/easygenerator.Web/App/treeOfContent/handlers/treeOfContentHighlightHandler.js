define(['plugins/router'], function (router) {
    var selector = '.navigation-tree-node-caption-wrapper';
    var activeSelector = selector + '.active';

    return {
        handle: function () {

            $(activeSelector).removeClass('active');

            var activeInstruction = router.activeInstruction();
            if (activeInstruction && activeInstruction.fragment) {

                var url = '#' + activeInstruction.fragment;
                if (activeInstruction.queryString) {
                    url += "?" + activeInstruction.queryString;
                }

                url = url.replace('design', 'course').replace('deliver', 'course');

                highlightElementWithUrl(url);
                setTimeout(function () {
                    highlightElementWithUrl(url);
                }, 100);
                setTimeout(function () {
                    highlightElementWithUrl(url);
                }, 250);
            }

        }
    };

    function highlightElementWithUrl(url) {
        if ($(activeSelector).length === 0) {
            var $element = $('[href="' + url + '"]');

            if ($element.hasClass(selector)) {
                $element.addClass('active');
            } else {
                $element.closest(selector).addClass('active');
            }
        }
    }

})