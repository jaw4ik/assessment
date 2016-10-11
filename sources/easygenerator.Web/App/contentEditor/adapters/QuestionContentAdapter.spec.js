import QuestionContentAdapter from './QuestionContentAdapter';

import app from 'durandal/app';
import constants from 'constants';
import repository from 'repositories/learningContentRepository';

describe('[QuestionContentAdapter]', () => {

    it('should throw exception when questionId not defined', () => {
        expect(() => new QuestionContentAdapter()).toThrow();
    });

    it('should subscribe to events', () => {
        spyOn(app, 'on');
        new QuestionContentAdapter('someId');
        expect(app.on).toHaveBeenCalledWith(constants.messages.question.learningContent.createdByCollaborator, jasmine.any(Function));
        expect(app.on).toHaveBeenCalledWith(constants.messages.question.learningContent.deletedByCollaborator, jasmine.any(Function));
        expect(app.on).toHaveBeenCalledWith(constants.messages.question.learningContent.updatedByCollaborator, jasmine.any(Function));
    });

    let questionContentAdapter, questionId = '100';
    beforeEach(() => {
        questionContentAdapter = new QuestionContentAdapter(questionId);
    });

    describe('questionId:', () => {

        it('should be setted by constructor', () => {
            expect(questionContentAdapter.questionId).toBe(questionId);
        });

    });

    describe('getContentsList:', () => {

        it('should call repository.getCollection and return collection from it', done => (async () => {
            let collection = [1, 2, 3];
            spyOn(repository, 'getCollection').and.returnValue(collection);
            expect(await questionContentAdapter.getContentsList()).toBe(collection);
            expect(repository.getCollection).toHaveBeenCalledWith(questionContentAdapter.questionId);
        })().then(done));

    });

    describe('updateContentPosition:', () => {

        it('should call repository.updatePosition and return updated content from it', done => (async () => {
            let updatedContent = { id: '55' }, contentId = '22', newPosition = 3;
            spyOn(repository, 'updatePosition').and.returnValue(updatedContent);
            expect(await questionContentAdapter.updateContentPosition(contentId, newPosition)).toBe(updatedContent);
            expect(repository.updatePosition).toHaveBeenCalledWith(questionContentAdapter.questionId, contentId, newPosition);
        })().then(done));

    });

    describe('updateContentText:', () => {

        it('should call repository.updateText and return updated content from it', done => (async () => {
            let updatedContent = { id: '55' }, contentId = '22', newText = 'text';
            spyOn(repository, 'updateText').and.returnValue(updatedContent);
            expect(await questionContentAdapter.updateContentText(contentId, newText)).toBe(updatedContent);
            expect(repository.updateText).toHaveBeenCalledWith(questionContentAdapter.questionId, contentId, newText);
        })().then(done));

    });

    describe('createContent:', () => {

        it('should call repository.addLearningContent and return created content from it', done => (async () => {
            let newContent = { id: '33' }, contentType = 'type', position = 4, text = 'new_text';
            spyOn(repository, 'addLearningContent').and.returnValue(newContent);
            expect(await questionContentAdapter.createContent(contentType, position, text)).toBe(newContent);
            expect(repository.addLearningContent).toHaveBeenCalledWith(questionContentAdapter.questionId, {
                text: text, 
                position: position, 
                type: contentType
            });
        })().then(done));

    });

    describe('deleteContent:', () => {

        it('should call repository.removeLearningContent and return removed content from it', done => (async () => {
            let removedContent = { id: '33' }, contentId = '33';
            spyOn(repository, 'removeLearningContent').and.returnValue(removedContent);
            expect(await questionContentAdapter.deleteContent(contentId)).toBe(removedContent);
            expect(repository.removeLearningContent).toHaveBeenCalledWith(questionContentAdapter.questionId, contentId);
        })().then(done));

    });

    describe('createdByCollaborator:', () => {

        let question = {}, content = {};
        describe('when it is another question', () => {

            beforeEach(() => {
                question.id = '0';
            });

            it('should not call created function', () => {
                spyOn(questionContentAdapter, 'created');
                questionContentAdapter.createdByCollaborator(question, content);
                expect(questionContentAdapter.created).not.toHaveBeenCalled();
            });

        });

        describe('when it is the same question', () => {
            
            beforeEach(() => {
                question.id = questionContentAdapter.questionId;
            });

            it('should call created function', () => {
                spyOn(questionContentAdapter, 'created');
                questionContentAdapter.createdByCollaborator(question, content);
                expect(questionContentAdapter.created).toHaveBeenCalledWith(content);
            });

        });
        
    });

    describe('deletedByCollaborator:', () => {

        let question = {}, contentId = {};
        describe('when it is another question', () => {

            beforeEach(() => {
                question.id = '0';
            });

            it('should not call deleted function', () => {
                spyOn(questionContentAdapter, 'deleted');
                questionContentAdapter.deletedByCollaborator(question, contentId);
                expect(questionContentAdapter.deleted).not.toHaveBeenCalled();
            });

        });

        describe('when it is the same question', () => {
            
            beforeEach(() => {
                question.id = questionContentAdapter.questionId;
            });

            it('should call deleted function', () => {
                spyOn(questionContentAdapter, 'deleted');
                questionContentAdapter.deletedByCollaborator(question, contentId);
                expect(questionContentAdapter.deleted).toHaveBeenCalledWith(contentId);
            });

        });
        
    });

    describe('updatedByCollaborator:', () => {

        let question = {}, content = {};
        describe('when it is another question', () => {

            beforeEach(() => {
                question.id = '0';
            });

            it('should not call updated function', () => {
                spyOn(questionContentAdapter, 'updated');
                questionContentAdapter.updatedByCollaborator(question, content);
                expect(questionContentAdapter.updated).not.toHaveBeenCalled();
            });

        });

        describe('when it is the same question', () => {
            
            beforeEach(() => {
                question.id = questionContentAdapter.questionId;
            });

            it('should call updated function', () => {
                spyOn(questionContentAdapter, 'updated');
                questionContentAdapter.updatedByCollaborator(question, content);
                expect(questionContentAdapter.updated).toHaveBeenCalledWith(content);
            });

        });
        
    });

});