define(['knockout', 'viewmodels/learningContents/learningContentBase'], function (ko, LearningContentBase) {
    'use strict';

    var app = require('durandal/app'),
        constants = require('constants'),
        notify = require('notify'),
        eventTracker = require('eventTracker'),
        repository = require('repositories/learningContentRepository');

    describe('viewModel LearningContentBase', function () {
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
                ctor = new LearningContentBase(learningContent, _questionId, _questionType, canBeAddedImmediately);
                spyOn(eventTracker, 'publish');
                spyOn(notify, 'saved');
                spyOn(app, 'trigger');
            });

            it('should initialize field', function () {
                expect(ctor.id()).toBe(learningContent.id);
                expect(ctor.text()).toBe(learningContent.text);
                expect(ctor.originalText).toBe(learningContent.text);
                expect(ctor.type).toBe(learningContent.type);
                expect(ctor.hasFocus()).toBeFalsy();
                expect(ctor.isDeleted).toBeFalsy();
                expect(ctor.canBeAdded()).toBe(canBeAddedImmediately);
                expect(ctor.updateLearningContent).toBeFunction();
                expect(ctor.endEditLearningContent).toBeFunction();
                expect(ctor.removeLearningContent).toBeFunction();
                expect(ctor.publishActualEvent).toBeFunction();
            });

            describe('updateLearningContent:', function () {

                var addLearningContent;
                var updateLearningContentText;

                beforeEach(function () {
                    addLearningContent = Q.defer();
                    updateLearningContentText = Q.defer();

                    spyOn(repository, 'addLearningContent').and.returnValue(addLearningContent.promise);
                    spyOn(repository, 'updateText').and.returnValue(updateLearningContentText.promise);
                });

                describe('when text is not empty', function () {

                    describe('and id is not empty', function () {
                        var text = 'text';

                        describe('and text is not modified', function () {
                            beforeEach(function () {
                                ctor.originalText = text;
                            });

                            it('should not update learning content text in the repository', function () {
                                ctor.updateLearningContent();
                                expect(repository.updateText).not.toHaveBeenCalledWith(ctor.id(), ctor.text());
                            });

                        });

                        describe('and text is modified', function () {
                            beforeEach(function () {
                                ctor.originalText = 'text2';
                            });

                            it('should update learning content text in the repository', function (done) {
                                updateLearningContentText.resolve({});

                                ctor.updateLearningContent();

                                updateLearningContentText.promise.fin(function () {
                                    expect(repository.updateText).toHaveBeenCalledWith(_questionId, ctor.id(), ctor.text());
                                    done();
                                });
                            });

                            it('should show notification', function (done) {
                                updateLearningContentText.resolve({ modifiedOn: new Date() });

                                ctor.updateLearningContent();

                                updateLearningContentText.promise.fin(function () {
                                    expect(notify.saved).toHaveBeenCalled();
                                    done();
                                });
                            });

                            it('should update learning content original text', function (done) {
                                updateLearningContentText.resolve(new Date());

                                ctor.updateLearningContent();

                                updateLearningContentText.promise.fin(function () {
                                    expect(ctor.originalText).toBe(ctor.text());
                                    done();
                                });
                            });

                        });

                    });

                    describe('and id is empty', function () {

                        var id = 'id',
                            ctor2;

                        beforeEach(function () {
                            ctor2 = new LearningContentBase({ text: 'sometext' }, _questionId, _questionType, canBeAddedImmediately);
                        });

                        it('should add learning content to the repository', function () {
                            ctor2.updateLearningContent();
                            expect(repository.addLearningContent).toHaveBeenCalledWith(_questionId, { text: ctor2.text() });
                        });

                        it('should update learning content id in the viewModel', function (done) {
                            addLearningContent.resolve({ id: id, createdOn: new Date() });

                            ctor2.updateLearningContent();

                            addLearningContent.promise.fin(function () {
                                expect(ctor2.id()).toEqual(id);
                                done();
                            });
                        });


                        it('should show notification', function (done) {
                            addLearningContent.resolve({ id: id, createdOn: new Date() });
                            ctor2.updateLearningContent();

                            addLearningContent.promise.fin(function () {
                                expect(notify.saved).toHaveBeenCalled();
                                done();
                            });
                        });

                        it('should set learning content original text', function (done) {
                            addLearningContent.resolve({ id: id, createdOn: new Date() });

                            ctor2.updateLearningContent();

                            addLearningContent.promise.fin(function () {
                                expect(ctor2.originalText).toBe(ctor2.text());
                                done();
                            });
                        });
                    });
                });
            });

            describe('removeLearningContent:', function () {

                var removeLearningContent;

                beforeEach(function () {
                    removeLearningContent = Q.defer();
                    spyOn(repository, 'removeLearningContent').and.returnValue(removeLearningContent.promise);
                });

                describe('when learningContent has been deleted by collaborator', function () {
                    it('should be removed from learningContents list', function () {
                        ctor.isDeleted = true;
                        ctor.removeLearningContent();
                        expect(app.trigger).toHaveBeenCalledWith(constants.messages.question.learningContent.remove, ctor);
                    });
                });

                describe('when learning content id is set', function () {
                    beforeEach(function () {
                        ctor.id('id');
                    });

                    it('should remove learning content from the repository', function () {
                        ctor.removeLearningContent();

                        expect(repository.removeLearningContent).toHaveBeenCalledWith(_questionId, ctor.id());
                    });

                    it('should remove learning content from the viewModel', function () {
                        ctor.removeLearningContent();

                        expect(app.trigger).toHaveBeenCalledWith(constants.messages.question.learningContent.remove, ctor);
                    });

                    it('should show notification', function (done) {
                        removeLearningContent.resolve({ modifiedOn: new Date() });

                        ctor.removeLearningContent();

                        removeLearningContent.promise.fin(function () {
                            expect(notify.saved).toHaveBeenCalled();
                            done();
                        });
                    });

                });

                describe('when learning content id is not set initially', function () {
                    beforeEach(function () {
                        ctor.id('');
                    });

                    it('should not remove learning content from the repository', function () {
                        ctor.removeLearningContent();

                        expect(repository.removeLearningContent).not.toHaveBeenCalledWith(_questionId, ctor.id());
                    });

                    it('should not remove learning content from the viewModel', function () {
                        ctor.removeLearningContent();

                        expect(app.trigger).not.toHaveBeenCalledWith(constants.messages.question.learningContent.remove, ctor);
                    });

                    it('should not show notification', function (done) {
                        removeLearningContent.resolve({ modifiedOn: new Date() });

                        ctor.removeLearningContent();

                        removeLearningContent.promise.fin(function () {
                            expect(notify.saved).not.toHaveBeenCalled();
                            done();
                        });
                    });

                    describe('and learning content id is set later', function () {

                        it('should remove learning content from the repository', function () {
                            ctor.removeLearningContent();
                            ctor.id('id');

                            expect(repository.removeLearningContent).toHaveBeenCalledWith(_questionId, ctor.id());
                        });

                        it('should remove learning content from the viewModel', function () {
                            ctor.removeLearningContent();
                            ctor.id('id');

                            expect(app.trigger).toHaveBeenCalledWith(constants.messages.question.learningContent.remove, ctor);
                        });

                        it('should show notification', function (done) {
                            removeLearningContent.resolve({ modifiedOn: new Date() });

                            ctor.removeLearningContent();
                            ctor.id('id');

                            removeLearningContent.promise.fin(function () {
                                expect(notify.saved).toHaveBeenCalled();
                                done();
                            });
                        });

                    });
                });

            });

            describe('endEditLearningContent:', function () {

                var removeLearningContent;

                beforeEach(function () {
                    removeLearningContent = Q.defer();
                    spyOn(repository, 'removeLearningContent').and.returnValue(removeLearningContent.promise);
                });

                describe('when learningContent has been deleted by collaborator', function () {
                    it('should be removed from learningContents list', function () {
                        ctor.isDeleted = true;
                        ctor.endEditLearningContent();

                        expect(app.trigger).toHaveBeenCalledWith(constants.messages.question.learningContent.remove, ctor);
                    });
                });

                describe('when text is empty', function () {

                    describe('and id is not empty', function () {

                        it('should remove learning content from the repository', function () {
                            ctor.text('');
                            ctor.endEditLearningContent();
                            expect(repository.removeLearningContent).toHaveBeenCalledWith(_questionId, ctor.id());
                        });

                        it('should show notification', function (done) {
                            ctor.text('');
                            removeLearningContent.resolve(new Date());

                            ctor.endEditLearningContent();

                            removeLearningContent.promise.fin(function () {
                                expect(notify.saved).toHaveBeenCalled();
                                done();
                            });
                        });

                    });

                    describe('and id is empty', function () {

                        it('should not remove learning content from the repository', function () {
                            ctor.id('');
                            ctor.text('');

                            ctor.endEditLearningContent(learningContent);

                            expect(repository.removeLearningContent).not.toHaveBeenCalled();
                        });

                    });

                    it('should remove learning content from the viewModel', function () {
                        ctor.id('');
                        ctor.text('');
                        ctor.endEditLearningContent(learningContent);
                        expect(app.trigger).toHaveBeenCalledWith(constants.messages.question.learningContent.remove, ctor);
                    });

                });

            });

            describe('publishActualEvent:', function () {
                var event = 'event';

                describe('when question type is Information content', function () {
                    
                    it('should send event with category \''+ constants.eventCategories.informationContent + '\'', function () {
                        var ctor2 = new LearningContentBase(learningContent, _questionId, 'informationContent', canBeAddedImmediately);
                        ctor2.publishActualEvent(event);
                        expect(eventTracker.publish).toHaveBeenCalledWith(event, constants.eventCategories.informationContent);
                    });

                });

                describe('when question type is not Information content', function() {

                    it('should send event without category', function() {
                        ctor.publishActualEvent(event);
                        expect(eventTracker.publish).toHaveBeenCalledWith(event);
                    });

                });

            });

        });

    });

});





