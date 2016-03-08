import viewModel from 'editor/questions/questionModalView';
import modalView from 'widgets/modalView/viewmodel';
import navigationPanel from 'editor/questions/panels/questionsNavigationView';
import questionViewModel from 'editor/questions/question';
import router from 'plugins/router';

let courseId = 'courseId';
let sectionId = 'sectionId';
let questionId = 'questionId';

describe('viewmodel [questionModalView]', () => {
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

        it('should set sectionId', () => {
            viewModel.sectionId = null;
            viewModel.open(sectionId, questionId);
            expect(viewModel.sectionId).toBe(sectionId);
        });

        it('should set questionId', () => {
            viewModel.questionId = null;
            viewModel.open(sectionId, questionId);
            expect(viewModel.questionId).toBe(questionId);
        });

        it('should set question view ready to false', () => {
            viewModel.isQuestionViewReady(null);
            viewModel.open(sectionId, questionId);
            expect(viewModel.isQuestionViewReady()).toBeFalsy();
        });

        it('should activate navigation panel', () => {
            viewModel.open(sectionId, questionId);
            expect(viewModel.navigationPanel.activate).toHaveBeenCalledWith(sectionId, questionId);
        });

        it('should activate question view model', () => {
            viewModel.open(sectionId, questionId);
            expect(questionViewModel.activate).toHaveBeenCalledWith(courseId, sectionId, questionId);
        });

        describe('when question view model activated', () => {
            it('should set question view model', done => (async () => {
                viewModel.questionViewModel(null);
                viewModel.open(sectionId, questionId);
                await questionViewModelActivated;
                expect(viewModel.questionViewModel()).toBe(questionViewModel);
            })().then(done));

            it('should open modal view', done => (async () => {
                viewModel.open(sectionId, questionId);
                await questionViewModelActivated;
                expect(modalView.open).toHaveBeenCalled();
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

        it('should navigate to course', () => {
            viewModel.courseId = courseId;
            viewModel.close();
            expect(router.navigate).toHaveBeenCalledWith(`#courses/${courseId}`);
        });
    });

    describe('toggleExpandNavigationPanel', () => {
        it('should be function', () => {
            expect(viewModel.toggleExpandNavigationPanel).toBeFunction();
        });

        describe('when panel is expanded', () => {
            it('should collapse panel', () => {
                viewModel.isNavigationPanelExpanded(true);
                viewModel.toggleExpandNavigationPanel();
                expect(viewModel.isNavigationPanelExpanded()).toBeFalsy();
            });
        });

        describe('when panel is collapsed', () => {
            it('should expand panel', () => {
                viewModel.isNavigationPanelExpanded(false);
                viewModel.toggleExpandNavigationPanel();
                expect(viewModel.isNavigationPanelExpanded()).toBeTruthy();
            });
        });
    });

    describe('onQuestionViewCompositionComplete', () => {
        it('should be function', () => {
            expect(viewModel.onQuestionViewCompositionComplete).toBeFunction();
        });

        it('should set question view ready to true', () => {
            viewModel.isQuestionViewReady(null);
            viewModel.onQuestionViewCompositionComplete();
            expect(viewModel.isQuestionViewReady()).toBeTruthy();
        });
    });

});