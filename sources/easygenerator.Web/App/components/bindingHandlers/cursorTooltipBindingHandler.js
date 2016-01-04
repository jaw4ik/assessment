﻿import ko from 'knockout';
import $ from 'jquery';

ko.bindingHandlers.cursorTooltip = {
    update: (element, valueAccessor) => {
        let $element = $(element);
        let isVisible = ko.utils.unwrapObservable(valueAccessor());
        let updateTooltipPosition = evt => $element.css('top', evt.pageY + 5).css('left', evt.pageX + 5);

        if (isVisible) {
            $element.show();
            $('html').bind('mousemove', updateTooltipPosition);
        } else {
            $element.hide();
            $('html').unbind('mousemove', updateTooltipPosition);
        }
    }
};