import viewModel from './deleteQuestion';

import dialog from 'widgets/dialog/viewmodel';
import constants from 'constants';
import eventTracker from 'eventTracker';
import deleteQuestionCommand from 'editor/course/commands/deleteQuestionCommand';
import localizationManager from 'localization/localizationManager';
import notify from 'notify';
import router from 'plugins/router';

describe('dialog [deleteQuestion]', () => {
    let courseId;
    let sectionId;
    let questionId;
    let title;

    beforeEach(() => {
        courseId = 'courseId';
        sectionId = 'sectionId';
        questionId = 'questionId';
        title = 'question title';

        spyOn(notify, 'saved');
        spyOn(notify, 'error');
        spyOn(dialog, 'show');
        spyOn(dialog, 'close');
        spyOn(eventTracker, 'publish');
        spyOn(router, 'navigate');
        spyOn(localizationManager, 'localize').and.callFake(function (arg) {
            return arg;
        });
    });

    describe('show:', () => {
        it('should be function', () => {
            expect(viewModel.show).toBeFunction();
        });

        it('should set courseId', () => {
            viewModel.courseId = null;
            viewModel.show(courseId);
            expect(viewModel.courseId).toBe(courseId);
        });

        it('should set sectionId', () => {
            viewModel.sectionId = null;
            viewModel.show(courseId, sectionId);
            expect(viewModel.sectionId).toBe(sectionId);
        });

        it('should set questionId', () => {
            viewModel.questionId = null;
            viewModel.show(courseId, sectionId, questionId);
            expect(viewModel.questionId).toBe(questionId);
        });

        it('should set question title', () => {
            viewModel.title(null);
            viewModel.show(courseId, sectionId, questionId, title);
            expect(viewModel.title()).toBe(title);
        });

        it('should show dialog', () => {
            viewModel.show(courseId, sectionId, questionId, title);
            expect(dialog.show).toHaveBeenCalledWith(viewModel, constants.dialogs.deleteItem.settings);
        });
    });

    describe('cancel:', () => {
        it('should be function', () => {
            expect(viewModel.cancel).toBeFunction();
        });

        it('should close dialog', () => {
            viewModel.cancel();
            expect(dialog.close).toHaveBeenCalled();
        });
    });

    describe('deleteQuestion:', () => {
        it('should be function', () => {
            expect(viewModel.deleteQuestion).toBeFunction();
        });

        it('should publish delete question event', () => {
            spyOn(deleteQuestionCommand,'execute').and.returnValue(Promise.resolve());
            viewModel.deleteQuestion();
            expect(eventTracker.publish).toHaveBeenCalledWith('Delete question');
        });

        it('should set true for isDeleting', () => {
            spyOn(deleteQuestionCommand,'execute').and.returnValue(Promise.resolve());
            viewModel.isDeleting(null);
            viewModel.deleteQuestion();
            expect(viewModel.isDeleting()).toBeTruthy();
        });

        it('should execute delete questionCommand', () => {
            viewModel.sectionId = sectionId;
            viewModel.questionId = questionId;
            spyOn(deleteQuestionCommand,'execute').and.returnValue(Promise.resolve());

            viewModel.deleteQuestion();
            expect(deleteQuestionCommand.execute).toHaveBeenCalledWith(sectionId, questionId);
        });

        describe('when delete failed', () => {
            beforeEach(() => {
                spyOn(deleteQuestionCommand,'execute').and.returnValue(Promise.reject('reason'));
            });

            it('should notify error with reason', done => {
                viewModel.deleteQuestion().then(() => {
                    expect(notify.error).toHaveBeenCalledWith('reason');
                    done();
                });
            });

            it('should set false for isDeleting', () => {
                viewModel.isDeleting(null);

                viewModel.deleteQuestion().then(done => {
                    expect(viewModel.isDeleting()).toBeFalsy();
                    done();
                });
            });
        });

        describe('when delete succeed', () => {
            beforeEach(() => {
                spyOn(deleteQuestionCommand,'execute').and.returnValue(Promise.resolve());
            });

            it('should notify success with reason', done => {
                viewModel.deleteQuestion().then(() => {
                    expect(notify.saved).toHaveBeenCalled();
                    done();
                });
            });

            it('should set false for isDeleting', done => {
                viewModel.isDeleting(null);

                viewModel.deleteQuestion().then(() => {
                    expect(viewModel.isDeleting()).toBeFalsy();
                    done();
                });
            });

            it('should close dialog', done => {
                viewModel.deleteQuestion().then(() => {
                    expect(dialog.close).toHaveBeenCalled();
                    done();
                });
            });

            it('should navigate to course details', done => {
                viewModel.courseId = courseId;

                viewModel.deleteQuestion().then(() => {
                    expect(router.navigate).toHaveBeenCalledWith(`#courses/${courseId}`);
                    done();
                }); 
            });
        });
    });
});