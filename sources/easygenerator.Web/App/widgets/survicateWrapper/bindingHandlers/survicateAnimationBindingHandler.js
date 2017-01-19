import composition from 'durandal/composition';

let $element, $owl, $wood, $roundBig, $roundSmall, $survicateBox, isShownBefore, helpPopupSelectors;

ko.bindingHandlers.survicateAnimation = {
    init(element, valueAccessor) {
        $element = $(element),
        $owl = $element.find('.survicate-extender-owl'),
        $wood = $element.find('.survicate-extender-wood'),
        $roundBig = $element.find('.survicate-extender-owl-roundBig'),
        $roundSmall = $element.find('.survicate-extender-owl-roundSmall'),
        $survicateBox = $('#survicate-box'),
        helpPopupSelectors = valueAccessor().helpPopupSelectors;
        isShownBefore = false;
    },

    update(element, valueAccessor) {
        let isShown = valueAccessor().isShown;

        startAnimation(isShown());
    }
}

function startAnimation(isVisible) {
    let deffer;

    if (isVisible) {
        if (isShownBefore) {
            $survicateBox.animate({ opacity: 0 }, 0);
            $survicateBox.finish();
            return $survicateBox.animate({ opacity: 1 }, 400).promise();
        }

        isShownBefore = true;

        $element.show();

        var promises = _.map(helpPopupSelectors, id => {
            return $(id).fadeOut().promise();
        });

        deffer = $.when(promises)
        .then(() => $wood.animate({ right: "-20px" }, 250).promise())
        .then(() => $owl.animate({ bottom: "8px", opacity: 1 }, 250).promise())
        .then(() => $roundSmall.animate({ opacity: 1 }, 100).promise())
        .then(() => $roundBig.animate({ opacity: 1 }, 100).promise())
        .then(() => $survicateBox.animate({ opacity: 1 }, 400).promise());
    } else {
        deffer = $.Deferred().resolve()
        .then(() => $survicateBox.animate({ opacity: 0 }, 400).promise())
        .then(() => $roundBig.animate({ opacity: 0 }, 100).promise())
        .then(() => $roundSmall.animate({ opacity: 0 }, 100).promise())
        .then(() => $owl.animate({ bottom: "28px", opacity: 0 }, 250).promise())
        .then(() => $wood.animate({ right: "-150px" }, 250).promise())
        .then(() => $element.hide().promise())

        _.each(helpPopupSelectors, id => {
            deffer = deffer.then(() => $(id).fadeIn().promise());
        });

        isShownBefore = false;
    }

    return deffer.promise();
}

composition.addBindingHandler('survicateAnimation');
