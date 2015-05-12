define(['notifications/collaborationInvite/commands/declineInvite'], function (query) {

    var
        apiHttpWrapper = require('http/apiHttpWrapper')
    ;

    describe('collaboration invite notification command [acceptInvite]', function () {

        describe('execute:', function () {

            var dfd,
                id = 'id',
                courseId = 'courseId';

            beforeEach(function () {
                dfd = Q.defer();
                spyOn(apiHttpWrapper, 'post').and.returnValue(dfd.promise);
            });

            it('should be function', function () {
                expect(query.execute).toBeFunction();
            });

            it('should return promise', function () {
                expect(query.execute(courseId, id)).toBePromise();
            });

            it('should send request to the server to decline invite', function (done) {
                dfd.resolve(true);

                query.execute(courseId, id).then(function (result) {
                    expect(result).toEqual(true);
                    done();
                });
            });

        });

    });

})