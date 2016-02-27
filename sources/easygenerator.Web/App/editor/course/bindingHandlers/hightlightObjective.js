import ko from 'knockout';
import $ from 'jquery';
import _ from 'underscore';
import 'core/bootstrap/visible.js';

ko.bindingHandlers.highlightObjective = {
    update: (element, valueAccessor) => {
        let $element = $(element),
            $highlightItem = $(element).find('[data-objective-highlight-item]'),
            objectiveId = ko.unwrap(valueAccessor().objectiveId),
            hightlightObjectiveId = valueAccessor().hightlightObjectiveId;

        if (objectiveId === hightlightObjectiveId()) {
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
                hightlightObjectiveId(null);
            }

            function finishHightlight(){
                _.delay(() => {
                    $highlightItem.removeClass('hightlighted');
                }, 500);
            }
        }
    }
};