import viewModel from 'editor/questions/questionModalView';
import modalView from 'widgets/modalView/viewmodel';
import navigationPanel from 'editor/questions/panels/questionsNavigationView';
import questionViewModel from 'editor/questions/question';
import router from 'routing/router';
import eventTracker from 'eventTracker';
import httpRequestTracker from 'http/httpRequestTracker';

let courseId = 'courseId';
let sectionId = 'sectionId';
let questionId = 'questionId';

describe('viewmodel [questionModalView]', () => {
    beforeEach(() => {
        spyOn(eventTracker, 'publish');
    });

    describe('initialize:', () => {
        let navigationInit;

        beforeEach(() => {
            navigationInit = Promise.resolve();
            spyOn(modalView, 'initialize');
            spyOn(navigationPanel, 'initialize').and.returnValue(navigationInit);
        });

        it('should be function', () => {
            expect(viewModel.initialize).toBeFunction();
        });

        it('should set courseId', () => {
            viewModel.courseId = null;
            viewModel.initialize(courseId);
            expect(viewModel.courseId).toBe(courseId);
        });

        it('should initialize navigation panel', () => {
            viewModel.initialize(courseId);
            expect(navigationPanel.initialize).toHaveBeenCalledWith(courseId);
        });

        it('should initialize modalView', done => (async () => {
            viewModel.initialize(courseId);
            await navigationInit;
            expect(modalView.initialize).toHaveBeenCalledWith(viewModel);
        })().then(done));

    });

    describe('open:', () => {
        let questionViewModelActivated;

        beforeEach(() => {
            viewModel.courseId = courseId;
            spyOn(modalView, 'open');
            spyOn(modalView, 'close');
            spyOn(navigationPanel, 'activate');
            questionViewModelActivated = Promise.resolve();
            spyOn(questionViewModel, 'activate').and.returnValue(questionViewModelActivated);
            spyOn(httpRequestTracker, 'waitForRequestFinalization').and.returnValue(Promise.resolve());
        });

        it('should be function', () => {
            expect(viewModel.open).toBeFunction();
        });

        describe('when arguments not set', () => {
            it('should close modalView', () => {
                viewModel.open();
                expect(modalView.close).toHaveBeenCalled();
            });    
        });

        it('should set isLoading to true', () => {
            viewModel.isLoading(false);
            viewModel.open(sectionId, questionId);
            expect(viewModel.isLoading()).toBeTruthy();
        });

        it('should wait for requests finalization', () => {
            viewModel.open(sectionId, questionId);
            expect(httpRequestTracker.waitForRequestFinalization).toHaveBeenCalled();
        });

        describe('when requests finalized', () => {
            it('should set sectionId', done => (async () => {
                viewModel.sectionId = null;
                await viewModel.open(sectionId, questionId);
                expect(viewModel.sectionId).toBe(sectionId);
            })().then(done));

            it('should set questionId', done => (async () => {
                viewModel.questionId = null;
                await viewModel.open(sectionId, questionId);
                expect(viewModel.questionId).toBe(questionId);
            })().then(done));

            it('should set question view ready to false', done => (async () => {
                viewModel.isQuestionViewReady(null);
                await viewModel.open(sectionId, questionId);
                expect(viewModel.isQuestionViewReady()).toBeFalsy();
            })().then(done));

            it('should set question view ready to false', done => (async () => {
                await viewModel.open(sectionId, questionId);
                expect(viewModel.navigationPanel.activate).toHaveBeenCalledWith(sectionId, questionId);
            })().then(done));

            it('should activate navigation panel', done => (async () => {
                await viewModel.open(sectionId, questionId);
                expect(viewModel.navigationPanel.activate).toHaveBeenCalledWith(sectionId, questionId);
            })().then(done));

            it('should activate question view model', done => (async () => {
                await viewModel.open(sectionId, questionId);
                expect(questionViewModel.activate).toHaveBeenCalledWith(courseId, sectionId, questionId);
            })().then(done));

            it('should open modal view', done => (async () => {
                await viewModel.open(sectionId, questionId);
                expect(modalView.open).toHaveBeenCalled();
            })().then(done));

            it('should set isLoading to false', done => (async () => {
                viewModel.isLoading(true);
                await viewModel.open(sectionId, questionId);
                expect(viewModel.isLoading()).toBeFalsy();
            })().then(done));
        });

        describe('when question view model activated', () => {
            it('should set question view model', done => (async () => {
                viewModel.questionViewModel(null);
                await viewModel.open(sectionId, questionId);
                expect(viewModel.questionViewModel()).toBe(questionViewModel);
            })().then(done));

        });
    });

    describe('close:', () => {
        beforeEach(() => {
            spyOn(router, 'navigate');
            spyOn(modalView, 'close');
        });

        it('should be function', () => {
            expect(viewModel.close).toBeFunction();
        });

        it('should close modalView', () => {
            viewModel.close();
            expect(modalView.close).toHaveBeenCalled();
        });
    });

    describe('toggleExpandLeftPanel:', () => {
        it('should be function', () => {
            expect(viewModel.toggleExpandLeftPanel).toBeFunction();
        });

        describe('when panel is expanded', () => {
            it('should collapse panel', () => {
                viewModel.isLeftPanelExpanded(true);
                viewModel.toggleExpandLeftPanel();
                expect(viewModel.isLeftPanelExpanded()).toBeFalsy();
            });
        });

        describe('when panel is collapsed', () => {
            it('should expand panel', () => {
                viewModel.isLeftPanelExpanded(false);
                viewModel.toggleExpandLeftPanel();
                expect(viewModel.isLeftPanelExpanded()).toBeTruthy();
            });
        });
    });

    describe('onQuestionViewCompositionComplete:', () => {
        it('should be function', () => {
            expect(viewModel.onQuestionViewCompositionComplete).toBeFunction();
        });

        it('should set question view ready to true', () => {
            viewModel.isQuestionViewReady(null);
            viewModel.onQuestionViewCompositionComplete();
            expect(viewModel.isQuestionViewReady()).toBeTruthy();
        });
    });

    describe('previewCourse:', () => {
        beforeEach(() => {
            spyOn(router, 'openUrl');
        });

        it('should be function', () => {
            expect(viewModel.previewCourse).toBeFunction();
        });

        it('should publish event', () => {
            viewModel.previewCourse();
            expect(eventTracker.publish).toHaveBeenCalledWith('Preview course');
        });

        it('should open preview course url', () => {
            viewModel.courseId = courseId;
            viewModel.previewCourse();
            expect(router.openUrl).toHaveBeenCalledWith('/preview/courseId');
        });
    });

});