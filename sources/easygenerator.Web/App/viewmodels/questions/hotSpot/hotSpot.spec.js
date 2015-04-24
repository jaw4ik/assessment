define(['viewmodels/questions/hotSpot/hotSpot', 'viewmodels/questions/hotSpot/polygon'], function (viewModel, Polygon) {

    var
        notify = require('notify'),
        localizationManager = require('localization/localizationManager'),
        designer = require('viewmodels/questions/hotSpot/designer');

    describe('viewModel [hotSpot]', function () {

        it('should be defined', function () {
            expect(viewModel).toBeDefined();
        });

        describe('initialize:', function () {
            var designerActivateDefer,
                objectiveId = 'objectiveId',
                question = { id: 'id' };

            beforeEach(function () {
                designerActivateDefer = Q.defer();
                spyOn(designer, 'activate').and.returnValue(designerActivateDefer.promise);
            });

            it('should return promise', function () {
                var promise = viewModel.initialize(objectiveId, question);
                expect(promise).toBePromise();
            });

            it('should initialize field', function () {
                viewModel.initialize(objectiveId, question);
                expect(viewModel.objectiveId).toBe(objectiveId);
                expect(viewModel.questionId).toBe(question.id);
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

        describe('polygonCreatedByCollaborator:', function () {
            var questionId = 'questionId',
                polygonId = 'polygonId',
                points = [{ x: 1, y: 1 }, { x: 2, y: 1 }, { x: 2, y: 2 }, { x: 2, y: 1 }];

            it('should be function', function () {
                expect(viewModel.polygonCreatedByCollaborator).toBeFunction();
            });

            describe('when dropspot is created in current question', function () {
                beforeEach(function () {
                    viewModel.questionId = questionId;
                });

                it('should add new polygon', function () {
                    designer.polygons([]);
                    viewModel.polygonCreatedByCollaborator(questionId, polygonId, points);
                    expect(designer.polygons().length).toBe(1);
                    expect(designer.polygons()[0].id).toBe(polygonId);
                });
            });

            describe('when dropspot is created not in current question', function () {
                beforeEach(function () {
                    viewModel.questionId = 'otherId';
                });

                it('should not add new polygon', function () {
                    designer.polygons([]);
                    viewModel.polygonCreatedByCollaborator(questionId, polygonId, points);
                    expect(designer.polygons().length).toBe(0);
                });
            });
        });

        describe('polygonUpdatedByCollaborator:', function () {

            var questionId = 'questionId',
                 polygon = null,
                 polygonId = 'polygonId',
                 points = [{ x: 1, y: 1 }, { x: 2, y: 1 }, { x: 2, y: 2 }, { x: 2, y: 1 }],
                 newPoints = [{ x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }];

            beforeEach(function () {
                polygon = new Polygon(polygonId, points);
                viewModel.questionId = questionId;
            });

            it('should be function', function () {
                expect(viewModel.polygonUpdatedByCollaborator).toBeFunction();
            });

            describe('when it is current question', function () {

                describe('and polygon is found', function () {
                    beforeEach(function () {
                        designer.polygons([polygon]);
                    });

                    describe('and polygon is editing', function () {
                        beforeEach(function () {
                            polygon.isEditing = ko.observable(true);
                        });

                        it('should not update position', function () {
                            viewModel.polygonUpdatedByCollaborator(questionId, polygonId, newPoints);
                            expect(designer.polygons()[0].points()).toBe(points);
                        });
                    });

                    describe('and polygon is not editing', function () {
                        beforeEach(function () {
                            polygon.isEditing = ko.observable(false);
                        });

                        it('should update polygon', function () {
                            viewModel.polygonUpdatedByCollaborator(questionId, polygonId, newPoints);
                            expect(designer.polygons()[0].points()).toBe(newPoints);
                        });
                    });
                });
            });

            describe('when it is not current question', function () {
                beforeEach(function () {
                    polygon.points(points);
                    designer.polygons([polygon]);
                });

                it('should not update position', function () {
                    viewModel.polygonUpdatedByCollaborator('otherQuestionId', polygonId, newPoints);
                    expect(designer.polygons()[0].points()).toBe(points);
                });
            });
        });

        describe('polygonDeletedByCollaborator:', function () {
            var questionId = 'questionId',
                  polygon = null,
                  polygonId = 'polygonId',
                  points = [{ x: 1, y: 1 }, { x: 2, y: 1 }, { x: 2, y: 2 }, { x: 2, y: 1 }];

            beforeEach(function () {
                polygon = new Polygon(polygonId, points);
                viewModel.questionId = questionId;
                spyOn(localizationManager, 'localize').and.returnValue('message');
            });

            it('should be function', function () {
                expect(viewModel.polygonDeletedByCollaborator).toBeFunction();
            });

            describe('when it is current question', function () {
                describe('and polygon is found', function () {
                    beforeEach(function () {
                        designer.polygons([polygon]);
                    });

                    it('should delete polygon from list', function () {
                        viewModel.polygonDeletedByCollaborator(questionId, polygonId);
                        expect(designer.polygons().length).toBe(0);
                    });

                    describe('and polygon is in editing', function () {
                        beforeEach(function () {
                            polygon.isEditing = ko.observable(true);
                            spyOn(notify, 'error');
                        });

                        it('should not delete polygon from list', function () {
                            viewModel.polygonDeletedByCollaborator(questionId, polygonId);
                            expect(designer.polygons().length).toBe(1);
                        });

                        it('should mark polygon as isDeleted', function () {
                            viewModel.polygonDeletedByCollaborator(questionId, polygonId);
                            expect(polygon.isDeleted).toBeTruthy();
                        });

                        it('should show error notification', function () {
                            viewModel.polygonDeletedByCollaborator(questionId, polygonId);
                            expect(notify.error).toHaveBeenCalled();
                        });
                    });
                });
            });

            describe('when it is not current question', function () {
                beforeEach(function () {
                    designer.polygons([polygon]);
                });

                it('should not delete polygon from list', function () {
                    viewModel.polygonDeletedByCollaborator('otherQuestionId', polygonId);
                    expect(designer.polygons().length).toBe(1);
                });
            });
        });

        describe('isMultipleUpdatedByCollaborator:', function () {
            var questionId = 'questionId';
            var isMultiple = true;

            beforeEach(function () {
                designer.isMultiple(false);
                viewModel.questionId = questionId;
                spyOn(localizationManager, 'localize').and.returnValue('message');
            });

            it('should be function', function () {
                expect(viewModel.isMultipleUpdatedByCollaborator).toBeFunction();
            });

            describe('when it is current question', function () {
                beforeEach(function () {
                    designer.isMultiple(false);
                });

                it('should update isMultiple', function () {
                    viewModel.isMultipleUpdatedByCollaborator(questionId, isMultiple);
                    expect(designer.isMultiple()).toBe(true);
                });
            });

            describe('when it is not current question', function () {
                it('should not update isMultiple', function () {
                    viewModel.isMultipleUpdatedByCollaborator('otherQuestionId', isMultiple);
                    expect(designer.isMultiple()).toBe(false);
                });
            });
        });
    });
})