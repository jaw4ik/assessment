import ko from 'knockout';
import $ from 'jquery';
import composition from 'durandal/composition';

ko.bindingHandlers.tooltipPopover = {
    init: (element, valueAccessors) => {
        let target = $(element);
        let popover = $('.editor-tooltip');
        let parent = target.closest('[data-bind*="scrollbar"]');

        let handler = () => {
            let target = $(element);
            let offset = target.offset();
            let popoverOffset = popover.parent().offset();

            let css = {
                top: offset.top - popoverOffset.top + (target.outerHeight() - popover.outerHeight()) / 2,
                left: offset.left  - popoverOffset.left + target.outerWidth()
            };
            popover.css({ top: css.top, left: css.left });
        };
        
        handler();

        parent.on('scroll', handler);
        $(window).on('resize', handler);

        ko.utils.domNodeDisposal.addDisposeCallback(element, () => {
            parent.off('scroll', handler);
            $(window).off('resize', handler);
        });
    },
    update: (element, valueAccessors) => {
    }
};

composition.addBindingHandler('tooltipPopover');