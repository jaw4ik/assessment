import clientContext from 'clientContext';
import constants from 'constants';
import createCourseDialog from 'dialogs/course/createCourse/createCourse';
import WatchTutorial from 'examples/dialogs/watchTutorial';
import router from 'routing/router';
import localizationManager from 'localization/localizationManager';
import eventTracker from 'eventTracker';

const events = {
    createCourseFromScratch: 'Create a course from scratch'
};

export class Start {
    constructor() {
        this.startFromScratchTutorial = new WatchTutorial(localizationManager.localize('startFromScratch'), localizationManager.localize('startFromScratchVideoUrl'), this.addFromScratch.bind(this));
        this.showExamplesTutorial = new WatchTutorial(localizationManager.localize('showExamples'), localizationManager.localize('showExamplesVideoUrl'), this.showExamples.bind(this));
    }

    activate() {
        clientContext.remove(constants.clientContextKeys.showCreateCourseView);
    }

    addFromScratch() {
        eventTracker.publish(events.createCourseFromScratch);
        createCourseDialog.show((course) => {
            router.navigate('courses/' + course.id);
        });
    }
    
    showExamples() {
        router.navigate('start/examples');
    }

    watchStartFromScratch() {
        this.startFromScratchTutorial.show();
    }

    watchShowExamples() {
        this.showExamplesTutorial.show();
    }
};

export default new Start();
