import $ from 'jquery';
import ko from 'knockout';
import _ from 'underscore';

class ScrollLocker{
    constructor (hideScroll) {
        this.lock = false;
        this.hideScroll = hideScroll;
        this._currentScrollPosition = $(window).scrollTop();
        this._overflowY = '';
        this._overflowX = '';

        hideScroll ? this.lockScroll() : this.releaseScroll();   
        $(window).on('scroll', this._scrollHandler.bind(this));
    }
    deactivate() {
        $(window).off('scroll', this._scrollHandler.bind(this));
    }
    _scrollHandler() {
        if (!this.lock) {
            this._currentScrollPosition = $(window).scrollTop();
        } else if (!this.hideScroll) {
            $(window).scrollTop(this._currentScrollPosition);
        }
    }
    _preventDefault(e) {
        e = e || window.event;
        if (e.preventDefault)
            e.preventDefault();
        e.returnValue = false;  
    }
    releaseScroll() {
        this.lock = false;
        if (window.removeEventListener) {
            window.removeEventListener('DOMMouseScroll', this._preventDefault, false);
        }
        window.onmousewheel = document.onmousewheel = null;

        if (this.hideScroll) {
            $('html').css('overflow-y', this._overflowY);
            $('html').css('overflow-x', this._overflowX);
            $(window).scrollTop(this._currentScrollPosition);
        }
    }
    lockScroll() {
        this.lock = true;
        if (window.addEventListener) {
            window.addEventListener('DOMMouseScroll', this._preventDefault, false);
        }
        window.onmousewheel = document.onmousewheel = this._preventDefault;

        if (this.hideScroll) {
            this._overflowY = $('html').css('overflow-y');
            this._overflowX = $('html').css('overflow-x');
            $('html').css('overflow-x', 'hidden');
            $('html').css('overflow-y', 'hidden');
            $(window).scrollTop(this._currentScrollPosition);
        }
    }
}

ko.bindingHandlers.lockScroll = {
    init: (element, valueAccessor) => {
        let isLock = valueAccessor().lock;
        let hideScroll = valueAccessor().hideScroll || false;
        let scrollLocker = new ScrollLocker(hideScroll);

        let lockSubscription = isLock.subscribe((newValue) => {
            newValue ? scrollLocker.lockScroll() : scrollLocker.releaseScroll();    
        });

        ko.utils.domNodeDisposal.addDisposeCallback(element, () => {
            scrollLocker.deactivate();
            lockSubscription.dispose();
        });
    }
};