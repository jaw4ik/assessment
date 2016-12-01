import ko from 'knockout';

export default function(initDataObj = {}) {
    let mapper = {};
    mapper.selectedImage = ko.observable(initDataObj.selectedImage || '');
    mapper.images = ko.observableArray(initDataObj.images || []);
    mapper.url = ko.observable(initDataObj.url || '');
    mapper.title = ko.observable(initDataObj.title || '');
    mapper.description = ko.observable(initDataObj.description || '');
    mapper.customDescription = ko.observable(initDataObj.customDescription || '');
    return mapper;
}