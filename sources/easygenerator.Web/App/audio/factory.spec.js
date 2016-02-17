import factory from './factory';

describe('[audio upload factory]', function () {

    describe('create:', function () {

        it('should be function', function () {
            expect(factory.create).toBeFunction();
        });

        it('should return an instance of UploadAudioModel', function () {
            var model = factory.create({
                name: 'sample.wav'
            });
            expect(model).toBeDefined();
        });

    });

});
