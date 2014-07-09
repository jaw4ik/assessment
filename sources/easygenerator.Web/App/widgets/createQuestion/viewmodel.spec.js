define(['widgets/createQuestion/viewmodel', 'constants'], function (viewModel, constants) {

    "use strict";

    var createQuestionCommand = require('commands/createQuestionCommand'),
        router = require('plugins/router'),
        userContext = require('userContext');

    var settings = {
        objectiveId: '1'
    };

    describe('viewmodel [createQuestion]', function () {

        it('should be defined', function () {
            expect(viewModel).toBeDefined();
        });

        describe('objectiveId:', function () {
            it('should be defined', function () {
                expect(viewModel.objectiveId).toBeDefined();
            });
        });

        describe('visible:', function () {
            it('should be observable', function () {
                expect(viewModel.visible).toBeObservable();
            });
        });

        describe('questions', function () {
            it('should be observable array', function () {
                expect(viewModel.questions).toBeObservableArray();
            });
        });

        describe('activate:', function () {
            var identify;

            beforeEach(function () {
                identify = Q.defer();
                spyOn(userContext, 'identify').and.returnValue(identify.promise);
            });

            it('should be function', function () {
                expect(viewModel.activate).toBeFunction();
            });

            describe('when settings is not object', function () {
                it('should throw exception', function () {
                    var f = function () {
                        viewModel.activate();
                    };

                    expect(f).toThrow('settings is not an object');
                });
            });

            describe('when objectiveId is not string', function () {
                it('should throw exception', function () {
                    var f = function () {
                        viewModel.activate({});
                    };

                    expect(f).toThrow('objectiveId is not a string');
                });
            });

            it('should set objectiveId', function () {
                viewModel.objectiveId = null;

                viewModel.activate(settings);

                expect(viewModel.objectiveId).toBe(settings.objectiveId);
            });

            it('should identify user', function () {
                viewModel.activate(settings);

                expect(userContext.identify).toHaveBeenCalled();
            });

            it('should return promise', function () {
                var result = viewModel.activate(settings);

                expect(result).toBePromise();
            });

            describe('when user idetified', function () {

                beforeEach(function () {
                    identify.resolve();
                });

                it('should initialize questions', function (done) {
                    spyOn(userContext, 'hasStarterAccess').and.returnValue(true);
                    spyOn(userContext, 'hasPlusAccess').and.returnValue(true);

                    var promise = viewModel.activate(settings);

                    promise.fin(function () {
                        expect(viewModel.questions().length).toBe(4);
                        expect(viewModel.questions()[0].type).toBe(constants.questionType.singleSelect.type);
                        expect(viewModel.questions()[0].name).toBe(constants.questionType.singleSelect.name);
                        expect(viewModel.questions()[1].type).toBe(constants.questionType.multipleSelect.type);
                        expect(viewModel.questions()[1].name).toBe(constants.questionType.multipleSelect.name);
                        expect(viewModel.questions()[2].type).toBe(constants.questionType.fillInTheBlank.type);
                        expect(viewModel.questions()[2].name).toBe(constants.questionType.fillInTheBlank.name);
                        expect(viewModel.questions()[3].type).toBe(constants.questionType.dragAndDropText.type);
                        expect(viewModel.questions()[3].name).toBe(constants.questionType.dragAndDropText.name);
                        done();
                    });
                });

                describe('and user has not statrer and plus access', function () {
                    beforeEach(function () {
                        spyOn(userContext, 'hasStarterAccess').and.returnValue(false);
                        spyOn(userContext, 'hasPlusAccess').and.returnValue(false);
                    });

                    it('should has access to multiple choice', function (done) {
                        var promise = viewModel.activate(settings);

                        promise.fin(function () {
                            var question = _.find(viewModel.questions(), function(item) {
                                return item.type === constants.questionType.singleSelect.type;
                            });
                            expect(question.hasAccess).toBeTruthy();
                            done();
                        });
                    });

                    it('should has access to multiple select', function (done) {
                        var promise = viewModel.activate(settings);

                        promise.fin(function () {
                            var question = _.find(viewModel.questions(), function (item) {
                                return item.type === constants.questionType.multipleSelect.type;
                            });
                            expect(question.hasAccess).toBeTruthy();
                            done();
                        });
                    });

                    it('should has not access to drag and drop text', function (done) {
                        var promise = viewModel.activate(settings);

                        promise.fin(function () {
                            var question = _.find(viewModel.questions(), function (item) {
                                return item.type === constants.questionType.dragAndDropText.type;
                            });
                            expect(question.hasAccess).toBeFalsy();
                            done();
                        });
                    });

                    it('should has not access to fill in the blank', function (done) {
                        var promise = viewModel.activate(settings);

                        promise.fin(function () {
                            var question = _.find(viewModel.questions(), function (item) {
                                return item.type === constants.questionType.fillInTheBlank.type;
                            });
                            expect(question.hasAccess).toBeFalsy();
                            done();
                        });
                    });
                });

                describe('and user has not plus access', function () {
                    beforeEach(function () {
                        spyOn(userContext, 'hasStarterAccess').and.returnValue(true);
                        spyOn(userContext, 'hasPlusAccess').and.returnValue(false);
                    });

                    it('should has access to multiple choice', function (done) {
                        var promise = viewModel.activate(settings);

                        promise.fin(function () {
                            var question = _.find(viewModel.questions(), function (item) {
                                return item.type === constants.questionType.singleSelect.type;
                            });
                            expect(question.hasAccess).toBeTruthy();
                            done();
                        });
                    });

                    it('should has access to multiple select', function (done) {
                        var promise = viewModel.activate(settings);

                        promise.fin(function () {
                            var question = _.find(viewModel.questions(), function (item) {
                                return item.type === constants.questionType.multipleSelect.type;
                            });
                            expect(question.hasAccess).toBeTruthy();
                            done();
                        });
                    });

                    it('should has not access to drag and drop text', function (done) {
                        var promise = viewModel.activate(settings);

                        promise.fin(function () {
                            var question = _.find(viewModel.questions(), function (item) {
                                return item.type === constants.questionType.dragAndDropText.type;
                            });
                            expect(question.hasAccess).toBeFalsy();
                            done();
                        });
                    });

                    it('should has access to fill in the blank', function (done) {
                        var promise = viewModel.activate(settings);

                        promise.fin(function () {
                            var question = _.find(viewModel.questions(), function (item) {
                                return item.type === constants.questionType.fillInTheBlank.type;
                            });
                            expect(question.hasAccess).toBeTruthy();
                            done();
                        });
                    });
                });

                describe('and user has statrer and plus access', function () {
                    beforeEach(function () {
                        spyOn(userContext, 'hasStarterAccess').and.returnValue(true);
                        spyOn(userContext, 'hasPlusAccess').and.returnValue(true);
                    });

                    it('should has access to multiple choice', function (done) {
                        var promise = viewModel.activate(settings);

                        promise.fin(function () {
                            var question = _.find(viewModel.questions(), function (item) {
                                return item.type === constants.questionType.singleSelect.type;
                            });
                            expect(question.hasAccess).toBeTruthy();
                            done();
                        });
                    });

                    it('should has access to multiple select', function (done) {
                        var promise = viewModel.activate(settings);

                        promise.fin(function () {
                            var question = _.find(viewModel.questions(), function (item) {
                                return item.type === constants.questionType.multipleSelect.type;
                            });
                            expect(question.hasAccess).toBeTruthy();
                            done();
                        });
                    });

                    it('should has access to fill in the blank', function (done) {
                        var promise = viewModel.activate(settings);

                        promise.fin(function () {
                            var question = _.find(viewModel.questions(), function (item) {
                                return item.type === constants.questionType.fillInTheBlank.type;
                            });
                            expect(question.hasAccess).toBeTruthy();
                            done();
                        });
                    });

                    it('should has access to drag and drop text', function (done) {
                        var promise = viewModel.activate(settings);

                        promise.fin(function () {
                            var question = _.find(viewModel.questions(), function (item) {
                                return item.type === constants.questionType.dragAndDropText.type;
                            });
                            expect(question.hasAccess).toBeTruthy();
                            done();
                        });
                    });

                });

            });

        });

        describe('show:', function () {

            it('should be function', function () {
                expect(viewModel.show).toBeFunction();
            });

            describe('when block is visible', function () {

                it('should set false', function () {
                    viewModel.visible(true);
                    viewModel.show();
                    expect(viewModel.visible()).toBeFalsy();
                });

            });

            describe('when block is not visible', function () {

                it('should set true', function () {
                    viewModel.visible(false);
                    viewModel.show();
                    expect(viewModel.visible()).toBeTruthy();
                });

            });

        });

        describe('hide:', function () {

            it('should be function', function () {
                expect(viewModel.hide).toBeFunction();
            });

            it('should hide block', function () {
                viewModel.visible(true);
                viewModel.hide();
                expect(viewModel.visible()).toBeFalsy();
            });

        });

        describe('createQuestion:', function () {

            beforeEach(function () {
                spyOn(createQuestionCommand, 'execute');
            });

            it('should be a function', function () {
                expect(viewModel.createQuestion).toBeFunction();
            });

            describe('when courseId is not defined', function () {
                beforeEach(function () {
                    spyOn(router, "activeInstruction").and.returnValue({ queryParams: {} });
                });

                it('should hide block', function () {
                    viewModel.visible(true);

                    viewModel.createQuestion({ type: 'questionType' });

                    expect(viewModel.visible()).toBeFalsy();
                });

                it('should execute createQuestionCommand', function () {
                    viewModel.objectiveId = 'objectiveId';

                    viewModel.createQuestion({ type: 'questionType' });

                    expect(createQuestionCommand.execute).toHaveBeenCalledWith('objectiveId', undefined, 'questionType');
                });

            });

            describe('when courseId is defined in query params', function () {

                beforeEach(function () {
                    var instruction = { queryParams: { courseId: 'courseId' } };
                    spyOn(router, "activeInstruction").and.returnValue(instruction);
                });

                it('should hide block', function () {
                    viewModel.visible(true);

                    viewModel.createQuestion({ type: 'questionType' });

                    expect(viewModel.visible()).toBeFalsy();
                });

                it('should call command with courseId', function () {
                    viewModel.objectiveId = 'objectiveId';

                    viewModel.createQuestion({ type: 'questionType' });

                    expect(createQuestionCommand.execute).toHaveBeenCalledWith('objectiveId', 'courseId', 'questionType');
                });

            });

        });
    });

});