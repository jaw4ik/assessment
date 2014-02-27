define(['plugins/router'], function (router) {

    return {
        handle: function () {

            var selector = '.navigation-tree-node-caption-wrapper';

            $(selector).removeClass('active');

            setTimeout(function () {
                var activeInstruction = router.activeInstruction();
                if (activeInstruction && activeInstruction.fragment) {

                    var url = '#' + activeInstruction.fragment;
                    if (activeInstruction.queryString) {
                        url += "?" + activeInstruction.queryString;
                    }

                    url = url.replace('design', 'course').replace('deliver', 'course');

                    var $element = $('[href="' + url + '"]');

                    if ($element.hasClass(selector)) {
                        $element.addClass('active');
                    } else {
                        $element.closest(selector).addClass('active');
                    }
                }

            }, 100);
        }
    };

})