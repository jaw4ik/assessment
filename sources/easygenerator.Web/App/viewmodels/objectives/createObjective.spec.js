define(['viewmodels/objectives/createObjective'],
    function (viewModel) {
        "use strict";

        var
            router = require('plugins/router'),
            uiLocker = require('uiLocker'),
            courseRepository = require('repositories/courseRepository'),
            eventTracker = require('eventTracker'),
            localizationManager = require('localization/localizationManager'),
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
                    spyOn(repository, 'addObjective').andReturn(addObjective.promise);
                    spyOn(repository, 'getById').andReturn(getObjectiveDefer.promise);
                    spyOn(courseRepository, 'relateObjectives').andReturn(relateObjectiveDefer.promise);
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

                    it('should create new objective in repository', function () {
                        var title = viewModel.title();

                        viewModel.createAndContinue();

                        var promise = addObjective.promise.fin(function () {
                        });
                        addObjective.resolve();

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(repository.addObjective).toHaveBeenCalledWith({
                                title: title
                            });
                        });
                    });

                    describe('and objective created', function () {
                        var id = '0';
                        var objective = { id: id };

                        beforeEach(function () {
                            addObjective.resolve(objective);
                            spyOn(uiLocker, "unlock");
                        });

                        it('should clear title', function () {
                            viewModel.createAndContinue();

                            var promise = addObjective.promise.fin(function () { });

                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(viewModel.title()).toBe('');
                            });
                        });

                        describe('and when objective isn\'t created in course context', function () {

                            beforeEach(function () {
                                viewModel.contextCourseId = null;
                            });

                            it('should unlock content', function () {
                                viewModel.createAndContinue();

                                var promise = addObjective.promise.fin(function () { });
                                addObjective.resolve();

                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(uiLocker.unlock).toHaveBeenCalled();
                                });
                            });

                            it('should navigate to created objective editor', function () {
                                viewModel.createAndContinue();

                                var promise = addObjective.promise.fin(function () { });

                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(router.navigate).toHaveBeenCalledWith('objective/' + id);
                                });
                            });
                        });

                        describe('and when objective is created in course context', function () {

                            beforeEach(function () {
                                viewModel.contextCourseId = 'id';
                                getObjectiveDefer.resolve(objective);
                                relateObjectiveDefer.resolve();
                            });

                            it('should relate created objective to course', function () {
                                viewModel.createAndContinue();

                                var promise = addObjective.promise.fin(function () { });

                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(courseRepository.relateObjectives).toHaveBeenCalledWith(viewModel.contextCourseId, [objective]);
                                });
                            });

                            it('should unlock content', function () {
                                viewModel.createAndContinue();

                                var promise = addObjective.promise.fin(function () { });
                                addObjective.resolve();

                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(uiLocker.unlock).toHaveBeenCalled();
                                });
                            });

                            it('should navigate to created objective editor', function () {
                                viewModel.createAndContinue();

                                var promise = addObjective.promise.fin(function () {
                                });

                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(router.navigateWithQueryString).toHaveBeenCalledWith('objective/' + id);
                                });
                            });
                        });

                    });
                });
            });

            describe('navigateToCourseEvent:', function() {

                it('should be function', function() {
                    expect(viewModel.navigateToCourseEvent).toBeFunction();
                });

                it('should send event \'Navigate to course\'', function () {
                    viewModel.navigateToCourseEvent();
                    expect(eventTracker.publish).toHaveBeenCalledWith('Navigate to course');
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

            describe('activate:', function () {

                var getCourseDeferred;
                beforeEach(function () {
                    getCourseDeferred = Q.defer();
                    spyOn(courseRepository, 'getById').andReturn(getCourseDeferred.promise);
                });

                it('should be function', function () {
                    expect(viewModel.activate).toBeFunction();
                });

                it('should return promise', function () {
                    var result = viewModel.activate();
                    expect(result).toBePromise();
                });

                describe('when query params are null', function() {

                    it('should set contextExpperienceId to null', function () {
                        var promise = viewModel.activate();
                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(viewModel.contextCourseId).toBeNull();
                        });
                    });

                    it('should set contextExpperienceTitle to null', function () {
                        var promise = viewModel.activate();
                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(viewModel.contextCourseTitle).toBeNull();
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

                    it('should clear title', function () {
                        viewModel.title('Some text');

                        var promise = viewModel.activate();

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(viewModel.title().length).toEqual(0);
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

                            it('should replace url to 404', function () {
                                var promise = viewModel.activate(queryParams);
                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(router.replace).toHaveBeenCalledWith('404');
                                });
                            });

                            it('should set contextCourseId to null', function () {
                                var promise = viewModel.activate(queryParams);
                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(viewModel.contextCourseId).toBeNull();
                                });
                            });

                            it('should set contextCourseTitle to null', function () {
                                var promise = viewModel.activate(queryParams);
                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(viewModel.contextCourseTitle).toBeNull();
                                });
                            });

                            it('should resolve promise with undefined', function () {
                                var promise = viewModel.activate(queryParams);
                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(promise).toBeResolvedWith(undefined);
                                });
                            });

                            it('should clear title', function () {
                                viewModel.title('Some text');

                                var promise = viewModel.activate(queryParams);

                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(viewModel.title().length).toEqual(0);
                                });
                            });
                        });

                        describe('when course found', function () {
                            var course = { id: 'id', title: 'title' };
                            beforeEach(function () {
                                getCourseDeferred.resolve(course);
                            });

                            it('should set contextExpperienceId', function () {
                                var promise = viewModel.activate(queryParams);
                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(viewModel.contextCourseId).toBe(course.id);
                                });
                            });

                            it('should set contextExpperienceTitle', function () {
                                var promise = viewModel.activate(queryParams);
                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(viewModel.contextCourseTitle).toBe(course.title);
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

                            it('should clear title', function () {
                                viewModel.title('Some text');

                                var promise = viewModel.activate(queryParams);

                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(viewModel.title().length).toEqual(0);
                                });
                            });
                        });
                    });

                    describe('when courseId is not string', function () {
                        var queryParams = { courseId: null };

                        it('should set contextExpperienceId to null', function () {
                            var promise = viewModel.activate(queryParams);
                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(viewModel.contextCourseId).toBeNull();
                            });
                        });

                        it('should set contextExpperienceTitle to null', function () {
                            var promise = viewModel.activate(queryParams);
                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(viewModel.contextCourseTitle).toBeNull();
                            });
                        });

                        it('should configure back button', function (done) {
                            spyOn(viewModel.backButtonData, 'configure');
                            spyOn(localizationManager, 'localize').and.returnValue('text');
                            deferred.resolve(null);

                            var promise = viewModel.activate(queryParams);

                            promise.fin(function () {
                                expect(viewModel.backButtonData.configure).toHaveBeenCalledWith({ backViewName: 'text', url: 'objectives', callback: viewModel.navigateToObjectivesEvent, alwaysVisible: true });
                                done();
                            });
                        });

                        it('should clear title', function () {
                            viewModel.title('Some text');

                            var promise = viewModel.activate(queryParams);

                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(viewModel.title().length).toEqual(0);
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

        });
    }
);