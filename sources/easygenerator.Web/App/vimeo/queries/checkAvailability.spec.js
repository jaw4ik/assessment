define(['vimeo/queries/checkAvailability'], function (task) {

    describe('[check video availability]', function () {

        var getVideo = require('vimeo/queries/getVideo');

        it('should be object', function () {
            expect(task).toBeObject();
        });

        describe('execute:', function () {

            var dfd;

            beforeEach(function () {
                dfd = Q.defer();
                spyOn(getVideo, 'execute').and.returnValue(dfd.promise);
            });

            it('should be function', function () {
                expect(task.execute).toBeFunction();
            });

            it('should return promise', function () {
                expect(task.execute({})).toBePromise();
            });

            it('should send request to get video metadata', function () {
                task.execute({});
                expect(getVideo.execute).toHaveBeenCalled();
            });


            describe('when request is successful', function () {

                describe('and video is available', function () {
                    beforeEach(function () {
                        dfd.resolve({
                            status: 'available'
                        });
                    });

                    it('should resolve promise with true', function (done) {
                        task.execute({}).then(function (result) {
                            expect(result).toBeTruthy();
                            done();
                        }).done();
                    });
                });

                describe('and video is not available', function () {
                    beforeEach(function () {
                        dfd.resolve({
                            status: 'available'
                        });
                    });

                    it('should resolve promise with false', function (done) {
                        task.execute({}).then(function (result) {
                            expect(result).toBeTruthy();
                            done();
                        }).done();
                    });
                });

            });

            describe('when request failed', function () {

                beforeEach(function () {
                    dfd.reject();
                });

                it('should reject promise', function (done) {
                    task.execute({}).catch(function () {
                        done();
                    }).done();
                });

            });

        });

    });

})