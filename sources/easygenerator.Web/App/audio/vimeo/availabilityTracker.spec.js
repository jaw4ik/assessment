define(['audio/vimeo/availabilityTracker'], function (tracker) {

    describe('[availability tracker]', function () {

        var
            getCollection = require('audio/queries/getNotAvailable'),
            checkAvailability = require('vimeo/queries/checkAvailability'),
            finishUpload = require('audio/finishUpload')

        ;

        it('should be object', function () {
            expect(tracker).toBeObject();
        });


        describe('track:', function () {

            var dfd;

            var
                model1 = { vimeoId: 'vimeoId_1' },
                model2 = { vimeoId: 'vimeoId_2' };

            beforeEach(function () {
                dfd = Q.defer();
                spyOn(getCollection, 'execute').and.returnValue(dfd.promise);
                spyOn(checkAvailability, 'execute').and.callFake(function (param) {
                    var dfd = Q.defer();
                    dfd.resolve(param === model1);
                    return dfd.promise;
                });

                spyOn(finishUpload, 'execute');

            });


            it('should be function', function () {
                expect(tracker.track).toBeFunction();
            });

            it('should return promise', function () {
                expect(tracker.track()).toBePromise();
            });

            it('should check availability for each not available audio', function (done) {
                dfd.resolve([model1, model2]);

                tracker.track().then(function () {
                    expect(checkAvailability.execute.calls.count()).toEqual(2);
                    done();
                }).done();
            });


            describe('when audio became available', function () {

                it('should execute command to finish upload', function (done) {
                    dfd.resolve([model1, model2]);

                    tracker.track().then(function () {
                        expect(finishUpload.execute).toHaveBeenCalledWith(model1);
                        done();
                    }).done();
                });

            });

            describe('when audio is not yet available', function () {

                it('should not execute command to finish upload', function (done) {
                    dfd.resolve([model1, model2]);

                    tracker.track().then(function () {
                        expect(finishUpload.execute).not.toHaveBeenCalledWith(model2);
                        done();
                    }).done();
                });

            });

        });

    });
})