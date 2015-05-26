define(['widgets/cursorTooltip/bindingHadlers/cursorTooltipBindingHandler',
        'localization/localizationManager'],
        function (cursorTooltipBindingHandler, localizationManager) {
            'use strict';

            var cursorTolltip = {
                isVisible: ko.observable(false),
                show: show,
                hide: hide,
                changeText: changeText,
                text: ko.observable(''),
                activate: activate
            };

            return cursorTolltip;

            function activate() {
                cursorTooltipBindingHandler.install();
            }

            function changeText(resourseKey) {
                if (localizationManager.hasKey(resourseKey)) {
                    cursorTolltip.text(localizationManager.localize(resourseKey));
                } else {
                    cursorTolltip.text('');
                }
            }

            function show() {
                cursorTolltip.isVisible(true);
            }

            function hide() {
                cursorTolltip.isVisible(false);
            }

        });