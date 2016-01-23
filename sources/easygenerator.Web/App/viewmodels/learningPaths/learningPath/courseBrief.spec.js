import CourseBrief from 'viewmodels/learningPaths/learningPath/courseBrief';
import app from 'durandal/app';
import constants from 'constants';
import router from 'plugins/router';
import eventTracker from 'eventTracker';

var courseModel = {
    id: '123',
    title: 'title',
    modifiedOn: new Date(),
    template: {
        thumbnail: 'thumbnail'
    }
};
var course = new CourseBrief(courseModel);

describe('courseBrief:', () => {

    beforeEach(() => {
        spyOn(app, 'trigger');
        spyOn(eventTracker, 'publish');
        spyOn(router, 'openUrl');
    });

    it('should be class', () => {
        expect(CourseBrief).toBeFunction();
    });

    describe('id', () => {

        it('should be defined', () => {
            expect(course.id).toBeDefined();
        });

    });

    describe('title', () => {

        it('should be observable', () => {
            expect(course.title).toBeObservable();
        });

    });

    describe('modifiedOn', () => {

        it('should be defined', () => {
            expect(course.modifiedOn).toBeDefined();
        });

    });

    describe('thumbnail', () => {

        it('should be observable', () => {
            expect(course.thumbnail).toBeObservable();
        });

    });

    describe('constructor', () => {

        it('should set all passed data', () => {
            var courseBrief = new CourseBrief(courseModel);
            expect(courseBrief.id).toBe(courseModel.id);
            expect(courseBrief.title()).toBe(courseModel.title);
            expect(courseBrief.modifiedOn()).toBe(courseModel.modifiedOn);
            expect(courseBrief.thumbnail()).toBe(courseModel.template.thumbnail);
        });

    });

    describe('preview', () => {

        it('should be function', () => {
            expect(course.preview).toBeFunction();
        });

        it('should publish event', () => {
            course.preview();
            expect(eventTracker.publish).toHaveBeenCalledWith('Preview course');
        });

        it('should open course in preview mode', () => {
            course.preview();
            expect(router.openUrl).toHaveBeenCalledWith(`/preview/${course.id}`);
        });

    });

    describe('remove', () => {

        it('should be function', () => {
            expect(course.remove).toBeFunction();
        });

        it('should trigger up event', () => {
            course.remove();
            expect(app.trigger).toHaveBeenCalledWith(constants.messages.learningPath.removeCourse, course.id);
        });

    });

});