﻿define(['viewmodels/objectives/createObjective'],
    function (viewModel) {
        "use strict";

        var
            router = require('plugins/router'),
            uiLocker = require('uiLocker'),
            courseRepository = require('repositories/courseRepository'),
            eventTracker = require('eventTracker'),
            localizationManager = require('localization/localizationManager'),
            ping = require('ping'),
            clientContext = require('clientContext'),
            userContext = require('userContext'),
            BackButton = require('models/backButton')
        ;

        describe('viewModel [createObjective]', function () {

            var repository = require('repositories/objectiveRepository');

            beforeEach(function () {
                spyOn(eventTracker, 'publish');
                spyOn(router, 'navigate');
                spyOn(router, 'navigateWithQueryString');
                spyOn(router, 'replace');
            });

            it('should be object', function () {
                expect(viewModel).toBeObject();
            });

            describe('title:', function () {

                it('should be observable', function () {
                    expect(viewModel.title).toBeObservable();
                });

                it('should have isValid computed', function () {
                    expect(viewModel.title.isValid).toBeComputed();
                });

                describe('when longer than 255 symbols', function () {

                    it('should be not valid', function () {
                        viewModel.title(new Array(257).join('a'));
                        expect(viewModel.title.isValid()).toBeFalsy();
                    });

                });

                describe('when longer than 255 but after trimming - not longer than 255', function () {

                    it('should be true', function () {
                        viewModel.title('   ' + utils.createString(viewModel.objectiveTitleMaxLength - 1) + '   ');
                        expect(viewModel.title.isValid()).toBeTruthy();
                    });

                });

                describe('when empty', function () {

                    it('should be not valid', function () {
                        viewModel.title('');
                        expect(viewModel.title.isValid()).toBeFalsy();
                    });

                });

            });

            describe('objectiveTitleMaxLength:', function () {

                it('should be defined', function () {
                    expect(viewModel.objectiveTitleMaxLength).toBeDefined();
                });

                it('should be 255', function () {
                    expect(viewModel.objectiveTitleMaxLength).toBe(255);
                });

            });

            describe('createAndContinue:', function () {

                var addObjective, relateObjectiveDefer, getObjectiveDefer;

                beforeEach(function () {
                    addObjective = Q.defer();
                    relateObjectiveDefer = Q.defer();
                    getObjectiveDefer = Q.defer();
                    spyOn(repository, 'addObjective').and.returnValue(addObjective.promise);
                    spyOn(repository, 'getById').and.returnValue(getObjectiveDefer.promise);
                    spyOn(courseRepository, 'relateObjective').and.returnValue(relateObjectiveDefer.promise);
                });

                it('should be function', function () {
                    expect(viewModel.createAndContinue).toBeFunction();
                });

                it('should send event \'Create learning objective and open it properties\'', function () {
                    viewModel.createAndContinue();
                    expect(eventTracker.publish).toHaveBeenCalledWith('Create learning objective and open it properties');
                });

                it('should trim title', function () {
                    viewModel.title('   abc   ');
                    viewModel.createAndContinue();
                    expect(viewModel.title()).toEqual('abc');
                    addObjective.resolve();
                });

                describe('when title is valid', function () {

                    beforeEach(function () {
                        viewModel.title('Some valid text');
                    });

                    it('should lock content', function () {
                        spyOn(uiLocker, 'lock');
                        viewModel.createAndContinue();
                        expect(uiLocker.lock).toHaveBeenCalled();
                    });

                    it('should create new objective in repository', function (done) {
                        var title = viewModel.title();
                        addObjective.resolve();

                        viewModel.createAndContinue().fin(function () {
                            expect(repository.addObjective).toHaveBeenCalledWith({
                                title: title
                            });
                            done();
                        });
                    });

                    describe('and objective created', function () {
                        var id = '0';
                        var objective = { id: id };

                        beforeEach(function () {
                            addObjective.resolve(objective);
                            spyOn(uiLocker, "unlock");
                        });

                        it('should clear title', function (done) {
                            viewModel.createAndContinue().fin(function () {
                                expect(viewModel.title()).toBe('');
                                done();
                            });
                        });

                        describe('and when objective isn\'t created in course context', function () {

                            beforeEach(function () {
                                viewModel.contextCourseId = null;
                            });

                            it('should unlock content', function (done) {
                                addObjective.resolve();

                                viewModel.createAndContinue().fin(function () {
                                    expect(uiLocker.unlock).toHaveBeenCalled();
                                    done();
                                });
                            });

                            it('should navigate to created objective editor', function (done) {
                                viewModel.createAndContinue().fin(function () {
                                    expect(router.navigate).toHaveBeenCalledWith('objective/' + id);
                                    done();
                                });
                            });
                        });

                        describe('and when objective is created in course context', function () {

                            beforeEach(function () {
                                viewModel.contextCourseId = 'id';
                                getObjectiveDefer.resolve(objective);
                                relateObjectiveDefer.resolve();
                            });

                            it('should relate created objective to course', function (done) {
                                addObjective.resolve(objective);

                                viewModel.createAndContinue().fin(function () {
                                    expect(courseRepository.relateObjective).toHaveBeenCalledWith(viewModel.contextCourseId, objective.id);
                                    done();
                                });
                            });

                            it('should unlock content', function (done) {
                                addObjective.resolve();

                                viewModel.createAndContinue().fin(function () {
                                    expect(uiLocker.unlock).toHaveBeenCalled();
                                    done();
                                });
                            });

                            it('should navigate to created objective editor', function (done) {

                                viewModel.createAndContinue().fin(function () {
                                    expect(router.navigateWithQueryString).toHaveBeenCalledWith('objective/' + id);
                                    done();
                                });
                            });
                        });

                    });

                    describe('and objective creation failed', function() {
                        
                        beforeEach(function () {
                            addObjective.reject("it failed baby");
                            spyOn(uiLocker, "unlock");
                        });

                        it('should unlock content', function(done) {
                            viewModel.createAndContinue().fin(function () {
                                expect(uiLocker.unlock).toHaveBeenCalled();
                                done();
                            });
                        });

                    });
                });
            });

            describe('navigateToCourseEvent:', function () {

                it('should be function', function () {
                    expect(viewModel.navigateToCourseEvent).toBeFunction();
                });

                it('should send event \'Navigate to course details\'', function () {
                    viewModel.navigateToCourseEvent();
                    expect(eventTracker.publish).toHaveBeenCalledWith('Navigate to course details');
                });

            });

            describe('navigateToObjectivesEvent:', function () {

                it('should be function', function () {
                    expect(viewModel.navigateToObjectivesEvent).toBeFunction();
                });

                it('should send event \'Navigate to objectives\'', function () {
                    viewModel.navigateToObjectivesEvent();
                    expect(eventTracker.publish).toHaveBeenCalledWith('Navigate to objectives');
                });

            });

            describe('canActivate:', function () {

                var dfd;

                beforeEach(function () {
                    dfd = Q.defer();
                    spyOn(ping, 'execute').and.returnValue(dfd.promise);
                });

                it('should be function', function () {
                    expect(viewModel.canActivate).toBeFunction();
                });

                it('should return promise', function () {
                    expect(viewModel.canActivate()).toBePromise();
                });

                it('should ping', function () {
                    viewModel.canActivate();
                    expect(ping.execute).toHaveBeenCalled();
                });

                describe('when ping failed', function () {

                    beforeEach(function () {
                        dfd.reject();
                    });

                    it('should reject promise', function (done) {
                        var promise = viewModel.canActivate();
                        promise.fin(function () {
                            expect(promise).toBeRejected();
                            done();
                        });
                    });

                });

                describe('when ping succeed', function () {

                    beforeEach(function () {
                        dfd.resolve();
                    });

                    it('should reject promise', function (done) {
                        var promise = viewModel.canActivate();
                        promise.fin(function () {
                            expect(promise).toBeResolved();
                            done();
                        });
                    });

                });

            });

            describe('activate:', function () {

                var getCourseDeferred;
                beforeEach(function () {
                    getCourseDeferred = Q.defer();
                    spyOn(courseRepository, 'getById').and.returnValue(getCourseDeferred.promise);
                });

                it('should be function', function () {
                    expect(viewModel.activate).toBeFunction();
                });

                it('should return promise', function () {
                    var result = viewModel.activate();
                    expect(result).toBePromise();
                });

                describe('when \'usersWithClosedCreateObjectiveTip\' is defined in client context', function () {
                    var email = 'test@test.test';

                    beforeEach(function () {
                        spyOn(clientContext, 'set');
                    });

                    describe('and current user in the list of users in \'usersWithClosedCreateObjectiveTip\'', function () {
                        it('should set \'isObjectiveTipClosed\' to true', function (done) {
                            spyOn(clientContext, 'get').and.returnValue([email]);
                            userContext.identity.email = email;

                            viewModel.activate().fin(function () {
                                expect(viewModel.isObjectiveTipClosed()).toBeTruthy();
                                done();
                            });
                        });
                    });

                    describe('and current user not in the list of users in \'usersWithClosedCreateObjectiveTip\'', function () {
                        it('should set \'isObjectiveTipClosed\' to false', function (done) {
                            spyOn(clientContext, 'get').and.returnValue([]);
                            userContext.identity.email = email;
                                            
                            viewModel.activate().fin(function () {
                                expect(viewModel.isObjectiveTipClosed()).toBeFalsy();
                                done();
                            });
                        });
                    });
                });

                describe('when \'usersWithClosedCreateObjectiveTip\' is not defined in client context', function() {
                    it('should set \'isObjectiveTipClosed\' to false', function (done) {
                        spyOn(clientContext, 'get').and.returnValue(undefined);

                        viewModel.activate().fin(function () {
                            expect(viewModel.isObjectiveTipClosed()).toBeFalsy();
                            done();
                        });
                    });
                });

                describe('when query params are null', function () {

                    it('should set contextExpperienceId to null', function (done) {
                        viewModel.activate().fin(function () {
                            expect(viewModel.contextCourseId).toBeNull();
                            done();
                        });
                    });

                    it('should set contextExpperienceTitle to null', function (done) {
                        viewModel.activate().fin(function () {
                            expect(viewModel.contextCourseTitle).toBeNull();
                            done();
                        });
                    });

                    it('should configure back button', function (done) {
                        spyOn(viewModel.backButtonData, 'configure');
                        spyOn(localizationManager, 'localize').and.returnValue('text');

                        var promise = viewModel.activate();

                        promise.fin(function () {
                            expect(viewModel.backButtonData.configure).toHaveBeenCalledWith({ backViewName: 'text', url: 'objectives', callback: viewModel.navigateToObjectivesEvent, alwaysVisible: true });
                            done();
                        });
                    });

                    it('should clear title', function (done) {
                        viewModel.title('Some text');

                        viewModel.activate().fin(function () {
                            expect(viewModel.title().length).toEqual(0);
                            done();
                        });
                    });
                });

                describe('when query params not null', function () {

                    describe('when courseId is string', function () {

                        var queryParams = { courseId: 'id' };

                        describe('when course not found', function () {

                            beforeEach(function () {
                                getCourseDeferred.resolve(null);
                            });

                            it('should replace url to 404', function (done) {
                                viewModel.activate(queryParams).fin(function () {
                                    expect(router.replace).toHaveBeenCalledWith('404');
                                    done();
                                });
                            });

                            it('should set contextCourseId to null', function (done) {
                                viewModel.activate(queryParams).fin(function () {
                                    expect(viewModel.contextCourseId).toBeNull();
                                    done();
                                });
                            });

                            it('should set contextCourseTitle to null', function (done) {
                                viewModel.activate(queryParams).fin(function () {
                                    expect(viewModel.contextCourseTitle).toBeNull();
                                    done();
                                });
                            });

                            it('should resolve promise with undefined', function (done) {
                                var promise = viewModel.activate(queryParams);

                                promise.fin(function () {
                                    expect(promise).toBeResolvedWith(undefined);
                                    done();
                                });
                            });

                            it('should clear title', function (done) {
                                viewModel.title('Some text');

                                viewModel.activate(queryParams).fin(function () {
                                    expect(viewModel.title().length).toEqual(0);
                                    done();
                                });
                            });
                        });

                        describe('when course found', function () {
                            var course = { id: 'id', title: 'title' };
                            beforeEach(function () {
                                getCourseDeferred.resolve(course);
                            });

                            it('should set contextExpperienceId', function (done) {
                                viewModel.activate(queryParams).fin(function () {
                                    expect(viewModel.contextCourseId).toBe(course.id);
                                    done();
                                });
                            });

                            it('should set contextExpperienceTitle', function (done) {
                                viewModel.activate(queryParams).fin(function () {
                                    expect(viewModel.contextCourseTitle).toBe(course.title);
                                    done();
                                });
                            });

                            it('should configure back button', function (done) {
                                spyOn(viewModel.backButtonData, 'configure');
                                spyOn(localizationManager, 'localize').and.returnValue('text');

                                var promise = viewModel.activate(queryParams);
                                promise.fin(function () {
                                    expect(viewModel.backButtonData.configure).toHaveBeenCalledWith({ backViewName: '\'' + course.title + '\'', url: 'course/' + course.id, callback: viewModel.navigateToCourseEvent, alwaysVisible: false });
                                    done();
                                });
                            });

                            it('should clear title', function (done) {
                                viewModel.title('Some text');

                                viewModel.activate(queryParams).fin(function () {
                                    expect(viewModel.title().length).toEqual(0);
                                    done();
                                });
                            });
                        });
                    });

                    describe('when courseId is not string', function () {
                        var queryParams = { courseId: null };

                        it('should set contextExpperienceId to null', function (done) {
                            viewModel.activate(queryParams).fin(function () {
                                expect(viewModel.contextCourseId).toBeNull();
                                done();
                            });
                        });

                        it('should set contextExpperienceTitle to null', function (done) {
                            viewModel.activate(queryParams).fin(function () {
                                expect(viewModel.contextCourseTitle).toBeNull();
                                done();
                            });
                        });

                        it('should configure back button', function (done) {
                            spyOn(viewModel.backButtonData, 'configure');
                            spyOn(localizationManager, 'localize').and.returnValue('text');

                            var promise = viewModel.activate(queryParams);

                            promise.fin(function () {
                                expect(viewModel.backButtonData.configure).toHaveBeenCalledWith({ backViewName: 'text', url: 'objectives', callback: viewModel.navigateToObjectivesEvent, alwaysVisible: true });
                                done();
                            });
                        });

                        it('should clear title', function (done) {
                            viewModel.title('Some text');

                            viewModel.activate(queryParams).fin(function () {
                                expect(viewModel.title().length).toEqual(0);
                                done();
                            });
                        });
                    });
                });

            });

            describe('isTitleEditing:', function () {

                it('should be observable', function () {
                    expect(viewModel.isTitleEditing).toBeObservable();
                });

            });

            describe('contextCourseTitle:', function () {
                it('should be defined', function () {
                    expect(viewModel.contextCourseTitle).toBeDefined();
                });
            });

            describe('contextCourseId:', function () {
                it('should be defined', function () {
                    expect(viewModel.contextCourseId).toBeDefined();
                });
            });

            describe('backButtonData:', function () {

                it('should be instance of BackButton', function () {
                    expect(viewModel.backButtonData).toBeInstanceOf(BackButton);
                });

            });

            describe('showObjectiveTip', function() {
                beforeEach(function () {
                    spyOn(clientContext, 'set');
                });

                it('should be function', function () {
                    expect(viewModel.showObjectiveTip).toBeFunction();
                });

                it('should set \'isObjectiveTipClosed\' to false', function () {
                    spyOn(clientContext, 'get');
                    viewModel.isObjectiveTipClosed(true);
                    viewModel.showObjectiveTip();
                    expect(viewModel.isObjectiveTipClosed()).toBeFalsy();
                });

                it('should send event \'Expand \"Learning objective hint\"\'', function () {
                    spyOn(clientContext, 'get');
                    viewModel.showObjectiveTip();
                    expect(eventTracker.publish).toHaveBeenCalledWith('Expand "Learning objective hint"');
                });

                it('should remove current user from \'usersWithClosedCreateObjectiveTip\' in client context', function () {
                    var email = "test@test.test";
                    userContext.identity.email = email;
                    spyOn(clientContext, 'get').and.returnValue([email]);

                    viewModel.showObjectiveTip();
                    expect(clientContext.set).toHaveBeenCalledWith('usersWithClosedCreateObjectiveTip', []);
                });
            });

            describe('hideObjectiveTip', function () {
                beforeEach(function () {
                    spyOn(clientContext, 'set');
                });

                it('should be function', function () {
                    expect(viewModel.hideObjectiveTip).toBeFunction();
                });

                it('should set \'isObjectiveTipClosed\' to true', function () {
                    spyOn(clientContext, 'get');
                    viewModel.isObjectiveTipClosed(false);
                    viewModel.hideObjectiveTip();
                    expect(viewModel.isObjectiveTipClosed()).toBeTruthy();
                });

                it('should send event \'Collapse \"Learning objective hint\"\'', function () {
                    spyOn(clientContext, 'get');
                    viewModel.hideObjectiveTip();
                    expect(eventTracker.publish).toHaveBeenCalledWith('Collapse "Learning objective hint"');
                });

                it('should add current user to \'usersWithClosedCreateObjectiveTip\' in client context', function () {
                    var email = "test@test.test";
                    userContext.identity.email = email;
                    spyOn(clientContext, 'get').and.returnValue([]);

                    viewModel.hideObjectiveTip();
                    expect(clientContext.set).toHaveBeenCalledWith('usersWithClosedCreateObjectiveTip', [email]);
                });
            });

            describe('isObjectiveTipClosed', function() {
                it('should be observable', function () {
                    expect(viewModel.isObjectiveTipClosed).toBeObservable();
                });
            });
        });
    }
);