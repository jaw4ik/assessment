import QuestionViewModel from './QuestionViewModel';
import router from 'plugins/router';
import constants from 'constants';
import notify from 'notify';
import eventTracker from 'eventTracker';
import updateQuestionTitleCommand from '../commands/updateQuestionTitleCommand';

describe('[QuestionViewModel]', () => {
    let questionViewModel;
    let courseId;
    let sectionId;
    let question;
    let isProcessed;
    let justCreated;

    beforeEach(() => {
        courseId = 'courseId';
        sectionId = 'sectionId';
        question = {
            id: 'questionId',
            title: 'questionTitle',
            type: 'questionType'
        };
        isProcessed = true;
        justCreated = false;
        questionViewModel = new QuestionViewModel(courseId, sectionId, question, isProcessed, justCreated);
        spyOn(eventTracker, 'publish');
        spyOn(notify, 'saved');
    });

    it('should initialize fields', () => {
        expect(questionViewModel.courseId).toBe(courseId);
        expect(questionViewModel.sectionId).toBe(sectionId);
        expect(questionViewModel.id()).toBe(question.id);
        expect(questionViewModel.title()).toBe(question.title);
        expect(questionViewModel.originalTitle).toBe(question.title);
        expect(questionViewModel.title.isEditing()).toBeFalsy();
        expect(questionViewModel.title.isSelected()).toBeFalsy();
        expect(questionViewModel.title.maxLength).toEqual(constants.validation.questionTitleMaxLength);
        expect(questionViewModel.startEditingTitle).toBeFunction();
        expect(questionViewModel.stopEditingTitle).toBeFunction();
        expect(questionViewModel.type()).toBe(question.type);
        expect(questionViewModel.canBeDeleted()).toBeFalsy();
        expect(questionViewModel.isProcessed()).toBeTruthy();
        expect(questionViewModel.updateFields).toBeFunction();
        expect(questionViewModel.markToDelete).toBeFunction();
        expect(questionViewModel.cancel).toBeFunction();
        expect(questionViewModel.openQuestion).toBeFunction();
        expect(questionViewModel.justCreated()).toBeFalsy();
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

        describe('when question is just created', () =>{
        
            it('should start editing title', () => {
                let newQuestionViewModel = new QuestionViewModel(courseId, sectionId, question, isProcessed, true);
                expect(newQuestionViewModel.title.isEditing).toBeTruthy();
            });

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

    describe('startEditingTitle', () => {
        
        it('should start editing title', () => {
            questionViewModel.title.isEditing(false);
            questionViewModel.startEditingTitle();
            expect(questionViewModel.title.isEditing()).toBeTruthy();
        });

    });

    describe('stopEditingTitle', () => {

        it('should stop edit title', () => {
            questionViewModel.title.isEditing(true);
            questionViewModel.stopEditingTitle();
            expect(questionViewModel.title.isEditing()).toBeFalsy();
        });

        describe('when title is not valid', () => {
            
            it('should return previous title', () => {
                questionViewModel.title('Test title Test title Test title Test title Test title Test title Test title Test title Test title Test title Test title Test title Test title Test title Test title Test title Test title Test title Test title Test title Test title Test title Test title Test title Test title Test title Test title Test title Test title ');
                questionViewModel.stopEditingTitle();
                expect(questionViewModel.title()).toBe(questionViewModel.originalTitle);
            });

        });

        describe('when title is valid', () => {

            beforeEach(() => {
                spyOn(updateQuestionTitleCommand, 'execute');
            });

            it('should call update title command', () => {
                questionViewModel.title('new section title');
                questionViewModel.stopEditingTitle();
                expect(updateQuestionTitleCommand.execute).toHaveBeenCalledWith(questionViewModel.id(), questionViewModel.title());
            });

            it('should update originalTitle', done => (async () => {
                questionViewModel.title('new section title');
                questionViewModel.originalTitle = 'das';
                await questionViewModel.stopEditingTitle();
                expect(questionViewModel.originalTitle).toBe(questionViewModel.title());
            })().then(done));

            it('should call notify saved', done => (async () => {
                questionViewModel.title('new section title');
                await questionViewModel.stopEditingTitle();
                expect(notify.saved).toHaveBeenCalled();
            })().then(done));

        });
        
    });
 
});