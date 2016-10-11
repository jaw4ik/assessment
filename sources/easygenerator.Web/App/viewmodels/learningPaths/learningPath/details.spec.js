import viewModel from './details';

import getLearningPathByIdQuery from './queries/getLearningPathByIdQuery';
import addCourseCommand from './commands/addCourseCommand';
import removeCourseCommand from './commands/removeCourseCommand';
import removeDocumentCommand from './commands/removeDocumentCommand';
import updateEntitiesOrderCommand from './commands/updateEntitiesOrderCommand';
import addDocumentCommand from './commands/addDocumentCommand';
import courseSelector from './../courseSelector/courseSelector';
import CourseBrief from './courseBrief';
import DocumentBrief from './documentBrief';
import router from 'routing/router';
import constants from 'constants';
import eventTracker from 'eventTracker';
import localizationManager from 'localization/localizationManager';
import app from 'durandal/app';
import courseRepository from 'repositories/courseRepository';
import notify from 'notify';
import createCourseDialog from 'dialogs/course/createCourse/createCourse';
import createDocumentDialog from 'dialogs/document/create/index';
import createDocumentCommand from 'commands/createDocumentCommand';
import updateDocumentCommand from 'commands/updateDocumentCommand';

var courseModel = {
    id: '123',
    title: 'title',
    modifiedOn: new Date(),
    template: {
        thumbnail: 'thumbnail'
    }
};
var courseBrief = new CourseBrief(courseModel);

var documentModel = {
    id: '123',
    documentType: 1,
    title: 'title',
    embedCode: 'embedCode',
    modifiedOn: new Date()
};
var documentBrief = new DocumentBrief(documentModel);

describe('viewModel [learningPath details]', function () {
    var learningPath,
        getLearnigPathDefer,
        removeDocumentDeref;

    beforeEach(function () {
        getLearnigPathDefer = Q.defer();
        removeDocumentDeref = Q.defer();
        spyOn(app, 'on');
        spyOn(app, 'off');
        spyOn(app, 'trigger');
        spyOn(notify, 'saved');
        spyOn(router, 'navigate');
        spyOn(eventTracker, 'publish');
        spyOn(courseSelector, 'expand');
        spyOn(courseSelector, 'collapse');
        spyOn(getLearningPathByIdQuery, 'execute').and.returnValue(getLearnigPathDefer.promise);
        spyOn(createCourseDialog, 'show');
        spyOn(createDocumentDialog, 'show');
        spyOn(updateDocumentCommand, 'execute');
        spyOn(addDocumentCommand, 'execute');
        spyOn(createDocumentCommand, 'execute');
        spyOn(removeDocumentCommand, 'execute').and.returnValue(removeDocumentDeref.promise);
        learningPath = {
            id: 'id',
            title: 'title',
            entities: [{ id: '0', template: {} }, { id: '1', template: {} }]
        };
    });

    describe('activate:', function () {
        it('should set learning path id', function () {
            viewModel.id = null;
            viewModel.activate(learningPath.id);
            expect(viewModel.id).toBe(learningPath.id);
        });

        it('should set current language', function () {
            var lang = 'en';
            viewModel.currentLanguage = '';
            localizationManager.currentLanguage = lang;
            viewModel.activate(learningPath.id);
            expect(viewModel.currentLanguage).toBe(lang);
        });

        it('should subscribe on learningPath.courseSelector.courseSelected event', function () {
            viewModel.activate(learningPath.id);
            expect(app.on).toHaveBeenCalledWith(constants.messages.learningPath.courseSelector.courseSelected, viewModel.addCourse);
        });

        it('should subscribe on learningPath.courseSelector.courseDeselected event', function () {
            viewModel.activate(learningPath.id);
            expect(app.on).toHaveBeenCalledWith(constants.messages.learningPath.courseSelector.courseDeselected, viewModel.removeCourse);
        });

        it('should subscribe on learningPath.removeCourse event', function () {
            viewModel.activate(learningPath.id);
            expect(app.on).toHaveBeenCalledWith(constants.messages.learningPath.removeCourse, viewModel.removeCourse);
        });

        it('should subscribe on course.deleted event', function () {
            viewModel.activate(learningPath.id);
            expect(app.on).toHaveBeenCalledWith(constants.messages.course.deleted, viewModel.courseDeleted);
        });

        it('should subscribe on course.titleUpdatedByCollaborator event', function () {
            viewModel.activate(learningPath.id);
            expect(app.on).toHaveBeenCalledWith(constants.messages.course.titleUpdatedByCollaborator, viewModel.courseTitleUpdated);
        });

        it('should subscribe on learningPath.removeDocument event', function () {
            viewModel.activate(learningPath.id);
            expect(app.on).toHaveBeenCalledWith(constants.messages.learningPath.removeDocument, viewModel.removeDocument);
        });

        describe('when received learning path', function () {
            beforeEach(function () {
                getLearnigPathDefer.resolve(learningPath);
            });

            it('should set entities', function (done) {
                viewModel.entities([]);
                viewModel.activate(learningPath.id).fin(function () {
                    expect(viewModel.entities().length).toBe(learningPath.entities.length);
                    done();
                });
            });

            it('should set course selector isExpaneded to false', function (done) {
                viewModel.courseSelector.isExpanded(true);
                viewModel.activate(learningPath.id).fin(function () {
                    expect(viewModel.courseSelector.isExpanded()).toBeFalsy();
                    done();
                });
            });

            describe('when there are no entities in the learning path', function () {
                beforeEach(function () {
                    learningPath.entities = [];
                });

                it('should set course selector isExpaneded to true', function (done) {
                    viewModel.courseSelector.isExpanded(false);
                    viewModel.activate(learningPath.id).fin(function () {
                        expect(viewModel.courseSelector.isExpanded()).toBeTruthy();
                        done();
                    });
                });
            });
        });
    });

    describe('deactivate:', function () {
        it('should unsubscribe on learningPath.courseSelector.courseSelected event', function () {
            viewModel.deactivate();
            expect(app.off).toHaveBeenCalledWith(constants.messages.learningPath.courseSelector.courseSelected, viewModel.addCourse);
        });

        it('should unsubscribe on learningPath.courseSelector.courseDeselected event', function () {
            viewModel.deactivate();
            expect(app.off).toHaveBeenCalledWith(constants.messages.learningPath.courseSelector.courseDeselected, viewModel.removeCourse);
        });

        it('should unsubscribe on learningPath.removeCourse event', function () {
            viewModel.deactivate();
            expect(app.off).toHaveBeenCalledWith(constants.messages.learningPath.removeCourse, viewModel.removeCourse);
        });

        it('should unsubscribe on course.deleted event', function () {
            viewModel.deactivate();
            expect(app.off).toHaveBeenCalledWith(constants.messages.course.deleted, viewModel.courseDeleted);
        });

        it('should unsubscribe from course.titleUpdatedByCollaborator event', function () {
            viewModel.deactivate();
            expect(app.off).toHaveBeenCalledWith(constants.messages.course.titleUpdatedByCollaborator, viewModel.courseTitleUpdated);
        });

        it('should unsubscribe on learningPath.removeDocument event', function () {
            viewModel.deactivate();
            expect(app.off).toHaveBeenCalledWith(constants.messages.learningPath.removeDocument, viewModel.removeDocument);
        });

    });

    describe('back:', function () {
        it('should publish \'Navigate to learning paths\' event', function () {
            viewModel.back();
            expect(eventTracker.publish).toHaveBeenCalledWith('Navigate to learning paths');
        });

        it('should navigate to learning paths', function () {
            viewModel.back();
            expect(router.navigate).toHaveBeenCalledWith('#learningpaths');
        });
    });

    describe('id:', function () {
        it('should be defined', function () {
            expect(viewModel.id).toBeDefined();
        });
    });

    describe('currentLanguage:', function () {
        it('should be defined', function () {
            expect(viewModel.currentLanguage).toBeDefined();
        });
    });

    describe('isSortingEnabled:', function () {
        describe('when entities count > 1', function () {
            it('should be true', function () {
                viewModel.entities([{}, {}]);
                expect(viewModel.isSortingEnabled()).toBeTruthy();
            });
        });

        describe('when entities count == 1', function () {
            it('should be false', function () {
                viewModel.entities([{}]);
                expect(viewModel.isSortingEnabled()).toBeFalsy();
            });
        });

        describe('when entities count == 0', function () {
            it('should be false', function () {
                viewModel.entities([]);
                expect(viewModel.isSortingEnabled()).toBeFalsy();
            });
        });
    });

    describe('addCoursesPopoverVisibility', function () {

        it('should be observable', function () {
            expect(viewModel.addCoursesPopoverVisibility).toBeObservable();
        });

    });

    describe('toggleAddCoursesPopoverVisibility', function () {

        it('should be function', function () {
            expect(viewModel.toggleAddCoursesPopoverVisibility).toBeFunction();
        });

        it('should toggle addCoursePopoverVisibility', function () {
            viewModel.addCoursesPopoverVisibility(false);
            viewModel.toggleAddCoursesPopoverVisibility();
            expect(viewModel.addCoursesPopoverVisibility()).toBeTruthy();
            viewModel.toggleAddCoursesPopoverVisibility();
            expect(viewModel.addCoursesPopoverVisibility()).toBeFalsy();
        });

    });

    describe('hideAddCoursesPopover', function () {

        it('should be function', function () {
            expect(viewModel.hideAddCoursesPopover).toBeFunction();
        });

        it('should hide addCoursePopover', function () {
            viewModel.addCoursesPopoverVisibility(true);
            viewModel.hideAddCoursesPopover();
            expect(viewModel.addCoursesPopoverVisibility()).toBeFalsy();
        });

    });

    describe('navigateToDetails', function () {

        it('should be function', function () {
            expect(viewModel.navigateToDetails).toBeFunction();
        });

        describe('when entity is course', function () {

            it('should publish event', function () {
                viewModel.navigateToDetails(courseBrief);
                expect(eventTracker.publish).toHaveBeenCalledWith('Navigate to course details');
            });

            it('should navigate to course page', function () {
                viewModel.navigateToDetails(courseBrief);
                expect(router.navigate).toHaveBeenCalledWith('courses/' + courseBrief.id);
            });

        });

        describe('when entity is document', function() {

            it('should publish open update document dialog event', function() {
                viewModel.navigateToDetails(documentBrief);
                expect(eventTracker.publish).toHaveBeenCalled();
            });

            it('should open createDocumentDialog', function () {
                viewModel.navigateToDetails(documentBrief);
                expect(createDocumentDialog.show).toHaveBeenCalled();
            });

        });

    });

    describe('addCourses:', function () {
        it('should publish \'Show courses available for the learning path (Add courses)\' event', function () {
            viewModel.addCourses();
            expect(eventTracker.publish).toHaveBeenCalledWith('Show courses available for the learning path (Add courses)');
        });

        it('should expand course selector', function () {
            viewModel.addCourses();
            expect(courseSelector.expand).toHaveBeenCalled();
        });
    });

    describe('finishAddingCourses:', function () {
        it('should publish \'Hide courses available for the learning path (Done)\' event', function () {
            viewModel.finishAddingCourses();
            expect(eventTracker.publish).toHaveBeenCalledWith('Hide courses available for the learning path (Done)');
        });

        it('should collapse course selector', function () {
            viewModel.finishAddingCourses();
            expect(courseSelector.collapse).toHaveBeenCalled();
        });
    });

    describe('addCourse:', function () {
        var course = { id: 'id', template: {} },
            getCourseDefer,
            addCourseDefer;

        beforeEach(function () {
            getCourseDefer = Q.defer();
            addCourseDefer = Q.defer();
            spyOn(courseRepository, 'getById').and.returnValue(getCourseDefer.promise);
            spyOn(addCourseCommand, 'execute').and.returnValue(addCourseDefer.promise);
        });

        it('should publish \'Add course to the learning path\' event', function () {
            viewModel.addCourse(course);
            expect(eventTracker.publish).toHaveBeenCalledWith('Add course to the learning path');
        });

        describe('when course received', function () {
            beforeEach(function () {
                getCourseDefer.resolve(course);
            });

            it('should push course to courses collection', function (done) {
                viewModel.entities([]);
                viewModel.addCourse(course);
                courseRepository.getById(course.id).then(function () {
                    expect(viewModel.entities().length).toBe(1);
                    done();
                });
            });

            describe('and when course added', function () {
                beforeEach(function () {
                    addCourseDefer.resolve();
                });

                it('should show saved notification', function (done) {
                    viewModel.addCourse(course);
                    addCourseCommand.execute(viewModel.id, course.id).fin(function () {
                        expect(notify.saved).toHaveBeenCalled();
                        done();
                    });
                });
            });
        });
    });

    describe('removeCourse:', function () {
        var course = { id: 'id', template: {} },
            removeCourseDefer;

        beforeEach(function () {
            removeCourseDefer = Q.defer();
            spyOn(removeCourseCommand, 'execute').and.returnValue(removeCourseDefer.promise);
        });

        it('should publish \'Remove course from the learning path\' event', function () {
            viewModel.removeCourse(course.id);
            expect(eventTracker.publish).toHaveBeenCalledWith('Remove course from the learning path');
        });

        describe('and when course removed', function () {
            beforeEach(function () {
                removeCourseDefer.resolve();
                spyOn(viewModel, 'courseDeleted');
            });

            it('should call courseDeleted', function (done) {
                viewModel.entities([course]);
                viewModel.removeCourse(course.id).fin(function () {
                    expect(viewModel.courseDeleted).toHaveBeenCalled();
                    done();
                });;
            });

            it('should show saved notification', function (done) {
                viewModel.removeCourse(course.id);
                removeCourseCommand.execute(viewModel.id, course.id).fin(function () {
                    expect(notify.saved).toHaveBeenCalled();
                    done();
                });
            });
        });
    });

    describe('courseDeleted:', function() {
        var course = { id: 'id', template: {} };

        it('should remove course from courses collection', function () {
            viewModel.entities([course]);
            viewModel.courseDeleted(course.id);
            expect(viewModel.entities().length).toBe(0);
        });

        describe('when courseSelector is collapsed', function () {
            beforeEach(function () {
                viewModel.courseSelector.isExpanded(false);
            });

            describe('and when course was the last in collection', function () {
                beforeEach(function () {
                    viewModel.entities([course]);
                });

                it('should expand course selector', function () {
                    viewModel.courseDeleted(course.id);
                    expect(viewModel.courseSelector.expand).toHaveBeenCalled();
                });
            });
        });
    });

    describe('createCourseCallback', function () {

        beforeEach(function () {
            spyOn(viewModel, 'addCourse');
            spyOn(courseSelector, 'courseAddedToPath');
        });

        it('should be function', function () {
            expect(viewModel.createCourseCallback).toBeFunction();
        });

        it('should add course', function () {
            viewModel.createCourseCallback({ id: 'id' });
            expect(viewModel.addCourse).toHaveBeenCalledWith('id');
        });

        it('should add course to learning path selector', function () {
            var course = { id: 'id' };
            viewModel.createCourseCallback(course);
            expect(courseSelector.courseAddedToPath).toHaveBeenCalledWith(course);
        });

        it('should trigger event "New course added"', function() {
            var course = { id: 'id' };
            viewModel.createCourseCallback(course);
            expect(app.trigger).toHaveBeenCalledWith(constants.messages.learningPath.createCourse, course);
        });

    });

    describe('createNewCourse', function () {

        it('should be function', function () {
            expect(viewModel.createNewCourse).toBeFunction();
        });

        it('should publish event', function () {
            viewModel.createNewCourse();
            expect(eventTracker.publish).toHaveBeenCalledWith('Open \'Create course\' dialog');
        });

        it('should call show add course dialog with callback', function () {
            viewModel.createNewCourse();
            expect(createCourseDialog.show).toHaveBeenCalledWith(viewModel.createCourseCallback);
        });

    });

    describe('updateEntitiesOrder:', function () {
        var updateEntitiesOrderDefer;

        beforeEach(function () {
            updateEntitiesOrderDefer = Q.defer();
            spyOn(updateEntitiesOrderCommand, 'execute').and.returnValue(updateEntitiesOrderDefer.promise);
        });

        it('should publish \'Change order of courses\' event', function () {
            viewModel.updateEntitiesOrder();
            expect(eventTracker.publish).toHaveBeenCalledWith('Change order of courses');
        });

        describe('when courses order updated successfully', function () {
            beforeEach(function () {
                updateEntitiesOrderDefer.resolve();
            });

            it('should show saved notification', function (done) {
                viewModel.updateEntitiesOrder();
                updateEntitiesOrderCommand.execute(viewModel.id, viewModel.entities()).fin(function () {
                    expect(notify.saved).toHaveBeenCalled();
                    done();
                });
            });
        });
    });

    describe('courseTitleUpdated:', function () {
        var courseBrief = {
            id: 'id',
            title: ko.observable('')
        },
            course = {
                id: courseBrief.id,
                title: 'title'
            };

        it('should update course title', function () {
            courseBrief.title('');
            viewModel.entities([courseBrief]);
            viewModel.courseTitleUpdated(course);
            expect(courseBrief.title()).toBe(course.title);
        });

        it('should not throw when course not found in collection', function () {
            viewModel.entities([]);
            var f = function () {
                viewModel.courseTitleUpdated(course);
            };

            expect(f).not.toThrow();
        });
    });

    describe('isCourse:', function() {

        it('should be function', function() {
            expect(viewModel.isCourse).toBeFunction();
        });

        it('should return true if entity is course', function() {
            expect(viewModel.isCourse(courseBrief)).toBeTruthy();
        });

        it('should return false if entity is not course', function () {
            expect(viewModel.isCourse(documentBrief)).toBeFalsy();
        });

    });

    describe('addPowerPointDocument:', function () {

        it('should be function', function() {
            expect(viewModel.addPowerPointDocument).toBeFunction();
        });

        it('should publish event', function () {
            viewModel.addPowerPointDocument();
            expect(eventTracker.publish).toHaveBeenCalled();
        });

        it('should open add document popup', function () {
            viewModel.addPowerPointDocument();
            expect(createDocumentDialog.show).toHaveBeenCalled();
        });

    });

    describe('addPdfDocument:', function () {

        it('should be function', function () {
            expect(viewModel.addPdfDocument).toBeFunction();
        });

        it('should publish event', function () {
            viewModel.addPdfDocument();
            expect(eventTracker.publish).toHaveBeenCalled();
        });

        it('should open add document popup', function () {
            viewModel.addPdfDocument();
            expect(createDocumentDialog.show).toHaveBeenCalled();
        });

    });

    describe('addOfficeDocument:', function () {

        it('should be function', function () {
            expect(viewModel.addOfficeDocument).toBeFunction();
        });

        it('should publish event', function () {
            viewModel.addOfficeDocument();
            expect(eventTracker.publish).toHaveBeenCalled();
        });

        it('should open add document popup', function () {
            viewModel.addOfficeDocument();
            expect(createDocumentDialog.show).toHaveBeenCalled();
        });

    });

    describe('removeDocument', function() {

        it('should be function', function() {
            expect(viewModel.removeDocument).toBeFunction();
        });

        describe('when document exists in dataContext', function () {

            beforeEach(function() {
                viewModel.entities([documentBrief]);
            });

            it('should publish event', function () {
                viewModel.removeDocument(documentBrief.id);
                expect(eventTracker.publish).toHaveBeenCalled();
            });

            it('should remove document from viewModel', function () {
                viewModel.removeDocument(documentBrief.id);
                expect(viewModel.entities.length).toBe(0);
            });

            it('should call remove document command with correct args', function () {
                viewModel.removeDocument(documentBrief.id);
                expect(removeDocumentCommand.execute).toHaveBeenCalledWith(documentBrief.id);
            });

        });

    });

});
