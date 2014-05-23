define(function (require) {

    "use strict";

    var viewModel = require('viewmodels/questions/questionTitle'),
        eventTracker = require('eventTracker'),
        questionRepository = require('repositories/questionRepository'),
        constants = require('constants'),
        notify = require('notify');

    describe('viewModel [questionTitlte]', function () {

        var objectiveId, question, titleWrapper;

        beforeEach(function () {
            objectiveId = 'objectiveId';
            question = {
                id: 'questionId',
                title: 'Question title'
            };
            titleWrapper = new viewModel(objectiveId, question);
            spyOn(eventTracker, 'publish');
        });

        it('should be defined', function () {
            expect(viewModel).toBeDefined();
        });

        describe('title:', function () {

            it('should be observable', function () {
                expect(titleWrapper.title).toBeObservable();
            });

            it('should be equal question.title', function () {
                expect(titleWrapper.title()).toBe(question.title);
            });

            describe('isEditing:', function () {

                it('should be observable', function () {
                    expect(titleWrapper.title.isEditing).toBeObservable();
                });

            });

            describe('isValid:', function () {

                it('should be observable', function () {
                    expect(titleWrapper.title.isValid).toBeComputed();
                });

                describe('when title length more than 0 and less than 255', function () {

                    it('should return true', function () {
                        titleWrapper.title('Question title');
                        expect(titleWrapper.title.isValid()).toBeTruthy();
                    });

                });

                describe('when title length equal 0 or more than 255 ', function () {

                    it('should return false', function () {
                        titleWrapper.title('');
                        expect(titleWrapper.title.isValid()).toBeFalsy();
                    });

                });

            });

        });

        describe('startEditQuestionTitle:', function () {

            it('should be function', function () {
                expect(titleWrapper.startEditQuestionTitle).toBeFunction();
            });

            it('should set title.isEditing to true', function () {
                titleWrapper.title.isEditing(false);
                titleWrapper.startEditQuestionTitle();
                expect(titleWrapper.title.isEditing()).toBeTruthy();
            });

        });

        describe('endEditQuestionTitle:', function () {
            var updateDeferred, getByIdDeferred;

            beforeEach(function () {
                updateDeferred = Q.defer();
                getByIdDeferred = Q.defer();

                spyOn(questionRepository, 'updateTitle').and.returnValue(updateDeferred.promise);
                spyOn(questionRepository, 'getById').and.returnValue(getByIdDeferred.promise);
                question = {
                    id: 'questionId',
                    title: 'Question title'
                };
            });

            it('should be function', function () {
                expect(titleWrapper.endEditQuestionTitle).toBeFunction();
            });

            it('should set title.isEditing to false', function () {
                titleWrapper.title.isEditing(true);
                titleWrapper.endEditQuestionTitle();
                expect(titleWrapper.title.isEditing()).toBeFalsy();
            });

            it('should trim title', function () {
                titleWrapper.title('    Some title    ');
                titleWrapper.endEditQuestionTitle();
                expect(titleWrapper.title()).toEqual('Some title');
            });

            describe('when title is not modified', function () {
                var promise = null;
                beforeEach(function () {
                    titleWrapper.title(question.title);
                    promise = getByIdDeferred.promise.finally(function () { });
                    getByIdDeferred.resolve(question);
                });

                it('should not send event', function (done) {
                    titleWrapper.endEditQuestionTitle();

                    promise.fin(function () {
                        expect(eventTracker.publish).not.toHaveBeenCalled();
                        done();
                    });
                });

                it('should not show notification', function (done) {
                    spyOn(notify, 'saved');
                    titleWrapper.endEditQuestionTitle();

                    promise.fin(function () {
                        expect(promise).toBeResolved();
                        expect(notify.saved).not.toHaveBeenCalled();
                        done();
                    });
                });

                it('should not update question in repository', function (done) {
                    titleWrapper.endEditQuestionTitle();

                    promise.fin(function () {
                        expect(promise).toBeResolved();
                        expect(questionRepository.updateTitle).not.toHaveBeenCalled();
                        done();
                    });
                });
            });

            describe('when title is modified', function () {

                var getPromise = null, newTitle = 'lala';
                beforeEach(function () {
                    titleWrapper.title(newTitle);
                    getPromise = getByIdDeferred.promise.finally(function () { });
                    getByIdDeferred.resolve(question);
                });

                it('should send event \'Update question title\'', function (done) {
                    titleWrapper.endEditQuestionTitle();

                    getPromise.fin(function () {
                        expect(getPromise).toBeResolved();
                        expect(eventTracker.publish).toHaveBeenCalledWith('Update question title');
                        done();
                    });
                });

                describe('and when title is valid', function () {

                    it('should update question in repository', function (done) {
                        titleWrapper.endEditQuestionTitle();

                        getPromise.fin(function () {
                            expect(getPromise).toBeResolved();
                            expect(questionRepository.updateTitle).toHaveBeenCalled();
                            expect(questionRepository.updateTitle.calls.mostRecent().args[1]).toEqual(newTitle);
                            done();
                        });
                    });

                    describe('and when question updated successfully', function () {

                        it('should update notificaion', function (done) {
                            spyOn(notify, 'saved');

                            titleWrapper.endEditQuestionTitle();

                            var promise = updateDeferred.promise.finally(function () { });
                            updateDeferred.resolve(question);

                            Q.all(getPromise, promise).fin(function () {
                                expect(promise).toBeResolved();
                                expect(notify.saved).toHaveBeenCalled();
                                done();
                            });
                        });

                    });

                });

                describe('and when title is not valid', function () {

                    it('should revert quiestion title value', function (done) {
                        titleWrapper.title('');
                        titleWrapper.endEditQuestionTitle();

                        getPromise.fin(function () {
                            expect(titleWrapper.title()).toBe(question.title);
                            done();
                        });
                    });

                });
            });

        });

    });

});