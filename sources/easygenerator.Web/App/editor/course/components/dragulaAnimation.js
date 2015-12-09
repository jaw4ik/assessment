import $ from 'jquery';

const shadowClass = 'gu-transit';

let dragulaAnimation = {
    container: null,
    lastShadowElement: null,
    shadowReference: null,

    findReference: (element) => {
        if (element.nextElementSibling === null) {
            return null;
        }
        if (element.nextElementSibling.classList.contains(shadowClass)) {
            return dragulaAnimation.findReference(element.nextElementSibling);
        }
        return element.nextElementSibling;
    },

    findShadowBeside: (element) => {
        if (element.nextElementSibling && element.nextElementSibling.classList.contains(shadowClass)) {
            return element.nextElementSibling;
        }
        if (element.previousElementSibling && element.previousElementSibling.classList.contains(shadowClass)) {
            return element.previousElementSibling;
        }
        return null;
    },

    animate: (element, effect, callback) => {
        $(element)
            .stop(true)
            .animate({
                'height': effect,
                'padding-top': effect,
                'padding-bottom': effect,
                'margin-top': effect,
                'margin-bottom': effect
            }, 200, callback);
    },

    hideLastShadow: () => {
        if (dragulaAnimation.lastShadowElement) {

            var ref = dragulaAnimation.lastShadowElement;
            dragulaAnimation.animate(ref, 'hide', function () {
                ref.remove();
            });

            dragulaAnimation.lastShadowElement = null;
        }
    },

    isSourceForCopy: (source) => {
        return dragulaAnimation.container.sourcesToCopy.indexOf(source) !== -1;
    },

    initialize: (dragulaContainer) => {
        dragulaAnimation.container = dragulaContainer;

        dragulaContainer.dragula.on('drop', function () {
            if (dragulaAnimation.lastShadowElement) {
                $(dragulaAnimation.lastShadowElement).hide();
            }
        });

        dragulaContainer.dragula.on('cloned', function (clone, original, type) {
            if (type === 'mirror') {
                dragulaAnimation.shadowReference = dragulaAnimation.findReference(original);
            }
        });

        dragulaContainer.dragula.on('dragend', function (element) {
            if (element) {
                $(element).show();
            }

            if (dragulaAnimation.lastShadowElement) {
                dragulaAnimation.lastShadowElement.remove();
                dragulaAnimation.lastShadowElement = null;
            }
        });

        dragulaContainer.dragula.on('shadow', function (element, container, source) {
            $(element).hide();

            var siblingShadow = dragulaAnimation.findShadowBeside(element);

            if (dragulaAnimation.lastShadowElement === null && !dragulaAnimation.isSourceForCopy(source)) {
                dragulaAnimation.lastShadowElement = element.cloneNode(true);
                $(dragulaAnimation.lastShadowElement).show();
                container.insertBefore(dragulaAnimation.lastShadowElement, dragulaAnimation.shadowReference);
            }

            if (dragulaAnimation.lastShadowElement !== null && dragulaAnimation.lastShadowElement === siblingShadow) {
                return;
            }

            dragulaAnimation.hideLastShadow(container);

            if (siblingShadow === null) {
                siblingShadow = element.cloneNode(true);
                container.insertBefore(siblingShadow, element);
            }

            dragulaAnimation.animate(siblingShadow, 'show');

            dragulaAnimation.shadowReference = dragulaAnimation.findReference(element);
            dragulaAnimation.lastShadowElement = siblingShadow;
        });

        dragulaContainer.dragula.on('out', function (element, container, source) {
            if (dragulaAnimation.isSourceForCopy(source)) {
                dragulaAnimation.hideLastShadow(container);
            }
        });
    }
};

export default dragulaAnimation;