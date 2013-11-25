ko.bindingHandlers.feedback = {
    init: function (element, valueAccessor) {
        var $element = $(element),
            isShowFeedbackPopup = valueAccessor().isShowFeedbackPopup;

        $('html').click(function () {
            isShowFeedbackPopup(false);
        });

        $element.on('click', function(evt) {
            evt.stopPropagation();
        });
    },
    update: function (element, valueAccessor) {
        var $element = $(element),
            isShowFeedbackPopup = valueAccessor().isShowFeedbackPopup(),
            animateValue = isShowFeedbackPopup ? '0px' : '-300px';

        $element.animate({
            right: animateValue
        }, 400);
    }
};