define(['viewmodels/questions/dragAndDrop/commands/addDropspot'], function (command) {

    describe('command [addDropspot]', function () {

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