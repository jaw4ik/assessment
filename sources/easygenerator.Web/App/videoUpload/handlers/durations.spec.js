import durationsHandler from './durations';

import vimeoCommands from './../commands/vimeo';

describe('[durationsHandler]', function () {

    it('should be object', function () {
        expect(durationsHandler).toBeObject();
    });

    describe('getVideoDurations:', function () {
        var defer;

        beforeEach(function () {
            defer = Q.defer();
            spyOn(vimeoCommands, 'getVideoDuration').and.returnValue(defer.promise);
        });

        it('should be function', function () {
            expect(durationsHandler.getVideoDurations).toBeFunction();
        });

        it('should return promise', function () {
            expect(durationsHandler.getVideoDurations()).toBePromise();
        });

        it('should load durations for videos', function (done) {
            var videos = [{ vimeoId: 1 }];

            defer.resolve(10);
            var promise = durationsHandler.getVideoDurations(videos);
            promise.fin(function () {
                expect(videos[0].duration).toBe(10);
                done();
            });

        });

    });

});
