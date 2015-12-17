import dragula from 'dragula';
import _ from 'underscore';
import $ from 'jquery';
import attributesHelper from './attributesHelper';
import dragulaAnimation from './dragulaAnimation';
import 'dragula/dist/dragula.css!';

var cssClasses = {
    activeTarget: 'active',
    itemOverTarget: 'droppable',
    activeElement: 'dragging'
};

export default class DragulaContainer{
    constructor () {
        let that = this;
        this.draggableAreas = [];
        this.sourcesToCopy = [];
        this.targetsToMove = [];
        this.activeTargetsList = [];
        this.mirrorElement = null;
        this.dragula = dragula({
            copy: (element, source) => that.sourcesToCopy.indexOf(source) !== -1,
            moves: (element, source, handle) => {
                let area = _.find(that.draggableAreas, area => area.source === source);
                let canMove = area ? $(handle).is(area.selector) : true;

                if (canMove) {
                    unfocusOtherElements();
                }
                return canMove;
            },
            invalid: element => $(element).hasClass('disabled'),
            accepts: (element, target, source, sibling) => {
                return _.any(that.targetsToMove, moveTarget => moveTarget.source === source && $(target).is(moveTarget.selector)
                    && (!moveTarget.forbidDropToEnd || sibling !== null));
            },
            direction: 'vertical'
        });

        function unfocusOtherElements() {
            $('[contenteditable=true]:focus').blur();
            $('html').trigger('click');
        }

        //dragulaAnimation.initialize(this);

        this.dragula.on('drop', (element, target, source, sibling) => {
            if (_.isNull(target)) {
                return;
            }

            sibling = getOriginalElement(sibling);
            _.each(that.targetsToMove, moveTarget => {
                if (moveTarget.source === source && $(target).is(moveTarget.selector) && _.isFunction(moveTarget.callback)) {
                    moveTarget.callback(attributesHelper.getDataAttribute(element), attributesHelper.getDataAttribute(sibling), attributesHelper.getDataAttribute(target), attributesHelper.getDataAttribute(source));
                }
            });

            that.dragula.remove();
        });

        function getOriginalElement(element) {
            if (element && element.classList.contains('gu-transit')) {
                return getOriginalElement(element.nextElementSibling);
            }
            return element;
        }

        this.dragula.on('cloned', (clone, original, type) => {
            if (type === 'mirror') {
                that.mirrorElement = clone;
            }
        });

        this.dragula.on('shadow', (element, container, source) => {
            $(container).addClass(cssClasses.itemOverTarget);
            $(that.mirrorElement).addClass(cssClasses.itemOverTarget);
        });

        this.dragula.on('out', (element, container, source) => {
            $(container).removeClass(cssClasses.itemOverTarget);
            $(that.mirrorElement).removeClass(cssClasses.itemOverTarget);
        });

        this.dragula.on('drag', (element, source) => {
            $(element).addClass(cssClasses.activeElement);
            that.activeTargetsList = _.filter(that.targetsToMove, target => target.source === source);
            _.each(that.activeTargetsList, target => $(target.selector).addClass(cssClasses.activeTarget));
        });

        this.dragula.on('dragend', (element) => {
            $(element).removeClass(cssClasses.activeElement);
            _.each(that.targetsToMove, target => $(target.selector).removeClass(cssClasses.activeTarget));
            that.activeTargetsList = [];
        });
    }
};