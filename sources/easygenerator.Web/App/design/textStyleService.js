import $ from 'jquery';
import ko from 'knockout';


class StyleService{
    
    constructor() {
        this.collection = ko.observableArray([]);
    }

    attach(registration) {
        _.each(this.collection(),(item)=>{
            item.instance.isVisible(false);
        })
        this.collection.push(registration);
    }

    detach(registration) {
        this.collection.remove(registration);
    }
}


export class TextStyle{
    constructor(instance,target) {
        this.instance = instance;
        this.target = target;
    }
   
    compositionComplete(element) {
        let target = $(this.target);
        let parent = $(this.target).closest('.ps-container');

        let panel = $(element);
        let handler = () => {

            let offset = $(target).offset();

            let css = {
                top: offset.top - panel.outerHeight() - $('.editor-switcher').height() - $('.header').height() - $(window).scrollTop(),
                left: offset.left
            };

            panel.css({
                top: css.top + 'px',
                left: css.left + 'px'
            });
            //380 - height of biggest dropdown - with color choose
            if (css.top + 380 > $(window).outerHeight()- $('.editor-switcher').height() - $('.header').height()) {
                $(panel).addClass('top');
            }else{
                $(panel).removeClass('top');
            }
        };
        handler();

        let updateScrollPosition = event => {
            parent.scrollTop(parent.scrollTop() + event.originalEvent.deltaY);
            return false
        }

        let callback = event => event.stopPropagation();
        let dispose = (() => {
            parent.off('scroll', handler);
            panel.off('wheel', updateScrollPosition);
        }).bind(this);

        parent.on('scroll', handler);
        panel.on('wheel', updateScrollPosition);

        ko.utils.domNodeDisposal.addDisposeCallback(element, dispose);
    }
}

export default new StyleService()