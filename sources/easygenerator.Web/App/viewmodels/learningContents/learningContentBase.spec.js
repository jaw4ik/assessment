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
            learningContentInstance = null;

            beforeEach(function () {
                learningContentInstance = new LearningContentBase(learningContent, _questionId, _questionType, canBeAddedImmediately);
                spyOn(eventTracker, 'publish');
                spyOn(notify, 'saved');
                spyOn(app, 'trigger');
            });

            it('should initialize field', function () {
                expect(learningContentInstance.id()).toBe(learningContent.id);
                expect(learningContentInstance.text()).toBe(learningContent.text);
                expect(learningContentInstance.originalText).toBe(learningContent.text);
                expect(learningContentInstance.type).toBe(learningContent.type);
                expect(learningContentInstance.hasFocus()).toBeFalsy();
                expect(learningContentInstance.isDeleted).toBeFalsy();
                expect(learningContentInstance.canBeAdded()).toBe(canBeAddedImmediately);
                expect(learningContentInstance.updateLearningContent).toBeFunction();
                expect(learningContentInstance.endEditLearningContent).toBeFunction();
                expect(learningContentInstance.removeLearningContent).toBeFunction();
                expect(learningContentInstance.publishActualEvent).toBeFunction();
                expect(learningContentInstance.isRemoved()).toBeFalsy();
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

                    describe('and learning content is not removed', function () {

                        describe('and id is not empty', function () {
                            var text = 'text';

                            describe('and text is not modified', function () {
                                beforeEach(function () {
                                    learningContentInstance.originalText = text;
                                });

                                it('should not update learning content text in the repository', function () {
                                    learningContentInstance.updateLearningContent();
                                    expect(repository.updateText).not.toHaveBeenCalledWith(learningContentInstance.id(), learningContentInstance.text());
                                });

                            });

                            describe('and text is modified', function () {
                                beforeEach(function () {
                                    learningContentInstance.originalText = 'text2';
                                });

                                it('should update learning content text in the repository', function (done) {
                                    updateLearningContentText.resolve({});

                                    learningContentInstance.updateLearningContent();

                                    updateLearningContentText.promise.fin(function () {
                                        expect(repository.updateText).toHaveBeenCalledWith(_questionId, learningContentInstance.id(), learningContentInstance.text());
                                        done();
                                    });
                                });

                                it('should show notification', function (done) {
                                    updateLearningContentText.resolve({ modifiedOn: new Date() });

                                    learningContentInstance.updateLearningContent();

                                    updateLearningContentText.promise.fin(function () {
                                        expect(notify.saved).toHaveBeenCalled();
                                        done();
                                    });
                                });

                                it('should update learning content original text', function (done) {
                                    updateLearningContentText.resolve(new Date());

                                    learningContentInstance.updateLearningContent();

                                    updateLearningContentText.promise.fin(function () {
                                        expect(learningContentInstance.originalText).toBe(learningContentInstance.text());
                                        done();
                                    });
                                });

                            });

                        });

                        describe('and id is empty', function () {

                            var id = 'id',
                                learningContentInstance2;

                            beforeEach(function () {
                                learningContentInstance2 = new LearningContentBase({ text: 'sometext' }, _questionId, _questionType, canBeAddedImmediately);
                            });

                            it('should add learning content to the repository', function () {
                                learningContentInstance2.updateLearningContent();
                                expect(repository.addLearningContent).toHaveBeenCalledWith(_questionId, { text: learningContentInstance2.text() });
                            });

                            it('should update learning content id in the viewModel', function (done) {
                                addLearningContent.resolve({ id: id, createdOn: new Date() });

                                learningContentInstance2.updateLearningContent();

                                addLearningContent.promise.fin(function () {
                                    expect(learningContentInstance2.id()).toEqual(id);
                                    done();
                                });
                            });


                            it('should show notification', function (done) {
                                addLearningContent.resolve({ id: id, createdOn: new Date() });
                                learningContentInstance2.updateLearningContent();

                                addLearningContent.promise.fin(function () {
                                    expect(notify.saved).toHaveBeenCalled();
                                    done();
                                });
                            });

                            it('should set learning content original text', function (done) {
                                addLearningContent.resolve({ id: id, createdOn: new Date() });

                                learningContentInstance2.updateLearningContent();

                                addLearningContent.promise.fin(function () {
                                    expect(learningContentInstance2.originalText).toBe(learningContentInstance2.text());
                                    done();
                                });
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
                        learningContentInstance.isDeleted = true;
                        learningContentInstance.removeLearningContent();
                        expect(app.trigger).toHaveBeenCalledWith(constants.messages.question.learningContent.remove, learningContentInstance);
                    });
                });

                describe('when learning content id is set', function () {
                    beforeEach(function () {
                        learningContentInstance.id('id');
                    });

                    it('should remove learning content from the repository', function () {
                        learningContentInstance.removeLearningContent();

                        expect(repository.removeLearningContent).toHaveBeenCalledWith(_questionId, learningContentInstance.id());
                    });

                    it('should remove learning content from the viewModel', function () {
                        learningContentInstance.removeLearningContent();

                        expect(app.trigger).toHaveBeenCalledWith(constants.messages.question.learningContent.remove, learningContentInstance);
                    });

                    it('should show notification', function (done) {
                        removeLearningContent.resolve({ modifiedOn: new Date() });

                        learningContentInstance.removeLearningContent();

                        removeLearningContent.promise.fin(function () {
                            expect(notify.saved).toHaveBeenCalled();
                            done();
                        });
                    });

                });

                describe('when learning content id is not set initially', function () {
                    beforeEach(function () {
                        learningContentInstance.id('');
                    });

                    it('should not remove learning content from the repository', function () {
                        learningContentInstance.removeLearningContent();

                        expect(repository.removeLearningContent).not.toHaveBeenCalledWith(_questionId, learningContentInstance.id());
                    });

                    it('should not remove learning content from the viewModel', function () {
                        learningContentInstance.removeLearningContent();

                        expect(app.trigger).not.toHaveBeenCalledWith(constants.messages.question.learningContent.remove, learningContentInstance);
                    });

                    it('should not show notification', function (done) {
                        removeLearningContent.resolve({ modifiedOn: new Date() });

                        learningContentInstance.removeLearningContent();

                        removeLearningContent.promise.fin(function () {
                            expect(notify.saved).not.toHaveBeenCalled();
                            done();
                        });
                    });

                    describe('and learning content id is set later', function () {

                        it('should remove learning content from the repository', function () {
                            learningContentInstance.removeLearningContent();
                            learningContentInstance.id('id');

                            expect(repository.removeLearningContent).toHaveBeenCalledWith(_questionId, learningContentInstance.id());
                        });

                        it('should remove learning content from the viewModel', function () {
                            learningContentInstance.removeLearningContent();
                            learningContentInstance.id('id');

                            expect(app.trigger).toHaveBeenCalledWith(constants.messages.question.learningContent.remove, learningContentInstance);
                        });

                        it('should show notification', function (done) {
                            removeLearningContent.resolve({ modifiedOn: new Date() });

                            learningContentInstance.removeLearningContent();
                            learningContentInstance.id('id');

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
                        learningContentInstance.isDeleted = true;
                        learningContentInstance.endEditLearningContent();

                        expect(app.trigger).toHaveBeenCalledWith(constants.messages.question.learningContent.remove, learningContentInstance);
                    });
                });

                describe('when text is empty', function () {

                    describe('and id is not empty', function () {

                        it('should remove learning content from the repository', function () {
                            learningContentInstance.text('');
                            learningContentInstance.endEditLearningContent();
                            expect(repository.removeLearningContent).toHaveBeenCalledWith(_questionId, learningContentInstance.id());
                        });

                        it('should show notification', function (done) {
                            learningContentInstance.text('');
                            removeLearningContent.resolve(new Date());

                            learningContentInstance.endEditLearningContent();

                            removeLearningContent.promise.fin(function () {
                                expect(notify.saved).toHaveBeenCalled();
                                done();
                            });
                        });

                    });

                    describe('and id is empty', function () {

                        it('should not remove learning content from the repository', function () {
                            learningContentInstance.id('');
                            learningContentInstance.text('');

                            learningContentInstance.endEditLearningContent(learningContent);

                            expect(repository.removeLearningContent).not.toHaveBeenCalled();
                        });

                    });

                    it('should remove learning content from the viewModel', function () {
                        learningContentInstance.id('');
                        learningContentInstance.text('');
                        learningContentInstance.endEditLearningContent(learningContent);
                        expect(app.trigger).toHaveBeenCalledWith(constants.messages.question.learningContent.remove, learningContentInstance);
                    });

                });

            });

            describe('restoreLearningContent:', function () {
                var restoreLearningContent;

                beforeEach(function () {
                    restoreLearningContent = Q.defer();
                    spyOn(repository, 'addLearningContent').and.returnValue(restoreLearningContent.promise);
                });

                it('should be function', function () {
                    expect(learningContentInstance.restoreLearningContent).toBeFunction();
                });

                it('should return promise', function () {
                    expect(learningContentInstance.restoreLearningContent()).toBePromise();
                });

                it('should add learning content', function () {
                    learningContentInstance.restoreLearningContent();
                    expect(repository.addLearningContent).toHaveBeenCalledWith(_questionId, { text: learningContentInstance.text() });
                });

                it('should update learning content with new parameters', function(done) {
                    restoreLearningContent.resolve({ id: '132' });
                    var text = learningContentInstance.text();
                    var promise = learningContentInstance.restoreLearningContent();
                    promise.fin(function () {
                        expect(learningContentInstance.id()).toBe('132');
                        expect(learningContentInstance.originalText).toBe(text);
                        done();
                    });
                });

                it('should trigger event to restore learning content', function (done) {
                    restoreLearningContent.resolve({ id: '132' });
                    var promise = learningContentInstance.restoreLearningContent();
                    promise.fin(function () {
                        expect(app.trigger).toHaveBeenCalled();
                        done();
                    });
                });

                it('should show notification', function(done) {
                    restoreLearningContent.resolve({ id: '132' });
                    var promise = learningContentInstance.restoreLearningContent();
                    promise.fin(function () {
                        expect(notify.saved).toHaveBeenCalled();
                        done();
                    });
                });

            });

            describe('publishActualEvent:', function () {
                var event = 'event';

                describe('when question type is Information content', function () {

                    it('should send event with category \'' + constants.eventCategories.informationContent + '\'', function () {
                        var learningContentInstance2 = new LearningContentBase(learningContent, _questionId, 'informationContent', canBeAddedImmediately);
                        learningContentInstance2.publishActualEvent(event);
                        expect(eventTracker.publish).toHaveBeenCalledWith(event, constants.eventCategories.informationContent);
                    });

                });

                describe('when question type is not Information content', function () {

                    it('should send event without category', function () {
                        learningContentInstance.publishActualEvent(event);
                        expect(eventTracker.publish).toHaveBeenCalledWith(event);
                    });

                });

            });

        });

    });

});





