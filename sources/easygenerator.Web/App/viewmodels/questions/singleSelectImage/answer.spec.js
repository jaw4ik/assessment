define(function (require) {
    "use strict";

    var ctor = require('viewmodels/questions/singleSelectImage/answer');


    describe('question singleSelectImage [answer]', function () {

        var id = 'id',
            image = 'image';

        it('should be defined', function () {
            expect(ctor).toBeDefined();
        });

        it('should define id', function () {
            var answer = new ctor(id, image);
            expect(answer.id).toBeDefined();
        });

        it('should define image', function () {
            var answer = new ctor(id, image);
            expect(answer.image).toBeObservable();
        });
    });
});