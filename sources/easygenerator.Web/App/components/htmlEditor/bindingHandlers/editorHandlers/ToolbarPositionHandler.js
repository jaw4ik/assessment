import $ from 'jquery';
import binder from 'binder';
import _ from 'underscore';
import EditorHandler from './EditorHandler';
import constants from 'components/htmlEditor/constants';

const defaultToolbarTopPosition = -45,
    toolbarWidth = 610,
    htmlConstants = {
        scroll: 'scroll',
        position: 'position',
        fixed: 'fixed',
        absolute: 'absolute',
        top: 'top',
        right: 'right',
        left: 'left',
        auto: 'auto',
        resize: 'resize',
        width: 'width'
    };

class ToolbarPositionHandler extends EditorHandler {
    constructor($element, scrollableContainerSelector, contentContainerSelector) {
        super($element);
        this.$window = $(window);
        this.$scrollableContainer = $(scrollableContainerSelector);
        this.$contentContainer = $element.closest(contentContainerSelector);
        this.lazyUpdatePosition = _.debounce(this.updatePosition, 100);
        binder.bindClass(this);
    }

    on() {
        this.$element.on(constants.events.showToolbar, () => {
            this.updatePosition();
            this.$scrollableContainer.on(htmlConstants.scroll, this.updatePosition);
            this.$window.on(htmlConstants.resize, this.lazyUpdatePosition);
        });

        this.$element.on(constants.events.hideToolbar, () => {
            this.$scrollableContainer.off(htmlConstants.scroll, this.updatePosition);
            this.$window.on(htmlConstants.resize, this.updatePosition);
            this.$window.off(htmlConstants.resize, this.lazyUpdatePosition);
        });
    }

    off() {
        this.$element.off(constants.events.showToolbar);
        this.$element.off(constants.events.hideToolbar);
        this.$scrollableContainer.off(htmlConstants.scroll, this.updatePosition);
        this.$window.off(htmlConstants.resize, this.lazyUpdatePosition);
    }

    updatePosition() {
        let $scrollableContainer = this.$scrollableContainer,
            $container = this.$contentContainer,
            $element = this.$element,
            $toolbar = $element.find(`.${constants.classes.toolbar}`);

        let scrollableContainerOffset = $scrollableContainer.offset(),
            elementOffset = $element.offset(),
            elementHeight = $element.height(),
            elementWidth = $element.outerWidth(),
            toolbarHeight = $toolbar.outerHeight(),
            windowWidth = this.$window.width(),
            containerWidth = $container.outerWidth(),
            containerOffset = $container.offset();

        $toolbar.css(htmlConstants.width, `${toolbarWidth}px`); // dirty fix for ie11

        let isFixedToTop = scrollableContainerOffset.top > (elementOffset.top - toolbarHeight) && (elementOffset.top - toolbarHeight + elementHeight) > scrollableContainerOffset.top;
        $toolbar.css(htmlConstants.position, isFixedToTop ? htmlConstants.fixed : htmlConstants.absolute);
        $toolbar.css(htmlConstants.top, isFixedToTop ? scrollableContainerOffset.top : `${defaultToolbarTopPosition}px`);

        let isAlignedToRight = elementOffset.left > containerOffset.left + containerWidth / 2;
        let toolbarUnfitWidth = isAlignedToRight ?
            containerOffset.left - (elementOffset.left + elementWidth - toolbarWidth) :
            (elementOffset.left + toolbarWidth) - (containerOffset.left + containerWidth);

        let toolbarShift = toolbarUnfitWidth > 0 ? toolbarUnfitWidth : 0;
        if (toolbarShift > 0) {
            let fitsCenteredPosition = elementOffset.left + elementWidth / 2 - toolbarWidth / 2 >= containerOffset.left &&
                elementOffset.left + elementWidth / 2 + toolbarWidth / 2 <= containerOffset.left + containerWidth;

            if (fitsCenteredPosition) {
                $toolbar.css(htmlConstants.left, isFixedToTop ? `${elementOffset.left + elementWidth / 2 - toolbarWidth / 2}px` : `${elementWidth / 2 - toolbarWidth / 2}px`)
                    .css(htmlConstants.right, htmlConstants.auto);

                return;
            }
        }

        if (isAlignedToRight) {
            $toolbar.css(htmlConstants.right, isFixedToTop ? `${windowWidth - (elementOffset.left + elementWidth + toolbarShift)}px` : `${0 - toolbarShift}px`)
                .css(htmlConstants.left, htmlConstants.auto);
        } else {
            $toolbar.css(htmlConstants.left, isFixedToTop ? `${elementOffset.left - toolbarShift}px` : `${0 - toolbarShift}px`)
                .css(htmlConstants.right, htmlConstants.auto);
        }
    }
}

export default ToolbarPositionHandler;