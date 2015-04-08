define(['viewmodels/objectives/objective'],
    function (viewModel) {
        "use strict";

        var
            router = require('plugins/router'),
            eventTracker = require('eventTracker'),
            repository = require('repositories/objectiveRepository'),
            courseRepository = require('repositories/courseRepository'),
            questionRepository = require('repositories/questionRepository'),
            notify = require('notify'),
            constants = require('constants'),
            clientContext = require('clientContext'),
            imageUpload = require('imageUpload'),
            userContext = require('userContext')
        ;

        describe('viewModel [objective]', function () {

            var objective = {
                id: '1',
                title: 'Test Objective 1',
                createdOn: new Date(),
                modifiedOn: new Date(),
                image: 'image/url',
                questions: [
                    { id: 0, title: 'A', type: 'multipleSelect' },
                    { id: 1, title: 'b', type: 'multipleSelect' },
                    { id: 2, title: 'B', type: 'multipleSelect' },
                    { id: 3, title: 'a', type: 'multipleSelect' }
                ]
            };

            var instruction = { queryString: 'courseId=id1' };

            beforeEach(function () {
                spyOn(eventTracker, 'publish');
                spyOn(router, 'navigate');
                spyOn(router, 'replace');
                spyOn(router, 'activeInstruction').and.returnValue(instruction);
            });

            it('should be object', function () {
                expect(viewModel).toBeObject();
            });

            describe('activate:', function () {

                var getById, getCourseDeferred;

                beforeEach(function () {
                    viewModel.contextCourseTitle = null;
                    viewModel.contextCourseId = null;

                    getById = Q.defer();
                    getCourseDeferred = Q.defer();
                    spyOn(repository, 'getById').and.returnValue(getById.promise);
                    spyOn(courseRepository, 'getById').and.returnValue(getCourseDeferred.promise);
                    spyOn(clientContext, 'set');
                    spyOn(clientContext, 'remove');
                    userContext.identity = {};
                });

                it('should be a function', function () {
                    expect(viewModel.activate).toBeFunction();
                });

                describe('when activated with 1 argument', function () {

                    it('should set objectiveId', function (done) {
                        viewModel.objectiveId = null;
                        getById.resolve(objective);

                        viewModel.activate('objectiveId').then(function () {
                            expect(viewModel.objectiveId).toEqual('objectiveId');
                            done();
                        });
                    });

                    it('should set null to coursId', function (done) {
                        viewModel.courseId = 'courseId';
                        getById.resolve(objective);

                        viewModel.activate('objectiveId').then(function () {
                            expect(viewModel.courseId).toEqual(null);
                            done();
                        });
                    });

                    it('should return promise', function () {
                        expect(viewModel.activate('objectiveId')).toBePromise();
                    });

                });

                describe('when activated with 2 arguments', function () {

                    it('should set objectiveId', function (done) {
                        viewModel.objectiveId = null;
                        getById.resolve(objective);

                        viewModel.activate('courseId', 'objectiveId').then(function () {
                            expect(viewModel.objectiveId).toEqual('objectiveId');
                            done();
                        });
                    });

                    it('should set courseId', function (done) {
                        viewModel.courseId = null;
                        getById.resolve(objective);

                        viewModel.activate('courseId', 'objectiveId').then(function () {
                            expect(viewModel.courseId).toEqual('courseId');
                            done();
                        });
                    });

                    it('should return promise', function () {
                        expect(viewModel.activate('courseId', 'objectiveId')).toBePromise();
                    });

                });

                describe('when objective does not exist', function () {

                    beforeEach(function () {
                        getById.reject('reason');
                    });

                    it('should reject promise', function (done) {
                        var promise = viewModel.activate('objectiveId', 'courseId');

                        promise.catch(function () {
                            expect(promise).toBeRejectedWith('reason');
                            done();
                        });
                    });
                });

                describe('when objective exists', function () {
                    beforeEach(function () {
                        getById.resolve(objective);
                    });

                    it('should set objective title', function (done) {
                        viewModel.title('');

                        var promise = viewModel.activate(objective.id);

                        promise.fin(function () {
                            expect(viewModel.title()).toBe(objective.title);
                            done();
                        });
                    });

                    it('should set image url', function () {
                        viewModel.imageUrl('');

                        var promise = viewModel.activate(objective.id);

                        promise.fin(function () {
                            expect(viewModel.imageUrl()).toBe(objective.image);
                            done();
                        });
                    });

                    it('should initialize questions collection', function (done) {
                        viewModel.questions([]);
                        var promise = viewModel.activate(objective.id);

                        promise.fin(function () {
                            expect(viewModel.questions().length).toBe(objective.questions.length);
                            done();
                        });
                    });

                    it('should sort questions asc', function (done) {
                        var promise = viewModel.activate(objective.id);

                        promise.fin(function () {
                            expect(viewModel.questions).toBeSortedAsc('title');
                            done();
                        });
                    });

                    it('should set currentLanguage', function (done) {
                        viewModel.currentLanguage = null;
                        viewModel.activate(objective.id).then(function () {
                            expect(viewModel.currentLanguage).not.toBeNull();
                            done();
                        });
                    });

                    it('should set isObjectiveTipVisible to false', function (done) {
                        getById.resolve(objective);
                        viewModel.isObjectiveTipVisible(true);

                        viewModel.activate(objective.id).then(function () {
                            expect(viewModel.isObjectiveTipVisible()).toBeFalsy();
                            done();
                        });
                    });

                    it('should set current objectiveId to client context', function (done) {
                        getById.resolve(objective);
                        viewModel.activate(objective.id).then(function () {
                            expect(clientContext.set).toHaveBeenCalledWith(constants.clientContextKeys.lastVisitedObjective, objective.id);
                            done();
                        });
                    });

                    it('should remove lastCreatedObjective key from client context', function (done) {
                        getById.resolve(objective);
                        viewModel.activate(objective.id).then(function () {
                            expect(clientContext.remove).toHaveBeenCalledWith(constants.clientContextKeys.lastCreatedObjectiveId);
                            done();
                        });
                    });

                    describe('when last created objective is current objective', function () {
                        beforeEach(function () {
                            getById.resolve(objective);
                            spyOn(clientContext, 'get').and.returnValue(objective.id);
                        });

                        it('should set isLastCreatedObjective to true', function (done) {
                            viewModel.activate(objective.id).then(function () {
                                expect(viewModel.isLastCreatedObjective).toBeTruthy();
                                done();
                            });
                        });
                    });

                    describe('when last created objective is not current objective', function () {
                        beforeEach(function () {
                            getById.resolve(objective);
                            spyOn(clientContext, 'get').and.returnValue('some id');
                        });

                        it('should set isLastCreatedObjective to true', function (done) {
                            viewModel.activate(objective.id, null).fin(function () {
                                expect(viewModel.isLastCreatedObjective).toBeFalsy();
                                done();
                            });
                        });
                    });
                });

            });

            describe('back:', function () {

                it('should be function', function () {
                    expect(viewModel.back).toBeFunction();
                });

                describe('when courseId is set', function () {

                    it('should redirect to course', function () {
                        viewModel.courseId = 'courseId';
                        viewModel.back();
                        expect(router.navigate).toHaveBeenCalledWith('#courses/courseId');
                    });

                });

                describe('when courseId is not set', function () {

                    it('should redirect to objectives', function () {
                        viewModel.courseId = null;
                        viewModel.back();
                        expect(router.navigate).toHaveBeenCalledWith('#objectives');
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

            describe('imageUrl:', function () {

                it('should be observable', function () {
                    expect(viewModel.imageUrl).toBeObservable();
                });

            });

            describe('isObjectiveTipVisible', function () {
                it('should be observable', function () {
                    expect(viewModel.isObjectiveTipVisible).toBeObservable();
                });
            });

            describe('showObjectiveTip', function () {
                it('should be function', function () {
                    expect(viewModel.showObjectiveTip).toBeFunction();
                });

                it('should set \'isObjectiveTipVisible\' to true', function () {
                    viewModel.isObjectiveTipVisible(false);
                    viewModel.showObjectiveTip();
                    expect(viewModel.isObjectiveTipVisible()).toBeTruthy();
                });

                it('should send event \'Expand \"Learning objective hint\"\'', function () {
                    viewModel.showObjectiveTip();
                    expect(eventTracker.publish).toHaveBeenCalledWith('Expand "Learning objective hint"');
                });
            });

            describe('hideObjectiveTip', function () {
                it('should be function', function () {
                    expect(viewModel.hideObjectiveTip).toBeFunction();
                });

                it('should set \'isObjectiveTipVisible\' to false', function () {
                    viewModel.isObjectiveTipVisible(true);
                    viewModel.hideObjectiveTip();
                    expect(viewModel.isObjectiveTipVisible()).toBeFalsy();
                });

                it('should send event \'Collapse \"Learning objective hint\"\'', function () {
                    viewModel.hideObjectiveTip();
                    expect(eventTracker.publish).toHaveBeenCalledWith('Collapse "Learning objective hint"');
                });
            });

            describe('isImageLoading:', function () {

                it('should be observable', function () {
                    expect(viewModel.isImageLoading).toBeObservable();
                });

                it('should be false by default', function () {
                    expect(viewModel.isImageLoading()).toBeFalsy();
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

                var updateTitleDeferred, getByIdDeferred;

                beforeEach(function () {
                    updateTitleDeferred = Q.defer();
                    getByIdDeferred = Q.defer();

                    spyOn(repository, 'updateTitle').and.returnValue(updateTitleDeferred.promise);
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

                    it('should not update objective in repository', function (done) {
                        viewModel.endEditTitle();

                        promise.fin(function () {
                            expect(promise).toBeResolved();
                            expect(repository.updateTitle).not.toHaveBeenCalled();
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

                        it('should update objective title in repository', function (done) {
                            viewModel.endEditTitle();

                            getPromise.fin(function () {
                                expect(getPromise).toBeResolved();
                                expect(repository.updateTitle).toHaveBeenCalled();
                                expect(repository.updateTitle.calls.mostRecent().args[1]).toEqual(newTitle);
                                done();
                            });
                        });

                        describe('and when objective title updated successfully', function () {

                            it('should update notification', function (done) {
                                var promise = updateTitleDeferred.promise.fin(function () { });
                                updateTitleDeferred.resolve(new Date());

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

            describe('updateImage:', function () {

                it('should be function', function () {
                    expect(viewModel.updateImage).toBeFunction();
                });

                it('should send event \'Open "change objective image" dialog\'', function () {
                    spyOn(imageUpload, 'upload');
                    viewModel.updateImage();
                    expect(eventTracker.publish).toHaveBeenCalledWith('Open "change objective image" dialog');
                });

                it('should upload image', function () {
                    spyOn(imageUpload, 'upload');
                    viewModel.updateImage();
                    expect(imageUpload.upload).toHaveBeenCalled();
                });

                describe('when image loading started', function () {

                    beforeEach(function () {
                        spyOn(imageUpload, 'upload').and.callFake(function (spec) {
                            spec.startLoading();
                        });
                    });

                    it('should set isImageLoading to true', function () {
                        viewModel.isImageLoading(false);
                        viewModel.updateImage();
                        expect(viewModel.isImageLoading()).toBeTruthy();
                    });

                });

                describe('when image was uploaded', function () {

                    var url = 'http://url.com', updateImageDefer;
                    beforeEach(function () {
                        spyOn(imageUpload, 'upload').and.callFake(function (spec) {
                            spec.success(url);
                        });

                        updateImageDefer = Q.defer();
                        spyOn(repository, 'updateImage').and.returnValue(updateImageDefer.promise);
                    });


                    it('should update objective image', function () {
                        viewModel.updateImage();
                        expect(repository.updateImage).toHaveBeenCalledWith(viewModel.objectiveId, url);
                    });

                    describe('and when objective image updated successfully', function () {

                        var newUrl = 'new/image/url';
                        beforeEach(function () {
                            updateImageDefer.resolve({
                                modifiedOn: new Date(),
                                imageUrl: newUrl
                            });
                        });

                        it('should set imageUrl', function (done) {
                            viewModel.imageUrl('');
                            viewModel.updateImage();

                            updateImageDefer.promise.fin(function () {
                                expect(viewModel.imageUrl()).toBe(newUrl);
                                done();
                            });
                        });

                        it('should set isImageLoading to false', function (done) {
                            viewModel.isImageLoading(true);
                            viewModel.updateImage();

                            updateImageDefer.promise.fin(function () {
                                expect(viewModel.isImageLoading()).toBeFalsy();
                                done();
                            });
                        });

                        it('should send event \'Change objective image\'', function (done) {
                            viewModel.updateImage();

                            updateImageDefer.promise.fin(function () {
                                expect(eventTracker.publish).toHaveBeenCalledWith('Change objective image');
                                done();
                            });
                        });

                        it('should update notificaion', function (done) {
                            spyOn(notify, 'saved');
                            viewModel.updateImage();

                            updateImageDefer.promise.fin(function () {
                                expect(notify.saved).toHaveBeenCalled();
                                done();
                            });
                        });

                    });

                });

                describe('when image loading failed', function () {

                    beforeEach(function () {
                        spyOn(imageUpload, 'upload').and.callFake(function (spec) {
                            spec.error();
                        });
                    });

                    it('should set isImageLoading to false', function () {
                        viewModel.isImageLoading(true);
                        viewModel.updateImage();
                        expect(viewModel.isImageLoading()).toBeFalsy();
                    });

                });

            });

            describe('navigateToEditQuestion:', function () {

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

                describe('when course id is set', function () {

                    it('should navigate to question within course context', function () {
                        viewModel.courseId = 'courseId';
                        viewModel.objectiveId = objective.id;

                        viewModel.navigateToEditQuestion(objective.questions[0]);

                        expect(router.navigate).toHaveBeenCalledWith('#courses/courseId/objectives/' + objective.id + '/questions/' + objective.questions[0].id);
                    });

                });

                describe('when course id is not set', function () {

                    it('should navigate to question within objective context', function () {
                        viewModel.courseId = null;
                        viewModel.objectiveId = objective.id;

                        viewModel.navigateToEditQuestion(objective.questions[0]);

                        expect(router.navigate).toHaveBeenCalledWith('#objectives/' + objective.id + '/questions/' + objective.questions[0].id);
                    });

                });

                it('should send event \"Navigate to question editor\"', function () {
                    viewModel.objectiveId = objective.id;

                    viewModel.navigateToEditQuestion(objective.questions[0]);

                    expect(eventTracker.publish).toHaveBeenCalledWith('Navigate to question editor');
                });

            });

            describe('deleteSelectedQuestions:', function () {

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

            describe('toggleQuestionSelection:', function () {

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

            describe('questions:', function () {

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

            describe('isQuestionsListReorderedByCollaborator:', function () {

                it('should be observable', function () {
                    expect(viewModel.isQuestionsListReorderedByCollaborator).toBeObservable();
                });

            });

            describe('updateQuestionsOrder:', function () {

                it('should be a function', function () {
                    expect(viewModel.updateQuestionsOrder).toBeFunction();
                });

                it('should set isReorderingQuestions to false', function () {
                    spyOn(repository, 'updateQuestionsOrder').and.returnValue(Q.defer().promise);
                    viewModel.isReorderingQuestions(true);
                    viewModel.updateQuestionsOrder();
                    expect(viewModel.isReorderingQuestions()).toBeFalsy();
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

                describe('when update questions order is succeed', function () {

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

            describe('objectiveTitleUpdated:', function () {

                it('should be function', function () {
                    expect(viewModel.objectiveTitleUpdated).toBeFunction();
                });

                describe('when objective is current objective', function () {

                    describe('when objective title is editing', function () {
                        beforeEach(function () {
                            viewModel.title.isEditing(true);
                        });

                        it('should not update objective title', function () {
                            viewModel.objectiveId = objective.id;
                            viewModel.title('');
                            viewModel.objectiveTitleUpdated(objective);

                            expect(viewModel.title()).toBe('');
                        });
                    });

                    describe('when objective title is not editing', function () {
                        beforeEach(function () {
                            viewModel.title.isEditing(false);
                        });

                        it('should update objective title', function () {
                            viewModel.objectiveId = objective.id;
                            viewModel.title('');
                            viewModel.objectiveTitleUpdated(objective);

                            expect(viewModel.title()).toBe(objective.title);
                        });
                    });
                });

                describe('when objective is not current objective', function () {
                    it('should not update objective title', function () {
                        viewModel.objectiveId = 'qwe';
                        viewModel.title('');
                        viewModel.objectiveTitleUpdated(objective);

                        expect(viewModel.title()).toBe('');
                    });
                });

            });

            describe('objectiveImageUrlUpdated:', function () {

                it('should be function', function () {
                    expect(viewModel.objectiveImageUrlUpdated).toBeFunction();
                });

                describe('when objective is current objective', function () {

                    beforeEach(function () {
                        viewModel.objectiveId = objective.id;
                    });

                    it('should update objective image url', function () {
                        viewModel.imageUrl('');
                        viewModel.objectiveImageUrlUpdated(objective);
                        expect(viewModel.imageUrl()).toBe(objective.image);
                    });
                });

                describe('when objective is not current objective', function () {

                    beforeEach(function () {
                        viewModel.objectiveId = 'some_another_id';
                    });

                    it('should not update objective image url', function () {
                        viewModel.imageUrl('');
                        viewModel.objectiveImageUrlUpdated(objective);
                        expect(viewModel.imageUrl()).toBe('');
                    });

                });

            });

            describe('isReorderingQuestions:', function () {

                it('should be observable', function () {
                    expect(viewModel.isReorderingQuestions).toBeObservable();
                });
            });

            describe('startReorderingQuestions:', function () {

                it('should be function', function () {
                    expect(viewModel.startReorderingQuestions).toBeFunction();
                });

                it('should set isReorderingQuestion', function () {
                    viewModel.isReorderingQuestions(false);
                    viewModel.startReorderingQuestions();

                    expect(viewModel.isReorderingQuestions()).toBeTruthy();
                });
            });

            describe('endReorderingQuestions:', function () {

                var getById;

                beforeEach(function () {
                    getById = Q.defer();
                    spyOn(repository, 'getById').and.returnValue(getById.promise);
                });

                it('should be function', function () {
                    expect(viewModel.endReorderingQuestions).toBeFunction();
                });

                describe('when reordering questions has been finished', function () {
                    beforeEach(function () {
                        viewModel.isReorderingQuestions(false);
                    });

                    it('should resolve promise', function (done) {
                        var promise = viewModel.endReorderingQuestions();

                        promise.fin(function () {
                            expect(promise).toBeResolved();
                            done();
                        });
                    });
                });

                describe('when questions have not been reordered by collaborator', function () {
                    beforeEach(function () {
                        viewModel.isReorderingQuestions(true);
                        viewModel.isQuestionsListReorderedByCollaborator(false);
                    });

                    it('should resolve promise', function (done) {
                        var promise = viewModel.endReorderingQuestions();

                        promise.fin(function () {
                            expect(promise).toBeResolved();
                            done();
                        });
                    });

                    it('should set isReorderingQuestions to false', function (done) {
                        viewModel.isReorderingQuestions(true);
                        var promise = viewModel.endReorderingQuestions();

                        promise.fin(function () {
                            expect(viewModel.isReorderingQuestions()).toBeFalsy();
                            done();
                        });
                    });
                });

                describe('when questions have been reordered by collaborator', function () {
                    var questions = [
                                    { id: 3, title: 'A', isSelected: ko.observable(false) },
                                    { id: 1, title: 'b', isSelected: ko.observable(false) }
                    ];

                    beforeEach(function () {
                        viewModel.questions([questions[1], questions[0]]);
                    });

                    beforeEach(function () {
                        viewModel.isReorderingQuestions(true);
                        viewModel.isQuestionsListReorderedByCollaborator(true);
                        getById.resolve({ questions: questions });
                    });

                    it('should set isReorderingObjectives to false', function (done) {
                        viewModel.isReorderingQuestions(true);
                        var promise = viewModel.endReorderingQuestions();

                        promise.fin(function () {
                            expect(viewModel.isReorderingQuestions()).toBeFalsy();
                            done();
                        });
                    });

                    it('should set isQuestionsListReorderedByCollaborator to false', function (done) {
                        viewModel.isReorderingQuestions(true);
                        var promise = viewModel.endReorderingQuestions();

                        promise.fin(function () {
                            expect(viewModel.isQuestionsListReorderedByCollaborator()).toBeFalsy();
                            done();
                        });
                    });

                    it('should reorder questions', function (done) {
                        var promise = viewModel.endReorderingQuestions();

                        promise.fin(function () {
                            expect(viewModel.questions()[0].id).toBe(questions[0].id);
                            expect(viewModel.questions()[1].id).toBe(questions[1].id);
                            done();
                        });
                    });
                });

            });

            describe('questionsReordered:', function () {
                beforeEach(function () {
                    var questions = [
                                { id: 3, title: 'A', isSelected: ko.observable(false) },
                                { id: 1, title: 'b', isSelected: ko.observable(false) },
                                { id: 2, title: 'B', isSelected: ko.observable(false) },
                                { id: 0, title: 'a', isSelected: ko.observable(false) }
                    ];
                    viewModel.questions(questions);
                });

                it('should be function', function () {
                    expect(viewModel.questionsReordered).toBeFunction();
                });

                describe('when objective id corresponds current objective', function () {

                    beforeEach(function () {
                        viewModel.objectiveId = objective.id;
                    });

                    describe('and isReorderingQuestions is false', function () {

                        beforeEach(function () {
                            viewModel.isReorderingQuestions(false);
                        });

                        it('should update order of questions', function () {
                            viewModel.questionsReordered(objective);

                            expect(viewModel.questions()[0].id).toBe(0);
                            expect(viewModel.questions()[3].id).toBe(3);
                        });
                    });

                    describe('and isReorderingQuestions is true', function () {
                        beforeEach(function () {
                            viewModel.isReorderingQuestions(true);
                        });

                        it('should set isQuestionsListReorderedByCollaborator to true', function () {
                            viewModel.isQuestionsListReorderedByCollaborator(false);
                            viewModel.questionsReordered(objective);

                            expect(viewModel.isQuestionsListReorderedByCollaborator()).toBeTruthy();
                        });

                        it('should not update order of questions', function () {
                            viewModel.questionsReordered(objective);

                            expect(viewModel.questions()[0].id).toBe(3);
                            expect(viewModel.questions()[3].id).toBe(0);
                        });
                    });
                });

                describe('when objective id doesn\'t correspond current objective', function () {

                    beforeEach(function () {
                        viewModel.objectiveId = 'someId';
                    });

                    it('should not update order of questions', function () {
                        viewModel.questionsReordered(objective);

                        expect(viewModel.questions()[0].id).toBe(3);
                        expect(viewModel.questions()[3].id).toBe(0);
                    });
                });
            });

            describe('questionCreatedByCollaborator:', function () {

                var question = { id: 'questionId', type: 'multipleSelect' };

                it('should be function', function () {
                    expect(viewModel.questionCreatedByCollaborator).toBeFunction();
                });

                describe('when objective id corresponds current objective', function () {
                    beforeEach(function () {
                        viewModel.objectiveId = objective.id;
                    });

                    it('should add new question to questions list', function () {
                        viewModel.questions([]);
                        viewModel.questionCreatedByCollaborator(objective.id, question);

                        expect(viewModel.questions().length).toBe(1);
                        expect(viewModel.questions()[0].id).toBe(question.id);
                    });
                });

                describe('when objective id doesn\'t correspond current objective', function () {
                    beforeEach(function () {
                        viewModel.objectiveId = 'someId';
                    });

                    it('should not add new question to questions list', function () {
                        viewModel.questions([]);
                        viewModel.questionCreatedByCollaborator(objective.id, question);

                        expect(viewModel.questions().length).toBe(0);
                    });
                });
            });

            describe('questionDeletedByCollaborator:', function () {
                beforeEach(function () {
                    var questions = [
                        { id: '0', title: 'A', isSelected: ko.observable(false) },
                        { id: '1', title: 'b', isSelected: ko.observable(false) },
                        { id: '2', title: 'B', isSelected: ko.observable(false) },
                        { id: '3', title: 'a', isSelected: ko.observable(false) }];
                    viewModel.questions(questions);
                });

                it('should be function', function () {
                    expect(viewModel.questionDeletedByCollaborator).toBeFunction();
                });

                describe('when objective id corresponds current objective', function () {
                    beforeEach(function () {
                        viewModel.objectiveId = objective.id;
                    });

                    it('should remove questions from objective', function () {
                        viewModel.questionDeletedByCollaborator(objective.id, ['2', '3']);

                        expect(viewModel.questions().length).toBe(2);
                        expect(viewModel.questions()[0].id).toBe('0');
                        expect(viewModel.questions()[1].id).toBe('1');
                    });
                });

                describe('when objective id doesn\'t correspond current objective', function () {
                    beforeEach(function () {
                        viewModel.objectiveId = 'someId';
                    });

                    it('should not remove questions from objective', function () {
                        viewModel.questionDeletedByCollaborator(objective.id, ['2', '3']);

                        expect(viewModel.questions().length).toBe(4);
                    });
                });
            });

            describe('questionTitleUpdatedByCollaborator:', function () {
                it('should be function', function () {
                    expect(viewModel.questionTitleUpdatedByCollaborator).toBeFunction();
                });

                var question = { id: 'id', title: 'title', modifiedOn: new Date() },
                    vmQuestion = { id: question.id, title: ko.observable(''), modifiedOn: ko.observable(''), isSelected: ko.observable(false) };

                it('should update question title', function () {
                    viewModel.questions([vmQuestion]);
                    viewModel.questionTitleUpdatedByCollaborator(question);
                    expect(vmQuestion.title()).toBe(question.title);
                });

                it('should update question modifiedOn', function () {
                    viewModel.questions([vmQuestion]);
                    viewModel.questionTitleUpdatedByCollaborator(question);
                    expect(vmQuestion.modifiedOn()).toBe(question.modifiedOn);
                });
            });

            describe('questionUpdated:', function () {
                it('should be function', function () {
                    expect(viewModel.questionUpdated).toBeFunction();
                });

                var question = { id: 'id', title: 'title', modifiedOn: new Date() },
                    vmQuestion = { id: question.id, title: ko.observable(''), modifiedOn: ko.observable(''), isSelected: ko.observable(false) };

                it('should update question modifiedOn', function () {
                    viewModel.questions([vmQuestion]);
                    viewModel.questionUpdated(question);
                    expect(vmQuestion.modifiedOn()).toBe(question.modifiedOn);
                });
            });
        });


    }
);