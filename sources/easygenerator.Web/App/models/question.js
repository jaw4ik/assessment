import Entity from './entity';
import constants from 'constants';

export default class Question extends Entity {
    constructor (spec) {
        super(spec);
        this.title = spec.title;
        this.voiceOver = spec.voiceOver;
        this.content = spec.content;
        this.type = spec.type;
        if (spec.hasOwnProperty('isSurvey')) {
            this.isSurvey = spec.isSurvey;
        } else if (this._surveyModeSupported(spec.type)) {
            this.isSurvey = false;
        }
    }
    _surveyModeSupported(type) {
        switch (type) {
            case constants.questionType.multipleSelect.type:
            case constants.questionType.singleSelectText.type:
            case constants.questionType.statement.type:
                return true;
            default:
                return false;
        }
    }
}