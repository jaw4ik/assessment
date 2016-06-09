import ko from 'knockout';
import _ from 'underscore';
import router from 'routing/router';
import templateRepository from 'repositories/templateRepository';
import TemplateBrief from 'dialogs/course/common/templateSelector/templateBrief';

export default class TemplateSelector{
    constructor() {
        this.isLoading = ko.observable(false);
        this.templates = ko.observableArray([]);
        this.selectedTemplate = ko.observable();
        this.showAdvancedTemplates = ko.observable(false);
        this.advancedTemplates = ko.computed(() => {
            return _.filter(this.templates(), template => {
                return template.isAdvanced;
            });
        }, this);
    }

    async activate(selectedTemplateId) {
        this.templates.removeAll();

        this.isLoading(true);
        let templatesCollection = await templateRepository.getCollection();

        this.isLoading(false);
        let templates=_.chain(templatesCollection)
               .map(template => {
                   return new TemplateBrief(template);
               })
               .sortBy(template => { return template.order; })
               .partition(template => { return template.isCustom; })
               .flatten()
               .value();

        let advancedTemplates = _.rest(templates, _.findIndex(templates, template => { return !template.isCustom; }) + 2);
        if(_.isArray(advancedTemplates)) {
            advancedTemplates.forEach(template => template.isAdvanced = true);
        }

        this.templates(templates);
        this.selectTemplateById(selectedTemplateId);
        this.showAdvancedTemplates(_.some(advancedTemplates, template => { return this.selectedTemplate() && template.id === this.selectedTemplate().id }));
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

    toggleAdvancedTemplatesVisibility() {
        this.showAdvancedTemplates(!this.showAdvancedTemplates());
    }
}