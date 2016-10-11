import _ from 'underscore';
import constants from 'constants';

var templates = {
    1: `<div data-type="${constants.contentsTypes.textEditorOneColumn}" class="eg-content-editor" style="width:100%;"><div class='column' style="display:inline-block; width:100%; vertical-align:top">{data1}</div></div>`,
    2: `<div data-type="${constants.contentsTypes.textEditorTwoColumns}" class="eg-content-editor" style="width:100%;"><div class='column' style="display:inline-block; width:50%; vertical-align:top">{data1}</div><div class='column'  style="display:inline-block; width:50%; vertical-align:top">{data2}</div></div>`,
    3: `<div data-type="${constants.contentsTypes.textEditorThreeColumns}" class="eg-content-editor" style="width:100%;"><div class='column' style="display:inline-block; width:33%; vertical-align:top">{data1}</div><div class='column' style="display:inline-block; vertical-align:top; width:33%">{data2}</div><div class='column' style="display:inline-block; width:33%; vertical-align:top">{data3}</div></div>`,
};

export function initialize(data, type){
    let $input = $('<output>');
    $input.html(data);
    let markup = $input.find('.column');
    let output = _.map(markup, e => {
        return $(e).html();
    });
    return output;
}

export function updateTextEditorContent(data){
    let template = templates[data.length];
    _.each(data, (column, index)=>{
        template = template.replace('{data'+ (index+1) +'}', column);
    });
    return template;
}