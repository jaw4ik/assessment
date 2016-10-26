import ko from 'knockout';

export default class TemplateBrief {
    constructor(template) {
        this.id = template.id;
        this.name = template.name;
        this.thumbnail = template.thumbnail;
        this.previewImages = template.previewImages;
        this.description = template.shortDescription;
        this.designSettingsUrl = template.settingsUrls.design;
        this.settingsAvailable = template.settingsUrls.design != null;
        this.previewDemoUrl = template.previewDemoUrl;
        this.presets = template.presets;
        this.fonts = template.fonts;
        this.isLoading = ko.observable(false);
    }
}
