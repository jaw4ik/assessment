import ko from 'knockout';
import $ from 'jquery';

ko.bindingHandlers.sliderBindingHandler = {
    init: (element, valueAccessor) => {
        ko.applyBindingsToNode(element, {
            event: {
                mouseenter: () => {
                    let value = valueAccessor();
                    if(value.shouldDisplayIcons) {
                        $(element)
                            .children('.next-arrow-btn')
                            .css('visibility', value.imgArray.length > 1 ? 'visible' : 'hidden');
                        $(element)
                            .children('.previus-arrow-btn')
                            .css('visibility', value.imgArray.length > 1 ? 'visible' : 'hidden');
                        $(element)
                            .children('.close-btn')
                            .css('visibility', value.imgArray.length > 0 ? 'visible' : 'hidden');
                    }
                },
                mouseleave: () => {
                    $(element).children('.next-arrow-btn').css('visibility', 'hidden');
                    $(element).children('.previus-arrow-btn').css('visibility', 'hidden');
                    $(element).children('.close-btn').css('visibility', 'hidden');
                }
            }
        });
    }
};