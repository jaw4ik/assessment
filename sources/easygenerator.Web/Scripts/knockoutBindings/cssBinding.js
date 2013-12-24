ko.bindingHandlers.fixedBlocksPosition = {
    init: function (elem, va) {
        
    },

    update: function (elem, va) {

        var helpHintHeight,
            contentContainer = '#content',
            helpHint = '.help-hint',
            helpHintText = '.help-hint-text',
            notFixedContainer = '.view-module',
            fixedContainer = '.view-module > .fixed-container:first-child',
            notifyContainer = '.notify.fixed-container',
            backBtn = '.nav-back-holder';

        _.delay(setHeight, 10);
        
        $(window).resize(setHeight);

        function setHeight() {

            var headerHeight = $('.header').height(),
                topNavHeight = $('.top-navigation').height(),
                fixedContainerHeight = $(fixedContainer).height() - 9;

            if (!$(helpHintText).is(':empty')) {

                if ($(helpHint).height() > 73) {
                    helpHintHeight = $(helpHint).height();
                } else {
                    helpHintHeight = 0;
                }
            } else {
                helpHintHeight = 0;
            }

            $(fixedContainer).css('top', headerHeight + topNavHeight + helpHintHeight + 'px');
            $(notifyContainer).css('top', headerHeight + topNavHeight + helpHintHeight + 'px');
            $(notFixedContainer).css('padding-top', fixedContainerHeight + helpHintHeight + 'px');
            $(contentContainer).css('min-height', 600 + helpHintHeight + 'px');
            $(backBtn).css('padding-top', parseInt($(fixedContainer).css('top')) + 14 + 'px');
        }
    }

};
