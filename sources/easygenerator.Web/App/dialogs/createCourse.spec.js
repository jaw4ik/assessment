define(['dialogs/createCourse'], function(Dialog) {

    var router = require('plugins/router'),
        appDialog = require('plugins/dialog'),
        createCourseCommand = require('commands/createCourseCommand');

    describe('dialog [createCourse]', function() {

        var dialog;

        beforeEach(function() {
            spyOn(router, 'navigate');
            spyOn(appDialog, 'close');
            dialog = new Dialog();
        });

        it('should be function', function() {
            expect(Dialog).toBeFunction();
        });

        describe('isCourseCreating:', function () {

            it('should be observable', function () {
                expect(dialog.isCourseCreating).toBeObservable();
            });

        });

        describe('createNewCourse:', function () {
            
            var createCourse;

            beforeEach(function() {
                createCourse = Q.defer();
                spyOn(createCourseCommand, 'execute').and.returnValue(createCourse.promise);
            });

            it('should be function', function () {
                expect(dialog.createNewCourse).toBeFunction();
            });

            it('should isCourseCreating operation', function() {
                dialog.isCourseCreating(false);

                dialog.createNewCourse();

                expect(dialog.isCourseCreating()).toBeTruthy();
            });

            it('should call command to create course', function() {
                dialog.isCourseCreating(false);

                dialog.createNewCourse();

                expect(createCourseCommand.execute).toHaveBeenCalledWith('Splash pop-up after signup');
            });

            describe('when course is created', function() {

                beforeEach(function() {
                    createCourse.resolve({ id: 'courseId' });
                });

                it('should navigate to created course', function (done) {
                    dialog.createNewCourse().fin(function () {
                        expect(router.navigate).toHaveBeenCalledWith('#course/courseId');
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

            describe('when course is not created', function() {

                beforeEach(function() {
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

});