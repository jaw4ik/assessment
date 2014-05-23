define(['widgets/createQuestion/viewmodel', 'constants'], function(viewModel, constants) {

    "use strict";

    var createQuestionCommand = require('commands/createQuestionCommand'),
        router  = require('plugins/router');

    describe('viewmodel [createQuestion]', function () {

        beforeEach(function () {
            viewModel.prototype.objectiveId = 'objectiveId';
            spyOn(createQuestionCommand, 'execute');
        });

        it('should be defined', function() {
            expect(viewModel).toBeDefined();
        });

        describe('activate:', function() {

            it('should be function', function() {
                expect(viewModel.prototype.activate).toBeFunction();
            });

            it('should set objectiveId', function() {
                viewModel.prototype.activate({
                    objectiveId: 1
                });
                expect(viewModel.prototype.objectiveId).toBe(1);
            });

            it('should set event category', function() {
                viewModel.prototype.activate({
                    eventCategory: 'some category'
                });
                expect(viewModel.prototype.eventCategory).toBe('some category');
            });

        });

        describe('toggleVisible:', function () {

            it('should be function', function() {
                expect(viewModel.prototype.toggleVisible).toBeFunction();
            });

            describe('when block is visible', function() {

                it('should set false', function () {
                    viewModel.prototype.visible(true);
                    viewModel.prototype.toggleVisible();
                    expect(viewModel.prototype.visible()).toBeFalsy();
                });

            });

            describe('when block is not visible', function() {

                it('should set true', function () {
                    viewModel.prototype.visible(false);
                    viewModel.prototype.toggleVisible();
                    expect(viewModel.prototype.visible()).toBeTruthy();
                });

            });

        });

        describe('hide:', function() {

            it('should be function', function() {
                expect(viewModel.prototype.hide).toBeFunction();
            });

            it('should hide block', function () {
                viewModel.prototype.visible(true);
                viewModel.prototype.hide();
                expect(viewModel.prototype.visible()).toBeFalsy();
            });

        });

        describe('createMultipleChoiceQuestion:', function () {

            it('should hide block', function() {
                viewModel.prototype.visible(true);
                viewModel.prototype.createMultipleChoiceQuestion();
                expect(viewModel.prototype.visible()).toBeFalsy();
            });

            it('should execute createQuestionCommand', function () {
                viewModel.prototype.createMultipleChoiceQuestion();
                expect(createQuestionCommand.execute.calls.mostRecent().args[0]).toEqual('objectiveId');
            });

            describe('when courseId is defined in query params', function () {

                beforeEach(function () {
                    var instruction = { queryParams: { courseId: 'courseId' } };
                    spyOn(router, "activeInstruction").and.returnValue(instruction);
                });

                it('should call command with courseId', function () {
                    viewModel.prototype.createMultipleChoiceQuestion();
                    expect(createQuestionCommand.execute).toHaveBeenCalledWith('objectiveId', 'courseId', constants.questionType.multipleChoice.type);
                });

            });

        });

        describe('createFillInTheBlankQuestion:', function () {
            
            it('should hide block', function () {
                viewModel.prototype.visible(true);
                viewModel.prototype.createFillInTheBlankQuestion();
                expect(viewModel.prototype.visible()).toBeFalsy();
            });

            it('should execute createQuestionCommand', function () {
                viewModel.prototype.createFillInTheBlankQuestion();
                expect(createQuestionCommand.execute.calls.mostRecent().args[0]).toEqual('objectiveId');
            });

            describe('when courseId is defined in query params', function () {

                beforeEach(function () {
                    var instruction = { queryParams: { courseId: 'courseId' } };
                    spyOn(router, "activeInstruction").and.returnValue(instruction);
                });

                it('should call command with courseId', function () {
                    viewModel.prototype.createFillInTheBlankQuestion();
                    expect(createQuestionCommand.execute).toHaveBeenCalledWith('objectiveId', 'courseId', constants.questionType.fillInTheBlank.type);
                });

            });

        });

    });

});