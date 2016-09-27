import constants from 'constants';
import dialog from 'widgets/dialog/viewmodel';
import {CourseExamples} from 'examples/courses/index';

export class CourseExamplesDialog extends CourseExamples {
    constructor() {
        super();
    }

    addFromScratch() {
        dialog.close();
        dialog.on(constants.dialogs.dialogClosed, () => {
            dialog.off(constants.dialogs.dialogClosed);
            super.addFromScratch();
        });
    }

    createByExample(item) {
        super.createByExample(item);
        dialog.close();
    }
}


class AddByExample {
    constructor() {
        this.courseExamplesViewModel = new CourseExamplesDialog();
    }
    
    activate() {}

    show() {
        dialog.show(this, constants.dialogs.addCourseByExamples.settings);
    }
};

export default new AddByExample();
