import query from './getNotAvailable';

import dataContext from 'dataContext';

describe('[audio getNodeAvailable query]', function () {

    describe('execute:', function () {

        it('should be function', function () {
            expect(query.execute).toBeFunction();
        });

        it('should return promise', function () {
            dataContext.audios = [];
            expect(query.execute()).toBePromise();
        });

        it('should resolve promise with not avilable audios', function (done) {
            dataContext.audios = [{ available: true }, { available: false }, { available: false }];

            query.execute().then(function (result) {
                expect(result.length).toEqual(2);
                done();
            }).done();
        });

    });

});
