define(['viewmodels/objectives/objective'],
    function (viewModel) {
        "use strict";

        var
            router = require('plugins/router'),
            eventTracker = require('eventTracker'),
            repository = require('repositories/objectiveRepository'),
            courseRepository = require('repositories/courseRepository'),
            questionRepository = require('repositories/questionRepository'),
            localizationManager = require('localization/localizationManager'),
            notify = require('notify'),
            uiLocker = require('uiLocker'),
            clientContext = require('clientContext'),
            backButton = require('controls/backButton/backButton');

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

            var instruction = { queryString: 'courseId=id1'};

            beforeEach(function () {
                spyOn(eventTracker, 'publish');
                spyOn(router, 'navigateWithQueryString');
                spyOn(router, 'navigate');
                spyOn(router, 'replace');
                spyOn(router, 'activeInstruction').and.returnValue(instruction);
            });

            it('is object', function () {
                expect(viewModel).toBeObject();
            });

            describe('activate:', function () {

                var deferred, getCourseDeferred;

                beforeEach(function () {
                    viewModel.contextCourseTitle = null;
                    viewModel.contextCourseId = null;

                    deferred = Q.defer();
                    getCourseDeferred = Q.defer();
                    spyOn(repository, 'getById').and.returnValue(deferred.promise);
                    spyOn(courseRepository, 'getById').and.returnValue(getCourseDeferred.promise);
                });

                it('should be a function', function () {
                    expect(viewModel.activate).toBeFunction();
                });

                it('should set client context with current objective id', function (done) {
                    spyOn(clientContext, 'set');
                    deferred.resolve();

                    var promise = viewModel.activate(objective.id, null);

                    promise.fin(function () {
                        expect(clientContext.set).toHaveBeenCalledWith('lastVisitedObjective', objective.id);
                        done();
                    });
                });

                describe('when queryParams are null', function () {

                    it('should set contextExpperienceId to null', function (done) {
                        deferred.resolve(null);

                        var promise = viewModel.activate(objective.id, null);
                        
                        promise.fin(function () {
                            expect(viewModel.contextCourseId).toBeNull();
                            done();
                        });
                    });

                    it('should set contextExpperienceTitle to null', function (done) {
                        deferred.resolve(null);

                        var promise = viewModel.activate(objective.id, null);
                        
                        promise.fin(function () {
                            expect(viewModel.contextCourseTitle).toBeNull();
                            done();
                        });
                    });

                    it('should enable back button', function (done) {
                        spyOn(backButton, 'enable');
                        spyOn(localizationManager, 'localize').and.returnValue('text');
                        deferred.resolve(null);

                        var promise = viewModel.activate(objective.id, null);

                        promise.fin(function () {
                            expect(backButton.enable).toHaveBeenCalledWith('text text', 'objectives', viewModel.navigateToObjectivesEvent, true);
                            done();
                        });
                    });

                    describe('when objective not found', function () {

                        beforeEach(function () {
                            deferred.reject('reason');
                        });

                        it('should set router.activeItem.settings.lifecycleData.redirect to \'404\'', function (done) {
                            router.activeItem.settings.lifecycleData = null;

                            var promise = viewModel.activate(objective.id, null);
                            promise.fin(function () {
                                expect(router.activeItem.settings.lifecycleData.redirect).toBe('404');
                                done();
                            });
                        });

                        it('should reject promise', function (done) {
                            var promise = viewModel.activate(objective.id, null);
                            promise.fin(function () {
                                expect(promise).toBeRejectedWith('reason');
                                done();
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

                        it('should set objective title', function (done) {
                            viewModel.title('');

                            var promise = viewModel.activate(objective.id, null);

                            promise.fin(function () {
                                expect(viewModel.title()).toBe(objective.title);
                                done();
                            });
                        });

                        it('should set currentLanguage', function () {
                            viewModel.currentLanguage = null;
                            viewModel.activate(objective.id, null);
                            expect(viewModel.currentLanguage).not.toBeNull();
                        });

                        it('should initialize questions collection', function (done) {
                            viewModel.questions([]);
                            var promise = viewModel.activate(objective.id, null);

                            promise.fin(function () {
                                expect(viewModel.questions().length).toBe(objective.questions.length);
                                done();
                            });
                        });

                        it('should sort questions asc', function (done) {
                            var promise = viewModel.activate(objective.id, null);

                            promise.fin(function () {
                                expect(viewModel.questions).toBeSortedAsc('title');
                                done();
                            });
                        });

                    });
                });

                describe('when queryParams are not null', function () {

                    describe('when courseId is not string', function () {
                        var queryParams = { courseId: null };

                        it('should set contextExpperienceId to null', function (done) {
                            deferred.resolve(null);
                            var promise = viewModel.activate(objective.id, queryParams);
                            
                            promise.fin(function () {
                                expect(viewModel.contextCourseId).toBeNull();
                                done();
                            });
                        });

                        it('should set contextExpperienceTitle to null', function (done) {
                            deferred.resolve(null);
                            var promise = viewModel.activate(objective.id, queryParams);
                            
                            promise.fin(function () {
                                expect(viewModel.contextCourseTitle).toBeNull();
                                done();
                            });
                        });

                        it('should enable back button', function (done) {
                            deferred.resolve(null);
                            spyOn(backButton, 'enable');
                            spyOn(localizationManager, 'localize').and.returnValue('text');

                            var promise = viewModel.activate(objective.id, queryParams);
                            promise.fin(function () {
                                expect(backButton.enable).toHaveBeenCalledWith('text text', 'objectives', viewModel.navigateToObjectivesEvent, true);
                                done();
                            });
                        });

                        describe('when objective not found', function () {

                            beforeEach(function () {
                                deferred.reject('reason');
                            });

                            it('should set router.activeItem.settings.lifecycleData.redirect to \'404\'', function (done) {
                                router.activeItem.settings.lifecycleData = null;

                                var promise = viewModel.activate(objective.id, queryParams);
                                promise.fin(function () {
                                    expect(router.activeItem.settings.lifecycleData.redirect).toBe('404');
                                    done();
                                });
                            });

                            it('should reject promise', function (done) {
                                var promise = viewModel.activate(objective.id, queryParams);
                                promise.fin(function () {
                                    expect(promise).toBeRejectedWith('reason');
                                    done();
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

                            it('should set objective title', function (done) {
                                viewModel.title('');

                                var promise = viewModel.activate(objective.id, queryParams);
                                promise.fin(function () {
                                    expect(viewModel.title()).toBe(objective.title);
                                    done();
                                });
                            });

                            it('should set currentLanguage', function () {
                                viewModel.currentLanguage = null;
                                viewModel.activate(objective.id, queryParams);
                                expect(viewModel.currentLanguage).not.toBeNull();
                            });

                            it('should initialize questions collection', function (done) {
                                viewModel.questions([]);
                                var promise = viewModel.activate(objective.id, queryParams);

                                promise.fin(function () {
                                    expect(viewModel.questions().length).toBe(objective.questions.length);
                                    done();
                                });
                            });

                            it('should sort questions asc', function (done) {
                                var promise = viewModel.activate(objective.id, queryParams);

                                promise.fin(function () {
                                    expect(viewModel.questions).toBeSortedAsc('title');
                                    done();
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

                                it('should set router.activeItem.settings.lifecycleData.redirect to \'404\'', function (done) {
                                    router.activeItem.settings.lifecycleData = null;

                                    var promise = viewModel.activate(objective.id, queryParams);

                                    promise.fin(function () {
                                        expect(router.activeItem.settings.lifecycleData.redirect).toBe('404');
                                        done();
                                    });
                                });

                                it('should reject promise', function (done) {
                                    var promise = viewModel.activate(objective.id, queryParams);

                                    promise.fin(function () {
                                        expect(promise).toBeRejectedWith('reason');
                                        done();
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

                                it('should set contextExpperienceId', function (done) {
                                    var promise = viewModel.activate('id', queryParams);

                                    promise.fin(function () {
                                        expect(viewModel.contextCourseId).toBe(course.id);
                                        done();
                                    });
                                });

                                it('should set contextExpperienceTitle', function (done) {
                                    var promise = viewModel.activate('id', queryParams);

                                    promise.fin(function () {
                                        expect(viewModel.contextCourseTitle).toBe(course.title);
                                        done();
                                    });
                                });

                                it('should enable back button', function (done) {
                                    spyOn(backButton, 'enable');
                                    spyOn(localizationManager, 'localize').and.returnValue('text');

                                    var promise = viewModel.activate('id', queryParams);
                                    promise.fin(function () {
                                        expect(backButton.enable).toHaveBeenCalledWith('text' + ' \'' + course.title + '\'', 'course/' + course.id, viewModel.navigateToCourseEvent);
                                        done();
                                    });
                                });

                                it('should set objective title', function (done) {
                                    viewModel.title('');

                                    var promise = viewModel.activate(objective.id, queryParams);

                                    promise.fin(function () {
                                        expect(viewModel.title()).toBe(objective.title);
                                        done();
                                    });
                                });

                                it('should set currentLanguage', function () {
                                    viewModel.currentLanguage = null;
                                    viewModel.activate(objective.id, queryParams);
                                    expect(viewModel.currentLanguage).not.toBeNull();
                                });

                                it('should initialize questions collection', function (done) {
                                    viewModel.questions([]);
                                    var promise = viewModel.activate(objective.id, queryParams);

                                    promise.fin(function () {
                                        expect(viewModel.questions().length).toBe(objective.questions.length);
                                        done();
                                    });
                                });

                                it('should sort questions asc', function (done) {
                                    var promise = viewModel.activate(objective.id, queryParams);

                                    promise.fin(function () {
                                        expect(viewModel.questions).toBeSortedAsc('title');
                                        done();
                                    });
                                });

                            });
                        });

                        describe('when course does not exist', function () {
                            beforeEach(function () {
                                getCourseDeferred.reject('reason');
                            });

                            it('should set router.activeItem.settings.lifecycleData.redirect to \'404\'', function (done) {
                                router.activeItem.settings.lifecycleData = null;

                                var promise = viewModel.activate('id', queryParams);
                                
                                promise.fin(function () {
                                    expect(router.activeItem.settings.lifecycleData.redirect).toBe('404');
                                    done();
                                });
                            });

                            it('should reject promise', function (done) {
                                var promise = viewModel.activate('id', queryParams);

                                promise.fin(function () {
                                    expect(promise).toBeRejectedWith('reason');
                                    done();
                                });
                            });

                            it('should set contextCourseId to null', function (done) {
                                var promise = viewModel.activate('id', queryParams);

                                promise.fin(function () {
                                    expect(viewModel.contextCourseId).toBeNull();
                                    done();
                                });
                            });

                            it('should set contextCourseTitle to null', function (done) {
                                var promise = viewModel.activate('id', queryParams);

                                promise.fin(function () {
                                    expect(viewModel.contextCourseTitle).toBeNull();
                                    done();
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

                    spyOn(repository, 'updateObjective').and.returnValue(updateDeferred.promise);
                    spyOn(repository, 'getById').and.returnValue(getByIdDeferred.promise);

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

                    it('should not send event', function (done) {
                        viewModel.endEditTitle();

                        promise.fin(function () {
                            expect(promise).toBeResolved();
                            expect(eventTracker.publish).not.toHaveBeenCalled();
                            done();
                        });
                    });

                    it('should not show notification', function (done) {
                        viewModel.endEditTitle();

                        promise.fin(function () {
                            expect(promise).toBeResolved();
                            expect(notify.saved).not.toHaveBeenCalled();
                            done();
                        });
                    });

                    it('should not update question in repository', function (done) {
                        viewModel.endEditTitle();

                        promise.fin(function () {
                            expect(promise).toBeResolved();
                            expect(repository.updateObjective).not.toHaveBeenCalled();
                            done();
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

                    it('should send event \'Update objective title\'', function (done) {
                        viewModel.endEditTitle();

                        getPromise.fin(function () {
                            expect(getPromise).toBeResolved();
                            expect(eventTracker.publish).toHaveBeenCalledWith('Update objective title');
                            done();
                        });
                    });

                    describe('and when title is valid', function () {

                        it('should update objective in repository', function (done) {
                            viewModel.endEditTitle();

                            getPromise.fin(function () {
                                expect(getPromise).toBeResolved();
                                expect(repository.updateObjective).toHaveBeenCalled();
                                expect(repository.updateObjective.calls.mostRecent().args[0].title).toEqual(newTitle);
                                done();
                            });
                        });

                        describe('and when objective updated successfully', function () {

                            it('should update notificaion', function (done) {
                                var promise = updateDeferred.promise.fin(function () { });
                                updateDeferred.resolve(new Date());

                                viewModel.endEditTitle();

                                promise.fin(function () {
                                    expect(promise).toBeResolved();
                                    expect(notify.saved).toHaveBeenCalled();
                                    done();
                                });
                            });

                        });

                    });

                    describe('and when title is not valid', function () {

                        it('should revert objective title value', function (done) {
                            viewModel.title('');
                            viewModel.endEditTitle();

                            getPromise.fin(function () {
                                expect(viewModel.title()).toBe(objective.title);
                                done();
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

                it('should navigate to question editor with query string', function () {

                    viewModel.objectiveId = objective.id;

                    viewModel.navigateToEditQuestion(objective.questions[0]);

                    expect(router.navigate).toHaveBeenCalledWith('#objective/' + objective.id + '/question/' + objective.questions[0].id + '?' + instruction.queryString);
                });

                it('should send event \"Navigate to question editor\"', function () {
                    viewModel.objectiveId = objective.id;

                    viewModel.navigateToEditQuestion(objective.questions[0]);

                    expect(eventTracker.publish).toHaveBeenCalledWith('Navigate to question editor');
                });

            });

            describe('createQuestion:', function () {

                var addQuestionDefer;

                beforeEach(function () {
                    addQuestionDefer = Q.defer();

                    spyOn(questionRepository, 'addQuestion').and.returnValue(addQuestionDefer.promise);
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

                it('should add question to repository', function (done) {
                    var title = 'some title';

                    spyOn(localizationManager, 'localize').and.returnValue(title);
                    viewModel.objectiveId = 'SomeId';
                    addQuestionDefer.resolve();

                    viewModel.createQuestion().fin(function() {
                        expect(questionRepository.addQuestion).toHaveBeenCalledWith(viewModel.objectiveId, { title: title });
                        done();
                    });
                });

                it('should lock content', function (done) {
                    viewModel.objectiveId = 'SomeId';
                    addQuestionDefer.resolve();

                    viewModel.createQuestion().fin(function() {
                        expect(uiLocker.lock).toHaveBeenCalled();
                        done();
                    });
                });

                describe('when question added', function () {

                    it('should navigate to question editor with query string', function (done) {
                        var createdQuestionId = 'SomeId';
                        addQuestionDefer.resolve({ id: createdQuestionId });

                        viewModel.createQuestion().fin(function() {
                            expect(router.navigate).toHaveBeenCalledWith('#objective/' + viewModel.objectiveId + '/question/' + createdQuestionId + '?' + instruction.queryString);
                            done();
                        });
                    });


                    it('should unlock content', function (done) {
                        var createdQuestionId = 'SomeId';
                        addQuestionDefer.resolve({ id: createdQuestionId });

                        viewModel.createQuestion().fin(function() {
                            expect(uiLocker.lock).toHaveBeenCalled();
                            done();
                        });
                    });

                    it('should set lastCreatedQuestionId in client context', function (done) {
                        var createdQuestionId = 'SomeId';
                        addQuestionDefer.resolve({ id: createdQuestionId });

                        viewModel.createQuestion().fin(function() {
                            expect(clientContext.set).toHaveBeenCalledWith('lastCreatedQuestionId', createdQuestionId);
                            done();
                        });
                    });
                });

                describe('when adding question failed', function () {

                    it('should unlock content', function (done) {
                        addQuestionDefer.reject();

                        viewModel.createQuestion().fin(function () {
                            expect(uiLocker.lock).toHaveBeenCalled();
                            done();
                        });
                    });
                });
            });

            describe('deleteSelectedQuestions', function () {

                var removeQuestions;

                beforeEach(function () {
                    removeQuestions = Q.defer();
                    spyOn(questionRepository, 'removeQuestions').and.returnValue(removeQuestions.promise);
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

                        it('should delete selected questions from viewModel', function (done) {
                            removeQuestions.resolve();
                            viewModel.deleteSelectedQuestions();
                            
                            removeQuestions.promise.finally(function () {
                                expect(viewModel.questions().length).toBe(0);
                                done();
                            });
                        });

                        it('should update notificaion', function (done) {
                            removeQuestions.resolve(new Date());
                            viewModel.deleteSelectedQuestions();

                            removeQuestions.promise.finally(function () {
                                expect(notify.saved).toHaveBeenCalled();
                                done();
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

            describe('navigateToCourseEvent:', function () {

                it('should be function', function () {
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
                    spyOn(repository, 'updateQuestionsOrder').and.returnValue(Q.defer().promise);

                    viewModel.updateQuestionsOrder();

                    expect(eventTracker.publish).toHaveBeenCalledWith('Change order of questions');
                });

                it('should update questions order', function () {
                    spyOn(repository, 'updateQuestionsOrder').and.returnValue(Q.defer().promise);

                    var questions = [{ isSelected: ko.observable(false) }];
                    viewModel.questions(questions);
                    viewModel.objectiveId = objective.id;

                    viewModel.updateQuestionsOrder();

                    expect(repository.updateQuestionsOrder).toHaveBeenCalledWith(objective.id, questions);
                });

                describe('when update questions order is succeed', function() {

                    it('should notify saved', function (done) {
                        var deferred = Q.defer();
                        deferred.resolve();
                        spyOn(repository, 'updateQuestionsOrder').and.returnValue(deferred.promise);
                        spyOn(notify, 'saved');

                        viewModel.updateQuestionsOrder();

                        deferred.promise.finally(function () {
                            expect(notify.saved).toHaveBeenCalled();
                            done();
                        });
                    });

                });

                describe('when update questions order is failed', function () {

                    it('should not notify saved', function (done) {
                        var deferred = Q.defer();
                        deferred.reject();
                        spyOn(repository, 'updateQuestionsOrder').and.returnValue(deferred.promise);
                        spyOn(notify, 'saved');

                        viewModel.updateQuestionsOrder();

                        deferred.promise.finally(function () {
                            expect(notify.saved).not.toHaveBeenCalled();
                            done();
                        });
                    });
                });
            });
        });
    }
);