ko.bindingHandlers.tabs = {
    init: function (element) {
        var $element = $(element),
            dataTabLink = 'data-tab-link',
            dataTabContent = 'data-tab-content',
            $tabLinks = $element.find('[' + dataTabLink + ']'),
            $contents = $element.find('[' + dataTabContent + ']'),
            activeClass = 'active',
            duration = 200;

        $tabLinks.first().addClass(activeClass);
        $contents.first().show().addClass(activeClass);

        $tabLinks.each(function (index, item) {
            var $item = $(item);
            $item.on('click', function () {
                if ($item.hasClass(activeClass)) {
                    return;
                }

                var key = $item.attr(dataTabLink),
                    $previousContentTab = $element.find('.' + activeClass + '[' + dataTabContent + ']'),
                    $currentContentTab = $element.find('[' + dataTabContent + '="' + key + '"]');

                $tabLinks.removeClass(activeClass);
                $item.addClass(activeClass);

                $previousContentTab.fadeOut(duration, function () {
                    $currentContentTab.fadeIn(duration).addClass(activeClass);
                    $previousContentTab.removeClass(activeClass);
                });
            });
        });
    }
};