ko.bindingHandlers.circleProgress = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel) {

    },
    update: function (element, valueAccessor, allBindingsAccessor, viewModel) {
        var
            $element = $(element),
            score = valueAccessor().progress || 0,
            lineWidth = valueAccessor().lineWidth || 10,
            basicColor = $element.css('color') || 'rgb(211,212,216)',
            progressColor = $element.css('border-top-color') || 'rgb(87,157,193)';

        var $element = $(element),
            score = valueAccessor().progress || 0,
            lineWidth = valueAccessor().lineWidth || 10,
            basicColor = $element.css('color') || 'rgb(211,212,216)',
            progressColor = $element.css('border-top-color') || 'rgb(87,157,193)';

        var centerX = element.width / 2;
        var centerY = element.height / 2;
        var radius = centerX < centerY ? centerX : centerY - lineWidth / 2 - 1;

        var progress = score / 100;

        var cnxt = element.getContext('2d');
        
        cnxt.beginPath();
        cnxt.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        cnxt.strokeStyle = basicColor;
        cnxt.lineWidth = lineWidth;
        cnxt.closePath();
        cnxt.stroke();


        if (progress > 0) {
            cnxt.beginPath();
            cnxt.strokeStyle = progressColor;
            cnxt.lineWidth = lineWidth;

            if (progress == 1) {
                cnxt.arc(centerX, centerY, radius, 0, 2 * Math.PI);
            }
            else {
                cnxt.arc(centerX, centerY, radius, 1.5 * Math.PI, (progress * 2 - 0.5) * Math.PI);
            }

            cnxt.stroke();
        }
    }
};