define(['viewmodels/questions/dragAndDrop/commands/changeBackground'], function (command) {

    describe('command [changeBackground]', function () {

        describe('execute:', function () {

            it('should be function', function () {
                expect(command.execute).toBeFunction();
            });

            it('should return promise', function () {
                expect(command.execute()).toBePromise();
            });

        });
    });


});