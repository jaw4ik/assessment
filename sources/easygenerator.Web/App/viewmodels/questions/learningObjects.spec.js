define(function (require) {
    "use strict";

    var
        ctor = require('viewmodels/questions/learningObjects'),
        repository = require('repositories/learningObjectRepository'),
        eventTracker = require('eventTracker'),
        notify = require('notify')
    ;

    describe('viewModel [learningObjects]', function () {

        var viewModel;
        var questionId = 'questionId';

        beforeEach(function () {
            spyOn(notify, 'info');
            spyOn(eventTracker, 'publish');
        });

        describe('learningObjects:', function () {

            beforeEach(function () {
                viewModel = ctor(questionId, []);
            });

            it('should be observable array', function () {
                expect(viewModel.learningObjects).toBeObservable();
            });

        });

        describe('addLearningObject:', function () {

            beforeEach(function () {
                viewModel = ctor(questionId, []);
            });

            it('should be function', function () {
                expect(viewModel.addLearningObject).toBeFunction();
            });

            it('should add empty learning object', function () {
                viewModel.addLearningObject();
                expect(viewModel.learningObjects().length).toEqual(1);
                expect(viewModel.learningObjects()[0].id).toBeObservable();
                expect(viewModel.learningObjects()[0].id()).toEqual("");
                expect(viewModel.learningObjects()[0].text).toBeObservable();
                expect(viewModel.learningObjects()[0].text()).toEqual("");
                expect(viewModel.learningObjects()[0].hasFocus).toBeObservable();
                expect(viewModel.learningObjects()[0].hasFocus()).toBeTruthy();
            });

            it('should send event \'Add learning object\'', function () {
                viewModel.addLearningObject();
                expect(eventTracker.publish).toHaveBeenCalledWith('Add learning object');
            });

        });

        describe('removeLearningObject:', function () {

            beforeEach(function () {
                viewModel = ctor(questionId, []);
            });

            var removeLearningObject;

            beforeEach(function () {
                removeLearningObject = Q.defer();
                spyOn(repository, 'removeLearningObject').andReturn(removeLearningObject.promise);
            });

            it('should be function', function () {
                expect(viewModel.removeLearningObject).toBeFunction();
            });

            it('should send event \'Delete learning object\'', function () {
                viewModel.removeLearningObject({});
                expect(eventTracker.publish).toHaveBeenCalledWith('Delete learning object');
            });

            it('should remove learning object from the repository', function () {
                var learningObject = { id: ko.observable('learningObjectId'), text: ko.observable('') };
                viewModel.learningObjects([learningObject]);
                viewModel.removeLearningObject(learningObject);

                expect(repository.removeLearningObject).toHaveBeenCalledWith(questionId, learningObject.id());
            });

            it('should remove learning object from the viewModel', function () {
                var learningObject = {};
                viewModel.learningObjects([learningObject]);

                viewModel.removeLearningObject(learningObject);

                expect(viewModel.learningObjects().length).toEqual(0);
            });

            it('should show notification', function () {
                var promise = removeLearningObject.promise.fin(function () { });
                var learningObject = {};
                viewModel.learningObjects([learningObject]);
                removeLearningObject.resolve(new Date());

                viewModel.removeLearningObject(learningObject);

                waitsFor(function () {
                    return !promise.isPending();
                });
                runs(function () {
                    expect(notify.info).toHaveBeenCalled();
                });
            });

        });

        describe('beginEditText:', function () {

            it('should be function', function () {
                expect(viewModel.beginEditText).toBeFunction();
            });

            it('should send event \'Start editing learning object\'', function () {
                viewModel.beginEditText({});
                expect(eventTracker.publish).toHaveBeenCalledWith('Start editing learning object');
            });
        });

        describe('endEditText:', function () {

            var removeLearningObject;

            beforeEach(function () {
                viewModel = ctor(questionId, []);
                removeLearningObject = Q.defer();
                spyOn(repository, 'removeLearningObject').andReturn(removeLearningObject.promise);
            });

            it('should be function', function () {
                expect(viewModel.endEditText).toBeFunction();
            });

            it('should send event \'End editing learning object\'', function () {
                var learningObject = { id: ko.observable('learningObjectId'), text: ko.observable('') };
                viewModel.endEditText(learningObject);
                expect(eventTracker.publish).toHaveBeenCalledWith('End editing learning object');
            });

            describe('when text is empty', function () {

                describe('and id is not empty', function () {

                    it('should remove learning object from the repository', function () {
                        var learningObject = { id: ko.observable('learningObjectId'), text: ko.observable('') };
                        viewModel.learningObjects([learningObject]);

                        viewModel.endEditText(learningObject);

                        expect(repository.removeLearningObject).toHaveBeenCalledWith(questionId, learningObject.id());
                    });

                    it('should show notification', function () {
                        var promise = removeLearningObject.promise.fin(function () { });
                        var learningObject = { id: ko.observable('learningObjectId'), text: ko.observable('') };
                        viewModel.learningObjects([learningObject]);
                        removeLearningObject.resolve(new Date());

                        viewModel.endEditText(learningObject);

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(notify.info).toHaveBeenCalled();
                        });
                    });

                });

                describe('and id is empty', function () {

                    it('should not remove learning object from the repository', function () {
                        var learningObject = { id: ko.observable(''), text: ko.observable('') };
                        viewModel.learningObjects([learningObject]);

                        viewModel.endEditText(learningObject);

                        expect(repository.removeLearningObject).not.toHaveBeenCalled();
                    });

                });

                it('should remove learning object from the viewModel', function () {
                    var learningObject = { id: ko.observable(''), text: ko.observable('') };
                    viewModel.learningObjects([learningObject]);

                    viewModel.endEditText(learningObject);

                    expect(viewModel.learningObjects().length).toEqual(0);
                });

            });

        });

        describe('updateText:', function () {

            var getById;
            var addLearningObject;
            var updateLearningObjectText;

            var learningObjects = [{ id: '0', text: '0' }, { id: '1', text: '1' }];

            beforeEach(function () {
                viewModel = ctor(questionId, learningObjects);

                getById = Q.defer();
                addLearningObject = Q.defer();
                updateLearningObjectText = Q.defer();

                spyOn(repository, 'getById').andReturn(getById.promise);
                spyOn(repository, 'addLearningObject').andReturn(addLearningObject.promise);
                spyOn(repository, 'updateText').andReturn(updateLearningObjectText.promise);
            });

            it('should be function', function () {
                expect(viewModel.updateText).toBeFunction();
            });

            describe('when text is not empty', function () {

                describe('and id is not empty', function () {

                    var learningObject = { id: ko.observable('learningObjectId'), text: ko.observable('text') };

                    describe('and text is not modified', function () {

                        it('should not update learning object text in the repository', function () {
                            var promise = getById.promise.fin(function () { });

                            getById.resolve({ id: learningObject.id(), text: 'text' });

                            viewModel.updateText(learningObject);

                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(repository.updateText).not.toHaveBeenCalledWith(learningObject.id(), learningObject.text());
                            });
                        });

                    });

                    describe('and text is modified', function () {

                        it('should update learning object text in the repository', function () {
                            var promise = updateLearningObjectText.promise.fin(function () { });

                            getById.resolve({ id: 'learningObjectId' });
                            updateLearningObjectText.resolve();

                            viewModel.updateText(learningObject);

                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(repository.updateText).toHaveBeenCalledWith(learningObject.id(), learningObject.text());
                            });
                        });

                        it('should show notification', function () {
                            var promise = getById.promise.fin(function () { });

                            getById.resolve({ id: 'learningObjectId' });
                            updateLearningObjectText.resolve(new Date());

                            viewModel.updateText(learningObject);

                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(notify.info).toHaveBeenCalled();
                            });
                        });

                    });

                });

                describe('and id is empty', function () {

                    var id = 'id';

                    it('should add learning object to the repository', function () {
                        var learningObject = { id: ko.observable(''), text: ko.observable('text') };

                        viewModel.updateText(learningObject);
                        expect(repository.addLearningObject).toHaveBeenCalledWith(questionId, { text: learningObject.text() });
                    });

                    it('should update learning object id in the viewModel', function () {
                        var learningObject = { id: ko.observable(''), text: ko.observable('text') };
                        var promise = addLearningObject.promise.fin(function () { });
                        addLearningObject.resolve({ id: id, createdOn: new Date() });

                        viewModel.updateText(learningObject);

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(learningObject.id()).toEqual(id);
                        });
                    });


                    it('should show notification', function () {
                        var learningObject = { id: ko.observable(''), text: ko.observable('text') };
                        var promise = addLearningObject.promise.fin(function () { });
                        addLearningObject.resolve({ id: id, createdOn: new Date() });

                        viewModel.updateText(learningObject);

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

        describe('canAddLearningObject:', function () {

            beforeEach(function () {
                viewModel = ctor(questionId, []);
            });

            it('should be computed', function () {
                expect(viewModel.canAddLearningObject).toBeComputed();
            });

            describe('when a learning object with empty id exist', function () {

                it('should be false', function () {
                    viewModel.learningObjects([{ id: '' }]);
                    expect(viewModel.canAddLearningObject()).toBeFalsy();
                });

            });

            describe('when a learning object with empty id does not exist', function () {

                it('should be true', function () {
                    viewModel.learningObjects([]);
                    expect(viewModel.canAddLearningObject()).toBeTruthy();
                });

            });

        });

    });

});