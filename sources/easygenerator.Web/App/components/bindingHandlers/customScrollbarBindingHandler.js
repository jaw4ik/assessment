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
        let suppressScrollX = _.isBoolean(valueAccessors().suppressScrollX) ? valueAccessors().suppressScrollX : true;
        let suppressScrollY = _.isBoolean(valueAccessors().suppressScrollY) ? valueAccessors().suppressScrollY :  false;

        let customScrollbarContainer = byClass ? element.getElementsByClassName(byClass)[0] : element;

        perfectScrollbar.initialize(customScrollbarContainer, {
            suppressScrollX: suppressScrollX,
            suppressScrollY: suppressScrollY
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
            var scrollHeight = customScrollbarContainer.clientHeight;
            var timeout = setTimeout(() => {
                perfectScrollbar.update(customScrollbarContainer);
                if (scrollToEndAfterDOMChanged && scrollHeight !== customScrollbarContainer.clientHeight) {
                    scrollHeight = customScrollbarContainer.clientHeight;
                    customScrollbarContainer.scrollTop = customScrollbarContainer.scrollHeight;
                }
                scrollEnabled();

                refreshScrollAfterDomChanged();
            }, 500);

            ko.utils.domNodeDisposal.addDisposeCallback(element, () => clearTimeout(timeout));
        }

        function scrollEnabled() {
            customScrollbarContainer.classList.toggle(cssClasses.scrollEnabled, customScrollbarContainer.scrollHeight > customScrollbarContainer.clientHeight);
        }
    }
};

composition.addBindingHandler('scrollbar');