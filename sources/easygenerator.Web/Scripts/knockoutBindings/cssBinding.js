ko.bindingHandlers.fixedBlocksPosition = {
    init: function (element, valueAccessor) { },

    update: function (element, valueAccessor) {

        var helpHintHeight,
            contentContainer = '#content',
            helpHint = '.help-hint',
            courseNavigationHolder = '.courseNavigationHolder',
            notFixedContainer = '.view-module',
            fixedContainer = '.view-module > .fixed-container:first-child',
            notifyContainer = '.notify.fixed-container',
            backBtn = '.nav-back-holder',
            value = ko.unwrap(valueAccessor());

        _.delay(setHeight, 10);
        
        $(window).resize(setHeight);

        function setHeight() {
            
            var headerHeight = $('.header').height(),
                paddingBeforeViewModule = 0;

            if ($(fixedContainer).height() > 0) {
                paddingBeforeViewModule = $(fixedContainer).height() - 9;
            } else {
                paddingBeforeViewModule = 20;
            }

            if (!_.isEmptyOrWhitespace(value)) {

                if ($(helpHint).height() > 73) {
                    helpHintHeight = $(helpHint).height();
                } else {
                    helpHintHeight = 0;
                }
            } else {
                helpHintHeight = 0;
            }

            var courseNavigationHeight = 0;
            if (!_.isNullOrUndefined($(courseNavigationHolder).height())) {
                courseNavigationHeight = $(courseNavigationHolder).height();
            }
            
            $(fixedContainer).css('top', headerHeight + courseNavigationHeight + helpHintHeight + 'px');
            $(notifyContainer).css('top', headerHeight + courseNavigationHeight + helpHintHeight + 'px');
            $(notFixedContainer).css('padding-top', paddingBeforeViewModule + helpHintHeight + 'px');
            $(contentContainer).css('min-height', 600 + helpHintHeight + 'px');
            $(backBtn).css('padding-top', parseInt($(fixedContainer).css('top')) + 14 + 'px');
        }
    }

};
