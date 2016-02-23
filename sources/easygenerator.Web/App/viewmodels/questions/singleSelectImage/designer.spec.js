import viewModel from './designer';

import getQuestionContentById from './queries/getQuestionContentById';
import addAnswerCommand from './commands/addAnswer';
import updateAnswerImageCommand from './commands/updateAnswerImage';
import setCorrectAnswerCommand from './commands/setCorrectAnswer';
import removeAnswerCommand from './commands/removeAnswer';
import imageUpload from 'imageUpload';
import notify from 'notify';
import eventTracker from 'eventTracker';
import imagePreview from 'widgets/imagePreview/viewmodel';
import localizationManager from 'localization/localizationManager';

describe('question single select image [designer]', function () {

    var questionId = 'questionId',
        answerId = 'answerId',
        answer = { id: answerId, image: 'image' };

    beforeEach(function () {
        spyOn(eventTracker, 'publish');
    });

    it('should be defined', function () {
        expect(viewModel).toBeDefined();
    });

    describe('toggleExpand:', function () {
        it('should be function', function () {
            expect(viewModel.toggleExpand).toBeFunction();
        });

        describe('when isExpanded true', function () {
            it('should set isExpanded to true', function () {
                viewModel.isExpanded(true);
                viewModel.toggleExpand();
                expect(viewModel.isExpanded()).toBeFalsy();
            });
        });

        describe('when isExpanded false', function () {
            it('should set isExpanded to false', function () {
                viewModel.isExpanded(false);
                viewModel.toggleExpand();
                expect(viewModel.isExpanded()).toBeTruthy();
            });
        });
    });

    describe('answers:', function () {
        it('should be observable array', function () {
            expect(viewModel.answers).toBeObservableArray();
        });
    });

    describe('correctAnswerId:', function () {
        it('should be observable', function () {
            expect(viewModel.correctAnswerId).toBeObservable();
        });
    });

    describe('addAnswer:', function () {

        var dfd;

        beforeEach(function () {
            dfd = Q.defer();
            spyOn(addAnswerCommand, 'execute').and.returnValue(dfd.promise);
            spyOn(notify, 'saved');
        });

        it('should be function', function () {
            expect(viewModel.addAnswer).toBeFunction();
        });

        it('should publish \'Add answer option (single select image)\' event', function () {
            spyOn(imageUpload, 'upload');
            viewModel.addAnswer();
            expect(eventTracker.publish).toHaveBeenCalledWith('Add answer option (single select image)');
        });

        it('should upload image', function () {
            spyOn(imageUpload, 'upload');
            viewModel.addAnswer();
            expect(imageUpload.upload).toHaveBeenCalled();
        });

        describe('when image loading started', function () {
            beforeEach(function () {
                viewModel.answers([]);
                spyOn(imageUpload, 'upload').and.callFake(function (spec) {
                    spec.startLoading();
                });
            });

            it('should add answer to answers collection', function () {
                viewModel.addAnswer();
                expect(viewModel.answers().length).toBe(1);
            });

            it('should set isProcessing to true for added answer', function () {
                viewModel.addAnswer();
                expect(viewModel.answers()[0].isProcessing()).toBeTruthy();
            });

            it('should set isImageLoading to true for added answer', function () {
                viewModel.addAnswer();
                expect(viewModel.answers()[0].isImageLoading()).toBeTruthy();
            });
        });

        describe('when image was uploaded successfully', function () {

            var url = 'http://url.com';

            beforeEach(function () {
                spyOn(imageUpload, 'upload').and.callFake(function (spec) {
                    spec.startLoading();
                    spec.success(url);
                });
            });

            it('should execute command to add answer', function () {
                viewModel.addAnswer();
                expect(addAnswerCommand.execute).toHaveBeenCalled();
            });

            describe('and add answer command is executed', function () {

                beforeEach(function (done) {
                    viewModel.answers([]);
                    dfd.resolve('id');
                    done();
                });

                it('should set isImageLoading to false', function (done) {
                    viewModel.addAnswer();

                    dfd.promise.then(function () {
                        expect(viewModel.answers()[0].isImageLoading()).toBeFalsy();
                        done();
                    });
                });

                it('should update answer id', function (done) {
                    viewModel.addAnswer();

                    dfd.promise.then(function () {
                        expect(viewModel.answers()[0].id()).toEqual('id');
                        done();
                    });
                });

                it('should update answer image', function (done) {
                    viewModel.addAnswer();

                    dfd.promise.then(function () {
                        expect(viewModel.answers()[0].image()).toEqual(url);
                        done();
                    });
                });

                it('should notify that data was saved', function (done) {
                    viewModel.addAnswer();

                    dfd.promise.then(function () {
                        expect(notify.saved).toHaveBeenCalled();
                        done();
                    });
                });
            });
        });

        describe('when failed to upload image', function () {
            beforeEach(function () {
                viewModel.answers([]);
                spyOn(imageUpload, 'upload').and.callFake(function (spec) {
                    spec.startLoading();
                    spec.error();
                });
            });

            it('should not add answers to collection', function () {
                viewModel.addAnswer();
                expect(viewModel.answers().length).toBe(0);
            });
        });

    });

    describe('removeAnswer:', function () {

        var dfd,
            id = 'id',
            answer = { id: id };

        beforeEach(function () {
            dfd = Q.defer();
            spyOn(removeAnswerCommand, 'execute').and.returnValue(dfd.promise);
            spyOn(notify, 'saved');
        });

        it('should be function', function () {
            expect(viewModel.removeAnswer).toBeFunction();
        });

        it('should publish \'Delete answer option (single select image)', function () {
            viewModel.removeAnswer(answer);
            expect(eventTracker.publish).toHaveBeenCalledWith('Delete answer option (single select image)');
        });

        it('should execute command to remove answer', function () {
            viewModel.removeAnswer(answer);
            expect(removeAnswerCommand.execute).toHaveBeenCalled();
        });

        describe('when remove answer command is executed', function () {
            describe('when response is null', function () {
                beforeEach(function (done) {
                    dfd.resolve(null);
                    done();
                });

                it('should set correctAnswerId to null', function (done) {
                    viewModel.answers([answer]);
                    viewModel.correctAnswerId(id);

                    viewModel.removeAnswer(answer);

                    dfd.promise.then(function () {
                        expect(viewModel.correctAnswerId()).toBeNull();
                        done();
                    });
                });


                it('should remove answer', function (done) {
                    viewModel.answers([answer]);

                    viewModel.removeAnswer(answer);

                    dfd.promise.then(function () {
                        expect(viewModel.answers().length).toEqual(0);
                        done();
                    });
                });

                it('should notify that data was saved', function (done) {
                    viewModel.answers([answer]);

                    viewModel.removeAnswer(answer);

                    dfd.promise.then(function () {
                        expect(notify.saved).toHaveBeenCalled();
                        done();
                    });
                });
            });

            describe('when response is not null', function () {
                beforeEach(function (done) {
                    dfd.resolve({ correctAnswerId: id });
                    done();
                });

                it('should set correctAnswerId', function (done) {
                    viewModel.answers([answer]);
                    viewModel.correctAnswerId(null);

                    viewModel.removeAnswer(answer);

                    dfd.promise.then(function () {
                        expect(viewModel.correctAnswerId()).toBe(id);
                        done();
                    });
                });


                it('should remove answer', function (done) {
                    viewModel.answers([answer]);

                    viewModel.removeAnswer(answer);

                    dfd.promise.then(function () {
                        expect(viewModel.answers().length).toEqual(0);
                        done();
                    });
                });

                it('should notify that data was saved', function (done) {
                    viewModel.answers([answer]);

                    viewModel.removeAnswer(answer);

                    dfd.promise.then(function () {
                        expect(notify.saved).toHaveBeenCalled();
                        done();
                    });
                });
            });
        });

    });

    describe('setCorrectAnswer:', function () {

        var dfd,
            id = 'id',
            answer = { id: ko.observable(id) };

        beforeEach(function () {
            dfd = Q.defer();
            spyOn(setCorrectAnswerCommand, 'execute').and.returnValue(dfd.promise);
            spyOn(notify, 'saved');
        });

        it('should be function', function () {
            expect(viewModel.setCorrectAnswer).toBeFunction();
        });

        describe('when answer is correct', function () {
            beforeEach(function () {
                viewModel.correctAnswerId(answer.id());
            });

            it('should not publish \'Change answer option correctness (single select image)', function () {
                viewModel.setCorrectAnswer(answer);
                expect(eventTracker.publish).not.toHaveBeenCalledWith('Change answer option correctness (single select image)');
            });

            it('should not execute command to set correct answer', function () {
                viewModel.setCorrectAnswer(answer);
                expect(setCorrectAnswerCommand.execute).not.toHaveBeenCalled();
            });
        });

        describe('when answer is not correct', function () {
            beforeEach(function () {
                viewModel.correctAnswerId(null);
            });

            it('should publish \'Change answer option correctness (single select image)', function () {
                viewModel.setCorrectAnswer(answer);
                expect(eventTracker.publish).toHaveBeenCalledWith('Change answer option correctness (single select image)');
            });

            it('should execute command to set correct answer', function () {
                viewModel.setCorrectAnswer(answer);
                expect(setCorrectAnswerCommand.execute).toHaveBeenCalled();
            });

            describe('when set correct answer command is executed', function () {
                beforeEach(function (done) {
                    dfd.resolve();
                    done();
                });

                it('should update correctAnswerId', function (done) {
                    viewModel.correctAnswerId(null);

                    viewModel.setCorrectAnswer(answer);

                    dfd.promise.then(function () {
                        expect(viewModel.correctAnswerId()).toBe(answer.id());
                        done();
                    });
                });

                it('should notify that data was saved', function (done) {
                    viewModel.setCorrectAnswer(answer);

                    dfd.promise.then(function () {
                        expect(notify.saved).toHaveBeenCalled();
                        done();
                    });
                });
            });
        });
    });

    describe('updateAnswerImage:', function () {

        var dfd,
            answer = { id: ko.observable(), image: ko.observable(), isProcessing: ko.observable(), isImageLoading: ko.observable(), isEditing: ko.observable() };

        beforeEach(function () {
            dfd = Q.defer();
            spyOn(updateAnswerImageCommand, 'execute').and.returnValue(dfd.promise);
            spyOn(notify, 'saved');
        });

        it('should be function', function () {
            expect(viewModel.updateAnswerImage).toBeFunction();
        });

        it('should set answer isEditing to true', function () {
            answer.isEditing(false);
            spyOn(imageUpload, 'upload');
            viewModel.updateAnswerImage(answer);
            expect(answer.isEditing()).toBeTruthy();
        });

        it('should upload image', function () {
            spyOn(imageUpload, 'upload');
            viewModel.updateAnswerImage(answer);
            expect(imageUpload.upload).toHaveBeenCalled();
        });

        describe('when image loading started', function () {
            beforeEach(function () {
                spyOn(imageUpload, 'upload').and.callFake(function (spec) {
                    spec.startLoading();
                });
            });

            it('should set answer isProcessing to true', function () {
                answer.isProcessing(false);
                viewModel.updateAnswerImage(answer);
                expect(answer.isProcessing()).toBeTruthy();
            });

            it('should set answer isImageLoading to true', function () {
                answer.isImageLoading(false);
                viewModel.updateAnswerImage(answer);
                expect(answer.isImageLoading()).toBeTruthy();
            });
        });

        describe('when image was uploaded', function () {

            var url = 'http://url.com';

            beforeEach(function () {
                viewModel.answers([answer]);
                spyOn(imageUpload, 'upload').and.callFake(function (spec) {
                    spec.success(url);
                });
            });

            describe('and when answer is deleted', function () {
                beforeEach(function () {
                    answer.isDeleted = true;
                });

                it('should remove answer from collection', function () {
                    viewModel.updateAnswerImage(answer);
                    expect(viewModel.answers().length).toBe(0);
                });

                it('should not execute command to update answer image', function () {
                    viewModel.updateAnswerImage(answer);
                    expect(updateAnswerImageCommand.execute).not.toHaveBeenCalled();
                });
            });

            describe('and when answer is not deleted', function () {
                beforeEach(function () {
                    answer.isDeleted = false;
                });

                it('should execute command to update answer image', function () {
                    viewModel.updateAnswerImage(answer);
                    expect(updateAnswerImageCommand.execute).toHaveBeenCalled();
                });

                describe('and update answer image command is executed', function () {

                    beforeEach(function (done) {
                        dfd.resolve();
                        done();
                    });

                    it('should set answer isImageLoading to false', function (done) {
                        answer.isImageLoading(true);
                        viewModel.updateAnswerImage(answer);

                        dfd.promise.then(function () {
                            expect(answer.isImageLoading()).toBeFalsy();
                            done();
                        });
                    });

                    it('should update answer image', function (done) {
                        viewModel.updateAnswerImage(answer);

                        dfd.promise.then(function () {
                            expect(answer.image()).toEqual(url);
                            done();
                        });
                    });

                    it('should notify that data was saved', function (done) {
                        viewModel.updateAnswerImage(answer);

                        dfd.promise.then(function () {
                            expect(notify.saved).toHaveBeenCalled();
                            done();
                        });
                    });
                });
            });
        });

        describe('when image loading failed', function () {
            beforeEach(function () {
                spyOn(imageUpload, 'upload').and.callFake(function (spec) {
                    spec.error();
                });
            });

            describe('when answer is deleted', function () {
                beforeEach(function () {
                    answer.isDeleted = true;
                });

                it('should remove answer from collection', function () {
                    viewModel.updateAnswerImage(answer);
                    expect(viewModel.answers().length).toBe(0);
                });
            });

            describe('when answer is not deleted', function () {
                beforeEach(function () {
                    answer.isDeleted = false;
                });

                it('should set answer isImageLoading to false', function () {
                    answer.isImageLoading(true);
                    viewModel.updateAnswerImage(answer);
                    expect(answer.isImageLoading()).toBeFalsy();
                });
            });
        });

        describe('when image loading complete', function () {
            beforeEach(function () {
                spyOn(imageUpload, 'upload').and.callFake(function (spec) {
                    spec.complete();
                });
            });

            it('should set answer isEditing to false', function () {
                answer.isEditing(true);
                viewModel.updateAnswerImage(answer);
                expect(answer.isEditing()).toBeFalsy();
            });
        });
    });

    describe('activate:', function () {
        var dfd,
            id = 'id';

        beforeEach(function () {
            dfd = Q.defer();
            spyOn(getQuestionContentById, 'execute').and.returnValue(dfd.promise);
        });

        it('should be function', function () {
            expect(viewModel.activate).toBeFunction();
        });

        it('should execute command to load question content', function () {
            viewModel.activate(id);
            expect(getQuestionContentById.execute).toHaveBeenCalled();
        });

        describe('when question content is loaded', function () {

            describe('and when question is defined', function () {
                var question = {
                    correctAnswerId: id,
                    answers: [{ Id: id, Image: 'img', CreatedBy: new Date() }]
                };

                beforeEach(function (done) {
                    dfd.resolve(question);
                    done();
                });

                it('should set correctAnswerId', function (done) {
                    viewModel.activate(id);
                    dfd.promise.then(function () {
                        expect(viewModel.correctAnswerId()).toBe(id);
                        done();
                    });
                });

                it('should map answers collection', function (done) {
                    viewModel.activate(id);
                    dfd.promise.then(function () {
                        expect(viewModel.answers().length).toBe(question.answers.length);
                        done();
                    });
                });

            });

            describe('and when question is not defined', function () {
                beforeEach(function (done) {
                    dfd.resolve(null);
                    done();
                });

                it('should set correctAnswerId to null', function (done) {
                    viewModel.activate(id);
                    dfd.promise.then(function () {
                        expect(viewModel.correctAnswerId()).toBeNull();
                        done();
                    });
                });

                it('should clear answers collection', function (done) {
                    viewModel.activate(id);
                    dfd.promise.then(function () {
                        expect(viewModel.answers().length).toBe(0);
                        done();
                    });
                });
            });
        });

    });

    describe('canRemoveAnswer:', function () {
        it('should be computed', function () {
            expect(viewModel.canRemoveAnswer).toBeComputed();
        });

        describe('when answers count > 2', function () {
            beforeEach(function () {
                viewModel.answers([{ hasImage: ko.observable(false) }, { hasImage: ko.observable(false) }, { hasImage: ko.observable(false) }]);
            });

            it('should be true', function () {
                expect(viewModel.canRemoveAnswer()).toBeTruthy();
            });
        });

        describe('when answers count <= 2', function () {
            beforeEach(function () {
                viewModel.answers([]);
                viewModel.answers.push({ hasImage: ko.observable(false) });
            });

            it('should be true', function () {
                expect(viewModel.canRemoveAnswer()).toBeFalsy();
            });
        });
    });

    describe('canAddAnswer:', function () {
        it('should be computed', function () {
            expect(viewModel.canAddAnswer).toBeComputed();
        });

        describe('when answers count == 2', function () {
            beforeEach(function () {
                viewModel.answers([{ hasImage: ko.observable(false) }, { hasImage: ko.observable(false) }]);
            });

            describe('when answer does not have image', function () {
                beforeEach(function () {
                    viewModel.answers()[0].hasImage(false);
                    viewModel.answers()[1].hasImage(true);
                });

                it('should be false', function () {
                    expect(viewModel.canAddAnswer()).toBeFalsy();
                });
            });

            describe('when answers have images', function () {
                beforeEach(function () {
                    viewModel.answers()[0].hasImage(true);
                    viewModel.answers()[1].hasImage(true);
                });

                it('should be false', function () {
                    expect(viewModel.canAddAnswer()).toBeTruthy();
                });
            });

        });

        describe('when answers count less than 2', function () {
            beforeEach(function () {
                viewModel.answers([]);
            });

            it('should be false', function () {
                expect(viewModel.canAddAnswer()).toBeFalsy();
            });
        });
    });

    describe('finishAswerProcessing:', function () {
        var vmAnswer = {
            isProcessing: ko.observable()
        };

        it('should be function', function () {
            expect(viewModel.finishAswerProcessing).toBeFunction();
        });

        it('should open image preview', function () {
            viewModel.finishAswerProcessing(vmAnswer);
            expect(vmAnswer.isProcessing()).toBeFalsy();
        });
    });

    describe('previewAnswerImage:', function () {
        var image = 'image',
           vmAnswer = {
               image: ko.observable(image)
           };

        beforeEach(function () {
            spyOn(imagePreview, 'openPreviewImage');
        });

        it('should be function', function () {
            viewModel.previewAnswerImage(vmAnswer);
            expect(viewModel.previewAnswerImage).toBeFunction();
        });

        it('should open image preview', function () {
            viewModel.previewAnswerImage(vmAnswer);
            expect(imagePreview.openPreviewImage).toHaveBeenCalledWith(image);
        });
    });

    describe('answerCreatedByCollaborator:', function () {
        it('should be function', function () {
            expect(viewModel.answerCreatedByCollaborator).toBeFunction();
        });

        describe('when question is current question', function () {
            beforeEach(function () {
                viewModel.questionId = questionId;
            });

            it('should add answer to collection', function () {
                viewModel.answers([]);
                viewModel.answerCreatedByCollaborator(questionId, answer);
                expect(viewModel.answers().length).toBe(1);
                expect(viewModel.answers()[0].id()).toBe(answer.id);
            });
        });

        describe('when question is not current question', function () {
            beforeEach(function () {
                viewModel.questionId = '';
            });

            it('should not add answer to collection', function () {
                viewModel.answers([]);
                viewModel.answerCreatedByCollaborator(questionId, answer);
                expect(viewModel.answers().length).toBe(0);
            });
        });
    });

    describe('answerDeletedByCollaborator:', function () {

        var vmAnswer = { id: ko.observable(answerId), image: ko.observable(null), isEditing: ko.observable() },
            errorMessage = 'error',
            correctAnswerId = 'correctId';

        it('should be function', function () {
            expect(viewModel.answerDeletedByCollaborator).toBeFunction();
        });

        describe('when question is current question', function () {
            beforeEach(function () {
                viewModel.questionId = questionId;
                viewModel.answers([vmAnswer]);
                spyOn(notify, 'error');
                spyOn(localizationManager, 'localize').and.returnValue(errorMessage);
            });

            describe('and when answer is editing', function () {
                beforeEach(function () {
                    vmAnswer.isEditing(true);
                });

                it('should not delete answer', function () {
                    viewModel.answerDeletedByCollaborator(questionId, answerId, correctAnswerId);
                    expect(viewModel.answers().length).toBe(1);
                });

                it('should set answer isDeleted to true', function () {
                    vmAnswer.isDeleted = false;
                    viewModel.answerDeletedByCollaborator(questionId, answerId, correctAnswerId);
                    expect(viewModel.answers()[0].isDeleted).toBeTruthy();
                });

                it('should show error message', function () {
                    viewModel.answerDeletedByCollaborator(questionId, answerId, correctAnswerId);
                    expect(notify.error).toHaveBeenCalledWith(errorMessage);
                });
            });

            describe('and when answer is not editing', function () {
                beforeEach(function () {
                    vmAnswer.isEditing(false);
                });

                it('should delete answer', function () {
                    viewModel.answerDeletedByCollaborator(questionId, answerId, correctAnswerId);
                    expect(viewModel.answers().length).toBe(0);
                });
            });

            it('should update correct answer id', function() {
                viewModel.correctAnswerId(null);
                viewModel.answerDeletedByCollaborator(questionId, answerId, correctAnswerId);
                expect(viewModel.correctAnswerId()).toBe(correctAnswerId);
            });
        });

        describe('when question is not current question', function () {
            beforeEach(function () {
                viewModel.questionId = '';
            });

            it('should not updated image answer', function () {
                vmAnswer.image(null);
                viewModel.answers([vmAnswer]);
                viewModel.answerImageUpdatedByCollaborator(questionId, answer, correctAnswerId);
                expect(viewModel.answers()[0].image()).toBeNull();
            });
        });
    });

    describe('answerImageUpdatedByCollaborator:', function () {

        var vmAnswer = { id: ko.observable(answerId), image: ko.observable(null), isEditing: ko.observable() }

        it('should be function', function () {
            expect(viewModel.answerImageUpdatedByCollaborator).toBeFunction();
        });

        describe('when question is current question', function () {
            beforeEach(function () {
                viewModel.questionId = questionId;
            });

            it('should updated image answer', function () {
                viewModel.answers([vmAnswer]);
                viewModel.answerImageUpdatedByCollaborator(questionId, answer);
                expect(viewModel.answers()[0].image()).toBe(answer.image);
            });
        });

        describe('when question is not current question', function () {
            beforeEach(function () {
                viewModel.questionId = '';
            });

            it('should not updated image answer', function () {
                vmAnswer.image(null);
                viewModel.answers([vmAnswer]);
                viewModel.answerImageUpdatedByCollaborator(questionId, answer);
                expect(viewModel.answers()[0].image()).toBeNull();
            });
        });
    });

    describe('correctAnswerChangedByCollaborator:', function () {
        it('should be function', function () {
            expect(viewModel.correctAnswerChangedByCollaborator).toBeFunction();
        });

        describe('when question is current question', function () {
            beforeEach(function () {
                viewModel.questionId = questionId;
            });

            it('should set correctAnswerId', function () {
                viewModel.correctAnswerId(null);
                viewModel.correctAnswerChangedByCollaborator(questionId, answerId);
                expect(viewModel.correctAnswerId()).toBe(answerId);
            });
        });

        describe('when question is not current question', function () {
            beforeEach(function () {
                viewModel.questionId = '';
            });

            it('should set correctAnswerId', function () {
                viewModel.correctAnswerId(null);
                viewModel.correctAnswerChangedByCollaborator(questionId, answerId);
                expect(viewModel.correctAnswerId()).toBeNull();
            });
        });
    });
});
