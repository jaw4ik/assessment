define(['notifications/notification'], function (viewModel) {

    var
       app = require('durandal/app'),
       constants = require('constants'),
       subscriptionExpirationController = require('notifications/subscriptionExpiration/notificationController')
    ;

    describe('[notifications]', function () {
        var subscriptionExpirationDefer;
        beforeEach(function () {
            spyOn(app, 'on');
            subscriptionExpirationDefer = Q.defer();
            spyOn(subscriptionExpirationController, 'execute').and.returnValue(subscriptionExpirationDefer.promise);
        });

        it('should be defined', function () {
            expect(viewModel).toBeDefined();
        });

        describe('collection:', function () {

            it('should be observable', function () {
                expect(viewModel.collection).toBeObservable();
            });

        });

        describe('isVisible:', function () {

            it('should be observable', function () {
                expect(viewModel.isVisible).toBeObservable();
            });

            describe('when notifications array does not have any item', function () {

                it('should be false', function () {
                    viewModel.collection([]);
                    expect(viewModel.isVisible()).toBeFalsy();
                });

            });

            describe('when notifications array have any item', function () {

                it('should be true', function () {
                    viewModel.collection([{ name: 'name' }]);
                    expect(viewModel.isVisible()).toBeTruthy();
                });

            });

        });

        describe('activate:', function () {
            it('should return promise', function () {
                expect(viewModel.activate()).toBePromise();
            });

            it('should subscribe on \'notification.remove\' event', function () {
                viewModel.activate();
                expect(app.on).toHaveBeenCalledWith(constants.notification.messages.remove, viewModel.removeNotification);
            });

            it('should subscribe on \'notification.push\' event', function () {
                viewModel.activate();
                expect(app.on).toHaveBeenCalledWith(constants.notification.messages.push, viewModel.pushNotification);
            });

            it('should call controller execute method', function () {
                viewModel.activate();
                expect(subscriptionExpirationController.execute).toHaveBeenCalled();
            });

            it('should call controller execute method', function (done) {
                subscriptionExpirationDefer.resolve();
                var promise = viewModel.activate();
                promise.fin(function () {
                    expect(subscriptionExpirationController.execute).toHaveBeenCalled();
                    done();
                });
            });
        });

        describe('isExpanded:', function () {
            it('should be observable', function () {
                expect(viewModel.isExpanded).toBeObservable();
            });
        });

        describe('toggleIsExpanded:', function () {
            describe('when isExpanded is true', function () {
                beforeEach(function () {
                    viewModel.isExpanded(true);
                });

                it('should set isExpanded false', function () {
                    viewModel.toggleIsExpanded();
                    expect(viewModel.isExpanded()).toBeFalsy();
                });
            });

            describe('when isExpanded is false', function () {
                beforeEach(function () {
                    viewModel.isExpanded(false);
                });

                it('should set isExpanded true', function () {
                    viewModel.toggleIsExpanded();
                    expect(viewModel.isExpanded()).toBeTruthy();
                });
            });
        });

        describe('collapse:', function () {
            it('should set isExpanded false', function () {
                viewModel.isExpanded(true);
                viewModel.toggleIsExpanded();
                expect(viewModel.isExpanded()).toBeFalsy();
            });
        });

        describe('pushNotification:', function () {
            describe('when notification with soecified key is already in collection', function () {
                var key = 'key',
                    oldNotification = { key: key },
                    newNotification = { key: key };

                it('should replace notification', function () {
                    viewModel.collection().length = 0;
                    viewModel.collection.push(oldNotification);
                    viewModel.pushNotification(newNotification);
                    expect(viewModel.collection()[0]).toBe(newNotification);
                    expect(viewModel.collection().length).toBe(1);
                });
            });

            describe('when notification with soecified key is not in collection', function () {
                var key = 'key',
                    newNotification = { key: key };

                it('should replace notification', function () {
                    viewModel.collection().length = 0;
                    viewModel.pushNotification(newNotification);
                    expect(viewModel.collection()[0]).toBe(newNotification);
                    expect(viewModel.collection().length).toBe(1);
                });
            });
                });

        describe('removeNotification:', function () {
            var key = 'key',
                notification = { key: key };

            describe('when notification with such key is in collection', function () {
                beforeEach(function () {
                    viewModel.collection().length = 0;
                    viewModel.collection.push(notification);
            });

                it('should remove notification', function () {
                    viewModel.removeNotification(key);
                    expect(viewModel.collection().length).toBe(0);
                });
            });
        });

    });

});