define(['viewmodels/learningPaths/learningPaths/commands/createLearningPathCommand'], function (command) {
    "use strict";
    var
        httpWrapper = require('http/apiHttpWrapper'),
        localizationManager = require('localization/localizationManager'),
        uiLocker = require('uiLocker'),
        router = require('plugins/router'),
        mapper = require('mappers/learningpathModelMapper'),
        dataContext = require('dataContext'),
        clientContext = require('clientContext'),
        constants = require('constants')
    ;

    describe('command [createLearningPath]', function () {

        beforeEach(function () {
            spyOn(router, 'navigate');
            spyOn(uiLocker, 'lock');
            spyOn(uiLocker, 'unlock');
            spyOn(clientContext, 'set');
            spyOn(localizationManager, "localize").and.callFake(function (key) {
                return key;
            });
        });

        describe('execute:', function () {
            var defer;

            beforeEach(function () {
                defer = Q.defer();
                spyOn(httpWrapper, 'post').and.returnValue(defer.promise);
            });

            it('should lock ui', function () {
                command.execute();
                expect(uiLocker.lock).toHaveBeenCalled();
            });

            it('should send request to the server to create learning path', function () {
                command.execute();
                expect(httpWrapper.post).toHaveBeenCalledWith('/api/learningpath/create', { title: 'learningPathDefaultTitle' });
            });

            describe('when learning path created successfully', function () {

                var learningPath = { id: 'learningPathId' };

                beforeEach(function () {
                    defer.resolve(learningPath);
                    spyOn(mapper, 'map').and.returnValue(learningPath);
                });

                it('should push learning created learning path to data context', function (done) {
                    dataContext.learningPaths = [];
                    command.execute().fin(function () {
                        expect(dataContext.learningPaths.length).toBe(1);
                        expect(dataContext.learningPaths[0]).toBe(learningPath);
                        done();
                    });
                });

                it('should navigate to the learning path', function (done) {
                    command.execute().fin(function () {
                        expect(router.navigate).toHaveBeenCalledWith('learningpaths/' + learningPath.id);
                        done();
                    });
                });

                it('should set last created learning path id to client context', function (done) {
                    command.execute().fin(function () {
                        expect(clientContext.set).toHaveBeenCalledWith(constants.clientContextKeys.lastCreatedLearningPathId, learningPath.id);
                        done();
                    });
                });

                it('should unlock ui', function (done) {
                    command.execute().fin(function () {
                        expect(uiLocker.unlock).toHaveBeenCalled();
                        done();
                    });
                });
            });

            describe('when failed to create learning path', function () {

                beforeEach(function () {
                    defer.reject();
                });

                it('should unlock ui', function (done) {
                    command.execute().fin(function () {
                        expect(uiLocker.unlock).toHaveBeenCalled();
                        done();
                    });
                });
            });
        });
    });


});