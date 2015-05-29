define(['knockout', 'viewmodels/learningContents/content'], function(ko, Content) {
    'use strict';

    var app = require('durandal/app'),
        constants = require('constants'),
        notify = require('notify'),
        eventTracker = require('eventTracker'),
        repository = require('repositories/learningContentRepository');

    describe('viewModel Content', function() {
        var _questionId = 'questionId',
            _questionType = 'questionType',
            canBeAddedImmediately = true;

        describe('when learningContent is defined in database', function() {
            var learningContent = {
                id: 'contentId',
                text: 'text',
                type: constants.learningContentsTypes.content
            },
            ctor = null;

            beforeEach(function() {
                ctor = new Content(learningContent, _questionId, _questionType, canBeAddedImmediately);
                spyOn(eventTracker, 'publish');
                spyOn(notify, 'saved');
                spyOn(app, 'trigger');
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
                expect(ctor.updateText).toBeFunction();
                expect(ctor.endEditText).toBeFunction();
                expect(ctor.removeLearningContent).toBeFunction();
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

            describe('updateText:', function () {

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
                                ctor.updateText();
                                expect(repository.updateText).not.toHaveBeenCalledWith(ctor.id(), ctor.text());
                            });

                        });

                        describe('and text is modified', function () {
                            beforeEach(function () {
                                ctor.originalText = 'text2';
                            });

                            it('should update learning content text in the repository', function (done) {
                                updateLearningContentText.resolve({});

                                ctor.updateText();

                                updateLearningContentText.promise.fin(function () {
                                    expect(repository.updateText).toHaveBeenCalledWith(_questionId, ctor.id(), ctor.text());
                                    done();
                                });
                            });

                            it('should show notification', function (done) {
                                updateLearningContentText.resolve({ modifiedOn: new Date() });

                                ctor.updateText();

                                updateLearningContentText.promise.fin(function () {
                                    expect(notify.saved).toHaveBeenCalled();
                                    done();
                                });
                            });

                            it('should update learning content original text', function (done) {
                                updateLearningContentText.resolve(new Date());

                                ctor.updateText();

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
                            ctor2 = new Content({text: 'sometext'}, _questionId, _questionType, canBeAddedImmediately);
                        });

                        it('should add learning content to the repository', function () {
                            ctor2.updateText();
                            expect(repository.addLearningContent).toHaveBeenCalledWith(_questionId, { text: ctor2.text() });
                        });

                        it('should update learning content id in the viewModel', function (done) {
                            addLearningContent.resolve({ id: id, createdOn: new Date() });

                            ctor2.updateText();

                            addLearningContent.promise.fin(function () {
                                expect(ctor2.id()).toEqual(id);
                                done();
                            });
                        });


                        it('should show notification', function (done) {
                            addLearningContent.resolve({ id: id, createdOn: new Date() });
                            ctor2.updateText();

                            addLearningContent.promise.fin(function () {
                                expect(notify.saved).toHaveBeenCalled();
                                done();
                            });
                        });

                        it('should set learning content original text', function (done) {
                            addLearningContent.resolve({ id: id, createdOn: new Date() });

                            ctor2.updateText();

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

                it('should send event \'Delete learning content\'', function () {
                    ctor.removeLearningContent();
                    expect(eventTracker.publish).toHaveBeenCalledWith('Delete learning content');
                });

                it('should send event \'Delete learning content\' with category \'Information\' for informationContent question type', function () {
                    var ctor2 = new Content(learningContent, _questionId, 'informationContent', canBeAddedImmediately);
                    ctor2.removeLearningContent();
                    expect(eventTracker.publish).toHaveBeenCalledWith('Delete learning content', 'Information');
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

            describe('endEditText:', function () {

                var removeLearningContent;

                beforeEach(function () {
                    removeLearningContent = Q.defer();
                    spyOn(repository, 'removeLearningContent').and.returnValue(removeLearningContent.promise);
                });

                it('should send event \'End editing learning content\'', function () {
                    ctor.endEditText();
                    expect(eventTracker.publish).toHaveBeenCalledWith('End editing learning content');
                });

                it('should send event \'End editing learning content\' with category \'Information\' for informationContent question type', function () {
                    var ctor2 = new Content(learningContent, _questionId, 'informationContent', canBeAddedImmediately);
                    ctor2.endEditText();
                    expect(eventTracker.publish).toHaveBeenCalledWith('End editing learning content', 'Information');
                });

                describe('when learningContent has been deleted by collaborator', function () {
                    it('should be removed from learningContents list', function () {
                        ctor.isDeleted = true;
                        ctor.endEditText();

                        expect(app.trigger).toHaveBeenCalledWith(constants.messages.question.learningContent.remove, ctor);
                    });
                });

                describe('when text is empty', function () {

                    describe('and id is not empty', function () {

                        it('should remove learning content from the repository', function () {
                            ctor.text('');
                            ctor.endEditText();
                            expect(repository.removeLearningContent).toHaveBeenCalledWith(_questionId, ctor.id());
                        });

                        it('should show notification', function (done) {
                            ctor.text('');
                            removeLearningContent.resolve(new Date());

                            ctor.endEditText();

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

                            ctor.endEditText(learningContent);

                            expect(repository.removeLearningContent).not.toHaveBeenCalled();
                        });

                    });

                    it('should remove learning content from the viewModel', function () {
                        ctor.id('');
                        ctor.text('');
                        ctor.endEditText(learningContent);
                        expect(app.trigger).toHaveBeenCalledWith(constants.messages.question.learningContent.remove, ctor);
                    });

                });

            });

        });

    });

});





