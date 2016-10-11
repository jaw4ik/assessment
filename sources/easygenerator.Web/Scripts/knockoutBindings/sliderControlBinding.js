(function (ko) {

    var cssClasses = {
        sliderWrapper: 'ui-slider-wrapper',
        sliderHandler: 'ui-slider-handle',
        backgroundIndicator: 'ui-slider-bkg-indicator',
        valueIndicator: 'ui-slider-value-indicator',
        minusButton: 'minus-button',
        plusButton: 'plus-button',
        withButtons: 'with-buttons'
    };

    function setSliderValue($element, value) {
        $element.slider('value', value);
    }

    function setIndicatorValue($element, value) {
        $('.' + cssClasses.backgroundIndicator, $element).width(value + '%');
        $('.' + cssClasses.valueIndicator, $element).text(value + '%');
    }

    ko.bindingHandlers.sliderControl = {
        init: function (element, valueAccessor) {

            var $element = $(element),
                $wrapper = $('<div>').addClass(cssClasses.sliderWrapper),
                $bkgIndicator = $('<div>').addClass(cssClasses.backgroundIndicator),
                $valueIndicator = $('<div>').addClass(cssClasses.valueIndicator),

                // options
                value = ko.unwrap(valueAccessor().value) || 0,
                min = valueAccessor().min || 0,
                max = valueAccessor().max || 100,
                step = valueAccessor().step || 1,
                buttonsNeeded = typeof valueAccessor().buttonsNeeded !== 'undefined' ? valueAccessor().buttonsNeeded : true,
                events = valueAccessor().events || {};

            $element
                .slider({ value: value, min: min, max: max, step: step, slide: slideHandler })
                .append($bkgIndicator)
                .wrap($wrapper)
                .find('.' + cssClasses.sliderHandler)
                .append($valueIndicator);

            setIndicatorValue($element, value);

            if (buttonsNeeded) {
                $('<span>').addClass(cssClasses.minusButton).click(minusButtonClickHandler).insertBefore($element);
                $('<span>').addClass(cssClasses.plusButton).click(plusButtonClickHandler).insertAfter($element);
                $element.addClass(cssClasses.withButtons);
            }

            if (typeof (events.change) === 'function') {
                $element.slider({ change: function (event, ui) { events.change(ui.value); } });
            }

            if (typeof (events.start) === 'function') {
                $element.slider({ start: function (event, ui) { events.start(ui.value); } });
            }

            if (typeof (events.stop) === 'function') {
                $element.slider({ stop: function (event, ui) { events.stop(ui.value); } });
            }

            ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                $element.slider('destroy');
            });


            function slideHandler(event, ui) {
                setIndicatorValue($element, ui.value);

                if (typeof (events.slide) === 'function') {
                    events.slide(ui.value);
                }
            }

            function minusButtonClickHandler() {
                var newSliderValue = getSliderValue() - step;
                if (newSliderValue % 1 !== 0) {
                    newSliderValue = newSliderValue.toFixed(1);
                }
                if (newSliderValue < min) {
                    return;
                }

                setSliderValue($element, newSliderValue);
                setIndicatorValue($element, newSliderValue);
            }

            function plusButtonClickHandler() {
                var newSliderValue = getSliderValue() + step;
                if (newSliderValue % 1 !== 0) {
                    newSliderValue = newSliderValue.toFixed(1);
                }
                if (newSliderValue > max) {
                    return;
                }

                setSliderValue($element, newSliderValue);
                setIndicatorValue($element, newSliderValue);
            }

            function getSliderValue() {
                return +$element.slider('value');
            }
        },
        update: function (element, valueAccessor) {
            var $element = $(element),
                value = ko.unwrap(valueAccessor().value);

            setSliderValue($element, value);
            setIndicatorValue($element, value);
        }
    };

})(window.ko);