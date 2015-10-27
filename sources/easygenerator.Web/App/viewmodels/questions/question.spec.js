define(function (require) {
    "use strict";

    var
        viewModel = require('viewmodels/questions/question'),
        router = require('plugins/router'),
        constants = require('constants'),
        eventTracker = require('eventTracker'),
        questionRepository = require('repositories/questionRepository'),
        objectiveRepository = require('repositories/objectiveRepository'),
        courseRepository = require('repositories/courseRepository'),
        http = require('plugins/http'),
        vmQuestionTitle = require('viewmodels/questions/questionTitle'),
        vmContentField = require('viewmodels/common/contentField'),
        multipleSelect = require('viewmodels/questions/multipleSelect/multipleSelect'),
        learningContents = require('viewmodels/learningContents/learningContents'),
        feedback = require('viewmodels/questions/feedback'),
        moveCopyDialog = require('dialogs/moveCopyQuestion/moveCopyQuestion');

    var question = {
        id: '1',
        type: constants.questionType.multipleSelect.type,
        title: 'lalala',
        content: 'question content',
        createdOn: new Date(),
        modifiedOn: new Date(),
        answerOptions: [],
        learningContents: [],
        voiceOver:'<iframe></iframe>'
    };

    var objective = {
        id: '0',
        questions: [question]
    };
    var objectiveFull = {
        id: '1',
        title: 'Test Objective',
        image: 'some image url',
        questions: [
            {
                id: '0',
                title: 'Question 1',
                answerOptions: [],
                learningContents: []
            },
            question,
            {
                id: '2',
                title: 'Question 3',
                answerOptions: [],
                learningContents: []
            }
        ]
    };

    describe('viewModel [question]', function () {

        beforeEach(function () {
            spyOn(eventTracker, 'publish');
            spyOn(router, 'navigate');
            spyOn(router, 'navigateWithQueryString');
            spyOn(router, 'replace');
            spyOn(moveCopyDialog, 'show');
        });

        it('is defined', function () {
            expect(viewModel).toBeDefined();
        });

        describe('objectiveId:', function () {

            it('should be defined', function () {
                expect(viewModel.objectiveId).toBeDefined();
            });

        });

        describe('questionId:', function () {

            it('should be defined', function () {
                expect(viewModel.questionId).toBeDefined();
            });

        });

        describe('localizationManager:', function () {

            it('should be defined', function () {
                expect(viewModel.localizationManager).toBeDefined();
            });

        });

        describe('viewCaption:', function () {

            it('should be defined', function () {
                expect(viewModel.viewCaption).toBeDefined();
            });

        });

        describe('navigateToObjectiveEvent:', function () {

            it('should be function', function () {
                expect(viewModel.navigateToObjectiveEvent).toBeFunction();
            });

            it('should send event \'Navigate to objective details\'', function () {
                viewModel.navigateToObjectiveEvent();
                expect(eventTracker.publish).toHaveBeenCalledWith('Navigate to objective details');
            });

        });

        describe('activeQuestionViewModel:', function () {

            it('should be defined', function () {
                expect(viewModel.activeQuestionViewModel).toBeDefined();
            });

        });

        describe('learningContentsViewModel:', function () {

            it('should be defined', function () {
                expect(viewModel.learningContentsViewModel).toBeDefined();
            });

        });
        
        describe('feedbackViewModel:', function () {

            it('should be defined', function () {
                expect(viewModel.feedbackViewModel).toBeDefined();
            });

        });

        describe('questionTitle:', function () {

            it('should be defined', function () {
                expect(viewModel.questionTitle).toBeDefined();
            });

        });

        describe('questionContent:', function () {

            it('should be defined', function () {
                expect(viewModel.questionContent).toBeDefined();
            });

        });

        describe('canActivate:', function () {

            var getQuestionById, getObjectiveById, getCourseById;

            beforeEach(function () {
                getQuestionById = Q.defer();
                getObjectiveById = Q.defer();
                getCourseById = Q.defer();

                spyOn(questionRepository, 'getById').and.returnValue(getQuestionById.promise);
                spyOn(objectiveRepository, 'getById').and.returnValue(getObjectiveById.promise);
                spyOn(courseRepository, 'getById').and.returnValue(getCourseById.promise);

            });

            it('should be function', function () {
                expect(viewModel.canActivate).toBeFunction();
            });

            describe('when activated with 3 argument', function () {

                describe('and course exists', function () {
                    beforeEach(function () {
                        getCourseById.resolve({});
                    });

                    describe('and objective exists', function () {
                        beforeEach(function () {
                            getObjectiveById.resolve({});
                        });

                        describe('and question does not exist', function () {
                            beforeEach(function () {
                                getQuestionById.reject({});
                            });

                            it('should redirect to 404', function (done) {
                                viewModel.canActivate('courseId', 'objectiveId', 'questionId').then(function (result) {
                                    expect(result).toEqual({ redirect: '404' });
                                    done();
                                });
                            });
                        });

                        describe('and question exists', function () {
                            beforeEach(function () {
                                getQuestionById.resolve({});
                            });

                            it('should return true', function (done) {
                                viewModel.canActivate('courseId', 'objectiveId', 'questionId').then(function (result) {
                                    expect(result).toEqual(true);
                                    done();
                                });
                            });
                        });
                    });

                    describe('and objective does not exist', function () {
                        beforeEach(function () {
                            getObjectiveById.reject({});
                        });

                        describe('and question exists', function () {
                            beforeEach(function () {
                                getQuestionById.resolve({});
                            });

                            it('should redirect to 404', function (done) {
                                viewModel.canActivate('courseId', 'objectiveId', 'questionId').then(function (result) {
                                    expect(result).toEqual({ redirect: '404' });
                                    done();
                                });
                            });
                        });
                    });
                });

                describe('and course does not exist', function () {
                    beforeEach(function () {
                        getCourseById.reject({});
                    });

                    describe('and objective exists', function () {
                        beforeEach(function () {
                            getObjectiveById.resolve({});
                        });

                        describe('and question exists', function () {
                            beforeEach(function () {
                                getQuestionById.resolve({});
                            });

                            it('should redirect to 404', function (done) {
                                viewModel.canActivate('courseId', 'objectiveId', 'questionId').then(function (result) {
                                    expect(result).toEqual({ redirect: '404' });
                                    done();
                                });
                            });
                        });
                    });
                });
            });

            describe('when activated with 2 argument', function () {

                describe('and objective exists', function () {
                    beforeEach(function () {
                        getObjectiveById.resolve({});
                    });

                    describe('and question does not exist', function () {
                        beforeEach(function () {
                            getQuestionById.reject({});
                        });

                        it('should redirect to 404', function (done) {
                            viewModel.canActivate('objectiveId', 'questionId').then(function (result) {
                                expect(result).toEqual({ redirect: '404' });
                                done();
                            });
                        });
                    });

                    describe('and question exists', function () {
                        beforeEach(function () {
                            getQuestionById.resolve({});
                        });

                        it('should return true', function (done) {
                            viewModel.canActivate('objectiveId', 'questionId').then(function (result) {
                                expect(result).toEqual(true);
                                done();
                            });
                        });
                    });
                });

                describe('and objective does not exist', function () {
                    beforeEach(function () {
                        getObjectiveById.reject({});
                    });

                    describe('and question exists', function () {
                        beforeEach(function () {
                            getQuestionById.resolve({});
                        });

                        it('should redirect to 404', function (done) {
                            viewModel.canActivate('objectiveId', 'questionId').then(function (result) {
                                expect(result).toEqual({ redirect: '404' });
                                done();
                            });
                        });
                    });
                });
            });

            describe('when activated with 1 argument', function () {
                it('should throw exception', function () {
                    var f = function () { viewModel.canActivate(); }
                    expect(f).toThrow();
                });
            });
        });

        describe('activate:', function () {

            var getQuestionById,
                activeQuestionViewModelInitDeferred,
                learningContentsViewModelInitDeferred,
                feedbackViewModelInitDeferred,

                viewModelData = {
                    viewCaption: 'caption',
                    isQuestionContentNeeded: true
                };

            beforeEach(function () {
                getQuestionById = Q.defer();

                spyOn(questionRepository, 'getById').and.returnValue(getQuestionById.promise);
                activeQuestionViewModelInitDeferred = Q.defer();
                spyOn(multipleSelect, 'initialize').and.returnValue(activeQuestionViewModelInitDeferred.promise);
                learningContentsViewModelInitDeferred = Q.defer();
                spyOn(learningContents, 'initialize').and.returnValue(learningContentsViewModelInitDeferred.promise);
                feedbackViewModelInitDeferred = Q.defer();
                spyOn(feedback, 'initialize').and.returnValue(feedbackViewModelInitDeferred.promise);

                spyOn(http, 'post');
            });

            it('should be a function', function () {
                expect(viewModel.activate).toBeFunction();
            });

            it('should return promise', function () {
                expect(viewModel.activate('objectiveId', 'questionId')).toBePromise();
            });

            describe('when activated with objectiveId and questionId', function () {

                beforeEach(function () {
                    getQuestionById.resolve(question);

                    activeQuestionViewModelInitDeferred.resolve(viewModelData);
                    learningContentsViewModelInitDeferred.resolve();
                    feedbackViewModelInitDeferred.resolve();
                });

                it('should set objectiveId', function (done) {
                    viewModel.objectiveId = null;

                    viewModel.activate('objectiveId', 'questionId').then(function () {
                        expect(viewModel.objectiveId).toEqual('objectiveId');
                        done();
                    });
                });

                it('should set questionId', function (done) {
                    viewModel.questionId = null;

                    viewModel.activate('objectiveId', 'questionId').then(function () {
                        expect(viewModel.questionId).toEqual('questionId');
                        done();
                    });
                });

                it('should set voiceOver', function (done) {
                    viewModel.voiceOver = null;

                    viewModel.activate('objectiveId', 'questionId').then(function () {
                        expect(viewModel.voiceOver).toBeDefined();
                        done();
                    });
                });

                it('should set null to courseId', function (done) {
                    viewModel.courseId = 'courseId';

                    viewModel.activate('objectiveId', 'questionId').then(function () {
                        expect(viewModel.courseId).toEqual(null);
                        done();
                    });
                });
            });

            describe('when activated with courseId, objectiveId and questionId', function () {

                beforeEach(function () {
                    getQuestionById.resolve(question);

                    activeQuestionViewModelInitDeferred.resolve(viewModelData);
                    learningContentsViewModelInitDeferred.resolve();
                    feedbackViewModelInitDeferred.resolve();
                });

                it('should set courseId', function (done) {
                    viewModel.courseId = null;

                    viewModel.activate('courseId', 'objectiveId', 'questionId').then(function () {
                        expect(viewModel.courseId).toEqual('courseId');
                        done();
                    });
                });

                it('should set objectiveId', function (done) {
                    viewModel.objectiveId = null;

                    viewModel.activate('courseId', 'objectiveId', 'questionId').then(function () {
                        expect(viewModel.objectiveId).toEqual('objectiveId');
                        done();
                    });
                });

                it('should set questionId', function (done) {
                    viewModel.questionId = null;

                    viewModel.activate('courseId', 'objectiveId', 'questionId').then(function () {
                        expect(viewModel.questionId).toEqual('questionId');
                        done();
                    });
                });

            });

            describe('when activated with incorrect arguments', function () {

                it('should throw exception', function () {
                    var f = function () { viewModel.activate(); }
                    expect(f).toThrow();
                });

            });

            describe('when question not found', function () {
                beforeEach(function () {
                    getQuestionById.reject('reason');
                });

                it('should reject promise', function (done) {
                    var promise = viewModel.activate('objectiveId', 'questionId');

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('reason');
                        done();
                    });
                });

            });

            describe('when question found', function () {

                beforeEach(function () {
                    getQuestionById.resolve(question);

                    activeQuestionViewModelInitDeferred.resolve(viewModelData);
                    learningContentsViewModelInitDeferred.resolve();
                    feedbackViewModelInitDeferred.resolve();
                });

                it('should set activeQuestionViewModel', function (done) {
                    viewModel.activeQuestionViewModel = null;

                    viewModel.activate(objective.id, question.id).fin(function () {
                        expect(viewModel.activeQuestionViewModel).not.toBeNull();
                        done();
                    });
                });

                it('should initialize activeQuestionViewModel', function (done) {
                    viewModel.activate(objective.id, question.id).fin(function () {
                        expect(multipleSelect.initialize).toHaveBeenCalledWith(viewModel.objectiveId, question);
                        done();
                    });
                });

                describe('when initialize activeQuestionViewModel', function () {

                    it('should set viewCaption', function (done) {
                        viewModel.activate(objective.id, question.id).fin(function () {
                            expect(viewModel.viewCaption).toBe(viewModelData.viewCaption);
                            done();
                        });
                    });

                    it('should set questionTitle', function (done) {
                        viewModel.questionTitle = null;

                        viewModel.activate(objective.id, question.id).fin(function () {
                            expect(viewModel.questionTitle).not.toBeNull();
                            done();
                        });
                    });

                    it('should initialize learningContents', function (done) {
                    viewModel.activate(objective.id, question.id).fin(function () {
                            expect(learningContents.initialize).toHaveBeenCalledWith(question);
                            done();
                        });
                    });

                    it('should initialize feedback', function (done) {
                        viewModel.activate(objective.id, question.id).fin(function () {
                            expect(feedback.initialize).toHaveBeenCalled();
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

                it('should redirect to objective within course', function () {
                    viewModel.courseId = 'courseId';
                    viewModel.objectiveId = 'objectiveId';
                    viewModel.back();
                    expect(router.navigate).toHaveBeenCalledWith('#courses/courseId/objectives/objectiveId');
                });

            });

            describe('when courseId is not set', function () {

                it('should redirect to objective', function () {
                    viewModel.courseId = null;
                    viewModel.objectiveId = 'objectiveId';
                    viewModel.back();
                    expect(router.navigate).toHaveBeenCalledWith('#library/objectives/objectiveId');
                });

            });

        });

        describe('titleUpdatedByCollaborator:', function () {

            it('should be function', function () {
                expect(viewModel.titleUpdatedByCollaborator).toBeFunction();
            });

            beforeEach(function () {
                viewModel.questionTitle = vmQuestionTitle(objective.id, question);
            });

            describe('when question is not current question', function () {

                it('should not update text', function () {
                    viewModel.questionTitle.text('');
                    viewModel.titleUpdatedByCollaborator({ id: '3333', title: 'new title' });
                    expect(viewModel.questionTitle.text()).toBe('');
                });

            });

            describe('when is editing title', function () {

                it('should not update title', function () {
                    viewModel.questionTitle.text('');
                    viewModel.questionTitle.text.isEditing(true);
                    viewModel.titleUpdatedByCollaborator(question);
                    expect(viewModel.questionTitle.text()).toBe('');
                });

            });

            it('should update text', function () {
                viewModel.questionTitle.text.isEditing(false);
                viewModel.questionId = question.id;
                var newTitle = 'new';

                viewModel.questionTitle.text('');
                viewModel.titleUpdatedByCollaborator({ id: question.id, title: newTitle });
                expect(viewModel.questionTitle.text()).toBe(newTitle);
            });

        });

        describe('contentUpdatedByCollaborator:', function () {

            it('should be function', function () {
                expect(viewModel.contentUpdatedByCollaborator).toBeFunction();
            });

            beforeEach(function () {
                viewModel.questionContent = vmContentField(question.content);
                viewModel.questionId = question.id;
            });

            describe('when is not current question', function () {
                it('should not update content', function () {
                    viewModel.questionId = 'qqq';
                    viewModel.questionContent.text('');
                    viewModel.contentUpdatedByCollaborator(question);
                    expect(viewModel.questionContent.text()).toBe('');
                });
            });

            describe('when is editing content', function () {
                it('should update original content', function () {
                    viewModel.questionContent.originalText('');
                    viewModel.questionContent.isEditing(true);
                    viewModel.contentUpdatedByCollaborator(question);
                    expect(viewModel.questionContent.originalText()).toBe(question.content);
                });

                it('should not update content', function () {
                    viewModel.questionContent.text('');
                    viewModel.questionContent.isEditing(true);
                    viewModel.contentUpdatedByCollaborator(question);
                    expect(viewModel.questionContent.text()).toBe('');
                });
            });

            it('should update original content', function () {
                viewModel.questionContent.originalText('');
                viewModel.questionContent.isEditing(false);
                viewModel.contentUpdatedByCollaborator(question);
                expect(viewModel.questionContent.originalText()).toBe(question.content);
            });

            it('should update content', function () {
                viewModel.questionContent.text('');
                viewModel.questionContent.isEditing(false);
                viewModel.contentUpdatedByCollaborator(question);
                expect(viewModel.questionContent.text()).toBe(question.content);
            });
        });

        describe('showMoveCopyDialog:', function () {

            it('should be function', function () {
                expect(viewModel.showMoveCopyDialog).toBeFunction();
            });

            it('should open move/copy question dialog', function () {
                viewModel.courseId = '1';
                viewModel.objectiveId = '2';
                viewModel.questionId = '3';
                viewModel.showMoveCopyDialog();
                expect(moveCopyDialog.show).toHaveBeenCalledWith(viewModel.courseId, viewModel.objectiveId, viewModel.questionId);
            });

        });

        describe('duplicateQuestion:', function () {

            var copyQuestionDefer,
                questionId = 'questionId',
                objectiveId = 'objectiveId',
                courseId = 'courseId',
                newQuestionId = 'newQuestionId';

            beforeEach(function () {
                copyQuestionDefer = Q.defer();
                spyOn(questionRepository, 'copyQuestion').and.returnValue(copyQuestionDefer.promise);
                copyQuestionDefer.resolve({ id: newQuestionId });
                viewModel.objectiveId = objectiveId;
                viewModel.questionId = questionId;
            });

            it('should be function', function () {
                expect(viewModel.duplicateQuestion).toBeFunction();
            });

            it('should publish event \'Duplicate item\'', function () {
                viewModel.duplicateQuestion();
                expect(eventTracker.publish).toHaveBeenCalledWith('Duplicate item');
            });

            it('should send response to server', function () {
                viewModel.duplicateQuestion();
                expect(questionRepository.copyQuestion).toHaveBeenCalledWith(viewModel.questionId, viewModel.objectiveId);
            });

            describe('when is context of course', function () {

                beforeEach(function () {
                    viewModel.courseId = courseId;
                });

                it('should navigate to new question in course', function (done) {
                    viewModel.duplicateQuestion();
                    copyQuestionDefer.promise.fin(function () {
                        expect(router.navigate).toHaveBeenCalledWith('courses/' + courseId + '/objectives/' + objectiveId + '/questions/' + newQuestionId);
                        done();
                    });
                });

            });

            describe('when is not a context of course', function () {

                beforeEach(function () {
                    viewModel.courseId = null;
                });

                it('should navigate to new question', function (done) {
                    viewModel.duplicateQuestion();
                    copyQuestionDefer.promise.fin(function () {
                        expect(router.navigate).toHaveBeenCalledWith('library/objectives/' + objectiveId + '/questions/' + newQuestionId);
                        done();
                    });
                });

            });

        });

    });

});
