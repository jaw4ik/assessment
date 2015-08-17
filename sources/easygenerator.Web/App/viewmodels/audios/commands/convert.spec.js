define(['viewmodels/audios/commands/convert'], function (command) {

    describe('[audio convert command]', function () {

        var fileUpload = require('fileUpload');

        describe('execute:', function () {

            var dfd;

            beforeEach(function () {
                dfd = Q.defer();

                spyOn(fileUpload, 'xhr2').and.returnValue(dfd.promise);
            });

            it('should be function', function () {
                expect(command.execute).toBeFunction();
            });

            it('should return promise', function () {
                expect(command.execute()).toBePromise();
            });

            it('should post file to the conversion server', function () {
                command.execute({});
                expect(fileUpload.xhr2).toHaveBeenCalled();
            });

            describe('when conversion finished', function () {

                beforeEach(function () {
                    dfd.resolve([
                    {
                        url: 'url',
                        duration: 1
                    }]);
                });

                it('should resolve promise', function (done) {
                    command.execute({}).then(function (convertedFile) {
                        expect(convertedFile).toBeObject();
                        expect(convertedFile.url).toEqual('url');
                        expect(convertedFile.duration).toEqual(1);
                        done();
                    });
                });

            });

            describe('when conversion failed', function () {

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