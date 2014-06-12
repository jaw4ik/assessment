define(['viewmodels/questions/dragAndDrop/commands/changeDropspotPosition'], function (command) {

    describe('command [changeDropspotPosition]', function () {

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