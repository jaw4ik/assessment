define(['notifications/collaborationInvite/commands/acceptInvite'], function (query) {

    var
        apiHttpWrapper = require('http/apiHttpWrapper')
    ;

    describe('collaboration invite notification command [acceptInvite]', function () {

        describe('execute:', function () {

            var dfd,
                id = 'id';

            beforeEach(function () {
                dfd = Q.defer();
                spyOn(apiHttpWrapper, 'post').and.returnValue(dfd.promise);
            });

            it('should be function', function () {
                expect(query.execute).toBeFunction();
            });

            it('should return promise', function () {
                expect(query.execute(id)).toBePromise();
            });

            it('should send request to the server to accept invite', function (done) {
                dfd.resolve(true);

                query.execute(id).then(function (result) {
                    expect(result).toEqual(true);
                    done();
                });
            });

        });

    });

})