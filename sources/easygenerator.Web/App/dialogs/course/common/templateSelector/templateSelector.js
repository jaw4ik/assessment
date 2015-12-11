import ko from 'knockout';
import _ from 'underscore';
import router from 'plugins/router';
import templateRepository from 'repositories/templateRepository';
import TemplateBrief from 'dialogs/course/common/templateSelector/templateBrief';

export default class TemplateSelector{
    constructor() {
        this.isLoading = ko.observable(false);
        this.templates = ko.observableArray([]);
        this.selectedTemplate = ko.observable();
    }

    async activate(selectedTemplateId) {
        this.templates.removeAll();

        this.isLoading(true);
        let templates = await templateRepository.getCollection();

        this.isLoading(false);
        this.templates(_.chain(templates)
               .map(template => {
                   return new TemplateBrief(template);
               })
               .sortBy(template => { return template.order; })
               .partition(template => { return template.isCustom; })
               .flatten()
               .value());

        let systemTemplatesStartingIndex = _.findIndex(this.templates(), template => { return !template.isCustom; });
        let advancedTemplates = _.rest(this.templates(), systemTemplatesStartingIndex + 2);
        if(_.isArray(advancedTemplates)) {
            advancedTemplates.forEach(template => template.isAdvanced = true);
        }

        this.selectTemplateById(selectedTemplateId);
    }

    selectTemplate(template) {
        if (template.id === this.getSelectedTemplateId())
            return;

        this.selectedTemplate(template);
    }

    getSelectedTemplateId() {
        return this.selectedTemplate() ? this.selectedTemplate().id : null;
    }

    selectTemplateById(id) {
        if (id) {
            this.selectedTemplate(_.find(this.templates(), function (item) { return item.id === id; }));
        } else {
            this.selectedTemplate(this.templates()[0]);
        }
    }
}