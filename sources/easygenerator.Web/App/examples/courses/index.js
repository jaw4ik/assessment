import ko from 'knockout';
import router from 'routing/router';
import localizationManager from 'localization/localizationManager';
import getCourseExamplesCommand from 'examples/courses/commands/getCourseExamples';
import createCourseByExampleCommand from 'examples/courses/commands/createCourseByExample';
import createCourseDialog from 'dialogs/course/createCourse/createCourse';
import eventTracker from 'eventTracker';

const events = {
    createCourseFromScratch: 'Create a course from scratch',
    createCourseFromExample: 'Create a course from an example'
};

export class CourseExamples {
    constructor() {
        this.categories = [
        {
            key: 'popular', value: localizationManager.localize('popularCourseExampleCategory')
        }, {
            key: 'corporate', value: localizationManager.localize('corporateCourseExampleCategory')
        }, {
            key: 'education', value: localizationManager.localize('educationCourseExampleCategory')
        }, {
            key: 'training', value: localizationManager.localize('trainingCourseExampleCategory')
        }];

        this.courses = ko.observableArray([]);
        this.selected = ko.observable(this.categories[0]);

        this.examples = ko.computed(() => {
            return _.filter(this.courses(), course => {
                return course.category.indexOf(this.selected().key) !== -1;
            });
        });
    }
    
    async activate() {
        try {
            let courses = await getCourseExamplesCommand.execute();
            this.courses(courses);
        }
        catch (reason) {
            this.examples([]);
        };
    }

    async createByExample(item) {
        eventTracker.publish(events.createCourseFromExample, null, { Example_Course_Title: item.title });
        var course = await createCourseByExampleCommand.execute(item.id);
        router.navigate('courses/' + course.id);
    }

    addFromScratch() {
        eventTracker.publish(events.createCourseFromScratch);
        createCourseDialog.show((course) => {
            router.navigate('courses/' + course.id);
        });
    }
};

export default new CourseExamples();