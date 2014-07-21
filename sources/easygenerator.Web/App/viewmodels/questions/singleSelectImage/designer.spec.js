﻿define(function (require) {
    "use strict";

    var viewModel = require('viewmodels/questions/singleSelectImage/designer'),
        imageUpload = require('imageUpload'),
        notify = require('notify'),
        eventTracker = require('eventTracker'),
        Answer = require('viewmodels/questions/singleSelectImage/answer'),
        getQuestionContentById = require('viewmodels/questions/singleSelectImage/queries/getQuestionContentById'),
        addAnswerCommand = require('viewmodels/questions/singleSelectImage/commands/addAnswer'),
        updateAnswerImageCommand = require('viewmodels/questions/singleSelectImage/commands/updateAnswerImage'),
        setCorrectAnswerCommand = require('viewmodels/questions/singleSelectImage/commands/setCorrectAnswer'),
        removeAnswerCommand = require('viewmodels/questions/singleSelectImage/commands/removeAnswer');

    describe('question [designer]', function () {

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

                it('should set isLoading to true for added answer', function () {
                    viewModel.addAnswer();
                    expect(viewModel.answers()[0].isLoading()).toBeTruthy();
                });

                it('should set isImageUploading to true for added answer', function () {
                    viewModel.addAnswer();
                    expect(viewModel.answers()[0].isImageUploading()).toBeTruthy();
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

                describe('and add add answer command is executed', function () {

                    beforeEach(function (done) {
                        viewModel.answers([]);
                        dfd.resolve('id');
                        done();
                    });

                    it('should set isImageUploading to false', function () {
                        viewModel.addAnswer();

                        dfd.promise.then(function () {
                            expect(viewModel.answers()[0].isImageUploading()).toBeFalsy();
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
                answer = { id: id };

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
                    viewModel.correctAnswerId(answer.id);
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
                            expect(viewModel.correctAnswerId()).toBe(answer.id);
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
                answer = { id: ko.observable(), image: ko.observable(), isLoading: ko.observable(), isImageUploading: ko.observable() };

            beforeEach(function () {
                dfd = Q.defer();
                spyOn(updateAnswerImageCommand, 'execute').and.returnValue(dfd.promise);
                spyOn(notify, 'saved');
            });

            it('should be function', function () {
                expect(viewModel.updateAnswerImage).toBeFunction();
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

                it('should set answer isLoading to true', function () {
                    answer.isLoading(false);
                    viewModel.updateAnswerImage(answer);
                    expect(answer.isLoading()).toBeTruthy();
                });

                it('should set answer isImageUploading to true', function () {
                    answer.isImageUploading(false);
                    viewModel.updateAnswerImage(answer);
                    expect(answer.isImageUploading()).toBeTruthy();
                });
            });

            describe('when image was uploaded', function () {

                var url = 'http://url.com';

                beforeEach(function () {
                    spyOn(imageUpload, 'upload').and.callFake(function (spec) {
                        spec.success(url);
                    });
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

                    it('should set answer isImageUploading to false', function () {
                        answer.isLoading(true);
                        viewModel.updateAnswerImage(answer);

                        dfd.promise.then(function () {
                            expect(answer.isImageUploading()).toBeFalsy();
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

            describe('when image loading failed', function () {
                beforeEach(function () {
                    spyOn(imageUpload, 'upload').and.callFake(function (spec) {
                        spec.error();
                    });
                });

                it('should set answer isImageUploading to false', function () {
                    answer.isLoading(true);
                    viewModel.updateAnswerImage(answer);
                    expect(answer.isImageUploading()).toBeFalsy();
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
                    viewModel.answers.push({});
                    viewModel.answers.push({});
                    viewModel.answers.push({});
                });

                it('should be true', function () {
                    expect(viewModel.canRemoveAnswer()).toBeTruthy();
                });
            });

            describe('when answers count <= 2', function () {
                beforeEach(function () {
                    viewModel.answers([]);
                    viewModel.answers.push({});
                });

                it('should be true', function () {
                    expect(viewModel.canRemoveAnswer()).toBeFalsy();
                });
            });
        });
    });
});