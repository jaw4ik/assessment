define(['viewmodels/courses/course/index'], function (viewModel) {
    "use strict";

    var
        repository = require('repositories/courseRepository'),
        eventTracker = require('eventTracker'),
        notify = require('notify')
    ;

    describe('viewModel [course index]', function () {

        beforeEach(function () {
            spyOn(eventTracker, 'publish');
            spyOn(notify, 'saved');

        });

        it('should be object', function () {
            expect(viewModel).toBeObject();
        });

        describe('router:', function () {
            it('should be object', function () {
                expect(viewModel.router).toBeObject();
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
                        viewModel.title(utils.createString(viewModel.courseTitleMaxLength + 1));
                        expect(viewModel.title.isValid()).toBeFalsy();
                    });

                });

                describe('when title is longer than 255 but after trimming is not longer than 255', function () {

                    it('should be true', function () {
                        viewModel.title('   ' + utils.createString(viewModel.courseTitleMaxLength - 1) + '   ');
                        expect(viewModel.title.isValid()).toBeTruthy();
                    });

                });

                describe('when title is not empty and not longer than 255', function () {

                    it('should be true', function () {
                        viewModel.title(utils.createString(viewModel.courseTitleMaxLength - 1));
                        expect(viewModel.title.isValid()).toBeTruthy();
                    });

                });

            });

            describe('beginEdit:', function () {

                it('should be function', function () {
                    expect(viewModel.title.beginEdit).toBeFunction();
                });

                it('should change isEditing to true', function () {
                    viewModel.title.isEditing(false);

                    viewModel.title.beginEdit();

                    expect(viewModel.title.isEditing()).toBeTruthy();
                });

            });

            describe('endEdit:', function () {

                var update, getById,
                    course = {
                        id: '1',
                        title: 'course',
                        objectives: [],
                        packageUrl: '',
                        createdOn: 'createdOn',
                        createdBy: 'createdBy',
                        modifiedOn: 'modifiedOn',
                        builtOn: 'builtOn',
                    };

                beforeEach(function () {
                    update = Q.defer();
                    getById = Q.defer();

                    spyOn(repository, 'getById').and.returnValue(getById.promise);
                    spyOn(repository, 'updateCourseTitle').and.returnValue(update.promise);
                });

                it('should be function', function () {
                    expect(viewModel.title.endEdit).toBeFunction();
                });

                it('should change isEditing to false', function () {
                    viewModel.title.isEditing(true);

                    viewModel.title.endEdit();

                    expect(viewModel.title.isEditing()).toBeFalsy();
                });


                it('should trim title', function () {
                    viewModel.title('    Some title     ');
                    viewModel.title.endEdit();
                    expect(viewModel.title()).toEqual('Some title');
                });

                describe('when title is not modified', function () {
                    var promise = null;
                    beforeEach(function () {
                        viewModel.title(course.title);
                        promise = getById.promise.finally(function () { });
                        getById.resolve(course);
                    });

                    it('should not send event', function (done) {
                        viewModel.title.endEdit();

                        promise.fin(function () {
                            expect(promise).toBeResolved();
                            expect(eventTracker.publish).not.toHaveBeenCalled();
                            done();
                        });
                    });

                    it('should not show notification', function (done) {
                        viewModel.title.endEdit();

                        promise.fin(function () {
                            expect(promise).toBeResolved();
                            expect(notify.saved).not.toHaveBeenCalled();
                            done();
                        });
                    });

                    it('should not update course in repository', function (done) {
                        viewModel.title.endEdit();

                        promise.fin(function () {
                            expect(promise).toBeResolved();
                            expect(repository.updateCourseTitle).not.toHaveBeenCalled();
                            done();
                        });
                    });
                });

                describe('when title is modified', function () {

                    var getPromise = null, newTitle = course.title + 'test';
                    beforeEach(function () {
                        viewModel.title(newTitle);
                        getPromise = getById.promise.finally(function () { });
                        getById.resolve(course);
                    });

                    it('should send event \'Update course title\'', function (done) {
                        viewModel.title.endEdit();

                        getPromise.fin(function () {
                            expect(getPromise).toBeResolved();
                            expect(eventTracker.publish).toHaveBeenCalledWith('Update course title');
                            done();
                        });
                    });

                    describe('and when title is valid', function () {

                        it('should update course in repository', function (done) {
                            viewModel.title.endEdit();

                            getPromise.fin(function () {
                                expect(getPromise).toBeResolved();
                                expect(repository.updateCourseTitle).toHaveBeenCalled();
                                expect(repository.updateCourseTitle.calls.mostRecent().args[1]).toEqual(newTitle);
                                done();
                            });
                        });

                        describe('and when course updated successfully', function () {

                            it('should update notificaion', function (done) {
                                var promise = update.promise.fin(function () { });
                                update.resolve(new Date());

                                viewModel.title.endEdit();

                                promise.fin(function () {
                                    expect(promise).toBeResolved();
                                    expect(notify.saved).toHaveBeenCalled();
                                    done();
                                });
                            });

                        });

                    });

                    describe('and when title is not valid', function () {

                        it('should revert course title value', function (done) {
                            viewModel.title('');
                            viewModel.title.endEdit();

                            getPromise.fin(function () {
                                expect(viewModel.title()).toBe(course.title);
                                done();
                            });
                        });

                    });
                });
            });
        });

    });
});