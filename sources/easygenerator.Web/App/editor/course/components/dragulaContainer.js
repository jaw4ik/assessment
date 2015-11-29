import dragula from 'dragula';
import _ from 'underscore';
import attributesHelper from 'editor/course/components/attributesHelper';

var cssClasses = {
	activeTarget: 'active',
	itemOverTarget: 'over'
};

function addClassToNodesList(selector, className) {
	Array.from(document.querySelectorAll(selector)).forEach(function (node) {
		node.classList.add(className);
	});
}
function removeClassFromNodesList(selector, className) {
	Array.from(document.querySelectorAll(selector)).forEach(function (node) {
		node.classList.remove(className);
	});
}

export default class {
	constructor(){
		let that = this;
		this.draggableAreas = [];
		this.sourcesToCopy = [];
		this.targetsToMove = [];
		this.activeTargetsList = [];
		this.mirrorElement = null;
		this.dragula = dragula({
			copy: (element, source) => that.sourcesToCopy.indexOf(source) !== -1,
			moves: (element, source, handle) => {
				let area = that.draggableAreas.find((area)=>area.source == source);
				if (area){
					return element.isSameNode(element.closest(area.selector));
				}
				return true; 
			},
			accepts: (element, target, source) => {
				return _.any(that.targetsToMove, (moveTarget) => {
					return moveTarget.source == source && target.isSameNode(target.closest(moveTarget.selector));
				})
			},
			direction: 'vertical'
		});
		
		this.dragula.on('drop', (element, target, source, sibling) => {
			if (target === null) {
				return;
			}
			that.dragula.remove();
			_.each(that.targetsToMove, moveTarget => {
				if (moveTarget.source == source
				 && target.isSameNode(target.closest(moveTarget.selector))
				 && _.isFunction(moveTarget.handler)) {
					moveTarget.handler(attributesHelper.getDataAttribute(element), 
										attributesHelper.getDataAttribute(sibling), 
										attributesHelper.getDataAttribute(target), 
										attributesHelper.getDataAttribute(source));
				}
			});
		});
		this.dragula.on('cloned', (clone, original, type) => {
			if (type === 'mirror') {
				that.mirrorElement = clone;
			}
		});
		this.dragula.on('shadow', (element, container, source) => {
			container.classList.add(cssClasses.itemOverTarget);
			that.mirrorElement.classList.add(cssClasses.itemOverTarget);
		});
		this.dragula.on('out', (element, container, source) => {
			container.classList.remove(cssClasses.itemOverTarget);
			that.mirrorElement.classList.remove(cssClasses.itemOverTarget);
		});
		this.dragula.on('drag', (element, source) => {
			this.activeTargetsList = that.targetsToMove.filter(target => target.source == source);
			this.activeTargetsList.forEach(target => {
				addClassToNodesList(target.selector, cssClasses.activeTarget);
			});
		});
		this.dragula.on('dragend', function (element) {
			this.activeTargetsList.forEach(function (target) {
				removeClassFromNodesList(target.selector, cssClasses.activeTarget);
			});
			this.activeTargetsList = [];
		});
	}
};

	