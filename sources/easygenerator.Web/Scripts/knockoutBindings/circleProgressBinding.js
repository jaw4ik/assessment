
var props = {
    math: {
        circ: Math.PI * 2,
        quart: Math.PI / 2
    },
    colors: {
        basic: 'rgb(211,212,216)',
        progress: 'rgba(250,170,74,0.8)',
        firstPendingArc: 'rgba(250,170,74,0.8)',
        secondPendingArc: 'rgba(250,170,74,0.8)'
    }
};

function drawFullBasicCircleBar(context, centerX, centerY, radius, lineWidth, basicColor) {
    context.clearRect(centerX - radius - lineWidth, centerY - radius - lineWidth, radius * 2 + (lineWidth * 2), radius * 2 + (lineWidth * 2));
    context.beginPath();
    context.arc(centerX, centerY, radius, 0, props.math.circ);
    context.strokeStyle = basicColor;
    context.lineWidth = lineWidth;
    context.closePath();
    context.stroke();
};

function drawCircleBar(context, centerX, centerY, radius, startAt, amount, lineLength, color) {
    context.beginPath();
    context.strokeStyle = color;
    context.arc(centerX, centerY, radius, -(props.math.quart) + startAt - lineLength, ((props.math.circ) * amount.toFixed(2)) - props.math.quart, false);
    context.stroke();
};

    ko.bindingHandlers.circleProgress = {
        init: function (element, valueAccessor) {
            const that = {};
            that.cnxt = element.getContext('2d');
            that.$element = $(element),
            that.lineWidth = valueAccessor().lineWidth || 1,
            
            that.pendingArcInterval = null,
            
            that.centerX = element.width / 2,
            that.centerY = element.height / 2,
            that.radius = that.centerX < that.centerY ? that.centerX : that.centerY - that.lineWidth / 2 - 1,

            that.progress = valueAccessor().progress() / 100;

            drawFullBasicCircleBar(that.cnxt, that.centerX, that.centerY, that.radius, that.lineWidth, props.colors.basic);

            element.circlePropersties = that;
        },
        update: function (element, valueAccessor) {
            let that = element.circlePropersties;
           
            if (valueAccessor().type === 'pending') {

                let firstArcAmount = 0;
                let secondArcAmount = 0;
                that.pendingArcInterval = setInterval(function() {
                    
                    if (firstArcAmount > 1 + (props.math.circ) * 0.004) {
                        firstArcAmount = 0;
                    } else firstArcAmount += 0.004;
                    if (secondArcAmount > 1 + (props.math.circ) * 0.0025) {
                        secondArcAmount = 0;
                    } else secondArcAmount += 0.0025;

                    drawFullBasicCircleBar(that.cnxt,
                        that.centerX,
                        that.centerY,
                        that.radius,
                        that.lineWidth,
                        props.colors.basic);

                    drawCircleBar(that.cnxt,
                        that.centerX,
                        that.centerY,
                        that.radius,
                        ((props.math.circ) * firstArcAmount.toFixed(2)),
                        firstArcAmount,
                        1.5,
                        props.colors.firstPendingArc);

                    drawCircleBar(that.cnxt,
                        that.centerX,
                        that.centerY,
                        that.radius,
                        ((props.math.circ) * secondArcAmount.toFixed(2)),
                        secondArcAmount,
                        1,
                        props.colors.secondPendingArc);
                }.bind(this), 0);
            } else {
                if(!_.isNull(that.pendingArcInterval)) {
                    clearInterval(that.pendingArcInterval);
                    that.pendingArcInterval = null;
                }
                if (that.progress >= 0) {
                    let amount = that.progress;
                    that.progress = valueAccessor().progress() / 100;

                    var interval = setInterval(function() {
                        amount += 0.005;
                        if (amount > that.progress) {
                            amount = that.progress;
                            clearInterval(interval);
                        }
                        
                        drawFullBasicCircleBar(
                            that.cnxt,
                            that.centerX,
                            that.centerY,
                            that.radius,
                            that.lineWidth,
                            props.colors.basic);

                        drawCircleBar(
                            that.cnxt,
                            that.centerX,
                            that.centerY,
                            that.radius,
                            0,
                            amount,
                            0,
                            props.colors.progress);
                    }.bind(this), 0);
                }
            }
        }
    };