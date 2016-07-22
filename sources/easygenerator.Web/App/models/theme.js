import EntityModel from 'models/entity';

export default class {
    constructor(spec) {
        EntityModel.call(this, spec);
        this.name = spec.name;
        this.settings = spec.settings;
        this.templateId = spec.templateId;
        this.createdBy = spec.createdBy;
    }
};