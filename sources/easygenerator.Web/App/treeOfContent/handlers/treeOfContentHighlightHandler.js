define(['routing/router'], function (router) {
    var selector = '.navigation-tree-node';
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

                url = url.replace('/design', '').replace('/configure', '').replace('/publish', '').replace('/results', '');

                //console.log('Highlighting URL ' + url);

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