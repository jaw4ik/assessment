import presentationCourseImportCommand from 'commands/presentationCourseImportCommand';
import uiLocker from 'uiLocker';
import router from 'routing/router';

class ImportFromPresentation {
    constructor() {}

    importCourseFromPresentation() {
        return presentationCourseImportCommand.execute({
            startLoading: function () {
                uiLocker.lock();
            },
            success: function (course) {
                if (course.sections.length) {
                    router.navigate('courses/' + course.id + '/sections/' + course.sections[0].id);
                } else {
                    router.navigate('courses/' + course.id);
                }
            },
            complete: function () {
                uiLocker.unlock();
            }
        });
    }
    
}

export default new ImportFromPresentation();

