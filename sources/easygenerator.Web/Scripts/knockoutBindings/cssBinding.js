ko.bindingHandlers.fixedBlocksPosition = {
    init: function (element, valueAccessor) { },

    update: function (element, valueAccessor) {

        var helpHintHeight,
            contentContainer = '#content',
            helpHint = '.help-hint',
            contextMenuHolder = '.contextMenuHolder',
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

            var contextMenuHeight = 0;
            if (!_.isNullOrUndefined($(contextMenuHolder).height())) {
                contextMenuHeight = $(contextMenuHolder).height();
            }

            $(fixedContainer).css('top', headerHeight + contextMenuHeight + helpHintHeight + 'px');
            $(notifyContainer).css('top', headerHeight + contextMenuHeight + helpHintHeight + 'px');
            $(notFixedContainer).css('padding-top', fixedContainerHeight + contextMenuHeight + helpHintHeight + 'px');
            $(contentContainer).css('min-height', 600 + helpHintHeight + 'px');
            $(backBtn).css('padding-top', parseInt($(fixedContainer).css('top')) + 14 + 'px');
            $(helpHint).css('padding-top', contextMenuHeight + 'px');
        }
    }

};
