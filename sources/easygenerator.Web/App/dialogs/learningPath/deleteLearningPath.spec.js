﻿define(['dialogs/learningPath/deleteLearningPath'], function (viewModel) {

    var eventTracker = require('eventTracker'),
        app = require('durandal/app'),
        constants = require('constants'),
        command = require('dialogs/learningPath/commands/deleteLearningPathCommand');

    describe('dialog [deleteLearningPath]', function () {

        var learningPath = {
            title: 'Lego',
            id: 'id'
        };


        beforeEach(function () {
            spyOn(eventTracker, 'publish');
            spyOn(app, 'trigger');
        });

        describe('isShown:', function () {
            it('should be observable', function () {
                expect(viewModel.isShown).toBeObservable();
            });
        });

        describe('isDeleting:', function () {
            it('should be observable', function () {
                expect(viewModel.isDeleting).toBeObservable();
            });
        });

        describe('learningPathId:', function () {
            it('should be defined', function () {
                expect(viewModel.learningPathId).toBeDefined();
            });
        });

        describe('learningPathTitle:', function () {
            it('should be observable', function () {
                expect(viewModel.learningPathTitle).toBeObservable();
            });
        });

        describe('show:', function () {

            it('should set learningPathId', function () {
                viewModel.learningPathId = '';
                viewModel.show(learningPath.id, learningPath.title);
                expect(viewModel.learningPathId).toBe(learningPath.id);
            });

            it('should set learningPathTitle', function () {
                viewModel.learningPathTitle('');
                viewModel.show(learningPath.id, learningPath.title);
                expect(viewModel.learningPathTitle()).toBe(learningPath.title);
            });

            it('should set is shown to true', function () {
                viewModel.isShown(false);
                viewModel.show(learningPath.id, learningPath.title);
                expect(viewModel.isShown()).toBeTruthy();
            });
        });

        describe('close:', function () {
            it('should publish \'Cancel delete learning path\' event', function () {
                viewModel.close();
                expect(eventTracker.publish).toHaveBeenCalledWith('Cancel delete learning path');
            });

            it('should set is shown to false', function () {
                viewModel.isShown(true);
                viewModel.close();
                expect(viewModel.isShown()).toBeFalsy();
            });
        });

        describe('deleteLearningPath:', function () {
            var dfd = Q.defer();
            beforeEach(function () {
                viewModel.learningPathId = learningPath.id;
                spyOn(command, 'execute').and.returnValue(dfd.promise);
            });

            it('should set isDeleting to true', function () {
                viewModel.isDeleting(false);
                viewModel.deleteLearningPath();
                expect(viewModel.isDeleting()).toBeTruthy();
            });

            it('should publish \'Confirm delete learning path\' event', function () {
                viewModel.deleteLearningPath();
                expect(eventTracker.publish).toHaveBeenCalledWith('Confirm delete learning path');
            });

            describe('when learning path deleted successfully', function () {
                beforeEach(function () {
                    dfd.resolve();
                });

                it('should trigger learningPath.deleted event', function (done) {
                    viewModel.deleteLearningPath();
                    command.execute().fin(function () {
                        expect(app.trigger).toHaveBeenCalledWith(constants.messages.learningPath.deleted, learningPath.id);
                        done();
                    });
                });

                it('should set isShown to false', function (done) {
                    viewModel.isShown(true);
                    viewModel.deleteLearningPath();
                    command.execute().fin(function () {
                        expect(viewModel.isShown()).toBeFalsy();
                        done();
                    });
                });

                it('should set isDeleting to false', function (done) {
                    viewModel.isDeleting(true);
                    viewModel.deleteLearningPath();
                    command.execute().fin(function () {
                        expect(viewModel.isDeleting()).toBeFalsy();
                        done();
                    });
                });
            });

            describe('when failed to delete learning path', function () {
                beforeEach(function () {
                    dfd.reject();
                });

                it('should set isDeleting to false', function (done) {
                    viewModel.isDeleting(true);
                    viewModel.deleteLearningPath();
                    command.execute().fin(function () {
                        expect(viewModel.isDeleting()).toBeFalsy();
                        done();
                    });
                });
            });
        });
    });

});