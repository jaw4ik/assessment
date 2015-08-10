ko.bindingHandlers.dialog = {
    init: function () {
    },
    update: function (element, valueAccessor) {
        var $element = $(element),
            $html = $('html'),
            $container = $('body'),
            speed = 200,
            isShown = valueAccessor().isShown,
            autoclose = ko.unwrap(valueAccessor().autoclose) || false,
            onHide = valueAccessor().onHide,
            onClose = valueAccessor().onClose,
            scrollLocker = createScrollLocker();

        if (isShown()) {
            show();
        } else {
            hide();
        }

        function show() {
            var $blockout = $('<div class="modal-dialog-blockout" style="display:none;"></div>').appendTo($container);

            $.when($blockout).done(function () {
                $blockout.fadeIn(speed);
                $element.fadeIn(speed, function () {
                    $element.find('.autofocus').focus();
                    //bug fix when blocked out page is scrolled together with dialog scrolling
                    scrollLocker.lockScroll();
                });
            });

            if (autoclose) {
                $blockout.click(function () {
                    close();
                });
            }

            $html.on('keyup', closeOnEscape);
            $container.css({
                overflowY: 'hidden'
            });
        }

        function hide() {
            $('.modal-dialog-blockout').fadeOut(speed, function () {
                scrollLocker.releaseScroll();
                $(this).remove();
                $html.off('keyup', closeOnEscape);
                $container.css({
                    overflowY: 'visible'
                });

                if (_.isFunction(onHide)) {
                    onHide();
                }
            });

            $element.fadeOut(speed);
        }

        function close() {
            hide();
            if (_.isFunction(onClose)) {
                onClose(true);
            }
        }

        function closeOnEscape(evt) {
            if (evt.keyCode == 27) {
                close();
            }
        }

        function createScrollLocker() {
            var eventNames = 'DOMMouseScroll mousewheel';

            return {
                lockScroll: lockScroll,
                releaseScroll: releaseScroll
            };

            function lockScroll() {
                $('.scrollable', $element).on(eventNames, trapScroll);
                $element.on(eventNames, preventScroll);
            }

            function releaseScroll() {
                $('.scrollable', $element).off(eventNames, trapScroll);
                $element.off(eventNames, preventScroll);
            }

            function trapScroll(ev) {
                var $this = $(this),
                    scrollTop = this.scrollTop,
                    scrollHeight = this.scrollHeight,
                    height = $this.height(),
                    delta = (ev.type == 'DOMMouseScroll' ? ev.originalEvent.detail * -40 : ev.originalEvent.wheelDelta),
                    up = delta > 0;

                if (scrollHeight === 0 || height === 0) {
                    return 0;
                }

                var scrollCount = Math.ceil(scrollHeight / 120) - 1;
                if (scrollCount <= 0)
                    return preventScroll(ev);

                var scrollDist = Math.ceil(scrollHeight / scrollCount),
                scrollDelta = up ? scrollDist * -1 : scrollDist;

                $this.scrollTop(scrollTop + scrollDelta);
                return preventScroll(ev);
            }

            function preventScroll(ev) {
                ev.stopPropagation();
                ev.preventDefault();
                ev.returnValue = false;
                return false;
            }
        };

        ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
            hide();
            isShown(false);
        });
    }
};