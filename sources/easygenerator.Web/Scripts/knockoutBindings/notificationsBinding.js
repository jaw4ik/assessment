ko.bindingHandlers.notificationsSlider = {
    init: function (element) {
        ko.bindingHandlers.notificationsSlider.createViewModel();
        var viewModel = ko.bindingHandlers.notificationsSlider.viewModel;
        viewModel.init($(element));
    },
    update: function (element, valueAccessor) {
        var viewModel = ko.bindingHandlers.notificationsSlider.viewModel;
        viewModel.updateItems(valueAccessor().data());
    },
    createViewModel: function () {
        var viewModel = {
            updateItems: updateItems,
            init: init
        },
        animationSpeed = 300;

        ko.bindingHandlers.notificationsSlider.viewModel = viewModel;

        function updateItems(items) {
            viewModel.items = items;
            viewModel.$slidesContainer.width(viewModel.items.length * 100 + '%');
            updateNavigationState();
        }

        function init($element) {
            viewModel.$slidesContainer = $('.user-notification-list', $element);
            viewModel.$prev = $('.user-notification-navigation-prev-btn', $element);
            viewModel.$next = $('.user-notification-navigation-next-btn', $element);
            viewModel.index = 0;

            viewModel.$next.click(moveToNext);
            viewModel.$prev.click(moveToPrev);
        }

        function moveToNext() {
            viewModel.index++;
            updateNavigationState();
            viewModel.$slidesContainer.animate({
                'marginLeft': '-=100%'
            }, animationSpeed);
        }

        function moveToPrev() {
            viewModel.index--;
            updateNavigationState();
            viewModel.$slidesContainer.animate({
                'marginLeft': '+=100%'
            }, animationSpeed);
        }

        function updateNavigationState() {
            if (canMoveNext()) {
                viewModel.$next.show();
            } else {
                viewModel.$next.hide();
            }

            if (canMovePrev()) {
                viewModel.$prev.show();
            } else {
                viewModel.$prev.hide();
            }
        }

        function canMoveNext() {
            return viewModel.index < viewModel.items.length - 1;
        }

        function canMovePrev() {
            return viewModel.index > 0;
        }
    }
};