ko.bindingHandlers.switchToggle = {
    init: function (element, valueAccessor) {
        var switchToggle = ko.bindingHandlers.switchToggle,
            viewModel = switchToggle.viewModel(element, valueAccessor),
            valueChangedHandler = valueAccessor().onValueChanged,
            value = ko.unwrap(valueAccessor().value());

        viewModel.setInitialValue(value);

        switchToggle.onClick(element, function () {
            viewModel.toggle();

            var currentValue = ko.unwrap(valueAccessor().value());
            valueAccessor().value(!currentValue);

            valueChangedHandler();
        });
    },

    update: function (element, valueAccessor) {
        var viewModel = ko.bindingHandlers.switchToggle.viewModel(element, valueAccessor),
            value = ko.unwrap(valueAccessor().value());

        viewModel.updateValue(value);
    },

    viewmodelviewModel: function (element) {
        var $element = $(element),
            $wrapper = $('.switch-toggle-wrapper', $element);

        function setInitialValue(value) {
            setElementValue(value);
            updateElementPosition(value);
        }

        function toggle() {
            var value = getValue();
            setElementValue(!value);

            $wrapper.stop().animate({
                marginLeft: calculateElementLeftMargin(!value)
            }, 250);
        }
        
        function getValue() {
            return $element.hasClass('on');
        }

        function updateValue(value) {
            if (getValue() != value) {
                toggle();
            }
        }

        function setElementValue(value) {
            $element.toggleClass('on', value);
            $element.toggleClass('off', !value);
        }

        function updateElementPosition(value) {
            $wrapper.css('margin-left', calculateElementLeftMargin(value) + 'px');
        }

        function calculateElementLeftMargin(value) {
            return value ? 0 : $element.height() - $element.width();
        }

        return {
            setInitialValue: setInitialValue,
            updateValue: updateValue,
            toggle: toggle
        }
    },

    onClick: function (element, handler) {
        var $element = $(element),
            isMouseDownFired = false;

        $element.mousedown(function (event) {
            if (event.which != 1)
                return;

            isMouseDownFired = true;
            handler();
        });

        $element.click(function () {
            if (isMouseDownFired) {
                isMouseDownFired = false;
                return;
            }

            handler();
        });
    }
};