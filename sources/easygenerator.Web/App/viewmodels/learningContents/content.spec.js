define(['knockout', 'viewmodels/learningContents/content'], function (ko, Content) {
    'use strict';

    var app = require('durandal/app'),
        constants = require('constants'),
        notify = require('notify'),
        eventTracker = require('eventTracker');
        

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
            ctor = null;

            beforeEach(function () {
                ctor = new Content(learningContent, _questionId, _questionType, canBeAddedImmediately);
                spyOn(eventTracker, 'publish');
                spyOn(notify, 'saved');
                spyOn(app, 'trigger');
                spyOn(ctor, 'removeLearningContent').and.callFake(function () { });
            });

            it('should initialize field', function () {
                expect(ctor.id()).toBe(learningContent.id);
                expect(ctor.text()).toBe(learningContent.text);
                expect(ctor.originalText).toBe(learningContent.text);
                expect(ctor.type).toBe(learningContent.type);
                expect(ctor.hasFocus()).toBe(false);
                expect(ctor.isDeleted).toBe(false);
                expect(ctor.canBeAdded()).toBe(canBeAddedImmediately);
                expect(ctor.beginEditText).toBeFunction();
                expect(ctor.endEditText).toBeFunction();
                expect(ctor.removeLearningContent).toBeFunction();
                expect(ctor.remove).toBeFunction();
                expect(ctor.updateLearningContent).toBeFunction();
                expect(ctor.endEditLearningContent).toBeFunction();
            });

            describe('beginEditText:', function () {
                it('should send event \'Start editing learning content\'', function () {
                    ctor.beginEditText({});
                    expect(eventTracker.publish).toHaveBeenCalledWith('Start editing learning content');
                });

                it('should send event \'Start editing learning content\' with category \'Information\' for informationContent question type', function () {
                    var ctor2 = new Content(learningContent, _questionId, 'informationContent', canBeAddedImmediately);
                    ctor2.beginEditText({});
                    expect(eventTracker.publish).toHaveBeenCalledWith('Start editing learning content', 'Information');
                });
            });

            describe('remove:', function () {

                it('should send event \'Delete learning content\'', function () {
                    ctor.remove();
                    expect(eventTracker.publish).toHaveBeenCalledWith('Delete learning content');
                });

                it('should send event \'Delete learning content\' with category \'Information\' for informationContent question type', function () {
                    var ctor2 = new Content(learningContent, _questionId, 'informationContent', canBeAddedImmediately);
                    spyOn(ctor2, 'removeLearningContent').and.callFake(function () { });
                    ctor2.remove();
                    expect(eventTracker.publish).toHaveBeenCalledWith('Delete learning content', 'Information');
                });

                it('should call removeLearningContent', function () {
                    ctor.remove();
                    expect(ctor.removeLearningContent).toHaveBeenCalled();
                });

            });

            describe('endEditText:', function () {

                it('should send event \'End editing learning content\'', function () {
                    ctor.endEditText();
                    expect(eventTracker.publish).toHaveBeenCalledWith('End editing learning content');
                });

                it('should send event \'End editing learning content\' with category \'Information\' for informationContent question type', function () {
                    var ctor2 = new Content(learningContent, _questionId, 'informationContent', canBeAddedImmediately);
                    ctor2.endEditText();
                    expect(eventTracker.publish).toHaveBeenCalledWith('End editing learning content', 'Information');
                });

                it('should call endEditLearningContent', function () {
                    spyOn(ctor, 'endEditLearningContent');
                    ctor.endEditText();
                    expect(ctor.endEditLearningContent).toHaveBeenCalled();
                });

            });

        });

    });

});