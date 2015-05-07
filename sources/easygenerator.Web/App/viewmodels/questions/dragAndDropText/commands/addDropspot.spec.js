define(['viewmodels/questions/dragAndDropText/commands/addDropspot'], function (command) {
    var
        apiHttpWrapper = require('http/apiHttpWrapper')
    ;

    describe('command [addDropspot]', function () {

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

            it('should send request to the server to create dropspot', function (done) {
                dfd.resolve();

                command.execute().then(function () {
                    expect(apiHttpWrapper.post).toHaveBeenCalled();
                    done();
                });
            });

        });
    });


});