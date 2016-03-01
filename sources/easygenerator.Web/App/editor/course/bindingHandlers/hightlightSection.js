import ko from 'knockout';
import $ from 'jquery';
import _ from 'underscore';
import 'core/bootstrap/visible.js';

ko.bindingHandlers.highlightSection = {
    update: (element, valueAccessor) => {
        let $element = $(element),
            $highlightItem = $(element).find('[data-section-highlight-item]'),
            sectionId = ko.unwrap(valueAccessor().sectionId),
            hightlightSectionId = valueAccessor().hightlightSectionId;

        if (sectionId === hightlightSectionId()) {
            if (!$element.visible()) {
                startHightlight();

                var targetTop = $element.offset().top;
                $('html, body').stop().animate({
                    scrollTop: targetTop - 94 /* 50px header + 34px switch to old editor tooltip + 10px margin */
                }, finishHightlight);
            }else {
                startHightlight();
                finishHightlight();
            }

            function startHightlight(){
                $highlightItem.addClass('hightlighted');
                hightlightSectionId(null);
            }

            function finishHightlight(){
                _.delay(() => {
                    $highlightItem.removeClass('hightlighted');
                }, 500);
            }
        }
    }
};