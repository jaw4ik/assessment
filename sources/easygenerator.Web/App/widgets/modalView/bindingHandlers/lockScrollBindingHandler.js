import $ from 'jquery';
import ko from 'knockout';
import _ from 'underscore';

function preventDefault(e) {
    e = e || window.event;
    if (e.preventDefault)
        e.preventDefault();
    e.returnValue = false;  
}

function theMouseWheel(e) {
    preventDefault(e);
}

function disableScroll() {
    if (window.addEventListener) {
        window.addEventListener('DOMMouseScroll', theMouseWheel, false);
    }
    window.onmousewheel = document.onmousewheel = theMouseWheel;
}

function enableScroll() {
    if (window.removeEventListener) {
        window.removeEventListener('DOMMouseScroll', theMouseWheel, false);
    }
    window.onmousewheel = document.onmousewheel = null;  
}


ko.bindingHandlers.lockScroll = {
    init: (element, valueAccessor) => {
        let isLock = valueAccessor();
        let currentScrollPosition = 0;
        let scrollHandler = () => {
            if (isLock()) {
                $(window).scrollTop(currentScrollPosition);
            } else {
                currentScrollPosition = $(window).scrollTop();
            }
        };

        $(window).on('scroll', scrollHandler);
        let lockSubscription = isLock.subscribe((newValue) => {
            newValue ? disableScroll() : enableScroll();    
        });

        ko.utils.domNodeDisposal.addDisposeCallback(element, () => {
            $(window).off('scroll', scrollHandler);
            lockSubscription.dispose();
        });
    },
    update: (element, valueAccessor) => {
    }
};