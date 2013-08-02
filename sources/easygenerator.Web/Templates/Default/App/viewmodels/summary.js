define(['context', 'durandal/plugins/router'], function (context, router) {
    ko.bindingHandlers.context = {
        init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
            viewModel.__context__ = element.getContext('2d');
        },
        update: function (element, valueAccessor, allBindingsAccessor, viewModel) {
            var callback = ko.utils.unwrapObservable(allBindingsAccessor().contextCallback);
            callback.call(viewModel, viewModel.__context__);
        }
    };

    var objectives = [],
        score = 0,
        activate = function() {

            function getRandomInt(min, max) {
                return Math.floor(Math.random() * (max - min + 1)) + min;
            }

            this.objectives = _.map(context.objectives, function(item) {
                return { title: item.title, score: getRandomInt(0, 100) };
            });
            this.score = getRandomInt(0, 100);
        },
        triggerRedraw = ko.observable(false),
        redrawCanvas = function(context) {
            var progress = this.score / 100;

            var arcEndPoint = (progress * 2 - 0.5) * Math.PI;

            context.beginPath();
            context.arc(62, 62, 52, 0, 2 * Math.PI);
            context.strokeStyle = 'rgb(211,212,216)';
            context.lineWidth = 10;
            context.closePath();
            context.stroke();

            context.beginPath();
            context.arc(62, 62, 52, 1.5 * Math.PI, arcEndPoint);
            context.strokeStyle = 'rgb(87,157,193)';
            context.lineWidth = 10;
            context.stroke();
            
            context.beginPath();
            context.font = '20pt Arial';
            context.textAlign = 'center';
            context.textBaseline = "middle";
            context.fillStyle = '#666666';
            context.fillText(this.score + "%", 62, 62);
        },
        backToObjectives = function() {
            router.navigateTo('#/');
        },
        finish = function() {
            alert("close browser");
        };

    return {
        activate: activate,
        score: score,
        objectives: objectives,
        triggerRedraw: triggerRedraw,
        redrawCanvas: redrawCanvas,
        backToObjectives: backToObjectives,
        finish: finish
    };
});