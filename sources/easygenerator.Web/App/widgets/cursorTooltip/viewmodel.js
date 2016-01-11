define(['localization/localizationManager'],
        function (localizationManager) {
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

            function activate() { }

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