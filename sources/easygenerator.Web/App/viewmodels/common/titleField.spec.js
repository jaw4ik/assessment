define(function (require) {
    "use strict";

    var
        ctor = require('viewmodels/common/titleField'),
        notify = require('notify');

    describe('viewModel [titleField]', function () {

        var viewModel,
            title = 'title',
            maxLength = 255,
            caption = 'caption',
            getTitleDefer = Q.defer(),
            updateTitleDefer = Q.defer(),
            handlers = {
                updateTitle: null,
                getTitle: null
            };

        beforeEach(function () {
            spyOn(notify, 'saved');
            spyOn(handlers, "getTitle").and.callFake(function () {
                return getTitleDefer.promise;
            });
            spyOn(handlers, "updateTitle").and.callFake(function () {
                return updateTitleDefer.promise;
            });
            viewModel = ctor(title, maxLength, caption, handlers.getTitle, handlers.updateTitle);
        });

        describe('title:', function () {
            it('should be observable', function () {
                expect(viewModel.title).toBeObservable();
            });

            it('should be set', function () {
                expect(viewModel.title()).toBe(title);
            });
        });

        describe('maxLength:', function () {
            it('should be set', function () {
                expect(viewModel.maxLength).toBe(maxLength);
            });
        });

        describe('isValid:', function () {

            it('should be computed', function () {
                expect(viewModel.isValid).toBeComputed();
            });

            describe('when title is longer than 255', function () {

                it('should be false', function () {
                    viewModel.title(utils.createString(maxLength + 1));
                    expect(viewModel.isValid()).toBeFalsy();
                });

            });

            describe('when title is longer than 255 but after trimming is not longer than 255', function () {

                it('should be true', function () {
                    viewModel.title('   ' + utils.createString(maxLength - 1) + '   ');
                    expect(viewModel.isValid()).toBeTruthy();
                });

            });

            describe('when title is not empty and not longer than 255', function () {

                it('should be true', function () {
                    viewModel.title(utils.createString(maxLength - 1));
                    expect(viewModel.isValid()).toBeTruthy();
                });

            });

        });

        describe('isEditing:', function () {

            it('should be observable', function () {
                expect(viewModel.isEditing).toBeObservable();
            });

        });

        describe('isSelected:', function () {

            it('should be observable', function () {
                expect(viewModel.isSelected).toBeObservable();
            });

        });

        describe('beginEdit:', function () {

            it('should be function', function () {
                expect(viewModel.beginEdit).toBeFunction();
            });

            it('should change isEditing to true', function () {
                viewModel.isEditing(false);

                viewModel.beginEdit();

                expect(viewModel.isEditing()).toBeTruthy();
            });

        });

        describe('endEdit:', function () {

            it('should change isEditing to false', function () {
                viewModel.isEditing(true);

                viewModel.endEdit();

                expect(viewModel.isEditing()).toBeFalsy();
            });


            it('should trim title', function () {
                viewModel.title('    Some title     ');
                viewModel.endEdit();
                expect(viewModel.title()).toEqual('Some title');
            });

            describe('when title is not modified', function () {
                var promise = null;
                beforeEach(function () {
                    viewModel.title(title);
                    promise = getTitleDefer.promise.fin(function () { });
                    getTitleDefer.resolve(title);
                });

                it('should not show notification', function (done) {
                    viewModel.endEdit();

                    promise.fin(function () {
                        expect(notify.saved).not.toHaveBeenCalled();
                        done();
                    });
                });

                it('should not update title', function (done) {
                    viewModel.endEdit();

                    promise.fin(function () {
                        expect(handlers.updateTitle).not.toHaveBeenCalled();
                        done();
                    });
                });
            });

            describe('when title is modified', function () {

                var newTitle = title + 'test', promise;
                beforeEach(function () {
                    viewModel.title(newTitle);
                    promise = getTitleDefer.promise.fin(function () { });
                    getTitleDefer.resolve(title);
                });

                describe('and when title is valid', function () {

                    it('should update title', function (done) {
                        viewModel.endEdit();

                        promise.fin(function () {
                            expect(handlers.updateTitle).toHaveBeenCalled();
                            expect(handlers.updateTitle.calls.mostRecent().args[0]).toEqual(newTitle);
                            done();
                        });
                    });

                    describe('and when title successfully', function () {

                        it('should update notificaion', function (done) {
                            var updatePromise = updateTitleDefer.promise.fin(function () { });
                            updateTitleDefer.resolve();

                            viewModel.endEdit();

                            updatePromise.fin(function () {
                                expect(notify.saved).toHaveBeenCalled();
                                done();
                            });
                        });

                    });

                });

                describe('and when title is not valid', function () {

                    it('should revert title value', function (done) {
                        viewModel.title('');
                        viewModel.endEdit();

                        promise.fin(function () {
                            expect(viewModel.title()).toBe(title);
                            done();
                        });
                    });

                });
            });
        });


    });

});