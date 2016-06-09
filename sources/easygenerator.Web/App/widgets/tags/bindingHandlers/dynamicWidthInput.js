import ko from 'knockout';
import $ from 'jquery';
import composition from 'durandal/composition';

function setInputWidth($element, additionalWidth) {
    let $span = $('<span>')
        .css('display', 'none')
        .css('font-family', $element.css('font-family'))
        .css('font-size', $element.css('font-size'))
        .css('letter-spacing', $element.css('letter-spacing'))
        .text($element.val())
        .insertAfter($element);

    $element.width($span.width() + additionalWidth);
    $span.remove();
}

ko.bindingHandlers.dynamicWidthInput = {
    init: function (element, valueAccessor) {
        let $element = $(element),
            additionalWidth = valueAccessor().additionalWidth || 0;

        $element.keyup(() => setInputWidth($element, additionalWidth));
        setInputWidth($element, additionalWidth);
    }
};

composition.addBindingHandler('dynamicWidthInput');
