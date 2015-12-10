import QuestionViewModel from './QuestionViewModel';
import router from 'plugins/router';

describe('[QuestionViewModel]', () => {
    let questionViewModel;
    let courseId;
    let sectionId;
    let question;
    let isProcessed;

    beforeEach(() => {
        courseId = 'courseId';
        sectionId = 'sectionId';
        question = {
            id: 'questionId',
            title: 'questionTitle',
            type: 'questionType'
        };
        isProcessed = true;
        questionViewModel = new QuestionViewModel(courseId, sectionId, question, isProcessed);
    });

    it('should initialize fields', () => {
        expect(questionViewModel.courseId).toBe(courseId);
        expect(questionViewModel.sectionId).toBe(sectionId);
        expect(questionViewModel.id()).toBe(question.id);
        expect(questionViewModel.title()).toBe(question.title);
        expect(questionViewModel.type()).toBe(question.type);
        expect(questionViewModel.canBeDeleted()).toBeFalsy();
        expect(questionViewModel.isProcessed()).toBeTruthy();
        expect(questionViewModel.updateFields).toBeFunction();
        expect(questionViewModel.markToDelete).toBeFunction();
        expect(questionViewModel.cancel).toBeFunction();
        expect(questionViewModel.openQuestion).toBeFunction();
    });

    describe('updateFields:', () => {

        it('should update question viewmodel fields', () => {
            let updatedQuestion = {
                id: 'newQuestionId',
                title: 'newQuestionTitle',
                type: 'newQuestionType'
            };
            questionViewModel.updateFields(updatedQuestion);
            expect(questionViewModel.id()).toBe(updatedQuestion.id);
            expect(questionViewModel.title()).toBe(updatedQuestion.title);
            expect(questionViewModel.type()).toBe(updatedQuestion.type);
            expect(questionViewModel.isProcessed()).toBeFalsy();
        });

    });

    describe('markToDelete:', () => {

        it('should mark question to delete', () => {
            questionViewModel.canBeDeleted(false);
            questionViewModel.markToDelete();
            expect(questionViewModel.canBeDeleted()).toBeTruthy();
        });

    });

    describe('cancel:', () => {

        it('should unmark question to delete', () => {
            questionViewModel.canBeDeleted(true);
            questionViewModel.cancel();
            expect(questionViewModel.canBeDeleted()).toBeFalsy();
        });

    });

    describe('openQuestion:', () => {

        beforeEach(() => {
            spyOn(router, 'navigate');
        });

        it('should navigate to question', () => {
            questionViewModel.openQuestion();
            expect(router.navigate).toHaveBeenCalledWith(`#courses/${questionViewModel.courseId}/objectives/${questionViewModel.sectionId}/questions/${questionViewModel.id()}`);
        });
        
    });
});