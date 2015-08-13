define(['dialogs/course/createCourse/steps/courseTitleStep'], function (viewModel) {
    "use strict";

    var
        constants = require('constants')
    ;

    describe('dialog course step [courseTitleStep]', function () {

        describe('title:', function () {
            it('should be observable', function () {
                expect(viewModel.title).toBeObservable();
            });
        });

        describe('isEditing:', function () {
            it('should be observable', function () {
                expect(viewModel.isEditing).toBeObservable();
            });
        });

        describe('caption:', function () {
            it('should be observable', function () {
                expect(viewModel.caption).toBeObservable();
            });
        });

        describe('isChanged:', function () {
            it('should be observable', function () {
                expect(viewModel.isChanged).toBeObservable();
            });
        });

        describe('isProcessing:', function () {
            it('should be observable', function () {
                expect(viewModel.isProcessing).toBeObservable();
            });
        });

        describe('maxLength:', function () {
            it('should be set', function () {
                expect(viewModel.maxLength).toBe(constants.validation.courseTitleMaxLength);
            });
        });

        describe('isValid:', function () {

            it('should be computed', function () {
                expect(viewModel.isValid).toBeComputed();
            });

            describe('when title is empty', function () {
                it('should be false', function () {
                    viewModel.title('');
                    expect(viewModel.isValid()).toBeFalsy();
                });
            });

            describe('when title is longer than maxLength', function () {
                it('should be false', function () {
                    viewModel.title(utils.createString(viewModel.maxLength + 1));
                    expect(viewModel.isValid()).toBeFalsy();
                });
            });

            describe('when title is longer than maxLength but after trimming is not longer than maxLength', function () {
                it('should be true', function () {
                    viewModel.title('   ' + utils.createString(viewModel.maxLength - 1) + '   ');
                    expect(viewModel.isValid()).toBeTruthy();
                });
            });

            describe('when title is not empty and not longer than maxLength', function () {
                it('should be true', function () {
                    viewModel.title(utils.createString(viewModel.maxLength - 1));
                    expect(viewModel.isValid()).toBeTruthy();
                });
            });
        });

        describe('activate:', function () {
            it('should clear title', function () {
                viewModel.title('title');
                viewModel.activate();
                expect(viewModel.title()).toBe('');
            });

            it('should clear isChanged flag', function () {
                viewModel.isChanged(true);
                viewModel.activate();
                expect(viewModel.isChanged()).toBeFalsy();
            });

            it('should clear isProcessing flag', function () {
                viewModel.isProcessing(true);
                viewModel.activate();
                expect(viewModel.isProcessing()).toBeFalsy();
            });

            it('should subscribe on title changed', function () {
                var subscription = {};
                spyOn(viewModel.title, 'subscribe').and.returnValue(subscription);
                viewModel.activate();
                expect(viewModel.titleSubscription).toBe(subscription);
            });
        });

        describe('deactivate:', function () {
            describe('when title subscription is defined', function () {
                it('should dispose title subscription', function () {
                    var subscription = { dispose: function () { } };
                    spyOn(subscription, 'dispose');
                    viewModel.titleSubscription = subscription;
                    viewModel.deactivate();
                    expect(viewModel.titleSubscription.dispose).toHaveBeenCalled();
                });
            });
        });

        describe('submit:', function () {
            beforeEach(function () {
                spyOn(viewModel, 'trigger');
            });

            describe('when title is not valid', function () {
                beforeEach(function () {
                    viewModel.title('');
                });

                it('should mark as changed', function () {
                    viewModel.isChanged(false);
                    viewModel.submit();
                    expect(viewModel.isChanged()).toBeTruthy();
                });
            });

            describe('when title is valid', function () {
                it('should trim title', function () {
                    var title = '    title    ';
                    viewModel.title(title);
                    viewModel.submit();
                    expect(viewModel.title()).toBe(title.trim());
                });

                it('should trigger stepSubmitted event', function () {
                    viewModel.title('title');
                    viewModel.submit();
                    expect(viewModel.trigger).toHaveBeenCalledWith(constants.dialogs.stepSubmitted);
                });
            });
        });

        describe('beginEdit:', function () {
            it('should set isEditing to true', function () {
                viewModel.isEditing(false);
                viewModel.beginEdit();
                expect(viewModel.isEditing()).toBeTruthy();
            });
        });

        describe('endEdit:', function () {
            it('should set isEditing to false', function () {
                viewModel.isEditing(true);
                viewModel.endEdit();
                expect(viewModel.isEditing()).toBeFalsy();
            });
        });

        describe('titleChanged:', function () {
            it('should set titleChanged to false', function () {
                viewModel.titleChanged(true);
                viewModel.endEdit();
                expect(viewModel.titleChanged()).toBeFalsy();
            });
        });
    });

});
