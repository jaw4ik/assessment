import 'velocity-animate';
import ko from 'knockout';
import _ from 'underscore';

ko.bindingHandlers.slideEditImageButtons = {
    init: element => {
        let $element = $(element),
            $firstStepElement = $element.find('[data-step="1"]'),
            $secondStepElement = $element.find('[data-step="2"]');

        let $nextButton = $element.find('[data-next-button]'),
            $prevButton = $element.find('[data-prev-button]');

        let duration = 200;

        $nextButton.on('click', () => {
            $firstStepElement.velocity({ translateX: -100, opacity: 0 }, {
                duration: duration,
                begin: () => {
                    $element.css('overflow', 'hidden');
                },
                progress: (elements, complete) => {
                    let progressPercent = complete * 100;
                    if (progressPercent >= 75) {
                        $secondStepElement.css('transform', 'translateX(100px)');
                        $secondStepElement.css('display', 'flex');
                        $secondStepElement.velocity({ translateX: 0, opacity: 1 }, duration);
                    }
                },
                complete: () => {
                    $firstStepElement.hide();
                    $element.css('overflow', 'visible');
                    let outsideClickHandler = (evt) => {
                        let $target = $(evt.target);
                        if ($target.is($element) || $target.closest($element).length) {
                            return;
                        } else {
                            $secondStepElement.velocity({ opacity: 0 }, duration, () => {
                                $secondStepElement.hide();
                                $firstStepElement.css('opacity', '');
                                $firstStepElement.css('transform', '');
                                $firstStepElement.css('display', '');
                                $('html').off('click', outsideClickHandler);
                            });
                        }
                    };

                    $('html').on('click', outsideClickHandler);
                }
            });
        });

        $prevButton.on('click', () => {
            $secondStepElement.velocity({ translateX: 100, opacity: 0 }, {
                duration: duration,
                begin: () => {
                    $element.css('overflow', 'hidden');
                },
                progress: (elements, complete) => {
                    let progressPercent = complete * 100;
                    if (progressPercent >= 75) {
                        $firstStepElement.css('display', '');
                        $firstStepElement.velocity({ translateX: 0, opacity: 1 }, duration, () => {
                            $firstStepElement.css('opacity', '');
                            $firstStepElement.css('transform', '');
                        });
                    }
                },
                complete: () => {
                    $secondStepElement.hide();
                    $element.css('overflow', 'visible');
                }
            });
        });
    }
};

