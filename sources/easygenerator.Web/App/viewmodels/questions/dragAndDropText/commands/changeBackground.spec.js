define(['viewmodels/questions/dragAndDropText/commands/changeBackground'], function (command) {
    var
        apiHttpWrapper = require('http/apiHttpWrapper')
    ;

    describe('command [changeBackground]', function () {

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

            it('should send request to the server to change background image', function (done) {
                dfd.resolve();

                command.execute().then(function () {
                    expect(apiHttpWrapper.post).toHaveBeenCalled();
                    done();
                });
            });

        });
    });


});