define(['viewmodels/questions/dragAndDrop/commands/removeDropspot'], function (command) {

    describe('command [removeDropspot]', function () {

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