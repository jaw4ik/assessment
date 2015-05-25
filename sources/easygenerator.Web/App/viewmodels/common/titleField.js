define(['notify', 'constants', 'eventTracker'],
    function (notify, constants, eventTracker) {

        var ctor = function (title, maxLength, caption, updateTitleEventName, getTitleHandler, updateTitleHandler) {
            var viewModel = {
                title: ko.observable(title),
                maxLength: maxLength,
                isEditing: ko.observable(),
                isSelected: ko.observable(),
                beginEdit: beginEdit,
                endEdit: endEdit,
                caption: caption,
                updateTitleEventName: updateTitleEventName,
                getTitleHandler: getTitleHandler,
                updateTitleHandler: updateTitleHandler
            }

            viewModel.isValid = ko.computed(function () {
                var length = viewModel.title() ? viewModel.title().trim().length : 0;
                return length > 0 && length <= viewModel.maxLength;
            });

            return viewModel;

            function beginEdit() {
                viewModel.isEditing(true);
            };

            function endEdit() {
                viewModel.title(viewModel.title() && viewModel.title().trim());
                viewModel.isEditing(false);

                getTitleHandler().then(function (currentTitle) {
                    if (viewModel.title() === currentTitle) {
                        return;
                    }

                    eventTracker.publish(updateTitleEventName);

                    if (viewModel.isValid()) {
                        updateTitleHandler(viewModel.title()).then(notify.saved);
                    } else {
                        viewModel.title(currentTitle);
                    }
                });
            };
        };

        return ctor;
    }
);