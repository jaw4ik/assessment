import command from './updatePolygon';

import apiHttpWrapper from 'http/apiHttpWrapper';

describe('command [updatePolygon]', function () {

    describe('execute:', function () {

        var dfd = Q.defer();

        beforeEach(function () {
            spyOn(apiHttpWrapper, 'post').and.returnValue(dfd.promise);
        });

        it('should be function', function () {
            expect(command.execute).toBeFunction();
        });

        it('should return promise', function () {
            expect(command.execute()).toBePromise();
        });

        it('should send request to the server to change polygon points', function (done) {
            dfd.resolve();

            command.execute().then(function () {
                expect(apiHttpWrapper.post).toHaveBeenCalled();
                done();
            });
        });

    });
});
