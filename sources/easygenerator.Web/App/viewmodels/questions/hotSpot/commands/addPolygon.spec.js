﻿define(['viewmodels/questions/hotSpot/commands/addPolygon'], function (command) {
    var
        httpWrapper = require('http/httpWrapper')
    ;

    describe('command [addPolygon]', function () {

        describe('execute:', function () {

            var dfd = Q.defer();

            beforeEach(function () {
                spyOn(httpWrapper, 'post').and.returnValue(dfd.promise);
            });

            it('should be function', function () {
                expect(command.execute).toBeFunction();
            });

            it('should return promise', function () {
                expect(command.execute()).toBePromise();
            });

            it('should send request to the server to create polygon', function (done) {
                dfd.resolve();

                command.execute().then(function () {
                    expect(httpWrapper.post).toHaveBeenCalled();
                    done();
                });
            });

        });
    });


});