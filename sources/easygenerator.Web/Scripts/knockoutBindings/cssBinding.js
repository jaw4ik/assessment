ko.bindingHandlers.fixedBlocksPosition = {
    init: function (element, valueAccessor) { },

    update: function (element, valueAccessor) {

        var helpHintHeight,
            contentContainer = '#content',
            helpHint = '.help-hint',
            notFixedContainer = '.view-module',
            fixedContainer = '.view-module > .fixed-container:first-child',
            notifyContainer = '.notify.fixed-container',
            backBtn = '.nav-back-holder',
            value = ko.unwrap(valueAccessor());

        _.delay(setHeight, 10);
        
        $(window).resize(setHeight);

        function setHeight() {
            
            var headerHeight = $('.header').height(),
                fixedContainerHeight = $(fixedContainer).height() - 9;

            if (!_.isEmptyOrWhitespace(value)) {

                if ($(helpHint).height() > 73) {
                    helpHintHeight = $(helpHint).height();
                } else {
                    helpHintHeight = 0;
                }
            } else {
                helpHintHeight = 0;
            }

            $(fixedContainer).css('top', headerHeight + helpHintHeight + 'px');
            $(notifyContainer).css('top', headerHeight + helpHintHeight + 'px');
            $(notFixedContainer).css('padding-top', fixedContainerHeight + helpHintHeight + 'px');
            $(contentContainer).css('min-height', 600 + helpHintHeight + 'px');
            $(backBtn).css('padding-top', parseInt($(fixedContainer).css('top')) + 14 + 'px');
        }
    }

};
