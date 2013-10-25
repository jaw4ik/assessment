define(function (require) {
    "use strict";

    var
        ctor = require('viewmodels/questions/learningContents'),
        repository = require('repositories/learningContentRepository'),
        eventTracker = require('eventTracker'),
        notify = require('notify')
    ;

    describe('viewModel [learningContents]', function () {

        var viewModel;
        var questionId = 'questionId';

        beforeEach(function () {
            spyOn(notify, 'info');
            spyOn(eventTracker, 'publish');
        });

        describe('learningContents:', function () {

            beforeEach(function () {
                viewModel = ctor(questionId, []);
            });

            it('should be observable array', function () {
                expect(viewModel.learningContents).toBeObservable();
            });

        });

        describe('addLearningContent:', function () {

            beforeEach(function () {
                viewModel = ctor(questionId, []);
            });

            it('should be function', function () {
                expect(viewModel.addLearningContent).toBeFunction();
            });

            it('should add empty learning content', function () {
                viewModel.addLearningContent();
                expect(viewModel.learningContents().length).toEqual(1);
                expect(viewModel.learningContents()[0].id).toBeObservable();
                expect(viewModel.learningContents()[0].id()).toEqual("");
                expect(viewModel.learningContents()[0].text).toBeObservable();
                expect(viewModel.learningContents()[0].text()).toEqual("");
                expect(viewModel.learningContents()[0].hasFocus).toBeObservable();
                expect(viewModel.learningContents()[0].hasFocus()).toBeTruthy();
            });

            it('should send event \'Add learning content\'', function () {
                viewModel.addLearningContent();
                expect(eventTracker.publish).toHaveBeenCalledWith('Add learning content');
            });

        });

        describe('removeLearningContent:', function () {

            beforeEach(function () {
                viewModel = ctor(questionId, []);
            });

            var removeLearningContent;
            var learningContent;

            beforeEach(function () {
                learningContent = { id: ko.observable(''), text: ko.observable('') };

                removeLearningContent = Q.defer();
                spyOn(repository, 'removeLearningContent').andReturn(removeLearningContent.promise);
            });

            it('should be function', function () {
                expect(viewModel.removeLearningContent).toBeFunction();
            });

            it('should send event \'Delete learning content\'', function () {
                viewModel.removeLearningContent(learningContent);
                expect(eventTracker.publish).toHaveBeenCalledWith('Delete learning content');
            });

            describe('when learning content id is set', function () {
                beforeEach(function() {
                    learningContent.id('id');
                });
                
                it('should remove learning content from the repository', function () {

                    viewModel.learningContents([learningContent]);
                    viewModel.removeLearningContent(learningContent);

                    expect(repository.removeLearningContent).toHaveBeenCalledWith(questionId, learningContent.id());
                });

                it('should remove learning content from the viewModel', function () {
                    viewModel.learningContents([learningContent]);

                    viewModel.removeLearningContent(learningContent);

                    expect(viewModel.learningContents().length).toEqual(0);
                });

                it('should show notification', function () {
                    var promise = removeLearningContent.promise.fin(function () { });
                    viewModel.learningContents([learningContent]);
                    removeLearningContent.resolve({ modifiedOn: new Date() });

                    viewModel.removeLearningContent(learningContent);

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(notify.info).toHaveBeenCalled();
                    });
                });
                
            });

            describe('when learning content id is not set initially', function() {
                beforeEach(function () {
                    learningContent.id('');
                });
                
                it('should not remove learning content from the repository', function () {

                    viewModel.learningContents([learningContent]);
                    viewModel.removeLearningContent(learningContent);

                    expect(repository.removeLearningContent).not.toHaveBeenCalledWith(questionId, learningContent.id());
                });

                it('should not remove learning content from the viewModel', function () {
                    viewModel.learningContents([learningContent]);

                    viewModel.removeLearningContent(learningContent);

                    expect(viewModel.learningContents().length).toEqual(1);
                });

                it('should not show notification', function () {
                    var promise = removeLearningContent.promise.fin(function () { });
                    viewModel.learningContents([learningContent]);
                    removeLearningContent.resolve({ modifiedOn: new Date() });

                    viewModel.removeLearningContent(learningContent);

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(notify.info).not.toHaveBeenCalled();
                    });
                });

                describe('and learning content id is set later', function () {
                    
                    it('should remove learning content from the repository', function () {
                        viewModel.learningContents([learningContent]);
                        
                        viewModel.removeLearningContent(learningContent);
                        learningContent.id('id');
                        
                        expect(repository.removeLearningContent).toHaveBeenCalledWith(questionId, learningContent.id());
                    });

                    it('should remove learning content from the viewModel', function () {
                        viewModel.learningContents([learningContent]);

                        viewModel.removeLearningContent(learningContent);
                        learningContent.id('id');

                        expect(viewModel.learningContents().length).toEqual(0);
                    });

                    it('should show notification', function () {
                        var promise = removeLearningContent.promise.fin(function () { });
                        viewModel.learningContents([learningContent]);
                        removeLearningContent.resolve({ modifiedOn: new Date() });

                        viewModel.removeLearningContent(learningContent);
                        learningContent.id('id');

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(notify.info).toHaveBeenCalled();
                        });
                    });
                    
                });
            });

        });

        describe('beginEditText:', function () {

            it('should be function', function () {
                expect(viewModel.beginEditText).toBeFunction();
            });

            it('should send event \'Start editing learning content\'', function () {
                viewModel.beginEditText({});
                expect(eventTracker.publish).toHaveBeenCalledWith('Start editing learning content');
            });
        });

        describe('endEditText:', function () {

            var removeLearningContent;

            beforeEach(function () {
                viewModel = ctor(questionId, []);
                removeLearningContent = Q.defer();
                spyOn(repository, 'removeLearningContent').andReturn(removeLearningContent.promise);
            });

            it('should be function', function () {
                expect(viewModel.endEditText).toBeFunction();
            });

            it('should send event \'End editing learning content\'', function () {
                var learningContent = { id: ko.observable('learningContentId'), text: ko.observable('') };
                viewModel.endEditText(learningContent);
                expect(eventTracker.publish).toHaveBeenCalledWith('End editing learning content');
            });

            describe('when text is empty', function () {

                describe('and id is not empty', function () {

                    it('should remove learning content from the repository', function () {
                        var learningContent = { id: ko.observable('learningContentId'), text: ko.observable('') };
                        viewModel.learningContents([learningContent]);

                        viewModel.endEditText(learningContent);

                        expect(repository.removeLearningContent).toHaveBeenCalledWith(questionId, learningContent.id());
                    });

                    it('should show notification', function () {
                        var promise = removeLearningContent.promise.fin(function () { });
                        var learningContent = { id: ko.observable('learningContentId'), text: ko.observable('') };
                        viewModel.learningContents([learningContent]);
                        removeLearningContent.resolve(new Date());

                        viewModel.endEditText(learningContent);

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(notify.info).toHaveBeenCalled();
                        });
                    });

                });

                describe('and id is empty', function () {

                    it('should not remove learning content from the repository', function () {
                        var learningContent = { id: ko.observable(''), text: ko.observable('') };
                        viewModel.learningContents([learningContent]);

                        viewModel.endEditText(learningContent);

                        expect(repository.removeLearningContent).not.toHaveBeenCalled();
                    });

                });

                it('should remove learning content from the viewModel', function () {
                    var learningContent = { id: ko.observable(''), text: ko.observable('') };
                    viewModel.learningContents([learningContent]);

                    viewModel.endEditText(learningContent);

                    expect(viewModel.learningContents().length).toEqual(0);
                });

            });

        });

        describe('updateText:', function () {

            var addLearningContent;
            var updateLearningContentText;

            var learningContents = [{ id: '0', text: '0' }, { id: '1', text: '1' }];

            beforeEach(function () {
                viewModel = ctor(questionId, learningContents);

                addLearningContent = Q.defer();
                updateLearningContentText = Q.defer();

                spyOn(repository, 'addLearningContent').andReturn(addLearningContent.promise);
                spyOn(repository, 'updateText').andReturn(updateLearningContentText.promise);
            });

            it('should be function', function () {
                expect(viewModel.updateText).toBeFunction();
            });

            describe('when text is not empty', function () {

                describe('and id is not empty', function () {
                    var text = 'text';
                    var learningContent = { id: ko.observable('learningContentId'), text: ko.observable(text) };

                    describe('and text is not modified', function () {
                        beforeEach(function () {
                            learningContent.originalText = text;
                        });

                        it('should not update learning content text in the repository', function () {
                            viewModel.updateText(learningContent);
                            expect(repository.updateText).not.toHaveBeenCalledWith(learningContent.id(), learningContent.text());
                        });

                    });

                    describe('and text is modified', function () {
                        beforeEach(function () {
                            learningContent.originalText = 'text2';
                        });

                        it('should update learning content text in the repository', function () {
                            var promise = updateLearningContentText.promise.fin(function () { });
                            updateLearningContentText.resolve();

                            viewModel.updateText(learningContent);

                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(repository.updateText).toHaveBeenCalledWith(questionId, learningContent.id(), learningContent.text());
                            });
                        });

                        it('should show notification', function () {
                            var promise = updateLearningContentText.promise.fin(function () { });

                            updateLearningContentText.resolve({ modifiedOn: new Date() });

                            viewModel.updateText(learningContent);

                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(notify.info).toHaveBeenCalled();
                            });
                        });

                        it('should update learning content original text', function () {
                            var promise = updateLearningContentText.promise.fin(function () { });

                            updateLearningContentText.resolve(new Date());

                            viewModel.updateText(learningContent);

                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(learningContent.originalText).toBe(learningContent.text());
                            });
                        });

                    });

                });

                describe('and id is empty', function () {

                    var id = 'id';
                    var learningContent;

                    beforeEach(function () {
                        learningContent = { id: ko.observable(''), text: ko.observable('text') };
                    });

                    it('should add learning content to the repository', function () {
                        viewModel.updateText(learningContent);
                        expect(repository.addLearningContent).toHaveBeenCalledWith(questionId, { text: learningContent.text() });
                    });

                    it('should update learning content id in the viewModel', function () {
                        var promise = addLearningContent.promise.fin(function () { });
                        addLearningContent.resolve({ id: id, createdOn: new Date() });

                        viewModel.updateText(learningContent);

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(learningContent.id()).toEqual(id);
                        });
                    });


                    it('should show notification', function () {
                        var promise = addLearningContent.promise.fin(function () { });
                        addLearningContent.resolve({ id: id, createdOn: new Date() });
                        viewModel.updateText(learningContent);

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(notify.info).toHaveBeenCalled();
                        });
                    });

                    it('should set learning content original text', function () {
                        var promise = addLearningContent.promise.fin(function () { });
                        addLearningContent.resolve({ id: id, createdOn: new Date() });

                        viewModel.updateText(learningContent);

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(learningContent.originalText).toBe(learningContent.text());
                        });
                    });

                });

            });

        });

        describe('isExpanded:', function () {

            beforeEach(function () {
                viewModel = ctor(questionId, []);
            });

            it('should be observable', function () {
                expect(viewModel.isExpanded).toBeObservable();
            });

            it('should be true by default', function () {
                expect(viewModel.isExpanded()).toBeTruthy();
            });

        });

        describe('toggleExpand:', function () {

            beforeEach(function () {
                viewModel = ctor(questionId, []);
            });

            it('should be function', function () {
                expect(viewModel.toggleExpand).toBeFunction();
            });

            it('should toggle isExpanded value', function () {
                viewModel.isExpanded(false);
                viewModel.toggleExpand();
                expect(viewModel.isExpanded()).toEqual(true);
            });

        });

        describe('autosaveInterval:', function () {

            beforeEach(function () {
                viewModel = ctor(questionId, []);
            });

            it('should be number', function () {
                expect(viewModel.autosaveInterval).toEqual(jasmine.any(Number));
            });

        });

        describe('canAddLearningContent:', function () {

            beforeEach(function () {
                viewModel = ctor(questionId, []);
            });

            it('should be computed', function () {
                expect(viewModel.canAddLearningContent).toBeComputed();
            });

            describe('when a learning content with empty id exist', function () {

                it('should be false', function () {
                    viewModel.learningContents([{ id: '' }]);
                    expect(viewModel.canAddLearningContent()).toBeFalsy();
                });

            });

            describe('when a learning content with empty id does not exist', function () {

                it('should be true', function () {
                    viewModel.learningContents([]);
                    expect(viewModel.canAddLearningContent()).toBeTruthy();
                });

            });

        });

    });

});