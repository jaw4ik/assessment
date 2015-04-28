define(['notifications/collaborationInvite/commands/acceptInvite'], function (query) {

    var
        httpWrapper = require('http/httpWrapper')
    ;

    describe('collaboration invite notification command [acceptInvite]', function () {

        describe('execute:', function () {

            var dfd;

            beforeEach(function () {
                dfd = Q.defer();
                spyOn(httpWrapper, 'post').and.returnValue(dfd.promise);
            });

            it('should be function', function () {
                expect(query.execute).toBeFunction();
            });

            it('should return promise', function () {
                expect(query.execute()).toBePromise();
            });

            it('should send request to the server to accept invite', function (done) {
                dfd.resolve(true);

                query.execute().then(function (result) {
                    expect(result).toEqual(true);
                    done();
                });
            });

        });

    });

})