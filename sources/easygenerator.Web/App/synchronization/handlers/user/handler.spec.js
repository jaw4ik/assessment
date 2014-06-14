﻿define(['synchronization/handlers/user/handler'], function (handler) {

    describe('synchronization user [handler]', function () {

        describe('upgradedToStarter:', function () {
            it('should be function', function () {
                expect(handler.upgradedToStarter).toBeFunction();
            });
        });

        describe('downgraded:', function () {
            it('should be function', function () {
                expect(handler.downgraded).toBeFunction();
            });

        });

    });

})