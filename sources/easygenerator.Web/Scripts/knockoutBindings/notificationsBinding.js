ko.bindingHandlers.notifications = {

    init: function (element, valueAccessor) {
        var $element = $(element),
            $notification = $element.find('.user-notification-viewer'),
            $close = $element.find('.user-notification-close-btn');

        $element.click(function () {
            toggleNotifications();
        });

        $close.click(function(evt) {
            toggleNotifications();
            evt.stopPropagation();
        });

        $notification.click(function(evt) {
            evt.stopPropagation();
        });

        function toggleNotifications() {
            $notification.toggle();
            $element.toggleClass('active');
        }

    },
    update: function (element, valueAccessor) {
        var $element = $(element),
            $notification = $element.find('.user-notification-viewer'),
            isExpanded = valueAccessor().isExpanded;
        if (isExpanded) {
            $notification.show();
            $element.addClass('active');
        }
    }
};