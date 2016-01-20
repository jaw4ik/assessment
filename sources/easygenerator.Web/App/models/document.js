import EntityModel from 'models/entity';

export default class {
    constructor(spec) {
        EntityModel.call(this, spec);
        this.title = spec.title;
        this.embedCode = spec.embedCode;
        this.documentType = spec.documentType;
    }
}