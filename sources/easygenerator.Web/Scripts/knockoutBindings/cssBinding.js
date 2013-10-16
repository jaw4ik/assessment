ko.bindingHandlers.fixedBlocksPosition = {
    init: function (elem, va) {

    },

    update: function (elem, va) {
        var
            helpHintHeight,
            contentContainer = '#content',
            helpHint = '.help-hint',
            helpHintText = '.help-hint .hh-text',
            notFixedContainer = '.view-module',
            fixedContainer = '.view-module > .fixed-container:first-child';

        var headerHeight = $('.header').height(),
            topNavHeight = $('.top-navigation').height();

        if (!$(helpHintText).is(':empty')) {
            if ($(helpHint).height() > 69) {
                helpHintHeight = $(helpHint).height();
            } else {
                helpHintHeight = 0;
            }
        }

        $(fixedContainer).css('top', headerHeight + topNavHeight + helpHintHeight + 'px');
        $(notFixedContainer).css('padding-top', 40 + helpHintHeight + 'px');
        $(contentContainer).css('min-height', 600 + helpHintHeight + 'px');

        console.log(helpHintHeight);
    }
};