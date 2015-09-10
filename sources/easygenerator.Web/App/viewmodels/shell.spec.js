define(['viewmodels/shell'], function (viewModel) {
    "use strict";

    var
        router = require('plugins/router'),
        eventTracker = require('eventTracker'),
        dataContext = require('dataContext'),
        notify = require('notify'),
        localizationManager = require('localization/localizationManager'),
        constants = require('constants')
    ;

    describe('viewModel [shell]', function () {

        beforeEach(function () {
            spyOn(eventTracker, 'publish');
            spyOn(router, 'navigate');
            spyOn(router, 'setLocation');
            spyOn(notify, 'error');
        });

        it('should be defined', function () {
            expect(viewModel).toBeDefined();
        });

        describe('homeModule', function () {

            it('should be defined', function () {
                expect(viewModel.homeModuleName).toBeDefined();
            });

            it('should equal \'courses\'', function () {
                expect(viewModel.homeModuleName).toEqual('courses');
            });

        });

        describe('activate:', function () {

            var dataContextDefer;

            beforeEach(function () {
                dataContextDefer = Q.defer();
                spyOn(dataContext, 'initialize').and.returnValue(dataContextDefer.promise);
                dataContextDefer.resolve();
            });

            it('should be function', function () {
                expect(viewModel.activate).toBeFunction();
            });

            it('should return promise', function () {
                expect(viewModel.activate()).toBePromise();
            });

            describe('when dataContext initialized', function () {

                var routerActivateDefer;

                beforeEach(function () {
                    routerActivateDefer = Q.defer();
                    spyOn(router, 'activate').and.returnValue(routerActivateDefer.promise);
                    routerActivateDefer.resolve();
                });
            });

        });

        describe('showNavigation:', function () {

            it('should be function', function () {
                expect(viewModel.showNavigation).toBeFunction();
            });

            describe('when activeModuleName is error page', function () {

                describe('and error page 404', function () {

                    it('should be return true', function () {
                        spyOn(viewModel, 'activeModuleName').and.returnValue('404');
                        expect(viewModel.showNavigation()).toBeTruthy();
                    });

                });

            });

            describe('when activeModuleName is not error page', function () {

                it('should be return fasle', function () {
                    spyOn(viewModel, 'activeModuleName').and.returnValue('somepage');
                    expect(viewModel.showNavigation()).toBeFalsy();
                });

            });

        });

        describe('createCourseCallBack', function() {

            it('should be function', function() {
                expect(viewModel.createCourseCallback).toBeFunction();
            });

            it('should navigate to course page', function() {
                viewModel.createCourseCallback({ id: 'id' });
                expect(router.navigate).toHaveBeenCalledWith('courses/id');
            });

        });

        describe('courseDeleted:', function () {

            var courseId = 'courseId',
                errorMessage = 'error';

            beforeEach(function () {
                spyOn(localizationManager, 'localize').and.returnValue(errorMessage);
            });

            it('should be function', function () {
                expect(viewModel.courseDeleted).toBeFunction();
            });

            describe('when in context of course', function () {
                beforeEach(function () {
                    router.routeData({
                        courseId: courseId
                    });
                });

                it('should show notification error', function () {
                    viewModel.courseDeleted(courseId);
                    expect(notify.error).toHaveBeenCalledWith(errorMessage);
                });
            });

            describe('when not in context of course', function () {
                beforeEach(function () {
                    router.routeData({
                        courseId: 'id'
                    });
                });

                it('should not show notification error', function () {
                    viewModel.courseDeleted(courseId);
                    expect(notify.error).not.toHaveBeenCalledWith(errorMessage);
                });
            });

        });

        describe('courseCollaborationFinished:', function () {

            var courseId = 'courseId',
                errorMessage = 'error';

            beforeEach(function () {
                spyOn(localizationManager, 'localize').and.returnValue(errorMessage);
            });

            it('should be function', function () {
                expect(viewModel.courseCollaborationFinished).toBeFunction();
            });

            describe('when in context of course', function () {
                beforeEach(function () {
                    router.routeData({
                        courseId: courseId
                    });
                });

                it('should show notification error', function () {
                    viewModel.courseCollaborationFinished(courseId);
                    expect(notify.error).toHaveBeenCalledWith(errorMessage);
                });
            });

            describe('when not in context of course', function () {
                beforeEach(function () {
                    router.routeData({
                        courseId: 'id'
                    });
                });

                it('should not show notification error', function () {
                    viewModel.courseCollaborationFinished(courseId);
                    expect(notify.error).not.toHaveBeenCalledWith(errorMessage);
                });
            });

        });

        describe('objectivesUnrelated:', function () {

            var objectiveId = 'objectiveId',
                courseId = 'courseId',
                errorMessage = 'error';

            beforeEach(function () {
                spyOn(localizationManager, 'localize').and.returnValue(errorMessage);
            });

            it('should be function', function () {
                expect(viewModel.objectivesUnrelated).toBeFunction();
            });

            describe('when not in context of course', function () {
                beforeEach(function () {
                    router.routeData({
                        objectiveId: 'id',
                        courseId: undefined
                    });
                });

                it('should not show notification error', function () {
                    viewModel.objectivesUnrelated(courseId, [objectiveId]);
                    expect(notify.error).not.toHaveBeenCalledWith(errorMessage);
                });
            });

            describe('when not in context of objective', function () {
                beforeEach(function () {
                    router.routeData({
                        objectiveId: 'id',
                        courseId: courseId
                    });
                });

                it('should not show notification error', function () {
                    viewModel.objectivesUnrelated(courseId, [objectiveId]);
                    expect(notify.error).not.toHaveBeenCalledWith(errorMessage);
                });
            });

            it('should show notification error', function () {
                router.routeData({
                    objectiveId: objectiveId,
                    courseId: courseId
                });

                viewModel.objectivesUnrelated(courseId, [objectiveId]);
                expect(notify.error).toHaveBeenCalledWith(errorMessage);
            });
        });

        describe('openUpgradePlanUrl:', function () {

            beforeEach(function () {
                spyOn(window, 'open');
            });

            it('should be function', function () {
                expect(viewModel.openUpgradePlanUrl).toBeFunction();
            });

            it('should send event \'Upgrade now\'', function () {
                viewModel.openUpgradePlanUrl();
                expect(eventTracker.publish).toHaveBeenCalledWith(constants.upgradeEvent, constants.upgradeCategory.header);
            });

            it('should open upgrade link in new window', function () {
                viewModel.openUpgradePlanUrl();
                expect(window.open).toHaveBeenCalledWith(constants.upgradeUrl, '_blank');
            });

        });

        describe('questionsDeleted:', function () {

            var questionId = 'questionId',
                errorMessage = 'error';

            beforeEach(function () {
                spyOn(localizationManager, 'localize').and.returnValue(errorMessage);
            });

            it('should be function', function () {
                expect(viewModel.questionsDeleted).toBeFunction();
            });

            describe('when not in context of course', function () {
                beforeEach(function () {
                    router.routeData({
                        questionId: 'id',
                        courseId: undefined
                    });
                });

                it('should not show notification error', function () {
                    viewModel.questionsDeleted('objectiveId', [questionId]);
                    expect(notify.error).not.toHaveBeenCalledWith(errorMessage);
                });
            });

            describe('when not in context of question', function () {
                beforeEach(function () {
                    router.routeData({
                        questionId: 'id',
                        courseId: 'courseId'
                    });
                });

                it('should not show notification error', function () {
                    viewModel.questionsDeleted('objectiveId', [questionId]);
                    expect(notify.error).not.toHaveBeenCalledWith(errorMessage);
                });
            });

            it('should show notification error', function () {
                router.routeData({
                    questionId: questionId,
                    courseId: 'courseId'
                });

                viewModel.questionsDeleted('objectiveId', [questionId]);
                expect(notify.error).toHaveBeenCalledWith(errorMessage);
            });

        });
    });

});