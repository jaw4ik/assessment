﻿import viewModel from 'dialogs/learningPath/deleteLearningPath';

import eventTracker from 'eventTracker';
import app from 'durandal/app';
import constants from 'constants';
import dialog from 'widgets/dialog/viewmodel';
import command from 'dialogs/learningPath/commands/deleteLearningPathCommand';

describe('dialog [deleteLearningPath]', function () {

    var learningPath = {
        title: 'Lego',
        id: 'id'
    };

    beforeEach(function () {
        spyOn(eventTracker, 'publish');
        spyOn(app, 'trigger');
        spyOn(dialog, 'show');
        spyOn(dialog, 'close');
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

        it('should show dialog', function () {
            viewModel.show(learningPath.id, learningPath.title);
            expect(dialog.show).toHaveBeenCalledWith(viewModel, constants.dialogs.deleteItem.settings);
        });
    });

    describe('cancel:', function () {
        it('should publish \'Cancel delete learning path\' event', function () {
            viewModel.cancel();
            expect(eventTracker.publish).toHaveBeenCalledWith('Cancel delete learning path');
        });

        it('should close dialog', function () {
            viewModel.cancel();
            expect(dialog.close).toHaveBeenCalled();
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

            it('should close dialog', function (done) {
                viewModel.deleteLearningPath();
                command.execute().fin(function () {
                    expect(dialog.close).toHaveBeenCalled();
                    done();
                });
            });

            it('should set isDeleting to false', function(done) {
                viewModel.isDeleting(true);
                viewModel.deleteLearningPath();
                command.execute().fin(function() {
                    expect(viewModel.isDeleting()).toBeFalsy();
                    done();
                });
            });
        });
    });
});
