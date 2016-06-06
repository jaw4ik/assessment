import command from './markAvailable';

import storageHttpWrapper from 'http/storageHttpWrapper';

describe('[audio markAvailable command]', function () {

    it('should be object', function () {
        expect(command).toBeObject();
    });

    describe('execute:', function () {

        var dfd;

        beforeEach(function () {
            dfd = Q.defer();

            spyOn(storageHttpWrapper, 'post').and.returnValue(dfd.promise);
        });

        it('should be function', function () {
            expect(command.execute).toBeFunction();
        });

        it('should return promise', function () {
            expect(command.execute({})).toBePromise();
        });

        it('should send request to mark audio as available', function () {
            command.execute({});
            expect(storageHttpWrapper.post).toHaveBeenCalled();
        });

        describe('when request finished successfully', function () {

            var audio = {};

            beforeEach(function () {
                dfd.resolve();
            });

            it('should mark audio as availble', function(done) {
                command.execute(audio).then(function () {
                    expect(audio.available).toBeTruthy();
                    done();
                }).done();
            });

            it('should resolve promise', function (done) {
                command.execute(audio).then(function () {
                    expect(arguments[0]).toEqual(audio);
                    done();
                }).done();
            });

        });

        describe('when request failed', function () {

            beforeEach(function () {
                dfd.reject('reason');
            });

            it('should reject promise', function (done) {
                command.execute({}).catch(function (reason) {
                    expect(reason).toBeDefined();
                    done();
                }).done();
            });

        });

    });

});
