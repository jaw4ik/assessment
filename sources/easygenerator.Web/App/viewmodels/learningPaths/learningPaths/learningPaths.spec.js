import viewModel from './learningPaths';

import createLearningPathCommand from './commands/createLearningPathCommand';
import getLearningPathCollectionQuery from './queries/getLearningPathCollectionQuery';
import app from 'durandal/app';
import constants from 'constants';
import eventTracker from 'eventTracker';
import deleteLearningPathDialog from 'dialogs/learningPath/deleteLearningPath';

describe('viewModel [learningPaths]', function () {
    beforeEach(function () {
        spyOn(eventTracker, 'publish');
        spyOn(app, 'on');
        spyOn(app, 'off');
    });

    describe('activate:', function () {
        var defer,
            learningPaths = [
            {
                id: '0',
                createdOn: new Date(1)
            },
            {
                id: '0',
                createdOn: new Date(1)
            }
            ];

        beforeEach(function () {
            defer = Q.defer();
            spyOn(getLearningPathCollectionQuery, 'execute').and.returnValue(defer.promise);
        });

        it('should subscribe on learningPath.deleted event', function () {
            viewModel.activate();
            expect(app.on).toHaveBeenCalledWith(constants.messages.learningPath.deleted, viewModel.learningPathDeleted);
        });

        describe('when learning paths retrieved', function () {
            beforeEach(function () {
                defer.resolve(learningPaths);
            });

            it('should set learning paths ordered by created on', function (done) {
                viewModel.learningPaths([]);
                viewModel.activate().fin(function () {
                    expect(viewModel.learningPaths().length).toBe(learningPaths.length);
                    expect(viewModel.learningPaths()[0].createdOn.toLocaleString()).toBe(learningPaths[1].createdOn.toLocaleString());
                    expect(viewModel.learningPaths()[1].createdOn.toLocaleString()).toBe(learningPaths[0].createdOn.toLocaleString());
                    done();
                });
            });
        });
    });

    describe('deativate:', function () {
        it('should unsubscribe from learningPath.deleted event', function () {
            viewModel.deactivate();
            expect(app.off).toHaveBeenCalledWith(constants.messages.learningPath.deleted, viewModel.learningPathDeleted);
        });
    });

    describe('createLearningPath:', function () {
        var defer;

        beforeEach(function () {
            defer = Q.defer();
            spyOn(createLearningPathCommand, 'execute').and.returnValue(defer.promise);
        });

        it('should execute create learning path command', function () {
            viewModel.createLearningPath();
            expect(createLearningPathCommand.execute).toHaveBeenCalled();
        });

        it('should return create learning path command result', function () {
            var result = viewModel.createLearningPath();
            expect(result).toBe(defer.promise);
        });

        it('should publish \'Create learning path and open its properties\' event', function () {
            viewModel.createLearningPath();
            expect(eventTracker.publish).toHaveBeenCalledWith('Create learning path and open its properties');
        });
    });

    describe('deleteLearningPath:', function () {
        var learningPath = {
            id: '0',
            title: ko.observable('title')
        };

        beforeEach(function () {
            spyOn(deleteLearningPathDialog, 'show');
        });

        it('should shown delete learning path dialog', function () {
            viewModel.deleteLearningPath(learningPath);
            expect(deleteLearningPathDialog.show).toHaveBeenCalledWith(learningPath.id, learningPath.title());
        });

        it('should publish \'Open \'Delete learning path\' dialog\' event', function () {
            viewModel.deleteLearningPath(learningPath);
            expect(eventTracker.publish).toHaveBeenCalledWith('Open \'Delete learning path\' dialog');
        });
    });

    describe('learningPathDeleted:', function () {
        var learningPath = {
            id: '0',
            title: ko.observable('title')
        };

        beforeEach(function () {
            viewModel.learningPaths([learningPath]);
        });

        it('should remove learning path from collection', function () {
            viewModel.learningPathDeleted(learningPath.id);
            expect(viewModel.learningPaths().length).toBe(0);
        });
    });
});
