export default class TemplateBrief{
    constructor(template) {
        this.id = template.id;
        this.name=template.name;
        this.goal = template.goal;
        this.thumbnail = template.thumbnail;
        this.previewImages = template.previewImages;
        this.description = template.shortDescription;
        this.order = template.order;
        this.isCustom = template.isCustom;
        this.isAdvanced = false;
    }
}