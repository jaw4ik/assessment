define(['commands/createObjectiveCommand'], function (command) {

    var
        objectiveRepository = require('repositories/objectiveRepository'),
        courseRepository = require('repositories/courseRepository'),
        localizationManager = require('localization/localizationManager'),
        router = require('plugins/router'),
        uiLocker = require('uiLocker'),
        clientContext = require('clientContext'),
        eventTracker = require('eventTracker'),
        constants = require('constants'),
        app = require('durandal/app')
    ;

    describe('command [createObjectiveCommand]', function () {

        describe('execute:', function () {

            var addObjectiveDefer,
                title = 'title';

            beforeEach(function () {
                addObjectiveDefer = Q.defer();

                spyOn(router, 'navigate');
                spyOn(objectiveRepository, 'addObjective').and.returnValue(addObjectiveDefer.promise);

                spyOn(uiLocker, 'lock');
                spyOn(uiLocker, 'unlock');
                spyOn(clientContext, 'set');
                spyOn(eventTracker, 'publish');
                spyOn(app, 'trigger');
            });

            it('should be function', function () {
                expect(command.execute).toBeFunction();
            });

            it('should return promise', function () {
                expect(command.execute()).toBePromise();
            });

            it('should send event \'Create learning objective and open it properties', function () {
                command.execute();
                expect(eventTracker.publish).toHaveBeenCalledWith('Create learning objective and open it properties');
            });

            it('should lock content', function () {
                command.execute();
                expect(uiLocker.lock).toHaveBeenCalled();
            });

            it('should add objective to repository', function () {
                spyOn(localizationManager, 'localize').and.returnValue(title);
                command.execute();
                expect(objectiveRepository.addObjective).toHaveBeenCalledWith({ title: title });
            });

            describe('when objective added', function () {
                var objectiveId = 'objectiveId',
                    objective = { id: objectiveId };

                beforeEach(function () {
                    addObjectiveDefer.resolve(objective);
                });

                describe('and when context course id is a string', function () {
                    var courseId = 'courseId',
                        relateObjectiveDefer;

                    beforeEach(function () {
                        relateObjectiveDefer = Q.defer();

                        spyOn(courseRepository, 'relateObjective').and.returnValue(relateObjectiveDefer.promise);
                    });

                    it('should set lastCreatedObjectiveId in client context', function (done) {
                        relateObjectiveDefer.resolve();
                        command.execute(courseId).fin(function () {
                            expect(clientContext.set).toHaveBeenCalledWith(constants.clientContextKeys.lastCreatedObjectiveId, objectiveId);
                            done();
                        });
                    });

                    it('should relate created objective to course', function (done) {
                        relateObjectiveDefer.resolve();
                        command.execute(courseId).fin(function () {
                            expect(courseRepository.relateObjective).toHaveBeenCalledWith(courseId, objectiveId);
                            done();
                        });
                    });

                    describe('and when objective related to course', function () {
                        beforeEach(function () {
                            relateObjectiveDefer.resolve();
                        });

                        it('should trigger app event', function (done) {
                            command.execute(courseId).fin(function () {
                                expect(app.trigger).toHaveBeenCalledWith(constants.messages.objective.createdInCourse);
                                done();
                            });
                        });

                        it('should unlock content', function (done) {
                            command.execute(courseId).fin(function () {
                                expect(uiLocker.unlock).toHaveBeenCalled();
                                done();
                            });
                        });

                        it('should navigate to created objective withint course', function (done) {
                            command.execute(courseId).fin(function () {
                                expect(router.navigate).toHaveBeenCalledWith('courses/' + courseId + '/objectives/' + objectiveId);
                                done();
                            });
                        });
                    });
                });

                describe('and when context course id is not a string', function () {

                    it('should set lastCreatedObjectiveId in client context', function (done) {
                        command.execute().fin(function () {
                            expect(clientContext.set).toHaveBeenCalledWith(constants.clientContextKeys.lastCreatedObjectiveId, objectiveId);
                            done();
                        });
                    });

                    it('should unlock content', function (done) {
                        command.execute().fin(function () {
                            expect(uiLocker.unlock).toHaveBeenCalled();
                            done();
                        });
                    });

                    it('should navigate to created objective', function () {
                        command.execute().fin(function () {
                            expect(router.navigate).toHaveBeenCalledWith('library/objectives/' + objectiveId);
                            done();
                        });
                    });
                });
            });

            describe('when failed to  add objective', function () {
                beforeEach(function () {
                    addObjectiveDefer.reject();
                });

                it('should unlock content', function (done) {
                    command.execute().fin(function () {
                        expect(uiLocker.unlock).toHaveBeenCalled();
                        done();
                    });
                });
            });
        });

    });

})
