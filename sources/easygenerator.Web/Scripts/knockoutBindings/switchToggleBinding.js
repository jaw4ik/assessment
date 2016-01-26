ko.bindingHandlers.switchToggle = {
    init: function (element, valueAccessor) {
        var switchToggle = ko.bindingHandlers.switchToggle,
            speed = valueAccessor().speed || 250,
            viewModel = switchToggle.viewModel(element, speed),
            valueChangedHandler = valueAccessor().onValueChanged,
            onClickHandler = valueAccessor().onClick,
            value = ko.unwrap(valueAccessor().value());

        viewModel.setInitialValue(value);

        switchToggle.onClick(element, function () {
            if (onClickHandler) {
                onClickHandler();
            } else {
                viewModel.toggle();

                var currentValue = ko.unwrap(valueAccessor().value());
                valueAccessor().value(!currentValue);

                valueChangedHandler();
            }
        });
    },

    update: function (element, valueAccessor) {
        var speed = valueAccessor().speed || 250,
            viewModel = ko.bindingHandlers.switchToggle.viewModel(element, speed),
            value = ko.unwrap(valueAccessor().value());

        viewModel.updateValue(value);
    },

    viewModel: function (element, speed) {
        var $element = $(element),
            isOnOff = $element.hasClass('on-off'),
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
            }, speed);
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
            if (value)
                return 0;

            return isOnOff ? $element.width() - $element.height() : $element.height() - $element.width();
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