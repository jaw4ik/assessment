import $ from 'jquery';
import animate from 'velocity-animate';

const shadowClass = 'gu-transit';

if (!('remove' in Element.prototype)) {
    Element.prototype.remove = function() {
        if (this.parentNode) {
            this.parentNode.removeChild(this);
        }
    };
}

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

    animateShow: (element, callback) => {
        animate(element, 'stop', true);
        animate(element, 'slideDown', { duration: 200, complete: () => {
            $(element).removeAttr('style');

            if (callback) {
                callback();
            }
        }});
    },

    animateHide: (element, callback) => {
        animate(element, 'stop', true);
        animate(element, 'slideUp', { duration: 200, complete: callback });
    },

    hideLastShadow: () => {
        if (dragulaAnimation.lastShadowElement) {

            var ref = dragulaAnimation.lastShadowElement;
            dragulaAnimation.animateHide(ref, function () {
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

            dragulaAnimation.animateShow(siblingShadow);

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