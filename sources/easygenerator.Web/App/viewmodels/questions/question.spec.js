import viewModel from 'viewmodels/questions/question';
import router from 'routing/router';
import constants from 'constants';
import eventTracker from 'eventTracker';
import questionRepository from 'repositories/questionRepository';
import sectionRepository from 'repositories/sectionRepository';
import courseRepository from 'repositories/courseRepository';
import vmQuestionTitle from 'viewmodels/questions/questionTitle';
import vmContentField from 'viewmodels/common/contentField';
import multipleSelect from 'viewmodels/questions/multipleSelect/multipleSelect';
import learningContents from 'viewmodels/learningContents/learningContents';
import feedback from 'viewmodels/questions/feedback';
import moveCopyDialog from 'dialogs/moveCopyQuestion/moveCopyQuestion';
import notify from 'notify';

let question = {
    id: 'questionId',
    type: constants.questionType.multipleSelect.type,
    title: 'lalala',
    content: 'question content',
    createdOn: new Date(),
    modifiedOn: new Date(),
    answerOptions: [],
    learningContents: [],
    voiceOver:'<iframe></iframe>'
};

describe('viewModel [question]', () => {
    beforeEach(() => {
        spyOn(eventTracker, 'publish');
        spyOn(router, 'navigate');
        spyOn(moveCopyDialog, 'show');
    });

    it('is defined', () => {
        expect(viewModel).toBeDefined();
    });

    describe('sectionId:', () => {
        it('should be defined', () => {
            expect(viewModel.sectionId).toBeDefined();
        });
    });

    describe('questionId:', () => {
        it('should be defined', () => {
            expect(viewModel.questionId).toBeDefined();
        });
    });

    describe('localizationManager:', () => {
        it('should be defined', () => {
            expect(viewModel.localizationManager).toBeDefined();
        });
    });

    describe('viewCaption:', () => {
        it('should be defined', () => {
            expect(viewModel.viewCaption).toBeDefined();
        });
    });

    describe('navigateToSectionEvent:', () => {

        it('should be function', () => {
            expect(viewModel.navigateToSectionEvent).toBeFunction();
        });

        it('should send event \'Navigate to objective details\'', () => {
            viewModel.navigateToSectionEvent();
            expect(eventTracker.publish).toHaveBeenCalledWith('Navigate to objective details');
        });

    });

    describe('activeQuestionViewModel:', () => {
        it('should be defined', () => {
            expect(viewModel.activeQuestionViewModel).toBeDefined();
        });
    });

    describe('learningContentsViewModel:', () => {
        it('should be defined', () => {
            expect(viewModel.learningContentsViewModel).toBeDefined();
        });
    });
        
    describe('feedbackViewModel:', () => {
        it('should be defined', () => {
            expect(viewModel.feedbackViewModel).toBeDefined();
        });
    });

    describe('questionTitle:', () => {
        it('should be defined', () => {
            expect(viewModel.questionTitle).toBeDefined();
        });
    });

    describe('questionContent:', () => {
        it('should be defined', () => {
            expect(viewModel.questionContent).toBeDefined();
        });
    });

    describe('canActivate:', () => {

        it('should be function', () => {
            expect(viewModel.canActivate).toBeFunction();
        });

        describe('when courseId is not pass', () => {
            it('should throw exception', () => {
                var f = () => { viewModel.canActivate(); }
                expect(f).toThrow();
            });
        });

        describe('when sectionId is not pass', () => {
            it('should throw exception', () => {
                var f = () => { viewModel.canActivate('courseId'); }
                expect(f).toThrow();
            });
        });

        describe('when questionId is not pass', () => {
            it('should throw exception', () => {
                var f = () => { viewModel.canActivate('courseId', 'sectionId'); }
                expect(f).toThrow();
            });
        });

        describe('when course does not exist', () => {
            beforeEach(() => {
                spyOn(courseRepository, 'getById').and.returnValue(Promise.reject());
                spyOn(questionRepository, 'getById').and.returnValue(Promise.reject());
                spyOn(sectionRepository, 'getById').and.returnValue(Promise.reject());
            });

            it('should redirect to 404', (done) => {
                viewModel.canActivate('courseId', 'sectionId', 'questionId').then((result) => {
                    expect(result).toEqual({ redirect: '404' });
                    done();
                });
            });

        });

        describe('when section does not exist', () => {
            beforeEach(() => {
                spyOn(courseRepository, 'getById').and.returnValue(Promise.resolve({}));
                spyOn(sectionRepository, 'getById').and.returnValue(Promise.reject({}));
                spyOn(questionRepository, 'getById').and.returnValue(Promise.reject());
            });

            it('should redirect to 404', (done) => {
                viewModel.canActivate('courseId', 'sectionId', 'questionId').then((result) => {
                    expect(result).toEqual({ redirect: '404' });
                    done();
                });
            });

        });

        describe('when question does not exist', () => {
            beforeEach(() => {
                spyOn(courseRepository, 'getById').and.returnValue(Promise.resolve({}));
                spyOn(sectionRepository, 'getById').and.returnValue(Promise.resolve({}));
                spyOn(questionRepository, 'getById').and.returnValue(Promise.reject());
            });

            it('should redirect to 404', (done) => {
                viewModel.canActivate('courseId', 'sectionId', 'questionId').then((result) => {
                    expect(result).toEqual({ redirect: '404' });
                    done();
                });
            });

        });

        describe('when question exists', () => {
            
            beforeEach(() => {
                spyOn(courseRepository, 'getById').and.returnValue(Promise.resolve({}));
                spyOn(sectionRepository, 'getById').and.returnValue(Promise.resolve({}));
                spyOn(questionRepository, 'getById').and.returnValue(Promise.resolve({}));
            });

            it('should return true', (done) => {
                viewModel.canActivate('courseId', 'sectionId', 'questionId').then((result) => {
                    expect(result).toEqual(true);
                    done();
                });
            });
        });
       
    });

    describe('activate:', () => {

        it('should be a function', () => {
            expect(viewModel.activate).toBeFunction();
        });

        it('should return promise', () => {
            expect(viewModel.activate('courseId', 'sectionId', 'questionId')).toBePromise();
        });

        describe('when activated without course id', () => {
            it('should reject promise', done => {
                viewModel.activate().catch(reason => {
                    expect(reason).toBeDefined();
                    done();
                });
            });
        });

        describe('when activated without section id', () => {
            it('should reject promise', done => {
                viewModel.activate('courseId').catch(reason => {
                    expect(reason).toBeDefined();
                    done();
                });
            });
        });

        describe('when activated without question id', () => {
            it('should reject promise', done => {
                viewModel.activate('courseId', 'sectionId').catch(reason => {
                    expect(reason).toBeDefined();
                    done();
                });
            });
        });

        it('should set courseId', done => (async () => {
            viewModel.courseId = null;
            viewModel.activate('courseId', 'sectionId', 'questionId');
            expect(viewModel.courseId).toEqual('courseId');
        })().then(done));

        it('should set sectionId', (done) => (async () => {
            viewModel.sectionId = null;
            viewModel.activate('courseId', 'sectionId', 'questionId');
            expect(viewModel.sectionId).toEqual('sectionId');
        })().then(done));

        it('should set questionId', (done) => (async () => {
            viewModel.questionId = null;
            viewModel.activate('courseId', 'sectionId', 'questionId');
            expect(viewModel.questionId).toEqual('questionId');
        })().then(done));

        describe('when question not found', () => {
            let getQuestionPromise;
            
            beforeEach(() => {
                getQuestionPromise = Promise.reject('reason');
                spyOn(questionRepository, 'getById').and.returnValue(getQuestionPromise);
            });

            it('should reject promise', (done) => (async () => {
                return viewModel.activate('courseId', 'sectionId', 'questionId').catch(reason => {
                    expect(reason).toBe('reason');
                });
            })().then(done));

        });

        describe('when question found', () => {
            let viewModelData = {
                viewCaption: 'caption',
                isQuestionContentNeeded: true
            };
            let getQuestionPromise;
            let initializeActiveQuestionPromise;
            let initializeLearningContentPromise;

            beforeEach(() => {
                getQuestionPromise = Promise.resolve(question);
                initializeActiveQuestionPromise = Promise.resolve(viewModelData);
                initializeLearningContentPromise = Promise.resolve();
                spyOn(questionRepository, 'getById').and.returnValue(getQuestionPromise);
                spyOn(multipleSelect, 'initialize').and.returnValue(initializeActiveQuestionPromise);
                spyOn(learningContents, 'initialize').and.returnValue(initializeLearningContentPromise);
                spyOn(feedback, 'initialize').and.returnValue(Promise.resolve());
            });

            it('should set activeQuestionViewModel', (done) =>  (async () => {
                viewModel.activeQuestionViewModel = null;
                viewModel.activate('courseId', 'sectionId', 'questionId');
                await getQuestionPromise;
                expect(viewModel.activeQuestionViewModel).not.toBeNull();
            })().then(done));

            it('should initialize activeQuestionViewModel', (done) =>  (async () => {
                viewModel.activate('courseId', 'sectionId', 'questionId');
                await getQuestionPromise;
                expect(multipleSelect.initialize).toHaveBeenCalledWith('sectionId', question);
            })().then(done));

            describe('and active question view model is initialized', () => {

                it('should set viewCaption', (done) =>  (async () => {
                    viewModel.viewCaption = null;
                    viewModel.activate('courseId', 'sectionId', 'questionId');
                    await getQuestionPromise;
                    await initializeActiveQuestionPromise;
                    expect(viewModel.viewCaption).toBe(viewModelData.viewCaption);
                })().then(done));

                it('should set questionTitle', (done) =>  (async () => {
                    viewModel.questionTitle = null;
                    viewModel.activate('courseId', 'sectionId', 'questionId');
                    await getQuestionPromise;
                    await initializeActiveQuestionPromise;
                    expect(viewModel.questionTitle).not.toBeNull();
                })().then(done));

                it('should initialize learningContents', (done) =>  (async () => {
                    viewModel.activate('courseId', 'sectionId', 'questionId');
                    await getQuestionPromise;
                    await initializeActiveQuestionPromise;
                    expect(learningContents.initialize).toHaveBeenCalledWith(question);
                })().then(done));

                it('should initialize feedback', (done) =>  (async () => {
                    viewModel.activate('courseId', 'sectionId', 'questionId');
                    await getQuestionPromise;
                    await initializeActiveQuestionPromise;
                    await initializeLearningContentPromise;
                    expect(feedback.initialize).toHaveBeenCalled();
                })().then(done));
            });

        });

    });

    describe('_changeIsSurvey:', () => {

        let promise;
        beforeEach(() => {
            promise = Promise.resolve({});
            spyOn(questionRepository, 'updateIsSurvey').and.returnValue(promise);
            viewModel.surveyModeIsChanging(false);
            spyOn(notify, 'saved');
        });

        describe('when survey mode enabled', () => {
                
            it('should disable survey mode', done => (async () => {
                viewModel.isSurvey(true);
                await viewModel.toggleIsSurvey();
                expect(viewModel.isSurvey()).toBeFalsy();
            })().then(done));

        });

        describe('and when survey mode disabled', () => {
                
            it('should disable survey mode', done => (async () => {
                viewModel.isSurvey(false);
                await viewModel.toggleIsSurvey();
                expect(viewModel.isSurvey()).toBeTruthy();
            })().then(done));

            it('should send event "Switch to the survey mode {QUESTION_TYPE}"', done => (async () => {
                viewModel.isSurvey(false);
                await viewModel.toggleIsSurvey();
                expect(eventTracker.publish)
                    .toHaveBeenCalledWith(`Switch to the survey mode (${viewModel.questionType})`);
            })().then(done));

        });

        it('should start changing survey mode', done => (async () => {
            await viewModel.toggleIsSurvey();
            expect(viewModel.surveyModeIsChanging()).toBeTruthy();
        })().then(done));

        it('should change survey mode on the server', done => (async () => {
            await viewModel.toggleIsSurvey();
            expect(questionRepository.updateIsSurvey).toHaveBeenCalledWith(viewModel.questionId, viewModel.isSurvey());
        })().then(done));

        it('should stop changing after one second', done => (async () => {
            await viewModel.toggleIsSurvey();
            _.delay(() => {
                expect(viewModel.surveyModeIsChanging()).toBeFalsy();
            }, 1000);
        })().then(done));

        it('should show notify saved after one second', done => (async () => {
            await viewModel.toggleIsSurvey();
            _.delay(() => {
                expect(notify.saved()).toHaveBeenCalled();
            }, 1000);
        })().then(done));

    });

    describe('toggleIsSurvey:', () => {
        let promise;
        beforeEach(() => {
            promise = Promise.resolve({});
            spyOn(viewModel, '_changeIsSurvey').and.returnValue(promise);
        });

        describe('when mode changing in process', () => {

            beforeEach(() => {
                viewModel.surveyModeIsChanging(true);
            });

            it('should do nothing', done => (async () => {
                await viewModel.toggleIsSurvey();
                expect(viewModel._changeIsSurvey).not.toHaveBeenCalled();
            })().then(done));

        });

        describe('when mode changing not in process', () => {

            beforeEach(() => {
                viewModel.surveyModeIsChanging(false);
            });

            it('should change survey mode', done => (async () => {
                await viewModel.toggleIsSurvey();
                expect(viewModel._changeIsSurvey).toHaveBeenCalled();
            })().then(done));

        });
    });

    describe('back:', () => {

        it('should be function', () => {
            expect(viewModel.back).toBeFunction();
        });

        it('should redirect to section within course', () => {
            viewModel.courseId = 'courseId';
            viewModel.sectionId = 'sectionId';
            viewModel.back();
            expect(router.navigate).toHaveBeenCalledWith('#courses/courseId/sections/sectionId');
        });
    });

    describe('titleUpdatedByCollaborator:', () => {

        it('should be function', () => {
            expect(viewModel.titleUpdatedByCollaborator).toBeFunction();
        });

        beforeEach(() => {
            viewModel.questionTitle = vmQuestionTitle('sectionId', question);
        });

        describe('when question is not current question', () => {

            it('should not update text', () => {
                viewModel.questionTitle.text('');
                viewModel.titleUpdatedByCollaborator({ id: '3333', title: 'new title' });
                expect(viewModel.questionTitle.text()).toBe('');
            });

        });

        describe('when is editing title', () => {

            it('should not update title', () => {
                viewModel.questionTitle.text('');
                viewModel.questionTitle.text.isEditing(true);
                viewModel.titleUpdatedByCollaborator(question);
                expect(viewModel.questionTitle.text()).toBe('');
            });

        });

        it('should update text', () => {
            viewModel.questionTitle.text.isEditing(false);
            viewModel.questionId = question.id;
            var newTitle = 'new';

            viewModel.questionTitle.text('');
            viewModel.titleUpdatedByCollaborator({ id: question.id, title: newTitle });
            expect(viewModel.questionTitle.text()).toBe(newTitle);
        });

    });

    describe('contentUpdatedByCollaborator:', () => {

        it('should be function', () => {
            expect(viewModel.contentUpdatedByCollaborator).toBeFunction();
        });

        beforeEach(() => {
            viewModel.questionContent = vmContentField(question.content);
            viewModel.questionId = question.id;
        });

        describe('when is not current question', () => {
            it('should not update content', () => {
                viewModel.questionId = 'qqq';
                viewModel.questionContent.text('');
                viewModel.contentUpdatedByCollaborator(question);
                expect(viewModel.questionContent.text()).toBe('');
            });
        });

        describe('when is editing content', () => {
            it('should update original content', () => {
                viewModel.questionContent.originalText('');
                viewModel.questionContent.isEditing(true);
                viewModel.contentUpdatedByCollaborator(question);
                expect(viewModel.questionContent.originalText()).toBe(question.content);
            });

            it('should not update content', () => {
                viewModel.questionContent.text('');
                viewModel.questionContent.isEditing(true);
                viewModel.contentUpdatedByCollaborator(question);
                expect(viewModel.questionContent.text()).toBe('');
            });
        });

        it('should update original content', () => {
            viewModel.questionContent.originalText('');
            viewModel.questionContent.isEditing(false);
            viewModel.contentUpdatedByCollaborator(question);
            expect(viewModel.questionContent.originalText()).toBe(question.content);
        });

        it('should update content', () => {
            viewModel.questionContent.text('');
            viewModel.questionContent.isEditing(false);
            viewModel.contentUpdatedByCollaborator(question);
            expect(viewModel.questionContent.text()).toBe(question.content);
        });
    });

    describe('showMoveCopyDialog:', () => {

        it('should be function', () => {
            expect(viewModel.showMoveCopyDialog).toBeFunction();
        });

        it('should open move/copy question dialog', () => {
            viewModel.courseId = '1';
            viewModel.sectionId = '2';
            viewModel.questionId = '3';
            viewModel.isContent = false;
            viewModel.showMoveCopyDialog();
            expect(moveCopyDialog.show).toHaveBeenCalledWith(viewModel.courseId, viewModel.sectionId, viewModel.questionId, viewModel.isContent);
        });

    });

    describe('duplicateQuestion:', () => {
        let duplicateQuestionPromise;

        beforeEach(() => {
            viewModel.sectionId = 'sectionId';
            viewModel.questionId = 'questionId';
            duplicateQuestionPromise = Promise.resolve({ id: 'newQuestionId' });
            spyOn(questionRepository, 'copyQuestion').and.returnValue(duplicateQuestionPromise);
        });

        it('should be function', () => {
            expect(viewModel.duplicateQuestion).toBeFunction();
        });

        it('should publish event \'Duplicate item\'', () => {
            viewModel.duplicateQuestion();
            expect(eventTracker.publish).toHaveBeenCalledWith('Duplicate item');
        });

        it('should send response to server', () => {
            viewModel.duplicateQuestion();
            expect(questionRepository.copyQuestion).toHaveBeenCalledWith(viewModel.questionId, viewModel.sectionId);
        });


        it('should navigate to new question', (done) => (async () => {
            viewModel.duplicateQuestion();
            await duplicateQuestionPromise;
            expect(router.navigate).toHaveBeenCalledWith(`courses/${viewModel.courseId}/sections/${viewModel.sectionId}/questions/newQuestionId`);
        })().then(done));

    });

});
