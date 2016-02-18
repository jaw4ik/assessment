import viewModel from './learningContents';

import learningContentsViewModelFactory from './learningContentsViewModelFactory';
import ko from 'knockout';
import repository from 'repositories/learningContentRepository';
import questionRepository from 'repositories/questionRepository';
import eventTracker from 'eventTracker';
import notify from 'notify';
import constants from 'constants';
import router from 'plugins/router';

describe('viewModel [learningContents]', function () {

    var questionId = 'questionId';

    beforeEach(function () {
        viewModel.questionType = '';
        spyOn(notify, 'saved');
        spyOn(eventTracker, 'publish');
    });

    it('should be defined', function () {
        expect(viewModel).toBeDefined();
    });

    describe('autosaveInterval', function () {

        it('should be defined', function () {
            expect(viewModel.autosaveInterval).toBeDefined();
        });

    });

    describe('learningContents:', function () {

        it('should be observable array', function () {
            expect(viewModel.learningContents).toBeObservableArray();
        });

    });

    describe('questionId', function () {

        it('should be defined', function () {
            expect(viewModel.questionId).toBeDefined();
        });

    });

    describe('questionType', function () {

        it('should be defined', function () {
            expect(viewModel.questionType).toBeDefined();
        });

    });

    describe('eventTracker', function () {

        it('should be defined', function () {
            expect(viewModel.eventTracker).toBeDefined();
        });

    });

    describe('isAddedButtonsShown', function () {

        it('should be defined', function () {
            expect(viewModel.isAddedButtonsShown).toBeObservable();
        });

    });

    describe('toggleIsAddedButtonsShown:', function () {

        it('should be function', function () {
            expect(viewModel.toggleIsAddedButtonsShown).toBeFunction();
        });

        describe('when added buttons shown', function () {

            it('should set isAddedButtonsShown to false', function () {
                viewModel.isAddedButtonsShown(true);
                viewModel.toggleIsAddedButtonsShown();
                expect(viewModel.isAddedButtonsShown()).toBeFalsy();
            });

        });

        describe('when added buttons not shown', function () {

            it('should set isAddedButtonsShown to true', function () {
                viewModel.isAddedButtonsShown(false);
                viewModel.toggleIsAddedButtonsShown();
                expect(viewModel.isAddedButtonsShown()).toBeTruthy();
            });

        });

    });

    describe('addContent', function () {

        var content;

        beforeEach(function () {
            content = {
                type: constants.learningContentsTypes.content,
                canBeAdded: ko.observable(true)
            };

            spyOn(learningContentsViewModelFactory, constants.learningContentsTypes.content).and.returnValue(content);
        });

        it('should be function', function () {
            expect(viewModel.addContent).toBeFunction();
        });

        it('should add content to array', function () {
            viewModel.learningContents([]);
            viewModel.addContent();
            expect(viewModel.learningContents()[0]).toBe(content);
        });

        it('should hide add buttons', function () {
            viewModel.isAddedButtonsShown(true);
            viewModel.addContent();
            expect(viewModel.isAddedButtonsShown()).toBeFalsy();
        });

    });

    describe('addHotspotOnAnImage:', function () {

        var hotspot;

        beforeEach(function () {
            hotspot = {
                type: constants.learningContentsTypes.hotspot,
                canBeAdded: ko.observable(false)
            };

            spyOn(learningContentsViewModelFactory, constants.learningContentsTypes.hotspot).and.returnValue(hotspot);
        });

        it('should be function', function () {
            expect(viewModel.addHotspotOnAnImage).toBeFunction();
        });

        it('should add content to array later', function () {
            viewModel.learningContents([]);
            viewModel.addHotspotOnAnImage();
            hotspot.canBeAdded(true);
            expect(viewModel.learningContents()[0]).toBe(hotspot);
        });

        it('should hide add buttons', function () {
            viewModel.isAddedButtonsShown(true);
            viewModel.addContent();
            hotspot.canBeAdded(true);
            expect(viewModel.isAddedButtonsShown()).toBeFalsy();
        });

    });

    describe('updateOrder:', function () {

        beforeEach(function () {
            var def = Q.defer();
            def.resolve();
            spyOn(questionRepository, 'updateLearningContentsOrder').and.returnValue(def.promise);
            viewModel.learningContents([]);
        });

        it('should be function', function () {
            expect(viewModel.updateOrder).toBeFunction();
        });

        it('should reset changesFromCollaborator', function () {
            viewModel.changesFromCollaborator = {
                question: { id: 'id' }, learningContentsIds: ['id2', 'id1']
            }
            viewModel.updateOrder();
            expect(viewModel.changesFromCollaborator).toBeNull();
        });

        it('should send event to mixPanel', function () {
            viewModel.updateOrder();
            expect(eventTracker.publish).toHaveBeenCalledWith('Change order of Learning Contents');
        });

        it('should update learning contents order', function () {
            viewModel.updateOrder();
            expect(questionRepository.updateLearningContentsOrder).toHaveBeenCalled();
        });

    });

    describe('startReordering:', function () {

        it('should be function', function () {
            expect(viewModel.startReordering).toBeFunction();
        });

        it('should set orderInProcess', function () {
            viewModel.orderInProcess = false;
            viewModel.startReordering();

            expect(viewModel.orderInProcess).toBeTruthy();
        });

    });

    describe('stopReordering:', function () {

        beforeEach(function () {
            viewModel.learningContents([{ id: ko.observable('id1') }, { id: ko.observable('id2') }]);
            viewModel.questionId = 'id';
        });

        it('should be function', function () {
            expect(viewModel.stopReordering).toBeFunction();
        });

        it('should reset orderInProcess', function () {
            viewModel.orderInProcess = true;
            viewModel.stopReordering();
            expect(viewModel.orderInProcess).toBeFalsy();
        });

        it('should reset changesFromCollaborator', function () {
            viewModel.orderInProcess = true;
            viewModel.changesFromCollaborator = {
                question: { id: 'id' }, learningContentsIds: ['id1', 'id2']
            };
            viewModel.stopReordering();
            expect(viewModel.changesFromCollaborator).toBeNull();
        });

        describe('when learning contents have not been reordered by collaborator', function () {

            it('should not reorder learning contents', function () {
                var learningContentsIds = viewModel.learningContents()[0].id() + viewModel.learningContents()[1].id();
                viewModel.changesFromCollaborator = null;
                viewModel.stopReordering();
                expect(viewModel.learningContents()[0].id() + viewModel.learningContents()[1].id()).toBe(learningContentsIds);
            });

        });

        describe('when learning contents have been reordered by collaborator', function () {

            describe('and question Id is equals to current question Id', function () {

                it('should reorder learning contents', function () {
                    var learningContentsIds = viewModel.learningContents()[1].id() + viewModel.learningContents()[0].id();
                    viewModel.changesFromCollaborator = {
                        question: { id: 'id' }, learningContentsIds: ['id2', 'id1']
                    }
                    viewModel.stopReordering();
                    expect(viewModel.learningContents()[0].id() + viewModel.learningContents()[1].id()).toBe(learningContentsIds);
                });
            });

            describe('and question Id is not equals to current question Id', function () {

                it('should not reorder learning contents', function () {
                    var learningContentsIds = viewModel.learningContents()[0].id() + viewModel.learningContents()[1].id();
                    viewModel.changesFromCollaborator = {
                        question: { id: 'anotherid' }, learningContentsIds: ['id2', 'id1']
                    }
                    viewModel.stopReordering();
                    expect(viewModel.learningContents()[0].id() + viewModel.learningContents()[1].id()).toBe(learningContentsIds);
                });
            });

        });

    });

    describe('learningContentsReorderedByCollaborator:', function () {
        beforeEach(function () {
            var learningContents = [
                        { id: ko.observable('id1') },
                        { id: ko.observable('id2') },
                        { id: ko.observable('id3') },
                        { id: ko.observable('id4') }
            ];
            viewModel.learningContents(learningContents);
        });

        it('should be function', function () {
            expect(viewModel.learningContentsReorderedByCollaborator).toBeFunction();
        });

        describe('when question id corresponds current question', function () {

            var newLearningContentsIds;

            beforeEach(function () {
                viewModel.questionId = 'qid';
                newLearningContentsIds = ['id4', 'id3', 'id2', 'id1'];
            });

            describe('when some learning contents is removed from viewModel', function () {

                var newLearningContent = { id: ko.observable('id5'), isRemoved: ko.observable(true) };

                beforeEach(function () {
                    viewModel.learningContents.push(newLearningContent);
                });

                describe('and orderInProcess is false', function () {

                    beforeEach(function () {
                        viewModel.orderInProcess = false;
                    });

                    it('should update order of learning contents', function () {
                        var currentLc = viewModel.learningContents();
                        var currentOrder = currentLc[0].id() + currentLc[1].id() + currentLc[2].id() + currentLc[3].id() + currentLc[4].id();

                        viewModel.learningContentsReorderedByCollaborator({ id: viewModel.questionId }, newLearningContentsIds);

                        var resultOrder = viewModel.learningContents();
                        expect(resultOrder[4].id() + resultOrder[3].id() + resultOrder[2].id() + resultOrder[0].id() + resultOrder[1].id()).toBe(currentOrder);
                    });
                });

                describe('and orderInProcess is true', function () {
                    beforeEach(function () {
                        viewModel.orderInProcess = true;
                    });

                    it('should set changesFromCollaborator', function () {
                        viewModel.changesFromCollaborator = null;
                        var currentLc = viewModel.learningContents();
                        var currentOrder = currentLc[0].id() + currentLc[1].id() + currentLc[2].id() + currentLc[3].id();

                        viewModel.learningContentsReorderedByCollaborator({ id: viewModel.questionId }, newLearningContentsIds);

                        var resultOrder = viewModel.changesFromCollaborator.learningContentsIds;

                        expect(resultOrder[3] + resultOrder[2] + resultOrder[1] + resultOrder[0]).toBe(currentOrder);
                    });

                    it('should not update order of learning contents', function () {
                        var currentLc = viewModel.learningContents();
                        var currentOrder = currentLc[0].id() + currentLc[1].id() + currentLc[2].id() + currentLc[3].id();

                        viewModel.learningContentsReorderedByCollaborator({ id: viewModel.questionId }, newLearningContentsIds);

                        var resultOrder = viewModel.learningContents();
                        expect(resultOrder[0].id() + resultOrder[1].id() + resultOrder[2].id() + resultOrder[3].id()).toBe(currentOrder);
                    });
                });

            });

            describe('when numbers of learning contents are equal', function () {

                describe('and orderInProcess is false', function () {

                    beforeEach(function () {
                        viewModel.orderInProcess = false;
                    });

                    it('should update order of learning contents', function () {
                        var currentLc = viewModel.learningContents();
                        var currentOrder = currentLc[0].id() + currentLc[1].id() + currentLc[2].id() + currentLc[3].id();

                        viewModel.learningContentsReorderedByCollaborator({ id: viewModel.questionId }, newLearningContentsIds);

                        var resultOrder = viewModel.learningContents();
                        expect(resultOrder[3].id() + resultOrder[2].id() + resultOrder[1].id() + resultOrder[0].id()).toBe(currentOrder);
                    });
                });

                describe('and orderInProcess is true', function () {
                    beforeEach(function () {
                        viewModel.orderInProcess = true;
                    });

                    it('should set changesFromCollaborator', function () {
                        viewModel.changesFromCollaborator = null;
                        var currentLc = viewModel.learningContents();
                        var currentOrder = currentLc[0].id() + currentLc[1].id() + currentLc[2].id() + currentLc[3].id();

                        viewModel.learningContentsReorderedByCollaborator({ id: viewModel.questionId }, newLearningContentsIds);

                        var resultOrder = viewModel.changesFromCollaborator.learningContentsIds;

                        expect(resultOrder[3] + resultOrder[2] + resultOrder[1] + resultOrder[0]).toBe(currentOrder);
                    });

                    it('should not update order of learning contents', function () {
                        var currentLc = viewModel.learningContents();
                        var currentOrder = currentLc[0].id() + currentLc[1].id() + currentLc[2].id() + currentLc[3].id();

                        viewModel.learningContentsReorderedByCollaborator({ id: viewModel.questionId }, newLearningContentsIds);

                        var resultOrder = viewModel.learningContents();
                        expect(resultOrder[0].id() + resultOrder[1].id() + resultOrder[2].id() + resultOrder[3].id()).toBe(currentOrder);
                    });
                });

            });

        });

        describe('when question id doesn\'t correspond current question', function () {

            var collaboratorslearningContents = [
                        'id4',
                        'id3',
                        'id2',
                        'id1'
            ];

            beforeEach(function () {
                viewModel.questionId = 'someId';
            });

            it('should not update order of learning contents', function () {
                var question = { id: 'id' };
                var currentLc = viewModel.learningContents();
                var currentOrder = currentLc[0].id() + currentLc[1].id() + currentLc[2].id() + currentLc[3].id();

                viewModel.learningContentsReorderedByCollaborator(question, collaboratorslearningContents);

                var resultOrder = viewModel.learningContents();
                expect(resultOrder[0].id() + resultOrder[1].id() + resultOrder[2].id() + resultOrder[3].id()).toBe(currentOrder);
            });

            it('should not set changes from collaborator', function () {
                var question = { id: 'id' };
                viewModel.changesFromCollaborator = null;
                viewModel.learningContentsReorderedByCollaborator(question, collaboratorslearningContents);

                expect(viewModel.changesFromCollaborator).toBeNull();
            });

        });
    });

    describe('createdByCollaborator:', function () {
        var question = { id: questionId },
            learningContent = { id: 'learningContentId', text: 'some text', type: constants.learningContentsTypes.content };

        beforeEach(function () {
            viewModel.questionId = questionId;
        });

        it('should be function', function () {
            expect(viewModel.createdByCollaborator).toBeFunction();
        });

        describe('when it is current question', function () {

            it('should add learning content to list', function () {
                viewModel.learningContents([]);
                viewModel.createdByCollaborator(question, learningContent);

                expect(viewModel.learningContents().length).toBe(1);
                expect(viewModel.learningContents()[0].id()).toBe(learningContent.id);
            });

        });

        describe('when it is not current question', function () {

            it('should not add learning content to list', function () {
                viewModel.learningContents([]);
                question.id = 'another id';
                viewModel.createdByCollaborator(question, learningContent);

                expect(viewModel.learningContents().length).toBe(0);
            });

        });

    });

    describe('deletedByCollaborator:', function () {
        var question = { id: questionId },
            learningContentId = 'learningContentId';

        it('should be function', function () {
            expect(viewModel.deletedByCollaborator).toBeFunction();
        });

        describe('when question is not current question', function () {

            it('should not delete learning content from list', function () {
                viewModel.learningContents([{ id: ko.observable(learningContentId), hasFocus: ko.observable(false) }]);
                question.id = 'another id';

                viewModel.deletedByCollaborator(question, learningContentId);
                expect(viewModel.learningContents().length).toEqual(1);
            });

        });

        describe('when question is current question', function () {

            beforeEach(function () {
                viewModel.questionId = question.id;
            });

            describe('and learning content with appropriate id exists', function () {

                describe('and does not have focus', function () {

                    it('should remove learning objective', function () {
                        viewModel.learningContents([{ id: ko.observable(learningContentId), hasFocus: ko.observable(false) }]);
                        viewModel.deletedByCollaborator(question, learningContentId);

                        expect(viewModel.learningContents().length).toEqual(0);
                    });

                });

                describe('and has focus', function () {

                    beforeEach(function () {
                        viewModel.learningContents([{ id: ko.observable(learningContentId), hasFocus: ko.observable(true) }]);
                        spyOn(notify, 'error');
                    });

                    it('should not remove learning objective', function () {
                        viewModel.deletedByCollaborator(question, learningContentId);
                        expect(viewModel.learningContents().length).toEqual(1);
                    });

                    it('should show error notification', function () {
                        viewModel.deletedByCollaborator(question, learningContentId);
                        expect(notify.error).toHaveBeenCalled();
                    });

                    it('should set \'isDeleted\' of learningContent to true', function () {
                        viewModel.deletedByCollaborator(question, learningContentId);
                        expect(viewModel.learningContents()[0].isDeleted).toBeTruthy();
                    });

                });

            });

            describe('and learning content with appropriate id does not exist', function () {

                it('should not remove learning objective', function () {
                    viewModel.learningContents([{ id: ko.observable('otherId') }]);
                    viewModel.deletedByCollaborator(question, learningContentId);

                    expect(viewModel.learningContents().length).toEqual(1);
                });

            });

        });

    });

    describe('textUpdatedByCollaborator:', function () {
        var question = { id: questionId },
            learningContent = { id: ko.observable('0'), text: ko.observable(''), originalText: '', hasFocus: ko.observable(false) },
            updatedLearningContent = { id: '0', text: 'newLearningContent' };

        it('should be function', function () {
            expect(viewModel.textUpdatedByCollaborator).toBeFunction();
        });

        describe('when question is not current question', function () {

            it('should not update learning content', function () {
                viewModel.learningContents([{ id: ko.observable('0'), text: ko.observable(''), originalText: '', hasFocus: ko.observable(false) }]);

                viewModel.textUpdatedByCollaborator(question, updatedLearningContent);
                expect(viewModel.learningContents()[0].text()).toBe('');
            });

        });

        describe('when question is current question', function () {

            beforeEach(function () {
                viewModel.questionId = question.id;
            });

            describe('and learning content is found', function () {

                beforeEach(function () {
                    viewModel.learningContents([learningContent]);
                });

                it('should update original text', function () {
                    viewModel.learningContents()[0].originalText = '';
                    viewModel.textUpdatedByCollaborator(question, updatedLearningContent);

                    expect(viewModel.learningContents()[0].originalText).toBe(updatedLearningContent.text);
                });

                describe('and it does not have focus', function () {

                    it('should be updated', function () {
                        viewModel.learningContents()[0].text('');
                        viewModel.learningContents()[0].hasFocus(false);
                        viewModel.textUpdatedByCollaborator(question, updatedLearningContent);

                        expect(viewModel.learningContents()[0].text()).toBe(updatedLearningContent.text);
                    });

                });

                describe('and has focus', function () {

                    it('should not be updated', function () {
                        viewModel.learningContents()[0].text('');
                        viewModel.learningContents()[0].hasFocus(true);
                        viewModel.textUpdatedByCollaborator(question, updatedLearningContent);

                        expect(viewModel.learningContents()[0].text()).not.toBe(updatedLearningContent.text);
                    });

                });

            });

        });

    });

    describe('isExpanded:', function () {

        it('should be observable', function () {
            expect(viewModel.isExpanded).toBeObservable();
        });

        it('should be true by default', function () {
            expect(viewModel.isExpanded()).toBeTruthy();
        });

    });

    describe('toggleExpand:', function () {

        it('should be function', function () {
            expect(viewModel.toggleExpand).toBeFunction();
        });

        it('should toggle isExpanded value', function () {
            viewModel.isExpanded(false);
            viewModel.toggleExpand();
            expect(viewModel.isExpanded()).toEqual(true);
        });

    });

    describe('initialize:', function () {

        var activationData = {
            id: questionId
        },
            getLearningContentFeedbackDeferred;

        beforeEach(function () {
            getLearningContentFeedbackDeferred = Q.defer();
            spyOn(repository, 'getCollection').and.returnValue(getLearningContentFeedbackDeferred.promise);
        });

        it('should be function', function () {
            expect(viewModel.initialize).toBeFunction();
        });

        it('should return promise', function () {
            getLearningContentFeedbackDeferred.resolve([]);
            expect(viewModel.initialize(activationData)).toBePromise();
        });

        describe('when route data has questionId', function () {
            beforeEach(function () {
                spyOn(router, 'routeData').and.returnValue({ questionId: 'questionId' });
            });

            it('should call repository method to get learning contents', function (done) {
                getLearningContentFeedbackDeferred.resolve([]);
                viewModel.initialize(activationData).fin(function () {
                    expect(repository.getCollection).toHaveBeenCalledWith(questionId);
                    done();
                });
            });

        });

        describe('when route data does not have questionId', function () {
            beforeEach(function () {
                spyOn(router, 'routeData').and.returnValue({});
            });

            it('should not call repository method to get learning contents', function (done) {
                viewModel.initialize(activationData).fin(function () {
                    expect(repository.getCollection).not.toHaveBeenCalled();
                    done();
                });
            });
        });
    });

    describe('localizationManager:', function () {

        it('should be defined', function () {
            expect(viewModel.localizationManager).toBeDefined();
        });

    });

    describe('isSortingEnabled:', function () {

        it('should be computed', function () {
            expect(viewModel.isSortingEnabled).toBeComputed();
        });

        describe('when learning contents count is 0', function () {

            it('should be falsy', function () {
                viewModel.learningContents([]);

                expect(viewModel.isSortingEnabled()).toBeFalsy();
            });

        });

        describe('when learning contents count is 1', function () {

            it('should be falsy', function () {
                viewModel.learningContents([{ id: 'id' }]);

                expect(viewModel.isSortingEnabled()).toBeFalsy();
            });

        });

        describe('when learning contents count is more than 1', function () {

            it('should be truthy', function () {
                viewModel.learningContents([
                    { id: 'id' },
                    { id: 'id2' }
                ]);

                expect(viewModel.isSortingEnabled()).toBeTruthy();
            });

        });

    });

    describe('orderInProcess:', function () {

        it('should be defined', function () {
            expect(viewModel.orderInProcess).toBeDefined();
        });

    });

    describe('changesFromCollaborator:', function () {

        it('should be defined', function () {
            expect(viewModel.changesFromCollaborator).toBeDefined();
        });

    });

    describe('removeLearningContent', function () {
        var learningContents = [
                       { id: ko.observable(''), isRemoved: ko.observable(false), text: ko.observable("123") },
                       { id: ko.observable('id2'), isRemoved: ko.observable(false), text: ko.observable("123") },
                       { id: ko.observable('id3'), isRemoved: ko.observable(false), text: ko.observable("123") },
                       { id: ko.observable('id4'), isRemoved: ko.observable(false), text: ko.observable("123") }
        ];

        beforeEach(function () {
            viewModel.learningContents(learningContents.slice(0));
        });

        it('should be function', function () {
            expect(viewModel.removeLearningContent).toBeFunction();
        });

        describe('when id is empty', function () {

            it('should remove learning content from the list', function () {
                viewModel.removeLearningContent(learningContents[0]);
                expect(viewModel.learningContents().length).toBe(3);
            });

        });

        describe('when learning content is deleted', function () {

            it('should remove learning content from the list', function () {
                viewModel.learningContents()[1].isDeleted = true;
                viewModel.removeLearningContent(learningContents[1]);
                expect(viewModel.learningContents().length).toBe(3);
            });

        });

        describe('when learning content is empty', function () {

            it('should remove learning content from the list', function () {
                learningContents[1].text("");
                viewModel.learningContents([learningContents[1]]);
                viewModel.removeLearningContent(learningContents[1]);
                expect(viewModel.learningContents().length).toBe(0);
            });

        });

        it('should set isRemoved to true', function () {
            viewModel.removeLearningContent(learningContents[2]);
            expect(viewModel.learningContents()[2].isRemoved()).toBeTruthy();
        });

    });

    describe('restoreLearningContent', function () {
        var learningContents = [
                       { id: ko.observable('id1'), isRemoved: ko.observable(false) },
                       { id: ko.observable('id2'), isRemoved: ko.observable(true) },
                       { id: ko.observable('id3'), isRemoved: ko.observable(true) },
                       { id: ko.observable('id4'), isRemoved: ko.observable(false) }
        ];

        var defer = Q.defer();

        beforeEach(function () {
            viewModel.learningContents(learningContents.slice(0));
            viewModel.questionId = '123';
            spyOn(questionRepository, 'updateLearningContentsOrder').and.returnValue(defer.promise);
        });

        it('should be function', function () {
            expect(viewModel.restoreLearningContent).toBeFunction();
        });

        it('should return promise', function () {
            expect(viewModel.restoreLearningContent(learningContents[1])).toBePromise();
        });

        it('should set isRemoved to true', function () {
            viewModel.restoreLearningContent(learningContents[1]);
            viewModel.learningContents()[1].isRemoved(false);
        });

        it('should update learning contents order', function (done) {
            defer.resolve();
            var promise = viewModel.restoreLearningContent(learningContents[1]);
            promise.fin(function () {
                expect(questionRepository.updateLearningContentsOrder).toHaveBeenCalledWith(viewModel.questionId, _.reject(viewModel.learningContents(), function (item) {
                    return item.isRemoved() == true;
                }));
                done();
            });
        });

        it('should show notification saved message', function (done) {
            defer.resolve();
            var promise = viewModel.restoreLearningContent(learningContents[1]);
            promise.fin(function () {
                expect(notify.saved).toHaveBeenCalled();
                done();
            });

        });

    });

});
