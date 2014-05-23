define(['widgets/createQuestion/viewmodel', 'constants'], function(viewModel, constants) {

    "use strict";

    var createQuestionCommand = require('commands/createQuestionCommand'),
        router  = require('plugins/router'),
        userContext = require('userContext');

    describe('viewmodel [createQuestion]', function () {

        beforeEach(function () {
            viewModel.objectiveId = 'objectiveId';
            spyOn(createQuestionCommand, 'execute');
            spyOn(userContext, 'hasStarterAccess').and.returnValue(true);
        });

        it('should be defined', function() {
            expect(viewModel).toBeDefined();
        });

        describe('activate:', function() {

            var identify;

            beforeEach(function () {
                identify = Q.defer();
                spyOn(userContext, 'identify').and.returnValue(identify.promise);
            });

            it('should be function', function() {
                expect(viewModel.activate).toBeFunction();
            });

            it('should set objectiveId', function() {
                viewModel.activate({
                    objectiveId: 1
                });
                expect(viewModel.objectiveId).toBe(1);
            });

            it('should set event category', function() {
                viewModel.activate({
                    eventCategory: 'some category'
                });
                expect(viewModel.eventCategory).toBe('some category');
            });

            it('should return promise', function () {
                expect(viewModel.activate({})).toBePromise();
            });

            it('should set hasStartedAccess', function (done) {
                viewModel.hasStarterAccess(null);
                var promise = viewModel.activate({});

                promise.fin(function () {
                    expect(viewModel.hasStarterAccess()).toBe(true);
                    done();
                });

                identify.resolve();
            });

        });

        describe('show:', function () {

            it('should be function', function() {
                expect(viewModel.show).toBeFunction();
            });

            describe('when block is visible', function() {

                it('should set false', function () {
                    viewModel.visible(true);
                    viewModel.show();
                    expect(viewModel.visible()).toBeFalsy();
                });

            });

            describe('when block is not visible', function() {

                it('should set true', function () {
                    viewModel.visible(false);
                    viewModel.show();
                    expect(viewModel.visible()).toBeTruthy();
                });

            });

        });

        describe('hide:', function() {

            it('should be function', function() {
                expect(viewModel.hide).toBeFunction();
            });

            it('should hide block', function () {
                viewModel.visible(true);
                viewModel.hide();
                expect(viewModel.visible()).toBeFalsy();
            });

        });

        describe('createMultipleChoiceQuestion:', function () {

            it('should hide block', function() {
                viewModel.visible(true);
                viewModel.createMultipleChoiceQuestion();
                expect(viewModel.visible()).toBeFalsy();
            });

            it('should execute createQuestionCommand', function () {
                viewModel.createMultipleChoiceQuestion();
                expect(createQuestionCommand.execute.calls.mostRecent().args[0]).toEqual('objectiveId');
            });

            describe('when courseId is defined in query params', function () {

                beforeEach(function () {
                    var instruction = { queryParams: { courseId: 'courseId' } };
                    spyOn(router, "activeInstruction").and.returnValue(instruction);
                });

                it('should call command with courseId', function () {
                    viewModel.createMultipleChoiceQuestion();
                    expect(createQuestionCommand.execute).toHaveBeenCalledWith('objectiveId', 'courseId', constants.questionType.multipleChoice.type);
                });

            });

        });

        describe('createFillInTheBlankQuestion:', function () {
            
            it('should hide block', function () {
                viewModel.visible(true);
                viewModel.createFillInTheBlankQuestion();
                expect(viewModel.visible()).toBeFalsy();
            });

            it('should execute createQuestionCommand', function () {
                viewModel.createFillInTheBlankQuestion();
                expect(createQuestionCommand.execute.calls.mostRecent().args[0]).toEqual('objectiveId');
            });

            describe('when courseId is defined in query params', function () {

                beforeEach(function () {
                    var instruction = { queryParams: { courseId: 'courseId' } };
                    spyOn(router, "activeInstruction").and.returnValue(instruction);
                });

                it('should call command with courseId', function () {
                    viewModel.createFillInTheBlankQuestion();
                    expect(createQuestionCommand.execute).toHaveBeenCalledWith('objectiveId', 'courseId', constants.questionType.fillInTheBlank.type);
                });

            });

        });

    });

});