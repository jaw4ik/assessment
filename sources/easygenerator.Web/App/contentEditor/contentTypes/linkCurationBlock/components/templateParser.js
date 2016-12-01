import _ from 'underscore';
import constants from 'constants';

const cssClasses = {
    images:             { prop: 'images',               class: 'images-class' },
    description:        { prop: 'link-content',         class: 'link-content-class' },
    title:              { prop: 'link-title',           class: 'link-title-class' },
    url:                { prop: 'link-url',             class: 'link-url' },
    customDescription:  { prop: 'custom-description',   class: 'custom-description' }
};

export let template = {
    'linkCuration':  
        `<div class='link-curation-block' data-type='${constants.contentsTypes.linkCuration}'>
            <div class='custom-description'>{${cssClasses.customDescription.prop}}</div>
            <div class='content-inner-wrapper'>
                <a target="_blank" href='{${cssClasses.url.prop}}'> 
                    <div class='${cssClasses.images.prop} {${cssClasses.images.class}}'>
                        <img src='{${cssClasses.images.prop}}'/>
                    </div>
                </a>
                <div class='text-wrapper'>
                    <a target="_blank" href='{${cssClasses.url.prop}}'>
                        <div class='text-block'>
                            <div class='${cssClasses.title.prop} {${cssClasses.title.class}}'>{${cssClasses.title.prop}}</div>
                            <div class='${cssClasses.description.prop} {${cssClasses.description.class}}'>{${cssClasses.description.prop}}</div>
                        </div>
                    </a>
                    <div class='static-link-present'>   
                        <a target="_blank" href='{${cssClasses.url.prop}}' class='${cssClasses.url.prop}'>{${cssClasses.url.prop}}</a> 
                    </div>
                </div>
            </div>
        </div>`
    };

export function initialize(data) {
    let $content = $(data);
    let parseData = {};
    
    _.map(cssClasses, function (value, key) { 
        switch(key) {
            case 'images':
                let image = $content.find(`.${value.prop}`);
                let imageSrc = image.children().attr('src');
                if(!_.isUndefined(imageSrc)) {
                    parseData[key] = [];
                    parseData[key].push(imageSrc); 
                    parseData.selectedImage = parseData[key][0]; 
                }
                break; 
            default:
                parseData[key] = $content.find(`.${value.prop}`).html(); 
                break; 
        }
    });
    return parseData;
}
//TODO: undescore extension
String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

export function updateBeforeStore(data) {
    let _template = template.linkCuration;

    _.map(cssClasses, function (value, key) { 
        switch(key) {
            case 'images': 
                _template = _template.replaceAll(`{${value.prop}}`, data.selectedImage);
                _template = _template.replace(`{${value.class}}`, (data.selectedImage.length === 0 ? 'deleted' : 'parsed'));
                break;

            case 'title':
                _template = _template.replaceAll(`{${value.prop}}`, data[key]);
                _template = _template.replace(`{${value.class}}`, data[key].length === 0 ? 'empty' : 'parsed');
                break;

            case 'description': 
                _template = _template.replaceAll(`{${value.prop}}`, data[key]);
                _template = _template.replace(`{${value.class}}`, data[key].length === 0 ? 'empty' : 'parsed');
                break;
            
            default:
                _template = _template.replaceAll(`{${value.prop}}`, data[key]);
                break;
        }
    });

  
    return $('<div>').append(_template).html();
};