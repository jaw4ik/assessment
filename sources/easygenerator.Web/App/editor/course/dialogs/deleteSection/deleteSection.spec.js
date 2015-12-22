import deleteSectionDialog from './deleteSection';
import dialog from 'widgets/dialog/viewmodel';
import dataContext from 'dataContext';
import constants from 'constants';
import eventTracker from 'eventTracker';
import permanentlyDeleteSectionCommand from 'editor/course/commands/permanentlyDeleteSectionCommand';
import unrelateSectionCommand from 'editor/course/commands/unrelateSectionCommand';
import userContext from 'userContext';

describe('dialog [deleteSection]', () => {

    let courseId;
    let sectionId;
    let sectionTitle;
    let createBy;

    beforeEach(() => {
        courseId = 'courseId';
        sectionId = 'sectionId';
        sectionTitle = 'section title';
        createBy = 'createdBy';
    });

    it('should initialize fields', () => {
        expect(deleteSectionDialog.courseId).toBe('');
        expect(deleteSectionDialog.courses()).toBeArray();
        expect(deleteSectionDialog.sectionId).toBe('');
        expect(deleteSectionDialog.sectionTitle()).toBe('');
        expect(deleteSectionDialog.sectionContainedInFewCourses()).toBeFalsy();
        expect(deleteSectionDialog.deleteEverywhere()).toBeFalsy();
        expect(deleteSectionDialog.isDeleting()).toBeFalsy();
        expect(deleteSectionDialog.show).toBeFunction();
        expect(deleteSectionDialog.deleteSection).toBeFunction();
        expect(deleteSectionDialog.cancel).toBeFunction();
        expect(deleteSectionDialog.toggleDeleteEverywhere).toBeFunction();
    });

    describe('show:', () => {

        it('should set course id', () => {
            deleteSectionDialog.show(courseId);
            expect(deleteSectionDialog.courseId).toBe(courseId);
        });

        it('should set section id', () => {
            deleteSectionDialog.show(courseId, sectionId);
            expect(deleteSectionDialog.sectionId).toBe(sectionId);
        });

        it('should set section title', () => {
            deleteSectionDialog.show(courseId, sectionId, sectionTitle);
            expect(deleteSectionDialog.sectionTitle).toBe(sectionTitle);
        });

        it('should set courses', () => {
            dataContext.courses = [
                {
                    id: courseId,
                    objectives: [
                    {
                        id: sectionId
                    }]
                }
            ];
            deleteSectionDialog.show(courseId, sectionId, sectionTitle, createBy);
            expect(deleteSectionDialog.courses()[0].id).toBe(courseId);
        });

        it('should show dialog', () => {
            spyOn(dialog, 'show');
            deleteSectionDialog.show(courseId, sectionId, sectionTitle, createBy);
            expect(dialog.show).toHaveBeenCalledWith(deleteSectionDialog,  constants.dialogs.deleteItem.settings);
        });

    });

    describe('deleteSection:', () => {

        let permanentlyDeleteSectionPromise;
        let unrelateSectionPromise;

        beforeEach(() => {
            permanentlyDeleteSectionPromise = Promise.resolve();
            unrelateSectionPromise = Promise.resolve();
            spyOn(permanentlyDeleteSectionCommand, 'execute');
            spyOn(unrelateSectionCommand, 'execute');
            spyOn(eventTracker, 'publish');
        });

        it('should send event \'Delete selected objectives\'', done => (async () => {
            deleteSectionDialog.deleteSection();
            await unrelateSectionPromise;
            expect(eventTracker.publish).toHaveBeenCalledWith('Delete selected objectives', 'Course editor (drag and drop)');
        })().then(done));

        describe('when section created by current user', () => {
            
        });

        describe('when section created not by current user', () => {

            

        });

    });

    describe('cancel:', () => {

        it('should close dialog', () => {
            spyOn(dialog, 'close');
            deleteSectionDialog.cancel();
            expect(dialog.close).toHaveBeenCalled();
        });

    });

    describe('toggleDeleteEverywhere:', () => {

        describe('when user want delete section from all courses', () => {

            it('should set true', () => {
                deleteSectionDialog.deleteEverywhere(false);
                deleteSectionDialog.toggleDeleteEverywhere();
                expect(deleteSectionDialog.deleteEverywhere()).toBeTruthy();
            });

        });

        describe('when user want delete section from only this course', () => {

            it('should set false', () => {
                deleteSectionDialog.deleteEverywhere(true);
                deleteSectionDialog.toggleDeleteEverywhere();
                expect(deleteSectionDialog.deleteEverywhere()).toBeFalsy();
            });

        });

    });

});

//describe('unrelateSection:', () => {

//    let promise;

//    beforeEach(() => {
//        promise = Promise.resolve();
//        spyOn(unrelateSectionCommand, 'execute').and.returnValue(promise);
//    });

//    it('should unrelate section', done => (async () => {
//        let id = courseViewModel.sections()[0].id();
//        courseViewModel.unrelateSection(courseViewModel.sections()[0]);
//        await promise;
//        expect(courseViewModel.sections()[0].id()).not.toBe(id);
//    })().then(done));

//    it('should show saved message', done => (async () => {
//        courseViewModel.unrelateSection(courseViewModel.sections()[0]);
//        await promise;
//        expect(notify.saved).toHaveBeenCalled();
//    })().then(done));

//});