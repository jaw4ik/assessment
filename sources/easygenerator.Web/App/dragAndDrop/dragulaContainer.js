import dragula from 'dragula';
import _ from 'underscore';
import $ from 'jquery';
import attributesHelper from './helpers/attributesHelper';
import dragulaAnimation from './animation/dragulaAnimation';
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
        this.sourcesFromMove = [];
        this.elementsToUseTargetWidth = [];
        this.mirrorElement = null;
        this.mirrorContainers = [];
        this.lastSource = null;
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
            invalid: element => $(element).hasClass('not-accessible'),
            accepts: (element, target, source, sibling) => {
                return _.any(that.targetsToMove, moveTarget => moveTarget.source === source && $(target).is(moveTarget.selector)
                       && (!moveTarget.forbidDropToEnd || sibling !== null)) || 
                       _.any(that.sourcesFromMove, moveSource => moveSource.target === target && $(source).is(moveSource.selector)
                       && (!moveSource.forbidDropToEnd || sibling !== null));
            },
            direction: 'vertical',
            get mirrorContainer() {
                let mirrorContainer = _.find(that.mirrorContainers, container => 
                    that.lastSource === container.source && document.querySelector(container.selector));
                return mirrorContainer ? document.querySelector(mirrorContainer.selector) : document.body;
            }
        });

        function unfocusOtherElements() {
            $('[contenteditable=true]:focus').blur();
            $('html').trigger('click');
        }

        dragulaAnimation.initialize(this);

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
            _.each(that.sourcesFromMove, moveSource => {
                if (moveSource.target === target && $(source).is(moveSource.selector) && _.isFunction(moveSource.callback)) {
                    moveSource.callback(attributesHelper.getDataAttribute(element), attributesHelper.getDataAttribute(sibling), attributesHelper.getDataAttribute(target), attributesHelper.getDataAttribute(source));
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
            let $container = $(container);
            $container.addClass(cssClasses.itemOverTarget);
            $(that.mirrorElement).addClass(cssClasses.itemOverTarget);

            if (that.elementsToUseTargetWidth.indexOf(source) !== -1) {
                let $mirrorElement = $(that.mirrorElement);
                $mirrorElement.addClass('used-target-width');
                $mirrorElement.width($container.width());
                if (that.mirrorElement) {
                    let top = parseInt(that.mirrorElement.style.top);
                    let height = that.mirrorElement.offsetHeight;
                    let margin = window.mouseYPos - top;
                    if (margin > height) {
                        let indent = 10;
                        that.mirrorElement.style.setProperty('margin-top', `${(margin - indent)}px`, 'important');
                    }
                }
            }
        });

        this.dragula.on('out', (element, container) => {
            $(container).removeClass(cssClasses.itemOverTarget);
            $(that.mirrorElement).removeClass(cssClasses.itemOverTarget);
        });

        this.dragula.on('drag', (element, source) => {
            that.lastSource = source;

            $(element).addClass(cssClasses.activeElement);
            
            _.chain(that.targetsToMove)
                .filter(target => target.source === source)
                .each(target => $(target.selector).addClass(cssClasses.activeTarget));

            _.chain(that.sourcesFromMove)
                .filter(moveSource => $(source).is(moveSource.selector))
                .each(moveSource => $(moveSource.target).addClass(cssClasses.activeTarget));
        });

        this.dragula.on('dragend', () => {
            that.lastSource = null;
            
            $(`.${cssClasses.activeElement}`).removeClass(cssClasses.activeElement);

            _.chain(that.targetsToMove)
                .each(target => $(target.selector).removeClass(cssClasses.activeTarget));

            _.chain(that.sourcesFromMove)
                .each(moveSource => $(moveSource.target).removeClass(cssClasses.activeTarget));
        });
    }
};