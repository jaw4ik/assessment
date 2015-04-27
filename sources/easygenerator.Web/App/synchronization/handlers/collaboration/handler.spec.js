define(['synchronization/handlers/collaboration/handler'], function (handler) {

    describe('synchronization collaboration [handler]', function () {

        describe('started:', function () {
            it('should be function', function () {
                expect(handler.started).toBeFunction();
            });
        });

        describe('collaboratorAdded:', function () {
            it('should be function', function () {
                expect(handler.collaboratorAdded).toBeFunction();
            });

        });

        describe('finished:', function () {
            it('should be function', function () {
                expect(handler.finished).toBeFunction();
            });

        });

        describe('collaboratorRemoved:', function () {
            it('should be function', function () {
                expect(handler.collaboratorRemoved).toBeFunction();
            });

        });

        describe('collaboratorRegistered:', function () {
            it('should be function', function () {
                expect(handler.collaboratorRegistered).toBeFunction();
            });

        });

    });

})