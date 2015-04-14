define(['widgets/createQuestion/viewmodel', 'constants'], function (viewModel, constants) {

    "use strict";

    var createQuestionCommand = require('commands/createQuestionCommand'),
        router = require('plugins/router'),
        userContext = require('userContext'),
        eventTracker = require('eventTracker');

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
                        expect(viewModel.questions().length).toBe(10);
                        expect(viewModel.questions()[0].type).toBe(constants.questionType.informationContent.type);
                        expect(viewModel.questions()[1].type).toBe(constants.questionType.singleSelectText.type);
                        expect(viewModel.questions()[2].type).toBe(constants.questionType.multipleSelect.type);
                        expect(viewModel.questions()[3].type).toBe(constants.questionType.singleSelectImage.type);
                        expect(viewModel.questions()[4].type).toBe(constants.questionType.fillInTheBlank.type);
                        expect(viewModel.questions()[5].type).toBe(constants.questionType.textMatching.type);
                        expect(viewModel.questions()[6].type).toBe(constants.questionType.dragAndDropText.type);
                        expect(viewModel.questions()[7].type).toBe(constants.questionType.statement.type);
                        expect(viewModel.questions()[8].type).toBe(constants.questionType.hotspot.type);
                        expect(viewModel.questions()[9].type).toBe(constants.questionType.open.type);

                        done();
                    });
                });

                describe('and user has not statrer and plus access', function () {
                    beforeEach(function () {
                        spyOn(userContext, 'hasStarterAccess').and.returnValue(false);
                        spyOn(userContext, 'hasPlusAccess').and.returnValue(false);
                    });

                    it('should has access to single select text', function (done) {
                        var promise = viewModel.activate(settings);

                        promise.fin(function () {
                            var question = _.find(viewModel.questions(), function(item) {
                                return item.type === constants.questionType.singleSelectText.type;
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


                    it('should has not access to hotspot', function (done) {
                        var promise = viewModel.activate(settings);

                        promise.fin(function () {
                            var question = _.find(viewModel.questions(), function (item) {
                                return item.type === constants.questionType.hotspot.type;
                            });
                            expect(question.hasAccess).toBeFalsy();
                            done();
                        });
                    });

                    it('should have no access to statement', function (done) {
                        var promise = viewModel.activate(settings);

                        promise.fin(function () {
                            var question = _.find(viewModel.questions(), function (item) {
                                return item.type === constants.questionType.statement.type;
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

                    it('should has access to single select text', function (done) {
                        var promise = viewModel.activate(settings);

                        promise.fin(function () {
                            var question = _.find(viewModel.questions(), function (item) {
                                return item.type === constants.questionType.singleSelectText.type;
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

                    it('should have no access to hotspot', function (done) {
                        var promise = viewModel.activate(settings);

                        promise.fin(function () {
                            var question = _.find(viewModel.questions(), function (item) {
                                return item.type === constants.questionType.hotspot.type;
                            });
                            expect(question.hasAccess).toBeFalsy();
                            done();
                        });
                    });

                    it('should have no access to statement', function (done) {
                        var promise = viewModel.activate(settings);

                        promise.fin(function () {
                            var question = _.find(viewModel.questions(), function (item) {
                                return item.type === constants.questionType.statement.type;
                            });
                            expect(question.hasAccess).toBeFalsy();
                            done();
                        });
                    });

                    it('should have no access to open', function (done) {
                        var promise = viewModel.activate(settings);

                        promise.fin(function () {
                            var question = _.find(viewModel.questions(), function (item) {
                                return item.type === constants.questionType.open.type;
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

                    it('should has access to single select text', function (done) {
                        var promise = viewModel.activate(settings);

                        promise.fin(function () {
                            var question = _.find(viewModel.questions(), function (item) {
                                return item.type === constants.questionType.singleSelectText.type;
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

                    it('should has access to statement', function (done) {
                        var promise = viewModel.activate(settings);

                        promise.fin(function () {
                            var question = _.find(viewModel.questions(), function (item) {
                                return item.type === constants.questionType.statement.type;
                            });
                            expect(question.hasAccess).toBeTruthy();
                            done();
                        });
                    });

                    it('should has access to statement', function (done) {
                        var promise = viewModel.activate(settings);

                        promise.fin(function () {
                            var question = _.find(viewModel.questions(), function (item) {
                                return item.type === constants.questionType.open.type;
                            });
                            expect(question.hasAccess).toBeTruthy();
                            done();
                        });
                    });

                });

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

                it('should call command with courseId', function () {
                    viewModel.objectiveId = 'objectiveId';

                    viewModel.createQuestion({ type: 'questionType' });

                    expect(createQuestionCommand.execute).toHaveBeenCalledWith('objectiveId', 'courseId', 'questionType');
                });

            });

        });

        describe('openUpgradePlanUrl:', function () {

            beforeEach(function() {
                spyOn(eventTracker, 'publish');
                spyOn(window, 'open');
            });

            it('should be function', function() {
                expect(viewModel.openUpgradePlanUrl).toBeFunction();
            });

            it('should send event \'Upgrade now\'', function () {
                viewModel.openUpgradePlanUrl();
                expect(eventTracker.publish).toHaveBeenCalledWith(constants.upgradeEvent, constants.upgradeCategory.questions);
            });

            it('should open upgrade link in new window', function() {
                viewModel.openUpgradePlanUrl();
                expect(window.open).toHaveBeenCalledWith(constants.upgradeUrl, '_blank');
            });

        });
    });

});