define(['durandal/composition'], function (composition) {
    ko.bindingHandlers.imageLoader = {
        init: function (element, valueAccessor) {

            var $element = $(element),
                data = valueAccessor() || {},
                isLoaded = data.isLoaded;

            var resizeHandler = $(window).on('resize', function () {
                if (isLoaded()) {
                    updatePreviewImageSize($element);
                }
            });

            var orientationChangeHandler = $(window).on("orientationchange", function () {
                if (isLoaded()) {
                    updatePreviewImageSize($element);
                }
            });

            ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                $(window).unbind('resize', resizeHandler);
                $(window).unbind('orientationchange', orientationChangeHandler);
            });
           
        },
        update: function (element, valueAccessor) {

            var $element = $(element),
                data = valueAccessor() || {},
                isLoaded = data.isLoaded,
                imageUrl = data.imageUrl();
            $element.empty();//Clear element to avoid blinking;
            isLoaded(false);
            loadNewImage(imageUrl, $element, isLoaded);

            function loadNewImage(url, $rootElement, isLoaded) {

                var browserWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
                var browserHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
                var maxSize = browserWidth > browserHeight ? browserWidth : browserHeight;

                var resizedImageUrl = url + '?height=' + maxSize + '&amp;width=' + maxSize;
                var image = new Image();
                image.className = 'image';
                image.style.display = "none";
                image.onload = function () {
                    $rootElement.append(image);
                    updatePreviewImageSize($element);
                    isLoaded(true);
                    $(image).fadeIn();
                }
                image.src = resizedImageUrl;
                return image;
            }
        }
    }

    function updatePreviewImageSize($element) {
        var browserWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0) - 46; // 46 - padding for close button
        var browserHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0) - 46;

        $('.image', $element).css('maxWidth', browserWidth - 46 + 'px').css('maxHeight', browserHeight - 46 + 'px');
    }

    composition.addBindingHandler('imageLoader');
});