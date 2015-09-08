ko.bindingHandlers.grayscale = {
    init: function (element) {

        var $element = $(element);

        var $wrapper = $('<div>')
            .attr('class', $element.attr('class'))
            .css({ position: 'relative', overflow: 'hidden' });

        $element
            .attr('class', '')
            .css({ position: 'absolute', left: '0', top: '0' })
            .wrap($wrapper);

        var $grayElement = $element.clone()
            .css({ 'z-index': '1', opacity: '1' })
            .addClass('img-grayscaled')
            .insertBefore($element);

        grayscale($element.attr('src')).then(function (result) {
            $grayElement
                .attr('src', result.dataURL)
                .parent()
                .width(result.width)
                .height(result.height);
        });

        function grayscale(src) {
            var defer = Q.defer();

            try {
                var canvas = document.createElement('canvas');
                var ctx = canvas.getContext('2d');
                var imgObj = new Image();
                imgObj.crossOrigin = 'anonymous';
                imgObj.src = src;
                imgObj.onload = function () {
                    canvas.width = imgObj.width;
                    canvas.height = imgObj.height;
                    ctx.drawImage(imgObj, 0, 0);
                    var imgPixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    for (var y = 0; y < imgPixels.height; y++) {
                        for (var x = 0; x < imgPixels.width; x++) {
                            var i = (y * 4) * imgPixels.width + x * 4;
                            var avg = (imgPixels.data[i] + imgPixels.data[i + 1] + imgPixels.data[i + 2]) / 3;
                            imgPixels.data[i] = avg;
                            imgPixels.data[i + 1] = avg;
                            imgPixels.data[i + 2] = avg;
                        }
                    }
                    ctx.putImageData(imgPixels, 0, 0, 0, 0, imgPixels.width, imgPixels.height);
                    defer.resolve({
                        dataURL: canvas.toDataURL(),
                        width: canvas.width,
                        height: canvas.height
                    });
                };
            } catch (e) {
                defer.reject(e.message);
            }

            return defer.promise;
        };
    }
};