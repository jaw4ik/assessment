import constants from 'constants';
import multipleSelect from './supportedTypes/multipleSelect';
import singleSelectText from './supportedTypes/singleSelectText';
import statement from './supportedTypes/statement';

export default function() {
    switch (this.questionType) {
        case constants.questionType.multipleSelect.type:
            multipleSelect.call(this);
            break;
        case constants.questionType.singleSelectText.type:
            singleSelectText.call(this);
            break;
        case constants.questionType.statement.type:
            statement.call(this);
            break;
        default:
            throw 'Question does not support surrvey mode';
    }
}