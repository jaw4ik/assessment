define(['viewmodels/learningPaths/learningPath/learningPath'], function (viewModel) {
    "use strict";
    var
         getLearningPathByIdQuery = require('viewmodels/learningPaths/learningPath/queries/getLearningPathByIdQuery'),
         router = require('plugins/router'),
         constants = require('constants'),
         updateTitleCommand = require('viewmodels/learningPaths/learningPath/commands/updateLearningPathTitleCommand'),
         clientContext = require('clientContext'),
         eventTracker = require('eventTracker'),
         courseSelector = require('viewmodels/learningPaths/courseSelector/courseSelector'),
         app = require('durandal/app')
    ;

    describe('viewModel [learningPath]', function () {
        var learningPath = {
            id: 'id',
            title: 'title'
        },
            getLearnigPathDefer;

        beforeEach(function () {
            getLearnigPathDefer = Q.defer();
            spyOn(app, 'on');
            spyOn(app, 'off');
            spyOn(router, 'navigate');
            spyOn(eventTracker, 'publish');
            spyOn(courseSelector, 'expand');
            spyOn(courseSelector, 'collapse');
            spyOn(getLearningPathByIdQuery, 'execute').and.returnValue(getLearnigPathDefer.promise);
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

            it('should set current language', function() {
                var lang = 'en';
                viewModel.currentLanguage = '';
                localizationManager.currentLanguage = lang;
                viewModel.activate(learningPath.id);
                expect(viewModel.currentLanguage).toBe(lang);
            });

            it('should subscribe on learningPath.addCourse event', function () {
                viewModel.activate(learningPath.id);
                expect(app.on).toHaveBeenCalledWith(constants.messages.learningPath.addCourse, viewModel.addCourse);
            });

            it('should subscribe on learningPath.removeCourse event', function () {
                viewModel.activate(learningPath.id);
                expect(app.on).toHaveBeenCalledWith(constants.messages.learningPath.removeCourse, viewModel.removeCourse);
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

        describe('deactivate:', function() {
            it('should unsubscribe from learningPath.addCourse event', function () {
                viewModel.deactivate();
                expect(app.off).toHaveBeenCalledWith(constants.messages.learningPath.addCourse, viewModel.addCourse);
            });

            it('should unsubscribe from learningPath.removeCourse event', function () {
                viewModel.deactivate();
                expect(app.off).toHaveBeenCalledWith(constants.messages.learningPath.removeCourse, viewModel.removeCourse);
            });
        });

        describe('back:', function () {
            it('should publish \'Navigate to learning paths\' event', function () {
                viewModel.back();
                expect(eventTracker.publish).toHaveBeenCalledWith('Navigate to learning paths');
            });

            it('should navigate to learning paths', function () {
                viewModel.back();
                expect(router.navigate).toHaveBeenCalledWith('#learningpaths');
            });
        });

        describe('id:', function () {
            it('should be defined', function () {
                expect(viewModel.id).toBeDefined();
            });
        });

        describe('currentLanguage:', function () {
            it('should be defined', function () {
                expect(viewModel.currentLanguage).toBeDefined();
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

        describe('addCourses:', function () {
            it('should expand course selector', function () {
                viewModel.addCourses();
                expect(courseSelector.expand).toHaveBeenCalled();
            });
        });

        describe('finishAddingCourses:', function () {
            it('should collapse course selector', function () {
                viewModel.finishAddingCourses();
                expect(courseSelector.collapse).toHaveBeenCalled();
            });
        });
    });

});