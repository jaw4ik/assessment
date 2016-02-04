import viewModel from './rankingText.js';
import localizationManager from 'localization/localizationManager.js';
import * as getAnswers from './queries/getAnswers.js';
import * as addAnswerCommand from './commands/addAnswer.js';
import * as deleteAnswerCommand from './commands/deleteAnswer.js';
import * as updateAnswerTextCommand from './commands/updateAnswerText.js';
import * as updateAnswersOrderCommand from './commands/updateAnswersOrder.js';
import notify from 'notify.js';
import constants from 'constants';
import app from 'durandal/app';
import eventTracker from 'eventTracker';
import RankingTextAnswer from './rankingTextAnswer.js';

describe('question [rankingText]', () => {
    let objectiveId = 'objectiveId',
        question = { id: 'id'},
        error = 'error';

    beforeEach(() => {
        spyOn(eventTracker, 'publish');
        spyOn(notify, 'saved');
        spyOn(notify, 'error');
        spyOn(app, 'on');
        spyOn(localizationManager, 'localize').and.callFake(function (arg) {
            return arg;
        });
    });

    describe('initialize:', () => {
        
        it('should set questionId', () => {
            spyOn(getAnswers, 'execute').and.returnValue(Promise.resolve());
            viewModel.initialize(objectiveId, question);
            expect(viewModel.questionId).toBe(question.id);
        });

        it('should get answers from server', () => {
            spyOn(getAnswers, 'execute').and.returnValue(Promise.resolve());
            viewModel.initialize(objectiveId, question);
            expect(getAnswers.execute).toHaveBeenCalledWith(question.id);
        });

        describe('when promise is resolved', () => {
            let answer = {Id: 'id', Text: 'text'},
                answers = [answer];
            
            beforeEach(() => {
                spyOn(getAnswers, 'execute').and.returnValue(Promise.resolve(answers));
            });

            it('should set answers', (done) => {
                viewModel.answers([]);

                viewModel.initialize(objectiveId, question).then(() => {
                    expect(viewModel.answers().length).toBe(1);
                    expect(viewModel.answers()[0].id).toBe(answer.Id);
                    expect(viewModel.answers()[0].text()).toBe(answer.Text);
                    done();
                });
            });

            it('should return object with viewCaption', (done) => {
                viewModel.initialize(objectiveId, question).then((result) => {
                    expect(result.viewCaption).toBe('rankingTextEditor');
                    done();
                });
            });

            it('should return object with hasQuestionView set to true', (done) => {
                viewModel.initialize(objectiveId, question).then((result) => {
                    expect(result.hasQuestionView).toBeTruthy();
                    done();
                });
            });

            it('should return object with hasQuestionContent set to true', (done) => {
                viewModel.initialize(objectiveId, question).then((result) => {
                    expect(result.hasQuestionContent).toBeTruthy();
                    done();
                });
            });

            it('should return object with hasFeedback set to true', (done) => {
                viewModel.initialize(objectiveId, question).then((result) => {
                    expect(result.hasFeedback).toBeTruthy();
                    done();
                });
            });
        });

        describe('when promise is rejected', () => {
            beforeEach(() => {
                spyOn(getAnswers, 'execute').and.returnValue(Promise.reject(error));
            });

            it('should show error notification', (done) => {
                viewModel.initialize(objectiveId, question).then(() => {
                    expect(notify.error).toHaveBeenCalledWith('failedToGetRankingItems');
                    done();
                });
            });
        });
    });

    describe('toggleExpand:', () => {
        it('should toggle isExpanded', () => {
            viewModel.isExpanded(true);
            viewModel.toggleExpand();
            expect(viewModel.isExpanded()).toBeFalsy();
        });
    });

    describe('beginEditText:', () => {
        it('should set isEditing to true', () => {
            let answer = { text: { isEditing: ko.observable(false) } };
            viewModel.beginEditText(answer);
            expect(answer.text.isEditing()).toBeTruthy();
        });
    });

    describe('endEditText:', () => {
        let answer;

        beforeEach(() => {
            answer = new RankingTextAnswer('id', 'text');
            answer.isDeleted = false;
        });

        describe('when answer is deleted', () => {
            it('should remove answer from viewModel', () => {
                answer.isDeleted = true;
                viewModel.answers([answer]);
                viewModel.endEditText(answer);
                expect(viewModel.answers().length).toBe(0);
            });
        });

        it('should set to text trimmed value', () => {
            answer.text('         text             ');
            viewModel.endEditText(answer);
            expect(answer.text()).toBe('text');
        });

        it('should set isEditing to false', () => {
            answer.text.isEditing(true);
            viewModel.endEditText(answer);
            expect(answer.text.isEditing()).toBeFalsy();
        });

        describe('when text is changed', () => {
            let oldText = 'old text',
                newText = 'new text';

            beforeEach(() => {
                answer.text.original = oldText;
                answer.text(newText);
            });

            it('should update text on server', (done) => {
                spyOn(updateAnswerTextCommand, 'execute').and.returnValue(Promise.resolve());
                viewModel.endEditText(answer);
                expect(updateAnswerTextCommand.execute).toHaveBeenCalledWith(answer.id, answer.text());
                done();
            });

            describe('when text is updated', () => {
                beforeEach(() => {
                    spyOn(updateAnswerTextCommand, 'execute').and.returnValue(Promise.resolve());
                });

                it('should update original to text', (done) => {
                    viewModel.endEditText(answer).then(() => {
                        expect(answer.text.original).toBe(newText);
                        done();
                    });
                });

                it('should show notify saved', (done) => {
                    viewModel.endEditText(answer).then(() => {
                        expect(notify.saved).toHaveBeenCalled();
                        done();
                    });
                });
            });

            describe('when text is not updated', () => {
                beforeEach(() => {
                    spyOn(updateAnswerTextCommand, 'execute').and.returnValue(Promise.reject(error));
                });

                it('should update text to original', (done) => {
                    viewModel.endEditText(answer).then(() => {
                        expect(answer.text()).toBe(oldText);
                        done();
                    });
                });

                it('should show notify error', (done) => {
                    viewModel.endEditText(answer).then(() => {
                        expect(notify.error).toHaveBeenCalledWith('failedToUpdateTextRankingItem');
                        done();
                    });
                });
            });
        });
    });

    describe('removeAnswer:', () => {
        let answer;

        beforeEach(() => {
            answer = new RankingTextAnswer('id', 'text');
            viewModel.questionId = question.id;
            viewModel.answers([answer]);
        });

        it('should publish event', () => {
            spyOn(deleteAnswerCommand, 'execute').and.returnValue(Promise.resolve());
            viewModel.removeAnswer(answer);
            expect(eventTracker.publish).toHaveBeenCalledWith('Delete ranking item');
        });

        it('should delete answer from server', () => {
            spyOn(deleteAnswerCommand, 'execute').and.returnValue(Promise.resolve());
            viewModel.removeAnswer(answer);
            expect(deleteAnswerCommand.execute).toHaveBeenCalledWith(question.id, answer.id);
        });

        describe('when answer is deleted', () => {
            it('should delete it from viewModel', (done) => {
                spyOn(deleteAnswerCommand, 'execute').and.returnValue(Promise.resolve());
                viewModel.removeAnswer(answer).then(() => {
                    expect(viewModel.answers().length).toBe(0);
                    done();
                });
            });

            it('should show saved notification', (done) => {
                spyOn(deleteAnswerCommand, 'execute').and.returnValue(Promise.resolve());
                viewModel.removeAnswer(answer).then(() => {
                    expect(notify.saved).toHaveBeenCalled();
                    done();
                });
            });
        });

        describe('when answer is not deleted', () => {
            it('should show error notification', (done) => {
                spyOn(deleteAnswerCommand, 'execute').and.returnValue(Promise.reject(error));
                viewModel.removeAnswer(answer).then(() => {
                    expect(notify.error).toHaveBeenCalledWith('failedToRemoveRankingItem');
                    done();
                });
            });
        });
    });

    describe('addAnswer:', () => {
        beforeEach(() => {
            viewModel.questionId = question.id;
        });

        it('should publish event', () => {
            spyOn(addAnswerCommand, 'execute').and.returnValue(Promise.resolve());
            viewModel.addAnswer();
            expect(eventTracker.publish).toHaveBeenCalledWith('Add ranking item');
        });

        it('should add answer on server', () => {
            spyOn(addAnswerCommand, 'execute').and.returnValue(Promise.resolve());
            viewModel.addAnswer();
            expect(addAnswerCommand.execute).toHaveBeenCalledWith(question.id);
        });

        describe('when answer is added', () => {
            let answer = {Id: 'id', Text: 'text'};

            beforeEach(() => {
                viewModel.answers([]);
                spyOn(addAnswerCommand, 'execute').and.returnValue(Promise.resolve(answer));
            });

            it('should add it to viewModel', (done) => {
                viewModel.addAnswer().then(() => {
                    expect(viewModel.answers().length).toBe(1);
                    expect(viewModel.answers()[0].id).toBe(answer.Id);
                    expect(viewModel.answers()[0].text()).toBe(answer.Text);
                    done();
                });
            });

            it('should set isEditing to true', (done) => {
                viewModel.addAnswer().then(() => {
                    expect(viewModel.answers()[0].text.isEditing()).toBeTruthy();
                    done();
                });
            });

            it('should show saved notification', (done) => {
                viewModel.addAnswer().then(() => {
                    expect(notify.saved).toHaveBeenCalled();
                    done();
                });
            });
        });

        describe('when answer is not added', () => {
            it('should show error notification', (done) => {
                spyOn(addAnswerCommand, 'execute').and.returnValue(Promise.reject(error));
                viewModel.addAnswer().then(() => {
                    expect(notify.error).toHaveBeenCalledWith('failedToAddRankingItem');
                    done();
                });
            });
        });
    });

    describe('reorderAnswer:', () => {
        let current, next;

        beforeEach(() => {
            viewModel.questionId = question.id;
            current = new RankingTextAnswer('id1', 'text current');
            next = new RankingTextAnswer('id2', 'text next');
        });

        it('should publish event', () => {
            spyOn(updateAnswersOrderCommand, 'execute').and.returnValue(Promise.resolve());
            viewModel.reorderAnswer(current, next);
            expect(eventTracker.publish).toHaveBeenCalledWith('Change order of ranking items');
        });

        describe('when next id is present', () => {
            it('should insert current before next', () => {
                spyOn(updateAnswersOrderCommand, 'execute').and.returnValue(Promise.resolve());
                viewModel.answers([next, current]);

                viewModel.reorderAnswer(current, next);
                expect(viewModel.answers()[0]).toBe(current);
            });
        });

        describe('when next id is not present', () => {
            it('should add current to the end', () => {
                spyOn(updateAnswersOrderCommand, 'execute').and.returnValue(Promise.resolve());
                viewModel.answers([current, next]);

                viewModel.reorderAnswer(current);

                expect(viewModel.answers()[0]).toBe(next);
                expect(viewModel.answers()[1]).toBe(current);
            });
        });

        it('should update order on server', () => {
            spyOn(updateAnswersOrderCommand, 'execute').and.returnValue(Promise.resolve());
            viewModel.answers([current, next]);

            viewModel.reorderAnswer(current);
            expect(updateAnswersOrderCommand.execute).toHaveBeenCalledWith(question.id, viewModel.answers());
        });

        describe('when order is updated', () => {
            it('should show saved notification', (done) => {
                spyOn(updateAnswersOrderCommand, 'execute').and.returnValue(Promise.resolve());
                viewModel.answers([current, next]);

                viewModel.reorderAnswer(current).then(() => {
                    expect(notify.saved).toHaveBeenCalled();
                    done();
                });
            });
        });

        describe('when order is not updated', () => {
            it('should show error notification', (done) => {
                spyOn(updateAnswersOrderCommand, 'execute').and.returnValue(Promise.reject(error));
                viewModel.answers([current, next]);

                viewModel.reorderAnswer(current).then(() => {
                    expect(notify.error).toHaveBeenCalledWith('failedToReorderRankingItems');
                    done();
                });
            });
        });
    });

    describe('answerCreatedByCollaborator:', () => {
        let answer = { id: 'id', text: 'text'};

        beforeEach(() => {
            viewModel.questionId = question.id;
        });

        describe('when questionId is current questionId', () => {
            it('should add answer to viewModel', () => {
                viewModel.answers([]);
                viewModel.answerCreatedByCollaborator(question.id, answer.id, answer.text);
                
                expect(viewModel.answers().length).toBe(1);
                expect(viewModel.answers()[0].id).toBe(answer.id);
                expect(viewModel.answers()[0].text()).toBe(answer.text);
            });
        });

        describe('when questionId is not current questionId', () => {
            it('should not add answer to viewModel', () => {
                viewModel.answers([]);
                viewModel.answerCreatedByCollaborator('someId', answer.id, answer.text);
                
                expect(viewModel.answers().length).toBe(0);
            });
        });
    });

    describe('answerDeletedByCollaborator:', () => {
        let answer;

        beforeEach(() => {
            answer = new RankingTextAnswer('id', 'text');
            viewModel.answers([answer]);
            viewModel.questionId = question.id;
        });

        describe('when answer is not in edit', () => {
            it('should remove it from viewModel', () => {
                answer.text.isEditing(false);
                viewModel.answerDeletedByCollaborator(question.id, answer.id);
                expect(viewModel.answers().length).toBe(0);
            });
        });

        describe('when answer is in edit', () => {
            it('should not delete it from viewModel', () => {
                answer.text.isEditing(true);
                viewModel.answerDeletedByCollaborator(question.id, answer.id);
                expect(viewModel.answers().length).toBe(1);
            });

            it('should mark it as deleted', () => {
                answer.text.isEditing(true);
                viewModel.answerDeletedByCollaborator(question.id, answer.id);
                expect(answer.isDeleted).toBeTruthy();
            });

            it('should show error notification', () => {
                answer.text.isEditing(true);
                viewModel.answerDeletedByCollaborator(question.id, answer.id);
                expect(notify.error).toHaveBeenCalledWith('answerOptionHasBeenDeletedByCollaborator');
            });
        });
    });

    describe('answerTextChangedByCollaborator:', () => {
        let answer, 
            newText = 'new text';

        beforeEach(() => {
            answer = new RankingTextAnswer('id', 'text');
            viewModel.answers([answer]);
            viewModel.questionId = question.id;
        });

        it('should update answer original text', () => {
            viewModel.answerTextChangedByCollaborator(question.id, answer.id, newText);
            expect(answer.text.original).toBe(newText);
        });

        describe('when answer is not edited', () => {
            it('should update text', () => {
                answer.text.isEditing(false);
                viewModel.answerTextChangedByCollaborator(question.id, answer.id, newText);
                expect(answer.text()).toBe(newText);
            });
        });

        describe('when answer is edited', () => {
            it('should not update text', () => {
                answer.text.isEditing(true);
                viewModel.answerTextChangedByCollaborator(question.id, answer.id, newText);
                expect(answer.text()).toBe('text');
            }); 
        });
    });

    describe('answersReorderedByCollaborator:', () => {
        let answer1, answer2;

        beforeEach(() => {
            answer1 = new RankingTextAnswer('id1', 'text1');
            answer2 = new RankingTextAnswer('id2', 'text2');
            viewModel.answers([answer1, answer2]);
            viewModel.questionId = question.id;
        });

        describe('when question id is current', () => {
            it('should reorder answers in viewModel', () => {
                viewModel.answersReorderedByCollaborator(question.id, [answer2.id, answer1.id]);
                expect(viewModel.answers()[0]).toBe(answer2);
                expect(viewModel.answers()[1]).toBe(answer1);
            });    
        });

        describe('when question id is not current', () => {
            it('should not reorder answers in viewModel', () => {
                viewModel.answersReorderedByCollaborator('someId', [answer2.id, answer1.id]);
                expect(viewModel.answers()[0]).toBe(answer1);
                expect(viewModel.answers()[1]).toBe(answer2);
            });
        });
        
    });
});