import ko from 'knockout';
import $ from 'jquery';
import composition from 'durandal/composition';

ko.bindingHandlers.scrollTo = {
    update: (element, valueAccessors) => {
        let id = ko.unwrap(valueAccessors().id),
            delay = ko.unwrap(valueAccessors().delay) || 0,
            scrollTopPosition = $(window).scrollTop(),
            heightOfWindow = window.innerHeight,
            currentElementTopPosition = $('#' + id).length ? $('#' + id).offset().top : 0;

        if(
            currentElementTopPosition 
            && (
                currentElementTopPosition < scrollTopPosition 
                || currentElementTopPosition > scrollTopPosition + heightOfWindow
               )
          ) {
            $('html, body').animate({
                scrollTop: currentElementTopPosition < 100 ? 0 : currentElementTopPosition - 100
            }, delay);
        }
    }
};

composition.addBindingHandler('scrolTo');