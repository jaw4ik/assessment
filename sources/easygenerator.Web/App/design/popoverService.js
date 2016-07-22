import $ from 'jquery';
import ko from 'knockout';

class Service{
    
    constructor() {
        this.collection = ko.observableArray([]);
    }

    attach(registration) {
        this.collection.push(registration);
    }

    detach(registration) {
        this.collection.remove(registration);
    }
}

export class Popover{
    constructor(instance,target, position) {
        this.instance = instance;
        this.target = target;
        this.position = position ? position : undefined; 
    }

    compositionComplete(element) {

        let target = $(this.target);
        let parent = $(this.target).closest('.ps-container');

        let popover = $(element);

        let handler = () => {
            let offset = $(target).offset();
            let css;

            if(this.position === 'bottom'){
                css = {
                    top: offset.top + target.outerHeight() + 5,
                    left: offset.left -15
                };
            }

            else{
                css = {
                    top: offset.top + target.outerHeight() / 2 - 30,
                    left: target.outerWidth() + offset.left
                };

                if (css.top + popover.outerHeight()- $(window).scrollTop() > $(window).outerHeight()) {
                    if (offset.top + target.outerHeight() - popover.outerHeight() > 0) {
                        css.top = css.top - popover.outerHeight() - $('.editor-switcher').height() + 60;
                        popover.addClass('bottom');
                    } else {
                        popover.removeClass('bottom');
                    }
                }
            }

            popover.css({
                top: css.top - $(window).scrollTop() + 'px',
                left: css.left + 'px'
            });
        };

        handler();

        let callback = event => event.stopPropagation();
        let dispose = (() => {
            if (ko.isWriteableObservable(this.instance.isVisible)) {
                this.instance.isVisible(false);
            }

            target.off('click', callback);
            popover.off('click', callback);
            parent.off('scroll', dispose);
            $('html').off('click', dispose);
            $(window).off('resize', dispose);
        }).bind(this);

        target.on('click', callback);
        popover.on('click', callback);
        parent.on('scroll', dispose);
        $('html').on('click', dispose);
        $(window).on('resize', dispose);
    }
}

export default new Service();
