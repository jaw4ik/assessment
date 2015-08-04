define(['viewmodels/audios/commands/factory'], function (factory) {

    describe('[audio upload factory]', function () {

        describe('create:', function () {

            it('should be function', function () {
                expect(factory.create).toBeFunction();
            });

            it('should return an instance of UploadModel', function () {
                var model = factory.create({
                    name: 'sample.wav'
                });
                expect(model).toBeDefined();
            });

        });

    });
})