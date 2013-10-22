﻿ko.bindingHandlers.fixedBlocksPosition = {
    init: function (elem, va) {

    },

    update: function (elem, va) {
        var
            helpHintHeight,
            contentContainer = '#content',
            helpHint = '.help-hint',
            helpHintText = '.help-hint-text',
            notFixedContainer = '.view-module',
            fixedContainer = '.view-module > .fixed-container:first-child',

            headerHeight = $('.header').height(),
            topNavHeight = $('.top-navigation').height();

        setTimeout(function() {
            if (!$(helpHintText).is(':empty')) {
                if ($(helpHint).height() > 73) {
                    helpHintHeight = $(helpHint).height();
                } else {
                    helpHintHeight = 0;
                }
            }

            $(fixedContainer).css('top', headerHeight + topNavHeight + helpHintHeight + 'px');
            $(notFixedContainer).css('padding-top', 40 + helpHintHeight + 'px');
            $(contentContainer).css('min-height', 600 + helpHintHeight + 'px');
        }, 10);
    }
};
