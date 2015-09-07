define(['viewmodels/questions/dragAndDropText/dragAndDropText', 'viewmodels/questions/dragAndDropText/dropspot'], function (viewModel, Dropspot) {

    var
        notify = require('notify'),
        designer = require('viewmodels/questions/dragAndDropText/designer'),
        localizationManager = require('localization/localizationManager');

    describe('dragAndDropText:', function () {

        var objectiveId = 'objectiveId',
            question = {
                id: '1',
                title: 'lalala',
                content: 'ololosh',
                createdOn: new Date(),
                modifiedOn: new Date(),
                answerOptions: [],
                learningContents: []
            };

        describe('initialize:', function () {
            var designerActivateDefer;

            beforeEach(function () {
                designerActivateDefer = Q.defer();
                spyOn(designer, 'activate').and.returnValue(designerActivateDefer.promise);

                spyOn(localizationManager, 'localize').and.callFake(function (arg) {
                    return arg;
                });
            });

            it('should be function', function () {
                expect(viewModel.initialize).toBeFunction();
            });

            it('should return promise', function () {
                var promise = viewModel.initialize(objectiveId, question);
                expect(promise).toBePromise();
            });

            it('should set objectiveId', function () {
                viewModel.initialize(objectiveId, question);

                expect(viewModel.objectiveId).toBe(objectiveId);
            });

            it('should set questionId', function () {
                viewModel.initialize(objectiveId, question);

                expect(viewModel.questionId).toBe(question.id);
            });

            it('should call designer activate', function () {
                viewModel.initialize(objectiveId, question);

                expect(designer.activate).toHaveBeenCalledWith(question.id);
            });

            describe('when designer is activated', function () {
                beforeEach(function () {
                    designerActivateDefer.resolve();
                });

                it('should return object', function (done) {
                    var promise = viewModel.initialize(objectiveId, question);
                    promise.then(function (result) {
                        expect(result).toBeObject();
                        done();
                    });
                });

                describe('and result object', function () {
                    it('should contain \'DragAndDropTextEditor\' viewCaption', function (done) {
                        var promise = viewModel.initialize(objectiveId, question);
                        promise.then(function (result) {
                            expect(result.viewCaption).toBe('DragAndDropTextEditor');
                            done();
                        });
                    });

                    it('should have hasQuestionView property with true value', function (done) {
                        var promise = viewModel.initialize(objectiveId, question);
                        promise.then(function (result) {
                            expect(result.hasQuestionView).toBeTruthy();
                            done();
                        });
                    });

                    it('should have hasQuestionContent property with true value', function (done) {
                        var promise = viewModel.initialize(objectiveId, question);
                        promise.then(function (result) {
                            expect(result.hasQuestionContent).toBeTruthy();
                            done();
                        });
                    });

                    it('should have hasFeedback property with true value', function (done) {
                        var promise = viewModel.initialize(objectiveId, question);
                        promise.then(function (result) {
                            expect(result.hasFeedback).toBeTruthy();
                            done();
                        });
                    });
                });

            });
        });

        describe('backgroundChangedByCollaborator:', function () {
            var question = { id: '1', background: 'some image' };

            it('should be function', function () {
                expect(viewModel.backgroundChangedByCollaborator).toBeFunction();
            });

            describe('when current question background is changed', function () {
                beforeEach(function () {
                    viewModel.questionId = question.id;
                });

                it('should update background', function () {
                    designer.background('');
                    viewModel.backgroundChangedByCollaborator(question);
                    expect(designer.background()).toBe(question.background);
                });
            });

            describe('when it is not current question background changed', function () {
                beforeEach(function () {
                    viewModel.questionId = 'otherId';
                });

                it('should not update background', function () {
                    designer.background('');
                    viewModel.backgroundChangedByCollaborator(question);
                    expect(designer.background()).toBe('');
                });
            });
        });

        describe('dropspotCreatedByCollaborator:', function () {
            var questionId = 'questionId',
                dropspotId = 'dropspotId';

            it('should be function', function () {
                expect(viewModel.dropspotCreatedByCollaborator).toBeFunction();
            });

            describe('when dropspot is created in current question', function () {
                beforeEach(function () {
                    viewModel.questionId = questionId;
                });

                it('should add new dropspot', function () {
                    designer.dropspots([]);
                    viewModel.dropspotCreatedByCollaborator(questionId, dropspotId, 'some text');
                    expect(designer.dropspots().length).toBe(1);
                    expect(designer.dropspots()[0].id).toBe(dropspotId);
                });
            });

            describe('when dropspot is created not in current question', function () {
                beforeEach(function () {
                    viewModel.questionId = 'otherId';
                });

                it('should not add new dropspot', function () {
                    designer.dropspots([]);
                    viewModel.dropspotCreatedByCollaborator(questionId, dropspotId, 'some text');
                    expect(designer.dropspots().length).toBe(0);
                });
            });
        });

        describe('dropspotTextChangedByCollaborator:', function () {

            it('should be function', function () {
                expect(viewModel.dropspotTextChangedByCollaborator).toBeFunction();
            });

            describe('when it is not current question', function () {
                var dropspot = { id: 'dropspotId', text: ko.observable('dropspot') },
                        questionId = 'questionId';

                it('should not update text', function () {
                    designer.dropspots([dropspot]);
                    viewModel.questionId = 'otherId';

                    viewModel.dropspotTextChangedByCollaborator(questionId, dropspot.id, 'test');
                    expect(designer.dropspots()[0].text()).toBe('dropspot');
                });
            });

            describe('when it is current question', function () {
                var dropspot,
                    questionId = 'questionId';

                beforeEach(function () {
                    dropspot = new Dropspot('id', 'dropspot', 10, 20);
                    viewModel.questionId = questionId;
                    spyOn(dropspot, 'changeOriginalText');
                });

                describe('and dropspot is found', function () {
                    beforeEach(function () {
                        designer.dropspots([dropspot]);
                    });

                    it('should change original text for dropspot', function () {
                        viewModel.dropspotTextChangedByCollaborator(questionId, dropspot.id, 'test');
                        expect(dropspot.changeOriginalText).toHaveBeenCalled();
                    });

                    describe('and dropspot text is in editing', function () {
                        beforeEach(function () {
                            dropspot.text.isEditing = ko.observable(true);
                        });

                        it('should not update text', function () {
                            viewModel.dropspotTextChangedByCollaborator(questionId, dropspot.id, 'test');
                            expect(designer.dropspots()[0].text()).toBe('dropspot');
                        });
                    });

                    describe('and dropspot text is not in editing', function () {
                        beforeEach(function () {
                            dropspot.text.isEditing = ko.observable(false);
                        });

                        it('should update text', function () {
                            viewModel.dropspotTextChangedByCollaborator(questionId, dropspot.id, 'test');
                            expect(designer.dropspots()[0].text()).toBe('test');
                        });
                    });
                });
            });

        });

        describe('dropspotPositionChangedByCollaborator:', function () {

            it('should be function', function () {
                expect(viewModel.dropspotPositionChangedByCollaborator).toBeFunction();
            });

            describe('when it is current question', function () {
                var dropspot,
                    questionId = 'questionId';

                beforeEach(function () {
                    dropspot = new Dropspot('id', 'dropspot', 10, 20);
                    viewModel.questionId = questionId;
                });

                describe('and dropspot is found', function () {
                    beforeEach(function () {
                        designer.dropspots([dropspot]);
                    });

                    describe('and dropspot position is in moving', function () {
                        beforeEach(function () {
                            dropspot.position.isMoving = ko.observable(true);
                        });

                        it('should not update position', function () {
                            viewModel.dropspotPositionChangedByCollaborator(questionId, dropspot.id, 30, 40);
                            expect(designer.dropspots()[0].position.x()).toBe(10);
                            expect(designer.dropspots()[0].position.y()).toBe(20);
                        });
                    });

                    describe('and dropspot position is not in moving', function () {
                        beforeEach(function () {
                            dropspot.position.isMoving = ko.observable(false);
                        });

                        it('should update position', function () {
                            viewModel.dropspotPositionChangedByCollaborator(questionId, dropspot.id, 30, 40);
                            expect(designer.dropspots()[0].position.x()).toBe(30);
                            expect(designer.dropspots()[0].position.y()).toBe(40);
                        });
                    });
                });
            });

            describe('when it is not current question', function () {
                var dropspot,
                    questionId = 'questionId';

                beforeEach(function () {
                    dropspot = new Dropspot('id', 'dropspot', 10, 20);
                    designer.dropspots([dropspot]);
                    viewModel.questionId = 'otherId';
                });

                it('should not update position', function () {
                    viewModel.dropspotPositionChangedByCollaborator(questionId, dropspot.id, 30, 40);
                    expect(designer.dropspots()[0].position.x()).toBe(10);
                    expect(designer.dropspots()[0].position.y()).toBe(20);
                });
            });
        });

        describe('dropspotDeletedByCollaborator:', function () {

            it('should be function', function () {
                expect(viewModel.dropspotDeletedByCollaborator).toBeFunction();
            });

            describe('when it is current question', function () {
                var dropspot,
                    questionId = 'questionId';

                beforeEach(function () {
                    dropspot = new Dropspot('id', 'dropspot', 10, 20);
                    viewModel.questionId = questionId;
                });

                describe('and dropspot is found', function () {
                    beforeEach(function () {
                        designer.dropspots([dropspot]);
                    });

                    it('should delete dropspot from list', function () {
                        viewModel.dropspotDeletedByCollaborator(questionId, dropspot.id);
                        expect(designer.dropspots().length).toBe(0);
                    });

                    describe('and dropspot text is in editing', function () {
                        beforeEach(function () {
                            dropspot.text.isEditing = ko.observable(true);
                            spyOn(notify, 'error');
                        });

                        it('should not delete dropspot from list', function () {
                            viewModel.dropspotDeletedByCollaborator(questionId, dropspot.id);
                            expect(designer.dropspots().length).toBe(1);
                        });

                        it('should mark dropspot as isDeleted', function () {
                            viewModel.dropspotDeletedByCollaborator(questionId, dropspot.id);
                            expect(dropspot.isDeleted).toBeTruthy();
                        });

                        it('should show error notification', function () {
                            viewModel.dropspotDeletedByCollaborator(questionId, dropspot.id);
                            expect(notify.error).toHaveBeenCalled();
                        });
                    });

                    describe('and dropspot position is in moving', function () {
                        beforeEach(function () {
                            dropspot.position.isMoving = ko.observable(true);
                            spyOn(notify, 'error');
                        });

                        it('should not delete dropspot from list', function () {
                            viewModel.dropspotDeletedByCollaborator(questionId, dropspot.id);
                            expect(designer.dropspots().length).toBe(1);
                        });

                        it('should mark dropspot as isDeleted', function () {
                            viewModel.dropspotDeletedByCollaborator(questionId, dropspot.id);
                            expect(dropspot.isDeleted).toBeTruthy();
                        });

                        it('should show error notification', function () {
                            viewModel.dropspotDeletedByCollaborator(questionId, dropspot.id);
                            expect(notify.error).toHaveBeenCalled();
                        });
                    });
                });
            });

            describe('when it is not current question', function () {
                var dropspot,
                    questionId = 'questionId';

                beforeEach(function () {
                    dropspot = new Dropspot('id', 'dropspot', 10, 20);
                    designer.dropspots([dropspot]);
                    viewModel.questionId = 'otherId';
                });

                it('should not delete dropspot from list', function () {
                    viewModel.dropspotDeletedByCollaborator(questionId, dropspot.id);
                    expect(designer.dropspots().length).toBe(1);
                });
            });
        });
    });
})