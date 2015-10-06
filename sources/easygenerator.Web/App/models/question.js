import { Entity } from 'models/entityClass';

export default class Question extends Entity {
    constructor (spec) {
        super(spec);

        this.title = spec.title;
        this.content = spec.content;
        this.type = spec.type;
    }
}

export var __useDefault = true;