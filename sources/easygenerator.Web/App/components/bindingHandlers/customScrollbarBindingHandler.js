import ko from 'knockout';
import perfectScrollbar from 'perfect-scrollbar';
import 'perfect-scrollbar/dist/css/perfect-scrollbar.css!';
import composition from 'durandal/composition';

ko.bindingHandlers.scrollbar = {
    init: (element, valueAccessors) => {
        let byClass = valueAccessors().byClass;
        let checkDOMChanges = valueAccessors().checkDOMChanges;
        let scrollToEndAfterDOMChanged = valueAccessors().scrollToEndAfterDOMChanged;
        let cssClasses = {
            scrollStarted: 'cs-scroll-started',
            scrollFinished: 'cs-scroll-finished',
            scrollEnabled: 'cs-scroll-enabled'
        };

        let customScrollbarContainer = byClass ? element.getElementsByClassName(byClass)[0] : element;

        perfectScrollbar.initialize(customScrollbarContainer, {
            scrollYMarginOffset: 10,
            suppressScrollX: true
        });

        if (checkDOMChanges) {
            refreshScrollAfterDomChanged();
        }

        document.addEventListener('ps-y-reach-start', () => {
            customScrollbarContainer.classList.remove(cssClasses.scrollStarted);
        });

        document.addEventListener('ps-y-reach-end', () => {
            customScrollbarContainer.classList.add(cssClasses.scrollFinished);
        });

        document.addEventListener('ps-scroll-up', () => {
            customScrollbarContainer.classList.remove(cssClasses.scrollFinished);
        });

        document.addEventListener('ps-scroll-down', () => {
            customScrollbarContainer.classList.add(cssClasses.scrollStarted);
        });

        scrollEnabled();

        ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
            perfectScrollbar.destroy(customScrollbarContainer);
        });

        function refreshScrollAfterDomChanged() {
            let scrollHeight = customScrollbarContainer.clientHeight;
            let interval = setInterval(() => {
                if (scrollHeight === customScrollbarContainer.clientHeight) {
                    return;
                }
                scrollHeight = customScrollbarContainer.clientHeight;
                perfectScrollbar.update(customScrollbarContainer);
                if (scrollToEndAfterDOMChanged) {
                    customScrollbarContainer.scrollTop = customScrollbarContainer.scrollHeight;
                }
                scrollEnabled();
            }, 500);

            ko.utils.domNodeDisposal.addDisposeCallback(element, () => clearInterval(interval));
        }

        function scrollEnabled() {
            customScrollbarContainer.classList.toggle(cssClasses.scrollEnabled, customScrollbarContainer.scrollHeight > customScrollbarContainer.clientHeight);
        }
    }
};

composition.addBindingHandler('scrollbar');