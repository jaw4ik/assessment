define(['notifications/notification'], function(notifications) {

    describe('[notifications]', function() {

        it('should be defined', function() {
            expect(notifications).toBeDefined();
        });

        describe('notifications', function() {

            it('should be observable', function() {
                expect(notifications.collection).toBeObservable();
            });

        });

        describe('isVisible:', function() {

            it('should be observable', function() {
                expect(notifications.isVisible).toBeObservable();
            });

            describe('when notifications array does not have any item', function() {

                it('should be false', function() {
                    notifications.collection([]);
                    expect(notifications.isVisible()).toBeFalsy();
                });

            });

            describe('when notifications array have any item', function () {

                it('should be true', function () {
                    notifications.collection([{ name: 'name' }]);
                    expect(notifications.isVisible()).toBeTruthy();
                });

            });

        });

    });

});