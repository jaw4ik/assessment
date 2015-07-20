define(['viewmodels/learningPaths/learningPath/index'], function (viewModel) {

    "use strict";

    var
        getLearningPathByIdQuery = require('viewmodels/learningPaths/learningPath/queries/getLearningPathByIdQuery'),
        updateTitleCommand = require('viewmodels/learningPaths/learningPath/commands/updateTitleCommand'),
        clientContext = require('clientContext'),
        constants = require('constants'),
        eventTracker = require('eventTracker');

    describe('viewModel [learningPath index]', function () {
        var learningPath,
            getLearnigPathDefer;

        beforeEach(function() {
            getLearnigPathDefer = Q.defer();
            spyOn(getLearningPathByIdQuery, 'execute').and.returnValue(getLearnigPathDefer.promise);
            spyOn(eventTracker, 'publish');

            learningPath = {
                id: 'id',
                title: 'title',
            };
        });

        describe('router:', function () {
            it('should be object', function () {
                expect(viewModel.router).toBeObject();
            });
        });

        describe('id:', function () {
            it('should be defined', function () {
                expect(viewModel.id).toBeDefined();
            });
        });

        describe('titleField:', function () {
            it('should be defined', function () {
                expect(viewModel.titleField).toBeDefined();
            });

            describe('maxLength:', function () {
                it('should be constants.validation.learningPathTitleMaxLength', function () {
                    expect(viewModel.titleField.maxLength).toBe(constants.validation.learningPathTitleMaxLength);
                });
            });

            describe('updateTitleHandler:', function () {
                var updateDefer;

                beforeEach(function () {
                    updateDefer = Q.defer();
                    spyOn(updateTitleCommand, 'execute').and.returnValue(updateDefer.promise);
                });

                it('should return promise', function () {
                    expect(viewModel.titleField.updateTitleHandler()).toBePromise();
                });

                it('should call update title command execute()', function () {
                    var newTitle = 'new title', id = 'id';
                    viewModel.id = id;
                    viewModel.titleField.updateTitleHandler(newTitle);
                    expect(updateTitleCommand.execute).toHaveBeenCalledWith(id, newTitle);
                });

                it('should publish \'Update learning path title\' event', function () {
                    viewModel.titleField.updateTitleHandler('new title2');
                    expect(eventTracker.publish).toHaveBeenCalledWith('Update learning path title');
                });
            });

            describe('getTitleHandler:', function () {

                it('should return promise', function () {
                    expect(viewModel.titleField.getTitleHandler()).toBePromise();
                });

                describe('when data received', function () {
                    var title = 'title';
                    beforeEach(function () {
                        getLearnigPathDefer.resolve({ title: title });
                    });

                    it('should return title', function (done) {
                        viewModel.titleField.getTitleHandler().then(function (result) {
                            expect(result).toEqual(title);
                            done();
                        });
                    });

                });
            });
        });

        describe('downloadAction:', function () {
            it('should be object', function () {
                expect(viewModel.downloadAction).toBeObject();
            });
        });

        describe('canActivate:', function () {
            describe('when learning path is not found', function () {
                beforeEach(function () {
                    getLearnigPathDefer.resolve(undefined);
                });

                it('should return redirect object', function (done) {
                    viewModel.canActivate(learningPath.id).then(function (data) {
                        expect(data).toBeObject();
                        done();
                    });
                });
            });

            describe('when learning path is found', function () {
                beforeEach(function () {
                    getLearnigPathDefer.resolve(learningPath);
                });

                it('should return true', function (done) {
                    viewModel.canActivate(learningPath.id).then(function (data) {
                        expect(data).toBeTruthy();
                        done();
                    });
                });
            });
        });

        describe('activate:', function () {
            beforeEach(function () {
                spyOn(clientContext, 'remove');
            });

            it('should set learning path id', function () {
                viewModel.id = null;
                viewModel.activate(learningPath.id);
                expect(viewModel.id).toBe(learningPath.id);
            });

            describe('when received learning path', function () {
                beforeEach(function () {
                    getLearnigPathDefer.resolve(learningPath);
                });

                it('should set title', function (done) {
                    viewModel.activate(learningPath.id).fin(function () {
                        expect(viewModel.titleField.title()).toBe(learningPath.title);
                        done();
                    });
                });

                it('should remove constants.clientContextKeys.lastCreatedLearningPathId entry from client context', function (done) {
                    viewModel.activate(learningPath.id).fin(function () {
                        expect(clientContext.remove).toHaveBeenCalledWith(constants.clientContextKeys.lastCreatedLearningPathId);
                        done();
                    });
                });

                it('should call activate download action', function (done) {
                    spyOn(viewModel.downloadAction, 'activate');

                    viewModel.activate(learningPath.id).fin(function () {
                        expect(viewModel.downloadAction.activate).toHaveBeenCalledWith(learningPath);
                        done();
                    });
                });

                describe('when learning path is last created one', function () {
                    beforeEach(function () {
                        spyOn(clientContext, 'get').and.returnValue(learningPath.id);
                    });

                    it('should set title is selected to true', function (done) {
                        viewModel.titleField.isSelected(false);

                        viewModel.activate(learningPath.id).fin(function () {
                            expect(viewModel.titleField.isSelected()).toBeTruthy();
                            done();
                        });
                    });
                });

                describe('when learning path is not last created one', function () {
                    beforeEach(function () {
                        spyOn(clientContext, 'get').and.returnValue('some id');
                    });

                    it('should set title is selected to false', function (done) {
                        viewModel.titleField.isSelected(true);

                        viewModel.activate(learningPath.id).fin(function () {
                            expect(viewModel.titleField.isSelected()).toBeFalsy();
                            done();
                        });
                    });
                });
            });
        });

    });

});