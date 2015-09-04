define(['audio/convertion/commands/convert'], function (command) {

    describe('[convertion convert]', function () {

        var
            fileUpload = require('fileUpload'),
            getTicket = require('audio/convertion/commands/getTicket');

        describe('execute:', function () {

            var xhr2Dfd, getTicketDfd;

            beforeEach(function () {
                getTicketDfd = Q.defer();
                xhr2Dfd = Q.defer();

                spyOn(getTicket, 'execute').and.returnValue(getTicketDfd.promise);
                spyOn(fileUpload, 'xhr2').and.returnValue(xhr2Dfd.promise);
            });

            it('should be function', function () {
                expect(command.execute).toBeFunction();
            });

            it('should return promise', function () {
                expect(command.execute()).toBePromise();
            });

            it('should get ticket to the convertion server', function (done) {
                getTicketDfd.resolve('ticket');
                xhr2Dfd.resolve([{}]);
                command.execute().then(function () {
                    expect(getTicket.execute).toHaveBeenCalled();
                    done();
                }).done();
            });

            describe('when request to get ticked failed', function () {

                beforeEach(function () {
                    getTicketDfd.reject();
                });

                it('should reject promise', function (done) {
                    command.execute().catch(function () {
                        expect(getTicket.execute).toHaveBeenCalled();
                        done();
                    }).done();
                });
            });

            describe('when ticket received', function () {

                beforeEach(function () {
                    getTicketDfd.resolve('ticket');
                });

                it('should post file to the convertion server', function (done) {
                    xhr2Dfd.resolve([{}]);
                    command.execute({}).then(function () {
                        expect(fileUpload.xhr2).toHaveBeenCalled();
                        done();
                    }).done();
                });

                describe('when convertion finished', function () {

                    beforeEach(function () {
                        xhr2Dfd.resolve([{ url: 'url', duration: 1 }]);
                    });

                    it('should resolve promise', function (done) {
                        command.execute({}).then(function (convertedFile) {
                            expect(convertedFile).toBeObject();
                            expect(convertedFile.url).toEqual('url');
                            expect(convertedFile.duration).toEqual(1);
                            done();
                        }).done();
                    });

                });

                describe('when convertion failed', function () {

                    beforeEach(function () {
                        xhr2Dfd.reject();
                    });

                    it('should reject promise', function (done) {
                        command.execute().catch(function () {
                            done();
                        }).done();
                    });

                });
            });

        });

    });
})