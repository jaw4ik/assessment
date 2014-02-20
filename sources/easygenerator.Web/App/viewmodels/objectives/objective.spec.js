define(['viewmodels/objectives/objective'],
    function (viewModel) {
        "use strict";

        var router = require('plugins/router'),
            eventTracker = require('eventTracker'),
            repository = require('repositories/objectiveRepository'),
            courseRepository = require('repositories/courseRepository'),
            questionRepository = require('repositories/questionRepository'),
            localizationManager = require('localization/localizationManager'),
            notify = require('notify'),
            uiLocker = require('uiLocker'),
            clientContext = require('clientContext');

        describe('viewModel [objective]', function () {

            var objective = {
                id: '1',
                title: 'Test Objective 1',
                createdOn: new Date(),
                modifiedOn: new Date(),
                image: '',
                questions: [
                    { id: 0, title: 'A' },
                    { id: 1, title: 'b' },
                    { id: 2, title: 'B' },
                    { id: 3, title: 'a' }
                ]
            };

            beforeEach(function () {
                spyOn(eventTracker, 'publish');
                spyOn(router, 'navigateWithQueryString');
                spyOn(router, 'navigate');
                spyOn(router, 'replace');
            });

            it('is object', function () {
                expect(viewModel).toBeObject();
            });

            describe('activate:', function () {

                var deferred, getCourseDeferred;

                beforeEach(function () {
                    viewModel.contextCourseTitle = null;
                    viewModel.contextCourseId = null;
                    viewModel.goBackTooltip = '';
                    viewModel.goBackLink = '';

                    deferred = Q.defer();
                    getCourseDeferred = Q.defer();
                    spyOn(repository, 'getById').andReturn(deferred.promise);
                    spyOn(courseRepository, 'getById').andReturn(getCourseDeferred.promise);
                });

                it('should be a function', function () {
                    expect(viewModel.activate).toBeFunction();
                });

                it('should set client context with current objective id', function () {
                    spyOn(clientContext, 'set');
                    var promise = viewModel.activate(objective.id, null);
                    deferred.resolve();

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(clientContext.set).toHaveBeenCalledWith('lastVisitedObjective', objective.id);
                    });

                });

                describe('when queryParams are null', function () {

                    it('should set contextExpperienceId to null', function () {
                        var promise = viewModel.activate(objective.id, null);
                        deferred.resolve(null);

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(viewModel.contextCourseId).toBeNull();
                        });
                    });

                    it('should set contextExpperienceTitle to null', function () {
                        var promise = viewModel.activate(objective.id, null);
                        deferred.resolve(null);

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(viewModel.contextCourseTitle).toBeNull();
                        });
                    });

                    it('should set goBackTooltip to \'Back to objectives\'', function () {
                        spyOn(localizationManager, 'localize').andReturn('text');

                        var promise = viewModel.activate(objective.id, null);
                        deferred.resolve(objective);

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(promise).toBeResolved();
                            expect(viewModel.goBackTooltip).toEqual('text text');
                        });
                    });

                    it('should set goBackLink to objectives', function () {
                        var promise = viewModel.activate(objective.id, null);
                        deferred.resolve(objective);

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(promise).toBeResolved();
                            expect(viewModel.goBackLink).toEqual('#objectives');
                        });
                    });

                    describe('when objective not found', function () {

                        beforeEach(function () {
                            deferred.reject('reason');
                        });

                        it('should set router.activeItem.settings.lifecycleData.redirect to \'404\'', function () {
                            router.activeItem.settings.lifecycleData = null;

                            var promise = viewModel.activate(objective.id, null);
                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(router.activeItem.settings.lifecycleData.redirect).toBe('404');
                            });
                        });

                        it('should reject promise', function () {
                            var promise = viewModel.activate(objective.id, null);
                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(promise).toBeRejectedWith('reason');
                            });
                        });
                    });

                    describe('when objective exists', function () {
                        beforeEach(function () {
                            deferred.resolve(objective);
                        });

                        it('should return promise', function () {
                            expect(viewModel.activate('id', null)).toBePromise();
                        });

                        it('should set objective title', function () {
                            viewModel.title('');

                            var promise = viewModel.activate(objective.id, null);

                            waitsFor(function () {
                                return promise.isFulfilled();
                            });
                            runs(function () {
                                expect(viewModel.title()).toBe(objective.title);
                            });
                        });

                        it('should set currentLanguage', function () {
                            viewModel.currentLanguage = null;
                            viewModel.activate(objective.id, null);
                            expect(viewModel.currentLanguage).not.toBeNull();
                        });

                        it('should initialize questions collection', function () {
                            viewModel.questions([]);
                            var promise = viewModel.activate(objective.id, null);
                            waitsFor(function () {
                                return promise.isFulfilled();
                            });
                            runs(function () {
                                expect(viewModel.questions().length).toBe(objective.questions.length);
                            });
                        });

                        it('should sort questions asc', function () {
                            var promise = viewModel.activate(objective.id, null);
                            waitsFor(function () {
                                return promise.isFulfilled();
                            });
                            runs(function () {
                                expect(viewModel.questions).toBeSortedAsc('title');
                            });
                        });

                    });
                });

                describe('when queryParams are not null', function () {

                    describe('when courseId is not string', function () {
                        var queryParams = { courseId: null };

                        it('should set contextExpperienceId to null', function () {
                            var promise = viewModel.activate(objective.id, queryParams);
                            deferred.resolve(null);

                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(viewModel.contextCourseId).toBeNull();
                            });
                        });

                        it('should set contextExpperienceTitle to null', function () {
                            var promise = viewModel.activate(objective.id, queryParams);
                            deferred.resolve(null);

                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(viewModel.contextCourseTitle).toBeNull();
                            });
                        });

                        it('should set goBackTooltip to \'Back to objectives\'', function () {
                            spyOn(localizationManager, 'localize').andReturn('text');

                            var promise = viewModel.activate(objective.id, queryParams);
                            deferred.resolve(objective);

                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(promise).toBeResolved();
                                expect(viewModel.goBackTooltip).toEqual('text text');
                            });
                        });

                        it('should set goBackLink to objectives', function () {
                            var promise = viewModel.activate(objective.id, queryParams);
                            deferred.resolve(objective);

                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(promise).toBeResolved();
                                expect(viewModel.goBackLink).toEqual('#objectives');
                            });
                        });

                        describe('when objective not found', function () {

                            beforeEach(function () {
                                deferred.reject('reason');
                            });

                            it('should set router.activeItem.settings.lifecycleData.redirect to \'404\'', function () {
                                router.activeItem.settings.lifecycleData = null;

                                var promise = viewModel.activate(objective.id, queryParams);
                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(router.activeItem.settings.lifecycleData.redirect).toBe('404');
                                });
                            });

                            it('should reject promise', function () {
                                var promise = viewModel.activate(objective.id, queryParams);
                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(promise).toBeRejectedWith('reason');
                                });
                            });
                        });

                        describe('when objective exists', function () {
                            beforeEach(function () {
                                deferred.resolve(objective);
                            });

                            it('should return promise', function () {
                                expect(viewModel.activate('id', queryParams)).toBePromise();
                            });

                            it('should set objective title', function () {
                                viewModel.title('');

                                var promise = viewModel.activate(objective.id, queryParams);

                                waitsFor(function () {
                                    return promise.isFulfilled();
                                });
                                runs(function () {
                                    expect(viewModel.title()).toBe(objective.title);
                                });
                            });

                            it('should set currentLanguage', function () {
                                viewModel.currentLanguage = null;
                                viewModel.activate(objective.id, queryParams);
                                expect(viewModel.currentLanguage).not.toBeNull();
                            });

                            it('should initialize questions collection', function () {
                                viewModel.questions([]);
                                var promise = viewModel.activate(objective.id, queryParams);
                                waitsFor(function () {
                                    return promise.isFulfilled();
                                });
                                runs(function () {
                                    expect(viewModel.questions().length).toBe(objective.questions.length);
                                });
                            });

                            it('should sort questions asc', function () {
                                var promise = viewModel.activate(objective.id, queryParams);
                                waitsFor(function () {
                                    return promise.isFulfilled();
                                });
                                runs(function () {
                                    expect(viewModel.questions).toBeSortedAsc('title');
                                });
                            });

                        });
                    });

                    describe('when courseId is string', function () {
                        var course = { id: 'id1', title: 'Course 1' };
                        var queryParams = { courseId: 'id' };

                        describe('when course exists', function () {

                            beforeEach(function () {
                                getCourseDeferred.resolve(course);
                            });

                            describe('when objective not found', function () {

                                beforeEach(function () {
                                    deferred.reject('reason');
                                });

                                it('should set router.activeItem.settings.lifecycleData.redirect to \'404\'', function () {
                                    router.activeItem.settings.lifecycleData = null;

                                    var promise = viewModel.activate(objective.id, queryParams);
                                    waitsFor(function () {
                                        return !promise.isPending();
                                    });
                                    runs(function () {
                                        expect(router.activeItem.settings.lifecycleData.redirect).toBe('404');
                                    });
                                });

                                it('should reject promise', function () {
                                    var promise = viewModel.activate(objective.id, queryParams);
                                    waitsFor(function () {
                                        return !promise.isPending();
                                    });
                                    runs(function () {
                                        expect(promise).toBeRejectedWith('reason');
                                    });
                                });
                            });

                            describe('when objective exists', function () {
                                beforeEach(function () {
                                    deferred.resolve(objective);
                                });

                                it('should return promise', function () {
                                    expect(viewModel.activate('id', queryParams)).toBePromise();
                                });

                                it('should set contextExpperienceId', function () {
                                    var promise = viewModel.activate('id', queryParams);
                                    waitsFor(function () {
                                        return !promise.isPending();
                                    });
                                    runs(function () {
                                        expect(viewModel.contextCourseId).toBe(course.id);
                                    });
                                });

                                it('should set contextExpperienceTitle', function () {
                                    var promise = viewModel.activate('id', queryParams);
                                    waitsFor(function () {
                                        return !promise.isPending();
                                    });
                                    runs(function () {
                                        expect(viewModel.contextCourseTitle).toBe(course.title);
                                    });
                                });

                                it('should set goBackTooltip to \'Back to course\'', function () {
                                    spyOn(localizationManager, 'localize').andReturn('text');

                                    var promise = viewModel.activate('id', queryParams);
                                    waitsFor(function () {
                                        return !promise.isPending();
                                    });
                                    runs(function () {
                                        expect(promise).toBeResolved();
                                        expect(viewModel.goBackTooltip).toEqual('text' + ' \'' + course.title + '\'');
                                    });
                                });

                                it('should set goBackLink to course', function () {
                                    var promise = viewModel.activate('id', queryParams);
                                    waitsFor(function () {
                                        return !promise.isPending();
                                    });
                                    runs(function () {
                                        expect(promise).toBeResolved();
                                        expect(viewModel.goBackLink).toEqual('#course/' + course.id);
                                    });
                                });

                                it('should set objective title', function () {
                                    viewModel.title('');

                                    var promise = viewModel.activate(objective.id, queryParams);

                                    waitsFor(function () {
                                        return !promise.isPending();
                                    });
                                    runs(function () {
                                        expect(viewModel.title()).toBe(objective.title);
                                    });
                                });

                                it('should set currentLanguage', function () {
                                    viewModel.currentLanguage = null;
                                    viewModel.activate(objective.id, queryParams);
                                    expect(viewModel.currentLanguage).not.toBeNull();
                                });

                                it('should initialize questions collection', function () {
                                    viewModel.questions([]);
                                    var promise = viewModel.activate(objective.id, queryParams);
                                    waitsFor(function () {
                                        return !promise.isPending();
                                    });
                                    runs(function () {
                                        expect(viewModel.questions().length).toBe(objective.questions.length);
                                    });
                                });

                                it('should sort questions asc', function () {
                                    var promise = viewModel.activate(objective.id, queryParams);
                                    waitsFor(function () {
                                        return !promise.isPending();
                                    });
                                    runs(function () {
                                        expect(viewModel.questions).toBeSortedAsc('title');
                                    });
                                });

                            });
                        });

                        describe('when course does not exist', function () {
                            beforeEach(function () {
                                getCourseDeferred.reject('reason');
                            });

                            it('should set router.activeItem.settings.lifecycleData.redirect to \'404\'', function () {
                                router.activeItem.settings.lifecycleData = null;

                                var promise = viewModel.activate('id', queryParams);
                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(router.activeItem.settings.lifecycleData.redirect).toBe('404');
                                });
                            });

                            it('should reject promise', function () {
                                var promise = viewModel.activate('id', queryParams);
                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(promise).toBeRejectedWith('reason');
                                });
                            });

                            it('should set contextCourseId to null', function () {
                                var promise = viewModel.activate('id', queryParams);
                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(viewModel.contextCourseId).toBeNull();
                                });
                            });

                            it('should set contextCourseTitle to null', function () {
                                var promise = viewModel.activate('id', queryParams);
                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(viewModel.contextCourseTitle).toBeNull();
                                });
                            });
                        });
                    });
                });
            });

            describe('title:', function () {

                it('should be observable', function () {
                    expect(viewModel.title).toBeObservable();
                });

                describe('isEditing:', function () {

                    it('should be observable', function () {
                        expect(viewModel.title.isEditing).toBeObservable();
                    });

                });

                describe('isValid:', function () {

                    it('should be computed', function () {
                        expect(viewModel.title.isValid).toBeComputed();
                    });

                    describe('when title is empty', function () {

                        it('should be false', function () {
                            viewModel.title('');
                            expect(viewModel.title.isValid()).toBeFalsy();
                        });

                    });

                    describe('when title is longer than 255', function () {

                        it('should be false', function () {
                            viewModel.title(utils.createString(viewModel.titleMaxLength + 1));
                            expect(viewModel.title.isValid()).toBeFalsy();
                        });

                    });

                    describe('when title is longer than 255 but after trimming is not longer than 255', function () {

                        it('should be true', function () {
                            viewModel.title('   ' + utils.createString(viewModel.titleMaxLength - 1) + '   ');
                            expect(viewModel.title.isValid()).toBeTruthy();
                        });

                    });

                    describe('when title is not empty and not longer than 255', function () {

                        it('should be true', function () {
                            viewModel.title(utils.createString(viewModel.titleMaxLength - 1));
                            expect(viewModel.title.isValid()).toBeTruthy();
                        });

                    });
                });
            });

            describe('titleMaxLength:', function () {

                it('should be defined', function () {
                    expect(viewModel.titleMaxLength).toBeDefined();
                });

                it('should be 255', function () {
                    expect(viewModel.titleMaxLength).toBe(255);
                });

            });

            describe('startEditTitle:', function () {

                it('should be function', function () {
                    expect(viewModel.startEditTitle).toBeFunction();
                });

                it('should set title.isEditing to true', function () {
                    viewModel.title.isEditing(false);
                    viewModel.startEditTitle();
                    expect(viewModel.title.isEditing()).toBeTruthy();
                });

            });

            describe('endEditTitle:', function () {

                var updateDeferred, getByIdDeferred;

                beforeEach(function () {
                    updateDeferred = Q.defer();
                    getByIdDeferred = Q.defer();

                    spyOn(repository, 'updateObjective').andReturn(updateDeferred.promise);
                    spyOn(repository, 'getById').andReturn(getByIdDeferred.promise);

                    spyOn(notify, 'saved');
                });

                it('should be function', function () {
                    expect(viewModel.endEditTitle).toBeFunction();
                });

                it('should set title.isEditing to false', function () {
                    viewModel.title.isEditing(true);
                    viewModel.endEditTitle();
                    expect(viewModel.title.isEditing()).toBeFalsy();
                });

                it('should trim title', function () {
                    viewModel.title('    Some title     ');
                    viewModel.endEditTitle();
                    expect(viewModel.title()).toEqual('Some title');
                });

                describe('when title is not modified', function () {
                    var promise = null;
                    beforeEach(function () {
                        viewModel.title(objective.title);
                        promise = getByIdDeferred.promise.finally(function () { });
                        getByIdDeferred.resolve(objective);
                    });

                    it('should not send event', function () {
                        viewModel.endEditTitle();
                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(promise).toBeResolved();
                            expect(eventTracker.publish).not.toHaveBeenCalled();
                        });
                    });

                    it('should not show notification', function () {
                        viewModel.endEditTitle();
                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(promise).toBeResolved();
                            expect(notify.saved).not.toHaveBeenCalled();
                        });
                    });

                    it('should not update question in repository', function () {
                        viewModel.endEditTitle();
                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(promise).toBeResolved();
                            expect(repository.updateObjective).not.toHaveBeenCalled();
                        });
                    });
                });

                describe('when title is modified', function () {

                    var getPromise = null, newTitle = objective.title + 'test';
                    beforeEach(function () {

                        viewModel.title(newTitle);
                        getPromise = getByIdDeferred.promise.finally(function () { });
                        getByIdDeferred.resolve(objective);
                    });

                    it('should send event \'Update objective title\'', function () {
                        viewModel.endEditTitle();
                        waitsFor(function () {
                            return !getPromise.isPending();
                        });
                        runs(function () {
                            expect(getPromise).toBeResolved();
                            expect(eventTracker.publish).toHaveBeenCalledWith('Update objective title');
                        });
                    });

                    describe('and when title is valid', function () {

                        it('should update objective in repository', function () {
                            viewModel.endEditTitle();
                            waitsFor(function () {
                                return !getPromise.isPending();
                            });
                            runs(function () {
                                expect(getPromise).toBeResolved();
                                expect(repository.updateObjective).toHaveBeenCalled();
                                expect(repository.updateObjective.mostRecentCall.args[0].title).toEqual(newTitle);
                            });
                        });

                        describe('and when objective updated successfully', function () {

                            it('should update notificaion', function () {
                                viewModel.endEditTitle();

                                var promise = updateDeferred.promise.finally(function () { });
                                updateDeferred.resolve(new Date());

                                waitsFor(function () {
                                    return !getPromise.isPending() && !promise.isPending();
                                });
                                runs(function () {
                                    expect(promise).toBeResolved();
                                    expect(notify.saved).toHaveBeenCalled();
                                });
                            });

                        });

                    });

                    describe('and when title is not valid', function () {

                        it('should revert objective title value', function () {
                            viewModel.title('');
                            viewModel.endEditTitle();

                            waitsFor(function () {
                                return !getPromise.isPending();
                            });
                            runs(function () {
                                expect(viewModel.title()).toBe(objective.title);
                            });
                        });

                    });
                });
            });

            describe('navigateToEditQuestion', function () {

                describe('when question is null', function () {

                    it('should throw exception', function () {
                        var f = function () { viewModel.navigateToEditQuestion(null); };
                        expect(f).toThrow();
                    });

                });

                describe('when question is undefined', function () {

                    it('should throw exception', function () {
                        var f = function () { viewModel.navigateToEditQuestion(); };
                        expect(f).toThrow();
                    });

                });

                describe('when question does not have property id', function () {

                    it('should throw exception', function () {
                        var f = function () { viewModel.navigateToEditQuestion({}); };
                        expect(f).toThrow();
                    });

                });

                describe('when question id is null', function () {

                    it('should throw exception', function () {
                        var f = function () { viewModel.navigateToEditQuestion({ id: null }); };
                        expect(f).toThrow();
                    });

                });

                it('should navigate to #objectives', function () {

                    viewModel.objectiveId = objective.id;

                    viewModel.navigateToEditQuestion(objective.questions[0]);

                    expect(router.navigateWithQueryString).toHaveBeenCalledWith('objective/' + objective.id + '/question/' + objective.questions[0].id);
                });

                it('should send event \"Navigate to edit question\"', function () {
                    viewModel.objectiveId = objective.id;

                    viewModel.navigateToEditQuestion(objective.questions[0]);

                    expect(eventTracker.publish).toHaveBeenCalledWith('Navigate to edit question');
                });

            });

            describe('createQuestion:', function () {

                var addQuestionDefer;

                beforeEach(function () {
                    addQuestionDefer = Q.defer();

                    spyOn(questionRepository, 'addQuestion').andReturn(addQuestionDefer.promise);
                    spyOn(uiLocker, 'lock');
                    spyOn(uiLocker, 'unlock');
                    spyOn(clientContext, 'set');
                });

                it('should be function', function () {
                    expect(viewModel.createQuestion).toBeFunction();
                });

                it('should return promise', function () {
                    expect(viewModel.createQuestion()).toBePromise();
                });

                it('should send event \'Create new question\'', function () {
                    viewModel.createQuestion();
                    expect(eventTracker.publish).toHaveBeenCalledWith('Create new question');
                });

                it('should add question to repository', function () {
                    var title = 'some title';

                    spyOn(localizationManager, 'localize').andReturn(title);
                    viewModel.objectiveId = 'SomeId';

                    var promise = viewModel.createQuestion().fin(function () { });

                    addQuestionDefer.resolve();

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(questionRepository.addQuestion).toHaveBeenCalledWith(viewModel.objectiveId, { title: title });
                    });
                });

                it('should lock content', function () {
                    viewModel.objectiveId = 'SomeId';

                    var promise = viewModel.createQuestion().fin(function () { });

                    addQuestionDefer.resolve();

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(uiLocker.lock).toHaveBeenCalled();
                    });
                });

                describe('when question added', function () {

                    it('should navigate to \'objective/\' + that.objectiveId + \'/question/\' + createdQuestion.id', function () {
                        var createdQuestionId = 'SomeId';

                        var promise = viewModel.createQuestion().fin(function () { });

                        addQuestionDefer.resolve({ id: createdQuestionId });

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(router.navigateWithQueryString).toHaveBeenCalledWith('objective/' + viewModel.objectiveId + '/question/' + createdQuestionId);
                        });
                    });


                    it('should unlock content', function () {
                        var createdQuestionId = 'SomeId';

                        var promise = viewModel.createQuestion().fin(function () { });

                        addQuestionDefer.resolve({ id: createdQuestionId });

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(uiLocker.lock).toHaveBeenCalled();
                        });
                    });

                    it('should set lastCreatedQuestionId in client context', function () {
                        var createdQuestionId = 'SomeId';

                        var promise = viewModel.createQuestion().fin(function () { });

                        addQuestionDefer.resolve({ id: createdQuestionId });

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(clientContext.set).toHaveBeenCalledWith('lastCreatedQuestionId', createdQuestionId);
                        });
                    });
                });

                describe('when adding question failed', function () {

                    it('should unlock content', function () {
                        var promise = viewModel.createQuestion().fin(function () { });

                        addQuestionDefer.reject();

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(uiLocker.lock).toHaveBeenCalled();
                        });
                    });

                });

            });

            describe('deleteSelectedQuestions', function () {

                var removeQuestions;

                beforeEach(function () {
                    removeQuestions = Q.defer();
                    spyOn(questionRepository, 'removeQuestions').andReturn(removeQuestions.promise);
                });

                it('should be a function', function () {
                    expect(viewModel.deleteSelectedQuestions).toBeFunction();
                });

                it('should send event \'Delete question\'', function () {
                    viewModel.questions([{ isSelected: ko.observable(true) }]);
                    viewModel.deleteSelectedQuestions();
                    expect(eventTracker.publish).toHaveBeenCalledWith('Delete question');
                });

                describe('when no selected questions', function () {

                    it('should throw exception', function () {
                        viewModel.questions([]);
                        var f = function () { viewModel.deleteSelectedQuestions(); };
                        expect(f).toThrow();
                    });

                });

                describe('when some questions are selected', function () {


                    beforeEach(function () {
                        viewModel.objectiveId = 'objectiveId';
                        viewModel.questions([{ id: "SomeQuestionId1", isSelected: ko.observable(true) }, { id: "SomeQuestionId2", isSelected: ko.observable(true) }]);

                        spyOn(notify, 'saved');
                    });

                    it('should delete selected questions', function () {
                        viewModel.deleteSelectedQuestions();

                        expect(questionRepository.removeQuestions).toHaveBeenCalledWith('objectiveId', ["SomeQuestionId1", "SomeQuestionId2"]);
                    });

                    describe('and when questions deleted successfully', function () {

                        it('should delete selected questions from viewModel', function () {
                            var promise = removeQuestions.promise.finally(function () { });
                            removeQuestions.resolve();

                            viewModel.deleteSelectedQuestions();

                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(viewModel.questions().length).toBe(0);
                            });
                        });

                        it('should update notificaion', function () {
                            var promise = removeQuestions.promise.finally(function () { });
                            removeQuestions.resolve(new Date());

                            viewModel.deleteSelectedQuestions();

                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(notify.saved).toHaveBeenCalled();
                            });
                        });

                    });
                });

            });

            describe('enableDeleteQuestions:', function () {

                it('should be observable', function () {
                    expect(viewModel.enableDeleteQuestions).toBeObservable();
                });

                describe('when no question selected', function () {

                    it('should be false', function () {
                        viewModel.questions([]);
                        expect(viewModel.enableDeleteQuestions()).toBe(false);
                    });

                });

                describe('when question is selected', function () {

                    it('should be true', function () {
                        viewModel.questions([
                            { isSelected: ko.observable(true) }
                        ]);

                        expect(viewModel.enableDeleteQuestions()).toBe(true);
                    });

                });

                describe('when few questions are selected', function () {

                    it('should befalse', function () {
                        viewModel.questions([
                            { isSelected: ko.observable(true) },
                            { isSelected: ko.observable(true) }
                        ]);

                        expect(viewModel.enableDeleteQuestions()).toBe(true);
                    });

                });
            });

            describe('toggleQuestionSelection', function () {

                it('should be a function', function () {
                    expect(viewModel.toggleQuestionSelection).toBeFunction();
                });

                describe('when question is null', function () {

                    it('should throw exception', function () {
                        var f = function () { viewModel.toggleQuestionSelection(null); };
                        expect(f).toThrow();
                    });

                });

                describe('when question is undefined', function () {

                    it('should throw exception', function () {
                        var f = function () { viewModel.toggleQuestionSelection(); };
                        expect(f).toThrow();
                    });

                });

                describe('when question does not have isSelected() observable', function () {

                    it('should throw exception', function () {
                        var f = function () { viewModel.toggleQuestionSelection({}); };
                        expect(f).toThrow();
                    });

                });

                describe('when question is not selected', function () {

                    it('should send event \'Select question\'', function () {
                        viewModel.toggleQuestionSelection({ isSelected: ko.observable(false) });
                        expect(eventTracker.publish).toHaveBeenCalledWith('Select question');
                    });

                    it('should set question.isSelected to true', function () {
                        var question = { isSelected: ko.observable(false) };
                        viewModel.toggleQuestionSelection(question);
                        expect(question.isSelected()).toBeTruthy();
                    });

                });

                describe('when question is selected', function () {

                    it('should send event \'Unselect question\'', function () {
                        viewModel.toggleQuestionSelection({ isSelected: ko.observable(true) });
                        expect(eventTracker.publish).toHaveBeenCalledWith('Unselect question');
                    });

                    it('should set question.isSelected to false', function () {
                        var question = { isSelected: ko.observable(true) };
                        viewModel.toggleQuestionSelection(question);
                        expect(question.isSelected()).toBeFalsy();
                    });

                });
            });

            describe('questions', function () {

                it('should be observable', function () {
                    expect(viewModel.questions).toBeObservable();
                });

            });

            describe('currentLanguage:', function () {

                it('should be defined', function () {
                    expect(viewModel.currentLanguage).toBeDefined();
                });

            });

            describe('goBackLink:', function () {
                it('should be defined', function () {
                    expect(viewModel.goBackLink).toBeDefined();
                });
            });

            describe('goBackTooltip:', function () {
                it('should be defined', function () {
                    expect(viewModel.goBackTooltip).toBeDefined();
                });
            });

            describe('navigateBack:', function () {

                it('should be defined', function () {
                    expect(viewModel.navigateBack).toBeFunction();
                });

                describe('when contextCourseId is not string', function () {

                    beforeEach(function () {
                        viewModel.contextCourseId = null;
                    });

                    it('should send event \'Navigate to objectives\'', function () {
                        viewModel.navigateBack();
                        expect(eventTracker.publish).toHaveBeenCalledWith('Navigate to objectives');
                    });

                    it('should navigate to #objectives', function () {
                        viewModel.navigateBack();
                        expect(router.navigate).toHaveBeenCalledWith('objectives');
                    });

                });

                describe('when contextCourseId is string', function () {

                    beforeEach(function () {
                        viewModel.contextCourseId = 'id';
                    });

                    it('should send event \'Navigate to course\'', function () {
                        viewModel.navigateBack();
                        expect(eventTracker.publish).toHaveBeenCalledWith('Navigate to course');
                    });

                    it('should navigate to #course/id', function () {
                        viewModel.navigateBack();
                        expect(router.navigate).toHaveBeenCalledWith('course/' + viewModel.contextCourseId);
                    });

                });
            });

            describe('isSortingEnabled:', function () {

                it('should be computed', function () {
                    expect(viewModel.isSortingEnabled).toBeComputed();
                });

                describe('when questions count is 0', function () {

                    it('should be falsy', function () {
                        viewModel.questions([]);

                        expect(viewModel.isSortingEnabled()).toBeFalsy();
                    });

                });

                describe('when questions count is 1', function () {

                    it('should be falsy', function () {
                        viewModel.questions([{ isSelected: ko.observable(false) }]);

                        expect(viewModel.isSortingEnabled()).toBeFalsy();
                    });

                });

                describe('when questions count is more than 1', function () {

                    it('should be truthy', function () {
                        viewModel.questions([
                            { isSelected: ko.observable(false) },
                            { isSelected: ko.observable(false) }
                        ]);

                        expect(viewModel.isSortingEnabled()).toBeTruthy();
                    });

                });

            });

            describe('updateQuestionsOrder:', function () {

                it('should be a function', function () {
                    expect(viewModel.updateQuestionsOrder).toBeFunction();
                });

                it('should send event \'Change order of questions\'', function () {
                    spyOn(repository, 'updateQuestionsOrder').andReturn(Q.defer().promise);

                    viewModel.updateQuestionsOrder();

                    expect(eventTracker.publish).toHaveBeenCalledWith('Change order of questions');
                });

                it('should update questions order', function () {
                    spyOn(repository, 'updateQuestionsOrder').andReturn(Q.defer().promise);

                    var questions = [{ isSelected: ko.observable(false) }];
                    viewModel.questions(questions);
                    viewModel.objectiveId = objective.id;

                    viewModel.updateQuestionsOrder();

                    expect(repository.updateQuestionsOrder).toHaveBeenCalledWith(objective.id, questions);
                });

                describe('when update questions order is succeed', function() {

                    it('should notify saved', function () {
                        var deferred = Q.defer();
                        deferred.resolve();
                        var promise = deferred.promise.finally(function () { });

                        spyOn(repository, 'updateQuestionsOrder').andReturn(deferred.promise);
                        spyOn(notify, 'saved');

                        viewModel.updateQuestionsOrder();

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(notify.saved).toHaveBeenCalled();
                        });
                    });

                });

                describe('when update questions order is failed', function () {

                    it('should not notify saved', function () {
                        var deferred = Q.defer();
                        deferred.reject();
                        var promise = deferred.promise.finally(function () { });

                        spyOn(repository, 'updateQuestionsOrder').andReturn(deferred.promise);
                        spyOn(notify, 'saved');

                        viewModel.updateQuestionsOrder();

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(notify.saved).not.toHaveBeenCalled();
                        });
                    });

                });

            });
        });
    }
);