import command from './getTicket';

import httpWrapper from 'http/storageHttpWrapper';

describe('[convertion getTicket]', function () {

    it('should be object', function () {
        expect(command).toBeObject();
    });

    describe('execute:', function () {

        var dfd;

        beforeEach(function () {
            dfd = Q.defer();
            spyOn(httpWrapper, 'post').and.returnValue(dfd.promise);
        });

        it('should be function', function () {
            expect(command.execute).toBeFunction();
        });

        it('should return promise', function () {
            expect(command.execute()).toBePromise();
        });

        it('should send request to get ticket', function () {
            command.execute();
            expect(httpWrapper.post).toHaveBeenCalled();
        });

        describe('when request failed', function() {

            beforeEach(function() {
                dfd.reject('reason');
            });

            it('should reject promise', function (done) {
                command.execute().catch(function(reason) {
                    expect(reason).toBeDefined();
                    done();
                }).done();
            });

        });

        describe('when request finished successfully', function() {

            beforeEach(function () {
                dfd.resolve({});
            });

            it('should resolve promise', function(done) {
                command.execute().then(function (result) {
                    expect(result).toEqual({});
                    done();
                }).done();
            });
        });

    });

});
