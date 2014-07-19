define(function (require) {
    "use strict";

    var viewModel = require('viewmodels/questions/singleSelectImage/designer'),
        imageUpload = require('imageUpload'),
        notify = require('notify'),
        Answer = require('viewmodels/questions/singleSelectImage/answer'),
        getQuestionContentById = require('viewmodels/questions/singleSelectImage/queries/getQuestionContentById'),
        addAnswerCommand = require('viewmodels/questions/singleSelectImage/commands/addAnswer'),
        updateAnswerImageCommand = require('viewmodels/questions/singleSelectImage/commands/updateAnswerImage'),
        setCorrectAnswerCommand = require('viewmodels/questions/singleSelectImage/commands/setCorrectAnswer'),
        removeAnswerCommand = require('viewmodels/questions/singleSelectImage/commands/removeAnswer');

    describe('question [designer]', function () {

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

            it('should upload image', function () {
                spyOn(imageUpload, 'upload');
                viewModel.addAnswer();
                expect(imageUpload.upload).toHaveBeenCalled();
            });

            describe('when image was uploaded', function () {

                var url = 'http://url.com';

                beforeEach(function () {
                    spyOn(imageUpload, 'upload').and.callFake(function (spec) {
                        spec.success(url);
                    });
                });

                it('should execute command to add dropspot', function () {
                    viewModel.addAnswer();
                    expect(addAnswerCommand.execute).toHaveBeenCalled();
                });

                describe('and add dropspot command is executed', function () {

                    beforeEach(function (done) {
                        dfd.resolve('id');
                        done();
                    });

                    it('should add answer', function (done) {
                        viewModel.answers([]);

                        viewModel.addAnswer();

                        dfd.promise.then(function () {
                            expect(viewModel.answers().length).toEqual(1);
                            expect(viewModel.answers()[0].id).toEqual('id');
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

                it('should not execute command to set correct answer', function () {
                    viewModel.setCorrectAnswer(answer);
                    expect(setCorrectAnswerCommand.execute).not.toHaveBeenCalled();
                });
            });

            describe('when answer is not correct', function () {
                beforeEach(function () {
                    viewModel.correctAnswerId(null);
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
                id = 'id',
                answer = { id: id, image: ko.observable() };

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
    });
});