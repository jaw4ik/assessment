define(['dialogs/createCourse'], function (Dialog) {

    var router = require('plugins/router'),
        appDialog = require('plugins/dialog'),
        createCourseCommand = require('commands/createCourseCommand'),
        presentationCourseImportCommand = require('commands/presentationCourseImportCommand');

    describe('dialog [createCourse]', function () {

        var dialog;

        beforeEach(function () {
            spyOn(router, 'navigate');
            spyOn(appDialog, 'close');
            dialog = new Dialog();
        });

        it('should be function', function () {
            expect(Dialog).toBeFunction();
        });

        describe('isCourseCreating:', function () {

            it('should be observable', function () {
                expect(dialog.isCourseCreating).toBeObservable();
            });

        });

        describe('isCourseImporting:', function () {

            it('should be observable', function () {
                expect(dialog.isCourseImporting).toBeObservable();
            });

        });

        describe('isProcessing:', function () {

            beforeEach(function () {
                dialog.isCourseCreating(false);
                dialog.isCourseImporting(false);
            });

            it('should be computed', function () {
                expect(dialog.isProcessing).toBeComputed();
            });

            describe('when course is importing', function () {
                beforeEach(function () {
                    dialog.isCourseImporting(true);
                });

                it('should be true', function () {
                    expect(dialog.isProcessing()).toBeTruthy();
                });
            });

            describe('when course is creating', function () {
                beforeEach(function () {
                    dialog.isCourseCreating(true);
                });

                it('should be true', function () {
                    expect(dialog.isProcessing()).toBeTruthy();
                });
            });

            describe('when course is not creating or publishing', function () {
                it('should be false', function () {
                    expect(dialog.isProcessing()).toBeFalsy();
                });
            });

        });

        describe('createNewCourse:', function () {

            var createCourse;

            beforeEach(function () {
                createCourse = Q.defer();
                spyOn(createCourseCommand, 'execute').and.returnValue(createCourse.promise);
            });

            it('should be function', function () {
                expect(dialog.createNewCourse).toBeFunction();
            });

            describe('when another operation processing', function () {

                beforeEach(function () {
                    dialog.isCourseImporting(true);
                });

                it('should not set isCourseCreating to true', function () {
                    dialog.isCourseCreating(false);

                    dialog.createNewCourse();

                    expect(dialog.isCourseCreating()).toBeFalsy();
                });

                it('should not call command to create course', function () {
                    dialog.createNewCourse();

                    expect(createCourseCommand.execute).not.toHaveBeenCalled();
                });

            });

            describe('when no other operation processing', function () {

                beforeEach(function () {
                    dialog.isCourseImporting(false);
                });

                it('should isCourseCreating operation', function () {
                    dialog.isCourseCreating(false);

                    dialog.createNewCourse();

                    expect(dialog.isCourseCreating()).toBeTruthy();
                });

                it('should call command to create course', function () {
                    dialog.isCourseCreating(false);

                    dialog.createNewCourse();

                    expect(createCourseCommand.execute).toHaveBeenCalledWith('Splash pop-up after signup');
                });

                describe('when course is created', function () {

                    beforeEach(function () {
                        createCourse.resolve({ id: 'courseId' });
                    });

                    it('should navigate to created course', function (done) {
                        dialog.createNewCourse().fin(function () {
                            expect(router.navigate).toHaveBeenCalledWith('#courses/courseId');
                            done();
                        });
                    });

                    it('should close dialog', function (done) {
                        dialog.createNewCourse().fin(function () {
                            expect(appDialog.close).toHaveBeenCalledWith(dialog);
                            done();
                        });
                    });

                    it('should set \'isCourseCreating\' to false', function (done) {
                        dialog.createNewCourse().fin(function () {
                            expect(dialog.isCourseCreating()).toBeFalsy();
                            done();
                        });
                    });

                });

                describe('when course is not created', function () {

                    beforeEach(function () {
                        createCourse.reject('error');
                    });

                    it('should not navigate to course view', function (done) {
                        dialog.createNewCourse().fin(function () {
                            expect(router.navigate).not.toHaveBeenCalled();
                            done();
                        });
                    });

                    it('should not close dialog', function (done) {
                        dialog.createNewCourse().fin(function () {
                            expect(appDialog.close).not.toHaveBeenCalled();
                            done();
                        });
                    });

                    it('should set \'isCourseCreating\' to false', function (done) {
                        dialog.createNewCourse().fin(function () {
                            expect(dialog.isCourseCreating()).toBeFalsy();
                            done();
                        });
                    });
                });

            });

        });

        describe('importCourseFromPresentation:', function () {

            it('should be a function', function () {
                expect(dialog.importCourseFromPresentation).toBeFunction();
            });

            describe('when another operation processing', function () {

                beforeEach(function () {
                    dialog.isCourseCreating(true);
                });

                it('should not execute import course command', function () {
                    spyOn(presentationCourseImportCommand, 'execute');
                    dialog.importCourseFromPresentation();
                    expect(presentationCourseImportCommand.execute).not.toHaveBeenCalled();
                });

            });

            describe('when no other operation processing', function () {

                beforeEach(function () {
                    dialog.isCourseCreating(false);
                });

                it('should execute import course command', function () {
                    spyOn(presentationCourseImportCommand, 'execute');
                    dialog.importCourseFromPresentation();
                    expect(presentationCourseImportCommand.execute).toHaveBeenCalled();
                });

                describe('when course import started', function () {
                    beforeEach(function () {
                        dialog.isCourseImporting(false);
                        spyOn(presentationCourseImportCommand, 'execute').and.callFake(function (spec) {
                            spec.startLoading();
                        });
                    });

                    it('should set isCourseImporting to true', function () {
                        dialog.importCourseFromPresentation();
                        expect(dialog.isCourseImporting()).toBeTruthy();
                    });
                });

                describe('when course import completed', function () {
                    beforeEach(function () {
                        spyOn(presentationCourseImportCommand, 'execute').and.callFake(function (spec) {
                            spec.complete();
                        });
                    });

                    it('should set isCourseImporting to false', function () {
                        dialog.importCourseFromPresentation();
                        expect(dialog.isCourseImporting()).toBeFalsy();
                    });
                });

                describe('when course import succeded', function () {
                    var course = { id: 'id', objectives: [] };
                    beforeEach(function () {
                        spyOn(presentationCourseImportCommand, 'execute').and.callFake(function (spec) {
                            spec.success(course);
                        });
                    });

                    describe('and course has objective', function () {

                        beforeEach(function () {
                            course.objectives = [{ id: 'objectiveId' }];
                        });

                        it('should navigate to objective', function () {
                            dialog.importCourseFromPresentation();
                            expect(router.navigate).toHaveBeenCalledWith('#courses/' + course.id + '/objectives/' + course.objectives[0].id);
                        });
                    });

                    describe('and course does not have objectives', function () {
                        beforeEach(function () {
                            course.objectives = [];
                        });

                        it('should navigate to created course', function () {
                            dialog.importCourseFromPresentation();
                            expect(router.navigate).toHaveBeenCalledWith('#courses/' + course.id);
                        });
                    });

                    it('should close dialog', function () {
                        dialog.importCourseFromPresentation();
                        expect(appDialog.close).toHaveBeenCalledWith(dialog);
                    });

                });

            });

        });

    });

});