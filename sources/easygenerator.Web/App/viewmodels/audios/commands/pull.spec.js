define(['viewmodels/audios/commands/pull'], function (command) {

    describe('[audio pull command]', function () {

        var storageHttpWrapper = require('http/storageHttpWrapper');

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
                expect(command.execute()).toBePromise();
            });

            it('should post pull url to the storage', function () {
                command.execute({});
                expect(storageHttpWrapper.post).toHaveBeenCalled();
            });

            describe('when pull finished', function () {

                var entity;

                beforeEach(function () {
                    entity = {};
                    dfd.resolve(entity);
                });

                it('should resolve promise', function (done) {
                    command.execute().then(function (item) {
                        expect(item).toEqual(entity);
                        done();
                    });
                });

            });

            describe('when pull failed', function () {

                beforeEach(function () {
                    dfd.reject();
                });

                it('should reject promise', function (done) {
                    command.execute().catch(function () {
                        done();
                    });
                });

            });

        });

    });
})