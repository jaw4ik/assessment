define(['notifications/collaborationInvite/queries/getInvites'], function (query) {

    var
        httpWrapper = require('http/httpWrapper')
    ;

    describe('collaboration invite notification query [getInvites]', function () {

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

            it('should return collaboration invites', function (done) {
                var invites = [
                    {
                        id: 'id'
                    }
                ];
                dfd.resolve(invites);

                query.execute().then(function (result) {
                    expect(result).toEqual(invites);
                    done();
                });
            });

        });

    });

})