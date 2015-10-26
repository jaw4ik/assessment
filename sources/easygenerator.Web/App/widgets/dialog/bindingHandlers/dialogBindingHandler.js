ko.bindingHandlers.dialog = {
    init: function () {
    },
    update: function (element, valueAccessor) {
        var $element = $(element),
            $html = $('html'),
            $container = $('body'),
            scrollableClassName = '.scrollable',
            $scrollable = $(scrollableClassName, $element),
            speed = 200,
            isShown = valueAccessor().isShown,
            autoclose = ko.unwrap(valueAccessor().autoclose) || false,
            onHide = valueAccessor().onHide,
            scrollLocker = createScrollLocker();

        if (isShown()) {
            show();
        } else {
            hide();
        }

        function show() {
            if ($element.data('isShown'))
                return;

            $element.data('isShown', true);
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
                $blockout.click(hide);
                var $parent = $element.parent();
                if ($parent.hasClass('dialog-container')) {
                    $parent.click(hide);
                    $element.click(function(e) {
                        e.stopPropagation();
                    });
                }
            }

            $html.on('keyup', closeOnEscape);
            $container.css({
                overflowY: 'hidden'
            });
        }

        function hide() {
            if (!$element.data('isShown'))
                return;

            isShown(false);
            $element.data('isShown', false);
            $('.modal-dialog-blockout').fadeOut(speed, function () {
                $(this).remove();
            });

            $element.fadeOut(speed, function () {
                scrollLocker.releaseScroll();
                $html.off('keyup', closeOnEscape);
                $container.css({
                    overflowY: 'visible'
                });

                if (_.isFunction(onHide)) {
                    onHide();
                }
            });
        }

        function closeOnEscape(evt) {
            if (evt.keyCode === 27) {
                hide();
            }
        }

        function createScrollLocker() {
            var eventNames = 'DOMMouseScroll mousewheel';

            return {
                lockScroll: lockScroll,
                releaseScroll: releaseScroll
            };

            function lockScroll() {
                $scrollable.on(eventNames, trapScroll);
                $element.on(eventNames, preventOuterScroll);
            }

            function releaseScroll() {
                $scrollable.off(eventNames, trapScroll);
                $element.off(eventNames, preventOuterScroll);
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

                ev.data = { isProcessed: true };
                $this.scrollTop(scrollTop + scrollDelta);
                return preventScroll(ev);
            }

            function preventOuterScroll(ev) {
                if (ev.target && !(ev.data && ev.data.isProcessed)) {
                    var $target = $(ev.target),
                        $scrollableParent = $target.parents(scrollableClassName);
                    if ($scrollableParent.length > 0) {
                        trapScroll.call($scrollableParent[0], ev);
                    }
                }

                return preventScroll(ev);
            }

            function preventScroll(ev) {
                ev.data = { isProcessed: false };
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