import Content from './content';

import app from 'durandal/app';
import constants from 'constants';
import notify from 'notify';
import eventTracker from 'eventTracker';
        
describe('viewModel Content', function () {
    var _questionId = 'questionId',
        _questionType = 'questionType',
        canBeAddedImmediately = true;

    describe('when learningContent is defined in database', function () {
        var learningContent = {
            id: 'contentId',
            text: 'text',
            type: constants.learningContentsTypes.content
        },
        learningContentInstance = null;

        beforeEach(function () {
            learningContentInstance = new Content(learningContent, _questionId, _questionType, canBeAddedImmediately);
            spyOn(eventTracker, 'publish');
            spyOn(notify, 'saved');
            spyOn(app, 'trigger');
            spyOn(learningContentInstance, 'removeLearningContent').and.callFake(function () { });
            spyOn(learningContentInstance, 'restoreLearningContent').and.callFake(function () { });
        });

        it('should initialize field', function () {
            expect(learningContentInstance.id()).toBe(learningContent.id);
            expect(learningContentInstance.text()).toBe(learningContent.text);
            expect(learningContentInstance.originalText).toBe(learningContent.text);
            expect(learningContentInstance.type).toBe(learningContent.type);
            expect(learningContentInstance.hasFocus()).toBe(false);
            expect(learningContentInstance.isDeleted).toBe(false);
            expect(learningContentInstance.canBeAdded()).toBe(canBeAddedImmediately);
            expect(learningContentInstance.beginEditText).toBeFunction();
            expect(learningContentInstance.endEditText).toBeFunction();
            expect(learningContentInstance.removeLearningContent).toBeFunction();
            expect(learningContentInstance.remove).toBeFunction();
            expect(learningContentInstance.updateLearningContent).toBeFunction();
            expect(learningContentInstance.endEditLearningContent).toBeFunction();
        });

        describe('beginEditText:', function () {
            it('should send event \'Start editing learning content\'', function () {
                learningContentInstance.beginEditText({});
                expect(eventTracker.publish).toHaveBeenCalledWith('Start editing learning content');
            });

            it('should send event \'Start editing learning content\' with category \'Information\' for informationContent question type', function () {
                var learningContentInstance2 = new Content(learningContent, _questionId, 'informationContent', canBeAddedImmediately);
                learningContentInstance2.beginEditText({});
                expect(eventTracker.publish).toHaveBeenCalledWith('Start editing learning content', 'Information');
            });
        });

        describe('remove:', function () {

            it('should send event \'Delete learning content\'', function () {
                learningContentInstance.remove();
                expect(eventTracker.publish).toHaveBeenCalledWith('Delete learning content');
            });

            it('should send event \'Delete learning content\' with category \'Information\' for informationContent question type', function () {
                var learningContentInstance2 = new Content(learningContent, _questionId, 'informationContent', canBeAddedImmediately);
                spyOn(learningContentInstance2, 'removeLearningContent').and.callFake(function () { });
                learningContentInstance2.remove();
                expect(eventTracker.publish).toHaveBeenCalledWith('Delete learning content', 'Information');
            });

            it('should call removeLearningContent', function () {
                learningContentInstance.remove();
                expect(learningContentInstance.removeLearningContent).toHaveBeenCalled();
            });

        });

        describe('endEditText:', function () {

            it('should send event \'End editing learning content\'', function () {
                learningContentInstance.endEditText();
                expect(eventTracker.publish).toHaveBeenCalledWith('End editing learning content');
            });

            it('should send event \'End editing learning content\' with category \'Information\' for informationContent question type', function () {
                var learningContentInstance2 = new Content(learningContent, _questionId, 'informationContent', canBeAddedImmediately);
                learningContentInstance2.endEditText();
                expect(eventTracker.publish).toHaveBeenCalledWith('End editing learning content', 'Information');
            });

            it('should call endEditLearningContent', function () {
                spyOn(learningContentInstance, 'endEditLearningContent');
                learningContentInstance.endEditText();
                expect(learningContentInstance.endEditLearningContent).toHaveBeenCalled();
            });

        });

        describe('restore:', function () {

            describe('when content is not removed', function () {

                beforeEach(function () {
                    learningContentInstance.isRemoved(false);
                });

                it('should not publish event', function () {
                    learningContentInstance.restore();
                    expect(eventTracker.publish).not.toHaveBeenCalled();
                });

                it('should not restore content', function () {
                    learningContentInstance.restore();
                    expect(learningContentInstance.restoreLearningContent).not.toHaveBeenCalled();
                });

            });

            it('should send event \'Undo delete learning content\'', function () {
                learningContentInstance.isRemoved(true);
                learningContentInstance.restore();
                expect(eventTracker.publish).toHaveBeenCalledWith('Undo delete learning content');
            });

            it('should send event \'Undo delete learning content\' with category \'Information\' for informationContent question type', function () {
                var learnContent = new Content(learningContent, _questionId, 'informationContent', canBeAddedImmediately);
                spyOn(learnContent, 'restoreLearningContent').and.callFake(function () { });
                learnContent.isRemoved(true);
                learnContent.restore();
                expect(eventTracker.publish).toHaveBeenCalledWith('Undo delete learning content', 'Information');
            });

            it('should call restoreLearningContent', function () {
                learningContentInstance.isRemoved(true);
                learningContentInstance.restore();
                expect(learningContentInstance.restoreLearningContent).toHaveBeenCalled();
            });

        });

    });

});
