define(['knockout', 'durandal/composition'], function (ko, composition) {

    ko.bindingHandlers.scrollbar = {
        init: function (element, valueAccessor) {
            var byClass = valueAccessor().byClass,
                checkDOMChanges = valueAccessor().checkDOMChanges,
                scrollToEndAfterDOMChanged = valueAccessor().scrollToEndAfterDOMChanged,
                customScroll = null,
                scrollOptions = {
                    mouseWheel: true,
                    disableMouse: true,
                    scrollbars: 'custom',
                    interactiveScrollbars: true,
                    probeType: 2
                },
                cssClasses = {
                    scrollStarted: 'cs-scroll-started',
                    scrollFinished: 'cs-scroll-finished',
                    scrollEnabled: 'cs-scroll-enabled'
                };

            var customScrollbarContainer = byClass ? element.getElementsByClassName(byClass)[0] : element;

            customScroll = new IScroll(customScrollbarContainer, scrollOptions);

            if (checkDOMChanges) {
                refreshScrollAfterDomChanged();
            }

            customScroll.on('scroll', function () {
                if (this.y < 0) {
                    customScrollbarContainer.classList.add(cssClasses.scrollStarted);
                } else {
                    customScrollbarContainer.classList.remove(cssClasses.scrollStarted);
                }

                if (this.y === customScroll.maxScrollY) {
                    customScrollbarContainer.classList.add(cssClasses.scrollFinished);
                } else {
                    customScrollbarContainer.classList.remove(cssClasses.scrollFinished);
                }
            });

            scrollEnabled();

            ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                customScroll.destroy();
                customScroll = null;
                clearInterval(interval);
            });

            document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);

            function refreshScrollAfterDomChanged() {
                var scrollHeight = customScroll.scroller.clientHeight;
                var interval = setInterval(function () {
                    if (scrollHeight === customScroll.scroller.clientHeight) {
                        return;
                    }
                    scrollHeight = customScroll.scroller.clientHeight;
                    customScroll.refresh();
                    if (scrollToEndAfterDOMChanged) {
                        customScroll.scrollTo(0, customScroll.maxScrollY);
                    }
                    scrollEnabled();
                }, 500);

                ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                    clearInterval(interval);
                });
            }

            function scrollEnabled() {
                if (customScroll.hasVerticalScroll) {
                    customScrollbarContainer.classList.add(cssClasses.scrollEnabled);
                } else {
                    customScrollbarContainer.classList.remove(cssClasses.scrollEnabled);
                }
            }
        }
    };

    composition.addBindingHandler('scrollbar');

});