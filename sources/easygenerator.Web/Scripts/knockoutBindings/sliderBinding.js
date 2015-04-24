ko.bindingHandlers.slider = {
    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        var sliderModel = {};
        sliderModel.autoRotateTime = 5000;
        sliderModel.autoRotateInterval = null;
        sliderModel.isAnimating = false;
        sliderModel.animationTime = 400;
        sliderModel.activeClass = 'active';
        sliderModel.$slider = $(element);
        sliderModel.$slidesHolder = $('.slides', sliderModel.$slider);
        sliderModel.$slidesCollection = $('.slide', sliderModel.$slider);

        sliderModel.$prew = $('.slider-nav-prew', sliderModel.$slider).eq(0);
        sliderModel.$next = $('.slider-nav-next', sliderModel.$slider).eq(0);

        sliderModel.$linksHolder = $('.slider-nav-links', sliderModel.$slider);
        sliderModel.$linkSample = $('.slider-nav-link', sliderModel.$slider).clone();

        sliderModel.init = function () {
            sliderModel.$slidesCollection.eq(0).addClass(sliderModel.activeClass);
            sliderModel.initNavigation();

            sliderModel.startAutoRotate();
        }

        sliderModel.startAutoRotate = function () {
            sliderModel.autoRotateInterval = setInterval(function () {
                sliderModel.moveToNext(true);
            }, sliderModel.autoRotateTime);
        }

        sliderModel.stopAutoRotate = function () {
            if (sliderModel.autoRotateInterval == null) {
                return;
            }
            clearInterval(sliderModel.autoRotateInterval);
            sliderModel.autoRotateInterval = null;
        }

        sliderModel.goToSlide = function (index) {
            var $current = $('.' + sliderModel.activeClass, sliderModel.$slidesHolder);
            var $next = sliderModel.$slidesCollection.eq(index);

            sliderModel.stopAutoRotate();

            if (sliderModel.isAnimating) {
                return;
            }

            sliderModel.isAnimating = true;
            $current.animate(
               {
                   'opacity': 0
               },
               {
                   queue: false,
                   duration: sliderModel.animationTime,
                   complete: function () {
                       $current.css({
                           'opacity': 1,
                           'z-index': -1
                       }).removeClass('active');

                       $next.css({
                           'z-index': 2
                       }).addClass('active');

                       sliderModel.isAnimating = false;
                       sliderModel.startAutoRotate();
                   }
               }
            );
            $next.css({
              'z-index': 1
            });
        }

        sliderModel.linkClick = function (e) {
            e.preventDefault();
            var $this = $(this);

            $('.' + sliderModel.activeClass, sliderModel.$linksHolder).removeClass(sliderModel.activeClass);
            $this.addClass(sliderModel.activeClass);
            sliderModel.goToSlide($this.index());
        }

        sliderModel.navClick = function (e) {
            e.preventDefault();
            sliderModel.moveToNext(sliderModel.$next.is(this));
        }

        sliderModel.moveToNext = function (isForward) {
            var count = sliderModel.$slidesCollection.length;
            var index = $('.' + sliderModel.activeClass, sliderModel.$slidesHolder).index();

            if (isForward) {
                index++;
            } else {
                index--;
            }

            if (index < 0) {
                index = count - 1;
            }
            if (index >= count) {
                index = 0;
            }

            $('.' + sliderModel.activeClass, sliderModel.$linksHolder).removeClass(sliderModel.activeClass);
            $('.slider-nav-link').eq(index).addClass(sliderModel.activeClass);

            sliderModel.goToSlide(index);
        }

        sliderModel.initNavigation = function () {
            sliderModel.$linksHolder.empty();
            for (var index = 0; index < sliderModel.$slidesCollection.length; index++) {
                var link = sliderModel.$linkSample.clone();
                link.click(sliderModel.linkClick);
                if (index == 0) {
                    link.addClass(sliderModel.activeClass);
                }
                sliderModel.$linksHolder.append(link);
            }

            sliderModel.$prew.click(sliderModel.navClick);
            sliderModel.$next.click(sliderModel.navClick);
        }

        sliderModel.dispose = function () {
            sliderModel.stopAutoRotate();
        }

        ko.utils.domNodeDisposal.addDisposeCallback(element, sliderModel.dispose);

        sliderModel.init();

    },
    update: function (element, valueAccessor, allBindingsAccessor, viewModel) {

    }
};
