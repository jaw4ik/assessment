import deleteSectionDialog from './deleteSection';
import dialog from 'widgets/dialog/viewmodel';
import dataContext from 'dataContext';
import constants from 'constants';
import eventTracker from 'eventTracker';
import permanentlyDeleteSectionCommand from 'editor/course/commands/permanentlyDeleteSectionCommand';
import unrelateSectionCommand from 'editor/course/commands/unrelateSectionCommand';
import userContext from 'userContext';
import localizationManager from 'localization/localizationManager';
import notify from 'notify';

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

        spyOn(notify, 'success');
        spyOn(dialog, 'close');
        spyOn(localizationManager, 'localize').and.callFake(function (arg) {
            return arg;
        });
    });

    it('should initialize fields', () => {
        expect(deleteSectionDialog.courseId).toBe('');
        expect(deleteSectionDialog.courses()).toBeArray();
        expect(deleteSectionDialog.sectionId).toBe('');
        expect(deleteSectionDialog.sectionCreatedBy).toBe('');
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

        it('should set section createdBy', () => {
            deleteSectionDialog.show(courseId, sectionId,sectionTitle, createBy);
            expect(deleteSectionDialog.sectionCreatedBy).toBe(createBy);
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
            deleteSectionDialog.sectionId = sectionId;
            deleteSectionDialog.courseId = courseId;
        });

        it('should send event \'Delete selected objectives\'', done => (async () => {
            deleteSectionDialog.deleteSection();
            await unrelateSectionPromise;
            expect(eventTracker.publish).toHaveBeenCalledWith('Delete selected objectives', 'Course editor (drag and drop)');
        })().then(done));

        describe('when section created by current user', () => {
            beforeEach(() => {
                deleteSectionDialog.sectionCreatedBy = createBy;
                userContext.identity = {
                    email: createBy
                };
            });

            describe('and section is deleting from everywhere', () => {
                beforeEach(() => {
                    deleteSectionDialog.deleteEverywhere(true);
                });

                it('should delete section permanently', () => {
                    deleteSectionDialog.deleteSection();
                    expect(permanentlyDeleteSectionCommand.execute).toHaveBeenCalledWith(sectionId);
                });

                describe('and when section deleted', () => {
                    it('should set isDeleting to false', done => (async () => {
                        deleteSectionDialog.isDeleting(true);
                        deleteSectionDialog.deleteSection();
                        await permanentlyDeleteSectionCommand;
                        expect(deleteSectionDialog.isDeleting()).toBeFalsy();
                    })().then(done));

                    it('should show notification', done => (async () => {
                        deleteSectionDialog.deleteSection();
                        await permanentlyDeleteSectionCommand;
                        expect(notify.success).toHaveBeenCalledWith('sectionWasDeletedMessage');
                    })().then(done));

                    it('should close dialog', done => (async () => {
                        deleteSectionDialog.deleteSection();
                        await permanentlyDeleteSectionCommand;
                        expect(dialog.close).toHaveBeenCalled();
                    })().then(done));
                });
            });

            describe('and when section related to a single course', () => {
                beforeEach(() => {
                    deleteSectionDialog.courses([{}]);
                });

                it('should delete section permanently', () => {
                    deleteSectionDialog.deleteSection();
                    expect(permanentlyDeleteSectionCommand.execute).toHaveBeenCalledWith(sectionId);
                });

                describe('and when section deleted', () => {
                    it('should set isDeleting to false', done => (async () => {
                        deleteSectionDialog.isDeleting(true);
                        deleteSectionDialog.deleteSection();
                        await permanentlyDeleteSectionCommand;
                        expect(deleteSectionDialog.isDeleting()).toBeFalsy();
                    })().then(done));

                    it('should show notification', done => (async () => {
                        deleteSectionDialog.deleteSection();
                        await permanentlyDeleteSectionCommand;
                        expect(notify.success).toHaveBeenCalledWith('sectionWasDeletedMessage');
                    })().then(done));

                    it('should close dialog', done => (async () => {
                        deleteSectionDialog.deleteSection();
                        await permanentlyDeleteSectionCommand;
                        expect(dialog.close).toHaveBeenCalled();
                    })().then(done));
                });
            });

            describe('and when section is not deleted from everywhere and related to few courses', () => {
                beforeEach(() => {
                    deleteSectionDialog.deleteEverywhere(false);
                    deleteSectionDialog.courses([{}, {}]);
                });

                it('should unrelate section from course', () => {
                    deleteSectionDialog.deleteSection();
                    expect(unrelateSectionCommand.execute).toHaveBeenCalledWith(courseId, { id: sectionId });
                });

                describe('and when section deleted', () => {
                    it('should set isDeleting to false', done => (async () => {
                        deleteSectionDialog.isDeleting(true);
                        deleteSectionDialog.deleteSection();
                        await unrelateSectionCommand;
                        expect(deleteSectionDialog.isDeleting()).toBeFalsy();
                    })().then(done));

                    it('should show notification', done => (async () => {
                        deleteSectionDialog.deleteSection();
                        await unrelateSectionCommand;
                        expect(notify.success).toHaveBeenCalledWith('sectionWasDeletedMessage');
                    })().then(done));

                    it('should close dialog', done => (async () => {
                        deleteSectionDialog.deleteSection();
                        await unrelateSectionCommand;
                        expect(dialog.close).toHaveBeenCalled();
                    })().then(done));
                });
            });
        });

        describe('when section created not by current user', () => {
            beforeEach(() => {
                deleteSectionDialog.sectionCreatedBy = 'some@user.com';
                userContext.identity = {
                    email: createBy
                };
            });

            it('should unrelate section from course', () => {
                deleteSectionDialog.deleteSection();
                expect(unrelateSectionCommand.execute).toHaveBeenCalledWith(courseId, { id: sectionId });
            });

            describe('and when section deleted', () => {
                it('should set isDeleting to false', done => (async () => {
                    deleteSectionDialog.isDeleting(true);
                    deleteSectionDialog.deleteSection();
                    await unrelateSectionCommand;
                    expect(deleteSectionDialog.isDeleting()).toBeFalsy();
                })().then(done));

                it('should show notification', done => (async () => {
                    deleteSectionDialog.deleteSection();
                    await unrelateSectionCommand;
                    expect(notify.success).toHaveBeenCalledWith('sectionWasDeletedMessage');
                })().then(done));

                it('should close dialog', done => (async () => {
                    deleteSectionDialog.deleteSection();
                    await unrelateSectionCommand;
                    expect(dialog.close).toHaveBeenCalled();
                })().then(done));
            });

        });

    });

    describe('cancel:', () => {

        it('should close dialog', () => {
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